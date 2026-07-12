import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  accessCodes,
  accessCodeRedemptions,
  memberships,
} from "../../drizzle/schema";
import { createNotification } from "./notification";

/** Default friend beta code — also shown in invite copy */
export const DEFAULT_FRIEND_CODE = "FRIEND2026";
const DEFAULT_MAX_USES = 30;

let tablesReady = false;

/** Ensure tables exist even if Manus deploy skipped migrations */
export async function ensureAccessCodeTables() {
  if (tablesReady) return;
  const db = await getDb();
  if (!db) return;

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS access_codes (
      id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
      code varchar(40) NOT NULL,
      label varchar(100),
      membershipType enum('monthly','yearly','lifetime') NOT NULL DEFAULT 'lifetime',
      maxUses int NOT NULL DEFAULT 30,
      usedCount int NOT NULL DEFAULT 0,
      status enum('active','disabled','exhausted') NOT NULL DEFAULT 'active',
      expiresAt timestamp NULL,
      createdBy int NULL,
      note varchar(200),
      createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY access_codes_code_unique (code)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS access_code_redemptions (
      id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
      codeId int NOT NULL,
      code varchar(40) NOT NULL,
      userId int NOT NULL,
      membershipType enum('monthly','yearly','lifetime') NOT NULL,
      createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_redemption_user_code (userId, codeId)
    )
  `);

  // Seed default friend code if missing
  const [existing] = await db
    .select({ id: accessCodes.id })
    .from(accessCodes)
    .where(eq(accessCodes.code, DEFAULT_FRIEND_CODE))
    .limit(1);

  if (!existing) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 90); // 90-day code window
    await db.insert(accessCodes).values({
      code: DEFAULT_FRIEND_CODE,
      label: "Friend beta",
      membershipType: "lifetime",
      maxUses: DEFAULT_MAX_USES,
      usedCount: 0,
      status: "active",
      expiresAt: expires,
      note: "auto-seeded for friend testing",
    });
  }

  tablesReady = true;
}

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

function membershipEndDate(type: "monthly" | "yearly" | "lifetime"): Date | null {
  if (type === "lifetime") return null;
  const end = new Date();
  if (type === "monthly") end.setMonth(end.getMonth() + 1);
  else end.setFullYear(end.getFullYear() + 1);
  return end;
}

function typeLabel(type: string, zh = false) {
  if (type === "lifetime") return zh ? "终身会员" : "lifetime";
  if (type === "yearly") return zh ? "年度会员" : "yearly";
  return zh ? "月度会员" : "monthly";
}

async function activateMembership(
  userId: number,
  type: "monthly" | "yearly" | "lifetime",
  paymentMethod: string,
  transactionId: string
) {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

  // Cancel existing active memberships
  await db
    .update(memberships)
    .set({ status: "cancelled", autoRenew: false })
    .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")));

  const now = new Date();
  await db.insert(memberships).values({
    userId,
    type,
    status: "active",
    startDate: now,
    endDate: membershipEndDate(type),
    price: "0.00",
    charityAmount: "0.00",
    paymentMethod,
    transactionId,
    autoRenew: false,
  });
}

export const accessCodeRouter = router({
  /** Public: validate code shape / remaining slots (no auth required for UX) */
  preview: publicProcedure
    .input(z.object({ code: z.string().min(3).max(40) }))
    .query(async ({ input }) => {
      await ensureAccessCodeTables();
      const db = await getDb();
      if (!db) return { valid: false, reason: "unavailable" as const };

      const code = normalizeCode(input.code);
      const [row] = await db
        .select()
        .from(accessCodes)
        .where(eq(accessCodes.code, code))
        .limit(1);

      if (!row) return { valid: false, reason: "not_found" as const };
      if (row.status === "disabled") return { valid: false, reason: "disabled" as const };
      if (row.status === "exhausted" || row.usedCount >= row.maxUses) {
        return { valid: false, reason: "exhausted" as const };
      }
      if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
        return { valid: false, reason: "expired" as const };
      }

      return {
        valid: true,
        reason: "ok" as const,
        membershipType: row.membershipType,
        remaining: Math.max(0, row.maxUses - row.usedCount),
        label: row.label,
      };
    }),

  /** Redeem after login → lifetime (or configured) membership */
  redeem: protectedProcedure
    .input(z.object({ code: z.string().min(3).max(40) }))
    .mutation(async ({ ctx, input }) => {
      await ensureAccessCodeTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const code = normalizeCode(input.code);
      const [row] = await db
        .select()
        .from(accessCodes)
        .where(eq(accessCodes.code, code))
        .limit(1);

      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid code / 兑换码无效" });
      }
      if (row.status === "disabled") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This code is disabled / 兑换码已停用" });
      }
      if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This code has expired / 兑换码已过期" });
      }
      if (row.usedCount >= row.maxUses || row.status === "exhausted") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Code fully redeemed / 兑换名额已满" });
      }

      // Already redeemed this code?
      const [already] = await db
        .select({ id: accessCodeRedemptions.id })
        .from(accessCodeRedemptions)
        .where(
          and(
            eq(accessCodeRedemptions.codeId, row.id),
            eq(accessCodeRedemptions.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (already) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already redeemed this code / 你已兑换过此码",
        });
      }

      // Optimistic lock: only succeed if usedCount unchanged (handles concurrent redeem)
      const nextCount = row.usedCount + 1;
      const nextStatus = nextCount >= row.maxUses ? ("exhausted" as const) : ("active" as const);
      const updated = await db
        .update(accessCodes)
        .set({
          usedCount: nextCount,
          status: nextStatus,
        })
        .where(
          and(
            eq(accessCodes.id, row.id),
            eq(accessCodes.status, "active"),
            eq(accessCodes.usedCount, row.usedCount)
          )
        );

      const affected =
        (updated as unknown as [{ affectedRows?: number }])?.[0]?.affectedRows ??
        (updated as unknown as { affectedRows?: number })?.affectedRows ??
        1;

      if (affected === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Code fully redeemed / 兑换名额已满" });
      }

      await db.insert(accessCodeRedemptions).values({
        codeId: row.id,
        code: row.code,
        userId: ctx.user.id,
        membershipType: row.membershipType,
      });

      await activateMembership(
        ctx.user.id,
        row.membershipType,
        `code:${row.code}`,
        `code_${row.code}_${ctx.user.id}_${Date.now()}`
      );

      await createNotification({
        userId: ctx.user.id,
        type: "membership",
        title: "Beta access unlocked",
        message: `Your ${row.membershipType} membership is active. Enjoy unlimited readings!`,
        link: "/membership",
        icon: "crown",
      });

      return {
        success: true,
        membershipType: row.membershipType,
        typeLabel: typeLabel(row.membershipType, true),
        typeLabelEn: typeLabel(row.membershipType, false),
      };
    }),

  /** Admin: list codes + redemption counts */
  adminList: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) return [];

    const rows = await db
      .select()
      .from(accessCodes)
      .orderBy(desc(accessCodes.createdAt))
      .limit(50);

    return rows.map((r) => ({
      ...r,
      remaining: Math.max(0, r.maxUses - r.usedCount),
      isExpired: r.expiresAt ? new Date(r.expiresAt) < new Date() : false,
    }));
  }),

  /** Admin: recent redemptions */
  adminRedemptions: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(30) }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      await ensureAccessCodeTables();
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(accessCodeRedemptions)
        .orderBy(desc(accessCodeRedemptions.createdAt))
        .limit(input?.limit ?? 30);
    }),

  /** Admin: create a new code */
  adminCreate: protectedProcedure
    .input(
      z.object({
        code: z.string().min(4).max(40).optional(),
        label: z.string().max(100).optional(),
        membershipType: z.enum(["monthly", "yearly", "lifetime"]).default("lifetime"),
        maxUses: z.number().int().min(1).max(1000).default(30),
        expiresInDays: z.number().int().min(1).max(365).optional(),
        note: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      await ensureAccessCodeTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const code =
        normalizeCode(input.code || "") ||
        `BETA${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      let expiresAt: Date | null = null;
      if (input.expiresInDays) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);
      }

      try {
        await db.insert(accessCodes).values({
          code,
          label: input.label || "Friend beta",
          membershipType: input.membershipType,
          maxUses: input.maxUses,
          usedCount: 0,
          status: "active",
          expiresAt,
          createdBy: ctx.user.id,
          note: input.note,
        });
      } catch {
        throw new TRPCError({ code: "CONFLICT", message: "Code already exists / 兑换码已存在" });
      }

      return { success: true, code };
    }),

  /** Admin: disable a code */
  adminDisable: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      await ensureAccessCodeTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(accessCodes)
        .set({ status: "disabled" })
        .where(eq(accessCodes.id, input.id));

      return { success: true };
    }),

  /** Admin: re-enable + optionally reset remaining */
  adminEnable: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        maxUses: z.number().int().min(1).max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      await ensureAccessCodeTables();
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const patch: Partial<typeof accessCodes.$inferInsert> = { status: "active" };
      if (input.maxUses !== undefined) patch.maxUses = input.maxUses;

      await db.update(accessCodes).set(patch).where(eq(accessCodes.id, input.id));
      return { success: true };
    }),
});
