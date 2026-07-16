import { eq } from "drizzle-orm";
import { llmDailyUsage } from "../../drizzle/schema";
import { getDb } from "../db";
import { ENV } from "./env";

export const DEFAULT_LLM_DAILY_MAX_CALLS = 200;

export type LlmBudgetReservation = {
  allowed: boolean;
  used: number;
  limit: number;
  dateKey: string;
  resetAt: string;
  storage: "database" | "memory";
};

export type LlmDailyLimitDegradation = {
  code: "LLM_DAILY_LIMIT";
  source: "daily_limit";
  message: string;
  retryAt: string;
  dailyLimit: number;
};

type DatabaseProvider = () => Promise<Awaited<ReturnType<typeof getDb>>>;

type ReserveLlmCallOptions = {
  now?: Date;
  dailyMaxCalls?: number;
  getDatabase?: DatabaseProvider;
};

const memoryUsage = new Map<string, number>();
let warnedAboutDatabaseFallback = false;

export function resolveLlmDailyMaxCalls(
  rawValue: string = ENV.llmDailyMaxCalls
): number {
  if (!/^\d+$/.test(rawValue.trim())) {
    return DEFAULT_LLM_DAILY_MAX_CALLS;
  }

  const parsed = Number(rawValue);
  return Number.isSafeInteger(parsed)
    ? parsed
    : DEFAULT_LLM_DAILY_MAX_CALLS;
}

function utcDateKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function nextUtcDate(dateKey: string): string {
  const next = new Date(`${dateKey}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString();
}

function reserveInMemory(
  dateKey: string,
  limit: number,
  resetAt: string
): LlmBudgetReservation {
  const used = memoryUsage.get(dateKey) ?? 0;
  if (used >= limit) {
    return {
      allowed: false,
      used,
      limit,
      dateKey,
      resetAt,
      storage: "memory",
    };
  }

  const nextUsed = used + 1;
  memoryUsage.set(dateKey, nextUsed);
  memoryUsage.forEach((_value, key) => {
    if (key !== dateKey) memoryUsage.delete(key);
  });

  return {
    allowed: true,
    used: nextUsed,
    limit,
    dateKey,
    resetAt,
    storage: "memory",
  };
}

export async function reserveLlmCall(
  options: ReserveLlmCallOptions = {}
): Promise<LlmBudgetReservation> {
  const now = options.now ?? new Date();
  const dateKey = utcDateKey(now);
  const resetAt = nextUtcDate(dateKey);
  const limit =
    options.dailyMaxCalls ?? resolveLlmDailyMaxCalls(ENV.llmDailyMaxCalls);

  if (limit <= 0) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      dateKey,
      resetAt,
      storage: "memory",
    };
  }

  const getDatabase = options.getDatabase ?? getDb;
  const db = await getDatabase();
  if (!db) {
    return reserveInMemory(dateKey, limit, resetAt);
  }

  try {
    await db
      .insert(llmDailyUsage)
      .values({ dateKey, usedCount: 0 })
      .onDuplicateKeyUpdate({ set: { dateKey } });

    return await db.transaction(async transaction => {
      const [current] = await transaction
        .select({ usedCount: llmDailyUsage.usedCount })
        .from(llmDailyUsage)
        .where(eq(llmDailyUsage.dateKey, dateKey))
        .for("update");

      if (!current) {
        throw new Error("LLM daily usage row was not created");
      }

      if (current.usedCount >= limit) {
        return {
          allowed: false,
          used: current.usedCount,
          limit,
          dateKey,
          resetAt,
          storage: "database" as const,
        };
      }

      const used = current.usedCount + 1;
      await transaction
        .update(llmDailyUsage)
        .set({ usedCount: used })
        .where(eq(llmDailyUsage.dateKey, dateKey));

      return {
        allowed: true,
        used,
        limit,
        dateKey,
        resetAt,
        storage: "database" as const,
      };
    });
  } catch (error) {
    if (!warnedAboutDatabaseFallback) {
      console.warn(
        "[LLM Budget] Database persistence unavailable; using process memory until restart.",
        error
      );
      warnedAboutDatabaseFallback = true;
    }
    return reserveInMemory(dateKey, limit, resetAt);
  }
}

export function buildLlmDailyLimitDegradation(
  language: "zh" | "en",
  reservation: LlmBudgetReservation
): LlmDailyLimitDegradation {
  const message =
    language === "en"
      ? "Today's AI interpretation quota has been reached. You can still view the basic calculated result; please return tomorrow. This attempt does not consume your usage allowance."
      : "今日 AI 解读额度已用完。基础计算结果仍可查看，请明日再来；本次不会消耗你的使用额度。";

  return {
    code: "LLM_DAILY_LIMIT",
    source: "daily_limit",
    message,
    retryAt: reservation.resetAt,
    dailyLimit: reservation.limit,
  };
}

export function resetLlmBudgetMemoryForTests(): void {
  memoryUsage.clear();
  warnedAboutDatabaseFallback = false;
}
