import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, emailQueue, referrals } from "../../drizzle/schema";
import { eq, desc, and, sql, lte } from "drizzle-orm";
import { ENV } from "../_core/env";

// Email template generators
function generateWelcomeEmail(userName: string, referralCode: string | null, language: string): { subject: string; html: string } {
  const isZh = language === "zh";
  const base = ENV.appBaseUrl;
  return {
    subject: isZh ? "🌟 欢迎加入洞察未来！开启你的心灵成长之旅" : "🌟 Welcome to Fortune Insight! Begin Your Journey of Self-Discovery",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a1a;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:600px;margin:0 auto;background:linear-gradient(180deg,#1a1030 0%,#0f0a1a 100%);border:1px solid rgba(212,168,67,0.2);border-radius:12px;overflow:hidden;">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a1030,#2a1540);padding:40px 30px;text-align:center;border-bottom:1px solid rgba(212,168,67,0.15);">
    <h1 style="color:#d4a843;font-size:28px;margin:0;font-weight:700;letter-spacing:1px;">Fortune Insight</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:8px 0 0;letter-spacing:2px;">${isZh ? "洞察未来" : "Discover Your True Self"}</p>
  </div>
  <!-- Body -->
  <div style="padding:30px;">
    <h2 style="color:#e8d5b0;font-size:22px;margin:0 0 15px;">${isZh ? `你好，${userName}！` : `Hello, ${userName}!`}</h2>
    <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isZh
        ? "感谢你加入洞察未来！我们融合东方命理智慧与西方占卜艺术，借助AI技术为你提供深度个性化的心灵洞察。"
        : "Thank you for joining Fortune Insight! We blend Eastern wisdom with Western divination arts, powered by AI to deliver deeply personalized spiritual insights."}
    </p>
    <!-- Features -->
    <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.15);border-radius:8px;padding:20px;margin:20px 0;">
      <p style="color:#d4a843;font-size:16px;font-weight:600;margin:0 0 12px;">${isZh ? "🎁 你的免费体验包含：" : "🎁 Your Free Experience Includes:"}</p>
      <ul style="color:rgba(255,255,255,0.7);font-size:14px;line-height:2;margin:0;padding-left:20px;">
        <li>🃏 ${isZh ? "AI塔罗占卜 — 每日1次免费" : "AI Tarot Reading — 1 free daily"}</li>
        <li>✨ ${isZh ? "AI八字精批 — 1次免费体验" : "AI BaZi Analysis — 1 free trial"}</li>
        <li>🌟 ${isZh ? "星座运势 — 无限免费" : "Horoscope — Unlimited free"}</li>
        <li>🌙 ${isZh ? "AI解梦 — 每月1次免费" : "AI Dream Interpretation — 1 free monthly"}</li>
      </ul>
    </div>
    <!-- CTA -->
    <div style="text-align:center;margin:30px 0;">
      <a href="${base}/tarot" style="display:inline-block;background:linear-gradient(135deg,#d4a843,#b8922e);color:#1a1030;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
        ${isZh ? "开始你的第一次占卜 →" : "Start Your First Reading →"}
      </a>
    </div>
    ${referralCode ? `
    <!-- Referral -->
    <div style="background:rgba(192,96,128,0.1);border:1px solid rgba(192,96,128,0.2);border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#c06080;font-size:14px;font-weight:600;margin:0 0 8px;">${isZh ? "🎉 邀请好友，双方各得额外免费次数！" : "🎉 Invite friends — both of you get bonus credits!"}</p>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 12px;">${isZh ? "你的专属邀请码：" : "Your referral code:"}</p>
      <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(212,168,67,0.3);border-radius:6px;padding:10px 20px;display:inline-block;">
        <span style="color:#d4a843;font-size:20px;font-weight:700;letter-spacing:3px;">${referralCode}</span>
      </div>
    </div>` : ""}
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">© 2026 Fortune Insight. ${isZh ? "洞察未来，发现真我。" : "Discover your true self."}</p>
  </div>
</div>
</body>
</html>`.trim(),
  };
}

function generateConversionEmail(userName: string, language: string): { subject: string; html: string } {
  const isZh = language === "zh";
  const base = ENV.appBaseUrl;
  return {
    subject: isZh ? "✨ 你的免费体验即将用完 — 解锁无限深度报告" : "✨ Your Free Credits Are Running Low — Unlock Unlimited Deep Reports",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a1a;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:600px;margin:0 auto;background:linear-gradient(180deg,#1a1030 0%,#0f0a1a 100%);border:1px solid rgba(212,168,67,0.2);border-radius:12px;overflow:hidden;">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a1030,#2a1540);padding:40px 30px;text-align:center;border-bottom:1px solid rgba(212,168,67,0.15);">
    <h1 style="color:#d4a843;font-size:28px;margin:0;font-weight:700;">Fortune Insight</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:8px 0 0;letter-spacing:2px;">${isZh ? "洞察未来" : "Premium Membership"}</p>
  </div>
  <!-- Body -->
  <div style="padding:30px;">
    <h2 style="color:#e8d5b0;font-size:22px;margin:0 0 15px;">${isZh ? `${userName}，你的洞察之旅才刚开始...` : `${userName}, your journey has just begun...`}</h2>
    <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isZh
        ? "过去几天你已经体验了我们的AI占卜服务。免费版本只展示了冰山一角 — Premium会员可以解锁完整的深度分析报告。"
        : "Over the past few days, you've experienced our AI divination services. The free version only shows the tip of the iceberg — Premium members unlock complete deep analysis reports."}
    </p>
    <!-- Comparison -->
    <div style="margin:25px 0;">
      <div style="display:flex;gap:10px;">
        <div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:15px;">
          <p style="color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;margin:0 0 10px;text-align:center;">${isZh ? "免费版" : "FREE"}</p>
          <ul style="color:rgba(255,255,255,0.5);font-size:12px;line-height:2;margin:0;padding-left:15px;">
            <li>${isZh ? "基础3牌解读" : "Basic 3-card reading"}</li>
            <li>${isZh ? "简要八字分析" : "Brief BaZi analysis"}</li>
            <li>${isZh ? "每日限次" : "Daily limits"}</li>
          </ul>
        </div>
        <div style="flex:1;background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.3);border-radius:8px;padding:15px;">
          <p style="color:#d4a843;font-size:13px;font-weight:600;margin:0 0 10px;text-align:center;">👑 ${isZh ? "Premium" : "PREMIUM"}</p>
          <ul style="color:rgba(255,255,255,0.7);font-size:12px;line-height:2;margin:0;padding-left:15px;">
            <li>${isZh ? "深度多维度报告" : "Deep multi-dimensional reports"}</li>
            <li>${isZh ? "完整八字命盘" : "Complete BaZi destiny chart"}</li>
            <li>${isZh ? "无限使用" : "Unlimited access"}</li>
            <li>${isZh ? "PDF导出" : "PDF export"}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Pricing -->
    <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.15);border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#d4a843;font-size:14px;margin:0 0 5px;">${isZh ? "年度会员" : "Annual Membership"}</p>
      <p style="color:#e8d5b0;font-size:28px;font-weight:700;margin:0;">$59.99<span style="font-size:14px;color:rgba(255,255,255,0.5);">/${isZh ? "年" : "year"}</span></p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:5px 0 0;">${isZh ? "相当于每月仅 $4.99 — 省50%" : "Just $4.99/month — Save 50%"}</p>
    </div>
    <!-- CTA -->
    <div style="text-align:center;margin:30px 0;">
      <a href="${base}/membership" style="display:inline-block;background:linear-gradient(135deg,#d4a843,#b8922e);color:#1a1030;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:700;">
        ${isZh ? "升级 Premium →" : "Upgrade to Premium →"}
      </a>
    </div>
    <p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;margin:0;">
      ${isZh ? "10% 收入捐赠慈善事业 💝" : "10% of revenue goes to charity 💝"}
    </p>
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">© 2026 Fortune Insight</p>
  </div>
</div>
</body>
</html>`.trim(),
  };
}

// Queue email for a user
export async function queueWelcomeEmail(userId: number, email: string, userName: string, referralCode: string | null) {
  const db = await getDb();
  if (!db) return;

  // Detect language from user's name (simple heuristic)
  const isChinese = /[\u4e00-\u9fff]/.test(userName);
  const language = isChinese ? "zh" : "en";

  const { subject, html } = generateWelcomeEmail(userName, referralCode, language);

  await db.insert(emailQueue).values({
    userId,
    email,
    userName,
    templateType: "welcome",
    subject,
    htmlContent: html,
    status: "pending",
    scheduledAt: new Date(), // Send immediately
  });
}

export async function queueConversionEmail(userId: number, email: string, userName: string) {
  const db = await getDb();
  if (!db) return;

  const isChinese = /[\u4e00-\u9fff]/.test(userName);
  const language = isChinese ? "zh" : "en";

  const { subject, html } = generateConversionEmail(userName, language);

  // Schedule for 3 days from now
  const scheduledAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  await db.insert(emailQueue).values({
    userId,
    email,
    userName,
    templateType: "conversion",
    subject,
    htmlContent: html,
    status: "pending",
    scheduledAt,
  });
}

// Email marketing router
export const emailRouter = router({
  // Admin: Get email queue
  getQueue: protectedProcedure
    .input(z.object({
      status: z.enum(["pending", "sent", "failed", "cancelled"]).optional(),
      templateType: z.enum(["welcome", "conversion", "reengagement", "referral_reward", "custom"]).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") return { emails: [], total: 0 };
      const db = await getDb();
      if (!db) return { emails: [], total: 0 };

      const conditions = [];
      if (input.status) conditions.push(eq(emailQueue.status, input.status));
      if (input.templateType) conditions.push(eq(emailQueue.templateType, input.templateType));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [emails, [countResult]] = await Promise.all([
        db.select().from(emailQueue)
          .where(whereClause)
          .orderBy(desc(emailQueue.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db.select({ c: sql<number>`count(*)` }).from(emailQueue).where(whereClause),
      ]);

      return { emails, total: Number(countResult?.c || 0) };
    }),

  // Admin: Mark email as sent
  markSent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") return { success: false };
      const db = await getDb();
      if (!db) return { success: false };

      await db.update(emailQueue)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(emailQueue.id, input.id));

      return { success: true };
    }),

  // Admin: Mark email as cancelled
  cancelEmail: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") return { success: false };
      const db = await getDb();
      if (!db) return { success: false };

      await db.update(emailQueue)
        .set({ status: "cancelled" })
        .where(eq(emailQueue.id, input.id));

      return { success: true };
    }),

  // Admin: Get email stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") return null;
    const db = await getDb();
    if (!db) return null;

    const [pending, sent, failed] = await Promise.all([
      db.select({ c: sql<number>`count(*)` }).from(emailQueue).where(eq(emailQueue.status, "pending")),
      db.select({ c: sql<number>`count(*)` }).from(emailQueue).where(eq(emailQueue.status, "sent")),
      db.select({ c: sql<number>`count(*)` }).from(emailQueue).where(eq(emailQueue.status, "failed")),
    ]);

    return {
      pending: Number(pending[0]?.c || 0),
      sent: Number(sent[0]?.c || 0),
      failed: Number(failed[0]?.c || 0),
    };
  }),

  // Admin: Get ready-to-send emails (pending + scheduled time has passed)
  getReadyToSend: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") return [];
    const db = await getDb();
    if (!db) return [];

    return db.select().from(emailQueue)
      .where(and(
        eq(emailQueue.status, "pending"),
        lte(emailQueue.scheduledAt, new Date()),
      ))
      .orderBy(emailQueue.scheduledAt)
      .limit(50);
  }),

  // Admin: Batch mark as sent
  batchMarkSent: protectedProcedure
    .input(z.object({ ids: z.array(z.number()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") return { success: false };
      const db = await getDb();
      if (!db) return { success: false };

      await Promise.all(
        input.ids.map(id =>
          db.update(emailQueue)
            .set({ status: "sent", sentAt: new Date() })
            .where(eq(emailQueue.id, id))
        )
      );

      return { success: true, count: input.ids.length };
    }),
});
