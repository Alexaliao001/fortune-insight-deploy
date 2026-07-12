import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<{ isNew: boolean }> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return { isNew: false };
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // Check if user already exists to detect new registrations
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.openId, user.openId)).limit(1);
    const isNew = existing.length === 0;
    
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
    return { isNew };
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// === 使用次数追踪 & 购买凭证 ===

import { usageTracking, purchaseCredits, memberships } from "../drizzle/schema";
import { and, sql, like, desc } from "drizzle-orm";
import { FREE_LIMITS, FeatureType } from "./products";

import {
  DEFAULT_SIGNUP_TRIAL_DAYS,
  resolveSignupTrialDays,
} from "./trialPolicy";

/** @deprecated Prefer resolveSignupTrialDays(); kept as default constant for callers */
export const SIGNUP_TRIAL_DAYS = DEFAULT_SIGNUP_TRIAL_DAYS;
export const SIGNUP_TRIAL_PAYMENT_METHOD = "trial:signup";
export { resolveSignupTrialDays, DEFAULT_SIGNUP_TRIAL_DAYS };

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // "2026-02-06"
}

function getMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // "2026-02"
}

/**
 * One-time unlimited trial for registered users (length from SIGNUP_TRIAL_DAYS env, default 14).
 * SIGNUP_TRIAL_DAYS=0 disables auto-grant (FREE_LIMITS only).
 * After expiry → normal free limits + paid membership.
 * Idempotent: never re-grants if user already had a trial or active paid plan.
 */
export async function grantSignupTrialIfNeeded(userId: number): Promise<{
  granted: boolean;
  endDate?: Date;
  trialDays?: number;
}> {
  const db = await getDb();
  if (!db) return { granted: false };

  const trialDays = resolveSignupTrialDays();
  if (trialDays <= 0) {
    return { granted: false, trialDays: 0 };
  }

  try {
    // Already has active (non-expired) membership
    if (await hasActiveMembership(userId)) {
      return { granted: false, trialDays };
    }

    // Already used signup trial once (even if expired)
    const [priorTrial] = await db
      .select({ id: memberships.id })
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          like(memberships.paymentMethod, "trial:%")
        )
      )
      .limit(1);

    if (priorTrial) {
      return { granted: false, trialDays };
    }

    // Any historical paid / gift membership also means no free trial re-issue
    // (user already experienced paid path or comp)
    const [anyMembership] = await db
      .select({ id: memberships.id, paymentMethod: memberships.paymentMethod })
      .from(memberships)
      .where(eq(memberships.userId, userId))
      .limit(1);

    // If they only had non-trial memberships that are cancelled/expired without trial,
    // still don't auto-regrant unlimited — trial is for first-time accounts only.
    if (anyMembership) {
      return { granted: false, trialDays };
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + trialDays);

    await db.insert(memberships).values({
      userId,
      type: "monthly", // enum only has monthly/yearly/lifetime; UI detects trial via paymentMethod
      status: "active",
      startDate: now,
      endDate,
      price: "0.00",
      charityAmount: "0.00",
      paymentMethod: SIGNUP_TRIAL_PAYMENT_METHOD,
      transactionId: `trial_${userId}_${now.getTime()}`,
      autoRenew: false,
    });

    return { granted: true, endDate, trialDays };
  } catch (error) {
    console.error("[Trial] Failed to grant signup trial:", error);
    return { granted: false, trialDays };
  }
}

/**
 * 检查用户是否有活跃会员
 */
export async function hasActiveMembership(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [membership] = await db
    .select()
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, userId),
        eq(memberships.status, "active")
      )
    )
    .orderBy(desc(memberships.createdAt))
    .limit(1);

  if (!membership) return false;

  // 检查是否过期 → 标 expired，之后走免费额度
  if (membership.endDate && new Date(membership.endDate) < new Date()) {
    await db
      .update(memberships)
      .set({ status: "expired", autoRenew: false })
      .where(eq(memberships.id, membership.id));
    return false;
  }

  return true;
}

/**
 * 获取用户某功能的使用情况（免费次数 + 购买凭证）
 */
export async function getUsageStatus(userId: number, featureType: FeatureType) {
  type PurchaseFeature = "tarot" | "bazi" | "dream" | "compatibility";
  const db = await getDb();
  if (!db) return { canUse: true, freeRemaining: 999, paidCredits: 0, isMember: false };

  // 1. 检查会员状态
  const isMember = await hasActiveMembership(userId);
  if (isMember) {
    return { canUse: true, freeRemaining: -1, paidCredits: 0, isMember: true };
  }

  const limits = FREE_LIMITS[featureType];

  // 无限免费功能
  if (limits.count === -1) {
    return { canUse: true, freeRemaining: -1, paidCredits: 0, isMember: false };
  }

  // 2. 检查免费次数
  const periodKey = limits.period === "daily" ? getTodayKey() : getMonthKey();
  const [usage] = await db
    .select()
    .from(usageTracking)
    .where(
      and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.featureType, featureType),
        eq(usageTracking.periodType, limits.period),
        eq(usageTracking.periodKey, periodKey)
      )
    )
    .limit(1);

  const usedCount = usage?.usedCount ?? 0;
  const freeRemaining = Math.max(0, limits.count - usedCount);

  // 3. 检查购买凭证
  const credits = await db
    .select()
    .from(purchaseCredits)
    .where(
      and(
        eq(purchaseCredits.userId, userId),
        eq(purchaseCredits.featureType, featureType as PurchaseFeature),
        eq(purchaseCredits.status, "active")
      )
    );

  const paidCredits = credits.reduce((sum, c) => sum + (c.credits - c.usedCredits), 0);

  return {
    canUse: freeRemaining > 0 || paidCredits > 0,
    freeRemaining,
    paidCredits,
    isMember: false,
  };
}

/**
 * 消耗一次使用次数（优先消耗免费次数，然后消耗购买凭证）
 */
export async function consumeUsage(userId: number, featureType: FeatureType): Promise<{ consumed: boolean; source: "free" | "paid" | "member" }> {
  const db = await getDb();
  if (!db) return { consumed: true, source: "free" };

  // 1. 会员无限使用
  const isMember = await hasActiveMembership(userId);
  if (isMember) {
    return { consumed: true, source: "member" };
  }

  const limits = FREE_LIMITS[featureType];

  // 无限免费
  if (limits.count === -1) {
    return { consumed: true, source: "free" };
  }

  // 2. 尝试消耗免费次数
  const periodKey = limits.period === "daily" ? getTodayKey() : getMonthKey();
  const [usage] = await db
    .select()
    .from(usageTracking)
    .where(
      and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.featureType, featureType),
        eq(usageTracking.periodType, limits.period),
        eq(usageTracking.periodKey, periodKey)
      )
    )
    .limit(1);

  const usedCount = usage?.usedCount ?? 0;

  if (usedCount < limits.count) {
    // 还有免费次数
    if (usage) {
      await db
        .update(usageTracking)
        .set({ usedCount: sql`${usageTracking.usedCount} + 1` })
        .where(eq(usageTracking.id, usage.id));
    } else {
      await db.insert(usageTracking).values({
        userId,
        featureType,
        usedCount: 1,
        periodType: limits.period,
        periodKey,
      });
    }
    return { consumed: true, source: "free" };
  }

  // 3. 尝试消耗购买凭证
  type PurchaseFeatureType = "tarot" | "bazi" | "dream" | "compatibility";
  const [credit] = await db
    .select()
    .from(purchaseCredits)
    .where(
      and(
        eq(purchaseCredits.userId, userId),
        eq(purchaseCredits.featureType, featureType as PurchaseFeatureType),
        eq(purchaseCredits.status, "active")
      )
    )
    .orderBy(purchaseCredits.createdAt)
    .limit(1);

  if (credit && credit.usedCredits < credit.credits) {
    const newUsed = credit.usedCredits + 1;
    await db
      .update(purchaseCredits)
      .set({
        usedCredits: newUsed,
        status: newUsed >= credit.credits ? "exhausted" : "active",
      })
      .where(eq(purchaseCredits.id, credit.id));
    return { consumed: true, source: "paid" };
  }

  return { consumed: false, source: "free" };
}

/**
 * 为用户添加购买凭证
 */
export async function addPurchaseCredits(
  userId: number,
  featureType: string,
  credits: number,
  stripeSessionId: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(purchaseCredits).values({
    userId,
    featureType: featureType as "tarot" | "bazi" | "dream" | "compatibility",
    credits,
    usedCredits: 0,
    stripeSessionId,
    status: "active",
  });
}


// === 报告持久化存储 ===

import { savedReports, InsertSavedReport } from "../drizzle/schema";

/**
 * 保存报告到数据库
 */
export async function saveReport(report: {
  userId: number;
  reportType: "tarot" | "bazi" | "horoscope" | "dream";
  title: string;
  inputSummary?: string;
  reportData: unknown;
  aiInterpretation?: string;
  isPaid?: boolean;
}): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(savedReports).values({
      userId: report.userId,
      reportType: report.reportType,
      title: report.title,
      inputSummary: report.inputSummary ?? null,
      reportData: report.reportData,
      aiInterpretation: report.aiInterpretation ?? null,
      isPaid: report.isPaid ?? false,
    });
    return result[0].insertId;
  } catch (error) {
    console.error("[Database] Failed to save report:", error);
    return null;
  }
}

/**
 * 获取用户的历史报告列表
 */
export async function getUserReports(
  userId: number,
  options?: {
    reportType?: "tarot" | "bazi" | "horoscope" | "dream";
    limit?: number;
    offset?: number;
    favoritesOnly?: boolean;
  }
): Promise<{ reports: typeof savedReports.$inferSelect[]; total: number }> {
  const db = await getDb();
  if (!db) return { reports: [], total: 0 };

  const conditions = [eq(savedReports.userId, userId)];
  if (options?.reportType) {
    conditions.push(eq(savedReports.reportType, options.reportType));
  }
  if (options?.favoritesOnly) {
    conditions.push(eq(savedReports.isFavorite, true));
  }

  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

  const [reports, countResult] = await Promise.all([
    db
      .select()
      .from(savedReports)
      .where(whereClause!)
      .orderBy(desc(savedReports.createdAt))
      .limit(options?.limit ?? 20)
      .offset(options?.offset ?? 0),
    db
      .select({ count: sql<number>`count(*)` })
      .from(savedReports)
      .where(whereClause!),
  ]);

  return { reports, total: countResult[0]?.count ?? 0 };
}

/**
 * 获取单个报告详情
 */
export async function getReportById(reportId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [report] = await db
    .select()
    .from(savedReports)
    .where(and(eq(savedReports.id, reportId), eq(savedReports.userId, userId)))
    .limit(1);

  return report ?? null;
}

/**
 * 切换报告收藏状态
 */
export async function toggleReportFavorite(reportId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const report = await getReportById(reportId, userId);
  if (!report) return false;

  await db
    .update(savedReports)
    .set({ isFavorite: !report.isFavorite })
    .where(eq(savedReports.id, reportId));

  return !report.isFavorite;
}

/**
 * 删除报告
 */
export async function deleteReport(reportId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .delete(savedReports)
    .where(and(eq(savedReports.id, reportId), eq(savedReports.userId, userId)));

  return (result[0] as any).affectedRows > 0;
}
