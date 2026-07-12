import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { shareEvents } from "../../drizzle/schema";
import { sql, gte, desc } from "drizzle-orm";

export const shareTrackingRouter = router({
  /**
   * Track a share event (public - works for anonymous users too)
   */
  track: publicProcedure
    .input(
      z.object({
        platform: z.string().max(30),
        type: z.string().max(30),
        lang: z.string().max(5).default("en"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const userId = ctx.user?.id ?? null;
      await db.insert(shareEvents).values({
        userId,
        platform: input.platform,
        type: input.type,
        lang: input.lang,
      });
      return { success: true };
    }),

  /**
   * Get share statistics (admin only)
   */
  stats: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      // Only admin can view stats
      if (ctx.user.role !== "admin") {
        return { byPlatform: [], byType: [], byDay: [], total: 0 };
      }

      const db = await getDb();
      if (!db) return { byPlatform: [], byType: [], byDay: [], total: 0 };

      const days = input?.days ?? 30;
      const since = new Date(Date.now() - days * 86400_000);

      // Total shares
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(shareEvents)
        .where(gte(shareEvents.createdAt, since));
      const total = totalResult?.count ?? 0;

      // By platform
      const byPlatform = await db
        .select({
          platform: shareEvents.platform,
          count: sql<number>`count(*)`,
        })
        .from(shareEvents)
        .where(gte(shareEvents.createdAt, since))
        .groupBy(shareEvents.platform)
        .orderBy(desc(sql`count(*)`));

      // By type
      const byType = await db
        .select({
          type: shareEvents.type,
          count: sql<number>`count(*)`,
        })
        .from(shareEvents)
        .where(gte(shareEvents.createdAt, since))
        .groupBy(shareEvents.type)
        .orderBy(desc(sql`count(*)`));

      // By day (last N days)
      const byDay = await db
        .select({
          date: sql<string>`DATE(created_at)`.as("date"),
          count: sql<number>`count(*)`,
        })
        .from(shareEvents)
        .where(gte(shareEvents.createdAt, since))
        .groupBy(sql`DATE(created_at)`)
        .orderBy(sql`DATE(created_at)`);

      return { byPlatform, byType, byDay, total };
    }),
});
