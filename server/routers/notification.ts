import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { notifications, broadcastReadReceipts, users } from "../../drizzle/schema";
import { eq, desc, and, or, isNull, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Helper: create a notification for a specific user
 */
export async function createNotification(params: {
  userId: number;
  type: "system" | "report" | "membership" | "community" | "admin" | "promotion";
  title: string;
  message: string;
  link?: string;
  icon?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link || null,
    icon: params.icon || null,
    isRead: false,
    isBroadcast: false,
    metadata: params.metadata || null,
    expiresAt: params.expiresAt || null,
  });
}

/**
 * Helper: create a broadcast notification for all users
 */
export async function createBroadcastNotification(params: {
  type: "system" | "admin" | "promotion";
  title: string;
  message: string;
  link?: string;
  icon?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId: null,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link || null,
    icon: params.icon || null,
    isRead: false,
    isBroadcast: true,
    metadata: params.metadata || null,
    expiresAt: params.expiresAt || null,
  });
}

export const notificationRouter = router({
  /**
   * Get notifications for the current user (personal + unread broadcasts)
   */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
      cursor: z.number().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { items: [], nextCursor: undefined };
      const limit = input?.limit ?? 20;
      const cursor = input?.cursor;
      const userId = ctx.user.id;

      const personalNotifs = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            cursor ? sql`${notifications.id} < ${cursor}` : undefined,
            or(isNull(notifications.expiresAt), sql`${notifications.expiresAt} > NOW()`)
          )
        )
        .orderBy(desc(notifications.createdAt))
        .limit(limit);

      const broadcastNotifs = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.isBroadcast, true),
            isNull(notifications.userId),
            cursor ? sql`${notifications.id} < ${cursor}` : undefined,
            or(isNull(notifications.expiresAt), sql`${notifications.expiresAt} > NOW()`)
          )
        )
        .orderBy(desc(notifications.createdAt))
        .limit(limit);

      const broadcastIds = broadcastNotifs.map(n => n.id);
      let readReceiptIds: number[] = [];
      if (broadcastIds.length > 0) {
        const receipts = await db
          .select({ notificationId: broadcastReadReceipts.notificationId })
          .from(broadcastReadReceipts)
          .where(
            and(
              eq(broadcastReadReceipts.userId, userId),
              inArray(broadcastReadReceipts.notificationId, broadcastIds)
            )
          );
        readReceiptIds = receipts.map(r => r.notificationId);
      }

      const broadcastWithReadStatus = broadcastNotifs.map(n => ({
        ...n,
        isRead: readReceiptIds.includes(n.id),
      }));

      const allNotifs = [...personalNotifs, ...broadcastWithReadStatus]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      const nextCursor = allNotifs.length === limit
        ? allNotifs[allNotifs.length - 1].id
        : undefined;

      return { items: allNotifs, nextCursor };
    }),

  /**
   * Get unread notification count
   */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { count: 0 };
    const userId = ctx.user.id;

    const [personalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
          or(isNull(notifications.expiresAt), sql`${notifications.expiresAt} > NOW()`)
        )
      );

    const [broadcastResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.isBroadcast, true),
          isNull(notifications.userId),
          or(isNull(notifications.expiresAt), sql`${notifications.expiresAt} > NOW()`),
          sql`${notifications.id} NOT IN (
            SELECT notificationId FROM broadcast_read_receipts WHERE userId = ${userId}
          )`
        )
      );

    return {
      count: Number(personalResult?.count ?? 0) + Number(broadcastResult?.count ?? 0),
    };
  }),

  /**
   * Mark a notification as read
   */
  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const userId = ctx.user.id;

      const [notif] = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.id))
        .limit(1);

      if (!notif) throw new TRPCError({ code: "NOT_FOUND", message: "Notification not found" });

      if (notif.isBroadcast) {
        const existing = await db
          .select()
          .from(broadcastReadReceipts)
          .where(
            and(
              eq(broadcastReadReceipts.notificationId, input.id),
              eq(broadcastReadReceipts.userId, userId)
            )
          )
          .limit(1);

        if (existing.length === 0) {
          await db.insert(broadcastReadReceipts).values({
            notificationId: input.id,
            userId,
          });
        }
      } else {
        if (notif.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });
        await db
          .update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.id, input.id));
      }

      return { success: true };
    }),

  /**
   * Mark all notifications as read
   */
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const userId = ctx.user.id;

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      );

    const unreadBroadcasts = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.isBroadcast, true),
          isNull(notifications.userId),
          or(isNull(notifications.expiresAt), sql`${notifications.expiresAt} > NOW()`),
          sql`${notifications.id} NOT IN (
            SELECT notificationId FROM broadcast_read_receipts WHERE userId = ${userId}
          )`
        )
      );

    if (unreadBroadcasts.length > 0) {
      await db.insert(broadcastReadReceipts).values(
        unreadBroadcasts.map(n => ({
          notificationId: n.id,
          userId,
        }))
      );
    }

    return { success: true };
  }),

  /**
   * Delete a notification (personal only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const userId = ctx.user.id;

      const [notif] = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.id))
        .limit(1);

      if (!notif) throw new TRPCError({ code: "NOT_FOUND" });
      if (notif.isBroadcast) throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete broadcast notifications" });
      if (notif.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });

      await db.delete(notifications).where(eq(notifications.id, input.id));
      return { success: true };
    }),

  // ========== Admin endpoints ==========

  /**
   * Admin: Send notification to a specific user or broadcast to all
   */
  adminSend: protectedProcedure
    .input(z.object({
      targetUserId: z.number().optional(),
      type: z.enum(["system", "admin", "promotion", "membership"]),
      title: z.string().min(1).max(200),
      message: z.string().min(1).max(2000),
      link: z.string().max(500).optional(),
      icon: z.string().max(50).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.targetUserId) {
        await db.insert(notifications).values({
          userId: input.targetUserId,
          type: input.type,
          title: input.title,
          message: input.message,
          link: input.link || null,
          icon: input.icon || null,
          isRead: false,
          isBroadcast: false,
        });
      } else {
        await db.insert(notifications).values({
          userId: null,
          type: input.type,
          title: input.title,
          message: input.message,
          link: input.link || null,
          icon: input.icon || null,
          isRead: false,
          isBroadcast: true,
        });
      }

      return { success: true };
    }),

  /**
   * Admin: List all notifications (for management)
   */
  adminList: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      const db = await getDb();
      if (!db) return { items: [], total: 0 };
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      const items = await db
        .select()
        .from(notifications)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(notifications);

      return { items, total: Number(countResult?.count ?? 0) };
    }),

  /**
   * Admin: Delete a notification
   */
  adminDelete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.delete(notifications).where(eq(notifications.id, input.id));
      await db.delete(broadcastReadReceipts).where(eq(broadcastReadReceipts.notificationId, input.id));
      return { success: true };
    }),

  /**
   * Admin: Get list of users for targeting notifications
   */
  adminUserList: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      const db = await getDb();
      if (!db) return [];
      const search = input?.search;
      const limit = input?.limit ?? 20;

      if (search) {
        return await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
          })
          .from(users)
          .where(
            or(
              sql`${users.name} LIKE ${`%${search}%`}`,
              sql`${users.email} LIKE ${`%${search}%`}`
            )
          )
          .limit(limit)
          .orderBy(desc(users.lastSignedIn));
      }

      return await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .limit(limit)
        .orderBy(desc(users.lastSignedIn));
    }),
});
