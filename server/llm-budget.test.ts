import { beforeEach, describe, expect, it } from "vitest";
import {
  buildLlmDailyLimitDegradation,
  reserveLlmCall,
  resetLlmBudgetMemoryForTests,
  resolveLlmDailyMaxCalls,
} from "./_core/llmBudget";

describe("LLM daily budget", () => {
  beforeEach(() => {
    resetLlmBudgetMemoryForTests();
  });

  it("uses a safe default for missing or invalid configuration", () => {
    expect(resolveLlmDailyMaxCalls("")).toBe(200);
    expect(resolveLlmDailyMaxCalls("not-a-number")).toBe(200);
    expect(resolveLlmDailyMaxCalls("-1")).toBe(200);
    expect(resolveLlmDailyMaxCalls("25")).toBe(25);
  });

  it("allows only the configured number of calls per UTC day in memory fallback", async () => {
    const options = {
      now: new Date("2026-07-16T08:00:00.000Z"),
      dailyMaxCalls: 2,
      getDatabase: async () => null,
    };

    await expect(reserveLlmCall(options)).resolves.toMatchObject({
      allowed: true,
      used: 1,
      storage: "memory",
    });
    await expect(reserveLlmCall(options)).resolves.toMatchObject({
      allowed: true,
      used: 2,
      storage: "memory",
    });
    await expect(reserveLlmCall(options)).resolves.toMatchObject({
      allowed: false,
      used: 2,
      storage: "memory",
    });
  });

  it("resets the fallback counter on the next UTC date", async () => {
    const getDatabase = async () => null;

    await reserveLlmCall({
      now: new Date("2026-07-16T23:59:59.000Z"),
      dailyMaxCalls: 1,
      getDatabase,
    });
    await expect(
      reserveLlmCall({
        now: new Date("2026-07-17T00:00:00.000Z"),
        dailyMaxCalls: 1,
        getDatabase,
      })
    ).resolves.toMatchObject({ allowed: true, used: 1 });
  });

  it("builds honest bilingual degradation messages", () => {
    const reservation = {
      allowed: false as const,
      used: 200,
      limit: 200,
      dateKey: "2026-07-16",
      resetAt: "2026-07-17T00:00:00.000Z",
      storage: "memory" as const,
    };

    expect(buildLlmDailyLimitDegradation("zh", reservation).message).toContain(
      "今日 AI 解读额度已用完"
    );
    expect(buildLlmDailyLimitDegradation("en", reservation).message).toContain(
      "Today's AI interpretation quota has been reached"
    );
  });
});
