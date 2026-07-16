import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import {
  getDb,
  getUsageStatus,
  consumeUsage,
  saveReport,
  getUserReports,
  getReportById,
  toggleReportFavorite,
  deleteReport,
  grantSignupTrialIfNeeded,
  hasActiveMembership,
} from "./db";
import { users, tarotReadings, baziReadings, horoscopes, userGrowth, communityPosts, postLikes, postComments, memberships, orders, charityDonations, dreamRecords, userFeedbacks, contactSubmissions, chatSessions, chatMessages } from "../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { createCheckoutSession } from "./stripe";
import { PRODUCTS, ProductId, FREE_LIMITS, getSinglePurchaseProducts, getMembershipProducts } from "./products";
import { transcribeAudio } from "./_core/voiceTranscription";
import { notifyOwner } from "./_core/notification";
import { tarotRouter } from "./routers/tarot";
import { baziRouter } from "./routers/bazi";
import { horoscopeRouter } from "./routers/horoscope";
import { dreamRouter } from "./routers/dream";
import { notificationRouter, createNotification } from "./routers/notification";
import { referralRouter } from "./routers/referral";
import { compatibilityRouter } from "./routers/compatibility";
import { emailRouter, queueWelcomeEmail, queueConversionEmail } from "./routers/email";
import { shareTrackingRouter } from "./routers/shareTracking";
import { accessCodeRouter } from "./routers/accessCode";
import { storagePut } from "./storage";

// AI客服知识库和自动回复函数
const customerServiceKnowledge: Record<string, string[]> = {
  greetings: ["你好", "您好", "在吗", "hello", "hi", "hey", "good morning", "good evening"],
  services: ["服务", "功能", "做什么", "service", "feature", "what can", "what do"],
  pricing: ["价格", "多少钱", "费用", "收费", "price", "cost", "how much", "pricing", "plan"],
  tarot: ["塔罗", "占卜", "抽牌", "算卦", "tarot", "card reading", "fortune"],
  bazi: ["八字", "命理", "生辰", "精批", "bazi", "ba zi", "destiny", "birth chart"],
  horoscope: ["星座", "运势", "星象", "horoscope", "zodiac", "star sign"],
  dream: ["解梦", "梦境", "做梦", "dream", "nightmare", "dream meaning"],
  refund: ["退款", "取消", "不想要", "refund", "cancel", "money back"],
  contact: ["联系", "客服", "人工", "电话", "邮箱", "contact", "email", "support", "help"],
};

const customerServiceResponses: Record<string, { zh: string; en: string }> = {
  greetings: {
    zh: "您好！欢迎来到洞察未来客服中心。我是AI助手，可以为您解答常见问题。",
    en: "Hello! Welcome to Fortune Insight support. I'm an AI assistant here to help with common questions."
  },
  services: {
    zh: "洞察未来提供以下服务：\n\n🃏 **AI塔罗占卜** - 三牌阵解读您的过去、现在和未来\n✨ **AI八字精批** - 根据您的生辰提供命理分析\n🌟 **星座运势** - 每日星座运势解读\n🌙 **AI解梦** - 专业梦境分析与心理解读",
    en: "Fortune Insight offers these services:\n\n🃏 **AI Tarot Reading** - 3-card spread for past, present & future\n✨ **AI BaZi Analysis** - Destiny analysis based on your birth date\n🌟 **Horoscope** - Daily zodiac fortune readings\n🌙 **AI Dream Interpretation** - Professional dream analysis with psychology insights"
  },
  pricing: {
    zh: "关于价格：\n\n🎁 **免费体验** - 塔罗占卜每天免费1次，星座运势无限免费\n💎 **单次购买** - 塔罗深度解读$1.99，八字报告$4.99\n👑 **会员订阅** - 月付$9.99，年付$59.99（省一半），无限使用所有功能\n\n详细价格请查看会员中心页面！",
    en: "Pricing:\n\n🎁 **Free** - 1 free tarot reading/day, unlimited horoscopes\n💎 **Single Purchase** - Tarot deep reading $1.99, BaZi report $4.99\n👑 **Membership** - Monthly $9.99, Yearly $59.99 (save 50%), unlimited access\n\nVisit the Membership page for full details!"
  },
  tarot: {
    zh: "关于塔罗占卜：\n\n我们的AI塔罗使用经典韦特塔罗牌组，您可以选择爱情、事业、财运等问题类型，然后亲自抽取三张牌。AI会结合您的问题和牌面给出个性化解读。\n\n点击导航栏「塔罗占卜」即可开始体验！",
    en: "About Tarot Reading:\n\nOur AI Tarot uses the classic Rider-Waite deck. Choose a question type (love, career, finance), then draw 3 cards. AI provides personalized interpretations based on your question and cards.\n\nClick 'Tarot' in the navigation to start!"
  },
  bazi: {
    zh: "关于八字精批：\n\n输入您的出生日期和时辰，AI会为您生成专业的命理分析报告，包括性格特点、天赋潜能、事业方向等。报告可以导出PDF保存。\n\n点击导航栏「八字精批」开始体验！",
    en: "About BaZi Analysis:\n\nEnter your birth date and time. AI generates a professional destiny analysis including personality traits, hidden talents, and career direction. Reports can be exported as PDF.\n\nClick 'BaZi' in the navigation to start!"
  },
  horoscope: {
    zh: "关于星座运势：\n\n选择您的星座，即可获取今日运势解读，包括综合运势、爱情、事业、财运等方面的分析和建议。\n\n点击导航栏「星座运势」查看！",
    en: "About Horoscope:\n\nSelect your zodiac sign to get today's fortune reading, including overall luck, love, career, and financial analysis with personalized advice.\n\nClick 'Horoscope' in the navigation to check!"
  },
  dream: {
    zh: "关于AI解梦：\n\n记录您的梦境内容和情绪，AI会从心理学角度为您解读梦境含义。梦境记录可以导出PDF梦境日记。\n\n点击导航栏「AI解梦」开始体验！",
    en: "About Dream Interpretation:\n\nRecord your dream content and emotions. AI interprets dream meanings from a psychological perspective. Dream records can be exported as a PDF dream journal.\n\nClick 'Dream' in the navigation to start!"
  },
  refund: {
    zh: "关于退款：\n\n如果您对服务不满意，可以在购买后7天内申请退款。请提供您的订单号和退款原因。",
    en: "About Refunds:\n\nIf you're not satisfied, you can request a refund within 7 days of purchase. Please provide your order number and reason for the refund."
  },
  contact: {
    zh: "联系方式：\n\n📧 **邮箱**: fortuneinsight@outlook.com\n💬 **在线客服**: 您正在使用的这个聊天窗口",
    en: "Contact us:\n\n📧 **Email**: fortuneinsight@outlook.com\n💬 **Live Chat**: This chat window you're using right now"
  },
  default: {
    zh: "感谢您的提问！我是AI助手，您的问题已记录。\n\n您可以尝试问我：\n- 您们有哪些服务？\n- 价格是多少？\n- 如何使用塔罗占卜？",
    en: "Thanks for your question! I'm an AI assistant and your message has been recorded.\n\nYou can ask me about:\n- What services do you offer?\n- What are the prices?\n- How does tarot reading work?"
  },
};

async function generateAICustomerServiceReply(userMessage: string): Promise<string | null> {
  const lowerMessage = userMessage.toLowerCase();
  
  // 检查是否匹配知识库中的关键词
  // Detect language: if message contains Chinese characters, use Chinese
  const isChinese = /[\u4e00-\u9fff]/.test(userMessage);
  const lang = isChinese ? 'zh' : 'en';
  
  for (const [category, keywords] of Object.entries(customerServiceKnowledge)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      const resp = customerServiceResponses[category] || customerServiceResponses.default;
      return resp[lang];
    }
  }
  
  // 如果没有匹配到特定关键词，使用LLM生成回复
  try {
    const response = await invokeLLM({
      language: lang,
      messages: [
        { 
          role: "system", 
          content: `You are the AI customer service assistant for Fortune Insight (洞察未来). The platform offers AI Tarot Reading, BaZi Analysis, Horoscope, and Dream Interpretation.

IMPORTANT: Reply in the SAME LANGUAGE as the user's message. If they write in Chinese, reply in Chinese. If they write in English, reply in English.

Services: Tarot ($1.99/reading or free 1/day), BaZi ($4.99/report), Horoscope (free), Dream ($1.99/reading or free 1/month). Membership: Monthly $9.99, Yearly $59.99 (save 50%), Lifetime $149.99.

Rules:
- Keep replies under 100 words
- Be warm and helpful
- Guide users to relevant pages
- For issues you can't resolve, tell users to email fortuneinsight@outlook.com` 
        },
        { role: "user", content: userMessage },
      ],
    });
    
    const content = response.choices[0]?.message?.content;
    const isCn = /[\u4e00-\u9fff]/.test(userMessage);
    return typeof content === 'string' ? content : customerServiceResponses.default[isCn ? 'zh' : 'en'];
  } catch (e) {
    console.error("LLM call failed:", e);
    const isCn = /[\u4e00-\u9fff]/.test(userMessage);
    return customerServiceResponses.default[isCn ? 'zh' : 'en'];
  }
}

export const appRouter = router({
  system: systemRouter,
  shareTracking: shareTrackingRouter,
  accessCode: accessCodeRouter,

  /** Lightweight admin console APIs */
  admin: router({
    overview: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      const empty = {
        users: { total: 0, last7d: 0, last24h: 0 },
        membership: { activeTrial: 0, activePaid: 0, expired: 0 },
        readings: { tarot: 0, bazi: 0, dream: 0, last7d: 0 },
        ops: { openContacts: 0, waitingChats: 0, codeRedemptions: 0 },
        recentUsers: [] as Array<{
          id: number;
          name: string | null;
          email: string | null;
          loginMethod: string | null;
          createdAt: Date;
          lastSignedIn: Date;
          membershipLabel: string | null;
        }>,
      };
      if (!db) return empty;

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const now = new Date();

      const [
        [userTotal],
        [user7d],
        [user24h],
        [tarotTotal],
        [baziTotal],
        [dreamTotal],
        activeMemberships,
        [expiredCount],
        [contactsTotal],
        [waitingChats],
        recentRaw,
        [tarot7],
        [bazi7],
        [dream7],
      ] = await Promise.all([
        db.select({ c: sql<number>`count(*)` }).from(users),
        db.select({ c: sql<number>`count(*)` }).from(users).where(sql`${users.createdAt} >= ${weekAgo}`),
        db.select({ c: sql<number>`count(*)` }).from(users).where(sql`${users.createdAt} >= ${dayAgo}`),
        db.select({ c: sql<number>`count(*)` }).from(tarotReadings),
        db.select({ c: sql<number>`count(*)` }).from(baziReadings),
        db.select({ c: sql<number>`count(*)` }).from(dreamRecords),
        db.select().from(memberships).where(eq(memberships.status, "active")),
        db.select({ c: sql<number>`count(*)` }).from(memberships).where(eq(memberships.status, "expired")),
        db.select({ c: sql<number>`count(*)` }).from(contactSubmissions),
        db.select({ c: sql<number>`count(*)` }).from(chatSessions).where(eq(chatSessions.status, "waiting")),
        db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            loginMethod: users.loginMethod,
            createdAt: users.createdAt,
            lastSignedIn: users.lastSignedIn,
          })
          .from(users)
          .orderBy(desc(users.createdAt))
          .limit(12),
        db.select({ c: sql<number>`count(*)` }).from(tarotReadings).where(sql`${tarotReadings.createdAt} >= ${weekAgo}`),
        db.select({ c: sql<number>`count(*)` }).from(baziReadings).where(sql`${baziReadings.createdAt} >= ${weekAgo}`),
        db.select({ c: sql<number>`count(*)` }).from(dreamRecords).where(sql`${dreamRecords.createdAt} >= ${weekAgo}`),
      ]);

      let codeRedemptions = 0;
      try {
        const rows = await db.execute(sql`SELECT COUNT(*) AS c FROM access_code_redemptions`);
        const arr = rows as unknown as Array<Record<string, unknown>> | { [0]: Array<Record<string, unknown>> };
        const first = Array.isArray(arr) ? arr[0] : (arr as { [0]: Array<Record<string, unknown>> })[0]?.[0];
        if (first && typeof first === "object" && "c" in first) {
          codeRedemptions = Number((first as { c: unknown }).c ?? 0);
        }
      } catch {
        codeRedemptions = 0;
      }

      let activeTrial = 0;
      let activePaid = 0;
      const membershipByUser = new Map<number, string>();
      for (const m of activeMemberships) {
        if (m.endDate && new Date(m.endDate) < now) continue;
        const isTrial = !!m.paymentMethod?.startsWith("trial:");
        if (isTrial) {
          activeTrial += 1;
          membershipByUser.set(m.userId, "trial");
        } else {
          activePaid += 1;
          membershipByUser.set(m.userId, m.type);
        }
      }

      return {
        users: {
          total: Number(userTotal?.c || 0),
          last7d: Number(user7d?.c || 0),
          last24h: Number(user24h?.c || 0),
        },
        membership: {
          activeTrial,
          activePaid,
          expired: Number(expiredCount?.c || 0),
        },
        readings: {
          tarot: Number(tarotTotal?.c || 0),
          bazi: Number(baziTotal?.c || 0),
          dream: Number(dreamTotal?.c || 0),
          last7d: Number(tarot7?.c || 0) + Number(bazi7?.c || 0) + Number(dream7?.c || 0),
        },
        ops: {
          openContacts: Number(contactsTotal?.c || 0),
          waitingChats: Number(waitingChats?.c || 0),
          codeRedemptions,
        },
        recentUsers: recentRaw.map((u) => ({
          ...u,
          membershipLabel: membershipByUser.get(u.id) ?? null,
        })),
      };
    }),
  }),

  // Public stats for homepage dynamic counters
  stats: router({
    getHomepageStats: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { totalReadings: 0, totalUsers: 0, totalCommunityPosts: 0 };
      const [[tarotCount], [baziCount], [dreamCount], [horoscopeCount], [userCount], [postCount]] = await Promise.all([
        db.select({ c: sql<number>`count(*)` }).from(tarotReadings),
        db.select({ c: sql<number>`count(*)` }).from(baziReadings),
        db.select({ c: sql<number>`count(*)` }).from(dreamRecords),
        db.select({ c: sql<number>`count(*)` }).from(horoscopes),
        db.select({ c: sql<number>`count(*)` }).from(users),
        db.select({ c: sql<number>`count(*)` }).from(communityPosts),
      ]);
      return {
        totalReadings: Number(tarotCount?.c || 0) + Number(baziCount?.c || 0) + Number(dreamCount?.c || 0) + Number(horoscopeCount?.c || 0),
        totalUsers: Number(userCount?.c || 0),
        totalCommunityPosts: Number(postCount?.c || 0),
      };
    }),
  }),
  auth: router({
    /** Never expose passwordHash (or other secrets) to the client */
    me: publicProcedure.query(({ ctx }) => {
      if (!ctx.user) return null;
      const { passwordHash: _omit, ...safe } = ctx.user;
      return safe;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    /** Native email/password register (no Manus portal) */
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8).max(128),
          name: z.string().min(1).max(80).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { registerWithEmail } = await import("./localAuth");
        const { sdk } = await import("./_core/sdk");
        const result = await registerWithEmail(input);
        if (!result.ok) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
        }

        const sessionToken = await sdk.createSessionToken(result.user.openId, {
          name: result.user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          success: true as const,
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          },
        };
      }),

    /** Native email/password login */
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1).max(128),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { loginWithEmail } = await import("./localAuth");
        const { sdk } = await import("./_core/sdk");
        const result = await loginWithEmail(input);
        if (!result.ok) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: result.error });
        }

        const sessionToken = await sdk.createSessionToken(result.user.openId, {
          name: result.user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          success: true as const,
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          },
        };
      }),
  }),

  // 使用次数查询路由
  usage: router({
    getStatus: protectedProcedure
      .input(z.object({
        featureType: z.enum(["tarot", "bazi", "dream", "horoscope"]),
      }))
      .query(async ({ input, ctx }) => {
        return getUsageStatus(ctx.user.id, input.featureType);
      }),

    getAllStatus: protectedProcedure.query(async ({ ctx }) => {
      const [tarot, bazi, dream, horoscope] = await Promise.all([
        getUsageStatus(ctx.user.id, "tarot"),
        getUsageStatus(ctx.user.id, "bazi"),
        getUsageStatus(ctx.user.id, "dream"),
        getUsageStatus(ctx.user.id, "horoscope"),
      ]);
      return { tarot, bazi, dream, horoscope };
    }),

    getFreeLimits: publicProcedure.query(() => {
      return FREE_LIMITS;
    }),
  }),

  // 塔罗占卜路由 (Professional 78-card engine)
  tarot: tarotRouter,

  // 八字分析路由 (Professional BaZi calculation engine)
  bazi: baziRouter,

  // 星座运势路由 (Professional zodiac data + planetary context)
  horoscope: horoscopeRouter,

  // 合盘（关系兼容性分析）路由
  compatibility: compatibilityRouter,

  // 通知系统路由
  notification: notificationRouter,
  referral: referralRouter,
  email: emailRouter,

  // 用户成长系统路由
  growth: router({
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const [progress] = await db
        .select()
        .from(userGrowth)
        .where(eq(userGrowth.userId, ctx.user.id))
        .limit(1);

      if (!progress) {
        // 创建新的成长记录
        await db.insert(userGrowth).values({
          userId: ctx.user.id,
          selfAwareness: 0,
          emotionalManagement: 0,
          intimateRelationships: 0,
          careerPotential: 0,
          wealthMindset: 0,
          healthWellness: 0,
          spiritualGrowth: 0,
          socialConnection: 0,
          totalPoints: 0,
          level: 1,
          badges: [],
        });

        return {
          selfAwareness: 0,
          emotionalManagement: 0,
          intimateRelationships: 0,
          careerPotential: 0,
          wealthMindset: 0,
          healthWellness: 0,
          spiritualGrowth: 0,
          socialConnection: 0,
          totalPoints: 0,
          level: 1,
          badges: [],
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null as string | null,
        };
      }

      return progress;
    }),

    addPoints: protectedProcedure
      .input(z.object({
        dimension: z.enum([
          "selfAwareness", "emotionalManagement", "intimateRelationships",
          "careerPotential", "wealthMindset", "healthWellness",
          "spiritualGrowth", "socialConnection"
        ]),
        points: z.number().min(1).max(100),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库不可用");

        const { dimension, points } = input;

        await db
          .update(userGrowth)
          .set({
            [dimension]: sql`${userGrowth[dimension]} + ${points}`,
            totalPoints: sql`${userGrowth.totalPoints} + ${points}`,
          })
          .where(eq(userGrowth.userId, ctx.user.id));

        return { success: true };
      }),

    // Record daily activity and update streak
    recordActivity: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { streak: 0, longestStreak: 0 };

      const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      const [progress] = await db
        .select()
        .from(userGrowth)
        .where(eq(userGrowth.userId, ctx.user.id))
        .limit(1);

      if (!progress) {
        await db.insert(userGrowth).values({
          userId: ctx.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
          totalPoints: 0,
          level: 1,
          badges: [],
        });
        return { streak: 1, longestStreak: 1, isNewDay: true };
      }

      if (progress.lastActiveDate === today) {
        return {
          streak: progress.currentStreak || 0,
          longestStreak: progress.longestStreak || 0,
          isNewDay: false,
        };
      }

      let newStreak = 1;
      if (progress.lastActiveDate === yesterday) {
        newStreak = (progress.currentStreak || 0) + 1;
      }
      const newLongest = Math.max(newStreak, progress.longestStreak || 0);

      await db
        .update(userGrowth)
        .set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActiveDate: today,
        })
        .where(eq(userGrowth.userId, ctx.user.id));

      return { streak: newStreak, longestStreak: newLongest, isNewDay: true };
    }),
  }),

  // 社区路由
  community: router({
    getPosts: publicProcedure
      .input(z.object({
        type: z.enum(["insight", "story", "article"]).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const { type, limit, offset } = input;

        const whereClause = type
          ? and(eq(communityPosts.status, "published"), eq(communityPosts.type, type))
          : eq(communityPosts.status, "published");

        const posts = await db
          .select({
            id: communityPosts.id,
            userId: communityPosts.userId,
            type: communityPosts.type,
            title: communityPosts.title,
            content: communityPosts.content,
            imageUrls: communityPosts.imageUrls,
            likesCount: communityPosts.likesCount,
            commentsCount: communityPosts.commentsCount,
            isKolContent: communityPosts.isKolContent,
            createdAt: communityPosts.createdAt,
            userName: users.name,
          })
          .from(communityPosts)
          .leftJoin(users, eq(communityPosts.userId, users.id))
          .where(whereClause)
          .orderBy(desc(communityPosts.createdAt))
          .limit(limit)
          .offset(offset);

        // Check which users have active memberships
        const userIds = Array.from(new Set(posts.map(p => p.userId)));
        const activeMemberships = userIds.length > 0
          ? await db
              .select({ userId: memberships.userId })
              .from(memberships)
              .where(and(
                eq(memberships.status, "active"),
                sql`${memberships.userId} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`
              ))
          : [];
        const premiumUserIds = new Set(activeMemberships.map(m => m.userId));

        return posts.map(post => ({
          ...post,
          isPremiumUser: premiumUserIds.has(post.userId),
          displayName: post.userName || null,
        }));
      }),

    createPost: protectedProcedure
      .input(z.object({
        type: z.enum(["insight", "story", "article"]),
        title: z.string().max(200).optional(),
        content: z.string().min(1).max(5000),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库不可用");

        const [post] = await db.insert(communityPosts).values({
          userId: ctx.user.id,
          type: input.type,
          title: input.title ?? null,
          content: input.content,
          status: "published",
        }).$returningId();

        return { id: post.id };
      }),

    likePost: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库不可用");

        // 检查是否已点赞
        const [existing] = await db
          .select()
          .from(postLikes)
          .where(and(
            eq(postLikes.postId, input.postId),
            eq(postLikes.userId, ctx.user.id)
          ))
          .limit(1);

        if (existing) {
          // 取消点赞
          await db.delete(postLikes).where(eq(postLikes.id, existing.id));
          await db.update(communityPosts)
            .set({ likesCount: sql`${communityPosts.likesCount} - 1` })
            .where(eq(communityPosts.id, input.postId));
          return { liked: false };
        } else {
          // 添加点赞
          await db.insert(postLikes).values({
            postId: input.postId,
            userId: ctx.user.id,
          });
          await db.update(communityPosts)
            .set({ likesCount: sql`${communityPosts.likesCount} + 1` })
            .where(eq(communityPosts.id, input.postId));

          // Notify post owner about the like (don't notify self)
          const [likedPost] = await db.select({ userId: communityPosts.userId }).from(communityPosts).where(eq(communityPosts.id, input.postId)).limit(1);
          if (likedPost && likedPost.userId !== ctx.user.id) {
            await createNotification({
              userId: likedPost.userId,
              type: "community",
              title: "Someone liked your post!",
              message: `${ctx.user.name || "A user"} liked your community post.`,
              link: "/community",
              icon: "users",
            });
          }

          return { liked: true };
        }
      }),

    /** F2-1: list comments for a post (public) */
    getComments: publicProcedure
      .input(z.object({
        postId: z.number().int().positive(),
        limit: z.number().min(1).max(50).default(20),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const rows = await db
          .select({
            id: postComments.id,
            postId: postComments.postId,
            userId: postComments.userId,
            content: postComments.content,
            createdAt: postComments.createdAt,
            userName: users.name,
          })
          .from(postComments)
          .leftJoin(users, eq(postComments.userId, users.id))
          .where(eq(postComments.postId, input.postId))
          .orderBy(desc(postComments.createdAt))
          .limit(input.limit);
        return rows.map((r) => ({
          ...r,
          displayName: r.userName || null,
        }));
      }),

    /** F2-1: add a comment (auth required) */
    addComment: protectedProcedure
      .input(z.object({
        postId: z.number().int().positive(),
        content: z.string().min(1).max(1000),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        }
        const [post] = await db
          .select({ id: communityPosts.id, userId: communityPosts.userId })
          .from(communityPosts)
          .where(eq(communityPosts.id, input.postId))
          .limit(1);
        if (!post) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        }

        const [inserted] = await db.insert(postComments).values({
          postId: input.postId,
          userId: ctx.user.id,
          content: input.content.trim(),
        }).$returningId();

        await db.update(communityPosts)
          .set({ commentsCount: sql`${communityPosts.commentsCount} + 1` })
          .where(eq(communityPosts.id, input.postId));

        if (post.userId !== ctx.user.id) {
          await createNotification({
            userId: post.userId,
            type: "community",
            title: "New comment on your post",
            message: `${ctx.user.name || "A user"} commented on your post.`,
            link: "/community",
            icon: "users",
          });
        }

        return { id: inserted.id, success: true as const };
      }),
  }),

  // 支付与会员路由
  payment: router({
    createCheckout: protectedProcedure
      .input(z.object({
        productId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // 验证productId是否存在
        if (!(input.productId in PRODUCTS)) {
          throw new Error(`Invalid product: ${input.productId}`);
        }
        const origin = ctx.req.headers.origin || "https://fortunesite.one";
        const checkoutUrl = await createCheckoutSession(
          ctx.user.id,
          ctx.user.email || "",
          ctx.user.name || "",
          input.productId as ProductId,
          origin
        );
        return { checkoutUrl };
      }),

    getMembership: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;

      // Ensure first-time users get signup trial even if auth path missed it
      await grantSignupTrialIfNeeded(ctx.user.id);

      const [membership] = await db
        .select()
        .from(memberships)
        .where(and(
          eq(memberships.userId, ctx.user.id),
          eq(memberships.status, "active")
        ))
        .orderBy(desc(memberships.createdAt))
        .limit(1);

      if (!membership) return null;

      // Treat expired endDate as inactive (and mark expired)
      if (membership.endDate && new Date(membership.endDate) < new Date()) {
        await hasActiveMembership(ctx.user.id); // side-effect: mark expired
        return null;
      }

      const isTrial = !!membership.paymentMethod?.startsWith("trial:");
      const daysLeft = membership.endDate
        ? Math.max(
            0,
            Math.ceil(
              (new Date(membership.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
          )
        : null;

      return { ...membership, isTrial, daysLeft };
    }),

    getOrders: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, ctx.user.id))
        .orderBy(desc(orders.createdAt))
        .limit(50);

      return userOrders;
    }),

    getCharityDonations: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const donations = await db
        .select()
        .from(charityDonations)
        .where(eq(charityDonations.userId, ctx.user.id))
        .orderBy(desc(charityDonations.createdAt))
        .limit(50);

      return donations;
    }),

    getProducts: publicProcedure.query(() => {
      return Object.entries(PRODUCTS).map(([productKey, product]) => ({
        productKey,
        ...product,
        priceDisplay: (product.price / 100).toFixed(2),
      }));
    }),

    getSingleProducts: publicProcedure.query(() => {
      return getSinglePurchaseProducts().map(p => ({
        ...p,
        priceDisplay: (p.price / 100).toFixed(2),
      }));
    }),

    getMembershipProducts: publicProcedure.query(() => {
      return getMembershipProducts().map(p => ({
        ...p,
        priceDisplay: (p.price / 100).toFixed(2),
      }));
    }),

    /**
     * Admin: list users + membership status (for granting free access to friends)
     */
    adminListUsers: protectedProcedure
      .input(z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(30),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        const db = await getDb();
        if (!db) return [];

        const search = input?.search?.trim();
        const limit = input?.limit ?? 30;

        const baseUsers = search
          ? await db
              .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
                lastSignedIn: users.lastSignedIn,
              })
              .from(users)
              .where(
                sql`(${users.name} LIKE ${`%${search}%`} OR ${users.email} LIKE ${`%${search}%`} OR CAST(${users.id} AS CHAR) = ${search})`
              )
              .orderBy(desc(users.lastSignedIn))
              .limit(limit)
          : await db
              .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
                lastSignedIn: users.lastSignedIn,
              })
              .from(users)
              .orderBy(desc(users.lastSignedIn))
              .limit(limit);

        if (baseUsers.length === 0) return [];

        const userIds = baseUsers.map((u) => u.id);
        const activeMemberships = await db
          .select()
          .from(memberships)
          .where(
            and(
              eq(memberships.status, "active"),
              sql`${memberships.userId} IN (${sql.join(userIds.map((id) => sql`${id}`), sql`, `)})`
            )
          );

        const membershipByUser = new Map<number, typeof activeMemberships[0]>();
        for (const m of activeMemberships) {
          // Prefer lifetime / latest
          const existing = membershipByUser.get(m.userId);
          if (!existing || m.type === "lifetime" || new Date(m.createdAt) > new Date(existing.createdAt)) {
            membershipByUser.set(m.userId, m);
          }
        }

        return baseUsers.map((u) => {
          const m = membershipByUser.get(u.id);
          const expired = m?.endDate ? new Date(m.endDate) < new Date() : false;
          return {
            ...u,
            membership: m && !expired
              ? {
                  id: m.id,
                  type: m.type,
                  status: m.status,
                  startDate: m.startDate,
                  endDate: m.endDate,
                  paymentMethod: m.paymentMethod,
                }
              : null,
          };
        });
      }),

    /**
     * Admin: grant complimentary membership (friends / testers / comp)
     * Lifetime has no endDate → unlimited access to all paid features.
     */
    adminGrantMembership: protectedProcedure
      .input(z.object({
        userId: z.number().int().positive().optional(),
        email: z.string().email().optional(),
        type: z.enum(["monthly", "yearly", "lifetime"]).default("lifetime"),
        note: z.string().max(200).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        if (!input.userId && !input.email) {
          throw new Error("Provide userId or email");
        }

        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        let targetUser: { id: number; name: string | null; email: string | null } | undefined;
        if (input.userId) {
          const [u] = await db
            .select({ id: users.id, name: users.name, email: users.email })
            .from(users)
            .where(eq(users.id, input.userId))
            .limit(1);
          targetUser = u;
        } else if (input.email) {
          const [u] = await db
            .select({ id: users.id, name: users.name, email: users.email })
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);
          targetUser = u;
        }

        if (!targetUser) {
          throw new Error("User not found. Ask them to log in once first.");
        }

        // Cancel any existing active memberships for clean state
        await db
          .update(memberships)
          .set({ status: "cancelled", autoRenew: false })
          .where(
            and(
              eq(memberships.userId, targetUser.id),
              eq(memberships.status, "active")
            )
          );

        const now = new Date();
        let endDate: Date | null = null;
        if (input.type === "monthly") {
          endDate = new Date(now);
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (input.type === "yearly") {
          endDate = new Date(now);
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        // lifetime → endDate null

        await db.insert(memberships).values({
          userId: targetUser.id,
          type: input.type,
          status: "active",
          startDate: now,
          endDate,
          price: "0.00",
          charityAmount: "0.00",
          paymentMethod: input.note
            ? `comp:${input.note.slice(0, 80)}`
            : `comp:admin:${ctx.user.id}`,
          transactionId: `comp_${Date.now()}_${targetUser.id}`,
          autoRenew: false,
        });

        const typeLabel =
          input.type === "lifetime" ? "终身会员" :
          input.type === "yearly" ? "年度会员" : "月度会员";

        await createNotification({
          userId: targetUser.id,
          type: "membership",
          title: "Membership Activated",
          message: `You've been gifted ${input.type} membership. Enjoy unlimited access!`,
          link: "/membership",
          icon: "crown",
        });

        return {
          success: true,
          userId: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
          type: input.type,
          typeLabel,
          endDate,
        };
      }),

    /**
     * Admin: revoke complimentary / any active membership
     */
    adminRevokeMembership: protectedProcedure
      .input(z.object({
        userId: z.number().int().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .update(memberships)
          .set({ status: "cancelled", autoRenew: false })
          .where(
            and(
              eq(memberships.userId, input.userId),
              eq(memberships.status, "active")
            )
          );

        await createNotification({
          userId: input.userId,
          type: "membership",
          title: "Membership Ended",
          message: "Your complimentary membership has been revoked.",
          link: "/membership",
          icon: "crown",
        });

        return { success: true };
      }),
  }),

  // AI解梦路由 (Professional dream symbol database)
  dream: dreamRouter,

  // 语音功能路由
  voice: router({
    // 上传音频文件
    uploadAudio: publicProcedure
      .input(z.object({
        audioData: z.string(), // base64编码的音频数据
        mimeType: z.string().default("audio/webm"),
      }))
      .mutation(async ({ input }) => {
        // 将base64转换为Buffer
        const audioBuffer = Buffer.from(input.audioData, "base64");
        
        // 检查文件大小（16MB限制）
        const sizeMB = audioBuffer.length / (1024 * 1024);
        if (sizeMB > 16) {
          throw new Error("音频文件过大，请控制在两分钟以内");
        }
        
        // 生成文件名
        const ext = input.mimeType.includes("webm") ? "webm" : 
                    input.mimeType.includes("mp4") ? "m4a" : "webm";
        const fileName = `voice-${Date.now()}-${nanoid(6)}.${ext}`;
        
        // 上传到存储
        const { url } = await storagePut(fileName, audioBuffer, input.mimeType);
        
        return { url, fileName };
      }),

    // 语音转文字
    transcribe: publicProcedure
      .input(z.object({
        audioUrl: z.string(),
        language: z.string().optional(),
        prompt: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
          prompt: input.prompt,
        });

        // 检查是否是错误响应
        if ('error' in result) {
          throw new Error(result.error);
        }

        return result;
      }),

    // 文字转语音（TTS）
    synthesize: publicProcedure
      .input(z.object({
        text: z.string().max(4000),
        voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]).default("nova"),
        speed: z.number().min(0.25).max(4.0).default(1.0),
      }))
      .mutation(async ({ input }) => {
        const { ENV } = await import("./_core/env");
        
        if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
          throw new Error("语音合成服务未配置");
        }

        const baseUrl = ENV.forgeApiUrl.endsWith("/")
          ? ENV.forgeApiUrl
          : `${ENV.forgeApiUrl}/`;

        const response = await fetch(`${baseUrl}v1/audio/speech`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ENV.forgeApiKey}`,
          },
          body: JSON.stringify({
            model: "tts-1-hd",
            input: input.text,
            voice: input.voice,
            speed: input.speed,
            response_format: "mp3",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(`语音合成失败: ${response.status} ${errorText}`);
        }

        // 获取音频数据
        const audioBuffer = await response.arrayBuffer();
        
        // 上传到存储
        const fileName = `tts-${Date.now()}-${nanoid(6)}.mp3`;
        const { url } = await storagePut(fileName, Buffer.from(audioBuffer), "audio/mpeg");

        return { url, duration: null };
      }),
  }),

  // 用户反馈路由
  feedback: router({
    // 提交反馈
    submit: publicProcedure
      .input(z.object({
        sourceType: z.enum(["tarot", "bazi", "horoscope", "dream"]),
        sourceId: z.number().optional(),
        rating: z.number().min(1).max(5),
        tags: z.array(z.string()).optional(),
        comment: z.string().max(500).optional(),
        isAnonymous: z.boolean().optional(),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库不可用");

        const feedbackData = {
          userId: ctx.user?.id || null,
          sessionId: input.sessionId || nanoid(),
          sourceType: input.sourceType,
          sourceId: input.sourceId || null,
          rating: input.rating,
          tags: input.tags || [],
          comment: input.comment || null,
          isAnonymous: input.isAnonymous || false,
        };

        await db.insert(userFeedbacks).values(feedbackData);

        return { success: true, message: "感谢您的反馈！" };
      }),

    // 检查是否已提交反馈
    checkSubmitted: publicProcedure
      .input(z.object({
        sourceType: z.enum(["tarot", "bazi", "horoscope", "dream"]),
        sourceId: z.number().optional(),
        sessionId: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { submitted: false };

        // 如果有用户ID，按用户ID查询
        if (ctx.user?.id && input.sourceId) {
          const [existing] = await db
            .select()
            .from(userFeedbacks)
            .where(and(
              eq(userFeedbacks.userId, ctx.user.id),
              eq(userFeedbacks.sourceType, input.sourceType),
              eq(userFeedbacks.sourceId, input.sourceId)
            ))
            .limit(1);
          return { submitted: !!existing };
        }

        // 否则按sessionId查询
        if (input.sessionId) {
          const [existing] = await db
            .select()
            .from(userFeedbacks)
            .where(and(
              eq(userFeedbacks.sessionId, input.sessionId),
              eq(userFeedbacks.sourceType, input.sourceType)
            ))
            .limit(1);
          return { submitted: !!existing };
        }

        return { submitted: false };
      }),

    // 获取反馈统计（管理员用）
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const db = await getDb();
      if (!db) return null;

      const feedbacks = await db
        .select()
        .from(userFeedbacks)
        .orderBy(desc(userFeedbacks.createdAt))
        .limit(500);

      // 按来源类型统计
      const bySource: Record<string, { count: number; avgRating: number; ratings: number[] }> = {};
      
      feedbacks.forEach(f => {
        if (!bySource[f.sourceType]) {
          bySource[f.sourceType] = { count: 0, avgRating: 0, ratings: [] };
        }
        bySource[f.sourceType].count++;
        bySource[f.sourceType].ratings.push(f.rating);
      });

      // 计算平均评分
      Object.keys(bySource).forEach(key => {
        const ratings = bySource[key].ratings;
        bySource[key].avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      });

      // 统计标签使用频率
      const tagCount: Record<string, number> = {};
      feedbacks.forEach(f => {
        const tags = (f.tags as string[] | null) || [];
        tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      return {
        totalFeedbacks: feedbacks.length,
        bySource,
        topTags: Object.entries(tagCount)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        recentFeedbacks: feedbacks.slice(0, 20),
      };
    }),
  }),

  // 联系我们路由
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "请输入您的姓名"),
        email: z.string().email("请输入有效的邮箱地址"),
        subject: z.string().min(1, "请输入主题"),
        category: z.enum(["general", "technical", "billing", "partnership", "feedback", "other"]),
        message: z.string().min(10, "消息内容至少10个字符"),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库连接失败");

        const insertData: Record<string, unknown> = {
          name: input.name,
          email: input.email,
          subject: input.subject,
          category: input.category,
          message: input.message,
          status: "pending",
        };

        if (ctx.user?.id) {
          insertData.userId = ctx.user.id;
        }

        await db.insert(contactSubmissions).values(insertData as typeof contactSubmissions.$inferInsert);

        // 发送邮件通知给管理员
        const categoryLabels: Record<string, string> = {
          general: "一般咨询",
          technical: "技术支持",
          billing: "账单问题",
          partnership: "商务合作",
          feedback: "意见反馈",
          other: "其他",
        };

        try {
          await notifyOwner({
            title: `📩 新联系表单: ${input.subject}`,
            content: `**类型**: ${categoryLabels[input.category] || input.category}\n**姓名**: ${input.name}\n**邮箱**: ${input.email}\n\n**内容**:\n${input.message}`,
          });
        } catch (e) {
          // 通知失败不影响用户提交
          console.error("Failed to send notification:", e);
        }

        return { success: true, message: "您的消息已成功提交，我们会尽快回复您！" };
      }),

    // 管理员获取所有联系表单
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const db = await getDb();
      if (!db) return [];

      const submissions = await db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(100);

      return submissions;
    }),

    // 管理员更新状态
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "replied", "resolved", "closed"]),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

        const db = await getDb();
        if (!db) throw new Error("数据库连接失败");

        const updateData: Record<string, unknown> = {
          status: input.status,
        };

        if (input.adminNotes) {
          updateData.adminNotes = input.adminNotes;
        }

        if (input.status === "replied") {
          updateData.repliedAt = new Date();
        }

        await db.update(contactSubmissions)
          .set(updateData)
          .where(eq(contactSubmissions.id, input.id));

        return { success: true };
      }),
  }),

  // 在线客服聊天路由
  chat: router({
    // 创建新的聊天会话
    createSession: publicProcedure
      .input(z.object({
        userName: z.string().optional(),
        userEmail: z.string().email().optional(),
        topic: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库连接失败");

        const sessionId = nanoid();
        const insertData: Record<string, unknown> = {
          sessionId,
          userName: input.userName || (ctx.user?.name) || "游客",
          userEmail: input.userEmail || ctx.user?.email,
          topic: input.topic || "一般咨询",
          status: "waiting",
        };

        if (ctx.user?.id) {
          insertData.userId = ctx.user.id;
        }

        await db.insert(chatSessions).values(insertData as typeof chatSessions.$inferInsert);

        // 发送系统欢迎消息
        await db.insert(chatMessages).values({
          sessionId,
          senderType: "system",
          senderName: "系统",
          content: "您好！欢迎联系洞察未来客服。请描述您的问题，我们的客服人员将尽快为您服务。",
          messageType: "system",
        });

        // 通知管理员
        try {
          await notifyOwner({
            title: `💬 新客服会话`,
            content: `**用户**: ${insertData.userName}\n**主题**: ${insertData.topic}\n\n请前往管理后台处理`,
          });
        } catch (e) {
          console.error("Failed to send notification:", e);
        }

        return { sessionId };
      }),

    // 发送消息
    sendMessage: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        content: z.string().min(1),
        messageType: z.enum(["text", "image", "file"]).default("text"),
        fileUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库连接失败");

        // 检查会话是否存在
        const sessions = await db.select().from(chatSessions).where(eq(chatSessions.sessionId, input.sessionId)).limit(1);
        if (sessions.length === 0) {
          throw new Error("会话不存在");
        }

        const session = sessions[0];
        if (session.status === "closed") {
          throw new Error("会话已关闭");
        }

        // 插入消息
        await db.insert(chatMessages).values({
          sessionId: input.sessionId,
          senderType: "user",
          senderId: ctx.user?.id,
          senderName: ctx.user?.name || session.userName || "游客",
          content: input.content,
          messageType: input.messageType,
          fileUrl: input.fileUrl,
        });

        // 更新会话最后消息时间
        await db.update(chatSessions)
          .set({ lastMessageAt: new Date() })
          .where(eq(chatSessions.sessionId, input.sessionId));

        // 如果会话状态是等待中，触发AI自动回复
        if (session.status === 'waiting') {
          try {
            const aiResponse = await generateAICustomerServiceReply(input.content);
            if (aiResponse) {
              await db.insert(chatMessages).values({
                sessionId: input.sessionId,
                senderType: "system",
                senderName: "AI助手",
                content: aiResponse,
                messageType: "text",
              });
            }
          } catch (e) {
            console.error("AI auto-reply failed:", e);
          }
        }

        return { success: true };
      }),

    // 获取会话消息
    getMessages: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        lastId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        let query = db.select().from(chatMessages)
          .where(eq(chatMessages.sessionId, input.sessionId))
          .orderBy(chatMessages.createdAt)
          .limit(100);

        if (input.lastId) {
          query = db.select().from(chatMessages)
            .where(and(
              eq(chatMessages.sessionId, input.sessionId),
              sql`${chatMessages.id} > ${input.lastId}`
            ))
            .orderBy(chatMessages.createdAt)
            .limit(100);
        }

        return await query;
      }),

    // 获取会话状态
    getSession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const sessions = await db.select().from(chatSessions)
          .where(eq(chatSessions.sessionId, input.sessionId))
          .limit(1);

        return sessions[0] || null;
      }),

    // 用户关闭会话
    closeSession: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        rating: z.number().min(1).max(5).optional(),
        feedback: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("数据库连接失败");

        await db.update(chatSessions)
          .set({
            status: "closed",
            closedAt: new Date(),
            closedBy: "user",
            rating: input.rating,
            feedback: input.feedback,
          })
          .where(eq(chatSessions.sessionId, input.sessionId));

        // 添加系统消息
        await db.insert(chatMessages).values({
          sessionId: input.sessionId,
          senderType: "system",
          senderName: "系统",
          content: "会话已结束，感谢您的咨询！",
          messageType: "system",
        });

        return { success: true };
      }),

    // 管理员获取所有会话
    adminGetSessions: protectedProcedure
      .input(z.object({
        status: z.enum(["waiting", "active", "closed", "all"]).default("all"),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

        const db = await getDb();
        if (!db) return [];

        if (input.status === "all") {
          return await db.select().from(chatSessions)
            .orderBy(desc(chatSessions.updatedAt))
            .limit(100);
        }

        return await db.select().from(chatSessions)
          .where(eq(chatSessions.status, input.status))
          .orderBy(desc(chatSessions.updatedAt))
          .limit(100);
      }),

    // 管理员发送消息
    adminSendMessage: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        content: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

        const db = await getDb();
        if (!db) throw new Error("数据库连接失败");

        // 插入消息
        await db.insert(chatMessages).values({
          sessionId: input.sessionId,
          senderType: "admin",
          senderId: ctx.user.id,
          senderName: ctx.user.name || "客服",
          content: input.content,
          messageType: "text",
        });

        // 更新会话状态和最后消息时间
        await db.update(chatSessions)
          .set({
            status: "active",
            assignedAdminId: ctx.user.id,
            lastMessageAt: new Date(),
          })
          .where(eq(chatSessions.sessionId, input.sessionId));

        return { success: true };
      }),

    // 管理员关闭会话
    adminCloseSession: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

        const db = await getDb();
        if (!db) throw new Error("数据库连接失败");

        await db.update(chatSessions)
          .set({
            status: "closed",
            closedAt: new Date(),
            closedBy: "admin",
          })
          .where(eq(chatSessions.sessionId, input.sessionId));

        // 添加系统消息
        await db.insert(chatMessages).values({
          sessionId: input.sessionId,
          senderType: "system",
          senderName: "系统",
          content: "客服已结束本次会话，感谢您的咨询！",
          messageType: "system",
        });

        return { success: true };
      }),

    // 管理员获取客服统计数据
    adminGetStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

        const db = await getDb();
        if (!db) {
          return {
            totalSessions: 0,
            waitingSessions: 0,
            activeSessions: 0,
            closedSessions: 0,
            avgRating: 0,
            avgResponseTime: 0,
            todaySessions: 0,
            weekSessions: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };
        }

        // 获取所有会话
        const allSessions = await db.select().from(chatSessions);
        
        // 统计会话数量
        const totalSessions = allSessions.length;
        const waitingSessions = allSessions.filter(s => s.status === 'waiting').length;
        const activeSessions = allSessions.filter(s => s.status === 'active').length;
        const closedSessions = allSessions.filter(s => s.status === 'closed').length;

        // 统计今日和本周会话
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const todaySessions = allSessions.filter(s => 
          s.createdAt && new Date(s.createdAt) >= todayStart
        ).length;
        const weekSessions = allSessions.filter(s => 
          s.createdAt && new Date(s.createdAt) >= weekStart
        ).length;

        // 统计平均评分
        const ratedSessions = allSessions.filter(s => s.rating !== null && s.rating !== undefined);
        const avgRating = ratedSessions.length > 0 
          ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length 
          : 0;

        // 评分分布
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratedSessions.forEach(s => {
          const rating = s.rating as 1 | 2 | 3 | 4 | 5;
          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating]++;
          }
        });

        // 统计平均响应时间（从创建到第一条管理员消息）
        let totalResponseTime = 0;
        let respondedCount = 0;

        for (const session of allSessions) {
          if (session.status !== 'waiting' && session.createdAt) {
            // 获取该会话的消息
            const messages = await db.select().from(chatMessages)
              .where(eq(chatMessages.sessionId, session.sessionId))
              .orderBy(chatMessages.createdAt);
            
            // 找到第一条管理员消息
            const firstAdminMessage = messages.find(m => m.senderType === 'admin');
            if (firstAdminMessage && firstAdminMessage.createdAt) {
              const responseTime = new Date(firstAdminMessage.createdAt).getTime() - new Date(session.createdAt).getTime();
              totalResponseTime += responseTime;
              respondedCount++;
            }
          }
        }

        const avgResponseTime = respondedCount > 0 
          ? Math.round(totalResponseTime / respondedCount / 1000 / 60) // 转换为分钟
          : 0;

        return {
          totalSessions,
          waitingSessions,
          activeSessions,
          closedSessions,
          avgRating: Math.round(avgRating * 10) / 10,
          avgResponseTime,
          todaySessions,
          weekSessions,
          ratingDistribution,
        };
      }),
  }),

  // 报告持久化存储路由
  reports: router({
    // 保存报告
    save: protectedProcedure
      .input(z.object({
        reportType: z.enum(["tarot", "bazi", "horoscope", "dream"]),
        title: z.string().min(1).max(200),
        inputSummary: z.string().optional(),
        reportData: z.any(),
        aiInterpretation: z.string().optional(),
        isPaid: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const reportId = await saveReport({
          userId: ctx.user.id,
          reportType: input.reportType,
          title: input.title,
          inputSummary: input.inputSummary,
          reportData: input.reportData,
          aiInterpretation: input.aiInterpretation,
          isPaid: input.isPaid,
        });

        // Send notification for saved report
        const typeLabel: Record<string, string> = {
          tarot: "Tarot Reading",
          bazi: "BaZi Analysis",
          horoscope: "Horoscope",
          dream: "Dream Interpretation",
        };
        await createNotification({
          userId: ctx.user.id,
          type: "report",
          title: `${typeLabel[input.reportType] || "Report"} Saved`,
          message: `Your ${input.title} has been saved to your profile.`,
          link: "/profile",
          icon: "file",
        });

        return { id: reportId };
      }),

    // 获取报告列表
    list: protectedProcedure
      .input(z.object({
        reportType: z.enum(["tarot", "bazi", "horoscope", "dream"]).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        favoritesOnly: z.boolean().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return getUserReports(ctx.user.id, {
          reportType: input?.reportType,
          limit: input?.limit,
          offset: input?.offset,
          favoritesOnly: input?.favoritesOnly,
        });
      }),

    // 获取单个报告详情
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const report = await getReportById(input.id, ctx.user.id);
        if (!report) {
          throw new Error("Report not found");
        }
        return report;
      }),

    // 切换收藏
    toggleFavorite: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isFavorite = await toggleReportFavorite(input.id, ctx.user.id);
        return { isFavorite };
      }),

    // 删除报告
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const deleted = await deleteReport(input.id, ctx.user.id);
        return { deleted };
      }),
  }),
});

export type AppRouter = typeof appRouter;
