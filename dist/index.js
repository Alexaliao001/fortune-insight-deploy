var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/const.ts
var COOKIE_NAME, ONE_YEAR_MS, AXIOS_TIMEOUT_MS, UNAUTHED_ERR_MSG, NOT_ADMIN_ERR_MSG;
var init_const = __esm({
  "shared/const.ts"() {
    "use strict";
    COOKIE_NAME = "app_session_id";
    ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
    AXIOS_TIMEOUT_MS = 3e4;
    UNAUTHED_ERR_MSG = "Please login (10001)";
    NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
  }
});

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";
var users, memberships, tarotReadings, baziReadings, horoscopes, userGrowth, communityPosts, postLikes, postComments, orders, charityDonations, usageTracking, llmDailyUsage, purchaseCredits, dreamRecords, userFeedbacks, contactSubmissions, chatSessions, chatMessages, savedReports, notifications, broadcastReadReceipts, referrals, referralRewards, compatibilityReports, emailQueue, shareEvents, accessCodes, accessCodeRedemptions;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      /** scrypt hash `salt:hex` for native email login; null = OAuth-only account */
      passwordHash: varchar("passwordHash", { length: 255 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      avatarUrl: text("avatarUrl"),
      zodiacSign: varchar("zodiacSign", { length: 20 }),
      birthDate: timestamp("birthDate"),
      birthTime: varchar("birthTime", { length: 10 }),
      birthPlace: varchar("birthPlace", { length: 100 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
      welcomeEmailSent: boolean("welcomeEmailSent").default(false).notNull(),
      referralCode: varchar("referralCode", { length: 20 }),
      referredBy: int("referredBy")
      // userId of the person who referred this user
    });
    memberships = mysqlTable("memberships", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      type: mysqlEnum("type", ["monthly", "yearly", "lifetime"]).notNull(),
      status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
      startDate: timestamp("startDate").defaultNow().notNull(),
      endDate: timestamp("endDate"),
      price: decimal("price", { precision: 10, scale: 2 }),
      charityAmount: decimal("charityAmount", { precision: 10, scale: 2 }),
      paymentMethod: varchar("paymentMethod", { length: 20 }),
      transactionId: varchar("transactionId", { length: 100 }),
      stripeCustomerId: varchar("stripeCustomerId", { length: 100 }),
      stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 100 }),
      autoRenew: boolean("autoRenew").default(true),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    tarotReadings = mysqlTable("tarot_readings", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      sessionId: varchar("sessionId", { length: 64 }),
      questionType: mysqlEnum("questionType", ["love", "career", "wealth", "health", "general"]).notNull(),
      question: text("question"),
      cards: json("cards"),
      basicReading: text("basicReading"),
      detailedReading: text("detailedReading"),
      isPaid: boolean("isPaid").default(false),
      reportUrl: text("reportUrl"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    baziReadings = mysqlTable("bazi_readings", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      sessionId: varchar("sessionId", { length: 64 }),
      birthYear: int("birthYear").notNull(),
      birthMonth: int("birthMonth").notNull(),
      birthDay: int("birthDay").notNull(),
      birthHour: int("birthHour"),
      birthMinute: int("birthMinute"),
      gender: mysqlEnum("gender", ["male", "female"]),
      baziChart: json("baziChart"),
      personalityAnalysis: text("personalityAnalysis"),
      talentAnalysis: text("talentAnalysis"),
      careerSuggestions: text("careerSuggestions"),
      fullReport: text("fullReport"),
      isPaid: boolean("isPaid").default(false),
      reportUrl: text("reportUrl"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    horoscopes = mysqlTable("horoscopes", {
      id: int("id").autoincrement().primaryKey(),
      zodiacSign: varchar("zodiacSign", { length: 20 }).notNull(),
      periodType: mysqlEnum("periodType", ["daily", "weekly", "monthly"]).notNull(),
      periodDate: timestamp("periodDate").notNull(),
      overallScore: int("overallScore"),
      loveScore: int("loveScore"),
      careerScore: int("careerScore"),
      wealthScore: int("wealthScore"),
      healthScore: int("healthScore"),
      content: text("content"),
      deepAnalysis: text("deepAnalysis"),
      // JSON string with 10-dimension analysis
      advice: text("advice"),
      luckyColor: varchar("luckyColor", { length: 20 }),
      luckyNumber: int("luckyNumber"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    userGrowth = mysqlTable("user_growth", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      selfAwareness: int("selfAwareness").default(0),
      emotionalManagement: int("emotionalManagement").default(0),
      intimateRelationships: int("intimateRelationships").default(0),
      careerPotential: int("careerPotential").default(0),
      wealthMindset: int("wealthMindset").default(0),
      healthWellness: int("healthWellness").default(0),
      spiritualGrowth: int("spiritualGrowth").default(0),
      socialConnection: int("socialConnection").default(0),
      totalPoints: int("totalPoints").default(0),
      level: int("level").default(1),
      badges: json("badges"),
      currentStreak: int("currentStreak").default(0),
      longestStreak: int("longestStreak").default(0),
      lastActiveDate: varchar("lastActiveDate", { length: 10 }),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    communityPosts = mysqlTable("community_posts", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      type: mysqlEnum("type", ["insight", "story", "article"]).default("insight").notNull(),
      title: varchar("title", { length: 200 }),
      content: text("content").notNull(),
      imageUrls: json("imageUrls"),
      relatedReadingId: int("relatedReadingId"),
      relatedReadingType: varchar("relatedReadingType", { length: 20 }),
      likesCount: int("likesCount").default(0),
      commentsCount: int("commentsCount").default(0),
      isKolContent: boolean("isKolContent").default(false),
      status: mysqlEnum("status", ["published", "draft", "hidden"]).default("published").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    postLikes = mysqlTable("post_likes", {
      id: int("id").autoincrement().primaryKey(),
      postId: int("postId").notNull(),
      userId: int("userId").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    postComments = mysqlTable("post_comments", {
      id: int("id").autoincrement().primaryKey(),
      postId: int("postId").notNull(),
      userId: int("userId").notNull(),
      content: text("content").notNull(),
      parentId: int("parentId"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    orders = mysqlTable("orders", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      orderNo: varchar("orderNo", { length: 64 }).notNull().unique(),
      productType: mysqlEnum("productType", ["tarot_detail", "bazi_detail", "dream_detail", "compatibility", "membership_monthly", "membership_yearly", "membership_lifetime"]).notNull(),
      productId: int("productId"),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      charityAmount: decimal("charityAmount", { precision: 10, scale: 2 }),
      paymentMethod: mysqlEnum("paymentMethod", ["wechat", "alipay"]),
      paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
      transactionId: varchar("transactionId", { length: 100 }),
      paidAt: timestamp("paidAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    charityDonations = mysqlTable("charity_donations", {
      id: int("id").autoincrement().primaryKey(),
      orderId: int("orderId").notNull(),
      userId: int("userId"),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      projectName: varchar("projectName", { length: 100 }).notNull(),
      projectDescription: text("projectDescription"),
      status: mysqlEnum("status", ["pending", "donated", "failed"]).default("pending").notNull(),
      donatedAt: timestamp("donatedAt"),
      notificationSent: boolean("notificationSent").default(false),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    usageTracking = mysqlTable("usage_tracking", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      featureType: mysqlEnum("featureType", ["tarot", "bazi", "dream", "horoscope"]).notNull(),
      usedCount: int("usedCount").default(0).notNull(),
      periodType: mysqlEnum("periodType", ["daily", "monthly"]).notNull(),
      periodKey: varchar("periodKey", { length: 10 }).notNull(),
      // "2026-02-06" or "2026-02"
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    llmDailyUsage = mysqlTable("llm_daily_usage", {
      dateKey: varchar("dateKey", { length: 10 }).primaryKey(),
      usedCount: int("usedCount").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    purchaseCredits = mysqlTable("purchase_credits", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      featureType: mysqlEnum("featureType", ["tarot", "bazi", "dream", "compatibility"]).notNull(),
      credits: int("credits").default(1).notNull(),
      // 购买的次数
      usedCredits: int("usedCredits").default(0).notNull(),
      // 已使用的次数
      stripeSessionId: varchar("stripeSessionId", { length: 200 }),
      status: mysqlEnum("status", ["active", "exhausted", "expired"]).default("active").notNull(),
      expiresAt: timestamp("expiresAt"),
      // 可选过期时间
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    dreamRecords = mysqlTable("dream_records", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      sessionId: varchar("sessionId", { length: 64 }),
      title: varchar("title", { length: 200 }),
      dreamContent: text("dreamContent").notNull(),
      dreamDate: timestamp("dreamDate"),
      emotions: json("emotions"),
      // 梦中情绪：["恐惧", "快乐", "困惑"...]
      keyElements: json("keyElements"),
      // 关键元素：["水", "飞翔", "追逐"...]
      dreamType: mysqlEnum("dreamType", ["normal", "nightmare", "lucid", "recurring", "prophetic"]).default("normal"),
      clarity: int("clarity"),
      // 梦境清晰度 1-5
      interpretation: text("interpretation"),
      // AI解读
      psychologyInsight: text("psychologyInsight"),
      // 心理学洞察
      growthSuggestion: text("growthSuggestion"),
      // 成长建议
      symbolAnalysis: json("symbolAnalysis"),
      // 符号分析 [{symbol, meaning}]
      deepAnalysis: text("deepAnalysis"),
      // JSON string with 10-dimension deep analysis
      tags: json("tags"),
      // 用户自定义标签: ["string"...]
      isPaid: boolean("isPaid").default(false),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    userFeedbacks = mysqlTable("user_feedbacks", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      sessionId: varchar("sessionId", { length: 64 }),
      // 反馈来源：tarot塔罗、bazi八字、horoscope星座、dream解梦
      sourceType: mysqlEnum("sourceType", ["tarot", "bazi", "horoscope", "dream"]).notNull(),
      sourceId: int("sourceId"),
      // 关联的记录ID
      rating: int("rating").notNull(),
      // 1-5星评分
      tags: json("tags"),
      // 快捷标签：["解读准确", "建议实用", "体验流畅"...]
      comment: text("comment"),
      // 文字反馈
      isAnonymous: boolean("isAnonymous").default(false),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    contactSubmissions = mysqlTable("contact_submissions", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      // 可选，已登录用户自动关联
      name: varchar("name", { length: 100 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      subject: varchar("subject", { length: 200 }).notNull(),
      category: mysqlEnum("category", ["general", "technical", "billing", "partnership", "feedback", "other"]).default("general").notNull(),
      message: text("message").notNull(),
      status: mysqlEnum("status", ["pending", "replied", "resolved", "closed"]).default("pending").notNull(),
      adminNotes: text("adminNotes"),
      repliedAt: timestamp("repliedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    chatSessions = mysqlTable("chat_sessions", {
      id: int("id").autoincrement().primaryKey(),
      sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
      userId: int("userId"),
      // 可选，游客也可以发起聊天
      userName: varchar("userName", { length: 100 }),
      userEmail: varchar("userEmail", { length: 320 }),
      status: mysqlEnum("status", ["waiting", "active", "closed"]).default("waiting").notNull(),
      assignedAdminId: int("assignedAdminId"),
      topic: varchar("topic", { length: 200 }),
      lastMessageAt: timestamp("lastMessageAt"),
      closedAt: timestamp("closedAt"),
      closedBy: mysqlEnum("closedBy", ["user", "admin", "system"]),
      rating: int("rating"),
      // 用户评分 1-5
      feedback: text("feedback"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    chatMessages = mysqlTable("chat_messages", {
      id: int("id").autoincrement().primaryKey(),
      sessionId: varchar("sessionId", { length: 64 }).notNull(),
      senderType: mysqlEnum("senderType", ["user", "admin", "system"]).notNull(),
      senderId: int("senderId"),
      // 用户或管理员ID
      senderName: varchar("senderName", { length: 100 }),
      content: text("content").notNull(),
      messageType: mysqlEnum("messageType", ["text", "image", "file", "system"]).default("text").notNull(),
      fileUrl: text("fileUrl"),
      isRead: boolean("isRead").default(false),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    savedReports = mysqlTable("saved_reports", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      reportType: mysqlEnum("reportType", ["tarot", "bazi", "horoscope", "dream"]).notNull(),
      title: varchar("title", { length: 200 }).notNull(),
      inputSummary: text("inputSummary"),
      // 用户输入摘要（如问题、生日等）
      reportData: json("reportData").notNull(),
      // 完整的结构化报告数据
      aiInterpretation: text("aiInterpretation"),
      // AI解读文本
      isPaid: boolean("isPaid").default(false),
      isFavorite: boolean("isFavorite").default(false),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    notifications = mysqlTable("notifications", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      // null = broadcast to all users
      type: mysqlEnum("type", ["system", "report", "membership", "community", "admin", "promotion"]).notNull(),
      title: varchar("title", { length: 200 }).notNull(),
      message: text("message").notNull(),
      link: varchar("link", { length: 500 }),
      // optional deep link
      icon: varchar("icon", { length: 50 }),
      // lucide icon name
      isRead: boolean("isRead").default(false).notNull(),
      isBroadcast: boolean("isBroadcast").default(false).notNull(),
      // true = sent to all users
      metadata: json("metadata"),
      // extra data like reportId, postId etc
      expiresAt: timestamp("expiresAt"),
      // optional expiration
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    broadcastReadReceipts = mysqlTable("broadcast_read_receipts", {
      id: int("id").autoincrement().primaryKey(),
      notificationId: int("notificationId").notNull(),
      userId: int("userId").notNull(),
      readAt: timestamp("readAt").defaultNow().notNull()
    });
    referrals = mysqlTable("referrals", {
      id: int("id").autoincrement().primaryKey(),
      referrerId: int("referrerId").notNull(),
      // 邀请人
      referredId: int("referredId").notNull(),
      // 被邀请人
      referralCode: varchar("referralCode", { length: 20 }).notNull(),
      // 使用的邀请码
      status: mysqlEnum("status", ["pending", "completed", "rewarded"]).default("pending").notNull(),
      referrerRewarded: boolean("referrerRewarded").default(false).notNull(),
      referredRewarded: boolean("referredRewarded").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      completedAt: timestamp("completedAt")
    });
    referralRewards = mysqlTable("referral_rewards", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      referralId: int("referralId").notNull(),
      rewardType: mysqlEnum("rewardType", ["bonus_credits"]).default("bonus_credits").notNull(),
      featureType: mysqlEnum("featureType", ["tarot", "bazi", "dream", "all"]).default("all").notNull(),
      creditsAmount: int("creditsAmount").default(1).notNull(),
      claimed: boolean("claimed").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    compatibilityReports = mysqlTable("compatibility_reports", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      sessionId: varchar("sessionId", { length: 64 }),
      person1Name: varchar("person1Name", { length: 100 }),
      person1Sign: varchar("person1Sign", { length: 20 }).notNull(),
      person1BirthDate: timestamp("person1BirthDate"),
      person2Name: varchar("person2Name", { length: 100 }),
      person2Sign: varchar("person2Sign", { length: 20 }).notNull(),
      person2BirthDate: timestamp("person2BirthDate"),
      overallScore: int("overallScore"),
      scores: json("scores"),
      // { love, communication, values, trust, growth, passion }
      basicReading: text("basicReading"),
      deepAnalysis: text("deepAnalysis"),
      // Full multi-dimension LLM analysis
      isPaid: boolean("isPaid").default(false),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    emailQueue = mysqlTable("email_queue", {
      id: int("id").primaryKey().autoincrement(),
      userId: int("userId").notNull(),
      email: varchar("email", { length: 255 }).notNull(),
      userName: varchar("userName", { length: 255 }),
      templateType: mysqlEnum("templateType", ["welcome", "conversion", "reengagement", "referral_reward", "custom"]).notNull(),
      subject: varchar("subject", { length: 500 }).notNull(),
      htmlContent: text("htmlContent").notNull(),
      status: mysqlEnum("status", ["pending", "sent", "failed", "cancelled"]).default("pending").notNull(),
      scheduledAt: timestamp("scheduledAt").notNull(),
      sentAt: timestamp("sentAt"),
      metadata: json("metadata").$type(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    shareEvents = mysqlTable("share_events", {
      id: int("id").primaryKey().autoincrement(),
      userId: int("userId"),
      // nullable for anonymous shares
      platform: varchar("platform", { length: 30 }).notNull(),
      // whatsapp, telegram, twitter, wechat, weibo, native, download, copy
      type: varchar("type", { length: 30 }).notNull(),
      // tarot, bazi, horoscope, dream, compatibility
      lang: varchar("lang", { length: 5 }).default("en").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    accessCodes = mysqlTable("access_codes", {
      id: int("id").autoincrement().primaryKey(),
      code: varchar("code", { length: 40 }).notNull().unique(),
      label: varchar("label", { length: 100 }),
      membershipType: mysqlEnum("membershipType", ["monthly", "yearly", "lifetime"]).default("lifetime").notNull(),
      maxUses: int("maxUses").default(30).notNull(),
      // 总兑换上限
      usedCount: int("usedCount").default(0).notNull(),
      status: mysqlEnum("status", ["active", "disabled", "exhausted"]).default("active").notNull(),
      expiresAt: timestamp("expiresAt"),
      // null = 永不过期
      createdBy: int("createdBy"),
      // admin userId
      note: varchar("note", { length: 200 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    accessCodeRedemptions = mysqlTable("access_code_redemptions", {
      id: int("id").autoincrement().primaryKey(),
      codeId: int("codeId").notNull(),
      code: varchar("code", { length: 40 }).notNull(),
      userId: int("userId").notNull(),
      membershipType: mysqlEnum("membershipType", ["monthly", "yearly", "lifetime"]).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var env_exports = {};
__export(env_exports, {
  ENV: () => ENV,
  warnMissingEnv: () => warnMissingEnv
});
function warnMissingEnv() {
  const missing = [];
  if (!ENV.cookieSecret) missing.push("JWT_SECRET");
  if (!ENV.databaseUrl) missing.push("DATABASE_URL");
  if (ENV.isProduction) {
    if (!ENV.llmApiKey && !ENV.forgeApiKey) {
      missing.push("LLM_API_KEY (or BUILT_IN_FORGE_API_KEY)");
    }
    if (!ENV.stripeSecretKey) missing.push("STRIPE_SECRET_KEY");
  }
  if (missing.length > 0) {
    console.warn(
      `[ENV] Missing recommended variables: ${missing.join(", ")}. Some features may not work.`
    );
  }
}
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      llmApiUrl: process.env.LLM_API_URL ?? "",
      llmApiKey: process.env.LLM_API_KEY ?? "",
      llmModel: process.env.LLM_MODEL ?? "",
      llmDailyMaxCalls: process.env.LLM_DAILY_MAX_CALLS ?? "",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
      stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
      /** Public site URL used in emails/share links. Override via APP_BASE_URL. */
      appBaseUrl: (process.env.APP_BASE_URL ?? "https://fortunesite.one").replace(
        /\/$/,
        ""
      )
    };
  }
});

// server/products.ts
function calculateCharityAmount(productId, amount) {
  const product = PRODUCTS[productId];
  const percentage = "charityPercentage" in product ? product.charityPercentage : 10;
  return Math.floor(amount * percentage / 100);
}
function getSinglePurchaseProducts() {
  return Object.entries(PRODUCTS).filter(([key, p]) => "featureType" in p && p.interval === "one_time" && !["TAROT_DEEP_READING", "BAZI_FULL_REPORT"].includes(key)).map(([key, p]) => ({ productKey: key, ...p }));
}
function getMembershipProducts() {
  return Object.entries(PRODUCTS).filter(([_, p]) => p.interval !== "one_time" || p.id.includes("lifetime")).filter(([key]) => ["MONTHLY_MEMBERSHIP", "YEARLY_MEMBERSHIP", "LIFETIME_MEMBERSHIP"].includes(key)).map(([key, p]) => ({ productKey: key, ...p }));
}
var FREE_LIMITS, PRODUCTS;
var init_products = __esm({
  "server/products.ts"() {
    "use strict";
    FREE_LIMITS = {
      tarot: { count: 1, period: "daily", label: "\u6BCF\u59291\u6B21\u514D\u8D39" },
      bazi: { count: 1, period: "monthly", label: "\u6BCF\u67081\u6B21\u514D\u8D39" },
      dream: { count: 1, period: "monthly", label: "\u6BCF\u67081\u6B21\u514D\u8D39" },
      horoscope: { count: -1, period: "daily", label: "\u65E0\u9650\u514D\u8D39" }
      // -1 = unlimited
    };
    PRODUCTS = {
      // === 单次购买产品（低价转化） ===
      // 单次塔罗深度解读
      TAROT_SINGLE: {
        id: "tarot_single",
        name: "Tarot Deep Reading",
        nameZh: "\u5854\u7F57\u6DF1\u5EA6\u89E3\u8BFB",
        description: "One deep tarot reading with detailed analysis",
        descriptionZh: "\u4E00\u6B21\u6DF1\u5EA6\u5854\u7F57\u724C\u89E3\u8BFB\uFF0C\u542B\u8BE6\u7EC6\u5206\u6790\u62A5\u544A",
        price: 199,
        // $1.99
        currency: "usd",
        interval: "one_time",
        featureType: "tarot",
        credits: 1
      },
      // 塔罗3次包
      TAROT_PACK_3: {
        id: "tarot_pack_3",
        name: "Tarot 3-Pack",
        nameZh: "\u5854\u7F573\u6B21\u5305",
        description: "3 deep tarot readings at a discount",
        descriptionZh: "3\u6B21\u6DF1\u5EA6\u5854\u7F57\u89E3\u8BFB\uFF0C\u4F18\u60E0\u4EF7",
        price: 499,
        // $4.99 (save 17%)
        currency: "usd",
        interval: "one_time",
        featureType: "tarot",
        credits: 3
      },
      // 单次八字完整报告
      BAZI_SINGLE: {
        id: "bazi_single",
        name: "BaZi Full Report",
        nameZh: "\u516B\u5B57\u5B8C\u6574\u62A5\u544A",
        description: "One comprehensive BaZi destiny analysis",
        descriptionZh: "\u4E00\u6B21\u5B8C\u6574\u7684\u516B\u5B57\u547D\u7406\u5206\u6790\u62A5\u544A",
        price: 499,
        // $4.99
        currency: "usd",
        interval: "one_time",
        featureType: "bazi",
        credits: 1
      },
      // 单次解梦深度分析
      DREAM_SINGLE: {
        id: "dream_single",
        name: "Dream Deep Analysis",
        nameZh: "\u89E3\u68A6\u6DF1\u5EA6\u5206\u6790",
        description: "One in-depth dream interpretation with psychology insights",
        descriptionZh: "\u4E00\u6B21\u6DF1\u5EA6\u68A6\u5883\u89E3\u8BFB\uFF0C\u542B\u5FC3\u7406\u5B66\u6D1E\u5BDF",
        price: 199,
        // $1.99
        currency: "usd",
        interval: "one_time",
        featureType: "dream",
        credits: 1
      },
      // 解梦5次包
      DREAM_PACK_5: {
        id: "dream_pack_5",
        name: "Dream 5-Pack",
        nameZh: "\u89E3\u68A65\u6B21\u5305",
        description: "5 dream interpretations at a discount",
        descriptionZh: "5\u6B21\u6DF1\u5EA6\u89E3\u68A6\u5206\u6790\uFF0C\u4F18\u60E0\u4EF7",
        price: 799,
        // $7.99 (save 20%)
        currency: "usd",
        interval: "one_time",
        featureType: "dream",
        credits: 5
      },
      // === 会员订阅（高价值锁定） ===
      // 月度会员
      MONTHLY_MEMBERSHIP: {
        id: "monthly_membership",
        name: "Monthly Membership",
        nameZh: "\u6708\u5EA6\u4F1A\u5458",
        description: "Unlimited access to all features",
        descriptionZh: "\u65E0\u9650\u6B21\u4F7F\u7528\u6240\u6709\u529F\u80FD",
        price: 999,
        // $9.99
        currency: "usd",
        interval: "month",
        features: [
          "\u65E0\u9650\u6B21\u5854\u7F57\u5360\u535C",
          "\u65E0\u9650\u6B21\u516B\u5B57\u5206\u6790",
          "\u65E0\u9650\u6B21\u89E3\u68A6\u5206\u6790",
          "\u6DF1\u5EA6\u89E3\u8BFB\u62A5\u544A",
          "\u4E13\u5C5E\u6210\u957F\u5EFA\u8BAE",
          "\u4F18\u5148\u5BA2\u670D\u652F\u6301"
        ],
        featuresEn: [
          "Unlimited Tarot Readings",
          "Unlimited BaZi Analysis",
          "Unlimited Dream Interpretation",
          "Deep Analysis Reports",
          "Personal Growth Advice",
          "Priority Support"
        ],
        charityPercentage: 10
      },
      // 年度会员
      YEARLY_MEMBERSHIP: {
        id: "yearly_membership",
        name: "Yearly Membership",
        nameZh: "\u5E74\u5EA6\u4F1A\u5458",
        description: "Best value - save 50% compared to monthly",
        descriptionZh: "\u6700\u8D85\u503C - \u6BD4\u6708\u4ED8\u8282\u770150%",
        price: 5999,
        // $59.99 (= $5/month)
        currency: "usd",
        interval: "year",
        features: [
          "\u5305\u542B\u6708\u5EA6\u4F1A\u5458\u6240\u6709\u6743\u76CA",
          "\u5E74\u5EA6\u8FD0\u52BF\u62A5\u544A",
          "\u4E13\u5C5E\u751F\u547D\u4E4B\u82B1\u5FBD\u7AE0",
          "\u793E\u533AVIP\u6807\u8BC6",
          "\u4F18\u5148\u4F53\u9A8C\u65B0\u529F\u80FD"
        ],
        featuresEn: [
          "All Monthly Membership Benefits",
          "Annual Fortune Report",
          "Exclusive Life Flower Badge",
          "Community VIP Badge",
          "Early Access to New Features"
        ],
        charityPercentage: 10,
        popular: true
      },
      // 终身会员
      LIFETIME_MEMBERSHIP: {
        id: "lifetime_membership",
        name: "Lifetime Membership",
        nameZh: "\u7EC8\u8EAB\u4F1A\u5458",
        description: "One-time purchase, lifetime access to all premium features",
        descriptionZh: "\u4E00\u6B21\u8D2D\u4E70\uFF0C\u7EC8\u8EAB\u4F7F\u7528\u6240\u6709\u9AD8\u7EA7\u529F\u80FD",
        price: 14999,
        // $149.99
        currency: "usd",
        interval: "one_time",
        features: [
          "\u5305\u542B\u5E74\u5EA6\u4F1A\u5458\u6240\u6709\u6743\u76CA",
          "\u7EC8\u8EAB\u514D\u8D39\u4F7F\u7528",
          "\u4E13\u5C5E\u5B9A\u5236\u62A5\u544A",
          "\u4E00\u5BF9\u4E00\u54A8\u8BE2\u673A\u4F1A",
          "\u521B\u59CB\u4F1A\u5458\u8363\u8A89"
        ],
        featuresEn: [
          "All Yearly Membership Benefits",
          "Lifetime Free Access",
          "Custom Reports",
          "1-on-1 Consultation",
          "Founding Member Honor"
        ],
        charityPercentage: 10
      },
      // 单次合盘分析
      COMPATIBILITY_SINGLE: {
        id: "compatibility_single",
        name: "Compatibility Analysis",
        nameZh: "\u5408\u76D8\u5206\u6790",
        description: "One in-depth relationship compatibility analysis",
        descriptionZh: "\u4E00\u6B21\u6DF1\u5EA6\u5173\u7CFB\u517C\u5BB9\u6027\u5206\u6790\u62A5\u544A",
        price: 299,
        // $2.99
        currency: "usd",
        interval: "one_time",
        featureType: "compatibility",
        credits: 1
      },
      // 保留旧的产品ID兼容性
      TAROT_DEEP_READING: {
        id: "tarot_deep_reading",
        name: "Tarot Deep Reading",
        nameZh: "\u5854\u7F57\u6DF1\u5EA6\u89E3\u8BFB",
        description: "Single deep tarot reading",
        descriptionZh: "\u5355\u6B21\u5854\u7F57\u6DF1\u5EA6\u89E3\u8BFB",
        price: 199,
        currency: "usd",
        interval: "one_time",
        featureType: "tarot",
        credits: 1
      },
      BAZI_FULL_REPORT: {
        id: "bazi_full_report",
        name: "BaZi Full Report",
        nameZh: "\u516B\u5B57\u8BE6\u6279\u62A5\u544A",
        description: "Single comprehensive BaZi analysis",
        descriptionZh: "\u5355\u6B21\u5B8C\u6574\u516B\u5B57\u547D\u7406\u5206\u6790",
        price: 499,
        currency: "usd",
        interval: "one_time",
        featureType: "bazi",
        credits: 1
      }
    };
  }
});

// server/trialPolicy.ts
function resolveSignupTrialDays(raw3 = process.env.SIGNUP_TRIAL_DAYS) {
  if (raw3 === void 0 || raw3.trim() === "") {
    return DEFAULT_SIGNUP_TRIAL_DAYS;
  }
  const n = Number.parseInt(raw3, 10);
  if (!Number.isFinite(n) || n < 0) {
    return DEFAULT_SIGNUP_TRIAL_DAYS;
  }
  return Math.min(365, Math.floor(n));
}
var DEFAULT_SIGNUP_TRIAL_DAYS;
var init_trialPolicy = __esm({
  "server/trialPolicy.ts"() {
    "use strict";
    DEFAULT_SIGNUP_TRIAL_DAYS = 14;
  }
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { and, sql, like, desc } from "drizzle-orm";
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return { isNew: false };
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.openId, user.openId)).limit(1);
    const isNew = existing.length === 0;
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
    return { isNew };
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
function getTodayKey() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function getMonthKey() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
}
async function grantSignupTrialIfNeeded(userId) {
  const db = await getDb();
  if (!db) return { granted: false };
  const trialDays = resolveSignupTrialDays();
  if (trialDays <= 0) {
    return { granted: false, trialDays: 0 };
  }
  try {
    if (await hasActiveMembership(userId)) {
      return { granted: false, trialDays };
    }
    const [priorTrial] = await db.select({ id: memberships.id }).from(memberships).where(
      and(
        eq(memberships.userId, userId),
        like(memberships.paymentMethod, "trial:%")
      )
    ).limit(1);
    if (priorTrial) {
      return { granted: false, trialDays };
    }
    const [anyMembership] = await db.select({ id: memberships.id, paymentMethod: memberships.paymentMethod }).from(memberships).where(eq(memberships.userId, userId)).limit(1);
    if (anyMembership) {
      return { granted: false, trialDays };
    }
    const now = /* @__PURE__ */ new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + trialDays);
    await db.insert(memberships).values({
      userId,
      type: "monthly",
      // enum only has monthly/yearly/lifetime; UI detects trial via paymentMethod
      status: "active",
      startDate: now,
      endDate,
      price: "0.00",
      charityAmount: "0.00",
      paymentMethod: SIGNUP_TRIAL_PAYMENT_METHOD,
      transactionId: `trial_${userId}_${now.getTime()}`,
      autoRenew: false
    });
    return { granted: true, endDate, trialDays };
  } catch (error) {
    console.error("[Trial] Failed to grant signup trial:", error);
    return { granted: false, trialDays };
  }
}
async function hasActiveMembership(userId) {
  const db = await getDb();
  if (!db) return false;
  const [membership] = await db.select().from(memberships).where(
    and(
      eq(memberships.userId, userId),
      eq(memberships.status, "active")
    )
  ).orderBy(desc(memberships.createdAt)).limit(1);
  if (!membership) return false;
  if (membership.endDate && new Date(membership.endDate) < /* @__PURE__ */ new Date()) {
    await db.update(memberships).set({ status: "expired", autoRenew: false }).where(eq(memberships.id, membership.id));
    return false;
  }
  return true;
}
async function getUsageStatus(userId, featureType) {
  const db = await getDb();
  if (!db) return { canUse: true, freeRemaining: 999, paidCredits: 0, isMember: false };
  const isMember = await hasActiveMembership(userId);
  if (isMember) {
    return { canUse: true, freeRemaining: -1, paidCredits: 0, isMember: true };
  }
  const limits = FREE_LIMITS[featureType];
  if (limits.count === -1) {
    return { canUse: true, freeRemaining: -1, paidCredits: 0, isMember: false };
  }
  const periodKey = limits.period === "daily" ? getTodayKey() : getMonthKey();
  const [usage] = await db.select().from(usageTracking).where(
    and(
      eq(usageTracking.userId, userId),
      eq(usageTracking.featureType, featureType),
      eq(usageTracking.periodType, limits.period),
      eq(usageTracking.periodKey, periodKey)
    )
  ).limit(1);
  const usedCount = usage?.usedCount ?? 0;
  const freeRemaining = Math.max(0, limits.count - usedCount);
  const credits = await db.select().from(purchaseCredits).where(
    and(
      eq(purchaseCredits.userId, userId),
      eq(purchaseCredits.featureType, featureType),
      eq(purchaseCredits.status, "active")
    )
  );
  const paidCredits = credits.reduce((sum, c) => sum + (c.credits - c.usedCredits), 0);
  return {
    canUse: freeRemaining > 0 || paidCredits > 0,
    freeRemaining,
    paidCredits,
    isMember: false
  };
}
async function consumeUsage(userId, featureType) {
  const db = await getDb();
  if (!db) return { consumed: true, source: "free" };
  const isMember = await hasActiveMembership(userId);
  if (isMember) {
    return { consumed: true, source: "member" };
  }
  const limits = FREE_LIMITS[featureType];
  if (limits.count === -1) {
    return { consumed: true, source: "free" };
  }
  const periodKey = limits.period === "daily" ? getTodayKey() : getMonthKey();
  const [usage] = await db.select().from(usageTracking).where(
    and(
      eq(usageTracking.userId, userId),
      eq(usageTracking.featureType, featureType),
      eq(usageTracking.periodType, limits.period),
      eq(usageTracking.periodKey, periodKey)
    )
  ).limit(1);
  const usedCount = usage?.usedCount ?? 0;
  if (usedCount < limits.count) {
    if (usage) {
      await db.update(usageTracking).set({ usedCount: sql`${usageTracking.usedCount} + 1` }).where(eq(usageTracking.id, usage.id));
    } else {
      await db.insert(usageTracking).values({
        userId,
        featureType,
        usedCount: 1,
        periodType: limits.period,
        periodKey
      });
    }
    return { consumed: true, source: "free" };
  }
  const [credit] = await db.select().from(purchaseCredits).where(
    and(
      eq(purchaseCredits.userId, userId),
      eq(purchaseCredits.featureType, featureType),
      eq(purchaseCredits.status, "active")
    )
  ).orderBy(purchaseCredits.createdAt).limit(1);
  if (credit && credit.usedCredits < credit.credits) {
    const newUsed = credit.usedCredits + 1;
    await db.update(purchaseCredits).set({
      usedCredits: newUsed,
      status: newUsed >= credit.credits ? "exhausted" : "active"
    }).where(eq(purchaseCredits.id, credit.id));
    return { consumed: true, source: "paid" };
  }
  return { consumed: false, source: "free" };
}
async function addPurchaseCredits(userId, featureType, credits, stripeSessionId) {
  const db = await getDb();
  if (!db) return;
  await db.insert(purchaseCredits).values({
    userId,
    featureType,
    credits,
    usedCredits: 0,
    stripeSessionId,
    status: "active"
  });
}
async function saveReport(report) {
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
      isPaid: report.isPaid ?? false
    });
    return result[0].insertId;
  } catch (error) {
    console.error("[Database] Failed to save report:", error);
    return null;
  }
}
async function getUserReports(userId, options) {
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
    db.select().from(savedReports).where(whereClause).orderBy(desc(savedReports.createdAt)).limit(options?.limit ?? 20).offset(options?.offset ?? 0),
    db.select({ count: sql`count(*)` }).from(savedReports).where(whereClause)
  ]);
  return { reports, total: countResult[0]?.count ?? 0 };
}
async function getReportById(reportId, userId) {
  const db = await getDb();
  if (!db) return null;
  const [report] = await db.select().from(savedReports).where(and(eq(savedReports.id, reportId), eq(savedReports.userId, userId))).limit(1);
  return report ?? null;
}
async function toggleReportFavorite(reportId, userId) {
  const db = await getDb();
  if (!db) return false;
  const report = await getReportById(reportId, userId);
  if (!report) return false;
  await db.update(savedReports).set({ isFavorite: !report.isFavorite }).where(eq(savedReports.id, reportId));
  return !report.isFavorite;
}
async function deleteReport(reportId, userId) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.delete(savedReports).where(and(eq(savedReports.id, reportId), eq(savedReports.userId, userId)));
  return result[0].affectedRows > 0;
}
var _db, SIGNUP_TRIAL_PAYMENT_METHOD;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    init_schema();
    init_products();
    init_trialPolicy();
    init_schema();
    _db = null;
    SIGNUP_TRIAL_PAYMENT_METHOD = "trial:signup";
  }
});

// shared/_core/errors.ts
var HttpError, ForbiddenError;
var init_errors = __esm({
  "shared/_core/errors.ts"() {
    "use strict";
    HttpError = class extends Error {
      constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
      }
    };
    ForbiddenError = (msg) => new HttpError(403, msg);
  }
});

// server/_core/sdk.ts
var sdk_exports = {};
__export(sdk_exports, {
  sdk: () => sdk
});
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString, EXCHANGE_TOKEN_PATH, GET_USER_INFO_PATH, GET_USER_INFO_WITH_JWT_PATH, OAuthService, createOAuthHttpClient, SDKServer, sdk;
var init_sdk = __esm({
  "server/_core/sdk.ts"() {
    "use strict";
    init_const();
    init_errors();
    init_db();
    init_env();
    isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
    EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
    GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
    GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
    OAuthService = class {
      constructor(client) {
        this.client = client;
        console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
        if (!ENV.oAuthServerUrl) {
          console.error(
            "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
          );
        }
      }
      decodeState(state) {
        const redirectUri = atob(state);
        return redirectUri;
      }
      async getTokenByCode(code, state) {
        const payload = {
          clientId: ENV.appId,
          grantType: "authorization_code",
          code,
          redirectUri: this.decodeState(state)
        };
        const { data } = await this.client.post(
          EXCHANGE_TOKEN_PATH,
          payload
        );
        return data;
      }
      async getUserInfoByToken(token) {
        const { data } = await this.client.post(
          GET_USER_INFO_PATH,
          {
            accessToken: token.accessToken
          }
        );
        return data;
      }
    };
    createOAuthHttpClient = () => axios.create({
      baseURL: ENV.oAuthServerUrl,
      timeout: AXIOS_TIMEOUT_MS
    });
    SDKServer = class {
      client;
      oauthService;
      constructor(client = createOAuthHttpClient()) {
        this.client = client;
        this.oauthService = new OAuthService(this.client);
      }
      deriveLoginMethod(platforms, fallback) {
        if (fallback && fallback.length > 0) return fallback;
        if (!Array.isArray(platforms) || platforms.length === 0) return null;
        const set = new Set(
          platforms.filter((p) => typeof p === "string")
        );
        if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
        if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
        if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
        if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
          return "microsoft";
        if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
        const first = Array.from(set)[0];
        return first ? first.toLowerCase() : null;
      }
      /**
       * Exchange OAuth authorization code for access token
       * @example
       * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
       */
      async exchangeCodeForToken(code, state) {
        return this.oauthService.getTokenByCode(code, state);
      }
      /**
       * Get user information using access token
       * @example
       * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
       */
      async getUserInfo(accessToken) {
        const data = await this.oauthService.getUserInfoByToken({
          accessToken
        });
        const loginMethod = this.deriveLoginMethod(
          data?.platforms,
          data?.platform ?? data.platform ?? null
        );
        return {
          ...data,
          platform: loginMethod,
          loginMethod
        };
      }
      parseCookies(cookieHeader) {
        if (!cookieHeader) {
          return /* @__PURE__ */ new Map();
        }
        const parsed = parseCookieHeader(cookieHeader);
        return new Map(Object.entries(parsed));
      }
      getSessionSecret() {
        const secret = ENV.cookieSecret;
        return new TextEncoder().encode(secret);
      }
      /**
       * Create a session token for a Manus user openId
       * @example
       * const sessionToken = await sdk.createSessionToken(userInfo.openId);
       */
      async createSessionToken(openId, options = {}) {
        return this.signSession(
          {
            openId,
            appId: ENV.appId || "local",
            name: options.name || "user"
          },
          options
        );
      }
      async signSession(payload, options = {}) {
        const issuedAt = Date.now();
        const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
        const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
        const secretKey = this.getSessionSecret();
        return new SignJWT({
          openId: payload.openId,
          appId: payload.appId,
          name: payload.name
        }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
      }
      async verifySession(cookieValue) {
        if (!cookieValue) {
          console.warn("[Auth] Missing session cookie");
          return null;
        }
        try {
          const secretKey = this.getSessionSecret();
          const { payload } = await jwtVerify(cookieValue, secretKey, {
            algorithms: ["HS256"]
          });
          const { openId, appId, name } = payload;
          if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
            console.warn("[Auth] Session payload missing required fields");
            return null;
          }
          return {
            openId,
            appId,
            name
          };
        } catch (error) {
          console.warn("[Auth] Session verification failed", String(error));
          return null;
        }
      }
      async getUserInfoWithJwt(jwtToken) {
        const payload = {
          jwtToken,
          projectId: ENV.appId
        };
        const { data } = await this.client.post(
          GET_USER_INFO_WITH_JWT_PATH,
          payload
        );
        const loginMethod = this.deriveLoginMethod(
          data?.platforms,
          data?.platform ?? data.platform ?? null
        );
        return {
          ...data,
          platform: loginMethod,
          loginMethod
        };
      }
      async authenticateRequest(req) {
        const cookies = this.parseCookies(req.headers.cookie);
        const sessionCookie = cookies.get(COOKIE_NAME);
        const session = await this.verifySession(sessionCookie);
        if (!session) {
          throw ForbiddenError("Invalid session cookie");
        }
        const sessionUserId = session.openId;
        const signedInAt = /* @__PURE__ */ new Date();
        let user = await getUserByOpenId(sessionUserId);
        if (!user) {
          try {
            const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
            await upsertUser({
              openId: userInfo.openId,
              name: userInfo.name || null,
              email: userInfo.email ?? null,
              loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
              lastSignedIn: signedInAt
            });
            user = await getUserByOpenId(userInfo.openId);
          } catch (error) {
            console.error("[Auth] Failed to sync user from OAuth:", error);
            throw ForbiddenError("Failed to sync user info");
          }
        }
        if (!user) {
          throw ForbiddenError("User not found");
        }
        await upsertUser({
          openId: user.openId,
          lastSignedIn: signedInAt
        });
        await grantSignupTrialIfNeeded(user.id).catch((err) => {
          console.error("[Auth] grantSignupTrialIfNeeded failed", err);
        });
        return user;
      }
    };
    sdk = new SDKServer();
  }
});

// server/pdfGenerator.ts
var pdfGenerator_exports = {};
__export(pdfGenerator_exports, {
  generateBaziPDF: () => generateBaziPDF,
  generateBaziPDFHTML: () => generateBaziPDFHTML,
  generateDreamPDF: () => generateDreamPDF,
  generateDreamPDFHTML: () => generateDreamPDFHTML
});
function formatDate(date) {
  if (!date) return "\u672A\u77E5\u65E5\u671F";
  const d = new Date(date);
  return `${d.getFullYear()}\u5E74${d.getMonth() + 1}\u6708${d.getDate()}\u65E5`;
}
function cleanMarkdown(text2) {
  return text2.replace(/#{1,6}\s/g, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").replace(/\n{3,}/g, "\n\n");
}
function generateDreamHTML(dream, index) {
  const emotions = Array.isArray(dream.emotions) ? dream.emotions.join("\u3001") : "";
  const elements = Array.isArray(dream.keyElements) ? dream.keyElements.join("\u3001") : "";
  const interpretation = dream.interpretation ? cleanMarkdown(dream.interpretation) : "\u6682\u65E0\u89E3\u8BFB";
  return `
    <div class="dream-card" style="page-break-inside: avoid; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.3);">
      ${index !== void 0 ? `<div style="color: rgba(139, 92, 246, 0.6); font-size: 12px; margin-bottom: 10px;">\u68A6\u5883\u8BB0\u5F55 #${index + 1}</div>` : ""}
      
      <h2 style="color: #a78bfa; font-size: 22px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 28px;">\u{1F319}</span>
        ${dream.title || "\u672A\u547D\u540D\u68A6\u5883"}
      </h2>
      
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; font-size: 13px; color: #94a3b8;">
        <span>\u{1F4C5} ${formatDate(dream.createdAt)}</span>
        <span>\u{1F3F7}\uFE0F ${dreamTypeLabels[dream.dreamType || "normal"]}</span>
        ${dream.clarity ? `<span>\u2728 \u6E05\u6670\u5EA6 ${dream.clarity}/5</span>` : ""}
      </div>
      
      <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="color: #60a5fa; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">\u68A6\u5883\u5185\u5BB9</h3>
        <p style="color: #e2e8f0; line-height: 1.8; margin: 0; white-space: pre-wrap;">${dream.dreamContent}</p>
      </div>
      
      ${emotions || elements ? `
      <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
        ${emotions ? `
        <div style="flex: 1; min-width: 200px;">
          <h4 style="color: #f472b6; font-size: 13px; margin: 0 0 8px 0;">\u{1F4AD} \u68A6\u4E2D\u60C5\u7EEA</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${dream.emotions.map((e) => `<span style="background: rgba(244, 114, 182, 0.2); color: #f472b6; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${e}</span>`).join("")}
          </div>
        </div>
        ` : ""}
        ${elements ? `
        <div style="flex: 1; min-width: 200px;">
          <h4 style="color: #fbbf24; font-size: 13px; margin: 0 0 8px 0;">\u2728 \u5173\u952E\u5143\u7D20</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${dream.keyElements.map((e) => `<span style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${e}</span>`).join("")}
          </div>
        </div>
        ` : ""}
      </div>
      ` : ""}
      
      <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #8b5cf6;">
        <h3 style="color: #a78bfa; font-size: 16px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
          <span>\u{1F52E}</span> AI\u667A\u80FD\u89E3\u8BFB
        </h3>
        <div style="color: #e2e8f0; line-height: 1.9; white-space: pre-wrap; font-size: 14px;">${interpretation}</div>
      </div>
    </div>
  `;
}
function generateDreamPDFHTML(dreams, title) {
  const isSingle = dreams.length === 1;
  const pageTitle = title || (isSingle ? dreams[0].title || "\u68A6\u5883\u89E3\u8BFB\u62A5\u544A" : "\u68A6\u5883\u65E5\u8BB0");
  const dreamsHTML = dreams.map(
    (dream, index) => generateDreamHTML(dream, isSingle ? void 0 : index)
  ).join("");
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pageTitle} - \u6D1E\u5BDF\u672A\u6765</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding: 40px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
      border-radius: 20px;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .logo {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .site-name {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 20px;
      color: #94a3b8;
      margin-bottom: 15px;
    }
    
    .report-meta {
      font-size: 13px;
      color: #64748b;
    }
    
    .footer {
      text-align: center;
      margin-top: 50px;
      padding: 30px;
      border-top: 1px solid rgba(139, 92, 246, 0.2);
      color: #64748b;
      font-size: 12px;
    }
    
    .footer-logo {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .disclaimer {
      margin-top: 15px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      font-size: 11px;
      line-height: 1.6;
    }
    
    @media print {
      body {
        background: white;
        color: #1a1a2e;
        padding: 20px;
      }
      
      .dream-card {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
      }
      
      .header {
        background: #f1f5f9 !important;
        border: 1px solid #e2e8f0 !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">\u{1F319}\u2728</div>
      <div class="site-name">\u6D1E\u5BDF\u672A\u6765</div>
      <div class="report-title">${pageTitle}</div>
      <div class="report-meta">
        \u751F\u6210\u65F6\u95F4\uFF1A${formatDate(/* @__PURE__ */ new Date())} | 
        \u5171 ${dreams.length} \u6761\u68A6\u5883\u8BB0\u5F55
      </div>
    </div>
    
    <div class="dreams-container">
      ${dreamsHTML}
    </div>
    
    <div class="footer">
      <div class="footer-logo">\u{1F319}</div>
      <div>\u6D1E\u5BDF\u672A\u6765 - AI\u9A71\u52A8\u7684\u5FC3\u7075\u6210\u957F\u5E73\u53F0</div>
      <div class="disclaimer">
        \u{1F4A1} \u68A6\u5883\u89E3\u8BFB\u4EC5\u4F9B\u53C2\u8003\uFF0C\u65E8\u5728\u5E2E\u52A9\u60A8\u8FDB\u884C\u81EA\u6211\u63A2\u7D22\u548C\u5FC3\u7406\u6210\u957F\u3002
        \u771F\u6B63\u7684\u667A\u6167\u6765\u81EA\u60A8\u5BF9\u81EA\u5DF1\u5185\u5FC3\u7684\u89C9\u5BDF\u4E0E\u7406\u89E3\u3002
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
async function generateDreamPDF(dreams, title) {
  const html = generateDreamPDFHTML(dreams, title);
  return Buffer.from(html, "utf-8");
}
function generateBaziHTML(bazi, index) {
  const birthInfo = `${bazi.birthYear}\u5E74${bazi.birthMonth}\u6708${bazi.birthDay}\u65E5${bazi.birthHour !== null ? ` ${bazi.birthHour}\u65F6` : ""}`;
  const genderText = bazi.gender ? genderLabels[bazi.gender] : "\u672A\u77E5";
  const fullReport = bazi.fullReport ? cleanMarkdown(bazi.fullReport) : "\u6682\u65E0\u5B8C\u6574\u62A5\u544A";
  return `
    <div class="bazi-card" style="page-break-inside: avoid; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; border: 1px solid rgba(251, 191, 36, 0.3);">
      ${index !== void 0 ? `<div style="color: rgba(251, 191, 36, 0.6); font-size: 12px; margin-bottom: 10px;">\u516B\u5B57\u5206\u6790\u8BB0\u5F55 #${index + 1}</div>` : ""}
      
      <h2 style="color: #fbbf24; font-size: 22px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 28px;">\u2B50</span>
        \u516B\u5B57\u547D\u7406\u5206\u6790\u62A5\u544A
      </h2>
      
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; font-size: 13px; color: #94a3b8;">
        <span>\u{1F4C5} \u51FA\u751F\uFF1A${birthInfo}</span>
        <span>\u{1F464} \u6027\u522B\uFF1A${genderText}</span>
        <span>\u{1F550} \u751F\u6210\u65F6\u95F4\uFF1A${formatDate(bazi.createdAt)}</span>
      </div>
      
      ${bazi.baziChart ? `
      <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="color: #fbbf24; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">\u516B\u5B57\u547D\u76D8</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">\u5E74\u67F1</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${bazi.baziChart?.year || "\u2014"}</div>
          </div>
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">\u6708\u67F1</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${bazi.baziChart?.month || "\u2014"}</div>
          </div>
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">\u65E5\u67F1</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${bazi.baziChart?.day || "\u2014"}</div>
          </div>
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">\u65F6\u67F1</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${bazi.baziChart?.hour || "\u2014"}</div>
          </div>
        </div>
      </div>
      ` : ""}
      
      ${bazi.personalityAnalysis ? `
      <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #8b5cf6;">
        <h3 style="color: #a78bfa; font-size: 16px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span>\u{1F3AD}</span> \u6027\u683C\u7279\u70B9
        </h3>
        <div style="color: #e2e8f0; line-height: 1.8; white-space: pre-wrap; font-size: 14px;">${cleanMarkdown(bazi.personalityAnalysis)}</div>
      </div>
      ` : ""}
      
      ${bazi.talentAnalysis ? `
      <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
        <h3 style="color: #60a5fa; font-size: 16px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span>\u{1F48E}</span> \u5929\u8D4B\u6F5C\u80FD
        </h3>
        <div style="color: #e2e8f0; line-height: 1.8; white-space: pre-wrap; font-size: 14px;">${cleanMarkdown(bazi.talentAnalysis)}</div>
      </div>
      ` : ""}
      
      ${bazi.careerSuggestions ? `
      <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
        <h3 style="color: #34d399; font-size: 16px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span>\u{1F4BC}</span> \u804C\u4E1A\u65B9\u5411
        </h3>
        <div style="color: #e2e8f0; line-height: 1.8; white-space: pre-wrap; font-size: 14px;">${cleanMarkdown(bazi.careerSuggestions)}</div>
      </div>
      ` : ""}
      
      <div style="background: rgba(251, 191, 36, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #fbbf24;">
        <h3 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
          <span>\u{1F4DC}</span> \u5B8C\u6574\u547D\u7406\u5206\u6790
        </h3>
        <div style="color: #e2e8f0; line-height: 1.9; white-space: pre-wrap; font-size: 14px;">${fullReport}</div>
      </div>
    </div>
  `;
}
function generateBaziPDFHTML(readings, title) {
  const isSingle = readings.length === 1;
  const pageTitle = title || (isSingle ? "\u516B\u5B57\u547D\u7406\u5206\u6790\u62A5\u544A" : "\u516B\u5B57\u5206\u6790\u8BB0\u5F55");
  const readingsHTML = readings.map(
    (reading, index) => generateBaziHTML(reading, isSingle ? void 0 : index)
  ).join("");
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pageTitle} - \u6D1E\u5BDF\u672A\u6765</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding: 40px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
      border-radius: 20px;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    
    .logo {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .site-name {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 20px;
      color: #94a3b8;
      margin-bottom: 15px;
    }
    
    .report-meta {
      font-size: 13px;
      color: #64748b;
    }
    
    .footer {
      text-align: center;
      margin-top: 50px;
      padding: 30px;
      border-top: 1px solid rgba(251, 191, 36, 0.2);
      color: #64748b;
      font-size: 12px;
    }
    
    .footer-logo {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .disclaimer {
      margin-top: 15px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      font-size: 11px;
      line-height: 1.6;
    }
    
    @media print {
      body {
        background: white;
        color: #1a1a2e;
        padding: 20px;
      }
      
      .bazi-card {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
      }
      
      .header {
        background: #fffbeb !important;
        border: 1px solid #fde68a !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">\u2B50\u2728</div>
      <div class="site-name">\u6D1E\u5BDF\u672A\u6765</div>
      <div class="report-title">${pageTitle}</div>
      <div class="report-meta">
        \u751F\u6210\u65F6\u95F4\uFF1A${formatDate(/* @__PURE__ */ new Date())} | 
        \u5171 ${readings.length} \u6761\u5206\u6790\u8BB0\u5F55
      </div>
    </div>
    
    <div class="readings-container">
      ${readingsHTML}
    </div>
    
    <div class="footer">
      <div class="footer-logo">\u2B50</div>
      <div>\u6D1E\u5BDF\u672A\u6765 - AI\u9A71\u52A8\u7684\u5FC3\u7075\u6210\u957F\u5E73\u53F0</div>
      <div class="disclaimer">
        \u{1F4A1} \u516B\u5B57\u5206\u6790\u4EC5\u4F9B\u53C2\u8003\uFF0C\u65E8\u5728\u5E2E\u52A9\u60A8\u8FDB\u884C\u81EA\u6211\u8BA4\u77E5\u548C\u4EBA\u751F\u89C4\u5212\u3002
        \u547D\u8FD0\u638C\u63E1\u5728\u81EA\u5DF1\u624B\u4E2D\uFF0C\u79EF\u6781\u7684\u5FC3\u6001\u548C\u52AA\u529B\u624D\u662F\u6210\u529F\u7684\u5173\u952E\u3002
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
async function generateBaziPDF(readings, title) {
  const html = generateBaziPDFHTML(readings, title);
  return Buffer.from(html, "utf-8");
}
var dreamTypeLabels, genderLabels;
var init_pdfGenerator = __esm({
  "server/pdfGenerator.ts"() {
    "use strict";
    dreamTypeLabels = {
      normal: "\u666E\u901A\u68A6\u5883",
      nightmare: "\u5669\u68A6",
      lucid: "\u6E05\u9192\u68A6",
      recurring: "\u91CD\u590D\u68A6",
      prophetic: "\u9884\u77E5\u68A6"
    };
    genderLabels = {
      male: "\u7537",
      female: "\u5973"
    };
  }
});

// server/password.ts
import { createHash, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}
async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  try {
    const derived = await scryptAsync(password, salt, 64);
    const expected = Buffer.from(hashHex, "hex");
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function localOpenIdForEmail(email) {
  const normalized = normalizeEmail(email);
  const id = `local:${normalized}`;
  if (id.length <= 64) return id;
  const h = createHash("sha256").update(normalized).digest("hex").slice(0, 40);
  return `local:${h}`;
}
var scryptAsync;
var init_password = __esm({
  "server/password.ts"() {
    "use strict";
    scryptAsync = promisify(scrypt);
  }
});

// server/localAuth.ts
var localAuth_exports = {};
__export(localAuth_exports, {
  ensurePasswordColumn: () => ensurePasswordColumn,
  findUserByEmail: () => findUserByEmail,
  loginWithEmail: () => loginWithEmail,
  registerWithEmail: () => registerWithEmail
});
import { eq as eq13, sql as sql11 } from "drizzle-orm";
async function ensurePasswordColumn() {
  if (passwordColumnReady) return;
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(
      sql11`ALTER TABLE users ADD COLUMN passwordHash varchar(255) NULL`
    );
  } catch {
  }
  passwordColumnReady = true;
}
async function findUserByEmail(email) {
  await ensurePasswordColumn();
  const db = await getDb();
  if (!db) return null;
  const normalized = normalizeEmail(email);
  const [row] = await db.select().from(users).where(eq13(users.email, normalized)).limit(1);
  return row ?? null;
}
async function registerWithEmail(input) {
  await ensurePasswordColumn();
  const db = await getDb();
  if (!db) return { ok: false, error: "Database unavailable" };
  const email = normalizeEmail(input.email);
  if (!email.includes("@") || email.length < 5) {
    return { ok: false, error: "Invalid email / \u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters / \u5BC6\u7801\u81F3\u5C11 8 \u4F4D" };
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    if (existing.passwordHash) {
      return { ok: false, error: "Email already registered / \u8BE5\u90AE\u7BB1\u5DF2\u6CE8\u518C\uFF0C\u8BF7\u76F4\u63A5\u767B\u5F55" };
    }
    const passwordHash2 = await hashPassword(input.password);
    await db.update(users).set({
      passwordHash: passwordHash2,
      name: input.name?.trim() || existing.name,
      loginMethod: "email",
      lastSignedIn: /* @__PURE__ */ new Date()
    }).where(eq13(users.id, existing.id));
    const [updated] = await db.select().from(users).where(eq13(users.id, existing.id)).limit(1);
    if (!updated) return { ok: false, error: "Failed to update account" };
    await grantSignupTrialIfNeeded(updated.id);
    return { ok: true, user: updated, isNew: true };
  }
  const openId = localOpenIdForEmail(email);
  const passwordHash = await hashPassword(input.password);
  const name = input.name?.trim() || email.split("@")[0] || "User";
  const ownerEmail = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
  const isOwner = openId === ENV.ownerOpenId || !!ownerEmail && email === ownerEmail;
  await db.insert(users).values({
    openId,
    email,
    name,
    passwordHash,
    loginMethod: "email",
    role: isOwner ? "admin" : "user",
    lastSignedIn: /* @__PURE__ */ new Date()
  });
  const [created] = await db.select().from(users).where(eq13(users.openId, openId)).limit(1);
  if (!created) return { ok: false, error: "Failed to create account" };
  await grantSignupTrialIfNeeded(created.id);
  return { ok: true, user: created, isNew: true };
}
async function loginWithEmail(input) {
  await ensurePasswordColumn();
  const user = await findUserByEmail(input.email);
  if (!user) {
    return { ok: false, error: "Invalid email or password / \u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF" };
  }
  if (!user.passwordHash) {
    return {
      ok: false,
      error: "No password set for this email. Please register with the same email to set a password. / \u8BE5\u90AE\u7BB1\u5C1A\u672A\u8BBE\u7F6E\u5BC6\u7801\uFF0C\u8BF7\u7528\u540C\u4E00\u90AE\u7BB1\u6CE8\u518C\u5E76\u8BBE\u7F6E\u5BC6\u7801\u3002"
    };
  }
  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Invalid email or password / \u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF" };
  }
  const db = await getDb();
  if (db) {
    await db.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eq13(users.id, user.id));
  }
  await grantSignupTrialIfNeeded(user.id);
  return { ok: true, user };
}
var passwordColumnReady;
var init_localAuth = __esm({
  "server/localAuth.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_password();
    init_env();
    passwordColumnReady = false;
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import compression2 from "compression";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/oauth.ts
init_const();
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/oauth.ts
init_sdk();

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/routers/email.ts
import { z } from "zod";

// server/_core/trpc.ts
init_const();
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/routers/email.ts
init_db();
init_schema();
init_env();
import { eq as eq2, desc as desc2, and as and2, sql as sql2, lte } from "drizzle-orm";
function generateWelcomeEmail(userName, referralCode, language) {
  const isZh = language === "zh";
  const base = ENV.appBaseUrl;
  return {
    subject: isZh ? "\u{1F31F} \u6B22\u8FCE\u52A0\u5165\u6D1E\u5BDF\u672A\u6765\uFF01\u5F00\u542F\u4F60\u7684\u5FC3\u7075\u6210\u957F\u4E4B\u65C5" : "\u{1F31F} Welcome to Fortune Insight! Begin Your Journey of Self-Discovery",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a1a;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:600px;margin:0 auto;background:linear-gradient(180deg,#1a1030 0%,#0f0a1a 100%);border:1px solid rgba(212,168,67,0.2);border-radius:12px;overflow:hidden;">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a1030,#2a1540);padding:40px 30px;text-align:center;border-bottom:1px solid rgba(212,168,67,0.15);">
    <h1 style="color:#d4a843;font-size:28px;margin:0;font-weight:700;letter-spacing:1px;">Fortune Insight</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:8px 0 0;letter-spacing:2px;">${isZh ? "\u6D1E\u5BDF\u672A\u6765" : "Discover Your True Self"}</p>
  </div>
  <!-- Body -->
  <div style="padding:30px;">
    <h2 style="color:#e8d5b0;font-size:22px;margin:0 0 15px;">${isZh ? `\u4F60\u597D\uFF0C${userName}\uFF01` : `Hello, ${userName}!`}</h2>
    <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isZh ? "\u611F\u8C22\u4F60\u52A0\u5165\u6D1E\u5BDF\u672A\u6765\uFF01\u6211\u4EEC\u878D\u5408\u4E1C\u65B9\u547D\u7406\u667A\u6167\u4E0E\u897F\u65B9\u5360\u535C\u827A\u672F\uFF0C\u501F\u52A9AI\u6280\u672F\u4E3A\u4F60\u63D0\u4F9B\u6DF1\u5EA6\u4E2A\u6027\u5316\u7684\u5FC3\u7075\u6D1E\u5BDF\u3002" : "Thank you for joining Fortune Insight! We blend Eastern wisdom with Western divination arts, powered by AI to deliver deeply personalized spiritual insights."}
    </p>
    <!-- Features -->
    <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.15);border-radius:8px;padding:20px;margin:20px 0;">
      <p style="color:#d4a843;font-size:16px;font-weight:600;margin:0 0 12px;">${isZh ? "\u{1F381} \u4F60\u7684\u514D\u8D39\u4F53\u9A8C\u5305\u542B\uFF1A" : "\u{1F381} Your Free Experience Includes:"}</p>
      <ul style="color:rgba(255,255,255,0.7);font-size:14px;line-height:2;margin:0;padding-left:20px;">
        <li>\u{1F0CF} ${isZh ? "AI\u5854\u7F57\u5360\u535C \u2014 \u6BCF\u65E51\u6B21\u514D\u8D39" : "AI Tarot Reading \u2014 1 free daily"}</li>
        <li>\u2728 ${isZh ? "AI\u516B\u5B57\u7CBE\u6279 \u2014 1\u6B21\u514D\u8D39\u4F53\u9A8C" : "AI BaZi Analysis \u2014 1 free trial"}</li>
        <li>\u{1F31F} ${isZh ? "\u661F\u5EA7\u8FD0\u52BF \u2014 \u65E0\u9650\u514D\u8D39" : "Horoscope \u2014 Unlimited free"}</li>
        <li>\u{1F319} ${isZh ? "AI\u89E3\u68A6 \u2014 \u6BCF\u67081\u6B21\u514D\u8D39" : "AI Dream Interpretation \u2014 1 free monthly"}</li>
      </ul>
    </div>
    <!-- CTA -->
    <div style="text-align:center;margin:30px 0;">
      <a href="${base}/tarot" style="display:inline-block;background:linear-gradient(135deg,#d4a843,#b8922e);color:#1a1030;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
        ${isZh ? "\u5F00\u59CB\u4F60\u7684\u7B2C\u4E00\u6B21\u5360\u535C \u2192" : "Start Your First Reading \u2192"}
      </a>
    </div>
    ${referralCode ? `
    <!-- Referral -->
    <div style="background:rgba(192,96,128,0.1);border:1px solid rgba(192,96,128,0.2);border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#c06080;font-size:14px;font-weight:600;margin:0 0 8px;">${isZh ? "\u{1F389} \u9080\u8BF7\u597D\u53CB\uFF0C\u53CC\u65B9\u5404\u5F97\u989D\u5916\u514D\u8D39\u6B21\u6570\uFF01" : "\u{1F389} Invite friends \u2014 both of you get bonus credits!"}</p>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 12px;">${isZh ? "\u4F60\u7684\u4E13\u5C5E\u9080\u8BF7\u7801\uFF1A" : "Your referral code:"}</p>
      <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(212,168,67,0.3);border-radius:6px;padding:10px 20px;display:inline-block;">
        <span style="color:#d4a843;font-size:20px;font-weight:700;letter-spacing:3px;">${referralCode}</span>
      </div>
    </div>` : ""}
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">\xA9 2026 Fortune Insight. ${isZh ? "\u6D1E\u5BDF\u672A\u6765\uFF0C\u53D1\u73B0\u771F\u6211\u3002" : "Discover your true self."}</p>
  </div>
</div>
</body>
</html>`.trim()
  };
}
function generateConversionEmail(userName, language) {
  const isZh = language === "zh";
  const base = ENV.appBaseUrl;
  return {
    subject: isZh ? "\u2728 \u4F60\u7684\u514D\u8D39\u4F53\u9A8C\u5373\u5C06\u7528\u5B8C \u2014 \u89E3\u9501\u65E0\u9650\u6DF1\u5EA6\u62A5\u544A" : "\u2728 Your Free Credits Are Running Low \u2014 Unlock Unlimited Deep Reports",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a1a;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:600px;margin:0 auto;background:linear-gradient(180deg,#1a1030 0%,#0f0a1a 100%);border:1px solid rgba(212,168,67,0.2);border-radius:12px;overflow:hidden;">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a1030,#2a1540);padding:40px 30px;text-align:center;border-bottom:1px solid rgba(212,168,67,0.15);">
    <h1 style="color:#d4a843;font-size:28px;margin:0;font-weight:700;">Fortune Insight</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:8px 0 0;letter-spacing:2px;">${isZh ? "\u6D1E\u5BDF\u672A\u6765" : "Premium Membership"}</p>
  </div>
  <!-- Body -->
  <div style="padding:30px;">
    <h2 style="color:#e8d5b0;font-size:22px;margin:0 0 15px;">${isZh ? `${userName}\uFF0C\u4F60\u7684\u6D1E\u5BDF\u4E4B\u65C5\u624D\u521A\u5F00\u59CB...` : `${userName}, your journey has just begun...`}</h2>
    <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isZh ? "\u8FC7\u53BB\u51E0\u5929\u4F60\u5DF2\u7ECF\u4F53\u9A8C\u4E86\u6211\u4EEC\u7684AI\u5360\u535C\u670D\u52A1\u3002\u514D\u8D39\u7248\u672C\u53EA\u5C55\u793A\u4E86\u51B0\u5C71\u4E00\u89D2 \u2014 Premium\u4F1A\u5458\u53EF\u4EE5\u89E3\u9501\u5B8C\u6574\u7684\u6DF1\u5EA6\u5206\u6790\u62A5\u544A\u3002" : "Over the past few days, you've experienced our AI divination services. The free version only shows the tip of the iceberg \u2014 Premium members unlock complete deep analysis reports."}
    </p>
    <!-- Comparison -->
    <div style="margin:25px 0;">
      <div style="display:flex;gap:10px;">
        <div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:15px;">
          <p style="color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;margin:0 0 10px;text-align:center;">${isZh ? "\u514D\u8D39\u7248" : "FREE"}</p>
          <ul style="color:rgba(255,255,255,0.5);font-size:12px;line-height:2;margin:0;padding-left:15px;">
            <li>${isZh ? "\u57FA\u78403\u724C\u89E3\u8BFB" : "Basic 3-card reading"}</li>
            <li>${isZh ? "\u7B80\u8981\u516B\u5B57\u5206\u6790" : "Brief BaZi analysis"}</li>
            <li>${isZh ? "\u6BCF\u65E5\u9650\u6B21" : "Daily limits"}</li>
          </ul>
        </div>
        <div style="flex:1;background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.3);border-radius:8px;padding:15px;">
          <p style="color:#d4a843;font-size:13px;font-weight:600;margin:0 0 10px;text-align:center;">\u{1F451} ${isZh ? "Premium" : "PREMIUM"}</p>
          <ul style="color:rgba(255,255,255,0.7);font-size:12px;line-height:2;margin:0;padding-left:15px;">
            <li>${isZh ? "\u6DF1\u5EA6\u591A\u7EF4\u5EA6\u62A5\u544A" : "Deep multi-dimensional reports"}</li>
            <li>${isZh ? "\u5B8C\u6574\u516B\u5B57\u547D\u76D8" : "Complete BaZi destiny chart"}</li>
            <li>${isZh ? "\u65E0\u9650\u4F7F\u7528" : "Unlimited access"}</li>
            <li>${isZh ? "PDF\u5BFC\u51FA" : "PDF export"}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Pricing -->
    <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.15);border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#d4a843;font-size:14px;margin:0 0 5px;">${isZh ? "\u5E74\u5EA6\u4F1A\u5458" : "Annual Membership"}</p>
      <p style="color:#e8d5b0;font-size:28px;font-weight:700;margin:0;">$59.99<span style="font-size:14px;color:rgba(255,255,255,0.5);">/${isZh ? "\u5E74" : "year"}</span></p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:5px 0 0;">${isZh ? "\u76F8\u5F53\u4E8E\u6BCF\u6708\u4EC5 $4.99 \u2014 \u770150%" : "Just $4.99/month \u2014 Save 50%"}</p>
    </div>
    <!-- CTA -->
    <div style="text-align:center;margin:30px 0;">
      <a href="${base}/membership" style="display:inline-block;background:linear-gradient(135deg,#d4a843,#b8922e);color:#1a1030;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:700;">
        ${isZh ? "\u5347\u7EA7 Premium \u2192" : "Upgrade to Premium \u2192"}
      </a>
    </div>
    <p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;margin:0;">
      ${isZh ? "10% \u6536\u5165\u6350\u8D60\u6148\u5584\u4E8B\u4E1A \u{1F49D}" : "10% of revenue goes to charity \u{1F49D}"}
    </p>
  </div>
  <!-- Footer -->
  <div style="padding:20px 30px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">\xA9 2026 Fortune Insight</p>
  </div>
</div>
</body>
</html>`.trim()
  };
}
async function queueWelcomeEmail(userId, email, userName, referralCode) {
  const db = await getDb();
  if (!db) return;
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
    scheduledAt: /* @__PURE__ */ new Date()
    // Send immediately
  });
}
async function queueConversionEmail(userId, email, userName) {
  const db = await getDb();
  if (!db) return;
  const isChinese = /[\u4e00-\u9fff]/.test(userName);
  const language = isChinese ? "zh" : "en";
  const { subject, html } = generateConversionEmail(userName, language);
  const scheduledAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3);
  await db.insert(emailQueue).values({
    userId,
    email,
    userName,
    templateType: "conversion",
    subject,
    htmlContent: html,
    status: "pending",
    scheduledAt
  });
}
var emailRouter = router({
  // Admin: Get email queue
  getQueue: protectedProcedure.input(z.object({
    status: z.enum(["pending", "sent", "failed", "cancelled"]).optional(),
    templateType: z.enum(["welcome", "conversion", "reengagement", "referral_reward", "custom"]).optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0)
  })).query(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") return { emails: [], total: 0 };
    const db = await getDb();
    if (!db) return { emails: [], total: 0 };
    const conditions = [];
    if (input.status) conditions.push(eq2(emailQueue.status, input.status));
    if (input.templateType) conditions.push(eq2(emailQueue.templateType, input.templateType));
    const whereClause = conditions.length > 0 ? and2(...conditions) : void 0;
    const [emails, [countResult]] = await Promise.all([
      db.select().from(emailQueue).where(whereClause).orderBy(desc2(emailQueue.createdAt)).limit(input.limit).offset(input.offset),
      db.select({ c: sql2`count(*)` }).from(emailQueue).where(whereClause)
    ]);
    return { emails, total: Number(countResult?.c || 0) };
  }),
  // Admin: Mark email as sent
  markSent: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") return { success: false };
    const db = await getDb();
    if (!db) return { success: false };
    await db.update(emailQueue).set({ status: "sent", sentAt: /* @__PURE__ */ new Date() }).where(eq2(emailQueue.id, input.id));
    return { success: true };
  }),
  // Admin: Mark email as cancelled
  cancelEmail: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") return { success: false };
    const db = await getDb();
    if (!db) return { success: false };
    await db.update(emailQueue).set({ status: "cancelled" }).where(eq2(emailQueue.id, input.id));
    return { success: true };
  }),
  // Admin: Get email stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") return null;
    const db = await getDb();
    if (!db) return null;
    const [pending, sent, failed] = await Promise.all([
      db.select({ c: sql2`count(*)` }).from(emailQueue).where(eq2(emailQueue.status, "pending")),
      db.select({ c: sql2`count(*)` }).from(emailQueue).where(eq2(emailQueue.status, "sent")),
      db.select({ c: sql2`count(*)` }).from(emailQueue).where(eq2(emailQueue.status, "failed"))
    ]);
    return {
      pending: Number(pending[0]?.c || 0),
      sent: Number(sent[0]?.c || 0),
      failed: Number(failed[0]?.c || 0)
    };
  }),
  // Admin: Get ready-to-send emails (pending + scheduled time has passed)
  getReadyToSend: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") return [];
    const db = await getDb();
    if (!db) return [];
    return db.select().from(emailQueue).where(and2(
      eq2(emailQueue.status, "pending"),
      lte(emailQueue.scheduledAt, /* @__PURE__ */ new Date())
    )).orderBy(emailQueue.scheduledAt).limit(50);
  }),
  // Admin: Batch mark as sent
  batchMarkSent: protectedProcedure.input(z.object({ ids: z.array(z.number()).min(1) })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") return { success: false };
    const db = await getDb();
    if (!db) return { success: false };
    await Promise.all(
      input.ids.map(
        (id) => db.update(emailQueue).set({ status: "sent", sentAt: /* @__PURE__ */ new Date() }).where(eq2(emailQueue.id, id))
      )
    );
    return { success: true, count: input.ids.length };
  })
});

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      const { isNew } = await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const registered = await getUserByOpenId(userInfo.openId);
      if (registered?.id) {
        await grantSignupTrialIfNeeded(registered.id).catch((err) => {
          console.error("[OAuth] grantSignupTrialIfNeeded failed", err);
        });
      }
      if (isNew) {
        notifyOwner({
          title: `\u{1F31F} \u65B0\u7528\u6237\u6CE8\u518C: ${userInfo.name || "Anonymous"}`,
          content: `\u7528\u6237\u540D: ${userInfo.name || "N/A"}
\u90AE\u7BB1: ${userInfo.email || "N/A"}
\u767B\u5F55\u65B9\u5F0F: ${userInfo.loginMethod ?? userInfo.platform ?? "N/A"}
\u65F6\u95F4: ${(/* @__PURE__ */ new Date()).toISOString()}
\u8BD5\u7528: 14\u5929\u65E0\u9650\u4F7F\u7528`
        }).catch(() => {
        });
        if (userInfo.email && registered) {
          queueWelcomeEmail(
            registered.id,
            userInfo.email,
            userInfo.name || "Friend",
            registered.referralCode
          ).catch(() => {
          });
          queueConversionEmail(
            registered.id,
            userInfo.email,
            userInfo.name || "Friend"
          ).catch(() => {
          });
        }
      }
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/routers.ts
init_const();
import { TRPCError as TRPCError5 } from "@trpc/server";

// server/_core/systemRouter.ts
import { z as z2 } from "zod";
var systemRouter = router({
  health: publicProcedure.input(
    z2.object({
      timestamp: z2.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z2.object({
      title: z2.string().min(1, "title is required"),
      content: z2.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z12 } from "zod";

// server/_core/llm.ts
init_env();

// server/_core/llmBudget.ts
init_schema();
init_db();
init_env();
import { eq as eq3 } from "drizzle-orm";
var DEFAULT_LLM_DAILY_MAX_CALLS = 200;
var memoryUsage = /* @__PURE__ */ new Map();
var warnedAboutDatabaseFallback = false;
function resolveLlmDailyMaxCalls(rawValue = ENV.llmDailyMaxCalls) {
  if (!/^\d+$/.test(rawValue.trim())) {
    return DEFAULT_LLM_DAILY_MAX_CALLS;
  }
  const parsed = Number(rawValue);
  return Number.isSafeInteger(parsed) ? parsed : DEFAULT_LLM_DAILY_MAX_CALLS;
}
function utcDateKey(now) {
  return now.toISOString().slice(0, 10);
}
function nextUtcDate(dateKey) {
  const next = /* @__PURE__ */ new Date(`${dateKey}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString();
}
function reserveInMemory(dateKey, limit, resetAt) {
  const used = memoryUsage.get(dateKey) ?? 0;
  if (used >= limit) {
    return {
      allowed: false,
      used,
      limit,
      dateKey,
      resetAt,
      storage: "memory"
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
    storage: "memory"
  };
}
async function reserveLlmCall(options = {}) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  const dateKey = utcDateKey(now);
  const resetAt = nextUtcDate(dateKey);
  const limit = options.dailyMaxCalls ?? resolveLlmDailyMaxCalls(ENV.llmDailyMaxCalls);
  if (limit <= 0) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      dateKey,
      resetAt,
      storage: "memory"
    };
  }
  const getDatabase = options.getDatabase ?? getDb;
  const db = await getDatabase();
  if (!db) {
    return reserveInMemory(dateKey, limit, resetAt);
  }
  try {
    await db.insert(llmDailyUsage).values({ dateKey, usedCount: 0 }).onDuplicateKeyUpdate({ set: { dateKey } });
    return await db.transaction(async (transaction) => {
      const [current] = await transaction.select({ usedCount: llmDailyUsage.usedCount }).from(llmDailyUsage).where(eq3(llmDailyUsage.dateKey, dateKey)).for("update");
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
          storage: "database"
        };
      }
      const used = current.usedCount + 1;
      await transaction.update(llmDailyUsage).set({ usedCount: used }).where(eq3(llmDailyUsage.dateKey, dateKey));
      return {
        allowed: true,
        used,
        limit,
        dateKey,
        resetAt,
        storage: "database"
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
function buildLlmDailyLimitDegradation(language, reservation) {
  const message = language === "en" ? "Today's AI interpretation quota has been reached. You can still view the basic calculated result; please return tomorrow. This attempt does not consume your usage allowance." : "\u4ECA\u65E5 AI \u89E3\u8BFB\u989D\u5EA6\u5DF2\u7528\u5B8C\u3002\u57FA\u7840\u8BA1\u7B97\u7ED3\u679C\u4ECD\u53EF\u67E5\u770B\uFF0C\u8BF7\u660E\u65E5\u518D\u6765\uFF1B\u672C\u6B21\u4E0D\u4F1A\u6D88\u8017\u4F60\u7684\u4F7F\u7528\u989D\u5EA6\u3002";
  return {
    code: "LLM_DAILY_LIMIT",
    source: "daily_limit",
    message,
    retryAt: reservation.resetAt,
    dailyLimit: reservation.limit
  };
}

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var DEFAULT_LLM_MODEL = "gemini-2.5-flash";
var DEFAULT_FORGE_API_URL = "https://forge.manus.im";
var LLM_REQUEST_TIMEOUT_MS = 6e4;
var LLM_MAX_ATTEMPTS = 2;
var normalizeChatCompletionsUrl = (rawUrl) => {
  const baseUrl = rawUrl.trim().replace(/\/+$/, "");
  if (baseUrl.endsWith("/chat/completions")) return baseUrl;
  if (/\/(?:v\d+(?:beta\d+)?|openai)$/.test(baseUrl)) {
    return `${baseUrl}/chat/completions`;
  }
  return `${baseUrl}/v1/chat/completions`;
};
var isForgeUrl = (rawUrl) => {
  try {
    const hostname = new URL(rawUrl).hostname;
    return hostname === "forge.manus.im" || hostname.endsWith(".forge.manus.im");
  } catch {
    return false;
  }
};
var resolveLlmConfig = () => {
  const explicitApiUrl = ENV.llmApiUrl.trim();
  const rawApiUrl = explicitApiUrl || ENV.forgeApiUrl.trim() || DEFAULT_FORGE_API_URL;
  return {
    apiUrl: normalizeChatCompletionsUrl(rawApiUrl),
    apiKey: (ENV.llmApiKey || ENV.forgeApiKey).trim(),
    model: ENV.llmModel.trim() || DEFAULT_LLM_MODEL,
    usesForge: !explicitApiUrl || isForgeUrl(rawApiUrl)
  };
};
var assertApiKey = (apiKey) => {
  if (!apiKey) {
    throw new Error(
      "LLM_API_KEY is not configured (BUILT_IN_FORGE_API_KEY is supported as a legacy fallback)"
    );
  }
};
var LlmHttpError = class extends Error {
  constructor(message, retryable) {
    super(message);
    this.retryable = retryable;
  }
};
var isRetryableStatus = (status) => status === 408 || status === 429 || status >= 500;
var requestCompletion = async (apiUrl, apiKey, payload) => {
  let lastError;
  for (let attempt = 0; attempt < LLM_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      LLM_REQUEST_TIMEOUT_MS
    );
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new LlmHttpError(
          `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`,
          isRetryableStatus(response.status)
        );
      }
      return await response.json();
    } catch (error) {
      const timedOut = controller.signal.aborted;
      const retryable = timedOut || !(error instanceof LlmHttpError) || error.retryable;
      lastError = timedOut ? new Error(`LLM invoke timed out after ${LLM_REQUEST_TIMEOUT_MS}ms`) : error;
      if (attempt + 1 < LLM_MAX_ATTEMPTS && retryable) {
        continue;
      }
      throw lastError;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("LLM invoke failed after retry");
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
async function invokeLLM(params) {
  const config = resolveLlmConfig();
  assertApiKey(config.apiKey);
  const reservation = await reserveLlmCall();
  if (!reservation.allowed) {
    const degradation = buildLlmDailyLimitDegradation(
      params.language ?? "zh",
      reservation
    );
    return {
      id: `daily-limit-${reservation.dateKey}`,
      created: Math.floor(Date.now() / 1e3),
      model: config.model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: degradation.message },
          finish_reason: "stop"
        }
      ],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      degradation
    };
  }
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: config.model,
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  if (config.usesForge) {
    payload.thinking = {
      budget_tokens: 128
    };
  }
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  return requestCompletion(config.apiUrl, config.apiKey, payload);
}

// server/routers.ts
init_db();
init_schema();
import { eq as eq14, desc as desc12, and as and11, sql as sql12 } from "drizzle-orm";
import { nanoid as nanoid6 } from "nanoid";

// server/stripe.ts
init_env();
init_products();
init_db();
init_schema();
import Stripe from "stripe";
import { Router, raw } from "express";
import { eq as eq5 } from "drizzle-orm";
import { nanoid } from "nanoid";

// server/routers/notification.ts
init_db();
init_schema();
import { z as z3 } from "zod";
import { eq as eq4, desc as desc3, and as and3, or, isNull, sql as sql3, inArray } from "drizzle-orm";
import { TRPCError as TRPCError3 } from "@trpc/server";
async function createNotification(params) {
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
    expiresAt: params.expiresAt || null
  });
}
var notificationRouter = router({
  /**
   * Get notifications for the current user (personal + unread broadcasts)
   */
  list: protectedProcedure.input(z3.object({
    limit: z3.number().min(1).max(50).default(20),
    cursor: z3.number().optional()
  }).optional()).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return { items: [], nextCursor: void 0 };
    const limit = input?.limit ?? 20;
    const cursor = input?.cursor;
    const userId = ctx.user.id;
    const personalNotifs = await db.select().from(notifications).where(
      and3(
        eq4(notifications.userId, userId),
        cursor ? sql3`${notifications.id} < ${cursor}` : void 0,
        or(isNull(notifications.expiresAt), sql3`${notifications.expiresAt} > NOW()`)
      )
    ).orderBy(desc3(notifications.createdAt)).limit(limit);
    const broadcastNotifs = await db.select().from(notifications).where(
      and3(
        eq4(notifications.isBroadcast, true),
        isNull(notifications.userId),
        cursor ? sql3`${notifications.id} < ${cursor}` : void 0,
        or(isNull(notifications.expiresAt), sql3`${notifications.expiresAt} > NOW()`)
      )
    ).orderBy(desc3(notifications.createdAt)).limit(limit);
    const broadcastIds = broadcastNotifs.map((n) => n.id);
    let readReceiptIds = [];
    if (broadcastIds.length > 0) {
      const receipts = await db.select({ notificationId: broadcastReadReceipts.notificationId }).from(broadcastReadReceipts).where(
        and3(
          eq4(broadcastReadReceipts.userId, userId),
          inArray(broadcastReadReceipts.notificationId, broadcastIds)
        )
      );
      readReceiptIds = receipts.map((r) => r.notificationId);
    }
    const broadcastWithReadStatus = broadcastNotifs.map((n) => ({
      ...n,
      isRead: readReceiptIds.includes(n.id)
    }));
    const allNotifs = [...personalNotifs, ...broadcastWithReadStatus].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
    const nextCursor = allNotifs.length === limit ? allNotifs[allNotifs.length - 1].id : void 0;
    return { items: allNotifs, nextCursor };
  }),
  /**
   * Get unread notification count
   */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { count: 0 };
    const userId = ctx.user.id;
    const [personalResult] = await db.select({ count: sql3`COUNT(*)` }).from(notifications).where(
      and3(
        eq4(notifications.userId, userId),
        eq4(notifications.isRead, false),
        or(isNull(notifications.expiresAt), sql3`${notifications.expiresAt} > NOW()`)
      )
    );
    const [broadcastResult] = await db.select({ count: sql3`COUNT(*)` }).from(notifications).where(
      and3(
        eq4(notifications.isBroadcast, true),
        isNull(notifications.userId),
        or(isNull(notifications.expiresAt), sql3`${notifications.expiresAt} > NOW()`),
        sql3`${notifications.id} NOT IN (
            SELECT notificationId FROM broadcast_read_receipts WHERE userId = ${userId}
          )`
      )
    );
    return {
      count: Number(personalResult?.count ?? 0) + Number(broadcastResult?.count ?? 0)
    };
  }),
  /**
   * Mark a notification as read
   */
  markRead: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR" });
    const userId = ctx.user.id;
    const [notif] = await db.select().from(notifications).where(eq4(notifications.id, input.id)).limit(1);
    if (!notif) throw new TRPCError3({ code: "NOT_FOUND", message: "Notification not found" });
    if (notif.isBroadcast) {
      const existing = await db.select().from(broadcastReadReceipts).where(
        and3(
          eq4(broadcastReadReceipts.notificationId, input.id),
          eq4(broadcastReadReceipts.userId, userId)
        )
      ).limit(1);
      if (existing.length === 0) {
        await db.insert(broadcastReadReceipts).values({
          notificationId: input.id,
          userId
        });
      }
    } else {
      if (notif.userId !== userId) throw new TRPCError3({ code: "FORBIDDEN" });
      await db.update(notifications).set({ isRead: true }).where(eq4(notifications.id, input.id));
    }
    return { success: true };
  }),
  /**
   * Mark all notifications as read
   */
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR" });
    const userId = ctx.user.id;
    await db.update(notifications).set({ isRead: true }).where(
      and3(eq4(notifications.userId, userId), eq4(notifications.isRead, false))
    );
    const unreadBroadcasts = await db.select({ id: notifications.id }).from(notifications).where(
      and3(
        eq4(notifications.isBroadcast, true),
        isNull(notifications.userId),
        or(isNull(notifications.expiresAt), sql3`${notifications.expiresAt} > NOW()`),
        sql3`${notifications.id} NOT IN (
            SELECT notificationId FROM broadcast_read_receipts WHERE userId = ${userId}
          )`
      )
    );
    if (unreadBroadcasts.length > 0) {
      await db.insert(broadcastReadReceipts).values(
        unreadBroadcasts.map((n) => ({
          notificationId: n.id,
          userId
        }))
      );
    }
    return { success: true };
  }),
  /**
   * Delete a notification (personal only)
   */
  delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR" });
    const userId = ctx.user.id;
    const [notif] = await db.select().from(notifications).where(eq4(notifications.id, input.id)).limit(1);
    if (!notif) throw new TRPCError3({ code: "NOT_FOUND" });
    if (notif.isBroadcast) throw new TRPCError3({ code: "FORBIDDEN", message: "Cannot delete broadcast notifications" });
    if (notif.userId !== userId) throw new TRPCError3({ code: "FORBIDDEN" });
    await db.delete(notifications).where(eq4(notifications.id, input.id));
    return { success: true };
  }),
  // ========== Admin endpoints ==========
  /**
   * Admin: Send notification to a specific user or broadcast to all
   */
  adminSend: protectedProcedure.input(z3.object({
    targetUserId: z3.number().optional(),
    type: z3.enum(["system", "admin", "promotion", "membership"]),
    title: z3.string().min(1).max(200),
    message: z3.string().min(1).max(2e3),
    link: z3.string().max(500).optional(),
    icon: z3.string().max(50).optional()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError3({ code: "FORBIDDEN", message: "Admin only" });
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR" });
    if (input.targetUserId) {
      await db.insert(notifications).values({
        userId: input.targetUserId,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link || null,
        icon: input.icon || null,
        isRead: false,
        isBroadcast: false
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
        isBroadcast: true
      });
    }
    return { success: true };
  }),
  /**
   * Admin: List all notifications (for management)
   */
  adminList: protectedProcedure.input(z3.object({
    limit: z3.number().min(1).max(100).default(50),
    offset: z3.number().default(0)
  }).optional()).query(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError3({ code: "FORBIDDEN", message: "Admin only" });
    const db = await getDb();
    if (!db) return { items: [], total: 0 };
    const limit = input?.limit ?? 50;
    const offset = input?.offset ?? 0;
    const items = await db.select().from(notifications).orderBy(desc3(notifications.createdAt)).limit(limit).offset(offset);
    const [countResult] = await db.select({ count: sql3`COUNT(*)` }).from(notifications);
    return { items, total: Number(countResult?.count ?? 0) };
  }),
  /**
   * Admin: Delete a notification
   */
  adminDelete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError3({ code: "FORBIDDEN", message: "Admin only" });
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR" });
    await db.delete(notifications).where(eq4(notifications.id, input.id));
    await db.delete(broadcastReadReceipts).where(eq4(broadcastReadReceipts.notificationId, input.id));
    return { success: true };
  }),
  /**
   * Admin: Get list of users for targeting notifications
   */
  adminUserList: protectedProcedure.input(z3.object({
    search: z3.string().optional(),
    limit: z3.number().min(1).max(50).default(20)
  }).optional()).query(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError3({ code: "FORBIDDEN", message: "Admin only" });
    const db = await getDb();
    if (!db) return [];
    const search = input?.search;
    const limit = input?.limit ?? 20;
    if (search) {
      return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      }).from(users).where(
        or(
          sql3`${users.name} LIKE ${`%${search}%`}`,
          sql3`${users.email} LIKE ${`%${search}%`}`
        )
      ).limit(limit).orderBy(desc3(users.lastSignedIn));
    }
    return await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    }).from(users).limit(limit).orderBy(desc3(users.lastSignedIn));
  })
});

// server/stripe.ts
var _stripe = null;
function getStripe() {
  if (!_stripe) {
    if (!ENV.stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(ENV.stripeSecretKey);
  }
  return _stripe;
}
var stripeRouter = Router();
stripeRouter.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = ENV.stripeWebhookSecret;
  if (!sig || !webhookSecret) {
    console.error("[Webhook] Missing signature or webhook secret");
    return res.status(400).send("Missing signature or webhook secret");
  }
  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }
  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object;
        await handleInvoicePaid(invoice);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing ${event.type}:`, error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
async function handleCheckoutComplete(session) {
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;
  const customerEmail = session.metadata?.customer_email;
  if (!userId || !productId) {
    console.error("[Webhook] Missing user_id or product_id in session metadata");
    return;
  }
  const db = await getDb();
  if (!db) return;
  const product = PRODUCTS[productId];
  if (!product) {
    console.error(`[Webhook] Unknown product: ${productId}`);
    return;
  }
  const amountPaid = session.amount_total || product.price;
  const charityAmount = calculateCharityAmount(productId, amountPaid);
  const orderNo = `ORD${Date.now()}${nanoid(6)}`;
  const productTypeMap = {
    MONTHLY_MEMBERSHIP: "membership_monthly",
    YEARLY_MEMBERSHIP: "membership_yearly",
    LIFETIME_MEMBERSHIP: "membership_lifetime",
    TAROT_DEEP_READING: "tarot_detail",
    TAROT_SINGLE: "tarot_detail",
    TAROT_PACK_3: "tarot_detail",
    BAZI_FULL_REPORT: "bazi_detail",
    BAZI_SINGLE: "bazi_detail",
    DREAM_SINGLE: "dream_detail",
    DREAM_PACK_5: "dream_detail"
  };
  const [orderResult] = await db.insert(orders).values({
    userId: parseInt(userId),
    orderNo,
    productType: productTypeMap[productId] || "membership_monthly",
    amount: (amountPaid / 100).toFixed(2),
    charityAmount: (charityAmount / 100).toFixed(2),
    paymentStatus: "paid",
    transactionId: session.id,
    paidAt: /* @__PURE__ */ new Date()
  });
  const orderId = orderResult.insertId;
  const isMembership = productId.includes("MEMBERSHIP");
  const isSinglePurchase = "featureType" in product;
  if (isMembership) {
    const now = /* @__PURE__ */ new Date();
    let expiresAt = null;
    if (product.interval === "month") {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
    } else if (product.interval === "year") {
      expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1e3);
    }
    await db.insert(memberships).values({
      userId: parseInt(userId),
      type: productId.includes("lifetime") ? "lifetime" : productId.includes("yearly") ? "yearly" : "monthly",
      status: "active",
      stripeCustomerId: session.customer || null,
      stripeSubscriptionId: session.subscription || null,
      startDate: now,
      endDate: expiresAt,
      autoRenew: product.interval !== "one_time",
      price: (amountPaid / 100).toFixed(2),
      charityAmount: (charityAmount / 100).toFixed(2)
    });
  } else if (isSinglePurchase) {
    const singleProduct = product;
    await addPurchaseCredits(
      parseInt(userId),
      singleProduct.featureType,
      singleProduct.credits,
      session.id
    );
  }
  await db.insert(charityDonations).values({
    orderId,
    userId: parseInt(userId),
    amount: (charityAmount / 100).toFixed(2),
    projectName: "\u793E\u4F1A\u516C\u76CA\u57FA\u91D1",
    status: "pending"
  });
  const purchaseType = isMembership ? "\u4F1A\u5458\u8BA2\u9605" : "\u5355\u6B21\u8D2D\u4E70";
  await notifyOwner({
    title: `\u{1F389} \u65B0${purchaseType}`,
    content: `\u7528\u6237 ${customerEmail || userId} \u8D2D\u4E70\u4E86 ${product.name}\uFF0C\u652F\u4ED8\u91D1\u989D $${(amountPaid / 100).toFixed(2)}\uFF0C\u5176\u4E2D $${(charityAmount / 100).toFixed(2)} \u5C06\u6350\u8D60\u7ED9\u516C\u76CA\u9879\u76EE\u3002`
  });
  const userIdNum = parseInt(userId);
  if (isMembership) {
    await createNotification({
      userId: userIdNum,
      type: "membership",
      title: "Welcome to Premium!",
      message: `Your ${product.name} is now active. Enjoy unlimited access to all features!`,
      link: "/membership",
      icon: "crown"
    });
  } else {
    await createNotification({
      userId: userIdNum,
      type: "report",
      title: "Purchase Confirmed",
      message: `Your ${product.name} credits are ready to use. Start your reading now!`,
      link: "/profile",
      icon: "file"
    });
  }
  console.log(`[Webhook] ${purchaseType} created for user ${userId}, product: ${productId}`);
}
async function handleSubscriptionUpdate(subscription) {
  const db = await getDb();
  if (!db) return;
  const customerId = subscription.customer;
  const periodEnd = subscription.current_period_end;
  await db.update(memberships).set({
    status: subscription.status === "active" ? "active" : "expired",
    endDate: periodEnd ? new Date(periodEnd * 1e3) : void 0
  }).where(eq5(memberships.stripeCustomerId, customerId));
  console.log(`[Webhook] Subscription updated for customer ${customerId}`);
}
async function handleSubscriptionCanceled(subscription) {
  const db = await getDb();
  if (!db) return;
  const customerId = subscription.customer;
  await db.update(memberships).set({
    status: "cancelled",
    autoRenew: false
  }).where(eq5(memberships.stripeCustomerId, customerId));
  const [cancelledMembership] = await db.select().from(memberships).where(eq5(memberships.stripeCustomerId, customerId)).limit(1);
  if (cancelledMembership) {
    await createNotification({
      userId: cancelledMembership.userId,
      type: "membership",
      title: "Subscription Cancelled",
      message: "Your membership has been cancelled. You can resubscribe anytime to regain access.",
      link: "/membership",
      icon: "crown"
    });
  }
  console.log(`[Webhook] Subscription canceled for customer ${customerId}`);
}
async function handleInvoicePaid(invoice) {
  const customerId = invoice.customer;
  const amountPaid = invoice.amount_paid;
  const charityAmount = Math.floor(amountPaid * 0.1);
  const db = await getDb();
  if (!db) return;
  const [membership] = await db.select().from(memberships).where(eq5(memberships.stripeCustomerId, customerId)).limit(1);
  if (membership) {
    const orderNo = `ORD${Date.now()}${nanoid(6)}`;
    const [orderResult] = await db.insert(orders).values({
      userId: membership.userId,
      orderNo,
      productType: "membership_monthly",
      amount: (amountPaid / 100).toFixed(2),
      charityAmount: (charityAmount / 100).toFixed(2),
      paymentMethod: "wechat",
      paymentStatus: "paid",
      transactionId: invoice.id,
      paidAt: /* @__PURE__ */ new Date()
    });
    await db.insert(charityDonations).values({
      orderId: orderResult.insertId,
      userId: membership.userId,
      amount: (charityAmount / 100).toFixed(2),
      projectName: "\u793E\u4F1A\u516C\u76CA\u57FA\u91D1",
      status: "pending"
    });
    await notifyOwner({
      title: "\u{1F49D} \u516C\u76CA\u6350\u8D60\u8BB0\u5F55",
      content: `\u4F1A\u5458\u7EED\u8D39\u6210\u529F\uFF0C\u91D1\u989D \xA5${(amountPaid / 100).toFixed(2)}\uFF0C\u5176\u4E2D \xA5${(charityAmount / 100).toFixed(2)} \u5C06\u6350\u8D60\u7ED9\u516C\u76CA\u9879\u76EE\u3002`
    });
  }
  console.log(`[Webhook] Invoice paid for customer ${customerId}, amount: ${amountPaid}`);
}
async function createCheckoutSession(userId, userEmail, userName, productId, origin) {
  const product = PRODUCTS[productId];
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }
  const sessionParams = {
    // 不指定 payment_method_types，让 Stripe 自动选择最合适的支付方式
    // 这样会根据 Dashboard 中启用的支付方式自动显示 Alipay、WeChat Pay 等
    mode: product.interval === "one_time" ? "payment" : "subscription",
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      product_id: productId
    },
    success_url: `${origin}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/membership?canceled=true`,
    allow_promotion_codes: true,
    // 为微信支付设置客户端类型
    payment_method_options: {
      wechat_pay: {
        client: "web"
      },
      alipay: {}
    }
  };
  if (product.interval === "one_time") {
    sessionParams.line_items = [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description
          },
          unit_amount: product.price
        },
        quantity: 1
      }
    ];
  } else {
    sessionParams.line_items = [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description
          },
          unit_amount: product.price,
          recurring: {
            interval: product.interval
          }
        },
        quantity: 1
      }
    ];
  }
  const session = await getStripe().checkout.sessions.create(sessionParams);
  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }
  return session.url;
}

// server/routers.ts
init_products();

// server/_core/voiceTranscription.ts
init_env();
async function transcribeAudio(options) {
  try {
    if (!ENV.forgeApiUrl) {
      return {
        error: "Voice transcription service is not configured",
        code: "SERVICE_ERROR",
        details: "BUILT_IN_FORGE_API_URL is not set"
      };
    }
    if (!ENV.forgeApiKey) {
      return {
        error: "Voice transcription service authentication is missing",
        code: "SERVICE_ERROR",
        details: "BUILT_IN_FORGE_API_KEY is not set"
      };
    }
    let audioBuffer;
    let mimeType;
    try {
      const response2 = await fetch(options.audioUrl);
      if (!response2.ok) {
        return {
          error: "Failed to download audio file",
          code: "INVALID_FORMAT",
          details: `HTTP ${response2.status}: ${response2.statusText}`
        };
      }
      audioBuffer = Buffer.from(await response2.arrayBuffer());
      mimeType = response2.headers.get("content-type") || "audio/mpeg";
      const sizeMB = audioBuffer.length / (1024 * 1024);
      if (sizeMB > 16) {
        return {
          error: "Audio file exceeds maximum size limit",
          code: "FILE_TOO_LARGE",
          details: `File size is ${sizeMB.toFixed(2)}MB, maximum allowed is 16MB`
        };
      }
    } catch (error) {
      return {
        error: "Failed to fetch audio file",
        code: "SERVICE_ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      };
    }
    const formData = new FormData();
    const filename = `audio.${getFileExtension(mimeType)}`;
    const audioBlob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append("file", audioBlob, filename);
    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");
    const prompt = options.prompt || (options.language ? `Transcribe the user's voice to text, the user's working language is ${getLanguageName(options.language)}` : "Transcribe the user's voice to text");
    formData.append("prompt", prompt);
    const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
    const fullUrl = new URL(
      "v1/audio/transcriptions",
      baseUrl
    ).toString();
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "Accept-Encoding": "identity"
      },
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        error: "Transcription service request failed",
        code: "TRANSCRIPTION_FAILED",
        details: `${response.status} ${response.statusText}${errorText ? `: ${errorText}` : ""}`
      };
    }
    const whisperResponse = await response.json();
    if (!whisperResponse.text || typeof whisperResponse.text !== "string") {
      return {
        error: "Invalid transcription response",
        code: "SERVICE_ERROR",
        details: "Transcription service returned an invalid response format"
      };
    }
    return whisperResponse;
  } catch (error) {
    return {
      error: "Voice transcription failed",
      code: "SERVICE_ERROR",
      details: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
function getFileExtension(mimeType) {
  const mimeToExt = {
    "audio/webm": "webm",
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/wave": "wav",
    "audio/ogg": "ogg",
    "audio/m4a": "m4a",
    "audio/mp4": "m4a"
  };
  return mimeToExt[mimeType] || "audio";
}
function getLanguageName(langCode) {
  const langMap = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi",
    "nl": "Dutch",
    "pl": "Polish",
    "tr": "Turkish",
    "sv": "Swedish",
    "da": "Danish",
    "no": "Norwegian",
    "fi": "Finnish"
  };
  return langMap[langCode] || langCode;
}

// server/routers/tarot.ts
import { z as z4 } from "zod";
init_db();
init_schema();
import { eq as eq6, desc as desc4 } from "drizzle-orm";
import { nanoid as nanoid2 } from "nanoid";

// server/tarot-database.ts
var MAJOR_ARCANA = [
  {
    id: 0,
    name: "The Fool",
    nameChinese: "\u611A\u8005",
    nameShort: "ar00",
    arcana: "major",
    number: 0,
    element: "Air",
    planet: "Uranus",
    keywords: ["new beginnings", "innocence", "adventure", "spontaneity", "free spirit"],
    keywordsChinese: ["\u65B0\u7684\u5F00\u59CB", "\u5929\u771F", "\u5192\u9669", "\u81EA\u53D1\u6027", "\u81EA\u7531\u7CBE\u795E"],
    meaningUpright: "New beginnings, innocence, spontaneity, a free spirit. Taking a leap of faith into the unknown with optimism and trust.",
    meaningReversed: "Holding back, recklessness, risk-taking, naivety. Fear of the unknown preventing growth.",
    meaningUprightChinese: "\u65B0\u7684\u5F00\u59CB\u3001\u5929\u771F\u3001\u81EA\u53D1\u6027\u3001\u81EA\u7531\u7CBE\u795E\u3002\u5E26\u7740\u4E50\u89C2\u548C\u4FE1\u4EFB\u8E0F\u5165\u672A\u77E5\u7684\u9886\u57DF\u3002",
    meaningReversedChinese: "\u72B9\u8C6B\u4E0D\u524D\u3001\u9C81\u83BD\u3001\u5192\u9669\u3001\u5929\u771F\u3002\u5BF9\u672A\u77E5\u7684\u6050\u60E7\u963B\u788D\u4E86\u6210\u957F\u3002",
    description: "A young person stands at the edge of a cliff, about to step into the unknown.",
    yesNo: "yes"
  },
  {
    id: 1,
    name: "The Magician",
    nameChinese: "\u9B54\u672F\u5E08",
    nameShort: "ar01",
    arcana: "major",
    number: 1,
    element: "Air",
    planet: "Mercury",
    keywords: ["manifestation", "resourcefulness", "power", "inspired action", "willpower"],
    keywordsChinese: ["\u663E\u5316", "\u8DB3\u667A\u591A\u8C0B", "\u529B\u91CF", "\u7075\u611F\u884C\u52A8", "\u610F\u5FD7\u529B"],
    meaningUpright: "Manifestation, resourcefulness, power, inspired action. You have all the tools and resources you need to manifest your desires.",
    meaningReversed: "Manipulation, poor planning, untapped talents. Wasted potential or deceptive intentions.",
    meaningUprightChinese: "\u663E\u5316\u3001\u8DB3\u667A\u591A\u8C0B\u3001\u529B\u91CF\u3001\u7075\u611F\u884C\u52A8\u3002\u4F60\u62E5\u6709\u5B9E\u73B0\u613F\u671B\u6240\u9700\u7684\u4E00\u5207\u5DE5\u5177\u548C\u8D44\u6E90\u3002",
    meaningReversedChinese: "\u64CD\u7EB5\u3001\u8BA1\u5212\u4E0D\u5468\u3001\u672A\u5F00\u53D1\u7684\u624D\u80FD\u3002\u6D6A\u8D39\u6F5C\u529B\u6216\u6B3A\u9A97\u6027\u610F\u56FE\u3002",
    description: "A figure with one hand pointing to the sky and the other to the earth, channeling divine power.",
    yesNo: "yes"
  },
  {
    id: 2,
    name: "The High Priestess",
    nameChinese: "\u5973\u796D\u53F8",
    nameShort: "ar02",
    arcana: "major",
    number: 2,
    element: "Water",
    planet: "Moon",
    keywords: ["intuition", "sacred knowledge", "divine feminine", "subconscious", "mystery"],
    keywordsChinese: ["\u76F4\u89C9", "\u795E\u5723\u77E5\u8BC6", "\u795E\u5723\u5973\u6027", "\u6F5C\u610F\u8BC6", "\u795E\u79D8"],
    meaningUpright: "Intuition, sacred knowledge, divine feminine, the subconscious mind. Trust your inner voice and look beyond the obvious.",
    meaningReversed: "Secrets, disconnected from intuition, withdrawal, silence. Information being withheld.",
    meaningUprightChinese: "\u76F4\u89C9\u3001\u795E\u5723\u77E5\u8BC6\u3001\u795E\u5723\u5973\u6027\u3001\u6F5C\u610F\u8BC6\u3002\u76F8\u4FE1\u4F60\u7684\u5185\u5FC3\u58F0\u97F3\uFF0C\u770B\u900F\u8868\u8C61\u3002",
    meaningReversedChinese: "\u79D8\u5BC6\u3001\u4E0E\u76F4\u89C9\u65AD\u5F00\u3001\u9000\u7F29\u3001\u6C89\u9ED8\u3002\u4FE1\u606F\u88AB\u9690\u7792\u3002",
    description: "A serene woman sits between two pillars, holding a scroll of sacred law.",
    yesNo: "maybe"
  },
  {
    id: 3,
    name: "The Empress",
    nameChinese: "\u5973\u7687",
    nameShort: "ar03",
    arcana: "major",
    number: 3,
    element: "Earth",
    zodiac: "Venus",
    keywords: ["femininity", "beauty", "nature", "nurturing", "abundance"],
    keywordsChinese: ["\u5973\u6027\u6C14\u8D28", "\u7F8E\u4E3D", "\u81EA\u7136", "\u517B\u80B2", "\u4E30\u76DB"],
    meaningUpright: "Femininity, beauty, nature, nurturing, abundance. A time of growth, fertility, and creative expression.",
    meaningReversed: "Creative block, dependence on others, emptiness. Neglecting self-care or smothering others.",
    meaningUprightChinese: "\u5973\u6027\u6C14\u8D28\u3001\u7F8E\u4E3D\u3001\u81EA\u7136\u3001\u517B\u80B2\u3001\u4E30\u76DB\u3002\u6210\u957F\u3001\u4E30\u9976\u548C\u521B\u9020\u6027\u8868\u8FBE\u7684\u65F6\u671F\u3002",
    meaningReversedChinese: "\u521B\u9020\u529B\u53D7\u963B\u3001\u4F9D\u8D56\u4ED6\u4EBA\u3001\u7A7A\u865A\u3002\u5FFD\u89C6\u81EA\u6211\u7167\u987E\u6216\u8FC7\u5EA6\u4FDD\u62A4\u4ED6\u4EBA\u3002",
    description: "A beautiful empress sits on a throne surrounded by lush nature and abundance.",
    yesNo: "yes"
  },
  {
    id: 4,
    name: "The Emperor",
    nameChinese: "\u7687\u5E1D",
    nameShort: "ar04",
    arcana: "major",
    number: 4,
    element: "Fire",
    zodiac: "Aries",
    keywords: ["authority", "establishment", "structure", "father figure", "leadership"],
    keywordsChinese: ["\u6743\u5A01", "\u5EFA\u7ACB", "\u7ED3\u6784", "\u7236\u4EB2\u5F62\u8C61", "\u9886\u5BFC\u529B"],
    meaningUpright: "Authority, establishment, structure, a father figure. Stability through discipline and strategic thinking.",
    meaningReversed: "Domination, excessive control, lack of discipline, inflexibility. Abuse of power.",
    meaningUprightChinese: "\u6743\u5A01\u3001\u5EFA\u7ACB\u3001\u7ED3\u6784\u3001\u7236\u4EB2\u5F62\u8C61\u3002\u901A\u8FC7\u7EAA\u5F8B\u548C\u6218\u7565\u601D\u7EF4\u83B7\u5F97\u7A33\u5B9A\u3002",
    meaningReversedChinese: "\u652F\u914D\u3001\u8FC7\u5EA6\u63A7\u5236\u3001\u7F3A\u4E4F\u7EAA\u5F8B\u3001\u4E0D\u7075\u6D3B\u3002\u6EE5\u7528\u6743\u529B\u3002",
    description: "A stern emperor sits on a stone throne adorned with ram heads.",
    yesNo: "yes"
  },
  {
    id: 5,
    name: "The Hierophant",
    nameChinese: "\u6559\u7687",
    nameShort: "ar05",
    arcana: "major",
    number: 5,
    element: "Earth",
    zodiac: "Taurus",
    keywords: ["spiritual wisdom", "tradition", "conformity", "morality", "education"],
    keywordsChinese: ["\u7CBE\u795E\u667A\u6167", "\u4F20\u7EDF", "\u9075\u4ECE", "\u9053\u5FB7", "\u6559\u80B2"],
    meaningUpright: "Spiritual wisdom, religious beliefs, conformity, tradition, institutions. Seeking guidance from established systems.",
    meaningReversed: "Personal beliefs, freedom, challenging the status quo. Breaking free from convention.",
    meaningUprightChinese: "\u7CBE\u795E\u667A\u6167\u3001\u5B97\u6559\u4FE1\u4EF0\u3001\u9075\u4ECE\u3001\u4F20\u7EDF\u3001\u5236\u5EA6\u3002\u4ECE\u65E2\u5B9A\u4F53\u7CFB\u4E2D\u5BFB\u6C42\u6307\u5BFC\u3002",
    meaningReversedChinese: "\u4E2A\u4EBA\u4FE1\u4EF0\u3001\u81EA\u7531\u3001\u6311\u6218\u73B0\u72B6\u3002\u6253\u7834\u5E38\u89C4\u3002",
    description: "A religious figure sits between two pillars, blessing two followers.",
    yesNo: "maybe"
  },
  {
    id: 6,
    name: "The Lovers",
    nameChinese: "\u604B\u4EBA",
    nameShort: "ar06",
    arcana: "major",
    number: 6,
    element: "Air",
    zodiac: "Gemini",
    keywords: ["love", "harmony", "relationships", "values alignment", "choices"],
    keywordsChinese: ["\u7231\u60C5", "\u548C\u8C10", "\u5173\u7CFB", "\u4EF7\u503C\u89C2\u4E00\u81F4", "\u9009\u62E9"],
    meaningUpright: "Love, harmony, relationships, values alignment, choices. A significant relationship or important decision about values.",
    meaningReversed: "Self-love, disharmony, imbalance, misalignment of values. Relationship conflicts or poor choices.",
    meaningUprightChinese: "\u7231\u60C5\u3001\u548C\u8C10\u3001\u5173\u7CFB\u3001\u4EF7\u503C\u89C2\u4E00\u81F4\u3001\u9009\u62E9\u3002\u91CD\u8981\u7684\u5173\u7CFB\u6216\u5173\u4E8E\u4EF7\u503C\u89C2\u7684\u91CD\u8981\u51B3\u5B9A\u3002",
    meaningReversedChinese: "\u81EA\u7231\u3001\u4E0D\u548C\u8C10\u3001\u5931\u8861\u3001\u4EF7\u503C\u89C2\u4E0D\u4E00\u81F4\u3002\u5173\u7CFB\u51B2\u7A81\u6216\u9519\u8BEF\u9009\u62E9\u3002",
    description: "An angel blesses a man and woman standing beneath, symbolizing divine union.",
    yesNo: "yes"
  },
  {
    id: 7,
    name: "The Chariot",
    nameChinese: "\u6218\u8F66",
    nameShort: "ar07",
    arcana: "major",
    number: 7,
    element: "Water",
    zodiac: "Cancer",
    keywords: ["control", "willpower", "success", "action", "determination"],
    keywordsChinese: ["\u63A7\u5236", "\u610F\u5FD7\u529B", "\u6210\u529F", "\u884C\u52A8", "\u51B3\u5FC3"],
    meaningUpright: "Control, willpower, success, action, determination. Overcoming obstacles through confidence and self-discipline.",
    meaningReversed: "Self-discipline, opposition, lack of direction. Aggression or losing control of a situation.",
    meaningUprightChinese: "\u63A7\u5236\u3001\u610F\u5FD7\u529B\u3001\u6210\u529F\u3001\u884C\u52A8\u3001\u51B3\u5FC3\u3002\u901A\u8FC7\u81EA\u4FE1\u548C\u81EA\u5F8B\u514B\u670D\u969C\u788D\u3002",
    meaningReversedChinese: "\u81EA\u5F8B\u3001\u5BF9\u6297\u3001\u7F3A\u4E4F\u65B9\u5411\u3002\u653B\u51FB\u6027\u6216\u5931\u53BB\u5BF9\u5C40\u9762\u7684\u63A7\u5236\u3002",
    description: "A warrior rides a chariot pulled by two sphinxes, one black and one white.",
    yesNo: "yes"
  },
  {
    id: 8,
    name: "Strength",
    nameChinese: "\u529B\u91CF",
    nameShort: "ar08",
    arcana: "major",
    number: 8,
    element: "Fire",
    zodiac: "Leo",
    keywords: ["strength", "courage", "persuasion", "influence", "compassion"],
    keywordsChinese: ["\u529B\u91CF", "\u52C7\u6C14", "\u8BF4\u670D\u529B", "\u5F71\u54CD\u529B", "\u6148\u60B2"],
    meaningUpright: "Strength, courage, persuasion, influence, compassion. Inner strength and the ability to overcome through patience.",
    meaningReversed: "Inner strength, self-doubt, low energy, raw emotion. Lacking confidence or feeling overwhelmed.",
    meaningUprightChinese: "\u529B\u91CF\u3001\u52C7\u6C14\u3001\u8BF4\u670D\u529B\u3001\u5F71\u54CD\u529B\u3001\u6148\u60B2\u3002\u5185\u5728\u529B\u91CF\u548C\u901A\u8FC7\u8010\u5FC3\u514B\u670D\u56F0\u96BE\u7684\u80FD\u529B\u3002",
    meaningReversedChinese: "\u5185\u5728\u529B\u91CF\u3001\u81EA\u6211\u6000\u7591\u3001\u7CBE\u529B\u4E0D\u8DB3\u3001\u539F\u59CB\u60C5\u611F\u3002\u7F3A\u4E4F\u4FE1\u5FC3\u6216\u611F\u5230\u4E0D\u582A\u91CD\u8D1F\u3002",
    description: "A woman gently closes the jaws of a lion, showing mastery through gentleness.",
    yesNo: "yes"
  },
  {
    id: 9,
    name: "The Hermit",
    nameChinese: "\u9690\u8005",
    nameShort: "ar09",
    arcana: "major",
    number: 9,
    element: "Earth",
    zodiac: "Virgo",
    keywords: ["soul-searching", "introspection", "being alone", "inner guidance", "wisdom"],
    keywordsChinese: ["\u7075\u9B42\u63A2\u7D22", "\u5185\u7701", "\u72EC\u5904", "\u5185\u5728\u6307\u5F15", "\u667A\u6167"],
    meaningUpright: "Soul-searching, introspection, being alone, inner guidance. A period of reflection and seeking deeper truth.",
    meaningReversed: "Isolation, loneliness, withdrawal. Excessive solitude or refusing to seek help.",
    meaningUprightChinese: "\u7075\u9B42\u63A2\u7D22\u3001\u5185\u7701\u3001\u72EC\u5904\u3001\u5185\u5728\u6307\u5F15\u3002\u53CD\u601D\u548C\u5BFB\u6C42\u66F4\u6DF1\u5C42\u771F\u7406\u7684\u65F6\u671F\u3002",
    meaningReversedChinese: "\u5B64\u7ACB\u3001\u5B64\u72EC\u3001\u9000\u7F29\u3002\u8FC7\u5EA6\u72EC\u5904\u6216\u62D2\u7EDD\u5BFB\u6C42\u5E2E\u52A9\u3002",
    description: "An old man stands alone on a mountain, holding a lantern to light the way.",
    yesNo: "maybe"
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameChinese: "\u547D\u8FD0\u4E4B\u8F6E",
    nameShort: "ar10",
    arcana: "major",
    number: 10,
    element: "Fire",
    planet: "Jupiter",
    keywords: ["good luck", "karma", "life cycles", "destiny", "turning point"],
    keywordsChinese: ["\u597D\u8FD0", "\u56E0\u679C", "\u751F\u547D\u5468\u671F", "\u547D\u8FD0", "\u8F6C\u6298\u70B9"],
    meaningUpright: "Good luck, karma, life cycles, destiny, a turning point. The wheel is turning in your favor.",
    meaningReversed: "Bad luck, resistance to change, breaking cycles. External forces disrupting your plans.",
    meaningUprightChinese: "\u597D\u8FD0\u3001\u56E0\u679C\u3001\u751F\u547D\u5468\u671F\u3001\u547D\u8FD0\u3001\u8F6C\u6298\u70B9\u3002\u547D\u8FD0\u4E4B\u8F6E\u6B63\u5728\u5411\u4F60\u6709\u5229\u7684\u65B9\u5411\u8F6C\u52A8\u3002",
    meaningReversedChinese: "\u5384\u8FD0\u3001\u6297\u62D2\u53D8\u5316\u3001\u6253\u7834\u5FAA\u73AF\u3002\u5916\u90E8\u529B\u91CF\u6253\u4E71\u4F60\u7684\u8BA1\u5212\u3002",
    description: "A great wheel turns with figures rising and falling, symbolizing fate.",
    yesNo: "yes"
  },
  {
    id: 11,
    name: "Justice",
    nameChinese: "\u6B63\u4E49",
    nameShort: "ar11",
    arcana: "major",
    number: 11,
    element: "Air",
    zodiac: "Libra",
    keywords: ["justice", "fairness", "truth", "cause and effect", "law"],
    keywordsChinese: ["\u6B63\u4E49", "\u516C\u5E73", "\u771F\u76F8", "\u56E0\u679C", "\u6CD5\u5F8B"],
    meaningUpright: "Justice, fairness, truth, cause and effect, law. Accountability and the consequences of your actions.",
    meaningReversed: "Unfairness, lack of accountability, dishonesty. Being treated unjustly or avoiding responsibility.",
    meaningUprightChinese: "\u6B63\u4E49\u3001\u516C\u5E73\u3001\u771F\u76F8\u3001\u56E0\u679C\u3001\u6CD5\u5F8B\u3002\u8D23\u4EFB\u548C\u4F60\u884C\u4E3A\u7684\u540E\u679C\u3002",
    meaningReversedChinese: "\u4E0D\u516C\u5E73\u3001\u7F3A\u4E4F\u8D23\u4EFB\u611F\u3001\u4E0D\u8BDA\u5B9E\u3002\u53D7\u5230\u4E0D\u516C\u6B63\u5BF9\u5F85\u6216\u9003\u907F\u8D23\u4EFB\u3002",
    description: "A figure holds scales and a sword, seated between two pillars.",
    yesNo: "maybe"
  },
  {
    id: 12,
    name: "The Hanged Man",
    nameChinese: "\u5012\u540A\u4EBA",
    nameShort: "ar12",
    arcana: "major",
    number: 12,
    element: "Water",
    planet: "Neptune",
    keywords: ["pause", "surrender", "letting go", "new perspectives", "sacrifice"],
    keywordsChinese: ["\u6682\u505C", "\u81E3\u670D", "\u653E\u624B", "\u65B0\u89C6\u89D2", "\u727A\u7272"],
    meaningUpright: "Pause, surrender, letting go, new perspectives. Seeing things from a different angle through willing sacrifice.",
    meaningReversed: "Delays, resistance, stalling, indecision. Refusing to make necessary sacrifices.",
    meaningUprightChinese: "\u6682\u505C\u3001\u81E3\u670D\u3001\u653E\u624B\u3001\u65B0\u89C6\u89D2\u3002\u901A\u8FC7\u81EA\u613F\u727A\u7272\u4ECE\u4E0D\u540C\u89D2\u5EA6\u770B\u5F85\u4E8B\u7269\u3002",
    meaningReversedChinese: "\u5EF6\u8FDF\u3001\u62B5\u6297\u3001\u62D6\u5EF6\u3001\u72B9\u8C6B\u4E0D\u51B3\u3002\u62D2\u7EDD\u505A\u51FA\u5FC5\u8981\u7684\u727A\u7272\u3002",
    description: "A man hangs upside down from a tree, serene and enlightened.",
    yesNo: "maybe"
  },
  {
    id: 13,
    name: "Death",
    nameChinese: "\u6B7B\u795E",
    nameShort: "ar13",
    arcana: "major",
    number: 13,
    element: "Water",
    zodiac: "Scorpio",
    keywords: ["endings", "change", "transformation", "transition", "release"],
    keywordsChinese: ["\u7ED3\u675F", "\u53D8\u5316", "\u8F6C\u53D8", "\u8FC7\u6E21", "\u91CA\u653E"],
    meaningUpright: "Endings, change, transformation, transition. The end of one chapter and the beginning of another.",
    meaningReversed: "Resistance to change, personal transformation, inner purging. Clinging to the past.",
    meaningUprightChinese: "\u7ED3\u675F\u3001\u53D8\u5316\u3001\u8F6C\u53D8\u3001\u8FC7\u6E21\u3002\u4E00\u4E2A\u7BC7\u7AE0\u7684\u7ED3\u675F\u548C\u53E6\u4E00\u4E2A\u7BC7\u7AE0\u7684\u5F00\u59CB\u3002",
    meaningReversedChinese: "\u6297\u62D2\u53D8\u5316\u3001\u4E2A\u4EBA\u8F6C\u53D8\u3001\u5185\u5728\u51C0\u5316\u3002\u6267\u7740\u4E8E\u8FC7\u53BB\u3002",
    description: "A skeleton in armor rides a white horse, carrying a black flag with a white rose.",
    yesNo: "no"
  },
  {
    id: 14,
    name: "Temperance",
    nameChinese: "\u8282\u5236",
    nameShort: "ar14",
    arcana: "major",
    number: 14,
    element: "Fire",
    zodiac: "Sagittarius",
    keywords: ["balance", "moderation", "patience", "purpose", "harmony"],
    keywordsChinese: ["\u5E73\u8861", "\u8282\u5236", "\u8010\u5FC3", "\u76EE\u7684", "\u548C\u8C10"],
    meaningUpright: "Balance, moderation, patience, purpose. Finding middle ground and practicing patience.",
    meaningReversed: "Imbalance, excess, self-healing, re-alignment. Overindulgence or lack of moderation.",
    meaningUprightChinese: "\u5E73\u8861\u3001\u8282\u5236\u3001\u8010\u5FC3\u3001\u76EE\u7684\u3002\u627E\u5230\u4E2D\u95F4\u7ACB\u573A\u5E76\u7EC3\u4E60\u8010\u5FC3\u3002",
    meaningReversedChinese: "\u5931\u8861\u3001\u8FC7\u5EA6\u3001\u81EA\u6211\u7597\u6108\u3001\u91CD\u65B0\u8C03\u6574\u3002\u8FC7\u5EA6\u653E\u7EB5\u6216\u7F3A\u4E4F\u8282\u5236\u3002",
    description: "An angel pours water between two cups, blending opposites into harmony.",
    yesNo: "yes"
  },
  {
    id: 15,
    name: "The Devil",
    nameChinese: "\u6076\u9B54",
    nameShort: "ar15",
    arcana: "major",
    number: 15,
    element: "Earth",
    zodiac: "Capricorn",
    keywords: ["shadow self", "attachment", "addiction", "restriction", "sexuality"],
    keywordsChinese: ["\u9634\u6697\u9762", "\u6267\u7740", "\u6210\u763E", "\u9650\u5236", "\u6B32\u671B"],
    meaningUpright: "Shadow self, attachment, addiction, restriction, sexuality. Being bound by material desires or unhealthy patterns.",
    meaningReversed: "Releasing limiting beliefs, exploring dark thoughts, detachment. Breaking free from bondage.",
    meaningUprightChinese: "\u9634\u6697\u9762\u3001\u6267\u7740\u3001\u6210\u763E\u3001\u9650\u5236\u3001\u6B32\u671B\u3002\u88AB\u7269\u8D28\u6B32\u671B\u6216\u4E0D\u5065\u5EB7\u7684\u6A21\u5F0F\u6240\u675F\u7F1A\u3002",
    meaningReversedChinese: "\u91CA\u653E\u9650\u5236\u6027\u4FE1\u5FF5\u3001\u63A2\u7D22\u9634\u6697\u601D\u60F3\u3001\u8D85\u8131\u3002\u4ECE\u675F\u7F1A\u4E2D\u89E3\u8131\u3002",
    description: "A horned devil figure looms over two chained figures.",
    yesNo: "no"
  },
  {
    id: 16,
    name: "The Tower",
    nameChinese: "\u5854",
    nameShort: "ar16",
    arcana: "major",
    number: 16,
    element: "Fire",
    planet: "Mars",
    keywords: ["sudden change", "upheaval", "chaos", "revelation", "awakening"],
    keywordsChinese: ["\u7A81\u53D8", "\u5267\u53D8", "\u6DF7\u4E71", "\u542F\u793A", "\u89C9\u9192"],
    meaningUpright: "Sudden change, upheaval, chaos, revelation, awakening. Destruction of false structures to reveal truth.",
    meaningReversed: "Personal transformation, fear of change, averting disaster. Resisting necessary upheaval.",
    meaningUprightChinese: "\u7A81\u53D8\u3001\u5267\u53D8\u3001\u6DF7\u4E71\u3001\u542F\u793A\u3001\u89C9\u9192\u3002\u6467\u6BC1\u865A\u5047\u7ED3\u6784\u4EE5\u63ED\u793A\u771F\u76F8\u3002",
    meaningReversedChinese: "\u4E2A\u4EBA\u8F6C\u53D8\u3001\u5BB3\u6015\u53D8\u5316\u3001\u907F\u514D\u707E\u96BE\u3002\u62B5\u6297\u5FC5\u8981\u7684\u5267\u53D8\u3002",
    description: "Lightning strikes a tower, sending figures falling from its heights.",
    yesNo: "no"
  },
  {
    id: 17,
    name: "The Star",
    nameChinese: "\u661F\u661F",
    nameShort: "ar17",
    arcana: "major",
    number: 17,
    element: "Air",
    zodiac: "Aquarius",
    keywords: ["hope", "faith", "purpose", "renewal", "spirituality"],
    keywordsChinese: ["\u5E0C\u671B", "\u4FE1\u5FF5", "\u76EE\u7684", "\u91CD\u751F", "\u7075\u6027"],
    meaningUpright: "Hope, faith, purpose, renewal, spirituality. A period of healing and renewed optimism after difficulty.",
    meaningReversed: "Lack of faith, despair, self-trust, disconnection. Losing hope or feeling uninspired.",
    meaningUprightChinese: "\u5E0C\u671B\u3001\u4FE1\u5FF5\u3001\u76EE\u7684\u3001\u91CD\u751F\u3001\u7075\u6027\u3002\u56F0\u96BE\u4E4B\u540E\u7684\u7597\u6108\u548C\u91CD\u65B0\u4E50\u89C2\u7684\u65F6\u671F\u3002",
    meaningReversedChinese: "\u7F3A\u4E4F\u4FE1\u5FF5\u3001\u7EDD\u671B\u3001\u81EA\u6211\u4FE1\u4EFB\u3001\u65AD\u5F00\u8FDE\u63A5\u3002\u5931\u53BB\u5E0C\u671B\u6216\u611F\u5230\u7F3A\u4E4F\u7075\u611F\u3002",
    description: "A woman kneels by water under a starlit sky, pouring water onto land and into a pool.",
    yesNo: "yes"
  },
  {
    id: 18,
    name: "The Moon",
    nameChinese: "\u6708\u4EAE",
    nameShort: "ar18",
    arcana: "major",
    number: 18,
    element: "Water",
    zodiac: "Pisces",
    keywords: ["illusion", "fear", "anxiety", "subconscious", "intuition"],
    keywordsChinese: ["\u5E7B\u89C9", "\u6050\u60E7", "\u7126\u8651", "\u6F5C\u610F\u8BC6", "\u76F4\u89C9"],
    meaningUpright: "Illusion, fear, anxiety, subconscious, intuition. Things are not as they seem; trust your instincts.",
    meaningReversed: "Release of fear, repressed emotion, inner confusion. Clarity emerging from darkness.",
    meaningUprightChinese: "\u5E7B\u89C9\u3001\u6050\u60E7\u3001\u7126\u8651\u3001\u6F5C\u610F\u8BC6\u3001\u76F4\u89C9\u3002\u4E8B\u60C5\u5E76\u975E\u8868\u9762\u6240\u89C1\uFF1B\u76F8\u4FE1\u4F60\u7684\u76F4\u89C9\u3002",
    meaningReversedChinese: "\u91CA\u653E\u6050\u60E7\u3001\u538B\u6291\u7684\u60C5\u611F\u3001\u5185\u5FC3\u56F0\u60D1\u3002\u4ECE\u9ED1\u6697\u4E2D\u6D6E\u73B0\u7684\u6E05\u6670\u3002",
    description: "A moon shines over a path between two towers, with a dog and wolf howling.",
    yesNo: "no"
  },
  {
    id: 19,
    name: "The Sun",
    nameChinese: "\u592A\u9633",
    nameShort: "ar19",
    arcana: "major",
    number: 19,
    element: "Fire",
    planet: "Sun",
    keywords: ["positivity", "fun", "warmth", "success", "vitality"],
    keywordsChinese: ["\u79EF\u6781", "\u5FEB\u4E50", "\u6E29\u6696", "\u6210\u529F", "\u6D3B\u529B"],
    meaningUpright: "Positivity, fun, warmth, success, vitality. Joy, celebration, and achievement. Everything is going well.",
    meaningReversed: "Inner child, feeling down, overly optimistic. Temporary setbacks or unrealistic expectations.",
    meaningUprightChinese: "\u79EF\u6781\u3001\u5FEB\u4E50\u3001\u6E29\u6696\u3001\u6210\u529F\u3001\u6D3B\u529B\u3002\u559C\u60A6\u3001\u5E86\u795D\u548C\u6210\u5C31\u3002\u4E00\u5207\u987A\u5229\u3002",
    meaningReversedChinese: "\u5185\u5728\u5C0F\u5B69\u3001\u60C5\u7EEA\u4F4E\u843D\u3001\u8FC7\u5EA6\u4E50\u89C2\u3002\u6682\u65F6\u7684\u632B\u6298\u6216\u4E0D\u5207\u5B9E\u9645\u7684\u671F\u671B\u3002",
    description: "A child rides a white horse under a bright sun, surrounded by sunflowers.",
    yesNo: "yes"
  },
  {
    id: 20,
    name: "Judgement",
    nameChinese: "\u5BA1\u5224",
    nameShort: "ar20",
    arcana: "major",
    number: 20,
    element: "Fire",
    planet: "Pluto",
    keywords: ["judgement", "rebirth", "inner calling", "absolution", "reflection"],
    keywordsChinese: ["\u5BA1\u5224", "\u91CD\u751F", "\u5185\u5728\u53EC\u5524", "\u8D66\u514D", "\u53CD\u601D"],
    meaningUpright: "Judgement, rebirth, inner calling, absolution. A time of reckoning and answering a higher calling.",
    meaningReversed: "Self-doubt, inner critic, ignoring the call. Refusing to learn from past experiences.",
    meaningUprightChinese: "\u5BA1\u5224\u3001\u91CD\u751F\u3001\u5185\u5728\u53EC\u5524\u3001\u8D66\u514D\u3002\u6E05\u7B97\u548C\u56DE\u5E94\u66F4\u9AD8\u53EC\u5524\u7684\u65F6\u523B\u3002",
    meaningReversedChinese: "\u81EA\u6211\u6000\u7591\u3001\u5185\u5728\u6279\u8BC4\u8005\u3001\u5FFD\u89C6\u53EC\u5524\u3002\u62D2\u7EDD\u4ECE\u8FC7\u53BB\u7684\u7ECF\u9A8C\u4E2D\u5B66\u4E60\u3002",
    description: "An angel blows a trumpet as figures rise from their graves in response.",
    yesNo: "yes"
  },
  {
    id: 21,
    name: "The World",
    nameChinese: "\u4E16\u754C",
    nameShort: "ar21",
    arcana: "major",
    number: 21,
    element: "Earth",
    planet: "Saturn",
    keywords: ["completion", "integration", "accomplishment", "travel", "wholeness"],
    keywordsChinese: ["\u5B8C\u6210", "\u6574\u5408", "\u6210\u5C31", "\u65C5\u884C", "\u5B8C\u6574"],
    meaningUpright: "Completion, integration, accomplishment, travel. A major cycle is complete; celebration and fulfillment.",
    meaningReversed: "Seeking personal closure, short-cuts, delays. Feeling incomplete or unable to finish.",
    meaningUprightChinese: "\u5B8C\u6210\u3001\u6574\u5408\u3001\u6210\u5C31\u3001\u65C5\u884C\u3002\u4E00\u4E2A\u91CD\u8981\u7684\u5FAA\u73AF\u5DF2\u7ECF\u5B8C\u6210\uFF1B\u5E86\u795D\u548C\u6EE1\u8DB3\u3002",
    meaningReversedChinese: "\u5BFB\u6C42\u4E2A\u4EBA\u4E86\u7ED3\u3001\u8D70\u6377\u5F84\u3001\u5EF6\u8FDF\u3002\u611F\u89C9\u4E0D\u5B8C\u6574\u6216\u65E0\u6CD5\u5B8C\u6210\u3002",
    description: "A dancing figure is surrounded by a wreath, with four creatures in the corners.",
    yesNo: "yes"
  }
];
var SUITS = [
  { suit: "wands", element: "Fire", suitChinese: "\u6743\u6756", theme: "passion, creativity, ambition", themeChinese: "\u6FC0\u60C5\u3001\u521B\u9020\u529B\u3001\u62B1\u8D1F" },
  { suit: "cups", element: "Water", suitChinese: "\u5723\u676F", theme: "emotions, relationships, intuition", themeChinese: "\u60C5\u611F\u3001\u5173\u7CFB\u3001\u76F4\u89C9" },
  { suit: "swords", element: "Air", suitChinese: "\u5B9D\u5251", theme: "intellect, conflict, truth", themeChinese: "\u667A\u6167\u3001\u51B2\u7A81\u3001\u771F\u76F8" },
  { suit: "pentacles", element: "Earth", suitChinese: "\u661F\u5E01", theme: "material, career, finances", themeChinese: "\u7269\u8D28\u3001\u4E8B\u4E1A\u3001\u8D22\u52A1" }
];
var MINOR_MEANINGS = {
  wands: [
    { upright: "Inspiration, new opportunities, growth, potential", reversed: "An emerging idea, lack of direction, distractions, delays", keywords: ["creation", "willpower", "inspiration"], keywordsZh: ["\u521B\u9020", "\u610F\u5FD7\u529B", "\u7075\u611F"], uprightZh: "\u7075\u611F\u3001\u65B0\u673A\u4F1A\u3001\u6210\u957F\u3001\u6F5C\u529B", reversedZh: "\u840C\u82BD\u7684\u60F3\u6CD5\u3001\u7F3A\u4E4F\u65B9\u5411\u3001\u5206\u5FC3\u3001\u5EF6\u8FDF" },
    { upright: "Future planning, progress, decisions, discovery", reversed: "Personal goals, inner alignment, fear of unknown", keywords: ["planning", "decisions", "discovery"], keywordsZh: ["\u89C4\u5212", "\u51B3\u7B56", "\u53D1\u73B0"], uprightZh: "\u672A\u6765\u89C4\u5212\u3001\u8FDB\u6B65\u3001\u51B3\u7B56\u3001\u53D1\u73B0", reversedZh: "\u4E2A\u4EBA\u76EE\u6807\u3001\u5185\u5728\u5BF9\u9F50\u3001\u5BF9\u672A\u77E5\u7684\u6050\u60E7" },
    { upright: "Progress, expansion, foresight, overseas opportunities", reversed: "Obstacles in long-term plans, delays in travel, frustration", keywords: ["expansion", "foresight", "progress"], keywordsZh: ["\u6269\u5C55", "\u8FDC\u89C1", "\u8FDB\u6B65"], uprightZh: "\u8FDB\u6B65\u3001\u6269\u5C55\u3001\u8FDC\u89C1\u3001\u6D77\u5916\u673A\u4F1A", reversedZh: "\u957F\u671F\u8BA1\u5212\u4E2D\u7684\u969C\u788D\u3001\u65C5\u884C\u5EF6\u8FDF\u3001\u632B\u6298" },
    { upright: "Celebration, joy, harmony, relaxation, homecoming", reversed: "Personal celebration, inner harmony, conflict with others", keywords: ["celebration", "harmony", "stability"], keywordsZh: ["\u5E86\u795D", "\u548C\u8C10", "\u7A33\u5B9A"], uprightZh: "\u5E86\u795D\u3001\u559C\u60A6\u3001\u548C\u8C10\u3001\u653E\u677E\u3001\u56DE\u5BB6", reversedZh: "\u4E2A\u4EBA\u5E86\u795D\u3001\u5185\u5728\u548C\u8C10\u3001\u4E0E\u4ED6\u4EBA\u7684\u51B2\u7A81" },
    { upright: "Conflict, disagreements, competition, tension, diversity", reversed: "Inner conflict, conflict avoidance, release of tension", keywords: ["competition", "conflict", "challenge"], keywordsZh: ["\u7ADE\u4E89", "\u51B2\u7A81", "\u6311\u6218"], uprightZh: "\u51B2\u7A81\u3001\u5206\u6B67\u3001\u7ADE\u4E89\u3001\u7D27\u5F20\u3001\u591A\u6837\u6027", reversedZh: "\u5185\u5728\u51B2\u7A81\u3001\u56DE\u907F\u51B2\u7A81\u3001\u91CA\u653E\u7D27\u5F20" },
    { upright: "Public recognition, progress, self-confidence, victory", reversed: "Fall from grace, egotism, lack of recognition", keywords: ["victory", "recognition", "pride"], keywordsZh: ["\u80DC\u5229", "\u8BA4\u53EF", "\u81EA\u8C6A"], uprightZh: "\u516C\u4F17\u8BA4\u53EF\u3001\u8FDB\u6B65\u3001\u81EA\u4FE1\u3001\u80DC\u5229", reversedZh: "\u5931\u5BA0\u3001\u81EA\u5927\u3001\u7F3A\u4E4F\u8BA4\u53EF" },
    { upright: "Challenge, competition, perseverance, maintaining position", reversed: "Giving up, overwhelmed, being protective", keywords: ["perseverance", "defense", "courage"], keywordsZh: ["\u575A\u6301", "\u9632\u5FA1", "\u52C7\u6C14"], uprightZh: "\u6311\u6218\u3001\u7ADE\u4E89\u3001\u575A\u6301\u3001\u7EF4\u6301\u5730\u4F4D", reversedZh: "\u653E\u5F03\u3001\u4E0D\u582A\u91CD\u8D1F\u3001\u4FDD\u62A4\u6027" },
    { upright: "Movement, fast paced change, action, alignment, air travel", reversed: "Delays, frustration, resisting change, internal alignment", keywords: ["speed", "action", "movement"], keywordsZh: ["\u901F\u5EA6", "\u884C\u52A8", "\u8FD0\u52A8"], uprightZh: "\u8FD0\u52A8\u3001\u5FEB\u901F\u53D8\u5316\u3001\u884C\u52A8\u3001\u5BF9\u9F50\u3001\u822A\u7A7A\u65C5\u884C", reversedZh: "\u5EF6\u8FDF\u3001\u632B\u6298\u3001\u6297\u62D2\u53D8\u5316\u3001\u5185\u5728\u5BF9\u9F50" },
    { upright: "Resilience, grit, last stand, boundaries, courage", reversed: "Overwhelm, giving in, no fight left, exhaustion", keywords: ["resilience", "boundaries", "persistence"], keywordsZh: ["\u97E7\u6027", "\u8FB9\u754C", "\u575A\u6301"], uprightZh: "\u97E7\u6027\u3001\u6BC5\u529B\u3001\u6700\u540E\u4E00\u640F\u3001\u8FB9\u754C\u3001\u52C7\u6C14", reversedZh: "\u4E0D\u582A\u91CD\u8D1F\u3001\u5C48\u670D\u3001\u65E0\u529B\u62B5\u6297\u3001\u7CBE\u75B2\u529B\u7AED" },
    { upright: "Burden, extra responsibility, hard work, completion", reversed: "Inability to delegate, overstressed, burnt out", keywords: ["burden", "responsibility", "completion"], keywordsZh: ["\u8D1F\u62C5", "\u8D23\u4EFB", "\u5B8C\u6210"], uprightZh: "\u8D1F\u62C5\u3001\u989D\u5916\u8D23\u4EFB\u3001\u52AA\u529B\u5DE5\u4F5C\u3001\u5B8C\u6210", reversedZh: "\u65E0\u6CD5\u59D4\u6D3E\u3001\u538B\u529B\u8FC7\u5927\u3001\u7CBE\u75B2\u529B\u7AED" },
    { upright: "Enthusiasm, exploration, discovery, free spirit", reversed: "Setbacks, lack of direction, procrastination", keywords: ["adventure", "enthusiasm", "discovery"], keywordsZh: ["\u5192\u9669", "\u70ED\u60C5", "\u53D1\u73B0"], uprightZh: "\u70ED\u60C5\u3001\u63A2\u7D22\u3001\u53D1\u73B0\u3001\u81EA\u7531\u7CBE\u795E", reversedZh: "\u632B\u6298\u3001\u7F3A\u4E4F\u65B9\u5411\u3001\u62D6\u5EF6" },
    { upright: "Bold, energetic, charming, hero, determined", reversed: "Haste, scattered energy, delays, frustration", keywords: ["action", "passion", "adventure"], keywordsZh: ["\u884C\u52A8", "\u6FC0\u60C5", "\u5192\u9669"], uprightZh: "\u5927\u80C6\u3001\u7CBE\u529B\u5145\u6C9B\u3001\u8FF7\u4EBA\u3001\u82F1\u96C4\u3001\u575A\u5B9A", reversedZh: "\u4ED3\u4FC3\u3001\u7CBE\u529B\u5206\u6563\u3001\u5EF6\u8FDF\u3001\u632B\u6298" },
    { upright: "Natural leader, vision, entrepreneur, honour", reversed: "Impulsiveness, haste, ruthless, high expectations", keywords: ["leadership", "vision", "boldness"], keywordsZh: ["\u9886\u5BFC\u529B", "\u8FDC\u89C1", "\u5927\u80C6"], uprightZh: "\u5929\u751F\u7684\u9886\u5BFC\u8005\u3001\u8FDC\u89C1\u3001\u4F01\u4E1A\u5BB6\u3001\u8363\u8A89", reversedZh: "\u51B2\u52A8\u3001\u4ED3\u4FC3\u3001\u65E0\u60C5\u3001\u9AD8\u671F\u671B" },
    { upright: "Courage, determination, joy, leadership, optimism", reversed: "Demanding, controlling, overbearing", keywords: ["confidence", "determination", "optimism"], keywordsZh: ["\u4FE1\u5FC3", "\u51B3\u5FC3", "\u4E50\u89C2"], uprightZh: "\u52C7\u6C14\u3001\u51B3\u5FC3\u3001\u559C\u60A6\u3001\u9886\u5BFC\u529B\u3001\u4E50\u89C2", reversedZh: "\u82DB\u6C42\u3001\u63A7\u5236\u3001\u4E13\u6A2A" }
  ],
  cups: [
    { upright: "Love, new relationships, compassion, creativity", reversed: "Self-love, intuition, repressed emotions", keywords: ["love", "new feelings", "compassion"], keywordsZh: ["\u7231", "\u65B0\u611F\u53D7", "\u6148\u60B2"], uprightZh: "\u7231\u3001\u65B0\u5173\u7CFB\u3001\u6148\u60B2\u3001\u521B\u9020\u529B", reversedZh: "\u81EA\u7231\u3001\u76F4\u89C9\u3001\u538B\u6291\u7684\u60C5\u611F" },
    { upright: "Unified love, partnership, mutual attraction", reversed: "Self-love, break-ups, disharmony, distrust", keywords: ["partnership", "unity", "attraction"], keywordsZh: ["\u4F19\u4F34\u5173\u7CFB", "\u7EDF\u4E00", "\u5438\u5F15\u529B"], uprightZh: "\u7EDF\u4E00\u7684\u7231\u3001\u4F19\u4F34\u5173\u7CFB\u3001\u76F8\u4E92\u5438\u5F15", reversedZh: "\u81EA\u7231\u3001\u5206\u624B\u3001\u4E0D\u548C\u8C10\u3001\u4E0D\u4FE1\u4EFB" },
    { upright: "Celebration, friendship, creativity, collaborations", reversed: "Overindulgence, gossip, isolation", keywords: ["celebration", "friendship", "joy"], keywordsZh: ["\u5E86\u795D", "\u53CB\u8C0A", "\u5FEB\u4E50"], uprightZh: "\u5E86\u795D\u3001\u53CB\u8C0A\u3001\u521B\u9020\u529B\u3001\u5408\u4F5C", reversedZh: "\u8FC7\u5EA6\u653E\u7EB5\u3001\u516B\u5366\u3001\u5B64\u7ACB" },
    { upright: "Meditation, contemplation, apathy, reevaluation", reversed: "Retreat, withdrawal, checking in for alignment", keywords: ["contemplation", "apathy", "reevaluation"], keywordsZh: ["\u6C89\u601D", "\u51B7\u6F20", "\u91CD\u65B0\u8BC4\u4F30"], uprightZh: "\u51A5\u60F3\u3001\u6C89\u601D\u3001\u51B7\u6F20\u3001\u91CD\u65B0\u8BC4\u4F30", reversedZh: "\u9000\u7F29\u3001\u64A4\u9000\u3001\u68C0\u67E5\u5BF9\u9F50" },
    { upright: "Regret, failure, disappointment, pessimism", reversed: "Personal setbacks, self-forgiveness, moving on", keywords: ["loss", "regret", "disappointment"], keywordsZh: ["\u5931\u53BB", "\u9057\u61BE", "\u5931\u671B"], uprightZh: "\u9057\u61BE\u3001\u5931\u8D25\u3001\u5931\u671B\u3001\u60B2\u89C2", reversedZh: "\u4E2A\u4EBA\u632B\u6298\u3001\u81EA\u6211\u5BBD\u6055\u3001\u7EE7\u7EED\u524D\u8FDB" },
    { upright: "Revisiting the past, childhood memories, innocence, joy", reversed: "Stuck in the past, naivety, unrealistic", keywords: ["nostalgia", "memories", "innocence"], keywordsZh: ["\u6000\u65E7", "\u56DE\u5FC6", "\u5929\u771F"], uprightZh: "\u91CD\u6E29\u8FC7\u53BB\u3001\u7AE5\u5E74\u8BB0\u5FC6\u3001\u5929\u771F\u3001\u5FEB\u4E50", reversedZh: "\u56F0\u5728\u8FC7\u53BB\u3001\u5929\u771F\u3001\u4E0D\u5207\u5B9E\u9645" },
    { upright: "Opportunities, choices, wishful thinking, illusion", reversed: "Alignment, personal values, overwhelmed by choices", keywords: ["choices", "fantasy", "opportunities"], keywordsZh: ["\u9009\u62E9", "\u5E7B\u60F3", "\u673A\u4F1A"], uprightZh: "\u673A\u4F1A\u3001\u9009\u62E9\u3001\u4E00\u53A2\u60C5\u613F\u3001\u5E7B\u89C9", reversedZh: "\u5BF9\u9F50\u3001\u4E2A\u4EBA\u4EF7\u503C\u89C2\u3001\u88AB\u9009\u62E9\u6DF9\u6CA1" },
    { upright: "Disappointment, abandonment, withdrawal, escapism", reversed: "Trying one more time, indecision, aimless drifting", keywords: ["abandonment", "withdrawal", "seeking"], keywordsZh: ["\u653E\u5F03", "\u9000\u51FA", "\u5BFB\u627E"], uprightZh: "\u5931\u671B\u3001\u653E\u5F03\u3001\u9000\u51FA\u3001\u9003\u907F", reversedZh: "\u518D\u8BD5\u4E00\u6B21\u3001\u72B9\u8C6B\u4E0D\u51B3\u3001\u6F2B\u65E0\u76EE\u7684" },
    { upright: "Contentment, satisfaction, gratitude, wish come true", reversed: "Inner happiness, materialism, dissatisfaction", keywords: ["fulfillment", "satisfaction", "wishes"], keywordsZh: ["\u6EE1\u8DB3", "\u6EE1\u610F", "\u613F\u671B"], uprightZh: "\u6EE1\u8DB3\u3001\u6EE1\u610F\u3001\u611F\u6069\u3001\u613F\u671B\u6210\u771F", reversedZh: "\u5185\u5728\u5E78\u798F\u3001\u7269\u8D28\u4E3B\u4E49\u3001\u4E0D\u6EE1" },
    { upright: "Divine love, blissful relationships, harmony, alignment", reversed: "Disconnection, misaligned values, struggling relationships", keywords: ["harmony", "happiness", "family"], keywordsZh: ["\u548C\u8C10", "\u5E78\u798F", "\u5BB6\u5EAD"], uprightZh: "\u795E\u5723\u7684\u7231\u3001\u5E78\u798F\u7684\u5173\u7CFB\u3001\u548C\u8C10\u3001\u5BF9\u9F50", reversedZh: "\u65AD\u5F00\u8FDE\u63A5\u3001\u4EF7\u503C\u89C2\u4E0D\u4E00\u81F4\u3001\u6323\u624E\u7684\u5173\u7CFB" },
    { upright: "Creative opportunities, curiosity, possibility", reversed: "New ideas, doubting intuition, creative blocks", keywords: ["curiosity", "possibility", "imagination"], keywordsZh: ["\u597D\u5947\u5FC3", "\u53EF\u80FD\u6027", "\u60F3\u8C61\u529B"], uprightZh: "\u521B\u9020\u6027\u673A\u4F1A\u3001\u597D\u5947\u5FC3\u3001\u53EF\u80FD\u6027", reversedZh: "\u65B0\u60F3\u6CD5\u3001\u6000\u7591\u76F4\u89C9\u3001\u521B\u9020\u529B\u53D7\u963B" },
    { upright: "Creativity, romance, charm, imagination, beauty", reversed: "Overactive imagination, unrealistic, moody", keywords: ["romance", "creativity", "charm"], keywordsZh: ["\u6D6A\u6F2B", "\u521B\u9020\u529B", "\u9B45\u529B"], uprightZh: "\u521B\u9020\u529B\u3001\u6D6A\u6F2B\u3001\u9B45\u529B\u3001\u60F3\u8C61\u529B\u3001\u7F8E\u4E3D", reversedZh: "\u8FC7\u5EA6\u6D3B\u8DC3\u7684\u60F3\u8C61\u529B\u3001\u4E0D\u5207\u5B9E\u9645\u3001\u60C5\u7EEA\u5316" },
    { upright: "Compassion, calm, comfort, emotional balance", reversed: "Martyrdom, insecurity, inner feelings, emotional manipulation", keywords: ["compassion", "calm", "emotional depth"], keywordsZh: ["\u6148\u60B2", "\u5E73\u9759", "\u60C5\u611F\u6DF1\u5EA6"], uprightZh: "\u6148\u60B2\u3001\u5E73\u9759\u3001\u5B89\u6170\u3001\u60C5\u611F\u5E73\u8861", reversedZh: "\u6B89\u9053\u3001\u4E0D\u5B89\u5168\u611F\u3001\u5185\u5FC3\u611F\u53D7\u3001\u60C5\u611F\u64CD\u7EB5" },
    { upright: "Compassion, control, emotional stability, generosity", reversed: "Self-compassion, inner feelings, moodiness, emotional manipulation", keywords: ["emotional mastery", "generosity", "stability"], keywordsZh: ["\u60C5\u611F\u638C\u63A7", "\u6177\u6168", "\u7A33\u5B9A"], uprightZh: "\u6148\u60B2\u3001\u63A7\u5236\u3001\u60C5\u611F\u7A33\u5B9A\u3001\u6177\u6168", reversedZh: "\u81EA\u6211\u6148\u60B2\u3001\u5185\u5FC3\u611F\u53D7\u3001\u60C5\u7EEA\u5316\u3001\u60C5\u611F\u64CD\u7EB5" }
  ],
  swords: [
    { upright: "Breakthroughs, new ideas, mental clarity, success", reversed: "Inner clarity, re-thinking an idea, clouded judgement", keywords: ["clarity", "breakthrough", "truth"], keywordsZh: ["\u6E05\u6670", "\u7A81\u7834", "\u771F\u76F8"], uprightZh: "\u7A81\u7834\u3001\u65B0\u60F3\u6CD5\u3001\u601D\u7EF4\u6E05\u6670\u3001\u6210\u529F", reversedZh: "\u5185\u5728\u6E05\u6670\u3001\u91CD\u65B0\u601D\u8003\u3001\u5224\u65AD\u529B\u6A21\u7CCA" },
    { upright: "Difficult decisions, weighing up options, an impasse, avoidance", reversed: "Indecision, confusion, information overload, stalemate", keywords: ["decision", "stalemate", "balance"], keywordsZh: ["\u51B3\u5B9A", "\u50F5\u5C40", "\u5E73\u8861"], uprightZh: "\u56F0\u96BE\u7684\u51B3\u5B9A\u3001\u6743\u8861\u9009\u62E9\u3001\u50F5\u5C40\u3001\u56DE\u907F", reversedZh: "\u72B9\u8C6B\u4E0D\u51B3\u3001\u56F0\u60D1\u3001\u4FE1\u606F\u8FC7\u8F7D\u3001\u50F5\u5C40" },
    { upright: "Heartbreak, emotional pain, sorrow, grief, hurt", reversed: "Recovery, forgiveness, moving on, self-sorrow", keywords: ["heartbreak", "sorrow", "pain"], keywordsZh: ["\u5FC3\u788E", "\u60B2\u4F24", "\u75DB\u82E6"], uprightZh: "\u5FC3\u788E\u3001\u60C5\u611F\u75DB\u82E6\u3001\u60B2\u4F24\u3001\u60B2\u75DB\u3001\u4F24\u5BB3", reversedZh: "\u6062\u590D\u3001\u5BBD\u6055\u3001\u7EE7\u7EED\u524D\u8FDB\u3001\u81EA\u6211\u60B2\u4F24" },
    { upright: "Rest, relaxation, meditation, contemplation, recuperation", reversed: "Exhaustion, burn-out, deep contemplation, stagnation", keywords: ["rest", "recovery", "contemplation"], keywordsZh: ["\u4F11\u606F", "\u6062\u590D", "\u6C89\u601D"], uprightZh: "\u4F11\u606F\u3001\u653E\u677E\u3001\u51A5\u60F3\u3001\u6C89\u601D\u3001\u6062\u590D", reversedZh: "\u7CBE\u75B2\u529B\u7AED\u3001\u5026\u6020\u3001\u6DF1\u5EA6\u6C89\u601D\u3001\u505C\u6EDE" },
    { upright: "Conflict, disagreements, competition, defeat, winning at all costs", reversed: "Reconciliation, making amends, past resentment", keywords: ["conflict", "defeat", "competition"], keywordsZh: ["\u51B2\u7A81", "\u5931\u8D25", "\u7ADE\u4E89"], uprightZh: "\u51B2\u7A81\u3001\u5206\u6B67\u3001\u7ADE\u4E89\u3001\u5931\u8D25\u3001\u4E0D\u60DC\u4E00\u5207\u4EE3\u4EF7\u53D6\u80DC", reversedZh: "\u548C\u89E3\u3001\u5F25\u8865\u3001\u8FC7\u53BB\u7684\u6028\u6068" },
    { upright: "Transition, change, rite of passage, releasing baggage", reversed: "Personal transition, resistance to change, unfinished business", keywords: ["transition", "change", "moving on"], keywordsZh: ["\u8FC7\u6E21", "\u53D8\u5316", "\u7EE7\u7EED\u524D\u8FDB"], uprightZh: "\u8FC7\u6E21\u3001\u53D8\u5316\u3001\u901A\u8FC7\u4EEA\u5F0F\u3001\u91CA\u653E\u5305\u88B1", reversedZh: "\u4E2A\u4EBA\u8FC7\u6E21\u3001\u6297\u62D2\u53D8\u5316\u3001\u672A\u5B8C\u6210\u7684\u4E8B\u52A1" },
    { upright: "Deception, trickery, tactics, resourcefulness", reversed: "Coming clean, rethinking approach, confession", keywords: ["deception", "strategy", "stealth"], keywordsZh: ["\u6B3A\u9A97", "\u7B56\u7565", "\u9690\u79D8"], uprightZh: "\u6B3A\u9A97\u3001\u8BE1\u8BA1\u3001\u7B56\u7565\u3001\u8DB3\u667A\u591A\u8C0B", reversedZh: "\u5766\u767D\u3001\u91CD\u65B0\u601D\u8003\u65B9\u6CD5\u3001\u5FCF\u6094" },
    { upright: "Negative thoughts, self-imposed restriction, imprisonment, victim mentality", reversed: "Self-limiting beliefs, inner critic, releasing negative thoughts", keywords: ["restriction", "imprisonment", "helplessness"], keywordsZh: ["\u9650\u5236", "\u56DA\u7981", "\u65E0\u52A9"], uprightZh: "\u6D88\u6781\u601D\u60F3\u3001\u81EA\u6211\u9650\u5236\u3001\u56DA\u7981\u3001\u53D7\u5BB3\u8005\u5FC3\u6001", reversedZh: "\u81EA\u6211\u9650\u5236\u7684\u4FE1\u5FF5\u3001\u5185\u5728\u6279\u8BC4\u8005\u3001\u91CA\u653E\u6D88\u6781\u601D\u60F3" },
    { upright: "Anxiety, worry, fear, depression, nightmares", reversed: "Inner turmoil, deep-seated fears, secrets, releasing worry", keywords: ["anxiety", "worry", "fear"], keywordsZh: ["\u7126\u8651", "\u62C5\u5FE7", "\u6050\u60E7"], uprightZh: "\u7126\u8651\u3001\u62C5\u5FE7\u3001\u6050\u60E7\u3001\u6291\u90C1\u3001\u5669\u68A6", reversedZh: "\u5185\u5FC3\u52A8\u8361\u3001\u6839\u6DF1\u8482\u56FA\u7684\u6050\u60E7\u3001\u79D8\u5BC6\u3001\u91CA\u653E\u62C5\u5FE7" },
    { upright: "Painful endings, deep wounds, betrayal, loss, crisis", reversed: "Recovery, regeneration, resisting an inevitable end", keywords: ["ending", "loss", "betrayal"], keywordsZh: ["\u7ED3\u675F", "\u5931\u53BB", "\u80CC\u53DB"], uprightZh: "\u75DB\u82E6\u7684\u7ED3\u675F\u3001\u6DF1\u6DF1\u7684\u4F24\u53E3\u3001\u80CC\u53DB\u3001\u5931\u53BB\u3001\u5371\u673A", reversedZh: "\u6062\u590D\u3001\u518D\u751F\u3001\u62B5\u6297\u4E0D\u53EF\u907F\u514D\u7684\u7ED3\u5C40" },
    { upright: "Curiosity, restlessness, mental energy, thirst for knowledge", reversed: "Deception, manipulation, all talk", keywords: ["curiosity", "restlessness", "mental energy"], keywordsZh: ["\u597D\u5947\u5FC3", "\u4E0D\u5B89", "\u7CBE\u795E\u80FD\u91CF"], uprightZh: "\u597D\u5947\u5FC3\u3001\u4E0D\u5B89\u3001\u7CBE\u795E\u80FD\u91CF\u3001\u6C42\u77E5\u6B32", reversedZh: "\u6B3A\u9A97\u3001\u64CD\u7EB5\u3001\u5149\u8BF4\u4E0D\u505A" },
    { upright: "Ambitious, action-oriented, driven to succeed, fast-thinking", reversed: "Restless, unfocused, burn-out, aggressive", keywords: ["ambition", "action", "speed"], keywordsZh: ["\u96C4\u5FC3", "\u884C\u52A8", "\u901F\u5EA6"], uprightZh: "\u96C4\u5FC3\u52C3\u52C3\u3001\u884C\u52A8\u5BFC\u5411\u3001\u8FFD\u6C42\u6210\u529F\u3001\u601D\u7EF4\u654F\u6377", reversedZh: "\u4E0D\u5B89\u3001\u6CE8\u610F\u529B\u4E0D\u96C6\u4E2D\u3001\u5026\u6020\u3001\u653B\u51FB\u6027" },
    { upright: "Clear thinking, intellectual power, authority, truth", reversed: "Quiet power, inner truth, misuse of power, manipulation", keywords: ["authority", "intellect", "truth"], keywordsZh: ["\u6743\u5A01", "\u667A\u6167", "\u771F\u76F8"], uprightZh: "\u6E05\u6670\u601D\u7EF4\u3001\u667A\u529B\u529B\u91CF\u3001\u6743\u5A01\u3001\u771F\u76F8", reversedZh: "\u5B89\u9759\u7684\u529B\u91CF\u3001\u5185\u5728\u771F\u76F8\u3001\u6EE5\u7528\u6743\u529B\u3001\u64CD\u7EB5" },
    { upright: "Mental clarity, intellectual power, authority, truth, head over heart", reversed: "Emotional coldness, manipulation, cruelty", keywords: ["clarity", "authority", "intellect"], keywordsZh: ["\u6E05\u6670", "\u6743\u5A01", "\u667A\u6167"], uprightZh: "\u601D\u7EF4\u6E05\u6670\u3001\u667A\u529B\u529B\u91CF\u3001\u6743\u5A01\u3001\u771F\u76F8\u3001\u7406\u6027\u80DC\u8FC7\u611F\u6027", reversedZh: "\u60C5\u611F\u51B7\u6F20\u3001\u64CD\u7EB5\u3001\u6B8B\u5FCD" }
  ],
  pentacles: [
    { upright: "A new financial or career opportunity, manifestation, abundance", reversed: "Lost opportunity, lack of planning, foresight", keywords: ["opportunity", "prosperity", "new venture"], keywordsZh: ["\u673A\u4F1A", "\u7E41\u8363", "\u65B0\u4E8B\u4E1A"], uprightZh: "\u65B0\u7684\u8D22\u52A1\u6216\u804C\u4E1A\u673A\u4F1A\u3001\u663E\u5316\u3001\u4E30\u76DB", reversedZh: "\u5931\u53BB\u673A\u4F1A\u3001\u7F3A\u4E4F\u89C4\u5212\u3001\u8FDC\u89C1" },
    { upright: "Multiple priorities, time management, prioritization, adaptability", reversed: "Over-committed, disorganization, reprioritization", keywords: ["balance", "adaptability", "priorities"], keywordsZh: ["\u5E73\u8861", "\u9002\u5E94\u6027", "\u4F18\u5148\u7EA7"], uprightZh: "\u591A\u91CD\u4F18\u5148\u4E8B\u9879\u3001\u65F6\u95F4\u7BA1\u7406\u3001\u4F18\u5148\u6392\u5E8F\u3001\u9002\u5E94\u6027", reversedZh: "\u8FC7\u5EA6\u627F\u8BFA\u3001\u6DF7\u4E71\u3001\u91CD\u65B0\u6392\u5E8F" },
    { upright: "Teamwork, collaboration, learning, implementation", reversed: "Lack of teamwork, disregard for skills, poor quality", keywords: ["teamwork", "skill", "craftsmanship"], keywordsZh: ["\u56E2\u961F\u5408\u4F5C", "\u6280\u80FD", "\u5DE5\u827A"], uprightZh: "\u56E2\u961F\u5408\u4F5C\u3001\u534F\u4F5C\u3001\u5B66\u4E60\u3001\u5B9E\u65BD", reversedZh: "\u7F3A\u4E4F\u56E2\u961F\u5408\u4F5C\u3001\u5FFD\u89C6\u6280\u80FD\u3001\u8D28\u91CF\u5DEE" },
    { upright: "Saving money, security, conservatism, scarcity, control", reversed: "Over-spending, greed, self-protection", keywords: ["security", "saving", "control"], keywordsZh: ["\u5B89\u5168", "\u50A8\u84C4", "\u63A7\u5236"], uprightZh: "\u5B58\u94B1\u3001\u5B89\u5168\u3001\u4FDD\u5B88\u3001\u7A00\u7F3A\u3001\u63A7\u5236", reversedZh: "\u8FC7\u5EA6\u6D88\u8D39\u3001\u8D2A\u5A6A\u3001\u81EA\u6211\u4FDD\u62A4" },
    { upright: "Financial loss, poverty, lack mindset, isolation, worry", reversed: "Recovery from financial loss, spiritual poverty", keywords: ["hardship", "poverty", "isolation"], keywordsZh: ["\u56F0\u96BE", "\u8D2B\u56F0", "\u5B64\u7ACB"], uprightZh: "\u8D22\u52A1\u635F\u5931\u3001\u8D2B\u56F0\u3001\u532E\u4E4F\u5FC3\u6001\u3001\u5B64\u7ACB\u3001\u62C5\u5FE7", reversedZh: "\u4ECE\u8D22\u52A1\u635F\u5931\u4E2D\u6062\u590D\u3001\u7CBE\u795E\u8D2B\u56F0" },
    { upright: "Giving, receiving, sharing wealth, generosity, charity", reversed: "Self-care, unpaid debts, one-sided charity", keywords: ["generosity", "charity", "sharing"], keywordsZh: ["\u6177\u6168", "\u6148\u5584", "\u5206\u4EAB"], uprightZh: "\u7ED9\u4E88\u3001\u63A5\u53D7\u3001\u5206\u4EAB\u8D22\u5BCC\u3001\u6177\u6168\u3001\u6148\u5584", reversedZh: "\u81EA\u6211\u7167\u987E\u3001\u672A\u507F\u8FD8\u7684\u503A\u52A1\u3001\u5355\u65B9\u9762\u7684\u6148\u5584" },
    { upright: "Long-term view, sustainable results, perseverance, investment", reversed: "Lack of long-term vision, limited success or reward", keywords: ["patience", "investment", "perseverance"], keywordsZh: ["\u8010\u5FC3", "\u6295\u8D44", "\u575A\u6301"], uprightZh: "\u957F\u8FDC\u773C\u5149\u3001\u53EF\u6301\u7EED\u7684\u7ED3\u679C\u3001\u575A\u6301\u3001\u6295\u8D44", reversedZh: "\u7F3A\u4E4F\u957F\u8FDC\u773C\u5149\u3001\u6709\u9650\u7684\u6210\u529F\u6216\u56DE\u62A5" },
    { upright: "Apprenticeship, repetitive tasks, mastery, skill development", reversed: "Self-development, perfectionism, misdirected activity", keywords: ["mastery", "diligence", "skill"], keywordsZh: ["\u7CBE\u901A", "\u52E4\u594B", "\u6280\u80FD"], uprightZh: "\u5B66\u5F92\u671F\u3001\u91CD\u590D\u6027\u4EFB\u52A1\u3001\u7CBE\u901A\u3001\u6280\u80FD\u53D1\u5C55", reversedZh: "\u81EA\u6211\u53D1\u5C55\u3001\u5B8C\u7F8E\u4E3B\u4E49\u3001\u65B9\u5411\u9519\u8BEF\u7684\u6D3B\u52A8" },
    { upright: "Abundance, luxury, self-sufficiency, financial independence", reversed: "Self-worth, over-investment in work, hustling", keywords: ["abundance", "luxury", "independence"], keywordsZh: ["\u4E30\u76DB", "\u5962\u534E", "\u72EC\u7ACB"], uprightZh: "\u4E30\u76DB\u3001\u5962\u534E\u3001\u81EA\u7ED9\u81EA\u8DB3\u3001\u8D22\u52A1\u72EC\u7ACB", reversedZh: "\u81EA\u6211\u4EF7\u503C\u3001\u8FC7\u5EA6\u6295\u5165\u5DE5\u4F5C\u3001\u5FD9\u788C" },
    { upright: "Wealth, financial security, family, long-term success, contribution", reversed: "Financial failure, loneliness, loss of legacy", keywords: ["wealth", "legacy", "family"], keywordsZh: ["\u8D22\u5BCC", "\u9057\u4EA7", "\u5BB6\u5EAD"], uprightZh: "\u8D22\u5BCC\u3001\u8D22\u52A1\u5B89\u5168\u3001\u5BB6\u5EAD\u3001\u957F\u671F\u6210\u529F\u3001\u8D21\u732E", reversedZh: "\u8D22\u52A1\u5931\u8D25\u3001\u5B64\u72EC\u3001\u5931\u53BB\u9057\u4EA7" },
    { upright: "Financial opportunity, new job, scholarship, investment", reversed: "Missed opportunity, lack of foresight", keywords: ["opportunity", "study", "new beginnings"], keywordsZh: ["\u673A\u4F1A", "\u5B66\u4E60", "\u65B0\u5F00\u59CB"], uprightZh: "\u8D22\u52A1\u673A\u4F1A\u3001\u65B0\u5DE5\u4F5C\u3001\u5956\u5B66\u91D1\u3001\u6295\u8D44", reversedZh: "\u9519\u8FC7\u673A\u4F1A\u3001\u7F3A\u4E4F\u8FDC\u89C1" },
    { upright: "Hard work, productivity, routine, conservative", reversed: "Workaholic, boredom, feeling stuck, laziness", keywords: ["diligence", "routine", "reliability"], keywordsZh: ["\u52E4\u594B", "\u5E38\u89C4", "\u53EF\u9760"], uprightZh: "\u52AA\u529B\u5DE5\u4F5C\u3001\u751F\u4EA7\u529B\u3001\u5E38\u89C4\u3001\u4FDD\u5B88", reversedZh: "\u5DE5\u4F5C\u72C2\u3001\u65E0\u804A\u3001\u611F\u5230\u56F0\u987F\u3001\u61D2\u60F0" },
    { upright: "Practical, loyal, provider, reliable, patient", reversed: "Financially irresponsible, stubborn, materialistic", keywords: ["provider", "loyalty", "stability"], keywordsZh: ["\u4F9B\u517B\u8005", "\u5FE0\u8BDA", "\u7A33\u5B9A"], uprightZh: "\u52A1\u5B9E\u3001\u5FE0\u8BDA\u3001\u4F9B\u517B\u8005\u3001\u53EF\u9760\u3001\u8010\u5FC3", reversedZh: "\u8D22\u52A1\u4E0D\u8D1F\u8D23\u4EFB\u3001\u56FA\u6267\u3001\u7269\u8D28\u4E3B\u4E49" },
    { upright: "Abundance, prosperity, security, luxury, control", reversed: "Financial independence, self-worth, over-spending", keywords: ["prosperity", "abundance", "security"], keywordsZh: ["\u7E41\u8363", "\u4E30\u76DB", "\u5B89\u5168"], uprightZh: "\u4E30\u76DB\u3001\u7E41\u8363\u3001\u5B89\u5168\u3001\u5962\u534E\u3001\u63A7\u5236", reversedZh: "\u8D22\u52A1\u72EC\u7ACB\u3001\u81EA\u6211\u4EF7\u503C\u3001\u8FC7\u5EA6\u6D88\u8D39" }
  ]
};
var COURT_NAMES = ["Page", "Knight", "Queen", "King"];
var COURT_NAMES_ZH = ["\u4F8D\u4ECE", "\u9A91\u58EB", "\u738B\u540E", "\u56FD\u738B"];
function generateMinorArcana() {
  const cards = [];
  let id = 22;
  for (const suit of SUITS) {
    const meanings = MINOR_MEANINGS[suit.suit];
    for (let i = 0; i < 14; i++) {
      const m = meanings[i];
      const isCourt = i >= 10;
      const courtIdx = i - 10;
      const name = isCourt ? `${COURT_NAMES[courtIdx]} of ${suit.suit.charAt(0).toUpperCase() + suit.suit.slice(1)}` : `${i === 0 ? "Ace" : (i + 1).toString()} of ${suit.suit.charAt(0).toUpperCase() + suit.suit.slice(1)}`;
      const nameChinese = isCourt ? `${suit.suitChinese}${COURT_NAMES_ZH[courtIdx]}` : `${suit.suitChinese}${i === 0 ? "\u738B\u724C" : (i + 1).toString()}`;
      cards.push({
        id: id++,
        name,
        nameChinese,
        nameShort: `${suit.suit.slice(0, 2)}${String(i + 1).padStart(2, "0")}`,
        arcana: "minor",
        suit: suit.suit,
        number: i + 1,
        element: suit.element,
        keywords: m.keywords,
        keywordsChinese: m.keywordsZh,
        meaningUpright: m.upright,
        meaningReversed: m.reversed,
        meaningUprightChinese: m.uprightZh,
        meaningReversedChinese: m.reversedZh,
        description: `${name} - ${suit.theme}`,
        yesNo: "maybe"
      });
    }
  }
  return cards;
}
var ALL_CARDS = [...MAJOR_ARCANA, ...generateMinorArcana()];
function getCardByName(name) {
  const lower = name.toLowerCase();
  return ALL_CARDS.find(
    (c) => c.name.toLowerCase() === lower || c.nameChinese === name || c.nameShort === lower
  );
}
var SPREADS = [
  {
    id: "single",
    name: "Single Card",
    nameChinese: "\u5355\u724C",
    description: "A quick one-card draw for daily guidance or a simple yes/no question.",
    descriptionChinese: "\u5FEB\u901F\u5355\u724C\u62BD\u53D6\uFF0C\u7528\u4E8E\u6BCF\u65E5\u6307\u5F15\u6216\u7B80\u5355\u7684\u662F/\u5426\u95EE\u9898\u3002",
    cardCount: 1,
    category: "quick",
    positions: [
      { index: 0, name: "The Answer", nameChinese: "\u7B54\u6848", description: "The core message or answer to your question.", descriptionChinese: "\u4F60\u95EE\u9898\u7684\u6838\u5FC3\u4FE1\u606F\u6216\u7B54\u6848\u3002" }
    ]
  },
  {
    id: "three-card",
    name: "Three Card Spread",
    nameChinese: "\u4E09\u724C\u9635",
    description: "The classic past-present-future spread for understanding the flow of a situation.",
    descriptionChinese: "\u7ECF\u5178\u7684\u8FC7\u53BB-\u73B0\u5728-\u672A\u6765\u724C\u9635\uFF0C\u7528\u4E8E\u7406\u89E3\u60C5\u51B5\u7684\u53D1\u5C55\u8109\u7EDC\u3002",
    cardCount: 3,
    category: "general",
    positions: [
      { index: 0, name: "Past", nameChinese: "\u8FC7\u53BB", description: "Influences from the past that have led to the current situation.", descriptionChinese: "\u5BFC\u81F4\u5F53\u524D\u60C5\u51B5\u7684\u8FC7\u53BB\u5F71\u54CD\u3002" },
      { index: 1, name: "Present", nameChinese: "\u73B0\u5728", description: "The current state of affairs and immediate influences.", descriptionChinese: "\u5F53\u524D\u7684\u72B6\u51B5\u548C\u5373\u65F6\u5F71\u54CD\u3002" },
      { index: 2, name: "Future", nameChinese: "\u672A\u6765", description: "The likely outcome if the current path continues.", descriptionChinese: "\u5982\u679C\u7EE7\u7EED\u5F53\u524D\u9053\u8DEF\u7684\u53EF\u80FD\u7ED3\u679C\u3002" }
    ]
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    nameChinese: "\u51EF\u5C14\u7279\u5341\u5B57",
    description: "The most comprehensive spread, providing deep insight into complex situations with 10 cards covering all aspects.",
    descriptionChinese: "\u6700\u5168\u9762\u7684\u724C\u9635\uFF0C\u752810\u5F20\u724C\u6DF1\u5165\u6D1E\u5BDF\u590D\u6742\u60C5\u51B5\u7684\u5404\u4E2A\u65B9\u9762\u3002",
    cardCount: 10,
    category: "deep",
    positions: [
      { index: 0, name: "Present", nameChinese: "\u73B0\u72B6", description: "Your current situation and the central issue.", descriptionChinese: "\u4F60\u5F53\u524D\u7684\u72B6\u51B5\u548C\u6838\u5FC3\u95EE\u9898\u3002" },
      { index: 1, name: "Challenge", nameChinese: "\u6311\u6218", description: "The immediate challenge or obstacle you face.", descriptionChinese: "\u4F60\u9762\u4E34\u7684\u76F4\u63A5\u6311\u6218\u6216\u969C\u788D\u3002" },
      { index: 2, name: "Foundation", nameChinese: "\u57FA\u7840", description: "The root cause or unconscious influence.", descriptionChinese: "\u6839\u672C\u539F\u56E0\u6216\u6F5C\u610F\u8BC6\u5F71\u54CD\u3002" },
      { index: 3, name: "Recent Past", nameChinese: "\u8FD1\u8FC7\u53BB", description: "Recent events that have shaped the situation.", descriptionChinese: "\u5851\u9020\u5F53\u524D\u60C5\u51B5\u7684\u8FD1\u671F\u4E8B\u4EF6\u3002" },
      { index: 4, name: "Crown", nameChinese: "\u738B\u51A0", description: "Your goals, aspirations, or best possible outcome.", descriptionChinese: "\u4F60\u7684\u76EE\u6807\u3001\u613F\u671B\u6216\u6700\u4F73\u53EF\u80FD\u7ED3\u679C\u3002" },
      { index: 5, name: "Near Future", nameChinese: "\u8FD1\u672A\u6765", description: "What is approaching in the near term.", descriptionChinese: "\u8FD1\u671F\u5373\u5C06\u5230\u6765\u7684\u4E8B\u60C5\u3002" },
      { index: 6, name: "Self", nameChinese: "\u81EA\u6211", description: "How you see yourself in this situation.", descriptionChinese: "\u4F60\u5728\u8FD9\u79CD\u60C5\u51B5\u4E0B\u5982\u4F55\u770B\u5F85\u81EA\u5DF1\u3002" },
      { index: 7, name: "Environment", nameChinese: "\u73AF\u5883", description: "External influences and how others see you.", descriptionChinese: "\u5916\u90E8\u5F71\u54CD\u4EE5\u53CA\u4ED6\u4EBA\u5982\u4F55\u770B\u5F85\u4F60\u3002" },
      { index: 8, name: "Hopes & Fears", nameChinese: "\u5E0C\u671B\u4E0E\u6050\u60E7", description: "Your deepest hopes and fears about the outcome.", descriptionChinese: "\u4F60\u5BF9\u7ED3\u679C\u6700\u6DF1\u5C42\u7684\u5E0C\u671B\u548C\u6050\u60E7\u3002" },
      { index: 9, name: "Outcome", nameChinese: "\u7ED3\u679C", description: "The final outcome based on the current trajectory.", descriptionChinese: "\u57FA\u4E8E\u5F53\u524D\u8F68\u8FF9\u7684\u6700\u7EC8\u7ED3\u679C\u3002" }
    ]
  },
  {
    id: "love",
    name: "Relationship Spread",
    nameChinese: "\u611F\u60C5\u724C\u9635",
    description: "A 5-card spread specifically designed for relationship questions and love readings.",
    descriptionChinese: "\u4E13\u4E3A\u611F\u60C5\u95EE\u9898\u548C\u7231\u60C5\u89E3\u8BFB\u8BBE\u8BA1\u76845\u724C\u9635\u3002",
    cardCount: 5,
    category: "love",
    positions: [
      { index: 0, name: "You", nameChinese: "\u4F60", description: "Your current emotional state and energy in the relationship.", descriptionChinese: "\u4F60\u5728\u5173\u7CFB\u4E2D\u5F53\u524D\u7684\u60C5\u611F\u72B6\u6001\u548C\u80FD\u91CF\u3002" },
      { index: 1, name: "Partner", nameChinese: "\u5BF9\u65B9", description: "Your partner's current emotional state and perspective.", descriptionChinese: "\u5BF9\u65B9\u5F53\u524D\u7684\u60C5\u611F\u72B6\u6001\u548C\u89C6\u89D2\u3002" },
      { index: 2, name: "Connection", nameChinese: "\u8FDE\u63A5", description: "The nature of the bond between you.", descriptionChinese: "\u4F60\u4EEC\u4E4B\u95F4\u7EBD\u5E26\u7684\u672C\u8D28\u3002" },
      { index: 3, name: "Challenge", nameChinese: "\u6311\u6218", description: "The main challenge or obstacle in the relationship.", descriptionChinese: "\u5173\u7CFB\u4E2D\u7684\u4E3B\u8981\u6311\u6218\u6216\u969C\u788D\u3002" },
      { index: 4, name: "Potential", nameChinese: "\u6F5C\u529B", description: "The potential future of the relationship.", descriptionChinese: "\u5173\u7CFB\u7684\u6F5C\u5728\u672A\u6765\u3002" }
    ]
  },
  {
    id: "career",
    name: "Career Path Spread",
    nameChinese: "\u4E8B\u4E1A\u724C\u9635",
    description: "A 5-card spread for career decisions, job changes, and professional growth.",
    descriptionChinese: "\u7528\u4E8E\u804C\u4E1A\u51B3\u7B56\u3001\u5DE5\u4F5C\u53D8\u52A8\u548C\u804C\u4E1A\u6210\u957F\u76845\u724C\u9635\u3002",
    cardCount: 5,
    category: "career",
    positions: [
      { index: 0, name: "Current Position", nameChinese: "\u5F53\u524D\u4F4D\u7F6E", description: "Your current career situation and energy.", descriptionChinese: "\u4F60\u5F53\u524D\u7684\u804C\u4E1A\u72B6\u51B5\u548C\u80FD\u91CF\u3002" },
      { index: 1, name: "Strengths", nameChinese: "\u4F18\u52BF", description: "Your key strengths and assets in your career.", descriptionChinese: "\u4F60\u5728\u804C\u4E1A\u4E2D\u7684\u5173\u952E\u4F18\u52BF\u548C\u8D44\u4EA7\u3002" },
      { index: 2, name: "Obstacles", nameChinese: "\u969C\u788D", description: "Challenges or blocks in your professional path.", descriptionChinese: "\u4F60\u804C\u4E1A\u9053\u8DEF\u4E0A\u7684\u6311\u6218\u6216\u963B\u788D\u3002" },
      { index: 3, name: "Action", nameChinese: "\u884C\u52A8", description: "The action you should take for career growth.", descriptionChinese: "\u4F60\u5E94\u8BE5\u91C7\u53D6\u7684\u804C\u4E1A\u6210\u957F\u884C\u52A8\u3002" },
      { index: 4, name: "Outcome", nameChinese: "\u7ED3\u679C", description: "The likely outcome of your career path.", descriptionChinese: "\u4F60\u804C\u4E1A\u9053\u8DEF\u7684\u53EF\u80FD\u7ED3\u679C\u3002" }
    ]
  },
  {
    id: "year-ahead",
    name: "Year Ahead Spread",
    nameChinese: "\u5E74\u5EA6\u8FD0\u52BF\u724C\u9635",
    description: "A 12-card spread with one card for each month, providing a roadmap for the year.",
    descriptionChinese: "12\u5F20\u724C\u9635\uFF0C\u6BCF\u6708\u4E00\u5F20\uFF0C\u4E3A\u4F60\u63D0\u4F9B\u5168\u5E74\u8DEF\u7EBF\u56FE\u3002",
    cardCount: 12,
    category: "deep",
    positions: Array.from({ length: 12 }, (_, i) => ({
      index: i,
      name: `Month ${i + 1}`,
      nameChinese: `${i + 1}\u6708`,
      description: `Theme and energy for month ${i + 1}.`,
      descriptionChinese: `\u7B2C${i + 1}\u4E2A\u6708\u7684\u4E3B\u9898\u548C\u80FD\u91CF\u3002`
    }))
  }
];
function getSpreadById(id) {
  return SPREADS.find((s) => s.id === id);
}
function drawCards(spreadId) {
  const spread = getSpreadById(spreadId);
  if (!spread) throw new Error(`Unknown spread: ${spreadId}`);
  const deck = [...ALL_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return spread.positions.map((position, idx) => ({
    card: deck[idx],
    isReversed: Math.random() < 0.3,
    // ~30% chance of reversed
    position
  }));
}
function formatDrawnCardsForPrompt(drawnCards, spread, question, language = "en") {
  const isZh = language === "zh";
  const sections = [];
  sections.push(isZh ? `\u3010\u5854\u7F57\u724C\u9635\uFF1A${spread.nameChinese}\u3011` : `[Tarot Spread: ${spread.name}]`);
  sections.push(isZh ? `\u724C\u9635\u8BF4\u660E\uFF1A${spread.descriptionChinese}` : `Spread Description: ${spread.description}`);
  sections.push(isZh ? `\u95EE\u9898\uFF1A${question}` : `Question: ${question}`);
  sections.push(isZh ? `\u62BD\u724C\u6570\u91CF\uFF1A${drawnCards.length}\u5F20` : `Cards Drawn: ${drawnCards.length}`);
  sections.push("");
  const elementCounts = {};
  for (const d of drawnCards) {
    elementCounts[d.card.element] = (elementCounts[d.card.element] || 0) + 1;
  }
  const elementSummary = Object.entries(elementCounts).map(([el, ct]) => `${el}\xD7${ct}`).join(", ");
  sections.push(isZh ? `\u3010\u5143\u7D20\u5206\u5E03\u3011${elementSummary}` : `[Element Distribution] ${elementSummary}`);
  const majorCount = drawnCards.filter((d) => d.card.arcana === "major").length;
  const minorCount = drawnCards.filter((d) => d.card.arcana === "minor").length;
  const reversedCount = drawnCards.filter((d) => d.isReversed).length;
  sections.push(isZh ? `\u3010\u724C\u9762\u7EDF\u8BA1\u3011\u5927\u963F\u5361\u7EB3${majorCount}\u5F20\uFF0C\u5C0F\u963F\u5361\u7EB3${minorCount}\u5F20\uFF0C\u9006\u4F4D${reversedCount}\u5F20` : `[Card Stats] Major Arcana: ${majorCount}, Minor Arcana: ${minorCount}, Reversed: ${reversedCount}`);
  sections.push("");
  for (let i = 0; i < drawnCards.length; i++) {
    const { card, isReversed, position } = drawnCards[i];
    const posName = isZh ? position.nameChinese : position.name;
    const posDesc = isZh ? position.descriptionChinese : position.description;
    const cardName = isZh ? card.nameChinese : card.name;
    const orientation = isReversed ? isZh ? "\u9006\u4F4D" : "Reversed" : isZh ? "\u6B63\u4F4D" : "Upright";
    const meaningUpright = isZh ? card.meaningUprightChinese : card.meaningUpright;
    const meaningReversed = isZh ? card.meaningReversedChinese : card.meaningReversed;
    const activeMeaning = isReversed ? meaningReversed : meaningUpright;
    const keywords = isZh ? card.keywordsChinese : card.keywords;
    sections.push(`${"=".repeat(50)}`);
    sections.push(isZh ? `\u7B2C${i + 1}\u5F20\u724C | \u724C\u4F4D\uFF1A${posName}\uFF08${posDesc}\uFF09` : `Card ${i + 1} | Position: ${posName} (${posDesc})`);
    sections.push(`${"=".repeat(50)}`);
    sections.push(isZh ? `\u724C\u540D\uFF1A${cardName}\uFF08${orientation}\uFF09` : `Card: ${cardName} (${orientation})`);
    sections.push(isZh ? `\u7C7B\u578B\uFF1A${card.arcana === "major" ? "\u5927\u963F\u5361\u7EB3" : "\u5C0F\u963F\u5361\u7EB3"}${card.suit ? ` \xB7 ${card.suit}\u724C\u7EC4` : ""} \xB7 \u7F16\u53F7${card.number}` : `Type: ${card.arcana === "major" ? "Major Arcana" : "Minor Arcana"}${card.suit ? ` \xB7 ${card.suit}` : ""} \xB7 #${card.number}`);
    sections.push(isZh ? `\u5143\u7D20\uFF1A${card.element}` : `Element: ${card.element}`);
    if (card.zodiac) sections.push(isZh ? `\u661F\u5EA7\u5BF9\u5E94\uFF1A${card.zodiac}` : `Zodiac: ${card.zodiac}`);
    if (card.planet) sections.push(isZh ? `\u884C\u661F\u5BF9\u5E94\uFF1A${card.planet}` : `Planet: ${card.planet}`);
    sections.push(isZh ? `\u5173\u952E\u8BCD\uFF1A${keywords.join("\u3001")}` : `Keywords: ${keywords.join(", ")}`);
    sections.push(isZh ? `\u724C\u9762\u63CF\u8FF0\uFF1A${card.description}` : `Card Imagery: ${card.description}`);
    sections.push(isZh ? `\u5F53\u524D\u724C\u4E49\uFF08${orientation}\uFF09\uFF1A${activeMeaning}` : `Active Meaning (${orientation}): ${activeMeaning}`);
    sections.push(isZh ? `\u6B63\u4F4D\u542B\u4E49\uFF1A${meaningUpright}` : `Upright Meaning: ${meaningUpright}`);
    sections.push(isZh ? `\u9006\u4F4D\u542B\u4E49\uFF1A${meaningReversed}` : `Reversed Meaning: ${meaningReversed}`);
    sections.push(isZh ? `\u662F/\u5426\u5360\u535C\uFF1A${card.yesNo}` : `Yes/No: ${card.yesNo}`);
    sections.push("");
  }
  if (drawnCards.length >= 2) {
    sections.push(isZh ? "\u3010\u724C\u9762\u4E92\u52A8\u63D0\u793A\u3011" : "[Card Interaction Hints]");
    for (let i = 0; i < drawnCards.length - 1; i++) {
      const c1 = drawnCards[i].card;
      const c2 = drawnCards[i + 1].card;
      const name1 = isZh ? c1.nameChinese : c1.name;
      const name2 = isZh ? c2.nameChinese : c2.name;
      const sameElement = c1.element === c2.element;
      sections.push(isZh ? `\xB7 ${name1} \u2192 ${name2}\uFF1A${sameElement ? "\u540C\u5143\u7D20\uFF08\u80FD\u91CF\u5171\u632F\uFF09" : `\u8DE8\u5143\u7D20\uFF08${c1.element} \u2192 ${c2.element}\uFF0C\u80FD\u91CF\u8F6C\u6362\uFF09`}` : `\xB7 ${name1} \u2192 ${name2}: ${sameElement ? "Same element (energy resonance)" : `Cross-element (${c1.element} \u2192 ${c2.element}, energy shift)`}`);
    }
    sections.push("");
  }
  return sections.join("\n");
}

// server/routers/tarot.ts
var QUESTION_SPREAD_MAP = {
  love: "love",
  career: "career",
  wealth: "three-card",
  health: "three-card",
  general: "three-card"
};
var tarotRouter = router({
  // Get available spreads
  getSpreads: publicProcedure.query(() => {
    return SPREADS.map((s) => ({
      id: s.id,
      name: s.name,
      nameChinese: s.nameChinese,
      description: s.description,
      descriptionChinese: s.descriptionChinese,
      cardCount: s.cardCount,
      category: s.category,
      positions: s.positions
    }));
  }),
  // Get all cards (for frontend card selection UI)
  getCards: publicProcedure.query(() => {
    return ALL_CARDS.map((c) => ({
      id: c.id,
      name: c.name,
      nameChinese: c.nameChinese,
      nameShort: c.nameShort,
      arcana: c.arcana,
      suit: c.suit,
      number: c.number,
      element: c.element,
      keywords: c.keywords,
      keywordsChinese: c.keywordsChinese
    }));
  }),
  // Server-side card draw (cryptographic randomness)
  drawCards: publicProcedure.input(z4.object({
    spreadId: z4.string()
  })).mutation(({ input }) => {
    const drawn = drawCards(input.spreadId);
    return drawn.map((d) => ({
      cardId: d.card.id,
      cardName: d.card.name,
      cardNameChinese: d.card.nameChinese,
      nameShort: d.card.nameShort,
      isReversed: d.isReversed,
      positionIndex: d.position.index,
      positionName: d.position.name,
      positionNameChinese: d.position.nameChinese,
      positionDescription: d.position.description,
      positionDescriptionChinese: d.position.descriptionChinese,
      // Card details for display
      arcana: d.card.arcana,
      suit: d.card.suit,
      element: d.card.element,
      keywords: d.card.keywords,
      keywordsChinese: d.card.keywordsChinese,
      meaningUpright: d.card.meaningUpright,
      meaningReversed: d.card.meaningReversed,
      meaningUprightChinese: d.card.meaningUprightChinese,
      meaningReversedChinese: d.card.meaningReversedChinese,
      yesNo: d.card.yesNo
    }));
  }),
  // Professional reading with algorithm + AI hybrid
  getReading: publicProcedure.input(z4.object({
    questionType: z4.enum(["love", "career", "wealth", "health", "general"]),
    question: z4.string().optional(),
    spreadId: z4.string().optional(),
    // Accept either server-drawn cards or manual card selection
    drawnCards: z4.array(z4.object({
      cardId: z4.number(),
      isReversed: z4.boolean(),
      positionIndex: z4.number()
    })).optional(),
    // Legacy support: card names from old frontend
    cards: z4.array(z4.string()).optional(),
    language: z4.enum(["zh", "en"]).optional().default("zh")
  })).mutation(async ({ input, ctx }) => {
    if (ctx.user?.id) {
      const usage = await getUsageStatus(ctx.user.id, "tarot");
      if (!usage.canUse) {
        throw new Error("FREE_LIMIT_REACHED");
      }
    }
    const { questionType, question, language } = input;
    const isEn = language === "en";
    const spreadId = input.spreadId || QUESTION_SPREAD_MAP[questionType] || "three-card";
    const spread = getSpreadById(spreadId);
    if (!spread) throw new Error("Invalid spread");
    let resolvedDrawn;
    if (input.drawnCards && input.drawnCards.length > 0) {
      resolvedDrawn = input.drawnCards.map((dc) => {
        const card = ALL_CARDS.find((c) => c.id === dc.cardId);
        if (!card) throw new Error(`Card not found: ${dc.cardId}`);
        const position = spread.positions[dc.positionIndex];
        if (!position) throw new Error(`Position not found: ${dc.positionIndex}`);
        return { card, isReversed: dc.isReversed, position };
      });
    } else if (input.cards && input.cards.length > 0) {
      resolvedDrawn = input.cards.map((name, idx) => {
        const card = getCardByName(name) || ALL_CARDS[idx % ALL_CARDS.length];
        const position = spread.positions[idx % spread.positions.length];
        return { card, isReversed: Math.random() < 0.3, position };
      });
    } else {
      resolvedDrawn = drawCards(spreadId);
    }
    const questionText = question || (isEn ? "General Fortune" : "\u6574\u4F53\u8FD0\u52BF");
    const structuredPrompt = formatDrawnCardsForPrompt(
      resolvedDrawn,
      spread,
      questionText,
      language
    );
    const typeLabels = isEn ? {
      love: "Love & Relationships",
      career: "Career & Growth",
      wealth: "Wealth & Finance",
      health: "Health & Wellness",
      general: "General Fortune"
    } : {
      love: "\u7231\u60C5\u59FB\u7F18",
      career: "\u4E8B\u4E1A\u53D1\u5C55",
      wealth: "\u8D22\u8FD0\u7406\u8D22",
      health: "\u5065\u5EB7\u517B\u751F",
      general: "\u7EFC\u5408\u8FD0\u52BF"
    };
    const systemPrompt = isEn ? `You are a master tarot reader with 30 years of experience in the Rider-Waite-Smith tradition. You combine deep knowledge of tarot symbolism, Jungian archetypes, Kabbalistic Tree of Life correspondences, and practical life wisdom.

IMPORTANT RULES:
- Base your interpretation STRICTLY on the actual cards drawn, their positions, and whether they are upright or reversed
- Reference specific card imagery and symbolism from the Rider-Waite deck (e.g., "The flowing water in the Star card suggests...")
- Analyze card interactions: elemental dignities, numerological patterns, and narrative arcs across positions
- Reversed cards indicate blocked energy, shadow aspects, internalized lessons, or the card's energy manifesting in subtle/unconscious ways
- Provide specific, actionable advice grounded in the card symbolism \u2014 not generic platitudes
- Use warm but authoritative language befitting a seasoned reader
- Each section should be substantive (4-8 sentences minimum), not superficial summaries

FORMAT your response with these 10 sections:

## \u{1F31F} Overall Energy Field
Synthesize the entire spread's energetic signature in 4-6 sentences. Describe the dominant elemental energy, the balance between Major and Minor Arcana, and the overall narrative arc from first card to last. Mention any striking patterns (all same element, all reversed, numerical sequences, etc.).

## \u{1F3A8} Card-by-Card Deep Dive
For EACH card, provide a detailed interpretation:
### [Position Name]: [Card Name] ([Upright/Reversed])
**Visual Symbolism**: Describe 2-3 specific visual elements from the Rider-Waite imagery and what they symbolize in this context.
**Core Message**: 3-4 sentences interpreting this card in this specific position, connecting the card's traditional meaning to the querent's situation.
**Shadow Aspect**: What this card warns about or what hidden challenge it reveals.

## \u{1F9E0} Psychological Mirror
Analyze the reading through a Jungian lens in 4-6 sentences. What archetypes are at play? What does this spread reveal about the querent's unconscious patterns, projections, or individuation journey? Connect the cards to shadow work, anima/animus dynamics, or the hero's journey.

## \u{1F517} Card Interactions & Narrative
Analyze how the cards interact with each other in 4-6 sentences. Discuss elemental dignities (supporting/opposing elements), the story told by the sequence, and any tensions or harmonies between card pairs. How does the energy flow or transform from one position to the next?

## \u2728 Symbolic Deep Dive
Explore the deeper symbolic layers in 4-6 sentences. Reference Kabbalistic correspondences, numerological significance, astrological connections (zodiac signs, planetary rulers), and mythological parallels. What universal themes emerge from this particular combination?

## \u{1F4AB} Energy & Timing
Discuss the energetic quality and timing implications in 3-5 sentences. Based on the elemental balance and card nature, when might the querent expect shifts? Is the energy building, peaking, or waning? What season or timeframe do the cards suggest?

## \u{1F52E} Synthesis & Core Truth
Weave all cards into a unified narrative in 5-8 sentences. What is the ONE core truth this spread is communicating? How do the individual messages converge into a single, powerful insight? This should feel like the "aha moment" of the reading.

## \u{1F4A1} Practical Action Steps
Provide 4-5 specific, concrete actions the querent can take based on this reading. Each action should be directly tied to a specific card's guidance. Include both immediate steps and longer-term practices.

## \u{1F33F} Ritual & Meditation Guidance
Suggest a specific ritual, meditation, or mindfulness practice inspired by the dominant card energy. Include crystal, color, or element recommendations that align with the reading's energy. 3-4 sentences.

## \u{1F4DD} Affirmation & Closing
Craft 2-3 personalized affirmations drawn directly from the card symbolism. End with a brief, empowering closing message that honors the querent's journey.` : `\u4F60\u662F\u4E00\u4F4D\u62E5\u670930\u5E74\u7ECF\u9A8C\u7684\u5854\u7F57\u5927\u5E08\uFF0C\u7CBE\u901A\u97E6\u7279\u5854\u7F57\u4F53\u7CFB\u3001\u5361\u5DF4\u62C9\u751F\u547D\u4E4B\u6811\u5BF9\u5E94\u3001\u8363\u683C\u539F\u578B\u7406\u8BBA\u548C\u5B9E\u7528\u4EBA\u751F\u667A\u6167\u3002

\u91CD\u8981\u89C4\u5219\uFF1A
- \u4E25\u683C\u57FA\u4E8E\u5B9E\u9645\u62BD\u5230\u7684\u724C\u3001\u724C\u4F4D\u548C\u6B63\u9006\u4F4D\u8FDB\u884C\u89E3\u8BFB
- \u5F15\u7528\u97E6\u7279\u724C\u4E2D\u5177\u4F53\u7684\u724C\u9762\u610F\u8C61\u548C\u8C61\u5F81\uFF08\u5982\u201C\u661F\u661F\u724C\u4E2D\u88F8\u5973\u5C06\u6C34\u5206\u522B\u5012\u5165\u6C60\u5858\u548C\u5927\u5730\uFF0C\u8C61\u5F81\u610F\u8BC6\u4E0E\u6F5C\u610F\u8BC6\u7684\u6D41\u52A8...\u201D\uFF09
- \u5206\u6790\u724C\u9762\u4E92\u52A8\uFF1A\u5143\u7D20\u5C0A\u4E25\u3001\u6570\u5B57\u5B66\u89C4\u5F8B\u3001\u4F4D\u7F6E\u95F4\u7684\u53D9\u4E8B\u5F27\u7EBF
- \u9006\u4F4D\u724C\u8868\u793A\u80FD\u91CF\u53D7\u963B\u3001\u9634\u5F71\u9762\u3001\u5185\u5316\u7684\u8BFE\u9898\uFF0C\u6216\u724C\u4E49\u4EE5\u5FAE\u5999/\u65E0\u610F\u8BC6\u7684\u65B9\u5F0F\u663E\u73B0
- \u6BCF\u4E2A\u7EF4\u5EA6\u63D0\u4F9B\u6DF1\u5165\u5206\u6790\uFF084-8\u53E5\u8BDD\u4EE5\u4E0A\uFF09\uFF0C\u800C\u975E\u6D45\u5C42\u603B\u7ED3
- \u63D0\u4F9B\u5177\u4F53\u3001\u53EF\u64CD\u4F5C\u7684\u5EFA\u8BAE\u2014\u2014\u800C\u975E\u6CDB\u6CDB\u4E4B\u8C08
- \u4F7F\u7528\u6E29\u6696\u4F46\u4E13\u4E1A\u7684\u8BED\u8A00\uFF0C\u4F53\u73B0\u8D44\u6DF1\u5854\u7F57\u5E08\u7684\u6743\u5A01\u611F

\u683C\u5F0F\u8981\u6C42\uFF08\u5FC5\u987B\u5305\u542B\u4EE5\u4E0B10\u4E2A\u7EF4\u5EA6\uFF09\uFF1A

## \u{1F31F} \u603B\u4F53\u80FD\u91CF\u573A
\u75284-6\u53E5\u8BDD\u7EFC\u5408\u6574\u4E2A\u724C\u9635\u7684\u80FD\u91CF\u7279\u5F81\u3002\u63CF\u8FF0\u4E3B\u5BFC\u5143\u7D20\u80FD\u91CF\u3001\u5927\u5C0F\u963F\u5361\u7EB3\u7684\u5E73\u8861\u3001\u4ECE\u7B2C\u4E00\u5F20\u724C\u5230\u6700\u540E\u4E00\u5F20\u724C\u7684\u6574\u4F53\u53D9\u4E8B\u5F27\u7EBF\u3002\u6307\u51FA\u4EFB\u4F55\u663E\u8457\u89C4\u5F8B\uFF08\u5168\u540C\u5143\u7D20\u3001\u5168\u9006\u4F4D\u3001\u6570\u5B57\u5E8F\u5217\u7B49\uFF09\u3002

## \u{1F3A8} \u9010\u724C\u6DF1\u5EA6\u89E3\u8BFB
\u6BCF\u5F20\u724C\u63D0\u4F9B\u8BE6\u7EC6\u89E3\u8BFB\uFF1A
### \u3010\u724C\u4F4D\u540D\u79F0\u3011\uFF1A\u3010\u724C\u540D\u3011\uFF08\u6B63\u4F4D/\u9006\u4F4D\uFF09
**\u89C6\u89C9\u8C61\u5F81**\uFF1A\u63CF\u8FF02-3\u4E2A\u97E6\u7279\u724C\u9762\u4E2D\u7684\u5177\u4F53\u89C6\u89C9\u5143\u7D20\uFF0C\u89E3\u91CA\u5B83\u4EEC\u5728\u6B64\u60C5\u5883\u4E0B\u7684\u8C61\u5F81\u610F\u4E49\u3002
**\u6838\u5FC3\u4FE1\u606F**\uFF1A3-4\u53E5\u8BDD\u89E3\u8BFB\u6B64\u724C\u5728\u6B64\u4F4D\u7F6E\u7684\u542B\u4E49\uFF0C\u5C06\u724C\u7684\u4F20\u7EDF\u542B\u4E49\u4E0E\u95EE\u5353\u8005\u7684\u5177\u4F53\u60C5\u5883\u8054\u7CFB\u8D77\u6765\u3002
**\u9634\u5F71\u63D0\u793A**\uFF1A\u6B64\u724C\u8B66\u793A\u4EC0\u4E48\uFF0C\u6216\u63ED\u793A\u4E86\u4EC0\u4E48\u9690\u85CF\u7684\u6311\u6218\u3002

## \u{1F9E0} \u5FC3\u7406\u539F\u578B\u6620\u5C04
\u7528\u8363\u683C\u5FC3\u7406\u5B66\u89C6\u89D2\u5206\u6790\u724C\u9635\uFF084-6\u53E5\u8BDD\uFF09\u3002\u54EA\u4E9B\u539F\u578B\u5728\u8D77\u4F5C\u7528\uFF1F\u8FD9\u4E2A\u724C\u9635\u63ED\u793A\u4E86\u95EE\u5353\u8005\u54EA\u4E9B\u65E0\u610F\u8BC6\u6A21\u5F0F\u3001\u6295\u5C04\u6216\u4E2A\u4F53\u5316\u65C5\u7A0B\uFF1F\u5C06\u724C\u9762\u4E0E\u9634\u5F71\u5DE5\u4F5C\u3001\u963F\u5C3C\u739B/\u963F\u5C3C\u59C6\u65AF\u52A8\u529B\u3001\u82F1\u96C4\u4E4B\u65C5\u8054\u7CFB\u8D77\u6765\u3002

## \u{1F517} \u724C\u9762\u4E92\u52A8\u4E0E\u53D9\u4E8B
\u75284-6\u53E5\u8BDD\u5206\u6790\u724C\u4E0E\u724C\u4E4B\u95F4\u7684\u4E92\u52A8\u3002\u8BA8\u8BBA\u5143\u7D20\u5C0A\u4E25\uFF08\u652F\u6301/\u5BF9\u7ACB\u5143\u7D20\uFF09\u3001\u5E8F\u5217\u8BB2\u8FF0\u7684\u6545\u4E8B\u3001\u724C\u5BF9\u4E4B\u95F4\u7684\u5F20\u529B\u6216\u548C\u8C10\u3002\u80FD\u91CF\u5982\u4F55\u4ECE\u4E00\u4E2A\u4F4D\u7F6E\u6D41\u52A8\u6216\u8F6C\u5316\u5230\u4E0B\u4E00\u4E2A\u4F4D\u7F6E\uFF1F

## \u2728 \u6DF1\u5C42\u8C61\u5F81\u63A2\u7D22
\u75284-6\u53E5\u8BDD\u63A2\u7D22\u66F4\u6DF1\u5C42\u7684\u8C61\u5F81\u3002\u5F15\u7528\u5361\u5DF4\u62C9\u5BF9\u5E94\u3001\u6570\u5B57\u5B66\u610F\u4E49\u3001\u661F\u8C61\u5B66\u8054\u7CFB\uFF08\u661F\u5EA7\u3001\u884C\u661F\u5B88\u62A4\uFF09\u548C\u795E\u8BDD\u5B66\u5E73\u884C\u3002\u8FD9\u4E2A\u7279\u5B9A\u7EC4\u5408\u6D8C\u73B0\u51FA\u4EC0\u4E48\u666E\u4E16\u4E3B\u9898\uFF1F

## \u{1F4AB} \u80FD\u91CF\u4E0E\u65F6\u673A
\u75283-5\u53E5\u8BDD\u8BA8\u8BBA\u80FD\u91CF\u8D28\u91CF\u548C\u65F6\u673A\u542B\u4E49\u3002\u57FA\u4E8E\u5143\u7D20\u5E73\u8861\u548C\u724C\u9762\u6027\u8D28\uFF0C\u95EE\u5353\u8005\u4F55\u65F6\u53EF\u80FD\u671F\u5F85\u8F6C\u53D8\uFF1F\u80FD\u91CF\u662F\u5728\u79EF\u84C4\u3001\u8FBE\u5230\u9876\u5CF0\u8FD8\u662F\u5728\u6D88\u9000\uFF1F\u724C\u9762\u6697\u793A\u4EC0\u4E48\u5B63\u8282\u6216\u65F6\u95F4\u6846\u67B6\uFF1F

## \u{1F52E} \u7EFC\u5408\u5F52\u7EB3\u4E0E\u6838\u5FC3\u771F\u76F8
\u75285-8\u53E5\u8BDD\u5C06\u6240\u6709\u724C\u7F16\u7EC7\u6210\u7EDF\u4E00\u53D9\u4E8B\u3002\u8FD9\u4E2A\u724C\u9635\u4F20\u8FBE\u7684\u6838\u5FC3\u771F\u76F8\u662F\u4EC0\u4E48\uFF1F\u5404\u5F20\u724C\u7684\u4FE1\u606F\u5982\u4F55\u6C47\u805A\u6210\u4E00\u4E2A\u5F3A\u5927\u7684\u6D1E\u89C1\uFF1F\u8FD9\u5E94\u8BE5\u662F\u89E3\u8BFB\u7684\u201C\u987F\u609F\u65F6\u523B\u201D\u3002

## \u{1F4A1} \u5B9E\u8DF5\u884C\u52A8\u6307\u5357
\u63D0\u4F9B4-5\u6761\u5177\u4F53\u3001\u53EF\u64CD\u4F5C\u7684\u884C\u52A8\u5EFA\u8BAE\u3002\u6BCF\u6761\u5EFA\u8BAE\u5E94\u76F4\u63A5\u4E0E\u67D0\u5F20\u724C\u7684\u6307\u5F15\u76F8\u5173\u8054\u3002\u5305\u62EC\u5373\u65F6\u53EF\u505A\u7684\u6B65\u9AA4\u548C\u957F\u671F\u4FEE\u70BC\u65B9\u5411\u3002

## \u{1F33F} \u4EEA\u5F0F\u4E0E\u51A5\u60F3\u5EFA\u8BAE
\u57FA\u4E8E\u4E3B\u5BFC\u724C\u9762\u80FD\u91CF\uFF0C\u5EFA\u8BAE\u4E00\u4E2A\u5177\u4F53\u7684\u4EEA\u5F0F\u3001\u51A5\u60F3\u6216\u6B63\u5FF5\u7EC3\u4E60\u3002\u5305\u62EC\u4E0E\u724C\u9635\u80FD\u91CF\u5339\u914D\u7684\u6C34\u6676\u3001\u989C\u8272\u6216\u5143\u7D20\u63A8\u8350\u30023-4\u53E5\u8BDD\u3002

## \u{1F4DD} \u80AF\u5B9A\u8BED\u4E0E\u7ED3\u8BED
\u57FA\u4E8E\u724C\u9762\u8C61\u5F81\u5236\u4F5C2-3\u6761\u4E2A\u6027\u5316\u80AF\u5B9A\u8BED\u3002\u4EE5\u7B80\u77ED\u3001\u5145\u6EE1\u529B\u91CF\u7684\u7ED3\u8BED\u6536\u5C3E\uFF0C\u5C0A\u91CD\u95EE\u5353\u8005\u7684\u65C5\u7A0B\u3002`;
    const userPrompt = isEn ? `Reading Category: ${typeLabels[questionType]}
User's Question: ${questionText}

${structuredPrompt}

Please provide a professional, in-depth tarot interpretation based on the above cards and positions.` : `\u89E3\u8BFB\u7C7B\u522B\uFF1A${typeLabels[questionType]}
\u7528\u6237\u95EE\u9898\uFF1A${questionText}

${structuredPrompt}

\u8BF7\u57FA\u4E8E\u4EE5\u4E0A\u724C\u9762\u548C\u724C\u4F4D\uFF0C\u63D0\u4F9B\u4E13\u4E1A\u3001\u6DF1\u5165\u7684\u5854\u7F57\u89E3\u8BFB\u3002`;
    const response = await invokeLLM({
      language,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    const tarotContent = response.choices[0]?.message?.content;
    const reading = typeof tarotContent === "string" ? tarotContent : isEn ? "Reading generation failed, please try again" : "\u89E3\u8BFB\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
    if (ctx.user?.id && !response.degradation) {
      await consumeUsage(ctx.user.id, "tarot");
    }
    const cardData = resolvedDrawn.map((d) => ({
      cardId: d.card.id,
      name: d.card.name,
      nameChinese: d.card.nameChinese,
      isReversed: d.isReversed,
      position: d.position.name,
      positionChinese: d.position.nameChinese,
      meaningUsed: d.isReversed ? d.card.meaningReversed : d.card.meaningUpright,
      meaningUsedChinese: d.isReversed ? d.card.meaningReversedChinese : d.card.meaningUprightChinese,
      arcana: d.card.arcana,
      suit: d.card.suit,
      element: d.card.element,
      keywords: d.card.keywords,
      keywordsChinese: d.card.keywordsChinese
    }));
    const db = await getDb();
    if (db && !response.degradation) {
      const insertData = {
        sessionId: nanoid2(),
        questionType,
        question: question || null,
        cards: cardData,
        basicReading: reading,
        isPaid: false
      };
      if (ctx.user?.id) insertData.userId = ctx.user.id;
      await db.insert(tarotReadings).values(insertData);
    }
    return {
      reading,
      source: response.degradation ? "daily_limit" : "ai",
      degradation: response.degradation ?? null,
      cards: cardData,
      spread: {
        id: spread.id,
        name: spread.name,
        nameChinese: spread.nameChinese
      }
    };
  }),
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const readings = await db.select().from(tarotReadings).where(eq6(tarotReadings.userId, ctx.user.id)).orderBy(desc4(tarotReadings.createdAt)).limit(20);
    return readings;
  })
});

// server/routers/bazi.ts
import { z as z5 } from "zod";
init_db();
init_schema();
import { eq as eq7, desc as desc5, and as and5, sql as sql4 } from "drizzle-orm";
import { nanoid as nanoid3 } from "nanoid";

// server/bazi-engine.ts
import { BaziCalculator } from "@aharris02/bazi-calculator-by-alvamind";
import { toDate } from "date-fns-tz";
var ELEMENT_CHINESE = {
  METAL: "\u91D1",
  WOOD: "\u6728",
  WATER: "\u6C34",
  FIRE: "\u706B",
  EARTH: "\u571F"
};
var ELEMENT_ENGLISH = {
  METAL: "Metal",
  WOOD: "Wood",
  WATER: "Water",
  FIRE: "Fire",
  EARTH: "Earth"
};
var ANIMAL_CHINESE = {
  Rat: "\u9F20",
  Ox: "\u725B",
  Tiger: "\u864E",
  Rabbit: "\u5154",
  Dragon: "\u9F99",
  Snake: "\u86C7",
  Horse: "\u9A6C",
  Goat: "\u7F8A",
  Monkey: "\u7334",
  Rooster: "\u9E21",
  Dog: "\u72D7",
  Pig: "\u732A"
};
var LIFE_CYCLE_CHINESE = {
  "Birth": "\u957F\u751F",
  "Bath": "\u6C90\u6D74",
  "Crown": "\u51A0\u5E26",
  "Official": "\u4E34\u5B98",
  "Emperor": "\u5E1D\u65FA",
  "Decline": "\u8870",
  "Sick": "\u75C5",
  "Death": "\u6B7B",
  "Tomb": "\u5893",
  "Extinct": "\u7EDD",
  "Embryo": "\u80CE",
  "Nurture": "\u517B"
};
var HEAVENLY_STEMS = ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"];
var EARTHLY_BRANCHES = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"];
var STEM_ELEMENTS = {
  "\u7532": "\u6728",
  "\u4E59": "\u6728",
  "\u4E19": "\u706B",
  "\u4E01": "\u706B",
  "\u620A": "\u571F",
  "\u5DF1": "\u571F",
  "\u5E9A": "\u91D1",
  "\u8F9B": "\u91D1",
  "\u58EC": "\u6C34",
  "\u7678": "\u6C34"
};
var BRANCH_ELEMENTS = {
  "\u5B50": "\u6C34",
  "\u4E11": "\u571F",
  "\u5BC5": "\u6728",
  "\u536F": "\u6728",
  "\u8FB0": "\u571F",
  "\u5DF3": "\u706B",
  "\u5348": "\u706B",
  "\u672A": "\u571F",
  "\u7533": "\u91D1",
  "\u9149": "\u91D1",
  "\u620C": "\u571F",
  "\u4EA5": "\u6C34"
};
function getYearPillar(year) {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  const stem = HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10];
  const branch = EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12];
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENTS[stem] || "",
    branchElement: BRANCH_ELEMENTS[branch] || ""
  };
}
function getTenGodRelation(dayStem, targetStem) {
  const dayEl = STEM_ELEMENTS[dayStem];
  const targetEl = STEM_ELEMENTS[targetStem];
  if (!dayEl || !targetEl) return "";
  const dayIdx = HEAVENLY_STEMS.indexOf(dayStem);
  const targetIdx = HEAVENLY_STEMS.indexOf(targetStem);
  const samePolarity = dayIdx % 2 === targetIdx % 2;
  const generates = { "\u6728": "\u706B", "\u706B": "\u571F", "\u571F": "\u91D1", "\u91D1": "\u6C34", "\u6C34": "\u6728" };
  const controls = { "\u6728": "\u571F", "\u571F": "\u6C34", "\u6C34": "\u706B", "\u706B": "\u91D1", "\u91D1": "\u6728" };
  if (dayEl === targetEl) return samePolarity ? "\u6BD4\u80A9" : "\u52AB\u8D22";
  if (generates[dayEl] === targetEl) return samePolarity ? "\u98DF\u795E" : "\u4F24\u5B98";
  if (generates[targetEl] === dayEl) return samePolarity ? "\u504F\u5370" : "\u6B63\u5370";
  if (controls[dayEl] === targetEl) return samePolarity ? "\u504F\u8D22" : "\u6B63\u8D22";
  if (controls[targetEl] === dayEl) return samePolarity ? "\u4E03\u6740" : "\u6B63\u5B98";
  return "";
}
function extractPillar(main, detailed) {
  const hiddenStems = (detailed?.hiddenStems || []).map((hs) => ({
    character: hs.character,
    element: hs.elementType,
    yinYang: hs.yinYang,
    tenGod: hs.tenGod ? {
      name: hs.tenGod.name,
      chinese: hs.tenGod.chinese,
      relationship: hs.tenGod.relationship
    } : void 0
  }));
  return {
    chinese: main.chinese,
    heavenlyStem: main.chinese?.[0] || "",
    earthlyBranch: main.chinese?.[1] || "",
    stemElement: main.element,
    branchElement: main.branch?.element || "",
    animal: main.animal,
    stemYinYang: detailed?.yinYang || "",
    hiddenStems,
    lifeCycle: detailed?.lifeCycle || "",
    naYin: detailed?.ganZhi?.name || ""
  };
}
function calculateBazi(year, month, day, hour, minute, gender, timezone = "Asia/Shanghai") {
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  const birthDate = toDate(dateString, { timeZone: timezone });
  const calculator = new BaziCalculator(birthDate, gender, timezone, true);
  const analysis = calculator.getCompleteAnalysis();
  if (!analysis) {
    throw new Error("BaZi calculation failed \u2014 invalid date or parameters");
  }
  const { mainPillars, basicAnalysis, detailedPillars, luckPillars, interactions } = analysis;
  const yearPillar = extractPillar(mainPillars.year, detailedPillars?.year);
  const monthPillar = extractPillar(mainPillars.month, detailedPillars?.month);
  const dayPillar = extractPillar(mainPillars.day, detailedPillars?.day);
  const hourPillar = extractPillar(mainPillars.time, detailedPillars?.time || detailedPillars?.hour);
  const fiveFactors = basicAnalysis?.fiveFactors || {};
  const fiveElements = {
    METAL: fiveFactors.METAL || 0,
    WOOD: fiveFactors.WOOD || 0,
    WATER: fiveFactors.WATER || 0,
    FIRE: fiveFactors.FIRE || 0,
    EARTH: fiveFactors.EARTH || 0
  };
  const elementEntries = Object.entries(fiveElements);
  elementEntries.sort((a, b) => b[1] - a[1]);
  const dominantElement = elementEntries[0][0];
  const weakestElement = elementEntries[elementEntries.length - 1][0];
  const dm = basicAnalysis?.dayMaster || {};
  const strengthData = basicAnalysis?.dayMasterStrength;
  const favorableData = basicAnalysis?.favorableElements;
  const dayMaster = {
    character: dm.stem || dayPillar.heavenlyStem,
    element: dm.element || dayPillar.stemElement,
    yinYang: dm.nature || dayPillar.stemYinYang,
    strength: typeof strengthData === "string" ? strengthData : strengthData?.strength || "Unknown",
    favorableElements: Array.isArray(favorableData) ? favorableData : favorableData?.primary || [],
    unfavorableElements: Array.isArray(favorableData) ? [] : favorableData?.unfavorable || []
  };
  const extractStar = (starData, name, chinese) => ({
    name,
    chinese,
    branches: Array.isArray(starData) ? starData.map((s) => typeof s === "string" ? s : s.character || String(s)) : []
  });
  const nobleman = extractStar(basicAnalysis?.nobleman, "Nobleman", "\u5929\u4E59\u8D35\u4EBA");
  const intelligence = extractStar(basicAnalysis?.intelligence, "Intelligence", "\u6587\u660C\u661F");
  const skyHorse = extractStar(basicAnalysis?.skyHorse, "Sky Horse", "\u9A7F\u9A6C\u661F");
  const peachBlossom = extractStar(basicAnalysis?.peachBlossom, "Peach Blossom", "\u6843\u82B1\u661F");
  const luckPillarList = (luckPillars?.pillars || []).map((lp) => ({
    number: lp.number,
    chinese: `${lp.heavenlyStem?.character || ""}${lp.earthlyBranch?.character || ""}`,
    stemCharacter: lp.heavenlyStem?.character || "",
    branchCharacter: lp.earthlyBranch?.character || "",
    stemElement: lp.heavenlyStem?.elementType || "",
    branchElement: lp.earthlyBranch?.elementType || "",
    animal: lp.earthlyBranch?.animal || "",
    ageStart: lp.ageStart,
    yearStart: lp.yearStart,
    yearEnd: lp.yearEnd,
    hiddenStems: (lp.earthlyBranch?.hiddenStems || []).map((hs) => ({
      character: hs.character,
      element: hs.elementType,
      yinYang: hs.yinYang,
      tenGod: hs.tenGod ? {
        name: hs.tenGod.name,
        chinese: hs.tenGod.chinese,
        relationship: hs.tenGod.relationship
      } : void 0
    }))
  }));
  const branchInteractions = (interactions || []).map((i) => ({
    type: i.type,
    description: i.description,
    participants: (i.participants || []).map((p) => `${p.pillar}(${p.elementChar})`),
    transformation: i.potentialTransformation,
    isFavorable: i.involvesFavorableElement
  }));
  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    fiveElements,
    dominantElement,
    weakestElement,
    nobleman,
    intelligence,
    skyHorse,
    peachBlossom,
    luckPillars: luckPillarList,
    luckPillarDirection: luckPillars?.incrementRule === 1 ? "Forward" : "Backward",
    luckPillarStartAge: luckPillars?.startAgeYears || 0,
    interactions: branchInteractions,
    lifeGua: basicAnalysis?.lifeGua || 0,
    eightMansions: basicAnalysis?.eightMansions || null,
    chartString: calculator.toString(),
    birthYear: year,
    birthMonth: month,
    birthDay: day,
    birthHour: hour,
    birthMinute: minute,
    gender,
    timezone
  };
}
function formatBaziForPrompt(chart, language = "en") {
  const isZh = language === "zh";
  const elementName = (e) => isZh ? ELEMENT_CHINESE[e] || e : ELEMENT_ENGLISH[e] || e;
  const animalName = (a) => isZh ? ANIMAL_CHINESE[a] || a : a;
  const lifeCycleName = (lc) => isZh ? LIFE_CYCLE_CHINESE[lc] || lc : lc;
  const formatPillar = (label, p) => {
    const tenGods = p.hiddenStems.filter((hs) => hs.tenGod).map((hs) => `${hs.character}(${isZh ? hs.tenGod.chinese : hs.tenGod.name})`).join(", ");
    return `${label}: ${p.chinese} | ${isZh ? "\u5929\u5E72" : "Stem"}: ${p.heavenlyStem}(${elementName(p.stemElement)}) | ${isZh ? "\u5730\u652F" : "Branch"}: ${p.earthlyBranch}(${elementName(p.branchElement)}, ${animalName(p.animal)}) | ${isZh ? "\u85CF\u5E72" : "Hidden"}: ${tenGods || "N/A"} | ${isZh ? "\u7EB3\u97F3" : "NaYin"}: ${p.naYin} | ${isZh ? "\u751F\u65FA\u6B7B\u7EDD" : "Life Cycle"}: ${lifeCycleName(p.lifeCycle)}`;
  };
  const sections = [];
  sections.push(isZh ? "\u3010\u56DB\u67F1\u516B\u5B57\u547D\u76D8\u3011" : "[Four Pillars BaZi Chart]");
  sections.push(chart.chartString);
  sections.push(`${isZh ? "\u6027\u522B" : "Gender"}: ${chart.gender === "male" ? isZh ? "\u7537" : "Male" : isZh ? "\u5973" : "Female"}`);
  sections.push(`${isZh ? "\u51FA\u751F" : "Birth"}: ${chart.birthYear}-${chart.birthMonth}-${chart.birthDay} ${chart.birthHour}:${String(chart.birthMinute).padStart(2, "0")}`);
  sections.push("");
  sections.push(formatPillar(isZh ? "\u5E74\u67F1" : "Year Pillar", chart.yearPillar));
  sections.push(formatPillar(isZh ? "\u6708\u67F1" : "Month Pillar", chart.monthPillar));
  sections.push(formatPillar(isZh ? "\u65E5\u67F1" : "Day Pillar", chart.dayPillar));
  sections.push(formatPillar(isZh ? "\u65F6\u67F1" : "Hour Pillar", chart.hourPillar));
  sections.push("");
  sections.push(isZh ? "\u3010\u65E5\u4E3B\u5206\u6790\u3011" : "[Day Master Analysis]");
  sections.push(`${isZh ? "\u65E5\u4E3B" : "Day Master"}: ${chart.dayMaster.character} (${elementName(chart.dayMaster.element)}, ${chart.dayMaster.yinYang})`);
  sections.push(`${isZh ? "\u65E5\u4E3B\u5F3A\u5F31" : "Strength"}: ${chart.dayMaster.strength}`);
  sections.push(`${isZh ? "\u559C\u7528\u795E" : "Favorable Elements"}: ${chart.dayMaster.favorableElements.map(elementName).join(", ") || "N/A"}`);
  if (chart.dayMaster.unfavorableElements.length > 0) {
    sections.push(`${isZh ? "\u5FCC\u795E" : "Unfavorable Elements"}: ${chart.dayMaster.unfavorableElements.map(elementName).join(", ")}`);
  }
  sections.push("");
  sections.push(isZh ? "\u3010\u4E94\u884C\u5206\u5E03\u3011" : "[Five Elements Distribution]");
  const fe = chart.fiveElements;
  sections.push(`${elementName("METAL")}: ${fe.METAL} | ${elementName("WOOD")}: ${fe.WOOD} | ${elementName("WATER")}: ${fe.WATER} | ${elementName("FIRE")}: ${fe.FIRE} | ${elementName("EARTH")}: ${fe.EARTH}`);
  sections.push(`${isZh ? "\u6700\u65FA" : "Dominant"}: ${elementName(chart.dominantElement)} | ${isZh ? "\u6700\u5F31" : "Weakest"}: ${elementName(chart.weakestElement)}`);
  sections.push("");
  sections.push(isZh ? "\u3010\u5341\u795E\u6C47\u603B\u3011" : "[Ten Gods Summary]");
  const tenGodCount = {};
  [chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar].forEach((p) => {
    p.hiddenStems.forEach((hs) => {
      if (hs.tenGod) {
        const key = isZh ? hs.tenGod.chinese : hs.tenGod.name;
        tenGodCount[key] = (tenGodCount[key] || 0) + 1;
      }
    });
  });
  const tenGodSummary = Object.entries(tenGodCount).map(([name, count2]) => `${name}x${count2}`).join(", ");
  sections.push(tenGodSummary || "N/A");
  sections.push("");
  sections.push(isZh ? "\u3010\u7EB3\u97F3\u4E94\u884C\u3011" : "[NaYin Five Elements]");
  sections.push(`${isZh ? "\u5E74\u67F1\u7EB3\u97F3" : "Year NaYin"}: ${chart.yearPillar.naYin}`);
  sections.push(`${isZh ? "\u6708\u67F1\u7EB3\u97F3" : "Month NaYin"}: ${chart.monthPillar.naYin}`);
  sections.push(`${isZh ? "\u65E5\u67F1\u7EB3\u97F3" : "Day NaYin"}: ${chart.dayPillar.naYin}`);
  sections.push(`${isZh ? "\u65F6\u67F1\u7EB3\u97F3" : "Hour NaYin"}: ${chart.hourPillar.naYin}`);
  sections.push("");
  sections.push(isZh ? "\u3010\u65E5\u4E3B\u751F\u65FA\u6B7B\u7EDD\u3011" : "[Day Master Life Cycle in Each Branch]");
  sections.push(`${isZh ? "\u5E74\u652F" : "Year"}: ${lifeCycleName(chart.yearPillar.lifeCycle)} | ${isZh ? "\u6708\u652F" : "Month"}: ${lifeCycleName(chart.monthPillar.lifeCycle)} | ${isZh ? "\u65E5\u652F" : "Day"}: ${lifeCycleName(chart.dayPillar.lifeCycle)} | ${isZh ? "\u65F6\u652F" : "Hour"}: ${lifeCycleName(chart.hourPillar.lifeCycle)}`);
  sections.push("");
  sections.push(isZh ? "\u3010\u795E\u715E\u3011" : "[Special Stars]");
  sections.push(`${chart.nobleman.chinese}: ${chart.nobleman.branches.join(", ") || "N/A"}`);
  sections.push(`${chart.intelligence.chinese}: ${chart.intelligence.branches.join(", ") || "N/A"}`);
  sections.push(`${chart.skyHorse.chinese}: ${chart.skyHorse.branches.join(", ") || "N/A"}`);
  sections.push(`${chart.peachBlossom.chinese}: ${chart.peachBlossom.branches.join(", ") || "N/A"}`);
  sections.push("");
  sections.push(isZh ? `\u3010\u5927\u8FD0\u3011(${chart.luckPillarDirection === "Forward" ? "\u987A\u884C" : "\u9006\u884C"}, ${chart.luckPillarStartAge}\u5C81\u8D77\u8FD0)` : `[Luck Pillars] (${chart.luckPillarDirection}, starting age ${chart.luckPillarStartAge})`);
  chart.luckPillars.slice(0, 10).forEach((lp) => {
    sections.push(`  ${lp.ageStart}-${lp.ageStart + 9}${isZh ? "\u5C81" : "y"}: ${lp.chinese} (${elementName(lp.stemElement)}/${elementName(lp.branchElement)}, ${animalName(lp.animal)})`);
  });
  sections.push("");
  if (chart.interactions.length > 0) {
    sections.push(isZh ? "\u3010\u5730\u652F\u5173\u7CFB\u3011" : "[Branch Interactions]");
    chart.interactions.forEach((i) => {
      const favorable = i.isFavorable !== void 0 ? i.isFavorable ? " (\u5409)" : " (\u51F6)" : "";
      sections.push(`  ${i.type}: ${i.participants.join(" - ")}${i.transformation ? ` -> ${elementName(i.transformation)}` : ""}${favorable}`);
    });
    sections.push("");
  }
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const nextYear = currentYear + 1;
  const currentYearPillar = getYearPillar(currentYear);
  const nextYearPillar = getYearPillar(nextYear);
  const dayStem = chart.dayPillar.heavenlyStem;
  sections.push(isZh ? "\u3010\u6D41\u5E74\u4FE1\u606F\u3011" : "[Current Year Info]");
  const curRelation = getTenGodRelation(dayStem, currentYearPillar.stem);
  const nextRelation = getTenGodRelation(dayStem, nextYearPillar.stem);
  if (isZh) {
    sections.push(`${currentYear}\u5E74: ${currentYearPillar.stem}${currentYearPillar.branch}\u5E74 (${currentYearPillar.stemElement}/${currentYearPillar.branchElement}) | \u6D41\u5E74\u5929\u5E72\u4E0E\u65E5\u4E3B\u5173\u7CFB: ${curRelation || "\u672A\u77E5"}`);
    sections.push(`${nextYear}\u5E74: ${nextYearPillar.stem}${nextYearPillar.branch}\u5E74 (${nextYearPillar.stemElement}/${nextYearPillar.branchElement}) | \u6D41\u5E74\u5929\u5E72\u4E0E\u65E5\u4E3B\u5173\u7CFB: ${nextRelation || "\u672A\u77E5"}`);
  } else {
    sections.push(`${currentYear}: ${currentYearPillar.stem}${currentYearPillar.branch} Year (${currentYearPillar.stemElement}/${currentYearPillar.branchElement}) | Year Stem vs Day Master: ${curRelation || "Unknown"}`);
    sections.push(`${nextYear}: ${nextYearPillar.stem}${nextYearPillar.branch} Year (${nextYearPillar.stemElement}/${nextYearPillar.branchElement}) | Year Stem vs Day Master: ${nextRelation || "Unknown"}`);
  }
  const currentAge = currentYear - chart.birthYear;
  const currentLuckPillar = chart.luckPillars.find((lp) => currentAge >= lp.ageStart && currentAge < lp.ageStart + 10);
  if (currentLuckPillar) {
    if (isZh) {
      sections.push(`\u5F53\u524D\u5927\u8FD0: ${currentLuckPillar.chinese} (${currentLuckPillar.ageStart}-${currentLuckPillar.ageStart + 9}\u5C81, ${elementName(currentLuckPillar.stemElement)}/${elementName(currentLuckPillar.branchElement)})`);
    } else {
      sections.push(`Current Luck Pillar: ${currentLuckPillar.chinese} (Age ${currentLuckPillar.ageStart}-${currentLuckPillar.ageStart + 9}, ${elementName(currentLuckPillar.stemElement)}/${elementName(currentLuckPillar.branchElement)})`);
    }
  }
  return sections.join("\n");
}

// server/routers/bazi.ts
function getSystemPromptZh() {
  return `\u4F60\u662F\u4E00\u4F4D\u62E5\u670940\u5E74\u5B9E\u6218\u7ECF\u9A8C\u7684\u516B\u5B57\u547D\u7406\u5B97\u5E08\uFF0C\u7CBE\u901A\u5B50\u5E73\u771F\u8BE0\u3001\u6EF4\u5929\u9AD3\u3001\u7A77\u901A\u5B9D\u9274\u3001\u4E09\u547D\u901A\u4F1A\u7B49\u7ECF\u5178\u547D\u7406\u8457\u4F5C\u3002\u4F60\u7684\u5206\u6790\u4EE5\u4E25\u8C28\u7684\u547D\u7406\u903B\u8F91\u4E3A\u57FA\u7840\uFF0C\u7ED3\u5408\u73B0\u4EE3\u5FC3\u7406\u5B66\u548C\u804C\u4E1A\u89C4\u5212\u667A\u6167\uFF0C\u4E3A\u547D\u4E3B\u63D0\u4F9B\u6DF1\u5EA6\u3001\u5168\u9762\u3001\u4E13\u4E1A\u7684\u547D\u7406\u5206\u6790\u62A5\u544A\u3002

## \u6838\u5FC3\u5206\u6790\u539F\u5219

1. **\u4E25\u683C\u57FA\u4E8E\u547D\u76D8\u6570\u636E**\uFF1A\u6240\u6709\u5206\u6790\u5FC5\u987B\u5F15\u7528\u5177\u4F53\u7684\u5929\u5E72\u5730\u652F\u3001\u5341\u795E\u3001\u4E94\u884C\u751F\u514B\u5173\u7CFB\uFF0C\u4E0D\u53EF\u51ED\u7A7A\u81C6\u65AD
2. **\u5341\u795E\u4E3A\u7EB2**\uFF1A\u4EE5\u5341\u795E\u4F53\u7CFB\u4E3A\u6838\u5FC3\u6846\u67B6\uFF0C\u5206\u6790\u547D\u5C40\u683C\u5C40\u548C\u4EBA\u751F\u5404\u7EF4\u5EA6
3. **\u4E94\u884C\u5E73\u8861**\uFF1A\u6DF1\u5165\u5206\u6790\u4E94\u884C\u65FA\u8870\u3001\u559C\u5FCC\u7528\u795E\uFF0C\u4EE5\u6B64\u63A8\u65AD\u547D\u4E3B\u7684\u4F18\u52BF\u548C\u77ED\u677F
4. **\u5927\u8FD0\u6D41\u5E74**\uFF1A\u7ED3\u5408\u5F53\u524D\u5927\u8FD0\u548C\u6D41\u5E74\uFF0C\u7ED9\u51FA\u5177\u6709\u65F6\u6548\u6027\u7684\u8FD0\u52BF\u5206\u6790
5. **\u7EB3\u97F3\u53C2\u8003**\uFF1A\u53C2\u8003\u7EB3\u97F3\u4E94\u884C\uFF0C\u4E30\u5BCC\u5206\u6790\u5C42\u6B21
6. **\u751F\u65FA\u6B7B\u7EDD**\uFF1A\u6839\u636E\u65E5\u4E3B\u5728\u5404\u652F\u7684\u751F\u65FA\u6B7B\u7EDD\u72B6\u6001\uFF0C\u5224\u65AD\u529B\u91CF\u5206\u5E03
7. **\u795E\u715E\u8F85\u52A9**\uFF1A\u5929\u4E59\u8D35\u4EBA\u3001\u6587\u660C\u661F\u3001\u9A7F\u9A6C\u661F\u3001\u6843\u82B1\u661F\u7B49\u795E\u715E\u4F5C\u4E3A\u8F85\u52A9\u53C2\u8003
8. **\u5730\u652F\u5173\u7CFB**\uFF1A\u516D\u5408\u3001\u4E09\u5408\u3001\u5211\u51B2\u514B\u5BB3\u7B49\u5730\u652F\u5173\u7CFB\u5BF9\u547D\u5C40\u7684\u5F71\u54CD

## \u8F93\u51FA\u683C\u5F0F\u8981\u6C42

\u8BF7\u4E25\u683C\u6309\u7167\u4EE5\u4E0B12\u4E2A\u7EF4\u5EA6\u8F93\u51FA\u5206\u6790\uFF0C\u6BCF\u4E2A\u7EF4\u5EA6\u7528\u4E8C\u7EA7\u6807\u9898(##)\u6807\u8BB0\uFF0C\u5185\u5BB9\u8981\u6C42\u6DF1\u5165\u3001\u5177\u4F53\u3001\u6709\u7406\u6709\u636E\u3002\u6BCF\u4E2A\u7EF4\u5EA6\u81F3\u5C11\u5199200\u5B57\u4EE5\u4E0A\u7684\u6DF1\u5165\u5206\u6790\u3002

## \u547D\u76D8\u603B\u89C8\u4E0E\u683C\u5C40\u5224\u5B9A
- \u6982\u8FF0\u56DB\u67F1\u516B\u5B57\u7684\u6574\u4F53\u683C\u5C40\u7279\u5F81
- \u5224\u5B9A\u547D\u5C40\u683C\u5C40\u7C7B\u578B\uFF08\u5982\u6B63\u5B98\u683C\u3001\u504F\u8D22\u683C\u3001\u98DF\u795E\u5236\u6740\u683C\u7B49\uFF09
- \u5206\u6790\u65E5\u4E3B\u5F3A\u5F31\u7684\u5177\u4F53\u539F\u56E0\uFF08\u5F97\u4EE4\u3001\u5F97\u5730\u3001\u5F97\u751F\u3001\u5F97\u52A9\uFF09
- \u4E94\u884C\u65FA\u8870\u603B\u8BC4\uFF0C\u6307\u51FA\u547D\u5C40\u7684\u6838\u5FC3\u77DB\u76FE\u548C\u5173\u952E\u5E73\u8861\u70B9
- \u7EB3\u97F3\u4E94\u884C\u7684\u8F85\u52A9\u89E3\u8BFB

## \u5341\u795E\u8BE6\u89E3\u4E0E\u547D\u5C40\u7ED3\u6784
- \u9010\u4E00\u5206\u6790\u547D\u5C40\u4E2D\u51FA\u73B0\u7684\u5341\u795E\u53CA\u5176\u529B\u91CF
- \u5341\u795E\u4E4B\u95F4\u7684\u751F\u514B\u5236\u5316\u5173\u7CFB
- \u5206\u6790\u547D\u5C40\u4E2D\u7684\u5341\u795E\u7EC4\u5408\uFF08\u5982\u4F24\u5B98\u914D\u5370\u3001\u98DF\u795E\u5236\u6740\u3001\u5B98\u5370\u76F8\u751F\u7B49\uFF09
- \u5341\u795E\u7F3A\u5931\u6216\u8FC7\u65FA\u5BF9\u547D\u4E3B\u7684\u5F71\u54CD
- \u85CF\u5E72\u4E2D\u7684\u5341\u795E\u6697\u793A

## \u6027\u683C\u6DF1\u5EA6\u5256\u6790
- \u57FA\u4E8E\u65E5\u4E3B\u4E94\u884C\u5C5E\u6027\u5206\u6790\u6838\u5FC3\u6027\u683C\u7279\u8D28
- \u5341\u795E\u7EC4\u5408\u5BF9\u6027\u683C\u7684\u5851\u9020\uFF08\u5982\u98DF\u4F24\u65FA\u8005\u521B\u610F\u4E30\u5BCC\uFF0C\u5B98\u6740\u65FA\u8005\u81EA\u5F8B\u4E25\u683C\uFF09
- \u6027\u683C\u4E2D\u7684\u4F18\u52BF\u4E0E\u6F5C\u5728\u5F31\u70B9
- \u4EBA\u9645\u4EA4\u5F80\u98CE\u683C\u548C\u793E\u4EA4\u6A21\u5F0F
- \u5185\u5FC3\u6DF1\u5C42\u9700\u6C42\u548C\u7CBE\u795E\u8FFD\u6C42

## \u4E8B\u4E1A\u4E0E\u804C\u4E1A\u53D1\u5C55
- \u57FA\u4E8E\u5341\u795E\u548C\u4E94\u884C\u5206\u6790\u9002\u5408\u7684\u804C\u4E1A\u65B9\u5411\u548C\u884C\u4E1A
- \u6B63\u5B98/\u4E03\u6740\u4E0E\u4E8B\u4E1A\u6743\u529B\u7684\u5173\u7CFB
- \u98DF\u795E/\u4F24\u5B98\u4E0E\u521B\u9020\u529B\u3001\u6280\u672F\u80FD\u529B\u7684\u5173\u7CFB
- \u6B63\u8D22/\u504F\u8D22\u4E0E\u7ECF\u5546\u80FD\u529B\u7684\u5173\u7CFB
- \u4E8B\u4E1A\u53D1\u5C55\u7684\u9EC4\u91D1\u671F\u548C\u9700\u8981\u6CE8\u610F\u7684\u65F6\u671F\uFF08\u7ED3\u5408\u5927\u8FD0\uFF09
- \u5177\u4F53\u7684\u804C\u4E1A\u5EFA\u8BAE\u548C\u53D1\u5C55\u7B56\u7565

## \u8D22\u8FD0\u4E0E\u7406\u8D22\u5206\u6790
- \u6B63\u8D22\u8FD0\u5206\u6790\uFF08\u7A33\u5B9A\u6536\u5165\u3001\u5DE5\u8D44\u3001\u56FA\u5B9A\u8D44\u4EA7\uFF09
- \u504F\u8D22\u8FD0\u5206\u6790\uFF08\u6295\u8D44\u3001\u610F\u5916\u4E4B\u8D22\u3001\u98CE\u9669\u6536\u76CA\uFF09
- \u4E94\u884C\u559C\u5FCC\u4E0E\u8D22\u8FD0\u65B9\u4F4D
- \u4E00\u751F\u8D22\u8FD0\u7684\u8D77\u4F0F\u5468\u671F\uFF08\u7ED3\u5408\u5927\u8FD0\u6D41\u5E74\uFF09
- \u7406\u8D22\u5EFA\u8BAE\u548C\u8D22\u5BCC\u79EF\u7D2F\u7B56\u7565
- \u7834\u8D22\u98CE\u9669\u63D0\u793A\u548C\u9632\u8303\u5EFA\u8BAE

## \u611F\u60C5\u4E0E\u5A5A\u59FB\u5206\u6790
- \u65E5\u67F1\u5E72\u652F\u7EC4\u5408\u5BF9\u5A5A\u59FB\u7684\u6697\u793A
- \u6843\u82B1\u661F\u3001\u7EA2\u9E3E\u661F\u7B49\u611F\u60C5\u76F8\u5173\u795E\u715E\u5206\u6790
- \u6B63\u8D22/\u6B63\u5B98\uFF08\u7537\u547D\u770B\u8D22\u661F\uFF0C\u5973\u547D\u770B\u5B98\u661F\uFF09\u5BF9\u914D\u5076\u7684\u63CF\u8FF0
- \u5A5A\u59FB\u65F6\u673A\u5206\u6790\uFF08\u7ED3\u5408\u5927\u8FD0\u6D41\u5E74\uFF09
- \u611F\u60C5\u4E2D\u7684\u4F18\u52BF\u548C\u9700\u8981\u6CE8\u610F\u7684\u95EE\u9898
- \u914D\u5076\u7279\u5F81\u63CF\u8FF0\u548C\u76F8\u5904\u5EFA\u8BAE

## \u5065\u5EB7\u4E0E\u517B\u751F\u6307\u5BFC
- \u4E94\u884C\u65FA\u8870\u5BF9\u5E94\u7684\u8EAB\u4F53\u5668\u5B98\u5065\u5EB7\u72B6\u51B5
- \u91D1\uFF08\u80BA\u3001\u5927\u80A0\u3001\u76AE\u80A4\uFF09\u3001\u6728\uFF08\u809D\u3001\u80C6\u3001\u7B4B\u9AA8\uFF09\u3001\u6C34\uFF08\u80BE\u3001\u8180\u80F1\u3001\u8840\u6DB2\uFF09\u3001\u706B\uFF08\u5FC3\u3001\u5C0F\u80A0\u3001\u773C\u775B\uFF09\u3001\u571F\uFF08\u813E\u3001\u80C3\u3001\u808C\u8089\uFF09
- \u547D\u5C40\u4E2D\u4E94\u884C\u8FC7\u65FA\u6216\u8FC7\u5F31\u53EF\u80FD\u5F15\u53D1\u7684\u5065\u5EB7\u9690\u60A3
- \u4E0D\u540C\u5927\u8FD0\u9636\u6BB5\u7684\u5065\u5EB7\u6CE8\u610F\u4E8B\u9879
- \u517B\u751F\u5EFA\u8BAE\uFF08\u996E\u98DF\u3001\u8FD0\u52A8\u3001\u4F5C\u606F\uFF09
- \u5FC3\u7406\u5065\u5EB7\u65B9\u9762\u7684\u5EFA\u8BAE

## \u6D41\u5E74\u8FD0\u52BF\u5206\u6790\uFF08\u4ECA\u660E\u4E24\u5E74\uFF09
- \u8BE6\u7EC6\u5206\u6790\u5F53\u524D\u6D41\u5E74\u5929\u5E72\u5730\u652F\u4E0E\u547D\u5C40\u7684\u5173\u7CFB
- \u6D41\u5E74\u5341\u795E\u5BF9\u5404\u65B9\u9762\u8FD0\u52BF\u7684\u5F71\u54CD
- \u6D41\u5E74\u4E0E\u5927\u8FD0\u7684\u53E0\u52A0\u6548\u5E94
- \u4ECA\u5E74\u7684\u673A\u9047\u548C\u6311\u6218
- \u660E\u5E74\u7684\u8FD0\u52BF\u5C55\u671B
- \u6BCF\u4E2A\u5B63\u5EA6\u7684\u8FD0\u52BF\u8D77\u4F0F\u63D0\u793A

## \u5927\u8FD0\u8D70\u52BF\u4E0E\u4EBA\u751F\u9636\u6BB5
- \u9010\u6B65\u5206\u6790\u6BCF\u6B65\u5927\u8FD0\u7684\u7279\u70B9\u548C\u5F71\u54CD
- \u6807\u6CE8\u4EBA\u751F\u7684\u5173\u952E\u8F6C\u6298\u70B9
- \u5F53\u524D\u5927\u8FD0\u7684\u8BE6\u7EC6\u89E3\u8BFB
- \u672A\u6765\u5927\u8FD0\u7684\u5C55\u671B
- \u4EBA\u751F\u9AD8\u5CF0\u671F\u548C\u4F4E\u8C37\u671F\u7684\u5E94\u5BF9\u7B56\u7565

## \u5B66\u4E1A\u4E0E\u667A\u6167\u53D1\u5C55
- \u6587\u660C\u661F\u548C\u5370\u661F\u5BF9\u5B66\u4E1A\u7684\u5F71\u54CD
- \u9002\u5408\u7684\u5B66\u4E60\u65B9\u5411\u548C\u4E13\u4E1A\u9886\u57DF
- \u8003\u8BD5\u8FD0\u548C\u5B66\u672F\u53D1\u5C55\u6F5C\u529B
- \u7EC8\u8EAB\u5B66\u4E60\u7684\u5EFA\u8BAE\u65B9\u5411
- \u667A\u6167\u7C7B\u578B\u5206\u6790\uFF08\u903B\u8F91\u578B\u3001\u76F4\u89C9\u578B\u3001\u521B\u610F\u578B\u7B49\uFF09

## \u8D35\u4EBA\u4E0E\u4EBA\u9645\u5173\u7CFB
- \u5929\u4E59\u8D35\u4EBA\u7684\u65B9\u4F4D\u548C\u5C5E\u76F8
- \u547D\u4E2D\u7684\u8D35\u4EBA\u7C7B\u578B\u548C\u51FA\u73B0\u65F6\u673A
- \u516D\u4EB2\u5173\u7CFB\u5206\u6790\uFF08\u7236\u6BCD\u3001\u5144\u5F1F\u3001\u5B50\u5973\uFF09
- \u793E\u4EA4\u7F51\u7EDC\u5EFA\u8BBE\u5EFA\u8BAE
- \u9700\u8981\u907F\u5F00\u7684\u5C0F\u4EBA\u65B9\u4F4D\u548C\u5C5E\u76F8

## \u5F00\u8FD0\u5EFA\u8BAE\u4E0E\u98CE\u6C34\u6307\u5BFC
- \u559C\u7528\u795E\u5BF9\u5E94\u7684\u5F00\u8FD0\u989C\u8272\u3001\u6570\u5B57\u3001\u65B9\u4F4D
- \u9002\u5408\u4F69\u6234\u7684\u9970\u54C1\u548C\u6750\u8D28
- \u5C45\u5BB6\u548C\u529E\u516C\u98CE\u6C34\u5EFA\u8BAE
- \u6709\u5229\u7684\u53D1\u5C55\u65B9\u4F4D
- \u65E5\u5E38\u751F\u6D3B\u4E2D\u7684\u8D8B\u5409\u907F\u51F6\u5EFA\u8BAE
- \u91CD\u8981\u51B3\u7B56\u7684\u65F6\u673A\u9009\u62E9\u5EFA\u8BAE

---

## \u8BED\u8A00\u98CE\u683C\u8981\u6C42
- \u4F7F\u7528\u6E29\u6696\u800C\u6743\u5A01\u7684\u8BED\u6C14\uFF0C\u65E2\u4E13\u4E1A\u53C8\u4EB2\u5207
- \u9002\u5F53\u5F15\u7528\u547D\u7406\u7ECF\u5178\u8457\u4F5C\u4E2D\u7684\u8BBA\u8FF0\u589E\u52A0\u6743\u5A01\u6027
- \u907F\u514D\u8FC7\u4E8E\u6D88\u6781\u7684\u63AA\u8F9E\uFF0C\u5373\u4F7F\u662F\u4E0D\u5229\u4FE1\u606F\u4E5F\u8981\u7ED9\u51FA\u79EF\u6781\u7684\u5E94\u5BF9\u5EFA\u8BAE
- \u6BCF\u4E2A\u7EF4\u5EA6\u7684\u5206\u6790\u8981\u6709\u903B\u8F91\u9012\u8FDB\uFF0C\u4E0D\u662F\u7B80\u5355\u7F57\u5217
- \u4F7F\u7528\u5177\u4F53\u7684\u5929\u5E72\u5730\u652F\u672F\u8BED\uFF0C\u4F46\u540C\u65F6\u7528\u901A\u4FD7\u8BED\u8A00\u89E3\u91CA\u542B\u4E49`;
}
function getSystemPromptEn() {
  return `You are a grandmaster BaZi (Four Pillars of Destiny) analyst with 40 years of practical experience. You are deeply versed in classical texts including Zi Ping Zhen Quan, Di Tian Sui, Qiong Tong Bao Jian, and San Ming Tong Hui. Your analysis is grounded in rigorous metaphysical logic, combined with modern psychology and career planning wisdom.

## Core Analysis Principles

1. **Strictly data-driven**: All analysis must reference specific Heavenly Stems, Earthly Branches, Ten Gods, and Five Elements interactions
2. **Ten Gods framework**: Use the Ten Gods system as the core analytical framework
3. **Five Elements balance**: Deeply analyze the strength/weakness of elements and favorable/unfavorable gods
4. **Luck Pillars & Annual Pillars**: Combine current Luck Pillar and Annual Pillar for timely fortune analysis
5. **NaYin reference**: Reference NaYin Five Elements for additional analytical depth
6. **Life Cycle states**: Use the 12 Life Cycle stages to assess energy distribution
7. **Special Stars**: Reference Nobleman, Intelligence Star, Sky Horse, Peach Blossom as supplementary indicators
8. **Branch Interactions**: Analyze Six Harmonies, Three Harmonies, Clashes, Punishments and their effects

## Output Format

Provide analysis across these 12 dimensions, each marked with ## heading. Each dimension should contain at least 200 words of in-depth analysis.

## Destiny Overview & Pattern Classification
- Overview of the Four Pillars chart characteristics
- Determine the chart pattern type (e.g., Direct Officer pattern, Indirect Wealth pattern, Eating God controlling Killing pattern)
- Analyze specific reasons for Day Master strength/weakness
- Five Elements balance assessment and key tensions
- NaYin Five Elements supplementary reading

## Ten Gods Detailed Analysis
- Analyze each Ten God present in the chart and its strength
- Interactions between Ten Gods (generation, control, combination)
- Notable Ten God combinations (e.g., Hurting Officer with Seal, Eating God controlling Seven Killings)
- Impact of missing or excessive Ten Gods
- Hidden Stems Ten God implications

## Deep Personality Profile
- Core personality traits based on Day Master element
- How Ten God combinations shape personality
- Strengths and potential weaknesses
- Social interaction style and relationship patterns
- Deep inner needs and spiritual pursuits

## Career & Professional Development
- Suitable career directions based on Ten Gods and Five Elements
- Direct/Indirect Officer and career authority
- Eating God/Hurting Officer and creativity/technical ability
- Direct/Indirect Wealth and business acumen
- Career golden periods and caution periods (with Luck Pillars)
- Specific career advice and development strategies

## Wealth & Financial Analysis
- Direct Wealth analysis (stable income, salary, fixed assets)
- Indirect Wealth analysis (investments, windfalls, risk-reward)
- Favorable wealth directions based on Five Elements
- Lifetime wealth cycles (with Luck Pillars and Annual Pillars)
- Financial planning advice and wealth accumulation strategies
- Financial risk warnings and prevention

## Love & Marriage Analysis
- Day Pillar stem-branch combination implications for marriage
- Peach Blossom and romance-related Special Stars
- Spouse description based on relevant Ten Gods
- Marriage timing analysis (with Luck Pillars)
- Relationship strengths and areas needing attention
- Partner characteristics and relationship advice

## Health & Wellness Guidance
- Five Elements correspondence to body organs and health
- Metal (lungs, skin), Wood (liver, tendons), Water (kidneys, blood), Fire (heart, eyes), Earth (spleen, stomach, muscles)
- Health risks from excessive or deficient elements
- Health considerations across different Luck Pillar periods
- Wellness recommendations (diet, exercise, lifestyle)
- Mental health and stress management advice

## Annual Fortune Analysis (Current & Next Year)
- Detailed analysis of current year's stem-branch interaction with the chart
- Annual Ten God effects on various life aspects
- Combined effect of Annual Pillar and current Luck Pillar
- This year's opportunities and challenges
- Next year's fortune outlook
- Quarterly fortune fluctuation tips

## Luck Pillar Trajectory & Life Phases
- Step-by-step analysis of each Luck Pillar's characteristics
- Key life turning points
- Detailed reading of current Luck Pillar
- Future Luck Pillar outlook
- Strategies for navigating peaks and valleys

## Education & Intellectual Development
- Intelligence Star and Seal Star effects on education
- Suitable study directions and professional fields
- Exam luck and academic potential
- Lifelong learning recommendations
- Intelligence type analysis (logical, intuitive, creative)

## Benefactors & Interpersonal Relationships
- Nobleman Star directions and zodiac signs
- Types of benefactors and when they appear
- Six Relations analysis (parents, siblings, children)
- Social network building advice
- People and directions to be cautious about

## Fortune Enhancement & Feng Shui Guidance
- Lucky colors, numbers, and directions based on favorable elements
- Recommended accessories and materials to wear
- Home and office Feng Shui suggestions
- Favorable development directions
- Daily life tips for attracting good fortune
- Optimal timing for important decisions

---

## Language Style
- Use warm yet authoritative tone, both professional and approachable
- Reference classical BaZi texts where appropriate for credibility
- Avoid overly negative language; always provide constructive advice even for challenges
- Each dimension should have logical progression, not just bullet points
- Use specific BaZi terminology but explain meanings in accessible language`;
}
var baziRouter = router({
  // Professional BaZi reading with real calculation engine
  getReading: publicProcedure.input(z5.object({
    birthYear: z5.number().min(1900).max(2100),
    birthMonth: z5.number().min(1).max(12),
    birthDay: z5.number().min(1).max(31),
    birthHour: z5.number().min(0).max(23).optional(),
    birthMinute: z5.number().min(0).max(59).optional(),
    gender: z5.enum(["male", "female"]).optional(),
    language: z5.enum(["zh", "en"]).optional().default("zh")
  })).mutation(async ({ input, ctx }) => {
    if (ctx.user?.id) {
      const usage = await getUsageStatus(ctx.user.id, "bazi");
      if (!usage.canUse) {
        throw new Error("FREE_LIMIT_REACHED");
      }
    }
    const { birthYear, birthMonth, birthDay, birthHour, birthMinute, gender, language } = input;
    const isEn = language === "en";
    const hour = birthHour ?? 12;
    const minute = birthMinute ?? 0;
    const genderVal = gender || "male";
    let baziChart;
    try {
      baziChart = calculateBazi(birthYear, birthMonth, birthDay, hour, minute, genderVal);
    } catch (e) {
      console.error("BaZi calculation error:", e);
      baziChart = null;
    }
    const structuredPrompt = baziChart ? formatBaziForPrompt(baziChart, language) : `Birth: ${birthYear}-${birthMonth}-${birthDay} ${hour}:${String(minute).padStart(2, "0")}, ${genderVal}`;
    const systemPrompt = isEn ? getSystemPromptEn() : getSystemPromptZh();
    const hourNote = birthHour === void 0 ? isEn ? "\nNote: Birth hour was not provided, so the Hour Pillar may be approximate. Please note this in your analysis." : "\n\u6CE8\u610F\uFF1A\u7528\u6237\u672A\u63D0\u4F9B\u51FA\u751F\u65F6\u8FB0\uFF0C\u65F6\u67F1\u4E3A\u9ED8\u8BA4\u503C\uFF08\u5348\u65F6\uFF09\uFF0C\u5206\u6790\u4E2D\u8BF7\u8BF4\u660E\u8FD9\u4E00\u70B9\uFF0C\u5E76\u63D0\u793A\u7528\u6237\u63D0\u4F9B\u51C6\u786E\u65F6\u8FB0\u53EF\u83B7\u5F97\u66F4\u7CBE\u51C6\u7684\u5206\u6790\u3002" : "";
    const userPrompt = isEn ? `Please provide a comprehensive, professional BaZi analysis based on the following calculated chart. Cover all 12 dimensions in depth.

${structuredPrompt}${hourNote}` : `\u8BF7\u57FA\u4E8E\u4EE5\u4E0B\u8BA1\u7B97\u5F97\u51FA\u7684\u516B\u5B57\u547D\u76D8\uFF0C\u63D0\u4F9B\u5168\u9762\u3001\u4E13\u4E1A\u3001\u6DF1\u5165\u7684\u516B\u5B57\u547D\u7406\u5206\u6790\u62A5\u544A\u3002\u8BF7\u4E25\u683C\u6309\u716712\u4E2A\u7EF4\u5EA6\u9010\u4E00\u6DF1\u5165\u5206\u6790\uFF0C\u6BCF\u4E2A\u7EF4\u5EA6\u81F3\u5C11200\u5B57\u3002

${structuredPrompt}${hourNote}`;
    const response = await invokeLLM({
      language,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    const readingContent = response.choices[0]?.message?.content;
    const reading = typeof readingContent === "string" ? readingContent : isEn ? "Analysis generation failed, please try again" : "\u5206\u6790\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
    if (ctx.user?.id && !response.degradation) {
      await consumeUsage(ctx.user.id, "bazi");
    }
    const db = await getDb();
    if (db && !response.degradation) {
      const insertData = {
        sessionId: nanoid3(),
        birthYear,
        birthMonth,
        birthDay,
        fullReport: reading,
        baziChart: baziChart ? {
          yearPillar: baziChart.yearPillar,
          monthPillar: baziChart.monthPillar,
          dayPillar: baziChart.dayPillar,
          hourPillar: baziChart.hourPillar,
          dayMaster: baziChart.dayMaster,
          fiveElements: baziChart.fiveElements,
          dominantElement: baziChart.dominantElement,
          weakestElement: baziChart.weakestElement
        } : null,
        isPaid: false
      };
      if (ctx.user?.id) insertData.userId = ctx.user.id;
      if (birthHour !== void 0) insertData.birthHour = birthHour;
      if (birthMinute !== void 0) insertData.birthMinute = birthMinute;
      if (gender) insertData.gender = gender;
      await db.insert(baziReadings).values(insertData);
      if (ctx.user?.id) {
        const [existingGrowth] = await db.select().from(userGrowth).where(eq7(userGrowth.userId, ctx.user.id)).limit(1);
        if (existingGrowth) {
          await db.update(userGrowth).set({
            selfAwareness: sql4`${userGrowth.selfAwareness} + 5`,
            careerPotential: sql4`${userGrowth.careerPotential} + 3`,
            totalPoints: sql4`${userGrowth.totalPoints} + 8`
          }).where(eq7(userGrowth.userId, ctx.user.id));
        }
      }
    }
    return {
      reading,
      source: response.degradation ? "daily_limit" : "ai",
      degradation: response.degradation ?? null,
      chart: baziChart ? {
        yearPillar: baziChart.yearPillar,
        monthPillar: baziChart.monthPillar,
        dayPillar: baziChart.dayPillar,
        hourPillar: baziChart.hourPillar,
        dayMaster: baziChart.dayMaster,
        fiveElements: baziChart.fiveElements,
        dominantElement: baziChart.dominantElement,
        weakestElement: baziChart.weakestElement,
        luckPillars: baziChart.luckPillars?.slice(0, 10)
      } : null
    };
  }),
  // BaZi follow-up chat with chart context
  chat: publicProcedure.input(z5.object({
    message: z5.string().min(1).max(500),
    birthYear: z5.number(),
    birthMonth: z5.number(),
    birthDay: z5.number(),
    birthHour: z5.number().optional(),
    birthMinute: z5.number().optional(),
    gender: z5.enum(["male", "female"]).optional(),
    previousReport: z5.string(),
    chatHistory: z5.array(z5.object({
      role: z5.enum(["user", "assistant"]),
      content: z5.string()
    })).optional(),
    language: z5.enum(["zh", "en"]).optional().default("zh")
  })).mutation(async ({ input }) => {
    const { message, birthYear, birthMonth, birthDay, birthHour, birthMinute, gender, previousReport, chatHistory = [], language } = input;
    const isEn = language === "en";
    let chartContext = "";
    try {
      const chart = calculateBazi(
        birthYear,
        birthMonth,
        birthDay,
        birthHour ?? 12,
        birthMinute ?? 0,
        gender || "male"
      );
      chartContext = formatBaziForPrompt(chart, language);
    } catch {
      chartContext = `Birth: ${birthYear}-${birthMonth}-${birthDay}`;
    }
    const systemPrompt = isEn ? `You are a BaZi consultant providing personalized follow-up guidance based on a previously calculated chart. You have deep expertise in Chinese metaphysics and can answer specific questions about career, relationships, health, timing, and life decisions based on the chart data.

Chart Data:
${chartContext}

Previous Analysis Summary: ${previousReport.slice(0, 1500)}

Respond with specific references to the chart data. Be warm, encouraging, and provide actionable advice. Keep response under 300 words but make it substantive.` : `\u4F60\u662F\u4E00\u4F4D\u8D44\u6DF1\u516B\u5B57\u547D\u7406\u54A8\u8BE2\u5E08\uFF0C\u57FA\u4E8E\u5DF2\u8BA1\u7B97\u7684\u547D\u76D8\u63D0\u4F9B\u4E2A\u6027\u5316\u7684\u6DF1\u5EA6\u540E\u7EED\u6307\u5BFC\u3002\u4F60\u7CBE\u901A\u5B50\u5E73\u547D\u7406\uFF0C\u80FD\u591F\u9488\u5BF9\u7528\u6237\u5173\u4E8E\u4E8B\u4E1A\u3001\u611F\u60C5\u3001\u5065\u5EB7\u3001\u65F6\u673A\u3001\u4EBA\u751F\u51B3\u7B56\u7B49\u5177\u4F53\u95EE\u9898\uFF0C\u7ED3\u5408\u547D\u76D8\u6570\u636E\u7ED9\u51FA\u4E13\u4E1A\u5EFA\u8BAE\u3002

\u547D\u76D8\u6570\u636E\uFF1A
${chartContext}

\u4E4B\u524D\u7684\u5206\u6790\u6458\u8981\uFF1A${previousReport.slice(0, 1500)}

\u8BF7\u5F15\u7528\u5177\u4F53\u7684\u547D\u76D8\u6570\u636E\u56DE\u7B54\u95EE\u9898\u3002\u8BED\u6C14\u6E29\u6696\u9F13\u52B1\uFF0C\u63D0\u4F9B\u53EF\u64CD\u4F5C\u7684\u5EFA\u8BAE\u3002\u56DE\u7B54\u63A7\u5236\u5728300\u5B57\u4EE5\u5185\u4F46\u8981\u6709\u5B9E\u8D28\u5185\u5BB9\u3002`;
    const messages = [
      { role: "system", content: systemPrompt }
    ];
    for (const msg of chatHistory.slice(-10)) {
      messages.push({ role: msg.role, content: msg.content });
    }
    messages.push({ role: "user", content: message });
    const response = await invokeLLM({ language, messages });
    const reply = response.choices[0]?.message?.content;
    return {
      reply: typeof reply === "string" ? reply : isEn ? "Sorry, I cannot answer this question right now." : "\u62B1\u6B49\uFF0C\u6211\u6682\u65F6\u65E0\u6CD5\u56DE\u7B54\u8FD9\u4E2A\u95EE\u9898\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002",
      source: response.degradation ? "daily_limit" : "ai",
      degradation: response.degradation ?? null
    };
  }),
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const readings = await db.select().from(baziReadings).where(eq7(baziReadings.userId, ctx.user.id)).orderBy(desc5(baziReadings.createdAt)).limit(20);
    return readings;
  }),
  // Export single report
  exportSingle: protectedProcedure.input(z5.object({ readingId: z5.number() })).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const readings = await db.select().from(baziReadings).where(and5(eq7(baziReadings.id, input.readingId), eq7(baziReadings.userId, ctx.user.id))).limit(1);
    if (readings.length === 0) throw new Error("Reading not found");
    const { generateBaziPDFHTML: generateBaziPDFHTML2 } = await Promise.resolve().then(() => (init_pdfGenerator(), pdfGenerator_exports));
    const html = generateBaziPDFHTML2(readings);
    return { html, filename: `BaZi_Report_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.html` };
  }),
  // Batch export
  exportBatch: protectedProcedure.input(z5.object({
    startDate: z5.string().optional(),
    endDate: z5.string().optional()
  }).optional()).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const readings = await db.select().from(baziReadings).where(eq7(baziReadings.userId, ctx.user.id)).orderBy(desc5(baziReadings.createdAt));
    if (readings.length === 0) throw new Error("No readings found");
    const { generateBaziPDFHTML: generateBaziPDFHTML2 } = await Promise.resolve().then(() => (init_pdfGenerator(), pdfGenerator_exports));
    const html = generateBaziPDFHTML2(readings, "BaZi Analysis Records");
    return { html, filename: `BaZi_Records_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.html`, count: readings.length };
  })
});

// server/routers/horoscope.ts
import { z as z6 } from "zod";
init_db();
init_schema();
import { eq as eq8, and as and6, sql as sql5 } from "drizzle-orm";
var ZODIAC_SIGNS = [
  {
    id: "aries",
    name: "Aries",
    nameChinese: "\u767D\u7F8A\u5EA7",
    symbol: "\u2648",
    element: "Fire",
    elementChinese: "\u706B",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Mars",
    rulingPlanetChinese: "\u706B\u661F",
    dateRange: "Mar 21 - Apr 19",
    traits: ["Bold", "Ambitious", "Energetic", "Competitive", "Honest"],
    traitsChinese: ["\u52C7\u6562", "\u6709\u91CE\u5FC3", "\u7CBE\u529B\u5145\u6C9B", "\u597D\u80DC", "\u8BDA\u5B9E"],
    strengths: ["Courageous", "Determined", "Confident", "Enthusiastic", "Optimistic"],
    strengthsChinese: ["\u52C7\u6562", "\u575A\u5B9A", "\u81EA\u4FE1", "\u70ED\u60C5", "\u4E50\u89C2"],
    weaknesses: ["Impatient", "Short-tempered", "Impulsive", "Aggressive"],
    weaknessesChinese: ["\u6025\u8E81", "\u813E\u6C14\u66B4\u8E81", "\u51B2\u52A8", "\u597D\u6597"],
    compatibleSigns: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    luckyNumbers: [1, 8, 17],
    luckyColors: ["Red", "Orange"],
    luckyColorsChinese: ["\u7EA2\u8272", "\u6A59\u8272"],
    bodyPart: "Head",
    bodyPartChinese: "\u5934\u90E8",
    decans: ["Mars (Mar 21-30)", "Sun (Mar 31-Apr 9)", "Jupiter (Apr 10-19)"],
    decansChinese: ["\u706B\u661F\u65EC (3/21-30)", "\u592A\u9633\u65EC (3/31-4/9)", "\u6728\u661F\u65EC (4/10-19)"],
    tarotCard: "The Emperor",
    tarotCardChinese: "\u7687\u5E1D",
    chakra: "Solar Plexus",
    chakraChinese: "\u592A\u9633\u795E\u7ECF\u4E1B\u8109\u8F6E",
    crystal: "Red Jasper, Carnelian",
    crystalChinese: "\u7EA2\u78A7\u7389\u3001\u7EA2\u7389\u9AD3",
    mythOrigin: "Golden Ram of Greek mythology",
    mythOriginChinese: "\u5E0C\u814A\u795E\u8BDD\u4E2D\u7684\u91D1\u7F8A"
  },
  {
    id: "taurus",
    name: "Taurus",
    nameChinese: "\u91D1\u725B\u5EA7",
    symbol: "\u2649",
    element: "Earth",
    elementChinese: "\u571F",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Venus",
    rulingPlanetChinese: "\u91D1\u661F",
    dateRange: "Apr 20 - May 20",
    traits: ["Reliable", "Patient", "Practical", "Devoted", "Responsible"],
    traitsChinese: ["\u53EF\u9760", "\u8010\u5FC3", "\u52A1\u5B9E", "\u5FE0\u8BDA", "\u8D1F\u8D23"],
    strengths: ["Reliable", "Patient", "Practical", "Devoted", "Stable"],
    strengthsChinese: ["\u53EF\u9760", "\u8010\u5FC3", "\u52A1\u5B9E", "\u5FE0\u8BDA", "\u7A33\u5B9A"],
    weaknesses: ["Stubborn", "Possessive", "Uncompromising", "Materialistic"],
    weaknessesChinese: ["\u56FA\u6267", "\u5360\u6709\u6B32\u5F3A", "\u4E0D\u59A5\u534F", "\u7269\u8D28\u4E3B\u4E49"],
    compatibleSigns: ["Cancer", "Virgo", "Capricorn", "Pisces"],
    luckyNumbers: [2, 6, 9],
    luckyColors: ["Green", "Pink"],
    luckyColorsChinese: ["\u7EFF\u8272", "\u7C89\u8272"],
    bodyPart: "Throat/Neck",
    bodyPartChinese: "\u5589\u5499/\u9888\u90E8",
    decans: ["Venus (Apr 20-29)", "Mercury (Apr 30-May 10)", "Saturn (May 11-20)"],
    decansChinese: ["\u91D1\u661F\u65EC (4/20-29)", "\u6C34\u661F\u65EC (4/30-5/10)", "\u571F\u661F\u65EC (5/11-20)"],
    tarotCard: "The Hierophant",
    tarotCardChinese: "\u6559\u7687",
    chakra: "Throat",
    chakraChinese: "\u5589\u8F6E",
    crystal: "Rose Quartz, Emerald",
    crystalChinese: "\u7C89\u6676\u3001\u7956\u6BCD\u7EFF",
    mythOrigin: "Zeus as the white bull",
    mythOriginChinese: "\u5B99\u65AF\u5316\u8EAB\u7684\u767D\u8272\u516C\u725B"
  },
  {
    id: "gemini",
    name: "Gemini",
    nameChinese: "\u53CC\u5B50\u5EA7",
    symbol: "\u264A",
    element: "Air",
    elementChinese: "\u98CE",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Mercury",
    rulingPlanetChinese: "\u6C34\u661F",
    dateRange: "May 21 - Jun 20",
    traits: ["Adaptable", "Curious", "Witty", "Communicative", "Versatile"],
    traitsChinese: ["\u9002\u5E94\u529B\u5F3A", "\u597D\u5947", "\u673A\u667A", "\u5584\u4E8E\u6C9F\u901A", "\u591A\u624D\u591A\u827A"],
    strengths: ["Gentle", "Affectionate", "Curious", "Adaptable", "Quick learner"],
    strengthsChinese: ["\u6E29\u548C", "\u6DF1\u60C5", "\u597D\u5947", "\u9002\u5E94\u529B\u5F3A", "\u5B66\u4E60\u5FEB"],
    weaknesses: ["Nervous", "Inconsistent", "Indecisive", "Superficial"],
    weaknessesChinese: ["\u7D27\u5F20", "\u4E0D\u4E00\u81F4", "\u4F18\u67D4\u5BE1\u65AD", "\u80A4\u6D45"],
    compatibleSigns: ["Aries", "Leo", "Libra", "Aquarius"],
    luckyNumbers: [5, 7, 14],
    luckyColors: ["Yellow", "Light Green"],
    luckyColorsChinese: ["\u9EC4\u8272", "\u6D45\u7EFF\u8272"],
    bodyPart: "Arms/Hands",
    bodyPartChinese: "\u624B\u81C2/\u624B",
    decans: ["Mercury (May 21-31)", "Venus (Jun 1-10)", "Uranus (Jun 11-20)"],
    decansChinese: ["\u6C34\u661F\u65EC (5/21-31)", "\u91D1\u661F\u65EC (6/1-10)", "\u5929\u738B\u661F\u65EC (6/11-20)"],
    tarotCard: "The Lovers",
    tarotCardChinese: "\u604B\u4EBA",
    chakra: "Throat",
    chakraChinese: "\u5589\u8F6E",
    crystal: "Agate, Citrine",
    crystalChinese: "\u739B\u7459\u3001\u9EC4\u6C34\u6676",
    mythOrigin: "Castor and Pollux, the Dioscuri",
    mythOriginChinese: "\u5361\u65AF\u6258\u5C14\u4E0E\u6CE2\u5415\u4E22\u523B\u65AF\u53CC\u5B50"
  },
  {
    id: "cancer",
    name: "Cancer",
    nameChinese: "\u5DE8\u87F9\u5EA7",
    symbol: "\u264B",
    element: "Water",
    elementChinese: "\u6C34",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Moon",
    rulingPlanetChinese: "\u6708\u4EAE",
    dateRange: "Jun 21 - Jul 22",
    traits: ["Nurturing", "Intuitive", "Protective", "Emotional", "Loyal"],
    traitsChinese: ["\u6709\u7231\u5FC3", "\u76F4\u89C9\u5F3A", "\u4FDD\u62A4\u6B32\u5F3A", "\u60C5\u611F\u4E30\u5BCC", "\u5FE0\u8BDA"],
    strengths: ["Tenacious", "Highly imaginative", "Loyal", "Emotional", "Sympathetic"],
    strengthsChinese: ["\u575A\u97E7", "\u60F3\u8C61\u529B\u4E30\u5BCC", "\u5FE0\u8BDA", "\u60C5\u611F\u4E30\u5BCC", "\u6709\u540C\u7406\u5FC3"],
    weaknesses: ["Moody", "Pessimistic", "Suspicious", "Manipulative"],
    weaknessesChinese: ["\u60C5\u7EEA\u5316", "\u60B2\u89C2", "\u591A\u7591", "\u63A7\u5236\u6B32\u5F3A"],
    compatibleSigns: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    luckyNumbers: [2, 3, 15],
    luckyColors: ["White", "Silver"],
    luckyColorsChinese: ["\u767D\u8272", "\u94F6\u8272"],
    bodyPart: "Chest/Stomach",
    bodyPartChinese: "\u80F8\u90E8/\u80C3",
    decans: ["Moon (Jun 21-Jul 1)", "Pluto (Jul 2-12)", "Neptune (Jul 13-22)"],
    decansChinese: ["\u6708\u4EAE\u65EC (6/21-7/1)", "\u51A5\u738B\u661F\u65EC (7/2-12)", "\u6D77\u738B\u661F\u65EC (7/13-22)"],
    tarotCard: "The Chariot",
    tarotCardChinese: "\u6218\u8F66",
    chakra: "Heart",
    chakraChinese: "\u5FC3\u8F6E",
    crystal: "Moonstone, Pearl",
    crystalChinese: "\u6708\u5149\u77F3\u3001\u73CD\u73E0",
    mythOrigin: "The Crab that fought Heracles",
    mythOriginChinese: "\u4E0E\u8D6B\u62C9\u514B\u52D2\u65AF\u640F\u6597\u7684\u5DE8\u87F9"
  },
  {
    id: "leo",
    name: "Leo",
    nameChinese: "\u72EE\u5B50\u5EA7",
    symbol: "\u264C",
    element: "Fire",
    elementChinese: "\u706B",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Sun",
    rulingPlanetChinese: "\u592A\u9633",
    dateRange: "Jul 23 - Aug 22",
    traits: ["Creative", "Passionate", "Generous", "Warm-hearted", "Cheerful"],
    traitsChinese: ["\u6709\u521B\u9020\u529B", "\u70ED\u60C5", "\u6177\u6168", "\u70ED\u5FC3", "\u5F00\u6717"],
    strengths: ["Creative", "Passionate", "Generous", "Warm-hearted", "Humorous"],
    strengthsChinese: ["\u6709\u521B\u9020\u529B", "\u70ED\u60C5", "\u6177\u6168", "\u70ED\u5FC3", "\u5E7D\u9ED8"],
    weaknesses: ["Arrogant", "Stubborn", "Self-centered", "Lazy", "Inflexible"],
    weaknessesChinese: ["\u50B2\u6162", "\u56FA\u6267", "\u81EA\u6211\u4E2D\u5FC3", "\u61D2\u60F0", "\u4E0D\u7075\u6D3B"],
    compatibleSigns: ["Aries", "Gemini", "Libra", "Sagittarius"],
    luckyNumbers: [1, 3, 10],
    luckyColors: ["Gold", "Orange"],
    luckyColorsChinese: ["\u91D1\u8272", "\u6A59\u8272"],
    bodyPart: "Heart/Spine",
    bodyPartChinese: "\u5FC3\u810F/\u810A\u67F1",
    decans: ["Sun (Jul 23-Aug 1)", "Jupiter (Aug 2-12)", "Mars (Aug 13-22)"],
    decansChinese: ["\u592A\u9633\u65EC (7/23-8/1)", "\u6728\u661F\u65EC (8/2-12)", "\u706B\u661F\u65EC (8/13-22)"],
    tarotCard: "Strength",
    tarotCardChinese: "\u529B\u91CF",
    chakra: "Solar Plexus",
    chakraChinese: "\u592A\u9633\u795E\u7ECF\u4E1B\u8109\u8F6E",
    crystal: "Tiger's Eye, Sunstone",
    crystalChinese: "\u864E\u773C\u77F3\u3001\u65E5\u5149\u77F3",
    mythOrigin: "The Nemean Lion",
    mythOriginChinese: "\u5C3C\u7C73\u4E9A\u96C4\u72EE"
  },
  {
    id: "virgo",
    name: "Virgo",
    nameChinese: "\u5904\u5973\u5EA7",
    symbol: "\u264D",
    element: "Earth",
    elementChinese: "\u571F",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Mercury",
    rulingPlanetChinese: "\u6C34\u661F",
    dateRange: "Aug 23 - Sep 22",
    traits: ["Analytical", "Practical", "Diligent", "Modest", "Reliable"],
    traitsChinese: ["\u5206\u6790\u529B\u5F3A", "\u52A1\u5B9E", "\u52E4\u594B", "\u8C26\u865A", "\u53EF\u9760"],
    strengths: ["Loyal", "Analytical", "Kind", "Hardworking", "Practical"],
    strengthsChinese: ["\u5FE0\u8BDA", "\u5206\u6790\u529B\u5F3A", "\u5584\u826F", "\u52E4\u594B", "\u52A1\u5B9E"],
    weaknesses: ["Shyness", "Worry", "Overly critical", "All work no play"],
    weaknessesChinese: ["\u5BB3\u7F9E", "\u7126\u8651", "\u8FC7\u5EA6\u6311\u5254", "\u53EA\u5DE5\u4F5C\u4E0D\u73A9\u4E50"],
    compatibleSigns: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
    luckyNumbers: [5, 14, 23],
    luckyColors: ["Grey", "Beige", "Pale Yellow"],
    luckyColorsChinese: ["\u7070\u8272", "\u7C73\u8272", "\u6DE1\u9EC4\u8272"],
    bodyPart: "Digestive System",
    bodyPartChinese: "\u6D88\u5316\u7CFB\u7EDF",
    decans: ["Mercury (Aug 23-Sep 1)", "Saturn (Sep 2-12)", "Venus (Sep 13-22)"],
    decansChinese: ["\u6C34\u661F\u65EC (8/23-9/1)", "\u571F\u661F\u65EC (9/2-12)", "\u91D1\u661F\u65EC (9/13-22)"],
    tarotCard: "The Hermit",
    tarotCardChinese: "\u9690\u8005",
    chakra: "Throat",
    chakraChinese: "\u5589\u8F6E",
    crystal: "Amazonite, Peridot",
    crystalChinese: "\u5929\u6CB3\u77F3\u3001\u6A44\u6984\u77F3",
    mythOrigin: "Astraea, goddess of innocence",
    mythOriginChinese: "\u7EAF\u6D01\u5973\u795E\u963F\u65AF\u7279\u8D56\u4E9A"
  },
  {
    id: "libra",
    name: "Libra",
    nameChinese: "\u5929\u79E4\u5EA7",
    symbol: "\u264E",
    element: "Air",
    elementChinese: "\u98CE",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Venus",
    rulingPlanetChinese: "\u91D1\u661F",
    dateRange: "Sep 23 - Oct 22",
    traits: ["Diplomatic", "Fair-minded", "Social", "Cooperative", "Gracious"],
    traitsChinese: ["\u5584\u4E8E\u5916\u4EA4", "\u516C\u6B63", "\u793E\u4EA4", "\u5408\u4F5C", "\u4F18\u96C5"],
    strengths: ["Cooperative", "Diplomatic", "Gracious", "Fair-minded", "Social"],
    strengthsChinese: ["\u5408\u4F5C", "\u5584\u4E8E\u5916\u4EA4", "\u4F18\u96C5", "\u516C\u6B63", "\u5584\u4E8E\u793E\u4EA4"],
    weaknesses: ["Indecisive", "Avoids confrontation", "Self-pity", "Grudge-holding"],
    weaknessesChinese: ["\u4F18\u67D4\u5BE1\u65AD", "\u56DE\u907F\u51B2\u7A81", "\u81EA\u601C", "\u8BB0\u4EC7"],
    compatibleSigns: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
    luckyNumbers: [4, 6, 13],
    luckyColors: ["Pink", "Blue"],
    luckyColorsChinese: ["\u7C89\u8272", "\u84DD\u8272"],
    bodyPart: "Kidneys/Lower Back",
    bodyPartChinese: "\u80BE\u810F/\u4E0B\u80CC\u90E8",
    decans: ["Venus (Sep 23-Oct 2)", "Uranus (Oct 3-13)", "Mercury (Oct 14-22)"],
    decansChinese: ["\u91D1\u661F\u65EC (9/23-10/2)", "\u5929\u738B\u661F\u65EC (10/3-13)", "\u6C34\u661F\u65EC (10/14-22)"],
    tarotCard: "Justice",
    tarotCardChinese: "\u6B63\u4E49",
    chakra: "Heart",
    chakraChinese: "\u5FC3\u8F6E",
    crystal: "Lapis Lazuli, Opal",
    crystalChinese: "\u9752\u91D1\u77F3\u3001\u86CB\u767D\u77F3",
    mythOrigin: "Scales of Themis, goddess of justice",
    mythOriginChinese: "\u6B63\u4E49\u5973\u795E\u5FD2\u5F25\u65AF\u7684\u5929\u5E73"
  },
  {
    id: "scorpio",
    name: "Scorpio",
    nameChinese: "\u5929\u874E\u5EA7",
    symbol: "\u264F",
    element: "Water",
    elementChinese: "\u6C34",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Pluto/Mars",
    rulingPlanetChinese: "\u51A5\u738B\u661F/\u706B\u661F",
    dateRange: "Oct 23 - Nov 21",
    traits: ["Resourceful", "Brave", "Passionate", "Stubborn", "Strategic"],
    traitsChinese: ["\u8DB3\u667A\u591A\u8C0B", "\u52C7\u6562", "\u70ED\u60C5", "\u56FA\u6267", "\u6709\u7B56\u7565"],
    strengths: ["Resourceful", "Powerful", "Brave", "Passionate", "Stubborn"],
    strengthsChinese: ["\u8DB3\u667A\u591A\u8C0B", "\u5F3A\u5927", "\u52C7\u6562", "\u70ED\u60C5", "\u575A\u5B9A"],
    weaknesses: ["Distrusting", "Jealous", "Secretive", "Violent"],
    weaknessesChinese: ["\u4E0D\u4FE1\u4EFB", "\u5AC9\u5992", "\u795E\u79D8", "\u6781\u7AEF"],
    compatibleSigns: ["Cancer", "Virgo", "Capricorn", "Pisces"],
    luckyNumbers: [8, 11, 18],
    luckyColors: ["Scarlet", "Rust", "Black"],
    luckyColorsChinese: ["\u7329\u7EA2\u8272", "\u94C1\u9508\u8272", "\u9ED1\u8272"],
    bodyPart: "Reproductive System",
    bodyPartChinese: "\u751F\u6B96\u7CFB\u7EDF",
    decans: ["Pluto (Oct 23-Nov 1)", "Neptune (Nov 2-12)", "Moon (Nov 13-21)"],
    decansChinese: ["\u51A5\u738B\u661F\u65EC (10/23-11/1)", "\u6D77\u738B\u661F\u65EC (11/2-12)", "\u6708\u4EAE\u65EC (11/13-21)"],
    tarotCard: "Death",
    tarotCardChinese: "\u6B7B\u795E",
    chakra: "Sacral",
    chakraChinese: "\u8110\u8F6E",
    crystal: "Obsidian, Malachite",
    crystalChinese: "\u9ED1\u66DC\u77F3\u3001\u5B54\u96C0\u77F3",
    mythOrigin: "Scorpion sent by Gaia to slay Orion",
    mythOriginChinese: "\u76D6\u4E9A\u6D3E\u51FA\u730E\u6740\u730E\u6237\u5EA7\u7684\u874E\u5B50"
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    nameChinese: "\u5C04\u624B\u5EA7",
    symbol: "\u2650",
    element: "Fire",
    elementChinese: "\u706B",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Jupiter",
    rulingPlanetChinese: "\u6728\u661F",
    dateRange: "Nov 22 - Dec 21",
    traits: ["Generous", "Idealistic", "Humorous", "Adventurous", "Philosophical"],
    traitsChinese: ["\u6177\u6168", "\u7406\u60F3\u4E3B\u4E49", "\u5E7D\u9ED8", "\u7231\u5192\u9669", "\u54F2\u5B66\u6027"],
    strengths: ["Generous", "Idealistic", "Great sense of humor", "Adventurous"],
    strengthsChinese: ["\u6177\u6168", "\u7406\u60F3\u4E3B\u4E49", "\u5E7D\u9ED8\u611F\u5F3A", "\u7231\u5192\u9669"],
    weaknesses: ["Promises more than can deliver", "Impatient", "Tactless"],
    weaknessesChinese: ["\u627F\u8BFA\u8FC7\u591A", "\u6025\u8E81", "\u76F4\u8A00\u4E0D\u8BB3"],
    compatibleSigns: ["Aries", "Leo", "Libra", "Aquarius"],
    luckyNumbers: [3, 7, 9],
    luckyColors: ["Blue", "Purple"],
    luckyColorsChinese: ["\u84DD\u8272", "\u7D2B\u8272"],
    bodyPart: "Hips/Thighs",
    bodyPartChinese: "\u81C0\u90E8/\u5927\u817F",
    decans: ["Jupiter (Nov 22-Dec 1)", "Mars (Dec 2-12)", "Sun (Dec 13-21)"],
    decansChinese: ["\u6728\u661F\u65EC (11/22-12/1)", "\u706B\u661F\u65EC (12/2-12)", "\u592A\u9633\u65EC (12/13-21)"],
    tarotCard: "Temperance",
    tarotCardChinese: "\u8282\u5236",
    chakra: "Sacral",
    chakraChinese: "\u8110\u8F6E",
    crystal: "Turquoise, Lapis Lazuli",
    crystalChinese: "\u7EFF\u677E\u77F3\u3001\u9752\u91D1\u77F3",
    mythOrigin: "Chiron the centaur",
    mythOriginChinese: "\u534A\u4EBA\u9A6C\u5580\u620E"
  },
  {
    id: "capricorn",
    name: "Capricorn",
    nameChinese: "\u6469\u7FAF\u5EA7",
    symbol: "\u2651",
    element: "Earth",
    elementChinese: "\u571F",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Saturn",
    rulingPlanetChinese: "\u571F\u661F",
    dateRange: "Dec 22 - Jan 19",
    traits: ["Responsible", "Disciplined", "Self-control", "Ambitious", "Patient"],
    traitsChinese: ["\u8D1F\u8D23", "\u81EA\u5F8B", "\u81EA\u63A7", "\u6709\u91CE\u5FC3", "\u8010\u5FC3"],
    strengths: ["Responsible", "Disciplined", "Self-control", "Good managers"],
    strengthsChinese: ["\u8D1F\u8D23", "\u81EA\u5F8B", "\u81EA\u63A7", "\u5584\u4E8E\u7BA1\u7406"],
    weaknesses: ["Know-it-all", "Unforgiving", "Condescending", "Pessimistic"],
    weaknessesChinese: ["\u81EA\u4EE5\u4E3A\u662F", "\u4E0D\u5BBD\u5BB9", "\u5C45\u9AD8\u4E34\u4E0B", "\u60B2\u89C2"],
    compatibleSigns: ["Taurus", "Cancer", "Virgo", "Pisces"],
    luckyNumbers: [4, 8, 13],
    luckyColors: ["Brown", "Black"],
    luckyColorsChinese: ["\u68D5\u8272", "\u9ED1\u8272"],
    bodyPart: "Knees/Bones",
    bodyPartChinese: "\u819D\u76D6/\u9AA8\u9ABC",
    decans: ["Saturn (Dec 22-31)", "Venus (Jan 1-10)", "Mercury (Jan 11-19)"],
    decansChinese: ["\u571F\u661F\u65EC (12/22-31)", "\u91D1\u661F\u65EC (1/1-10)", "\u6C34\u661F\u65EC (1/11-19)"],
    tarotCard: "The Devil",
    tarotCardChinese: "\u6076\u9B54",
    chakra: "Root",
    chakraChinese: "\u6839\u8F6E",
    crystal: "Garnet, Onyx",
    crystalChinese: "\u77F3\u69B4\u77F3\u3001\u7F1F\u739B\u7459",
    mythOrigin: "Sea-goat Pricus",
    mythOriginChinese: "\u6D77\u5C71\u7F8A\u666E\u91CC\u5E93\u65AF"
  },
  {
    id: "aquarius",
    name: "Aquarius",
    nameChinese: "\u6C34\u74F6\u5EA7",
    symbol: "\u2652",
    element: "Air",
    elementChinese: "\u98CE",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Uranus/Saturn",
    rulingPlanetChinese: "\u5929\u738B\u661F/\u571F\u661F",
    dateRange: "Jan 20 - Feb 18",
    traits: ["Progressive", "Original", "Independent", "Humanitarian", "Intellectual"],
    traitsChinese: ["\u8FDB\u6B65", "\u72EC\u521B", "\u72EC\u7ACB", "\u4EBA\u9053\u4E3B\u4E49", "\u77E5\u6027"],
    strengths: ["Progressive", "Original", "Independent", "Humanitarian"],
    strengthsChinese: ["\u8FDB\u6B65", "\u72EC\u521B", "\u72EC\u7ACB", "\u4EBA\u9053\u4E3B\u4E49"],
    weaknesses: ["Runs from emotional expression", "Temperamental", "Uncompromising", "Aloof"],
    weaknessesChinese: ["\u56DE\u907F\u60C5\u611F\u8868\u8FBE", "\u559C\u6012\u65E0\u5E38", "\u4E0D\u59A5\u534F", "\u51B7\u6F20"],
    compatibleSigns: ["Aries", "Gemini", "Libra", "Sagittarius"],
    luckyNumbers: [4, 7, 11],
    luckyColors: ["Light Blue", "Silver"],
    luckyColorsChinese: ["\u6D45\u84DD\u8272", "\u94F6\u8272"],
    bodyPart: "Ankles/Circulatory",
    bodyPartChinese: "\u811A\u8E1D/\u5FAA\u73AF\u7CFB\u7EDF",
    decans: ["Uranus (Jan 20-29)", "Mercury (Jan 30-Feb 8)", "Venus (Feb 9-18)"],
    decansChinese: ["\u5929\u738B\u661F\u65EC (1/20-29)", "\u6C34\u661F\u65EC (1/30-2/8)", "\u91D1\u661F\u65EC (2/9-18)"],
    tarotCard: "The Star",
    tarotCardChinese: "\u661F\u661F",
    chakra: "Third Eye",
    chakraChinese: "\u7709\u5FC3\u8F6E",
    crystal: "Amethyst, Aquamarine",
    crystalChinese: "\u7D2B\u6C34\u6676\u3001\u6D77\u84DD\u5B9D\u77F3",
    mythOrigin: "Ganymede, cupbearer of the gods",
    mythOriginChinese: "\u4F17\u795E\u4F8D\u9152\u8005\u4F3D\u502A\u58A8\u5F97\u65AF"
  },
  {
    id: "pisces",
    name: "Pisces",
    nameChinese: "\u53CC\u9C7C\u5EA7",
    symbol: "\u2653",
    element: "Water",
    elementChinese: "\u6C34",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Neptune/Jupiter",
    rulingPlanetChinese: "\u6D77\u738B\u661F/\u6728\u661F",
    dateRange: "Feb 19 - Mar 20",
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise"],
    traitsChinese: ["\u6709\u540C\u60C5\u5FC3", "\u6709\u827A\u672F\u611F", "\u76F4\u89C9\u5F3A", "\u6E29\u67D4", "\u667A\u6167"],
    strengths: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise", "Musical"],
    strengthsChinese: ["\u6709\u540C\u60C5\u5FC3", "\u6709\u827A\u672F\u611F", "\u76F4\u89C9\u5F3A", "\u6E29\u67D4", "\u667A\u6167", "\u6709\u97F3\u4E50\u5929\u8D4B"],
    weaknesses: ["Fearful", "Overly trusting", "Sad", "Desire to escape reality"],
    weaknessesChinese: ["\u6050\u60E7", "\u8FC7\u4E8E\u4FE1\u4EFB", "\u5FE7\u4F24", "\u9003\u907F\u73B0\u5B9E"],
    compatibleSigns: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
    luckyNumbers: [3, 9, 12],
    luckyColors: ["Mauve", "Lilac", "Sea Green"],
    luckyColorsChinese: ["\u6DE1\u7D2B\u8272", "\u4E01\u9999\u8272", "\u6D77\u7EFF\u8272"],
    bodyPart: "Feet/Immune System",
    bodyPartChinese: "\u811A/\u514D\u75AB\u7CFB\u7EDF",
    decans: ["Neptune (Feb 19-29)", "Moon (Mar 1-10)", "Pluto (Mar 11-20)"],
    decansChinese: ["\u6D77\u738B\u661F\u65EC (2/19-29)", "\u6708\u4EAE\u65EC (3/1-10)", "\u51A5\u738B\u661F\u65EC (3/11-20)"],
    tarotCard: "The Moon",
    tarotCardChinese: "\u6708\u4EAE",
    chakra: "Crown",
    chakraChinese: "\u9876\u8F6E",
    crystal: "Aquamarine, Fluorite",
    crystalChinese: "\u6D77\u84DD\u5B9D\u77F3\u3001\u8424\u77F3",
    mythOrigin: "Aphrodite and Eros as fish",
    mythOriginChinese: "\u5316\u8EAB\u4E3A\u9C7C\u7684\u963F\u8299\u7F57\u72C4\u5FD2\u4E0E\u5384\u6D1B\u65AF"
  }
];
function getZodiacSign(id) {
  return ZODIAC_SIGNS.find((s) => s.id === id);
}
function formatZodiacForDeepPrompt(sign, language) {
  const isEn = language === "en";
  if (isEn) {
    return `=== Zodiac Profile: ${sign.name} (${sign.symbol}) ===
Element: ${sign.element} | Modality: ${sign.modality} | Ruling Planet: ${sign.rulingPlanet}
Date Range: ${sign.dateRange}
Decans: ${sign.decans.join(" \u2192 ")}
Tarot Correspondence: ${sign.tarotCard}
Chakra: ${sign.chakra} | Crystals: ${sign.crystal}
Mythological Origin: ${sign.mythOrigin}
Core Traits: ${sign.traits.join(", ")}
Strengths: ${sign.strengths.join(", ")}
Weaknesses: ${sign.weaknesses.join(", ")}
Compatible Signs: ${sign.compatibleSigns.join(", ")}
Lucky Numbers: ${sign.luckyNumbers.join(", ")}
Lucky Colors: ${sign.luckyColors.join(", ")}
Body Association: ${sign.bodyPart}`;
  }
  return `=== \u661F\u5EA7\u6863\u6848\uFF1A${sign.nameChinese}\uFF08${sign.symbol}\uFF09===
\u5143\u7D20\uFF1A${sign.elementChinese} | \u6A21\u5F0F\uFF1A${sign.modalityChinese} | \u5B88\u62A4\u661F\uFF1A${sign.rulingPlanetChinese}
\u65E5\u671F\u8303\u56F4\uFF1A${sign.dateRange}
\u4E09\u65EC\u5B88\u62A4\uFF1A${sign.decansChinese.join(" \u2192 ")}
\u5854\u7F57\u5BF9\u5E94\uFF1A${sign.tarotCardChinese}
\u8109\u8F6E\uFF1A${sign.chakraChinese} | \u5B88\u62A4\u6C34\u6676\uFF1A${sign.crystalChinese}
\u795E\u8BDD\u8D77\u6E90\uFF1A${sign.mythOriginChinese}
\u6838\u5FC3\u7279\u8D28\uFF1A${sign.traitsChinese.join("\u3001")}
\u4F18\u52BF\uFF1A${sign.strengthsChinese.join("\u3001")}
\u5F31\u70B9\uFF1A${sign.weaknessesChinese.join("\u3001")}
\u76F8\u5408\u661F\u5EA7\uFF1A${sign.compatibleSigns.join("\u3001")}
\u5E78\u8FD0\u6570\u5B57\uFF1A${sign.luckyNumbers.join("\u3001")}
\u5E78\u8FD0\u989C\u8272\uFF1A${sign.luckyColorsChinese.join("\u3001")}
\u8EAB\u4F53\u5173\u8054\uFF1A${sign.bodyPartChinese}`;
}
function getEnhancedPlanetaryContext(date, language) {
  const isEn = language === "en";
  const month = date.getMonth();
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  const zodiacSeasons = [
    "Capricorn",
    "Aquarius",
    "Pisces",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius"
  ];
  const zodiacSeasonsChinese = [
    "\u6469\u7FAF\u5EA7",
    "\u6C34\u74F6\u5EA7",
    "\u53CC\u9C7C\u5EA7",
    "\u767D\u7F8A\u5EA7",
    "\u91D1\u725B\u5EA7",
    "\u53CC\u5B50\u5EA7",
    "\u5DE8\u87F9\u5EA7",
    "\u72EE\u5B50\u5EA7",
    "\u5904\u5973\u5EA7",
    "\u5929\u79E4\u5EA7",
    "\u5929\u874E\u5EA7",
    "\u5C04\u624B\u5EA7"
  ];
  const currentSeason = isEn ? zodiacSeasons[month] : zodiacSeasonsChinese[month];
  const lunarCycle = 29.53;
  const knownNewMoon = new Date(2024, 0, 11).getTime();
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) / (1e3 * 60 * 60 * 24);
  const moonAge = (daysSinceNewMoon % lunarCycle + lunarCycle) % lunarCycle;
  let moonPhase;
  let moonEnergy;
  if (moonAge < 3.69) {
    moonPhase = isEn ? "New Moon" : "\u65B0\u6708";
    moonEnergy = isEn ? "New beginnings, setting intentions" : "\u65B0\u7684\u5F00\u59CB\uFF0C\u8BBE\u5B9A\u610F\u56FE";
  } else if (moonAge < 7.38) {
    moonPhase = isEn ? "Waxing Crescent" : "\u86FE\u7709\u6708";
    moonEnergy = isEn ? "Building momentum, taking action" : "\u79EF\u84C4\u52BF\u80FD\uFF0C\u91C7\u53D6\u884C\u52A8";
  } else if (moonAge < 11.07) {
    moonPhase = isEn ? "First Quarter" : "\u4E0A\u5F26\u6708";
    moonEnergy = isEn ? "Challenges and decisions, commitment" : "\u6311\u6218\u4E0E\u51B3\u7B56\uFF0C\u627F\u8BFA";
  } else if (moonAge < 14.76) {
    moonPhase = isEn ? "Waxing Gibbous" : "\u76C8\u51F8\u6708";
    moonEnergy = isEn ? "Refinement, adjustment, patience" : "\u7CBE\u70BC\u3001\u8C03\u6574\u3001\u8010\u5FC3";
  } else if (moonAge < 18.45) {
    moonPhase = isEn ? "Full Moon" : "\u6EE1\u6708";
    moonEnergy = isEn ? "Culmination, revelation, emotional peak" : "\u9AD8\u6F6E\u3001\u542F\u793A\u3001\u60C5\u611F\u9876\u5CF0";
  } else if (moonAge < 22.14) {
    moonPhase = isEn ? "Waning Gibbous" : "\u4E8F\u51F8\u6708";
    moonEnergy = isEn ? "Gratitude, sharing wisdom, integration" : "\u611F\u6069\u3001\u5206\u4EAB\u667A\u6167\u3001\u6574\u5408";
  } else if (moonAge < 25.83) {
    moonPhase = isEn ? "Last Quarter" : "\u4E0B\u5F26\u6708";
    moonEnergy = isEn ? "Release, forgiveness, letting go" : "\u91CA\u653E\u3001\u5BBD\u6055\u3001\u653E\u4E0B";
  } else {
    moonPhase = isEn ? "Waning Crescent" : "\u6B8B\u6708";
    moonEnergy = isEn ? "Rest, surrender, spiritual reflection" : "\u4F11\u606F\u3001\u81E3\u670D\u3001\u7075\u6027\u53CD\u601D";
  }
  const dayRulers = isEn ? ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] : ["\u592A\u9633", "\u6708\u4EAE", "\u706B\u661F", "\u6C34\u661F", "\u6728\u661F", "\u91D1\u661F", "\u571F\u661F"];
  const dayNames = isEn ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["\u661F\u671F\u65E5", "\u661F\u671F\u4E00", "\u661F\u671F\u4E8C", "\u661F\u671F\u4E09", "\u661F\u671F\u56DB", "\u661F\u671F\u4E94", "\u661F\u671F\u516D"];
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (1e3 * 60 * 60 * 24));
  const sunDegree = dayOfYear / 365.25 * 360;
  const mercurySpeed = 4.09;
  const venusSpeed = 1.6;
  const marsSpeed = 0.524;
  const jupiterSpeed = 0.083;
  const saturnSpeed = 0.034;
  const mercuryRetro = dayOfYear % 116 > 93;
  const venusRetro = dayOfYear % 584 > 543;
  const seasonalEnergy = isEn ? [
    "Winter Solstice energy",
    "Deep winter introspection",
    "Spring awakening",
    "Spring equinox balance",
    "Growth and expansion",
    "Summer building",
    "Summer solstice peak",
    "Harvest preparation",
    "Autumn equinox balance",
    "Harvest and gratitude",
    "Deepening and release",
    "Winter preparation"
  ][month] : [
    "\u51AC\u81F3\u80FD\u91CF",
    "\u6DF1\u51AC\u5185\u7701",
    "\u6625\u5929\u89C9\u9192",
    "\u6625\u5206\u5E73\u8861",
    "\u6210\u957F\u4E0E\u6269\u5C55",
    "\u590F\u5B63\u79EF\u84C4",
    "\u590F\u81F3\u9876\u5CF0",
    "\u4E30\u6536\u51C6\u5907",
    "\u79CB\u5206\u5E73\u8861",
    "\u6536\u83B7\u4E0E\u611F\u6069",
    "\u6DF1\u5316\u4E0E\u91CA\u653E",
    "\u51AC\u5B63\u51C6\u5907"
  ][month];
  if (isEn) {
    return `=== Current Cosmic Context ===
Date: ${date.toISOString().split("T")[0]} (${dayNames[dayOfWeek]})
Sun Position: ${currentSeason} season (${Math.round(sunDegree)}\xB0 ecliptic)
Moon Phase: ${moonPhase} \u2014 ${moonEnergy}
Day Ruler: ${dayRulers[dayOfWeek]}
Seasonal Energy: ${seasonalEnergy}
Mercury: ${mercuryRetro ? "RETROGRADE \u2014 communication/travel disruptions, review past decisions" : "Direct \u2014 clear communication, good for new plans"}
Venus: ${venusRetro ? "RETROGRADE \u2014 relationship reassessment, financial review" : "Direct \u2014 harmonious relationships, creative flow"}
Planetary Day Energy: ${dayRulers[dayOfWeek]} governs today, influencing ${[
      "vitality/identity",
      "emotions/intuition",
      "drive/conflict",
      "communication/intellect",
      "expansion/luck",
      "love/beauty",
      "discipline/structure"
    ][dayOfWeek]}`;
  }
  return `=== \u5F53\u524D\u5B87\u5B99\u80CC\u666F ===
\u65E5\u671F\uFF1A${date.toISOString().split("T")[0]}\uFF08${dayNames[dayOfWeek]}\uFF09
\u592A\u9633\u4F4D\u7F6E\uFF1A${currentSeason}\u5B63\u8282\uFF08\u9EC4\u9053${Math.round(sunDegree)}\xB0\uFF09
\u6708\u76F8\uFF1A${moonPhase} \u2014 ${moonEnergy}
\u65E5\u4E3B\u661F\uFF1A${dayRulers[dayOfWeek]}
\u5B63\u8282\u80FD\u91CF\uFF1A${seasonalEnergy}
\u6C34\u661F\uFF1A${mercuryRetro ? "\u9006\u884C\u4E2D \u2014 \u6C9F\u901A/\u51FA\u884C\u6613\u53D7\u5E72\u6270\uFF0C\u9002\u5408\u56DE\u987E\u8FC7\u53BB\u51B3\u5B9A" : "\u987A\u884C \u2014 \u6C9F\u901A\u987A\u7545\uFF0C\u9002\u5408\u65B0\u8BA1\u5212"}
\u91D1\u661F\uFF1A${venusRetro ? "\u9006\u884C\u4E2D \u2014 \u5173\u7CFB\u91CD\u65B0\u8BC4\u4F30\uFF0C\u8D22\u52A1\u5BA1\u89C6" : "\u987A\u884C \u2014 \u5173\u7CFB\u548C\u8C10\uFF0C\u521B\u9020\u529B\u6D41\u52A8"}
\u884C\u661F\u65E5\u80FD\u91CF\uFF1A${dayRulers[dayOfWeek]}\u4E3B\u5BB0\u4ECA\u65E5\uFF0C\u5F71\u54CD${[
    "\u6D3B\u529B/\u8EAB\u4EFD\u8BA4\u540C",
    "\u60C5\u7EEA/\u76F4\u89C9",
    "\u9A71\u52A8\u529B/\u51B2\u7A81",
    "\u6C9F\u901A/\u667A\u8BC6",
    "\u6269\u5C55/\u5E78\u8FD0",
    "\u7231\u4E0E\u7F8E/\u548C\u8C10",
    "\u7EAA\u5F8B/\u7ED3\u6784"
  ][dayOfWeek]}`;
}
function dailyHoroscopeCacheKey(sign, language) {
  return `${sign.toLowerCase()}::${language}`;
}
var horoscopeRouter = router({
  // Get zodiac sign data
  getSignData: publicProcedure.input(z6.object({ signId: z6.string() })).query(({ input }) => {
    const sign = getZodiacSign(input.signId);
    if (!sign) return null;
    return sign;
  }),
  // Get all signs
  getAllSigns: publicProcedure.query(() => {
    return ZODIAC_SIGNS.map((s) => ({
      id: s.id,
      name: s.name,
      nameChinese: s.nameChinese,
      symbol: s.symbol,
      element: s.element,
      elementChinese: s.elementChinese,
      dateRange: s.dateRange
    }));
  }),
  // Multi-dimension deep daily horoscope
  getDaily: publicProcedure.input(z6.object({
    sign: z6.string(),
    language: z6.enum(["zh", "en"]).optional().default("zh")
  })).query(async ({ input, ctx }) => {
    const { sign, language } = input;
    const isEn = language === "en";
    if (ctx.user?.id) {
      const usage = await getUsageStatus(ctx.user.id, "horoscope");
      if (!usage.canUse) {
        throw new Error("FREE_LIMIT_REACHED");
      }
    }
    const db = await getDb();
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const cacheSignKey = dailyHoroscopeCacheKey(sign, language);
    if (db) {
      const [cached] = await db.select().from(horoscopes).where(and6(
        eq8(horoscopes.zodiacSign, cacheSignKey),
        eq8(horoscopes.periodType, "daily"),
        eq8(horoscopes.periodDate, today)
      )).limit(1);
      if (cached && cached.deepAnalysis) {
        if (ctx.user?.id) {
          await consumeUsage(ctx.user.id, "horoscope");
        }
        return {
          content: cached.content,
          deepAnalysis: cached.deepAnalysis,
          overall: cached.overallScore,
          love: { score: cached.loveScore, advice: "" },
          career: { score: cached.careerScore, advice: "" },
          wealth: { score: cached.wealthScore, advice: "" },
          health: "",
          encouragement: "",
          luckyColor: cached.luckyColor,
          luckyNumber: cached.luckyNumber,
          advice: cached.advice,
          source: "cache",
          degradation: null,
          signData: void 0
        };
      }
    }
    const zodiacSign = getZodiacSign(sign);
    if (!zodiacSign) throw new Error("Invalid zodiac sign");
    const zodiacProfile = formatZodiacForDeepPrompt(zodiacSign, language);
    const planetaryContext = getEnhancedPlanetaryContext(/* @__PURE__ */ new Date(), language);
    const systemPrompt = isEn ? `You are a master astrologer with 30 years of experience combining Western tropical astrology, Hellenistic techniques, and modern psychological astrology. You create deeply insightful, multi-dimensional daily horoscopes that go far beyond generic fortune-telling.

IMPORTANT RULES:
- Base your reading on the zodiac sign's actual astrological properties, decan rulers, and current planetary transits
- Consider the moon phase, day ruler, seasonal energy, and any retrograde influences
- Each section should be substantive (4-8 sentences minimum), not superficial summaries
- Provide specific, actionable advice grounded in astrological symbolism \u2014 not generic platitudes
- Reference the sign's mythological origin, tarot correspondence, and elemental nature where relevant
- Use warm but authoritative language befitting a seasoned astrologer
- Scores should vary meaningfully based on actual planetary influences (not all 70-85)

FORMAT your response with these 10 sections:

## \u{1F30C} Cosmic Energy Overview
Synthesize today's overall energetic signature for this sign in 4-6 sentences. Describe how the current planetary transits, moon phase, and seasonal energy specifically affect this sign. Mention the day ruler's influence and any notable astrological aspects.

## \u{1FA90} Planetary Transit Analysis
For each major planet affecting this sign today, provide specific transit interpretations in 4-6 sentences. How is the Sun's current position interacting with this sign's natal energy? What does Mercury's status (direct/retrograde) mean for communication? How does Venus influence relationships and finances today?

## \u{1F495} Love & Emotional Landscape
Provide a detailed emotional and romantic forecast in 4-6 sentences. How does today's moon phase affect this sign's emotional world? What relationship dynamics are highlighted? Include advice for both singles and those in relationships. Reference the sign's Venus placement and emotional patterns.

## \u{1F4BC} Career & Ambition Compass
Analyze career and professional energy in 4-6 sentences. How do today's transits affect work performance, leadership, and professional relationships? What opportunities or challenges should this sign watch for? Connect to the sign's Mars energy and natural career strengths.

## \u{1F4B0} Wealth & Financial Currents
Discuss financial energy and money matters in 4-6 sentences. Is today favorable for investments, negotiations, or financial planning? How does Jupiter's influence affect abundance? What spending patterns should this sign be aware of?

## \u{1F3E5} Health & Vitality Guidance
Provide health and wellness insights in 4-6 sentences. Based on the sign's body association and today's planetary energy, what physical areas need attention? Suggest specific wellness practices, exercise types, or dietary considerations. Include mental health and stress management tips.

## \u{1F9D8} Spiritual & Inner Growth
Explore spiritual development opportunities in 4-6 sentences. What meditation, mindfulness, or spiritual practices align with today's energy? How can this sign deepen self-awareness? Reference the sign's chakra association and crystal recommendations.

## \u{1F52E} Hidden Challenges & Shadow Work
Reveal potential pitfalls and unconscious patterns in 3-5 sentences. What shadow aspects of this sign might be triggered today? What self-sabotaging patterns should they watch for? How can they transform challenges into growth?

## \u23F0 Timing & Key Moments
Identify optimal timing windows in 3-5 sentences. What hours or periods today are most auspicious for important activities? When should this sign rest or avoid major decisions? Include lucky elements (color, number, direction).

## \u2728 Affirmation & Cosmic Message
Craft 2-3 personalized affirmations drawn from today's astrological energy. End with an inspiring cosmic message that honors this sign's unique journey and current growth phase.

After the 10 sections, also provide these scores and data in a JSON block:
\`\`\`json
{"overallScore": <1-100>, "loveScore": <1-100>, "careerScore": <1-100>, "wealthScore": <1-100>, "healthScore": <1-100>, "luckyColor": "<color>", "luckyNumber": <1-99>, "advice": "<one-line key advice>", "encouragement": "<one-line encouragement>"}
\`\`\`` : `\u4F60\u662F\u4E00\u4F4D\u62E5\u670930\u5E74\u7ECF\u9A8C\u7684\u5360\u661F\u5927\u5E08\uFF0C\u878D\u5408\u897F\u65B9\u70ED\u5E26\u5360\u661F\u672F\u3001\u53E4\u5178\u5E0C\u814A\u5360\u661F\u6280\u6CD5\u548C\u73B0\u4EE3\u5FC3\u7406\u5360\u661F\u5B66\u3002\u4F60\u521B\u4F5C\u6DF1\u5165\u3001\u591A\u7EF4\u5EA6\u7684\u6BCF\u65E5\u661F\u5EA7\u8FD0\u52BF\uFF0C\u8FDC\u8D85\u666E\u901A\u7684\u8FD0\u52BF\u9884\u6D4B\u3002

\u91CD\u8981\u89C4\u5219\uFF1A
- \u57FA\u4E8E\u661F\u5EA7\u7684\u5B9E\u9645\u5360\u661F\u5C5E\u6027\u3001\u65EC\u5B88\u62A4\u661F\u548C\u5F53\u524D\u884C\u661F\u8FC7\u5883\u8FDB\u884C\u89E3\u8BFB
- \u8003\u8651\u6708\u76F8\u3001\u65E5\u4E3B\u661F\u3001\u5B63\u8282\u80FD\u91CF\u548C\u4EFB\u4F55\u9006\u884C\u5F71\u54CD
- \u6BCF\u4E2A\u7EF4\u5EA6\u63D0\u4F9B\u6DF1\u5165\u5206\u6790\uFF084-8\u53E5\u8BDD\u4EE5\u4E0A\uFF09\uFF0C\u800C\u975E\u6D45\u5C42\u603B\u7ED3
- \u63D0\u4F9B\u5177\u4F53\u3001\u53EF\u64CD\u4F5C\u7684\u5EFA\u8BAE\u2014\u2014\u800C\u975E\u6CDB\u6CDB\u4E4B\u8C08
- \u9002\u5F53\u5F15\u7528\u661F\u5EA7\u7684\u795E\u8BDD\u8D77\u6E90\u3001\u5854\u7F57\u5BF9\u5E94\u548C\u5143\u7D20\u672C\u8D28
- \u4F7F\u7528\u6E29\u6696\u4F46\u4E13\u4E1A\u7684\u8BED\u8A00\uFF0C\u4F53\u73B0\u8D44\u6DF1\u5360\u661F\u5E08\u7684\u6743\u5A01\u611F
- \u8BC4\u5206\u5E94\u57FA\u4E8E\u5B9E\u9645\u884C\u661F\u5F71\u54CD\u6709\u610F\u4E49\u5730\u53D8\u5316\uFF08\u4E0D\u8981\u5168\u662F70-85\uFF09

\u683C\u5F0F\u8981\u6C42\uFF08\u5FC5\u987B\u5305\u542B\u4EE5\u4E0B10\u4E2A\u7EF4\u5EA6\uFF09\uFF1A

## \u{1F30C} \u5B87\u5B99\u80FD\u91CF\u6982\u89C8
\u75284-6\u53E5\u8BDD\u7EFC\u5408\u4ECA\u65E5\u5BF9\u8BE5\u661F\u5EA7\u7684\u6574\u4F53\u80FD\u91CF\u7279\u5F81\u3002\u63CF\u8FF0\u5F53\u524D\u884C\u661F\u8FC7\u5883\u3001\u6708\u76F8\u548C\u5B63\u8282\u80FD\u91CF\u5982\u4F55\u5177\u4F53\u5F71\u54CD\u8BE5\u661F\u5EA7\u3002\u63D0\u53CA\u65E5\u4E3B\u661F\u7684\u5F71\u54CD\u548C\u4EFB\u4F55\u503C\u5F97\u6CE8\u610F\u7684\u661F\u8C61\u76F8\u4F4D\u3002

## \u{1FA90} \u884C\u661F\u8F68\u8FF9\u89E3\u6790
\u75284-6\u53E5\u8BDD\u89E3\u8BFB\u5F71\u54CD\u8BE5\u661F\u5EA7\u7684\u4E3B\u8981\u884C\u661F\u8FC7\u5883\u3002\u592A\u9633\u5F53\u524D\u4F4D\u7F6E\u5982\u4F55\u4E0E\u8BE5\u661F\u5EA7\u7684\u672C\u547D\u80FD\u91CF\u4E92\u52A8\uFF1F\u6C34\u661F\u7684\u72B6\u6001\uFF08\u987A\u884C/\u9006\u884C\uFF09\u5BF9\u6C9F\u901A\u610F\u5473\u7740\u4EC0\u4E48\uFF1F\u91D1\u661F\u5982\u4F55\u5F71\u54CD\u4ECA\u65E5\u7684\u5173\u7CFB\u548C\u8D22\u52A1\uFF1F

## \u{1F495} \u7231\u60C5\u4E0E\u60C5\u611F\u6CE2\u52A8
\u75284-6\u53E5\u8BDD\u63D0\u4F9B\u8BE6\u7EC6\u7684\u60C5\u611F\u548C\u604B\u7231\u9884\u6D4B\u3002\u4ECA\u65E5\u6708\u76F8\u5982\u4F55\u5F71\u54CD\u8BE5\u661F\u5EA7\u7684\u60C5\u611F\u4E16\u754C\uFF1F\u54EA\u4E9B\u5173\u7CFB\u52A8\u6001\u88AB\u51F8\u663E\uFF1F\u4E3A\u5355\u8EAB\u548C\u604B\u7231\u4E2D\u7684\u4EBA\u5206\u522B\u63D0\u4F9B\u5EFA\u8BAE\u3002\u5F15\u7528\u8BE5\u661F\u5EA7\u7684\u91D1\u661F\u4F4D\u7F6E\u548C\u60C5\u611F\u6A21\u5F0F\u3002

## \u{1F4BC} \u4E8B\u4E1A\u4E0E\u91CE\u5FC3\u7F57\u76D8
\u75284-6\u53E5\u8BDD\u5206\u6790\u4E8B\u4E1A\u548C\u804C\u4E1A\u80FD\u91CF\u3002\u4ECA\u65E5\u8FC7\u5883\u5982\u4F55\u5F71\u54CD\u5DE5\u4F5C\u8868\u73B0\u3001\u9886\u5BFC\u529B\u548C\u804C\u4E1A\u5173\u7CFB\uFF1F\u8BE5\u661F\u5EA7\u5E94\u6CE8\u610F\u54EA\u4E9B\u673A\u4F1A\u6216\u6311\u6218\uFF1F\u8054\u7CFB\u8BE5\u661F\u5EA7\u7684\u706B\u661F\u80FD\u91CF\u548C\u5929\u7136\u804C\u4E1A\u4F18\u52BF\u3002

## \u{1F4B0} \u8D22\u5BCC\u4E0E\u91D1\u878D\u6697\u6D41
\u75284-6\u53E5\u8BDD\u8BA8\u8BBA\u8D22\u52A1\u80FD\u91CF\u548C\u91D1\u94B1\u4E8B\u52A1\u3002\u4ECA\u65E5\u662F\u5426\u9002\u5408\u6295\u8D44\u3001\u8C08\u5224\u6216\u8D22\u52A1\u89C4\u5212\uFF1F\u6728\u661F\u7684\u5F71\u54CD\u5982\u4F55\u5F71\u54CD\u4E30\u76DB\uFF1F\u8BE5\u661F\u5EA7\u5E94\u6CE8\u610F\u54EA\u4E9B\u6D88\u8D39\u6A21\u5F0F\uFF1F

## \u{1F3E5} \u5065\u5EB7\u4E0E\u6D3B\u529B\u6307\u5F15
\u75284-6\u53E5\u8BDD\u63D0\u4F9B\u5065\u5EB7\u548C\u517B\u751F\u6D1E\u89C1\u3002\u57FA\u4E8E\u8BE5\u661F\u5EA7\u7684\u8EAB\u4F53\u5173\u8054\u548C\u4ECA\u65E5\u884C\u661F\u80FD\u91CF\uFF0C\u54EA\u4E9B\u8EAB\u4F53\u533A\u57DF\u9700\u8981\u5173\u6CE8\uFF1F\u5EFA\u8BAE\u5177\u4F53\u7684\u517B\u751F\u65B9\u6CD5\u3001\u8FD0\u52A8\u7C7B\u578B\u6216\u996E\u98DF\u8003\u8651\u3002\u5305\u62EC\u5FC3\u7406\u5065\u5EB7\u548C\u538B\u529B\u7BA1\u7406\u5EFA\u8BAE\u3002

## \u{1F9D8} \u7075\u6027\u4E0E\u5185\u5728\u6210\u957F
\u75284-6\u53E5\u8BDD\u63A2\u7D22\u7075\u6027\u53D1\u5C55\u673A\u4F1A\u3002\u54EA\u4E9B\u51A5\u60F3\u3001\u6B63\u5FF5\u6216\u7075\u6027\u4FEE\u70BC\u4E0E\u4ECA\u65E5\u80FD\u91CF\u5339\u914D\uFF1F\u8BE5\u661F\u5EA7\u5982\u4F55\u6DF1\u5316\u81EA\u6211\u89C9\u5BDF\uFF1F\u5F15\u7528\u8BE5\u661F\u5EA7\u7684\u8109\u8F6E\u5173\u8054\u548C\u6C34\u6676\u63A8\u8350\u3002

## \u{1F52E} \u6F5C\u5728\u6311\u6218\u4E0E\u9634\u5F71\u5DE5\u4F5C
\u75283-5\u53E5\u8BDD\u63ED\u793A\u6F5C\u5728\u9677\u9631\u548C\u65E0\u610F\u8BC6\u6A21\u5F0F\u3002\u8BE5\u661F\u5EA7\u7684\u54EA\u4E9B\u9634\u5F71\u9762\u53EF\u80FD\u5728\u4ECA\u65E5\u88AB\u89E6\u53D1\uFF1F\u5E94\u8B66\u60D5\u54EA\u4E9B\u81EA\u6211\u7834\u574F\u6A21\u5F0F\uFF1F\u5982\u4F55\u5C06\u6311\u6218\u8F6C\u5316\u4E3A\u6210\u957F\uFF1F

## \u23F0 \u65F6\u673A\u4E0E\u5173\u952E\u65F6\u523B
\u75283-5\u53E5\u8BDD\u8BC6\u522B\u6700\u4F73\u65F6\u673A\u7A97\u53E3\u3002\u4ECA\u65E5\u54EA\u4E9B\u65F6\u6BB5\u6700\u9002\u5408\u91CD\u8981\u6D3B\u52A8\uFF1F\u4F55\u65F6\u5E94\u4F11\u606F\u6216\u907F\u514D\u91CD\u5927\u51B3\u7B56\uFF1F\u5305\u62EC\u5E78\u8FD0\u5143\u7D20\uFF08\u989C\u8272\u3001\u6570\u5B57\u3001\u65B9\u4F4D\uFF09\u3002

## \u2728 \u80AF\u5B9A\u8BED\u4E0E\u5B87\u5B99\u5BC4\u8BED
\u57FA\u4E8E\u4ECA\u65E5\u661F\u8C61\u80FD\u91CF\u5236\u4F5C2-3\u6761\u4E2A\u6027\u5316\u80AF\u5B9A\u8BED\u3002\u4EE5\u9F13\u821E\u4EBA\u5FC3\u7684\u5B87\u5B99\u5BC4\u8BED\u6536\u5C3E\uFF0C\u5C0A\u91CD\u8BE5\u661F\u5EA7\u72EC\u7279\u7684\u65C5\u7A0B\u548C\u5F53\u524D\u6210\u957F\u9636\u6BB5\u3002

\u572810\u4E2A\u7EF4\u5EA6\u4E4B\u540E\uFF0C\u8FD8\u9700\u63D0\u4F9B\u4EE5\u4E0B\u8BC4\u5206\u548C\u6570\u636E\u7684JSON\u5757\uFF1A
\`\`\`json
{"overallScore": <1-100>, "loveScore": <1-100>, "careerScore": <1-100>, "wealthScore": <1-100>, "healthScore": <1-100>, "luckyColor": "<\u989C\u8272>", "luckyNumber": <1-99>, "advice": "<\u4E00\u53E5\u8BDD\u6838\u5FC3\u5EFA\u8BAE>", "encouragement": "<\u4E00\u53E5\u8BDD\u9F13\u52B1>"}
\`\`\``;
    const userPrompt = isEn ? `Generate today's multi-dimensional deep horoscope for ${zodiacSign.name}.

${zodiacProfile}

${planetaryContext}

Please provide a professional, in-depth astrological analysis with all 10 dimensions followed by the JSON scores block.` : `\u751F\u6210${zodiacSign.nameChinese}\u4ECA\u65E5\u591A\u7EF4\u5EA6\u6DF1\u5EA6\u8FD0\u52BF\u3002

${zodiacProfile}

${planetaryContext}

\u8BF7\u63D0\u4F9B\u4E13\u4E1A\u3001\u6DF1\u5165\u7684\u5360\u661F\u5206\u6790\uFF0C\u5305\u542B\u5168\u90E810\u4E2A\u7EF4\u5EA6\uFF0C\u6700\u540E\u9644\u4E0AJSON\u8BC4\u5206\u5757\u3002`;
    const response = await invokeLLM({
      language,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    const rawContentRaw = response.choices[0]?.message?.content || "";
    const rawContent = typeof rawContentRaw === "string" ? rawContentRaw : "";
    if (response.degradation) {
      return {
        content: response.degradation.message,
        deepAnalysis: response.degradation.message,
        overall: 0,
        love: { score: 0, advice: "" },
        career: { score: 0, advice: "" },
        wealth: { score: 0, advice: "" },
        health: "",
        encouragement: "",
        luckyColor: null,
        luckyNumber: null,
        advice: response.degradation.message,
        source: "daily_limit",
        degradation: response.degradation,
        signData: {
          name: zodiacSign.name,
          nameChinese: zodiacSign.nameChinese,
          symbol: zodiacSign.symbol,
          element: zodiacSign.element,
          elementChinese: zodiacSign.elementChinese,
          rulingPlanet: zodiacSign.rulingPlanet,
          rulingPlanetChinese: zodiacSign.rulingPlanetChinese
        }
      };
    }
    if (ctx.user?.id) {
      await consumeUsage(ctx.user.id, "horoscope");
    }
    let scores = {
      overallScore: 75,
      loveScore: 70,
      careerScore: 80,
      wealthScore: 65,
      healthScore: 75,
      luckyColor: isEn ? "Blue" : "\u84DD\u8272",
      luckyNumber: 7,
      advice: isEn ? "Trust the cosmic flow today." : "\u4ECA\u65E5\u4FE1\u4EFB\u5B87\u5B99\u7684\u6D41\u52A8\u3002",
      encouragement: isEn ? "Every step forward is progress." : "\u6BCF\u4E00\u6B65\u524D\u884C\u90FD\u662F\u8FDB\u6B65\u3002"
    };
    try {
      const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        scores = { ...scores, ...parsed };
      }
    } catch {
    }
    const deepAnalysis = rawContent.replace(/```json[\s\S]*?```/g, "").trim();
    if (db) {
      await db.insert(horoscopes).values({
        zodiacSign: cacheSignKey,
        periodType: "daily",
        periodDate: today,
        overallScore: scores.overallScore,
        loveScore: scores.loveScore,
        careerScore: scores.careerScore,
        wealthScore: scores.wealthScore,
        healthScore: scores.healthScore,
        content: scores.advice,
        deepAnalysis,
        advice: scores.advice,
        luckyColor: scores.luckyColor,
        luckyNumber: scores.luckyNumber
      });
      if (ctx.user?.id) {
        const [existingGrowth] = await db.select().from(userGrowth).where(eq8(userGrowth.userId, ctx.user.id)).limit(1);
        if (existingGrowth) {
          await db.update(userGrowth).set({
            spiritualGrowth: sql5`${userGrowth.spiritualGrowth} + 1`,
            totalPoints: sql5`${userGrowth.totalPoints} + 2`
          }).where(eq8(userGrowth.userId, ctx.user.id));
        }
      }
    }
    return {
      content: scores.advice,
      deepAnalysis,
      overall: scores.overallScore,
      love: { score: scores.loveScore, advice: "" },
      career: { score: scores.careerScore, advice: "" },
      wealth: { score: scores.wealthScore, advice: "" },
      health: "",
      encouragement: scores.encouragement,
      luckyColor: scores.luckyColor,
      luckyNumber: scores.luckyNumber,
      advice: scores.advice,
      source: "ai",
      degradation: null,
      signData: {
        name: zodiacSign.name,
        nameChinese: zodiacSign.nameChinese,
        symbol: zodiacSign.symbol,
        element: zodiacSign.element,
        elementChinese: zodiacSign.elementChinese,
        rulingPlanet: zodiacSign.rulingPlanet,
        rulingPlanetChinese: zodiacSign.rulingPlanetChinese
      }
    };
  })
});

// server/routers/dream.ts
import { z as z7 } from "zod";
init_db();
init_schema();
import { eq as eq9, desc as desc7, and as and7, sql as sql6 } from "drizzle-orm";
import { nanoid as nanoid4 } from "nanoid";

// server/dream-symbols.ts
var DREAM_SYMBOLS = [
  // === NATURE & ELEMENTS ===
  {
    id: "water",
    name: "Water",
    nameChinese: "\u6C34",
    category: "Nature",
    categoryChinese: "\u81EA\u7136",
    jungianArchetype: "The Unconscious",
    element: "Water",
    meaningPositive: "Emotional depth, purification, renewal, flow of life, spiritual cleansing",
    meaningNegative: "Overwhelming emotions, feeling out of control, fear of the unknown depths",
    meaningPositiveChinese: "\u60C5\u611F\u6DF1\u5EA6\u3001\u51C0\u5316\u3001\u66F4\u65B0\u3001\u751F\u547D\u4E4B\u6D41\u3001\u7CBE\u795E\u6D01\u51C0",
    meaningNegativeChinese: "\u60C5\u7EEA\u5931\u63A7\u3001\u611F\u5230\u65E0\u6CD5\u638C\u63A7\u3001\u5BF9\u672A\u77E5\u6DF1\u5904\u7684\u6050\u60E7",
    psychologicalInsight: "Water represents the unconscious mind. Its state (calm, turbulent, clear, murky) mirrors your emotional landscape.",
    psychologicalInsightChinese: "\u6C34\u4EE3\u8868\u6F5C\u610F\u8BC6\u3002\u5B83\u7684\u72B6\u6001\uFF08\u5E73\u9759\u3001\u6E4D\u6025\u3001\u6E05\u6F88\u3001\u6D51\u6D4A\uFF09\u6620\u5C04\u7740\u4F60\u7684\u60C5\u611F\u72B6\u6001\u3002",
    relatedEmotions: ["peace", "anxiety", "renewal", "fear"],
    relatedEmotionsChinese: ["\u5E73\u9759", "\u7126\u8651", "\u66F4\u65B0", "\u6050\u60E7"]
  },
  {
    id: "fire",
    name: "Fire",
    nameChinese: "\u706B",
    category: "Nature",
    categoryChinese: "\u81EA\u7136",
    jungianArchetype: "Transformation",
    element: "Fire",
    meaningPositive: "Passion, transformation, enlightenment, creative energy, purification",
    meaningNegative: "Anger, destruction, loss of control, burnout, consuming desires",
    meaningPositiveChinese: "\u6FC0\u60C5\u3001\u8F6C\u53D8\u3001\u542F\u8FEA\u3001\u521B\u9020\u529B\u3001\u51C0\u5316",
    meaningNegativeChinese: "\u6124\u6012\u3001\u6BC1\u706D\u3001\u5931\u63A7\u3001\u5026\u6020\u3001\u541E\u566C\u6027\u7684\u6B32\u671B",
    psychologicalInsight: "Fire symbolizes transformation and passion. It can represent both creative drive and destructive anger.",
    psychologicalInsightChinese: "\u706B\u8C61\u5F81\u7740\u8F6C\u53D8\u548C\u6FC0\u60C5\u3002\u5B83\u65E2\u53EF\u4EE5\u4EE3\u8868\u521B\u9020\u6027\u7684\u9A71\u52A8\u529B\uFF0C\u4E5F\u53EF\u4EE5\u4EE3\u8868\u6BC1\u706D\u6027\u7684\u6124\u6012\u3002",
    relatedEmotions: ["passion", "anger", "excitement", "fear"],
    relatedEmotionsChinese: ["\u6FC0\u60C5", "\u6124\u6012", "\u5174\u594B", "\u6050\u60E7"]
  },
  {
    id: "mountain",
    name: "Mountain",
    nameChinese: "\u5C71",
    category: "Nature",
    categoryChinese: "\u81EA\u7136",
    jungianArchetype: "The Self",
    element: "Earth",
    meaningPositive: "Achievement, spiritual ascent, overcoming obstacles, higher perspective",
    meaningNegative: "Insurmountable obstacles, isolation, feeling overwhelmed by challenges",
    meaningPositiveChinese: "\u6210\u5C31\u3001\u7CBE\u795E\u5347\u534E\u3001\u514B\u670D\u969C\u788D\u3001\u66F4\u9AD8\u7684\u89C6\u89D2",
    meaningNegativeChinese: "\u4E0D\u53EF\u903E\u8D8A\u7684\u969C\u788D\u3001\u5B64\u7ACB\u3001\u88AB\u6311\u6218\u538B\u5012",
    psychologicalInsight: "Mountains represent life goals and spiritual aspirations. Climbing suggests personal growth; being blocked suggests inner resistance.",
    psychologicalInsightChinese: "\u5C71\u4EE3\u8868\u4EBA\u751F\u76EE\u6807\u548C\u7CBE\u795E\u8FFD\u6C42\u3002\u6500\u767B\u6697\u793A\u4E2A\u4EBA\u6210\u957F\uFF1B\u88AB\u963B\u6321\u6697\u793A\u5185\u5FC3\u7684\u6297\u62D2\u3002",
    relatedEmotions: ["determination", "awe", "frustration", "achievement"],
    relatedEmotionsChinese: ["\u51B3\u5FC3", "\u656C\u754F", "\u632B\u6298", "\u6210\u5C31"]
  },
  {
    id: "forest",
    name: "Forest",
    nameChinese: "\u68EE\u6797",
    category: "Nature",
    categoryChinese: "\u81EA\u7136",
    jungianArchetype: "The Unconscious",
    element: "Wood",
    meaningPositive: "Growth, natural wisdom, exploration of the self, fertility, abundance",
    meaningNegative: "Being lost, confusion, hidden dangers, fear of the unknown",
    meaningPositiveChinese: "\u6210\u957F\u3001\u81EA\u7136\u667A\u6167\u3001\u81EA\u6211\u63A2\u7D22\u3001\u4E30\u9976\u3001\u5BCC\u8DB3",
    meaningNegativeChinese: "\u8FF7\u5931\u3001\u56F0\u60D1\u3001\u9690\u85CF\u7684\u5371\u9669\u3001\u5BF9\u672A\u77E5\u7684\u6050\u60E7",
    psychologicalInsight: "Forests represent the deeper layers of the psyche. Getting lost in a forest suggests confusion about life direction.",
    psychologicalInsightChinese: "\u68EE\u6797\u4EE3\u8868\u5FC3\u7075\u7684\u6DF1\u5C42\u3002\u5728\u68EE\u6797\u4E2D\u8FF7\u8DEF\u6697\u793A\u5BF9\u4EBA\u751F\u65B9\u5411\u7684\u56F0\u60D1\u3002",
    relatedEmotions: ["wonder", "fear", "peace", "confusion"],
    relatedEmotionsChinese: ["\u60CA\u5947", "\u6050\u60E7", "\u5E73\u9759", "\u56F0\u60D1"]
  },
  {
    id: "sky",
    name: "Sky",
    nameChinese: "\u5929\u7A7A",
    category: "Nature",
    categoryChinese: "\u81EA\u7136",
    element: "Air",
    meaningPositive: "Freedom, infinite possibilities, spiritual connection, clarity of thought",
    meaningNegative: "Feeling ungrounded, unrealistic expectations, emptiness",
    meaningPositiveChinese: "\u81EA\u7531\u3001\u65E0\u9650\u53EF\u80FD\u3001\u7CBE\u795E\u8FDE\u63A5\u3001\u601D\u7EF4\u6E05\u6670",
    meaningNegativeChinese: "\u7F3A\u4E4F\u6839\u57FA\u3001\u4E0D\u5207\u5B9E\u9645\u7684\u671F\u671B\u3001\u7A7A\u865A",
    psychologicalInsight: "The sky represents consciousness and aspiration. A clear sky suggests mental clarity; a stormy sky reflects inner turmoil.",
    psychologicalInsightChinese: "\u5929\u7A7A\u4EE3\u8868\u610F\u8BC6\u548C\u62B1\u8D1F\u3002\u6674\u6717\u7684\u5929\u7A7A\u6697\u793A\u5FC3\u7075\u6E05\u660E\uFF1B\u66B4\u98CE\u96E8\u7684\u5929\u7A7A\u53CD\u6620\u5185\u5FC3\u7684\u52A8\u8361\u3002",
    relatedEmotions: ["freedom", "hope", "loneliness", "inspiration"],
    relatedEmotionsChinese: ["\u81EA\u7531", "\u5E0C\u671B", "\u5B64\u72EC", "\u7075\u611F"]
  },
  // === ANIMALS ===
  {
    id: "snake",
    name: "Snake",
    nameChinese: "\u86C7",
    category: "Animals",
    categoryChinese: "\u52A8\u7269",
    jungianArchetype: "Shadow/Transformation",
    meaningPositive: "Transformation, healing, wisdom, kundalini energy, rebirth",
    meaningNegative: "Hidden threats, betrayal, temptation, fear of change",
    meaningPositiveChinese: "\u8F6C\u53D8\u3001\u7597\u6108\u3001\u667A\u6167\u3001\u6606\u8FBE\u91CC\u5C3C\u80FD\u91CF\u3001\u91CD\u751F",
    meaningNegativeChinese: "\u9690\u85CF\u7684\u5A01\u80C1\u3001\u80CC\u53DB\u3001\u8BF1\u60D1\u3001\u5BF9\u53D8\u5316\u7684\u6050\u60E7",
    psychologicalInsight: "Snakes are one of the most powerful dream symbols, representing the primal life force and transformation. They often appear during major life transitions.",
    psychologicalInsightChinese: "\u86C7\u662F\u6700\u6709\u529B\u7684\u68A6\u5883\u7B26\u53F7\u4E4B\u4E00\uFF0C\u4EE3\u8868\u539F\u59CB\u751F\u547D\u529B\u548C\u8F6C\u53D8\u3002\u5B83\u4EEC\u5E38\u5728\u91CD\u5927\u4EBA\u751F\u8F6C\u6298\u671F\u51FA\u73B0\u3002",
    relatedEmotions: ["fear", "fascination", "anxiety", "power"],
    relatedEmotionsChinese: ["\u6050\u60E7", "\u7740\u8FF7", "\u7126\u8651", "\u529B\u91CF"]
  },
  {
    id: "bird",
    name: "Bird",
    nameChinese: "\u9E1F",
    category: "Animals",
    categoryChinese: "\u52A8\u7269",
    jungianArchetype: "Spirit/Freedom",
    meaningPositive: "Freedom, spiritual ascent, perspective, messages from the unconscious",
    meaningNegative: "Escapism, feeling caged, unreachable goals",
    meaningPositiveChinese: "\u81EA\u7531\u3001\u7CBE\u795E\u5347\u534E\u3001\u89C6\u89D2\u3001\u6765\u81EA\u6F5C\u610F\u8BC6\u7684\u4FE1\u606F",
    meaningNegativeChinese: "\u9003\u907F\u73B0\u5B9E\u3001\u611F\u5230\u88AB\u56F0\u3001\u9065\u4E0D\u53EF\u53CA\u7684\u76EE\u6807",
    psychologicalInsight: "Birds represent thoughts and spiritual aspirations. Flying birds suggest liberation; caged birds suggest feeling trapped.",
    psychologicalInsightChinese: "\u9E1F\u4EE3\u8868\u601D\u60F3\u548C\u7CBE\u795E\u8FFD\u6C42\u3002\u98DE\u7FD4\u7684\u9E1F\u6697\u793A\u89E3\u653E\uFF1B\u7B3C\u4E2D\u9E1F\u6697\u793A\u611F\u5230\u88AB\u56F0\u3002",
    relatedEmotions: ["freedom", "joy", "longing", "hope"],
    relatedEmotionsChinese: ["\u81EA\u7531", "\u559C\u60A6", "\u6E34\u671B", "\u5E0C\u671B"]
  },
  {
    id: "dog",
    name: "Dog",
    nameChinese: "\u72D7",
    category: "Animals",
    categoryChinese: "\u52A8\u7269",
    meaningPositive: "Loyalty, friendship, protection, unconditional love, trust",
    meaningNegative: "Aggression, feeling threatened, betrayal by a trusted person",
    meaningPositiveChinese: "\u5FE0\u8BDA\u3001\u53CB\u8C0A\u3001\u4FDD\u62A4\u3001\u65E0\u6761\u4EF6\u7684\u7231\u3001\u4FE1\u4EFB",
    meaningNegativeChinese: "\u653B\u51FB\u6027\u3001\u611F\u5230\u5A01\u80C1\u3001\u88AB\u4FE1\u4EFB\u7684\u4EBA\u80CC\u53DB",
    psychologicalInsight: "Dogs represent loyalty and instinct. A friendly dog suggests trustworthy relationships; an aggressive dog may indicate trust issues.",
    psychologicalInsightChinese: "\u72D7\u4EE3\u8868\u5FE0\u8BDA\u548C\u672C\u80FD\u3002\u53CB\u597D\u7684\u72D7\u6697\u793A\u503C\u5F97\u4FE1\u8D56\u7684\u5173\u7CFB\uFF1B\u653B\u51FB\u6027\u7684\u72D7\u53EF\u80FD\u6697\u793A\u4FE1\u4EFB\u95EE\u9898\u3002",
    relatedEmotions: ["trust", "love", "fear", "companionship"],
    relatedEmotionsChinese: ["\u4FE1\u4EFB", "\u7231", "\u6050\u60E7", "\u966A\u4F34"]
  },
  {
    id: "cat",
    name: "Cat",
    nameChinese: "\u732B",
    category: "Animals",
    categoryChinese: "\u52A8\u7269",
    jungianArchetype: "Anima/Feminine",
    meaningPositive: "Independence, intuition, feminine power, mystery, sensuality",
    meaningNegative: "Deception, hidden enemies, misfortune, untrustworthiness",
    meaningPositiveChinese: "\u72EC\u7ACB\u3001\u76F4\u89C9\u3001\u5973\u6027\u529B\u91CF\u3001\u795E\u79D8\u3001\u611F\u6027",
    meaningNegativeChinese: "\u6B3A\u9A97\u3001\u9690\u85CF\u7684\u654C\u4EBA\u3001\u4E0D\u5E78\u3001\u4E0D\u53EF\u4FE1\u8D56",
    psychologicalInsight: "Cats represent the feminine aspect of the psyche and intuition. They often appear when you need to trust your instincts more.",
    psychologicalInsightChinese: "\u732B\u4EE3\u8868\u5FC3\u7075\u7684\u5973\u6027\u9762\u548C\u76F4\u89C9\u3002\u5B83\u4EEC\u5E38\u5728\u4F60\u9700\u8981\u66F4\u4FE1\u4EFB\u81EA\u5DF1\u76F4\u89C9\u65F6\u51FA\u73B0\u3002",
    relatedEmotions: ["curiosity", "independence", "mystery", "comfort"],
    relatedEmotionsChinese: ["\u597D\u5947", "\u72EC\u7ACB", "\u795E\u79D8", "\u8212\u9002"]
  },
  {
    id: "fish",
    name: "Fish",
    nameChinese: "\u9C7C",
    category: "Animals",
    categoryChinese: "\u52A8\u7269",
    element: "Water",
    meaningPositive: "Abundance, fertility, spiritual nourishment, insights from the unconscious",
    meaningNegative: "Slippery situations, emotional coldness, feeling out of your element",
    meaningPositiveChinese: "\u4E30\u9976\u3001\u751F\u80B2\u3001\u7CBE\u795E\u6ECB\u517B\u3001\u6765\u81EA\u6F5C\u610F\u8BC6\u7684\u6D1E\u5BDF",
    meaningNegativeChinese: "\u68D8\u624B\u7684\u60C5\u51B5\u3001\u60C5\u611F\u51B7\u6F20\u3001\u611F\u5230\u683C\u683C\u4E0D\u5165",
    psychologicalInsight: "Fish represent content from the unconscious mind rising to the surface. Catching a fish suggests gaining insight.",
    psychologicalInsightChinese: "\u9C7C\u4EE3\u8868\u6F5C\u610F\u8BC6\u5185\u5BB9\u6D6E\u51FA\u6C34\u9762\u3002\u6355\u5230\u9C7C\u6697\u793A\u83B7\u5F97\u6D1E\u5BDF\u3002",
    relatedEmotions: ["abundance", "peace", "surprise", "nourishment"],
    relatedEmotionsChinese: ["\u4E30\u9976", "\u5E73\u9759", "\u60CA\u559C", "\u6ECB\u517B"]
  },
  {
    id: "dragon",
    name: "Dragon",
    nameChinese: "\u9F99",
    category: "Animals",
    categoryChinese: "\u52A8\u7269",
    jungianArchetype: "The Self/Power",
    meaningPositive: "Power, wisdom, good fortune, spiritual strength, imperial authority",
    meaningNegative: "Overwhelming power, fear of authority, inner demons",
    meaningPositiveChinese: "\u529B\u91CF\u3001\u667A\u6167\u3001\u597D\u8FD0\u3001\u7CBE\u795E\u529B\u91CF\u3001\u5E1D\u738B\u6743\u5A01",
    meaningNegativeChinese: "\u538B\u5012\u6027\u7684\u529B\u91CF\u3001\u5BF9\u6743\u5A01\u7684\u6050\u60E7\u3001\u5185\u5FC3\u7684\u9B54\u9B3C",
    psychologicalInsight: "In Chinese culture, dragons are supreme symbols of power and good fortune. Dreaming of dragons often indicates a period of great potential.",
    psychologicalInsightChinese: "\u5728\u4E2D\u56FD\u6587\u5316\u4E2D\uFF0C\u9F99\u662F\u529B\u91CF\u548C\u597D\u8FD0\u7684\u81F3\u9AD8\u8C61\u5F81\u3002\u68A6\u89C1\u9F99\u901A\u5E38\u9884\u793A\u7740\u5DE8\u5927\u6F5C\u529B\u7684\u65F6\u671F\u3002",
    relatedEmotions: ["awe", "power", "fear", "reverence"],
    relatedEmotionsChinese: ["\u656C\u754F", "\u529B\u91CF", "\u6050\u60E7", "\u5D07\u656C"]
  },
  // === ACTIONS & SCENARIOS ===
  {
    id: "flying",
    name: "Flying",
    nameChinese: "\u98DE\u7FD4",
    category: "Actions",
    categoryChinese: "\u52A8\u4F5C",
    jungianArchetype: "Transcendence",
    meaningPositive: "Freedom, transcendence, rising above problems, spiritual elevation",
    meaningNegative: "Escapism, fear of falling, losing touch with reality",
    meaningPositiveChinese: "\u81EA\u7531\u3001\u8D85\u8D8A\u3001\u8D85\u8D8A\u95EE\u9898\u3001\u7CBE\u795E\u5347\u534E",
    meaningNegativeChinese: "\u9003\u907F\u73B0\u5B9E\u3001\u5BB3\u6015\u5760\u843D\u3001\u8131\u79BB\u73B0\u5B9E",
    psychologicalInsight: "Flying dreams are among the most common and exhilarating. They typically reflect a desire for freedom or a sense of empowerment in waking life.",
    psychologicalInsightChinese: "\u98DE\u7FD4\u68A6\u662F\u6700\u5E38\u89C1\u4E14\u4EE4\u4EBA\u5174\u594B\u7684\u68A6\u4E4B\u4E00\u3002\u5B83\u4EEC\u901A\u5E38\u53CD\u6620\u5BF9\u81EA\u7531\u7684\u6E34\u671B\u6216\u73B0\u5B9E\u751F\u6D3B\u4E2D\u7684\u8D4B\u6743\u611F\u3002",
    relatedEmotions: ["freedom", "joy", "fear", "exhilaration"],
    relatedEmotionsChinese: ["\u81EA\u7531", "\u559C\u60A6", "\u6050\u60E7", "\u5174\u594B"]
  },
  {
    id: "falling",
    name: "Falling",
    nameChinese: "\u5760\u843D",
    category: "Actions",
    categoryChinese: "\u52A8\u4F5C",
    meaningPositive: "Letting go, surrender, trust in the process, release of control",
    meaningNegative: "Loss of control, anxiety, failure, insecurity, lack of support",
    meaningPositiveChinese: "\u653E\u624B\u3001\u81E3\u670D\u3001\u4FE1\u4EFB\u8FC7\u7A0B\u3001\u91CA\u653E\u63A7\u5236",
    meaningNegativeChinese: "\u5931\u63A7\u3001\u7126\u8651\u3001\u5931\u8D25\u3001\u4E0D\u5B89\u5168\u611F\u3001\u7F3A\u4E4F\u652F\u6301",
    psychologicalInsight: "Falling dreams often occur during times of stress or when you feel unsupported. They reflect anxiety about losing control in some area of life.",
    psychologicalInsightChinese: "\u5760\u843D\u68A6\u5E38\u5728\u538B\u529B\u5927\u6216\u611F\u5230\u7F3A\u4E4F\u652F\u6301\u65F6\u51FA\u73B0\u3002\u5B83\u4EEC\u53CD\u6620\u5BF9\u751F\u6D3B\u67D0\u4E2A\u9886\u57DF\u5931\u63A7\u7684\u7126\u8651\u3002",
    relatedEmotions: ["anxiety", "fear", "helplessness", "vulnerability"],
    relatedEmotionsChinese: ["\u7126\u8651", "\u6050\u60E7", "\u65E0\u52A9", "\u8106\u5F31"]
  },
  {
    id: "chasing",
    name: "Being Chased",
    nameChinese: "\u88AB\u8FFD\u8D76",
    category: "Actions",
    categoryChinese: "\u52A8\u4F5C",
    jungianArchetype: "Shadow",
    meaningPositive: "Motivation to confront issues, energy for change, awareness of avoidance",
    meaningNegative: "Avoidance, running from problems, anxiety, unresolved fears",
    meaningPositiveChinese: "\u9762\u5BF9\u95EE\u9898\u7684\u52A8\u529B\u3001\u6539\u53D8\u7684\u80FD\u91CF\u3001\u5BF9\u9003\u907F\u7684\u89C9\u5BDF",
    meaningNegativeChinese: "\u9003\u907F\u3001\u9003\u907F\u95EE\u9898\u3001\u7126\u8651\u3001\u672A\u89E3\u51B3\u7684\u6050\u60E7",
    psychologicalInsight: "Being chased is the most common nightmare theme. The pursuer often represents an aspect of yourself or a situation you are avoiding.",
    psychologicalInsightChinese: "\u88AB\u8FFD\u8D76\u662F\u6700\u5E38\u89C1\u7684\u5669\u68A6\u4E3B\u9898\u3002\u8FFD\u8D76\u8005\u901A\u5E38\u4EE3\u8868\u4F60\u81EA\u8EAB\u7684\u67D0\u4E2A\u65B9\u9762\u6216\u4F60\u6B63\u5728\u9003\u907F\u7684\u60C5\u51B5\u3002",
    relatedEmotions: ["fear", "anxiety", "panic", "urgency"],
    relatedEmotionsChinese: ["\u6050\u60E7", "\u7126\u8651", "\u6050\u614C", "\u7D27\u8FEB"]
  },
  {
    id: "teeth_falling",
    name: "Teeth Falling Out",
    nameChinese: "\u6389\u7259",
    category: "Actions",
    categoryChinese: "\u52A8\u4F5C",
    meaningPositive: "Personal growth, transition, shedding old identity, renewal",
    meaningNegative: "Anxiety about appearance, fear of aging, loss of power, embarrassment",
    meaningPositiveChinese: "\u4E2A\u4EBA\u6210\u957F\u3001\u8FC7\u6E21\u3001\u8715\u53BB\u65E7\u8EAB\u4EFD\u3001\u66F4\u65B0",
    meaningNegativeChinese: "\u5BF9\u5916\u8868\u7684\u7126\u8651\u3001\u5BF9\u8870\u8001\u7684\u6050\u60E7\u3001\u5931\u53BB\u529B\u91CF\u3001\u5C34\u5C2C",
    psychologicalInsight: "Teeth dreams are extremely common and often relate to anxiety about self-image, communication, or a sense of powerlessness.",
    psychologicalInsightChinese: "\u6389\u7259\u68A6\u6781\u4E3A\u5E38\u89C1\uFF0C\u901A\u5E38\u4E0E\u5BF9\u81EA\u6211\u5F62\u8C61\u3001\u6C9F\u901A\u80FD\u529B\u6216\u65E0\u529B\u611F\u7684\u7126\u8651\u6709\u5173\u3002",
    relatedEmotions: ["anxiety", "embarrassment", "vulnerability", "aging"],
    relatedEmotionsChinese: ["\u7126\u8651", "\u5C34\u5C2C", "\u8106\u5F31", "\u8870\u8001"]
  },
  {
    id: "exam",
    name: "Taking an Exam",
    nameChinese: "\u8003\u8BD5",
    category: "Actions",
    categoryChinese: "\u52A8\u4F5C",
    meaningPositive: "Self-evaluation, readiness for challenges, desire for achievement",
    meaningNegative: "Fear of failure, feeling unprepared, performance anxiety, self-doubt",
    meaningPositiveChinese: "\u81EA\u6211\u8BC4\u4F30\u3001\u8FCE\u63A5\u6311\u6218\u7684\u51C6\u5907\u3001\u5BF9\u6210\u5C31\u7684\u6E34\u671B",
    meaningNegativeChinese: "\u5BB3\u6015\u5931\u8D25\u3001\u611F\u5230\u51C6\u5907\u4E0D\u8DB3\u3001\u8868\u73B0\u7126\u8651\u3001\u81EA\u6211\u6000\u7591",
    psychologicalInsight: "Exam dreams often occur when you feel judged or tested in waking life. They reflect concerns about measuring up to expectations.",
    psychologicalInsightChinese: "\u8003\u8BD5\u68A6\u5E38\u5728\u4F60\u611F\u5230\u88AB\u8BC4\u5224\u6216\u8003\u9A8C\u65F6\u51FA\u73B0\u3002\u5B83\u4EEC\u53CD\u6620\u5BF9\u662F\u5426\u8FBE\u5230\u671F\u671B\u7684\u62C5\u5FE7\u3002",
    relatedEmotions: ["anxiety", "stress", "inadequacy", "pressure"],
    relatedEmotionsChinese: ["\u7126\u8651", "\u538B\u529B", "\u4E0D\u8DB3\u611F", "\u538B\u8FEB"]
  },
  {
    id: "naked",
    name: "Being Naked in Public",
    nameChinese: "\u5F53\u4F17\u88F8\u4F53",
    category: "Actions",
    categoryChinese: "\u52A8\u4F5C",
    jungianArchetype: "Persona",
    meaningPositive: "Authenticity, vulnerability as strength, shedding pretenses",
    meaningNegative: "Vulnerability, shame, fear of exposure, feeling unprepared",
    meaningPositiveChinese: "\u771F\u5B9E\u3001\u8106\u5F31\u5373\u529B\u91CF\u3001\u653E\u4E0B\u4F2A\u88C5",
    meaningNegativeChinese: "\u8106\u5F31\u3001\u7F9E\u803B\u3001\u5BB3\u6015\u88AB\u63ED\u9732\u3001\u611F\u5230\u51C6\u5907\u4E0D\u8DB3",
    psychologicalInsight: "Nakedness dreams reflect concerns about how others perceive you. They often appear when you feel exposed or fear being judged.",
    psychologicalInsightChinese: "\u88F8\u4F53\u68A6\u53CD\u6620\u5BF9\u4ED6\u4EBA\u5982\u4F55\u770B\u5F85\u4F60\u7684\u62C5\u5FE7\u3002\u5B83\u4EEC\u5E38\u5728\u4F60\u611F\u5230\u66B4\u9732\u6216\u5BB3\u6015\u88AB\u8BC4\u5224\u65F6\u51FA\u73B0\u3002",
    relatedEmotions: ["shame", "vulnerability", "anxiety", "exposure"],
    relatedEmotionsChinese: ["\u7F9E\u803B", "\u8106\u5F31", "\u7126\u8651", "\u66B4\u9732"]
  },
  {
    id: "death",
    name: "Death",
    nameChinese: "\u6B7B\u4EA1",
    category: "Actions",
    categoryChinese: "\u52A8\u4F5C",
    jungianArchetype: "Transformation",
    meaningPositive: "Major transformation, ending of old patterns, rebirth, new chapter",
    meaningNegative: "Fear of loss, anxiety about mortality, grief, resistance to change",
    meaningPositiveChinese: "\u91CD\u5927\u8F6C\u53D8\u3001\u65E7\u6A21\u5F0F\u7684\u7EC8\u7ED3\u3001\u91CD\u751F\u3001\u65B0\u7BC7\u7AE0",
    meaningNegativeChinese: "\u5BB3\u6015\u5931\u53BB\u3001\u5BF9\u6B7B\u4EA1\u7684\u7126\u8651\u3001\u60B2\u4F24\u3001\u6297\u62D2\u53D8\u5316",
    psychologicalInsight: "Death in dreams rarely predicts actual death. It almost always symbolizes the end of something \u2014 a relationship, job, phase, or old identity.",
    psychologicalInsightChinese: "\u68A6\u4E2D\u7684\u6B7B\u4EA1\u5F88\u5C11\u9884\u793A\u5B9E\u9645\u7684\u6B7B\u4EA1\u3002\u5B83\u51E0\u4E4E\u603B\u662F\u8C61\u5F81\u67D0\u4E8B\u7684\u7ED3\u675F\u2014\u2014\u4E00\u6BB5\u5173\u7CFB\u3001\u5DE5\u4F5C\u3001\u9636\u6BB5\u6216\u65E7\u8EAB\u4EFD\u3002",
    relatedEmotions: ["fear", "grief", "acceptance", "transformation"],
    relatedEmotionsChinese: ["\u6050\u60E7", "\u60B2\u4F24", "\u63A5\u53D7", "\u8F6C\u53D8"]
  },
  // === PLACES & STRUCTURES ===
  {
    id: "house",
    name: "House",
    nameChinese: "\u623F\u5B50",
    category: "Places",
    categoryChinese: "\u573A\u6240",
    jungianArchetype: "The Self",
    meaningPositive: "The self, inner world, security, personal identity, foundation",
    meaningNegative: "Feeling trapped, neglected aspects of self, instability",
    meaningPositiveChinese: "\u81EA\u6211\u3001\u5185\u5FC3\u4E16\u754C\u3001\u5B89\u5168\u611F\u3001\u4E2A\u4EBA\u8EAB\u4EFD\u3001\u6839\u57FA",
    meaningNegativeChinese: "\u611F\u5230\u88AB\u56F0\u3001\u88AB\u5FFD\u89C6\u7684\u81EA\u6211\u65B9\u9762\u3001\u4E0D\u7A33\u5B9A",
    psychologicalInsight: "Houses represent the self. Different rooms represent different aspects of your psyche. The condition of the house reflects your self-perception.",
    psychologicalInsightChinese: "\u623F\u5B50\u4EE3\u8868\u81EA\u6211\u3002\u4E0D\u540C\u7684\u623F\u95F4\u4EE3\u8868\u5FC3\u7075\u7684\u4E0D\u540C\u65B9\u9762\u3002\u623F\u5B50\u7684\u72B6\u51B5\u53CD\u6620\u4F60\u7684\u81EA\u6211\u8BA4\u77E5\u3002",
    relatedEmotions: ["security", "comfort", "anxiety", "nostalgia"],
    relatedEmotionsChinese: ["\u5B89\u5168", "\u8212\u9002", "\u7126\u8651", "\u6000\u65E7"]
  },
  {
    id: "road",
    name: "Road/Path",
    nameChinese: "\u9053\u8DEF",
    category: "Places",
    categoryChinese: "\u573A\u6240",
    meaningPositive: "Life journey, direction, progress, choices, personal path",
    meaningNegative: "Feeling lost, wrong direction, obstacles, uncertainty about the future",
    meaningPositiveChinese: "\u4EBA\u751F\u65C5\u7A0B\u3001\u65B9\u5411\u3001\u8FDB\u6B65\u3001\u9009\u62E9\u3001\u4E2A\u4EBA\u9053\u8DEF",
    meaningNegativeChinese: "\u611F\u5230\u8FF7\u5931\u3001\u9519\u8BEF\u65B9\u5411\u3001\u969C\u788D\u3001\u5BF9\u672A\u6765\u7684\u4E0D\u786E\u5B9A",
    psychologicalInsight: "Roads represent your life path. A clear road suggests confidence in direction; a blocked or forked road suggests decision-making challenges.",
    psychologicalInsightChinese: "\u9053\u8DEF\u4EE3\u8868\u4F60\u7684\u4EBA\u751F\u9053\u8DEF\u3002\u6E05\u6670\u7684\u8DEF\u6697\u793A\u5BF9\u65B9\u5411\u7684\u4FE1\u5FC3\uFF1B\u88AB\u963B\u6216\u5206\u53C9\u7684\u8DEF\u6697\u793A\u51B3\u7B56\u6311\u6218\u3002",
    relatedEmotions: ["direction", "uncertainty", "adventure", "confusion"],
    relatedEmotionsChinese: ["\u65B9\u5411", "\u4E0D\u786E\u5B9A", "\u5192\u9669", "\u56F0\u60D1"]
  },
  {
    id: "bridge",
    name: "Bridge",
    nameChinese: "\u6865",
    category: "Places",
    categoryChinese: "\u573A\u6240",
    meaningPositive: "Transition, connection, overcoming obstacles, new opportunities",
    meaningNegative: "Fear of change, unstable transition, risk, point of no return",
    meaningPositiveChinese: "\u8FC7\u6E21\u3001\u8FDE\u63A5\u3001\u514B\u670D\u969C\u788D\u3001\u65B0\u673A\u4F1A",
    meaningNegativeChinese: "\u5BB3\u6015\u6539\u53D8\u3001\u4E0D\u7A33\u5B9A\u7684\u8FC7\u6E21\u3001\u98CE\u9669\u3001\u4E0D\u5F52\u8DEF",
    psychologicalInsight: "Bridges represent transitions between life phases. Crossing a bridge suggests you are moving through a significant change.",
    psychologicalInsightChinese: "\u6865\u4EE3\u8868\u4EBA\u751F\u9636\u6BB5\u4E4B\u95F4\u7684\u8FC7\u6E21\u3002\u8FC7\u6865\u6697\u793A\u4F60\u6B63\u5728\u7ECF\u5386\u91CD\u5927\u53D8\u5316\u3002",
    relatedEmotions: ["hope", "fear", "determination", "uncertainty"],
    relatedEmotionsChinese: ["\u5E0C\u671B", "\u6050\u60E7", "\u51B3\u5FC3", "\u4E0D\u786E\u5B9A"]
  },
  {
    id: "ocean",
    name: "Ocean",
    nameChinese: "\u6D77\u6D0B",
    category: "Places",
    categoryChinese: "\u573A\u6240",
    jungianArchetype: "Collective Unconscious",
    element: "Water",
    meaningPositive: "Vast potential, emotional depth, collective wisdom, spiritual vastness",
    meaningNegative: "Feeling overwhelmed, fear of the unknown, emotional turbulence",
    meaningPositiveChinese: "\u5DE8\u5927\u6F5C\u529B\u3001\u60C5\u611F\u6DF1\u5EA6\u3001\u96C6\u4F53\u667A\u6167\u3001\u7CBE\u795E\u5E7F\u9614",
    meaningNegativeChinese: "\u611F\u5230\u4E0D\u582A\u91CD\u8D1F\u3001\u5BF9\u672A\u77E5\u7684\u6050\u60E7\u3001\u60C5\u611F\u52A8\u8361",
    psychologicalInsight: "The ocean represents the collective unconscious and the totality of emotional experience. Its state reflects your relationship with your deepest feelings.",
    psychologicalInsightChinese: "\u6D77\u6D0B\u4EE3\u8868\u96C6\u4F53\u65E0\u610F\u8BC6\u548C\u60C5\u611F\u4F53\u9A8C\u7684\u603B\u548C\u3002\u5B83\u7684\u72B6\u6001\u53CD\u6620\u4F60\u4E0E\u6700\u6DF1\u5C42\u611F\u53D7\u7684\u5173\u7CFB\u3002",
    relatedEmotions: ["awe", "fear", "peace", "overwhelm"],
    relatedEmotionsChinese: ["\u656C\u754F", "\u6050\u60E7", "\u5E73\u9759", "\u4E0D\u582A\u91CD\u8D1F"]
  },
  // === PEOPLE & FIGURES ===
  {
    id: "baby",
    name: "Baby",
    nameChinese: "\u5A74\u513F",
    category: "People",
    categoryChinese: "\u4EBA\u7269",
    jungianArchetype: "Divine Child",
    meaningPositive: "New beginnings, innocence, potential, creativity, vulnerability",
    meaningNegative: "Helplessness, dependency, neglected inner child, unmet needs",
    meaningPositiveChinese: "\u65B0\u7684\u5F00\u59CB\u3001\u5929\u771F\u3001\u6F5C\u529B\u3001\u521B\u9020\u529B\u3001\u8106\u5F31",
    meaningNegativeChinese: "\u65E0\u52A9\u3001\u4F9D\u8D56\u3001\u88AB\u5FFD\u89C6\u7684\u5185\u5728\u5C0F\u5B69\u3001\u672A\u6EE1\u8DB3\u7684\u9700\u6C42",
    psychologicalInsight: "Babies represent new projects, ideas, or aspects of yourself that are developing. They can also represent your inner child.",
    psychologicalInsightChinese: "\u5A74\u513F\u4EE3\u8868\u6B63\u5728\u53D1\u5C55\u7684\u65B0\u9879\u76EE\u3001\u60F3\u6CD5\u6216\u81EA\u6211\u65B9\u9762\u3002\u5B83\u4EEC\u4E5F\u53EF\u4EE5\u4EE3\u8868\u4F60\u7684\u5185\u5728\u5C0F\u5B69\u3002",
    relatedEmotions: ["tenderness", "anxiety", "hope", "vulnerability"],
    relatedEmotionsChinese: ["\u6E29\u67D4", "\u7126\u8651", "\u5E0C\u671B", "\u8106\u5F31"]
  },
  {
    id: "stranger",
    name: "Stranger",
    nameChinese: "\u964C\u751F\u4EBA",
    category: "People",
    categoryChinese: "\u4EBA\u7269",
    jungianArchetype: "Shadow/Anima/Animus",
    meaningPositive: "Unknown aspects of self, new possibilities, hidden potential",
    meaningNegative: "Fear of the unknown, unacknowledged parts of personality",
    meaningPositiveChinese: "\u672A\u77E5\u7684\u81EA\u6211\u65B9\u9762\u3001\u65B0\u7684\u53EF\u80FD\u6027\u3001\u9690\u85CF\u7684\u6F5C\u529B",
    meaningNegativeChinese: "\u5BF9\u672A\u77E5\u7684\u6050\u60E7\u3001\u672A\u88AB\u627F\u8BA4\u7684\u4EBA\u683C\u90E8\u5206",
    psychologicalInsight: "Strangers in dreams often represent aspects of yourself that you have not yet recognized or integrated into your conscious identity.",
    psychologicalInsightChinese: "\u68A6\u4E2D\u7684\u964C\u751F\u4EBA\u901A\u5E38\u4EE3\u8868\u4F60\u5C1A\u672A\u8BA4\u8BC6\u6216\u6574\u5408\u5230\u610F\u8BC6\u8EAB\u4EFD\u4E2D\u7684\u81EA\u6211\u65B9\u9762\u3002",
    relatedEmotions: ["curiosity", "fear", "intrigue", "discomfort"],
    relatedEmotionsChinese: ["\u597D\u5947", "\u6050\u60E7", "\u597D\u5947\u5FC3", "\u4E0D\u9002"]
  },
  {
    id: "parent",
    name: "Parent",
    nameChinese: "\u7236\u6BCD",
    category: "People",
    categoryChinese: "\u4EBA\u7269",
    jungianArchetype: "Great Mother/Father",
    meaningPositive: "Guidance, protection, wisdom, nurturing, authority",
    meaningNegative: "Control, unresolved family issues, dependency, judgment",
    meaningPositiveChinese: "\u6307\u5BFC\u3001\u4FDD\u62A4\u3001\u667A\u6167\u3001\u517B\u80B2\u3001\u6743\u5A01",
    meaningNegativeChinese: "\u63A7\u5236\u3001\u672A\u89E3\u51B3\u7684\u5BB6\u5EAD\u95EE\u9898\u3001\u4F9D\u8D56\u3001\u8BC4\u5224",
    psychologicalInsight: "Parents in dreams represent authority figures and internalized parental voices. They often appear when you are dealing with authority or independence issues.",
    psychologicalInsightChinese: "\u68A6\u4E2D\u7684\u7236\u6BCD\u4EE3\u8868\u6743\u5A01\u4EBA\u7269\u548C\u5185\u5316\u7684\u7236\u6BCD\u58F0\u97F3\u3002\u5B83\u4EEC\u5E38\u5728\u4F60\u5904\u7406\u6743\u5A01\u6216\u72EC\u7ACB\u95EE\u9898\u65F6\u51FA\u73B0\u3002",
    relatedEmotions: ["love", "resentment", "security", "rebellion"],
    relatedEmotionsChinese: ["\u7231", "\u6028\u6068", "\u5B89\u5168", "\u53DB\u9006"]
  },
  // === OBJECTS ===
  {
    id: "mirror",
    name: "Mirror",
    nameChinese: "\u955C\u5B50",
    category: "Objects",
    categoryChinese: "\u7269\u54C1",
    jungianArchetype: "The Self",
    meaningPositive: "Self-reflection, truth, self-awareness, clarity",
    meaningNegative: "Vanity, distorted self-image, fear of seeing the truth",
    meaningPositiveChinese: "\u81EA\u6211\u53CD\u601D\u3001\u771F\u76F8\u3001\u81EA\u6211\u610F\u8BC6\u3001\u6E05\u6670",
    meaningNegativeChinese: "\u865A\u8363\u3001\u626D\u66F2\u7684\u81EA\u6211\u5F62\u8C61\u3001\u5BB3\u6015\u770B\u5230\u771F\u76F8",
    psychologicalInsight: "Mirrors represent self-examination. What you see in the mirror reflects how you perceive yourself at a deep level.",
    psychologicalInsightChinese: "\u955C\u5B50\u4EE3\u8868\u81EA\u6211\u5BA1\u89C6\u3002\u4F60\u5728\u955C\u4E2D\u770B\u5230\u7684\u53CD\u6620\u4E86\u4F60\u5728\u6DF1\u5C42\u5982\u4F55\u770B\u5F85\u81EA\u5DF1\u3002",
    relatedEmotions: ["curiosity", "fear", "acceptance", "shock"],
    relatedEmotionsChinese: ["\u597D\u5947", "\u6050\u60E7", "\u63A5\u53D7", "\u9707\u60CA"]
  },
  {
    id: "key",
    name: "Key",
    nameChinese: "\u94A5\u5319",
    category: "Objects",
    categoryChinese: "\u7269\u54C1",
    meaningPositive: "Solutions, access, knowledge, opportunity, unlocking potential",
    meaningNegative: "Locked out, missing something important, secrets",
    meaningPositiveChinese: "\u89E3\u51B3\u65B9\u6848\u3001\u901A\u9053\u3001\u77E5\u8BC6\u3001\u673A\u4F1A\u3001\u91CA\u653E\u6F5C\u529B",
    meaningNegativeChinese: "\u88AB\u9501\u5728\u5916\u9762\u3001\u9057\u5931\u91CD\u8981\u4E8B\u7269\u3001\u79D8\u5BC6",
    psychologicalInsight: "Keys represent access to knowledge or solutions. Finding a key suggests you are close to solving a problem or gaining new understanding.",
    psychologicalInsightChinese: "\u94A5\u5319\u4EE3\u8868\u83B7\u53D6\u77E5\u8BC6\u6216\u89E3\u51B3\u65B9\u6848\u7684\u9014\u5F84\u3002\u627E\u5230\u94A5\u5319\u6697\u793A\u4F60\u5373\u5C06\u89E3\u51B3\u95EE\u9898\u6216\u83B7\u5F97\u65B0\u7684\u7406\u89E3\u3002",
    relatedEmotions: ["hope", "frustration", "discovery", "relief"],
    relatedEmotionsChinese: ["\u5E0C\u671B", "\u632B\u6298", "\u53D1\u73B0", "\u91CA\u7136"]
  },
  {
    id: "money",
    name: "Money",
    nameChinese: "\u91D1\u94B1",
    category: "Objects",
    categoryChinese: "\u7269\u54C1",
    meaningPositive: "Self-worth, abundance, power, success, energy exchange",
    meaningNegative: "Greed, anxiety about finances, feeling undervalued, loss",
    meaningPositiveChinese: "\u81EA\u6211\u4EF7\u503C\u3001\u4E30\u9976\u3001\u529B\u91CF\u3001\u6210\u529F\u3001\u80FD\u91CF\u4EA4\u6362",
    meaningNegativeChinese: "\u8D2A\u5A6A\u3001\u5BF9\u8D22\u52A1\u7684\u7126\u8651\u3001\u611F\u5230\u88AB\u4F4E\u4F30\u3001\u635F\u5931",
    psychologicalInsight: "Money in dreams often represents self-worth and personal value rather than literal finances. Losing money may reflect feeling undervalued.",
    psychologicalInsightChinese: "\u68A6\u4E2D\u7684\u91D1\u94B1\u901A\u5E38\u4EE3\u8868\u81EA\u6211\u4EF7\u503C\u548C\u4E2A\u4EBA\u4EF7\u503C\uFF0C\u800C\u975E\u5B57\u9762\u4E0A\u7684\u8D22\u52A1\u3002\u4E22\u94B1\u53EF\u80FD\u53CD\u6620\u611F\u5230\u88AB\u4F4E\u4F30\u3002",
    relatedEmotions: ["security", "anxiety", "greed", "satisfaction"],
    relatedEmotionsChinese: ["\u5B89\u5168", "\u7126\u8651", "\u8D2A\u5A6A", "\u6EE1\u8DB3"]
  },
  {
    id: "clock",
    name: "Clock/Time",
    nameChinese: "\u65F6\u949F/\u65F6\u95F4",
    category: "Objects",
    categoryChinese: "\u7269\u54C1",
    meaningPositive: "Awareness of time, punctuality, life rhythm, timely action",
    meaningNegative: "Running out of time, pressure, mortality, missed opportunities",
    meaningPositiveChinese: "\u65F6\u95F4\u610F\u8BC6\u3001\u51C6\u65F6\u3001\u751F\u6D3B\u8282\u594F\u3001\u53CA\u65F6\u884C\u52A8",
    meaningNegativeChinese: "\u65F6\u95F4\u4E0D\u591F\u3001\u538B\u529B\u3001\u6B7B\u4EA1\u3001\u9519\u8FC7\u7684\u673A\u4F1A",
    psychologicalInsight: "Clocks represent your relationship with time and mortality. A stopped clock may suggest feeling stuck; a racing clock reflects time pressure.",
    psychologicalInsightChinese: "\u65F6\u949F\u4EE3\u8868\u4F60\u4E0E\u65F6\u95F4\u548C\u6B7B\u4EA1\u7684\u5173\u7CFB\u3002\u505C\u6B62\u7684\u65F6\u949F\u53EF\u80FD\u6697\u793A\u611F\u5230\u505C\u6EDE\uFF1B\u98DE\u901F\u8F6C\u52A8\u7684\u65F6\u949F\u53CD\u6620\u65F6\u95F4\u538B\u529B\u3002",
    relatedEmotions: ["urgency", "anxiety", "nostalgia", "pressure"],
    relatedEmotionsChinese: ["\u7D27\u8FEB", "\u7126\u8651", "\u6000\u65E7", "\u538B\u529B"]
  }
];
var DREAM_THEMES = [
  {
    id: "anxiety",
    name: "Anxiety Dreams",
    nameChinese: "\u7126\u8651\u68A6",
    description: "Dreams reflecting worry, stress, or unresolved tension from waking life.",
    descriptionChinese: "\u53CD\u6620\u73B0\u5B9E\u751F\u6D3B\u4E2D\u7684\u62C5\u5FE7\u3001\u538B\u529B\u6216\u672A\u89E3\u51B3\u7684\u7D27\u5F20\u7684\u68A6\u3002",
    commonSymbols: ["falling", "chasing", "exam", "teeth_falling", "naked"],
    psychologicalMeaning: "Anxiety dreams serve as a pressure valve for accumulated stress. They highlight areas of life where you feel unprepared or out of control.",
    psychologicalMeaningChinese: "\u7126\u8651\u68A6\u662F\u7D2F\u79EF\u538B\u529B\u7684\u51CF\u538B\u9600\u3002\u5B83\u4EEC\u7A81\u51FA\u4E86\u4F60\u611F\u5230\u51C6\u5907\u4E0D\u8DB3\u6216\u5931\u63A7\u7684\u751F\u6D3B\u9886\u57DF\u3002"
  },
  {
    id: "transformation",
    name: "Transformation Dreams",
    nameChinese: "\u8F6C\u53D8\u68A6",
    description: "Dreams about major life changes, endings, and new beginnings.",
    descriptionChinese: "\u5173\u4E8E\u91CD\u5927\u4EBA\u751F\u53D8\u5316\u3001\u7ED3\u675F\u548C\u65B0\u5F00\u59CB\u7684\u68A6\u3002",
    commonSymbols: ["death", "snake", "fire", "bridge", "baby"],
    psychologicalMeaning: "Transformation dreams appear during periods of significant personal growth. They signal that your psyche is processing deep changes.",
    psychologicalMeaningChinese: "\u8F6C\u53D8\u68A6\u51FA\u73B0\u5728\u91CD\u5927\u4E2A\u4EBA\u6210\u957F\u65F6\u671F\u3002\u5B83\u4EEC\u8868\u660E\u4F60\u7684\u5FC3\u7075\u6B63\u5728\u5904\u7406\u6DF1\u5C42\u53D8\u5316\u3002"
  },
  {
    id: "freedom",
    name: "Freedom & Aspiration Dreams",
    nameChinese: "\u81EA\u7531\u4E0E\u62B1\u8D1F\u68A6",
    description: "Dreams about flying, exploration, and breaking free from limitations.",
    descriptionChinese: "\u5173\u4E8E\u98DE\u7FD4\u3001\u63A2\u7D22\u548C\u7A81\u7834\u9650\u5236\u7684\u68A6\u3002",
    commonSymbols: ["flying", "bird", "sky", "mountain", "road"],
    psychologicalMeaning: "Freedom dreams reflect your desire for liberation from constraints. They often appear when you feel restricted in waking life.",
    psychologicalMeaningChinese: "\u81EA\u7531\u68A6\u53CD\u6620\u4F60\u5BF9\u6446\u8131\u675F\u7F1A\u7684\u6E34\u671B\u3002\u5B83\u4EEC\u5E38\u5728\u4F60\u611F\u5230\u88AB\u9650\u5236\u65F6\u51FA\u73B0\u3002"
  },
  {
    id: "relationship",
    name: "Relationship Dreams",
    nameChinese: "\u5173\u7CFB\u68A6",
    description: "Dreams involving family, partners, friends, or strangers that reflect interpersonal dynamics.",
    descriptionChinese: "\u6D89\u53CA\u5BB6\u4EBA\u3001\u4F34\u4FA3\u3001\u670B\u53CB\u6216\u964C\u751F\u4EBA\u7684\u68A6\uFF0C\u53CD\u6620\u4EBA\u9645\u5173\u7CFB\u52A8\u6001\u3002",
    commonSymbols: ["parent", "stranger", "baby", "dog", "house"],
    psychologicalMeaning: "Relationship dreams process your feelings about connections with others. Characters often represent aspects of yourself projected onto others.",
    psychologicalMeaningChinese: "\u5173\u7CFB\u68A6\u5904\u7406\u4F60\u5BF9\u4E0E\u4ED6\u4EBA\u8FDE\u63A5\u7684\u611F\u53D7\u3002\u89D2\u8272\u901A\u5E38\u4EE3\u8868\u4F60\u6295\u5C04\u5230\u4ED6\u4EBA\u8EAB\u4E0A\u7684\u81EA\u6211\u65B9\u9762\u3002"
  },
  {
    id: "self_discovery",
    name: "Self-Discovery Dreams",
    nameChinese: "\u81EA\u6211\u53D1\u73B0\u68A6",
    description: "Dreams about exploring unknown places, finding hidden rooms, or discovering new abilities.",
    descriptionChinese: "\u5173\u4E8E\u63A2\u7D22\u672A\u77E5\u5730\u65B9\u3001\u53D1\u73B0\u9690\u85CF\u623F\u95F4\u6216\u53D1\u73B0\u65B0\u80FD\u529B\u7684\u68A6\u3002",
    commonSymbols: ["house", "forest", "mirror", "key", "ocean"],
    psychologicalMeaning: "Self-discovery dreams indicate your psyche is ready to explore new aspects of identity. They often precede periods of personal insight.",
    psychologicalMeaningChinese: "\u81EA\u6211\u53D1\u73B0\u68A6\u8868\u660E\u4F60\u7684\u5FC3\u7075\u51C6\u5907\u597D\u63A2\u7D22\u8EAB\u4EFD\u7684\u65B0\u65B9\u9762\u3002\u5B83\u4EEC\u5E38\u5728\u4E2A\u4EBA\u6D1E\u5BDF\u671F\u4E4B\u524D\u51FA\u73B0\u3002"
  }
];
function findSymbolsByText(text2, language = "en") {
  const lowerText = text2.toLowerCase();
  return DREAM_SYMBOLS.filter((s) => {
    const name = language === "zh" ? s.nameChinese : s.name.toLowerCase();
    const category = language === "zh" ? s.categoryChinese : s.category.toLowerCase();
    return lowerText.includes(name.toLowerCase()) || lowerText.includes(category.toLowerCase());
  });
}
function identifyTheme(symbolIds) {
  let bestMatch;
  let bestScore = 0;
  for (const theme of DREAM_THEMES) {
    const overlap = theme.commonSymbols.filter((s) => symbolIds.includes(s)).length;
    const score = overlap / theme.commonSymbols.length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = theme;
    }
  }
  return bestScore > 0.2 ? bestMatch : void 0;
}

// server/routers/dream.ts
function analyzeDreamProfile(symbols, emotions, dreamType, dreamContent, language) {
  const isEn = language === "en";
  const elementCounts = { Water: 0, Fire: 0, Earth: 0, Air: 0, Spirit: 0 };
  for (const s of symbols) {
    if (s.element && elementCounts[s.element] !== void 0) {
      elementCounts[s.element]++;
    }
  }
  const contentLower = dreamContent.toLowerCase();
  const waterWords = ["\u6C34", "\u6D77", "\u6CB3", "\u96E8", "\u6CEA", "\u6E38\u6CF3", "\u6D2A\u6C34", "ocean", "river", "rain", "tears", "swim", "flood", "lake", "wave"];
  const fireWords = ["\u706B", "\u71C3\u70E7", "\u5149", "\u592A\u9633", "\u70ED", "fire", "burn", "light", "sun", "heat", "flame", "candle"];
  const earthWords = ["\u5C71", "\u571F", "\u77F3", "\u6811", "\u82B1", "\u68EE\u6797", "mountain", "earth", "stone", "tree", "flower", "forest", "garden"];
  const airWords = ["\u98CE", "\u98DE", "\u5929\u7A7A", "\u4E91", "\u9E1F", "wind", "fly", "sky", "cloud", "bird", "breath", "air"];
  const spiritWords = ["\u795E", "\u7075", "\u68A6", "\u661F", "\u6708", "\u5149\u8292", "spirit", "soul", "dream", "star", "moon", "glow", "divine"];
  for (const w of waterWords) if (contentLower.includes(w)) elementCounts.Water++;
  for (const w of fireWords) if (contentLower.includes(w)) elementCounts.Fire++;
  for (const w of earthWords) if (contentLower.includes(w)) elementCounts.Earth++;
  for (const w of airWords) if (contentLower.includes(w)) elementCounts.Air++;
  for (const w of spiritWords) if (contentLower.includes(w)) elementCounts.Spirit++;
  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Spirit";
  const archetypes = [];
  const archetypeKeywords = {
    "The Shadow": ["\u9634\u5F71", "\u9ED1\u6697", "\u602A\u7269", "\u8FFD\u9010", "\u6050\u60E7", "shadow", "dark", "monster", "chase", "fear", "enemy"],
    "The Anima/Animus": ["\u5F02\u6027", "\u7231\u4EBA", "\u795E\u79D8\u4EBA", "\u5438\u5F15", "lover", "mysterious", "attraction", "opposite", "romance"],
    "The Self": ["\u5149", "\u5706", "\u5B8C\u6574", "\u4E2D\u5FC3", "\u548C\u8C10", "light", "circle", "whole", "center", "harmony", "mandala"],
    "The Hero": ["\u6218\u6597", "\u5192\u9669", "\u514B\u670D", "\u52C7\u6C14", "fight", "adventure", "overcome", "courage", "quest", "victory"],
    "The Great Mother": ["\u6BCD\u4EB2", "\u4FDD\u62A4", "\u6ECB\u517B", "\u5BB6", "mother", "protect", "nurture", "home", "comfort", "womb"],
    "The Wise Old Man": ["\u8001\u4EBA", "\u667A\u8005", "\u6307\u5F15", "\u8001\u5E08", "elder", "wise", "guide", "teacher", "mentor", "sage"],
    "The Trickster": ["\u5C0F\u4E11", "\u6B3A\u9A97", "\u53D8\u5316", "\u6DF7\u4E71", "trickster", "deceive", "change", "chaos", "joke", "fool"],
    "The Child": ["\u5B69\u5B50", "\u7EAF\u771F", "\u65B0\u751F", "\u73A9\u800D", "child", "innocent", "newborn", "play", "baby", "youth"]
  };
  for (const [archetype, keywords] of Object.entries(archetypeKeywords)) {
    if (keywords.some((k) => contentLower.includes(k))) {
      archetypes.push(archetype);
    }
  }
  for (const s of symbols) {
    if (s.jungianArchetype && !archetypes.includes(s.jungianArchetype)) {
      archetypes.push(s.jungianArchetype);
    }
  }
  const negativeEmotions = ["\u6050\u60E7", "\u7126\u8651", "\u60B2\u4F24", "\u6124\u6012", "\u5B64\u72EC", "fear", "anxiety", "sadness", "anger", "loneliness", "nightmare"];
  const positiveEmotions = ["\u5FEB\u4E50", "\u5E73\u9759", "\u5174\u594B", "\u6E29\u6696", "joy", "peace", "excitement", "warmth", "happiness"];
  const negCount = emotions.filter((e) => negativeEmotions.some((n) => e.toLowerCase().includes(n))).length;
  const posCount = emotions.filter((e) => positiveEmotions.some((p) => e.toLowerCase().includes(p))).length;
  const emotionalTone = negCount > posCount ? isEn ? "Shadow/Processing" : "\u9634\u5F71/\u5904\u7406" : posCount > negCount ? isEn ? "Integration/Growth" : "\u6574\u5408/\u6210\u957F" : isEn ? "Transition/Exploration" : "\u8FC7\u6E21/\u63A2\u7D22";
  const narrativePatterns = {
    "Hero's Journey": ["\u5192\u9669", "\u6311\u6218", "\u514B\u670D", "\u80DC\u5229", "adventure", "challenge", "overcome", "victory"],
    "Descent & Return": ["\u5760\u843D", "\u5730\u4E0B", "\u6DF1\u5904", "\u56DE\u5F52", "falling", "underground", "depths", "return"],
    "Chase & Escape": ["\u8FFD\u9010", "\u9003\u8DD1", "\u8EB2\u85CF", "chase", "escape", "hide", "run", "flee"],
    "Transformation": ["\u53D8\u5316", "\u53D8\u8EAB", "\u8715\u53D8", "\u65B0\u751F", "change", "transform", "metamorphosis", "rebirth"],
    "Loss & Search": ["\u8FF7\u8DEF", "\u5BFB\u627E", "\u4E22\u5931", "lost", "search", "missing", "find", "seek"],
    "Death & Rebirth": ["\u6B7B\u4EA1", "\u91CD\u751F", "\u7ED3\u675F", "\u5F00\u59CB", "death", "rebirth", "ending", "beginning"]
  };
  let narrativePattern = isEn ? "Symbolic Exploration" : "\u8C61\u5F81\u6027\u63A2\u7D22";
  for (const [pattern, keywords] of Object.entries(narrativePatterns)) {
    if (keywords.some((k) => contentLower.includes(k))) {
      narrativePattern = pattern;
      break;
    }
  }
  return {
    dominantElement,
    elementDistribution: elementCounts,
    archetypePresence: archetypes.length > 0 ? archetypes : [isEn ? "The Self" : "The Self"],
    emotionalTone,
    narrativePattern
  };
}
function formatDreamProfileForPrompt(profile, symbols, theme, language) {
  const isEn = language === "en";
  const lines = [];
  lines.push(isEn ? "=== DREAM ANALYSIS ENGINE DATA ===" : "=== \u68A6\u5883\u5206\u6790\u5F15\u64CE\u6570\u636E ===");
  lines.push("");
  lines.push(isEn ? `[Dominant Element]: ${profile.dominantElement}` : `\u3010\u4E3B\u5BFC\u5143\u7D20\u3011\uFF1A${profile.dominantElement}`);
  const elDist = Object.entries(profile.elementDistribution).filter(([_, v]) => v > 0).map(([k, v]) => `${k}(${v})`).join(", ");
  lines.push(isEn ? `[Element Distribution]: ${elDist || "Balanced"}` : `\u3010\u5143\u7D20\u5206\u5E03\u3011\uFF1A${elDist || "\u5747\u8861"}`);
  lines.push("");
  lines.push(isEn ? `[Active Archetypes]: ${profile.archetypePresence.join(", ")}` : `\u3010\u6D3B\u8DC3\u539F\u578B\u3011\uFF1A${profile.archetypePresence.join("\u3001")}`);
  lines.push(isEn ? `[Emotional Tone]: ${profile.emotionalTone}` : `\u3010\u60C5\u7EEA\u57FA\u8C03\u3011\uFF1A${profile.emotionalTone}`);
  lines.push(isEn ? `[Narrative Pattern]: ${profile.narrativePattern}` : `\u3010\u53D9\u4E8B\u6A21\u5F0F\u3011\uFF1A${profile.narrativePattern}`);
  lines.push("");
  if (theme) {
    lines.push(isEn ? `[Dream Theme]: ${theme.name} \u2014 ${theme.psychologicalMeaning}` : `\u3010\u68A6\u5883\u4E3B\u9898\u3011\uFF1A${theme.nameChinese} \u2014 ${theme.psychologicalMeaningChinese}`);
    lines.push("");
  }
  if (symbols.length > 0) {
    lines.push(isEn ? "[Identified Symbols]:" : "\u3010\u8BC6\u522B\u7B26\u53F7\u3011\uFF1A");
    for (const s of symbols) {
      const name = isEn ? s.name : s.nameChinese;
      const archetype = s.jungianArchetype ? ` (${s.jungianArchetype})` : "";
      const positive = isEn ? s.meaningPositive : s.meaningPositiveChinese;
      const negative = isEn ? s.meaningNegative : s.meaningNegativeChinese;
      const insight = isEn ? s.psychologicalInsight : s.psychologicalInsightChinese;
      lines.push(`  \u2022 ${name}${archetype}`);
      lines.push(`    ${isEn ? "Positive" : "\u79EF\u6781"}: ${positive}`);
      lines.push(`    ${isEn ? "Negative" : "\u6D88\u6781"}: ${negative}`);
      lines.push(`    ${isEn ? "Insight" : "\u6D1E\u5BDF"}: ${insight}`);
    }
  }
  return lines.join("\n");
}
function buildDeepAnalysisPrompt(language) {
  if (language === "en") {
    return `You are a world-class dream analyst trained in Jungian analytical psychology, Freudian dream theory, Gestalt dreamwork, transpersonal psychology, and cross-cultural dream symbolism. You combine deep psychological knowledge with practical wisdom and spiritual sensitivity.

IMPORTANT RULES:
- Use the structured dream analysis engine data provided below as the foundation
- Reference specific Jungian archetypes (Shadow, Anima/Animus, Self, Hero, etc.) when relevant
- Consider both personal unconscious and collective unconscious meanings
- Connect dream symbols to the dreamer's potential emotional state and life situation
- Provide psychologically grounded insights, not superstitious fortune-telling
- Be warm, empathetic, non-judgmental, and deeply insightful
- Each dimension must be substantial (3-5 paragraphs minimum)

FORMAT your response with EXACTLY these 10 section headers (use the exact format "## N. Title"):

## 1. Dream Landscape Overview
Provide an overview of the dream's overall energy field, atmosphere, and significance. Describe the dream's emotional texture, visual palette, and the quality of consciousness present. Identify the dream's position in the dreamer's psychological journey. Include a "dream vitality score" (1-10) reflecting the dream's transformative potential.

## 2. Symbol Archaeology
Deep-dive into each major symbol identified in the dream. For each symbol, explore: its universal/archetypal meaning, its personal/contextual meaning within this specific dream, cross-cultural symbolic traditions (Eastern & Western), and how the symbol connects to the dreamer's inner landscape. Reference the symbol database analysis.

## 3. Emotional Cartography
Map the emotional landscape of the dream in detail. Identify primary and secondary emotions, emotional transitions throughout the dream narrative, suppressed or hidden emotions beneath the surface, and how these dream emotions mirror waking life emotional patterns. Include analysis of emotional intensity and flow.

## 4. Jungian Archetype Analysis
Identify and deeply analyze all Jungian archetypes present in the dream. For each archetype: explain its role in the dream narrative, its message to the conscious mind, its relationship to the dreamer's individuation process, and specific Shadow work or integration opportunities it reveals.

## 5. Subconscious Mapping
Explore what the dream reveals about the dreamer's subconscious mind. Analyze: repressed desires or fears surfacing through dream imagery, unresolved conflicts being processed, childhood patterns or early experiences being revisited, and the relationship between dream content and current life challenges.

## 6. Narrative Structure & Dream Logic
Analyze the dream's storytelling structure: the beginning (setting/context), development (conflict/tension), climax (peak moment), and resolution (or lack thereof). Identify the dream's internal logic, recurring motifs, and what the narrative arc reveals about the dreamer's psychological processing.

## 7. Body-Mind Connection
Explore the somatic and physiological dimensions of the dream. Analyze: physical sensations described or implied, the body's role in dream symbolism, stress/tension patterns reflected in dream imagery, and recommendations for body-based practices (yoga, breathwork, movement) that address dream themes.

## 8. Practical Action Guide
Provide specific, actionable guidance based on the dream's messages. Include: 3-5 concrete steps the dreamer can take in waking life, journaling prompts for deeper exploration, creative expression exercises (art, writing, movement) to process dream themes, and relationship or communication insights.

## 9. Meditation & Ritual Suggestions
Offer tailored spiritual practices: a specific meditation technique suited to the dream's themes, a simple ritual or ceremony for integration, crystal/color/element recommendations aligned with the dream's energy, and a bedtime practice to continue the dream dialogue.

## 10. Affirmation & Cosmic Message
Conclude with: a personalized affirmation drawn from the dream's wisdom, the dream's "cosmic message" \u2014 what the universe/psyche is trying to communicate, a blessing or encouragement for the dreamer's journey, and a poetic closing that honors the dream's gift.`;
  }
  return `\u4F60\u662F\u4E00\u4F4D\u4E16\u754C\u7EA7\u7684\u68A6\u5883\u5206\u6790\u5E08\uFF0C\u7CBE\u901A\u8363\u683C\u5206\u6790\u5FC3\u7406\u5B66\u3001\u5F17\u6D1B\u4F0A\u5FB7\u68A6\u5883\u7406\u8BBA\u3001\u683C\u5F0F\u5854\u68A6\u5883\u5DE5\u4F5C\u3001\u8D85\u4E2A\u4EBA\u5FC3\u7406\u5B66\u548C\u8DE8\u6587\u5316\u68A6\u5883\u8C61\u5F81\u5B66\u3002\u4F60\u5C06\u6DF1\u539A\u7684\u5FC3\u7406\u5B66\u77E5\u8BC6\u4E0E\u5B9E\u7528\u667A\u6167\u548C\u7075\u6027\u654F\u611F\u5EA6\u76F8\u7ED3\u5408\u3002

\u91CD\u8981\u89C4\u5219\uFF1A
- \u4EE5\u4E0B\u65B9\u63D0\u4F9B\u7684\u68A6\u5883\u5206\u6790\u5F15\u64CE\u6570\u636E\u4E3A\u89E3\u8BFB\u57FA\u7840
- \u9002\u65F6\u5F15\u7528\u8363\u683C\u539F\u578B\uFF08\u9634\u5F71\u3001\u963F\u5C3C\u739B/\u963F\u5C3C\u59C6\u65AF\u3001\u81EA\u6027\u3001\u82F1\u96C4\u7B49\uFF09
- \u540C\u65F6\u8003\u8651\u4E2A\u4EBA\u65E0\u610F\u8BC6\u548C\u96C6\u4F53\u65E0\u610F\u8BC6\u5C42\u9762\u7684\u542B\u4E49
- \u5C06\u68A6\u5883\u7B26\u53F7\u4E0E\u505A\u68A6\u8005\u53EF\u80FD\u7684\u60C5\u611F\u72B6\u6001\u548C\u751F\u6D3B\u60C5\u5883\u8054\u7CFB\u8D77\u6765
- \u63D0\u4F9B\u6709\u5FC3\u7406\u5B66\u6839\u636E\u7684\u6D1E\u5BDF\uFF0C\u800C\u975E\u8FF7\u4FE1\u5F0F\u7684\u5360\u535C
- \u8BED\u6C14\u6E29\u6696\u3001\u5171\u60C5\u3001\u4E0D\u5E26\u8BC4\u5224\uFF0C\u4E14\u6DF1\u5177\u6D1E\u5BDF\u529B
- \u6BCF\u4E2A\u7EF4\u5EA6\u5FC5\u987B\u5145\u5B9E\uFF08\u81F3\u5C113-5\u6BB5\uFF09

\u8BF7\u4E25\u683C\u6309\u7167\u4EE5\u4E0B10\u4E2A\u7EF4\u5EA6\u6807\u9898\u683C\u5F0F\u8F93\u51FA\uFF08\u4F7F\u7528"## N. \u6807\u9898"\u683C\u5F0F\uFF09\uFF1A

## 1. \u68A6\u5883\u5168\u666F\u6982\u89C8
\u63D0\u4F9B\u68A6\u5883\u6574\u4F53\u80FD\u91CF\u573A\u3001\u6C1B\u56F4\u548C\u610F\u4E49\u7684\u6982\u89C8\u3002\u63CF\u8FF0\u68A6\u5883\u7684\u60C5\u611F\u8D28\u5730\u3001\u89C6\u89C9\u8272\u8C03\u548C\u610F\u8BC6\u54C1\u8D28\u3002\u5B9A\u4F4D\u68A6\u5883\u5728\u505A\u68A6\u8005\u5FC3\u7406\u65C5\u7A0B\u4E2D\u7684\u4F4D\u7F6E\u3002\u5305\u542B\u4E00\u4E2A"\u68A6\u5883\u6D3B\u529B\u6307\u6570"\uFF081-10\u5206\uFF09\uFF0C\u53CD\u6620\u68A6\u5883\u7684\u8F6C\u5316\u6F5C\u529B\u3002

## 2. \u7B26\u53F7\u8003\u53E4\u5B66
\u6DF1\u5165\u63A2\u7D22\u68A6\u4E2D\u6BCF\u4E2A\u4E3B\u8981\u7B26\u53F7\u3002\u5BF9\u6BCF\u4E2A\u7B26\u53F7\u63A2\u8BA8\uFF1A\u5176\u666E\u904D/\u539F\u578B\u610F\u4E49\u3001\u5728\u6B64\u7279\u5B9A\u68A6\u5883\u4E2D\u7684\u4E2A\u4EBA/\u60C5\u5883\u610F\u4E49\u3001\u4E1C\u897F\u65B9\u8DE8\u6587\u5316\u8C61\u5F81\u4F20\u7EDF\uFF0C\u4EE5\u53CA\u7B26\u53F7\u5982\u4F55\u8FDE\u63A5\u505A\u68A6\u8005\u7684\u5185\u5728\u666F\u89C2\u3002\u5F15\u7528\u7B26\u53F7\u6570\u636E\u5E93\u5206\u6790\u3002

## 3. \u60C5\u7EEA\u5730\u56FE\u5B66
\u8BE6\u7EC6\u7ED8\u5236\u68A6\u5883\u7684\u60C5\u7EEA\u5730\u56FE\u3002\u8BC6\u522B\u4E3B\u8981\u548C\u6B21\u8981\u60C5\u7EEA\u3001\u68A6\u5883\u53D9\u4E8B\u4E2D\u7684\u60C5\u7EEA\u8F6C\u53D8\u3001\u8868\u9762\u4E4B\u4E0B\u88AB\u538B\u6291\u6216\u9690\u85CF\u7684\u60C5\u7EEA\uFF0C\u4EE5\u53CA\u8FD9\u4E9B\u68A6\u5883\u60C5\u7EEA\u5982\u4F55\u6620\u5C04\u6E05\u9192\u751F\u6D3B\u4E2D\u7684\u60C5\u7EEA\u6A21\u5F0F\u3002\u5305\u542B\u60C5\u7EEA\u5F3A\u5EA6\u548C\u6D41\u52A8\u5206\u6790\u3002

## 4. \u8363\u683C\u539F\u578B\u6DF1\u5EA6\u89E3\u6790
\u8BC6\u522B\u5E76\u6DF1\u5165\u5206\u6790\u68A6\u4E2D\u51FA\u73B0\u7684\u6240\u6709\u8363\u683C\u539F\u578B\u3002\u5BF9\u6BCF\u4E2A\u539F\u578B\uFF1A\u89E3\u91CA\u5176\u5728\u68A6\u5883\u53D9\u4E8B\u4E2D\u7684\u89D2\u8272\u3001\u5BF9\u610F\u8BC6\u5FC3\u7075\u7684\u4FE1\u606F\u3001\u4E0E\u505A\u68A6\u8005\u4E2A\u4F53\u5316\u8FDB\u7A0B\u7684\u5173\u7CFB\uFF0C\u4EE5\u53CA\u5B83\u63ED\u793A\u7684\u5177\u4F53\u9634\u5F71\u5DE5\u4F5C\u6216\u6574\u5408\u673A\u4F1A\u3002

## 5. \u6F5C\u610F\u8BC6\u5730\u56FE
\u63A2\u7D22\u68A6\u5883\u63ED\u793A\u7684\u505A\u68A6\u8005\u6F5C\u610F\u8BC6\u5185\u5BB9\u3002\u5206\u6790\uFF1A\u901A\u8FC7\u68A6\u5883\u610F\u8C61\u6D6E\u73B0\u7684\u88AB\u538B\u6291\u6B32\u671B\u6216\u6050\u60E7\u3001\u6B63\u5728\u5904\u7406\u7684\u672A\u89E3\u51B3\u51B2\u7A81\u3001\u88AB\u91CD\u65B0\u5BA1\u89C6\u7684\u7AE5\u5E74\u6A21\u5F0F\u6216\u65E9\u671F\u7ECF\u5386\uFF0C\u4EE5\u53CA\u68A6\u5883\u5185\u5BB9\u4E0E\u5F53\u524D\u751F\u6D3B\u6311\u6218\u7684\u5173\u7CFB\u3002

## 6. \u53D9\u4E8B\u7ED3\u6784\u4E0E\u68A6\u5883\u903B\u8F91
\u5206\u6790\u68A6\u5883\u7684\u53D9\u4E8B\u7ED3\u6784\uFF1A\u5F00\u7AEF\uFF08\u80CC\u666F/\u60C5\u5883\uFF09\u3001\u53D1\u5C55\uFF08\u51B2\u7A81/\u5F20\u529B\uFF09\u3001\u9AD8\u6F6E\uFF08\u5DC5\u5CF0\u65F6\u523B\uFF09\u548C\u7ED3\u5C40\uFF08\u6216\u7F3A\u5931\uFF09\u3002\u8BC6\u522B\u68A6\u5883\u7684\u5185\u5728\u903B\u8F91\u3001\u53CD\u590D\u51FA\u73B0\u7684\u6BCD\u9898\uFF0C\u4EE5\u53CA\u53D9\u4E8B\u5F27\u7EBF\u63ED\u793A\u7684\u505A\u68A6\u8005\u5FC3\u7406\u5904\u7406\u8FC7\u7A0B\u3002

## 7. \u8EAB\u5FC3\u8FDE\u63A5
\u63A2\u7D22\u68A6\u5883\u7684\u8EAB\u4F53\u548C\u751F\u7406\u7EF4\u5EA6\u3002\u5206\u6790\uFF1A\u63CF\u8FF0\u6216\u6697\u793A\u7684\u8EAB\u4F53\u611F\u89C9\u3001\u8EAB\u4F53\u5728\u68A6\u5883\u8C61\u5F81\u4E2D\u7684\u89D2\u8272\u3001\u68A6\u5883\u610F\u8C61\u53CD\u6620\u7684\u538B\u529B/\u7D27\u5F20\u6A21\u5F0F\uFF0C\u4EE5\u53CA\u9488\u5BF9\u68A6\u5883\u4E3B\u9898\u7684\u8EAB\u4F53\u7EC3\u4E60\u5EFA\u8BAE\uFF08\u745C\u4F3D\u3001\u547C\u5438\u6CD5\u3001\u8FD0\u52A8\uFF09\u3002

## 8. \u5B9E\u8DF5\u884C\u52A8\u6307\u5357
\u57FA\u4E8E\u68A6\u5883\u4FE1\u606F\u63D0\u4F9B\u5177\u4F53\u3001\u53EF\u64CD\u4F5C\u7684\u6307\u5BFC\u3002\u5305\u62EC\uFF1A\u505A\u68A6\u8005\u5728\u6E05\u9192\u751F\u6D3B\u4E2D\u53EF\u4EE5\u91C7\u53D6\u76843-5\u4E2A\u5177\u4F53\u6B65\u9AA4\u3001\u6DF1\u5165\u63A2\u7D22\u7684\u65E5\u8BB0\u63D0\u793A\u3001\u5904\u7406\u68A6\u5883\u4E3B\u9898\u7684\u521B\u610F\u8868\u8FBE\u7EC3\u4E60\uFF08\u827A\u672F\u3001\u5199\u4F5C\u3001\u8FD0\u52A8\uFF09\uFF0C\u4EE5\u53CA\u5173\u7CFB\u6216\u6C9F\u901A\u6D1E\u5BDF\u3002

## 9. \u51A5\u60F3\u4E0E\u4EEA\u5F0F\u5EFA\u8BAE
\u63D0\u4F9B\u91CF\u8EAB\u5B9A\u5236\u7684\u7075\u6027\u5B9E\u8DF5\uFF1A\u9002\u5408\u68A6\u5883\u4E3B\u9898\u7684\u7279\u5B9A\u51A5\u60F3\u6280\u5DE7\u3001\u7528\u4E8E\u6574\u5408\u7684\u7B80\u5355\u4EEA\u5F0F\u6216\u5178\u793C\u3001\u4E0E\u68A6\u5883\u80FD\u91CF\u5BF9\u9F50\u7684\u6C34\u6676/\u989C\u8272/\u5143\u7D20\u5EFA\u8BAE\uFF0C\u4EE5\u53CA\u7EE7\u7EED\u68A6\u5883\u5BF9\u8BDD\u7684\u7761\u524D\u7EC3\u4E60\u3002

## 10. \u80AF\u5B9A\u8BED\u4E0E\u5B87\u5B99\u5BC4\u8BED
\u4EE5\u6B64\u7ED3\u675F\uFF1A\u4ECE\u68A6\u5883\u667A\u6167\u4E2D\u63D0\u70BC\u7684\u4E2A\u6027\u5316\u80AF\u5B9A\u8BED\u3001\u68A6\u5883\u7684"\u5B87\u5B99\u4FE1\u606F"\u2014\u2014\u5B87\u5B99/\u5FC3\u7075\u8BD5\u56FE\u4F20\u8FBE\u7684\u5185\u5BB9\u3001\u5BF9\u505A\u68A6\u8005\u65C5\u7A0B\u7684\u795D\u798F\u6216\u9F13\u52B1\uFF0C\u4EE5\u53CA\u4E00\u6BB5\u81F4\u656C\u68A6\u5883\u793C\u7269\u7684\u8BD7\u610F\u7ED3\u8BED\u3002`;
}
var dreamRouter = router({
  interpret: publicProcedure.input(z7.object({
    title: z7.string().optional(),
    dreamContent: z7.string().min(10, "Dream description must be at least 10 characters"),
    emotions: z7.array(z7.string()).optional(),
    keyElements: z7.array(z7.string()).optional(),
    dreamType: z7.enum(["normal", "nightmare", "lucid", "recurring", "prophetic"]).optional(),
    clarity: z7.number().min(1).max(5).optional(),
    dreamDate: z7.string().optional(),
    language: z7.enum(["zh", "en"]).optional().default("zh")
  })).mutation(async ({ input, ctx }) => {
    if (ctx.user?.id) {
      const usage = await getUsageStatus(ctx.user.id, "dream");
      if (!usage.canUse) {
        throw new Error("FREE_LIMIT_REACHED");
      }
    }
    const { title, dreamContent, emotions, keyElements, dreamType, clarity, dreamDate, language } = input;
    const isEn = language === "en";
    const foundSymbols = findSymbolsByText(dreamContent, language);
    const symbolIds = foundSymbols.map((s) => s.id);
    const dreamTheme = identifyTheme(symbolIds);
    const dreamProfile = analyzeDreamProfile(
      foundSymbols,
      emotions || [],
      dreamType || "normal",
      dreamContent,
      language
    );
    const profileContext = formatDreamProfileForPrompt(dreamProfile, foundSymbols, dreamTheme, language);
    const emotionsText = emotions?.length ? isEn ? `Emotions in dream: ${emotions.join(", ")}` : `\u68A6\u4E2D\u60C5\u7EEA\uFF1A${emotions.join("\u3001")}` : "";
    const elementsText = keyElements?.length ? isEn ? `Key elements: ${keyElements.join(", ")}` : `\u5173\u952E\u5143\u7D20\uFF1A${keyElements.join("\u3001")}` : "";
    const typeLabels = isEn ? {
      normal: "Normal Dream",
      nightmare: "Nightmare",
      lucid: "Lucid Dream",
      recurring: "Recurring Dream",
      prophetic: "Prophetic Dream"
    } : {
      normal: "\u666E\u901A\u68A6\u5883",
      nightmare: "\u5669\u68A6",
      lucid: "\u6E05\u9192\u68A6",
      recurring: "\u91CD\u590D\u68A6",
      prophetic: "\u9884\u77E5\u68A6"
    };
    const typeText = dreamType ? isEn ? `Dream type: ${typeLabels[dreamType]}` : `\u68A6\u5883\u7C7B\u578B\uFF1A${typeLabels[dreamType]}` : "";
    const clarityText = clarity ? isEn ? `Dream clarity: ${clarity}/5` : `\u68A6\u5883\u6E05\u6670\u5EA6\uFF1A${clarity}/5` : "";
    const systemPrompt = buildDeepAnalysisPrompt(language);
    const userPrompt = isEn ? `Dream Content: ${dreamContent}
${emotionsText} ${elementsText} ${typeText} ${clarityText}

${profileContext}

Please provide a comprehensive 10-dimension deep dream analysis based on both the dream content and the analysis engine data above. Each dimension must be thorough and insightful.` : `\u68A6\u5883\u5185\u5BB9\uFF1A${dreamContent}
${emotionsText} ${elementsText} ${typeText} ${clarityText}

${profileContext}

\u8BF7\u57FA\u4E8E\u68A6\u5883\u5185\u5BB9\u548C\u4E0A\u8FF0\u5206\u6790\u5F15\u64CE\u6570\u636E\uFF0C\u63D0\u4F9B\u5168\u9762\u768410\u7EF4\u5EA6\u6DF1\u5EA6\u68A6\u5883\u5206\u6790\u3002\u6BCF\u4E2A\u7EF4\u5EA6\u5FC5\u987B\u5145\u5B9E\u4E14\u6709\u6D1E\u5BDF\u529B\u3002`;
    const response = await invokeLLM({
      language,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    const rawContent = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : isEn ? "Dream interpretation failed, please try again" : "\u89E3\u68A6\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
    if (ctx.user?.id && !response.degradation) {
      await consumeUsage(ctx.user.id, "dream");
    }
    const symbolAnalysisData = foundSymbols.map((s) => ({
      symbol: s.name,
      symbolChinese: s.nameChinese,
      category: s.category,
      meaning: s.meaningPositive,
      meaningChinese: s.meaningPositiveChinese,
      jungianArchetype: s.jungianArchetype,
      psychologicalInsight: s.psychologicalInsight
    }));
    const db = await getDb();
    if (db && !response.degradation) {
      const insertData = {
        sessionId: nanoid4(),
        title: title || null,
        dreamContent,
        emotions: emotions || null,
        keyElements: keyElements || null,
        dreamType: dreamType || "normal",
        clarity: clarity || null,
        interpretation: rawContent,
        deepAnalysis: rawContent,
        symbolAnalysis: symbolAnalysisData,
        isPaid: false
      };
      if (ctx.user?.id) insertData.userId = ctx.user.id;
      if (dreamDate) insertData.dreamDate = new Date(dreamDate);
      await db.insert(dreamRecords).values(insertData);
      if (ctx.user?.id) {
        const [existingGrowth] = await db.select().from(userGrowth).where(eq9(userGrowth.userId, ctx.user.id)).limit(1);
        if (existingGrowth) {
          await db.update(userGrowth).set({
            selfAwareness: sql6`${userGrowth.selfAwareness} + 3`,
            spiritualGrowth: sql6`${userGrowth.spiritualGrowth} + 2`,
            totalPoints: sql6`${userGrowth.totalPoints} + 5`
          }).where(eq9(userGrowth.userId, ctx.user.id));
        } else {
          await db.insert(userGrowth).values({
            userId: ctx.user.id,
            selfAwareness: 3,
            spiritualGrowth: 2,
            totalPoints: 5
          });
        }
      }
    }
    return {
      interpretation: rawContent,
      deepAnalysis: rawContent,
      source: response.degradation ? "daily_limit" : "ai",
      degradation: response.degradation ?? null,
      symbolAnalysis: symbolAnalysisData,
      theme: dreamTheme ? {
        name: dreamTheme.name,
        nameChinese: dreamTheme.nameChinese,
        description: dreamTheme.description,
        descriptionChinese: dreamTheme.descriptionChinese
      } : null,
      dreamProfile: {
        dominantElement: dreamProfile.dominantElement,
        elementDistribution: dreamProfile.elementDistribution,
        archetypePresence: dreamProfile.archetypePresence,
        emotionalTone: dreamProfile.emotionalTone,
        narrativePattern: dreamProfile.narrativePattern
      }
    };
  }),
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const dreams = await db.select().from(dreamRecords).where(eq9(dreamRecords.userId, ctx.user.id)).orderBy(desc7(dreamRecords.createdAt)).limit(50);
    return dreams;
  }),
  getById: protectedProcedure.input(z7.object({ id: z7.number() })).query(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [dream] = await db.select().from(dreamRecords).where(and7(eq9(dreamRecords.id, input.id), eq9(dreamRecords.userId, ctx.user.id))).limit(1);
    return dream || null;
  }),
  exportSingle: protectedProcedure.input(z7.object({ id: z7.number() })).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const [dream] = await db.select().from(dreamRecords).where(and7(eq9(dreamRecords.id, input.id), eq9(dreamRecords.userId, ctx.user.id))).limit(1);
    if (!dream) throw new Error("Dream record not found");
    const { generateDreamPDFHTML: generateDreamPDFHTML2 } = await Promise.resolve().then(() => (init_pdfGenerator(), pdfGenerator_exports));
    const html = generateDreamPDFHTML2([dream]);
    return { html, filename: `Dream_${dream.title || dream.id}_${Date.now()}.html` };
  }),
  exportBatch: protectedProcedure.input(z7.object({
    startDate: z7.string().optional(),
    endDate: z7.string().optional(),
    limit: z7.number().min(1).max(100).optional()
  })).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const dreams = await db.select().from(dreamRecords).where(eq9(dreamRecords.userId, ctx.user.id)).orderBy(desc7(dreamRecords.createdAt)).limit(input.limit || 50);
    if (dreams.length === 0) throw new Error("No dream records found");
    const { generateDreamPDFHTML: generateDreamPDFHTML2 } = await Promise.resolve().then(() => (init_pdfGenerator(), pdfGenerator_exports));
    const html = generateDreamPDFHTML2(dreams, "Dream Journal");
    return { html, filename: `Dream_Journal_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.html`, count: dreams.length };
  }),
  search: protectedProcedure.input(z7.object({
    keyword: z7.string().optional(),
    emotions: z7.array(z7.string()).optional(),
    elements: z7.array(z7.string()).optional(),
    dreamType: z7.enum(["normal", "nightmare", "lucid", "recurring", "prophetic"]).optional(),
    tags: z7.array(z7.string()).optional(),
    startDate: z7.string().optional(),
    endDate: z7.string().optional(),
    limit: z7.number().min(1).max(100).default(50)
  })).query(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const allDreams = await db.select().from(dreamRecords).where(eq9(dreamRecords.userId, ctx.user.id)).orderBy(desc7(dreamRecords.createdAt)).limit(200);
    let filtered = allDreams;
    if (input.keyword) {
      const kw = input.keyword.toLowerCase();
      filtered = filtered.filter(
        (d) => d.dreamContent.toLowerCase().includes(kw) || d.title && d.title.toLowerCase().includes(kw) || d.interpretation && d.interpretation.toLowerCase().includes(kw)
      );
    }
    if (input.dreamType) {
      filtered = filtered.filter((d) => d.dreamType === input.dreamType);
    }
    if (input.emotions?.length) {
      filtered = filtered.filter((d) => {
        const de = d.emotions;
        return de && input.emotions.some((e) => de.includes(e));
      });
    }
    if (input.elements?.length) {
      filtered = filtered.filter((d) => {
        const dk = d.keyElements;
        return dk && input.elements.some((e) => dk.includes(e));
      });
    }
    return filtered.slice(0, input.limit);
  }),
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const records = await db.select({ tags: dreamRecords.tags }).from(dreamRecords).where(eq9(dreamRecords.userId, ctx.user.id));
    const tagCounts = {};
    for (const record of records) {
      const tags = record.tags;
      if (tags) {
        for (const tag of tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }
    return Object.entries(tagCounts).map(([tag, count2]) => ({ tag, count: count2 })).sort((a, b) => b.count - a.count);
  }),
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const records = await db.select().from(dreamRecords).where(eq9(dreamRecords.userId, ctx.user.id));
    const emotionDistribution = {};
    const elementDistribution = {};
    const typeDistribution = {};
    for (const record of records) {
      const emotions = record.emotions;
      if (emotions) {
        for (const e of emotions) {
          emotionDistribution[e] = (emotionDistribution[e] || 0) + 1;
        }
      }
      const elements = record.keyElements;
      if (elements) {
        for (const el of elements) {
          elementDistribution[el] = (elementDistribution[el] || 0) + 1;
        }
      }
      if (record.dreamType) {
        typeDistribution[record.dreamType] = (typeDistribution[record.dreamType] || 0) + 1;
      }
    }
    const now = /* @__PURE__ */ new Date();
    const weeklyTimeline = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const count2 = records.filter((r) => {
        const d = new Date(r.createdAt);
        return d >= weekStart && d < weekEnd;
      }).length;
      const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      weeklyTimeline.push({ week: label, count: count2 });
    }
    const deepAnalysisCount = records.filter((r) => r.deepAnalysis && r.deepAnalysis.length > 100).length;
    const tagDistribution = {};
    for (const record of records) {
      const tags = record.tags;
      if (tags) {
        for (const tag of tags) {
          tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
        }
      }
    }
    return {
      totalDreams: records.length,
      deepAnalysisCount,
      emotionDistribution,
      elementDistribution,
      typeDistribution,
      tagDistribution,
      weeklyTimeline
    };
  }),
  updateTags: protectedProcedure.input(z7.object({
    dreamId: z7.number(),
    tags: z7.array(z7.string())
  })).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db.update(dreamRecords).set({ tags: input.tags }).where(
      and7(
        eq9(dreamRecords.id, input.dreamId),
        eq9(dreamRecords.userId, ctx.user.id)
      )
    );
    return { success: true };
  })
});

// server/routers/referral.ts
import { z as z8 } from "zod";
init_db();
init_schema();
import { eq as eq10, and as and8, desc as desc8, sql as sql7, count } from "drizzle-orm";
function generateReferralCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
var REFERRAL_REWARD_CREDITS = 1;
var REFERRAL_REWARD_FEATURES = ["tarot", "bazi", "dream"];
var referralRouter = router({
  // Get or create the current user's referral code
  getMyReferral: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { code: "", totalReferrals: 0, completedReferrals: 0, totalRewards: 0 };
    const [user] = await db.select().from(users).where(eq10(users.id, ctx.user.id)).limit(1);
    let referralCode = user?.referralCode;
    if (!referralCode) {
      referralCode = generateReferralCode();
      let attempts = 0;
      while (attempts < 5) {
        const [existing] = await db.select().from(users).where(eq10(users.referralCode, referralCode)).limit(1);
        if (!existing) break;
        referralCode = generateReferralCode();
        attempts++;
      }
      await db.update(users).set({ referralCode }).where(eq10(users.id, ctx.user.id));
    }
    const [totalResult] = await db.select({ count: count() }).from(referrals).where(eq10(referrals.referrerId, ctx.user.id));
    const [completedResult] = await db.select({ count: count() }).from(referrals).where(
      and8(
        eq10(referrals.referrerId, ctx.user.id),
        eq10(referrals.status, "rewarded")
      )
    );
    const [rewardsResult] = await db.select({ total: sql7`COALESCE(SUM(${referralRewards.creditsAmount}), 0)` }).from(referralRewards).where(eq10(referralRewards.userId, ctx.user.id));
    return {
      code: referralCode,
      totalReferrals: totalResult?.count ?? 0,
      completedReferrals: completedResult?.count ?? 0,
      totalRewards: rewardsResult?.total ?? 0
    };
  }),
  // Get referral history
  getReferralHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const results = await db.select({
      id: referrals.id,
      referredId: referrals.referredId,
      status: referrals.status,
      referrerRewarded: referrals.referrerRewarded,
      createdAt: referrals.createdAt,
      completedAt: referrals.completedAt,
      referredName: users.name
    }).from(referrals).leftJoin(users, eq10(referrals.referredId, users.id)).where(eq10(referrals.referrerId, ctx.user.id)).orderBy(desc8(referrals.createdAt)).limit(50);
    return results.map((r) => ({
      ...r,
      referredName: r.referredName ? r.referredName.charAt(0) + "***" : "User"
    }));
  }),
  // Get my rewards
  getMyRewards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(referralRewards).where(eq10(referralRewards.userId, ctx.user.id)).orderBy(desc8(referralRewards.createdAt)).limit(50);
  }),
  // Validate a referral code (public - used before/during signup)
  validateCode: publicProcedure.input(z8.object({ code: z8.string().min(1) })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return { valid: false, referrerName: null };
    const [user] = await db.select({ id: users.id, name: users.name }).from(users).where(eq10(users.referralCode, input.code.toUpperCase())).limit(1);
    return {
      valid: !!user,
      referrerName: user?.name ? user.name.charAt(0) + "***" : null
    };
  }),
  // Process referral after signup (called from server when new user registers)
  processReferral: protectedProcedure.input(z8.object({ referralCode: z8.string().min(1) })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable" };
    const code = input.referralCode.toUpperCase();
    const [referrer] = await db.select().from(users).where(eq10(users.referralCode, code)).limit(1);
    if (!referrer) return { success: false, message: "Invalid referral code" };
    if (referrer.id === ctx.user.id) return { success: false, message: "Cannot refer yourself" };
    const [existing] = await db.select().from(referrals).where(eq10(referrals.referredId, ctx.user.id)).limit(1);
    if (existing) return { success: false, message: "Already referred" };
    const [result] = await db.insert(referrals).values({
      referrerId: referrer.id,
      referredId: ctx.user.id,
      referralCode: code,
      status: "completed",
      completedAt: /* @__PURE__ */ new Date()
    });
    const referralId = result.insertId;
    await db.update(users).set({ referredBy: referrer.id }).where(eq10(users.id, ctx.user.id));
    const rewardPromises = [];
    for (const feature of REFERRAL_REWARD_FEATURES) {
      rewardPromises.push(
        db.insert(referralRewards).values({
          userId: referrer.id,
          referralId: Number(referralId),
          rewardType: "bonus_credits",
          featureType: feature,
          creditsAmount: REFERRAL_REWARD_CREDITS,
          claimed: true
        })
      );
      rewardPromises.push(
        db.insert(purchaseCredits).values({
          userId: referrer.id,
          featureType: feature,
          credits: REFERRAL_REWARD_CREDITS,
          usedCredits: 0,
          status: "active"
        })
      );
    }
    for (const feature of REFERRAL_REWARD_FEATURES) {
      rewardPromises.push(
        db.insert(referralRewards).values({
          userId: ctx.user.id,
          referralId: Number(referralId),
          rewardType: "bonus_credits",
          featureType: feature,
          creditsAmount: REFERRAL_REWARD_CREDITS,
          claimed: true
        })
      );
      rewardPromises.push(
        db.insert(purchaseCredits).values({
          userId: ctx.user.id,
          featureType: feature,
          credits: REFERRAL_REWARD_CREDITS,
          usedCredits: 0,
          status: "active"
        })
      );
    }
    await Promise.all(rewardPromises);
    await db.update(referrals).set({
      status: "rewarded",
      referrerRewarded: true,
      referredRewarded: true
    }).where(eq10(referrals.id, Number(referralId)));
    createNotification({
      userId: referrer.id,
      type: "system",
      title: "\u{1F389} Referral Reward!",
      message: `Your friend joined using your referral code! You earned ${REFERRAL_REWARD_CREDITS} bonus credit for Tarot, BaZi, and Dream readings.`,
      link: "/referral",
      icon: "Gift"
    }).catch(() => {
    });
    createNotification({
      userId: ctx.user.id,
      type: "system",
      title: "\u{1F381} Welcome Bonus!",
      message: `You joined with a referral code! You earned ${REFERRAL_REWARD_CREDITS} bonus credit for Tarot, BaZi, and Dream readings.`,
      link: "/referral",
      icon: "Gift"
    }).catch(() => {
    });
    return { success: true, message: "Referral rewards granted!" };
  }),
  // Get leaderboard (top referrers)
  getLeaderboard: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const results = await db.select({
      userId: referrals.referrerId,
      count: count(),
      name: users.name
    }).from(referrals).leftJoin(users, eq10(referrals.referrerId, users.id)).where(eq10(referrals.status, "rewarded")).groupBy(referrals.referrerId, users.name).orderBy(desc8(count())).limit(10);
    return results.map((r, i) => ({
      rank: i + 1,
      name: r.name ? r.name.charAt(0) + "***" : "User",
      referralCount: r.count
    }));
  })
});

// server/routers/compatibility.ts
import { z as z9 } from "zod";
init_db();
init_schema();
import { eq as eq11, desc as desc9, sql as sql8 } from "drizzle-orm";
import { nanoid as nanoid5 } from "nanoid";
var ZODIAC_META = [
  {
    id: "aries",
    name: "Aries",
    nameChinese: "\u767D\u7F8A\u5EA7",
    symbol: "\u2648",
    element: "Fire",
    elementChinese: "\u706B",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Mars",
    rulingPlanetChinese: "\u706B\u661F",
    polarity: "Masculine/Yang",
    polarityChinese: "\u9633\u6027",
    loveStyle: "Passionate, direct, initiating, conquering",
    loveStyleChinese: "\u70ED\u60C5\u3001\u76F4\u63A5\u3001\u4E3B\u52A8\u51FA\u51FB\u3001\u5F81\u670D\u578B",
    communicationStyle: "Blunt, energetic, action-oriented",
    communicationStyleChinese: "\u76F4\u7387\u3001\u5145\u6EE1\u6D3B\u529B\u3001\u884C\u52A8\u5BFC\u5411",
    conflictStyle: "Confrontational, quick to anger but quick to forgive",
    conflictStyleChinese: "\u6B63\u9762\u51B2\u7A81\u3001\u6613\u6012\u4F46\u4E5F\u6613\u6D88\u6C14",
    attachmentTendency: "Anxious-avoidant, needs excitement",
    attachmentTendencyChinese: "\u7126\u8651-\u56DE\u907F\u578B\uFF0C\u9700\u8981\u523A\u6FC0\u611F",
    coreNeed: "Freedom and admiration",
    coreNeedChinese: "\u81EA\u7531\u4E0E\u88AB\u5D07\u62DC"
  },
  {
    id: "taurus",
    name: "Taurus",
    nameChinese: "\u91D1\u725B\u5EA7",
    symbol: "\u2649",
    element: "Earth",
    elementChinese: "\u571F",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Venus",
    rulingPlanetChinese: "\u91D1\u661F",
    polarity: "Feminine/Yin",
    polarityChinese: "\u9634\u6027",
    loveStyle: "Sensual, devoted, slow-building, possessive",
    loveStyleChinese: "\u611F\u5B98\u578B\u3001\u5FE0\u8BDA\u3001\u6162\u70ED\u3001\u5360\u6709\u6B32\u5F3A",
    communicationStyle: "Calm, deliberate, practical",
    communicationStyleChinese: "\u6C89\u7A33\u3001\u6DF1\u601D\u719F\u8651\u3001\u52A1\u5B9E",
    conflictStyle: "Avoidant until pushed, then stubborn and immovable",
    conflictStyleChinese: "\u56DE\u907F\u76F4\u5230\u88AB\u903C\u6025\uFF0C\u7136\u540E\u56FA\u6267\u4E0D\u52A8\u6447",
    attachmentTendency: "Secure but possessive",
    attachmentTendencyChinese: "\u5B89\u5168\u578B\u4F46\u5360\u6709\u6B32\u5F3A",
    coreNeed: "Security and sensory comfort",
    coreNeedChinese: "\u5B89\u5168\u611F\u4E0E\u611F\u5B98\u8212\u9002"
  },
  {
    id: "gemini",
    name: "Gemini",
    nameChinese: "\u53CC\u5B50\u5EA7",
    symbol: "\u264A",
    element: "Air",
    elementChinese: "\u98CE",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Mercury",
    rulingPlanetChinese: "\u6C34\u661F",
    polarity: "Masculine/Yang",
    polarityChinese: "\u9633\u6027",
    loveStyle: "Playful, intellectual, flirtatious, variety-seeking",
    loveStyleChinese: "\u4FCF\u76AE\u3001\u667A\u6027\u3001\u5584\u4E8E\u8C03\u60C5\u3001\u8FFD\u6C42\u591A\u6837\u6027",
    communicationStyle: "Witty, fast-paced, curious, multi-topic",
    communicationStyleChinese: "\u673A\u667A\u3001\u8282\u594F\u5FEB\u3001\u597D\u5947\u3001\u591A\u8BDD\u9898",
    conflictStyle: "Deflects with humor, intellectualizes emotions",
    conflictStyleChinese: "\u7528\u5E7D\u9ED8\u8F6C\u79FB\u3001\u5C06\u60C5\u611F\u7406\u667A\u5316",
    attachmentTendency: "Avoidant, fears being trapped",
    attachmentTendencyChinese: "\u56DE\u907F\u578B\uFF0C\u5BB3\u6015\u88AB\u675F\u7F1A",
    coreNeed: "Mental stimulation and variety",
    coreNeedChinese: "\u7CBE\u795E\u523A\u6FC0\u4E0E\u591A\u6837\u6027"
  },
  {
    id: "cancer",
    name: "Cancer",
    nameChinese: "\u5DE8\u87F9\u5EA7",
    symbol: "\u264B",
    element: "Water",
    elementChinese: "\u6C34",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Moon",
    rulingPlanetChinese: "\u6708\u4EAE",
    polarity: "Feminine/Yin",
    polarityChinese: "\u9634\u6027",
    loveStyle: "Nurturing, protective, emotionally deep, family-oriented",
    loveStyleChinese: "\u6ECB\u517B\u578B\u3001\u4FDD\u62A4\u6B32\u5F3A\u3001\u60C5\u611F\u6DF1\u6C89\u3001\u5BB6\u5EAD\u5BFC\u5411",
    communicationStyle: "Emotional, intuitive, indirect, empathetic",
    communicationStyleChinese: "\u60C5\u611F\u5316\u3001\u76F4\u89C9\u578B\u3001\u95F4\u63A5\u3001\u6709\u5171\u60C5\u529B",
    conflictStyle: "Retreats into shell, passive-aggressive, holds grudges",
    conflictStyleChinese: "\u9000\u7F29\u5230\u58F3\u4E2D\u3001\u88AB\u52A8\u653B\u51FB\u3001\u8BB0\u4EC7",
    attachmentTendency: "Anxious, needs constant reassurance",
    attachmentTendencyChinese: "\u7126\u8651\u578B\uFF0C\u9700\u8981\u6301\u7EED\u7684\u5B89\u5168\u611F\u786E\u8BA4",
    coreNeed: "Emotional security and belonging",
    coreNeedChinese: "\u60C5\u611F\u5B89\u5168\u611F\u4E0E\u5F52\u5C5E\u611F"
  },
  {
    id: "leo",
    name: "Leo",
    nameChinese: "\u72EE\u5B50\u5EA7",
    symbol: "\u264C",
    element: "Fire",
    elementChinese: "\u706B",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Sun",
    rulingPlanetChinese: "\u592A\u9633",
    polarity: "Masculine/Yang",
    polarityChinese: "\u9633\u6027",
    loveStyle: "Generous, dramatic, loyal, attention-seeking",
    loveStyleChinese: "\u6177\u6168\u3001\u620F\u5267\u5316\u3001\u5FE0\u8BDA\u3001\u6E34\u671B\u5173\u6CE8",
    communicationStyle: "Warm, expressive, storytelling, commanding",
    communicationStyleChinese: "\u6E29\u6696\u3001\u8868\u8FBE\u529B\u5F3A\u3001\u5584\u4E8E\u8BB2\u6545\u4E8B\u3001\u6709\u53F7\u53EC\u529B",
    conflictStyle: "Dramatic, needs to feel respected, ego-driven",
    conflictStyleChinese: "\u620F\u5267\u5316\u3001\u9700\u8981\u88AB\u5C0A\u91CD\u3001\u81EA\u5C0A\u9A71\u52A8",
    attachmentTendency: "Secure when admired, anxious when ignored",
    attachmentTendencyChinese: "\u88AB\u5D07\u62DC\u65F6\u5B89\u5168\uFF0C\u88AB\u5FFD\u89C6\u65F6\u7126\u8651",
    coreNeed: "Recognition and creative expression",
    coreNeedChinese: "\u88AB\u8BA4\u53EF\u4E0E\u521B\u9020\u6027\u8868\u8FBE"
  },
  {
    id: "virgo",
    name: "Virgo",
    nameChinese: "\u5904\u5973\u5EA7",
    symbol: "\u264D",
    element: "Earth",
    elementChinese: "\u571F",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Mercury",
    rulingPlanetChinese: "\u6C34\u661F",
    polarity: "Feminine/Yin",
    polarityChinese: "\u9634\u6027",
    loveStyle: "Service-oriented, attentive to detail, practical care",
    loveStyleChinese: "\u670D\u52A1\u578B\u3001\u6CE8\u91CD\u7EC6\u8282\u3001\u5B9E\u9645\u5173\u6000",
    communicationStyle: "Precise, analytical, helpful, sometimes critical",
    communicationStyleChinese: "\u7CBE\u786E\u3001\u5206\u6790\u578B\u3001\u4E50\u4E8E\u52A9\u4EBA\u3001\u6709\u65F6\u6311\u5254",
    conflictStyle: "Criticizes details, worries excessively, internalizes",
    conflictStyleChinese: "\u6311\u5254\u7EC6\u8282\u3001\u8FC7\u5EA6\u62C5\u5FE7\u3001\u5185\u5316\u60C5\u7EEA",
    attachmentTendency: "Anxious, shows love through acts of service",
    attachmentTendencyChinese: "\u7126\u8651\u578B\uFF0C\u901A\u8FC7\u670D\u52A1\u884C\u4E3A\u8868\u8FBE\u7231",
    coreNeed: "Order, usefulness, and being needed",
    coreNeedChinese: "\u79E9\u5E8F\u3001\u6709\u7528\u611F\u4E0E\u88AB\u9700\u8981"
  },
  {
    id: "libra",
    name: "Libra",
    nameChinese: "\u5929\u79E4\u5EA7",
    symbol: "\u264E",
    element: "Air",
    elementChinese: "\u98CE",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Venus",
    rulingPlanetChinese: "\u91D1\u661F",
    polarity: "Masculine/Yang",
    polarityChinese: "\u9633\u6027",
    loveStyle: "Romantic, partnership-focused, harmonious, idealistic",
    loveStyleChinese: "\u6D6A\u6F2B\u3001\u4EE5\u4F34\u4FA3\u5173\u7CFB\u4E3A\u4E2D\u5FC3\u3001\u548C\u8C10\u3001\u7406\u60F3\u4E3B\u4E49",
    communicationStyle: "Diplomatic, charming, balanced, people-pleasing",
    communicationStyleChinese: "\u5916\u4EA4\u578B\u3001\u6709\u9B45\u529B\u3001\u5E73\u8861\u3001\u8BA8\u597D\u578B",
    conflictStyle: "Avoids confrontation, seeks compromise, passive",
    conflictStyleChinese: "\u56DE\u907F\u51B2\u7A81\u3001\u5BFB\u6C42\u59A5\u534F\u3001\u88AB\u52A8",
    attachmentTendency: "Anxious, defines self through relationships",
    attachmentTendencyChinese: "\u7126\u8651\u578B\uFF0C\u901A\u8FC7\u5173\u7CFB\u5B9A\u4E49\u81EA\u6211",
    coreNeed: "Harmony and partnership",
    coreNeedChinese: "\u548C\u8C10\u4E0E\u4F34\u4FA3\u5173\u7CFB"
  },
  {
    id: "scorpio",
    name: "Scorpio",
    nameChinese: "\u5929\u874E\u5EA7",
    symbol: "\u264F",
    element: "Water",
    elementChinese: "\u6C34",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Pluto/Mars",
    rulingPlanetChinese: "\u51A5\u738B\u661F/\u706B\u661F",
    polarity: "Feminine/Yin",
    polarityChinese: "\u9634\u6027",
    loveStyle: "Intense, all-or-nothing, transformative, possessive",
    loveStyleChinese: "\u5F3A\u70C8\u3001\u5168\u60C5\u6295\u5165\u3001\u53D8\u9769\u6027\u3001\u5360\u6709\u6B32\u5F3A",
    communicationStyle: "Probing, secretive, strategic, emotionally intense",
    communicationStyleChinese: "\u63A2\u7A76\u578B\u3001\u795E\u79D8\u3001\u6709\u7B56\u7565\u3001\u60C5\u611F\u5F3A\u70C8",
    conflictStyle: "Strategic, vindictive, tests loyalty, power struggles",
    conflictStyleChinese: "\u7B56\u7565\u578B\u3001\u62A5\u590D\u6027\u3001\u8003\u9A8C\u5FE0\u8BDA\u3001\u6743\u529B\u6597\u4E89",
    attachmentTendency: "Fearful-avoidant, craves deep intimacy but fears betrayal",
    attachmentTendencyChinese: "\u6050\u60E7-\u56DE\u907F\u578B\uFF0C\u6E34\u671B\u6DF1\u5EA6\u4EB2\u5BC6\u4F46\u5BB3\u6015\u80CC\u53DB",
    coreNeed: "Deep emotional truth and trust",
    coreNeedChinese: "\u6DF1\u5C42\u60C5\u611F\u771F\u76F8\u4E0E\u4FE1\u4EFB"
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    nameChinese: "\u5C04\u624B\u5EA7",
    symbol: "\u2650",
    element: "Fire",
    elementChinese: "\u706B",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Jupiter",
    rulingPlanetChinese: "\u6728\u661F",
    polarity: "Masculine/Yang",
    polarityChinese: "\u9633\u6027",
    loveStyle: "Adventurous, freedom-loving, philosophical, commitment-wary",
    loveStyleChinese: "\u5192\u9669\u578B\u3001\u70ED\u7231\u81EA\u7531\u3001\u54F2\u5B66\u6027\u3001\u5BF9\u627F\u8BFA\u8C28\u614E",
    communicationStyle: "Honest, enthusiastic, philosophical, blunt",
    communicationStyleChinese: "\u8BDA\u5B9E\u3001\u70ED\u60C5\u3001\u54F2\u5B66\u6027\u3001\u76F4\u8A00\u4E0D\u8BB3",
    conflictStyle: "Escapes, uses humor, becomes preachy",
    conflictStyleChinese: "\u9003\u907F\u3001\u7528\u5E7D\u9ED8\u5316\u89E3\u3001\u53D8\u5F97\u8BF4\u6559",
    attachmentTendency: "Avoidant, needs space and adventure",
    attachmentTendencyChinese: "\u56DE\u907F\u578B\uFF0C\u9700\u8981\u7A7A\u95F4\u548C\u5192\u9669",
    coreNeed: "Freedom and meaning",
    coreNeedChinese: "\u81EA\u7531\u4E0E\u610F\u4E49"
  },
  {
    id: "capricorn",
    name: "Capricorn",
    nameChinese: "\u6469\u7FAF\u5EA7",
    symbol: "\u2651",
    element: "Earth",
    elementChinese: "\u571F",
    modality: "Cardinal",
    modalityChinese: "\u5F00\u521B",
    rulingPlanet: "Saturn",
    rulingPlanetChinese: "\u571F\u661F",
    polarity: "Feminine/Yin",
    polarityChinese: "\u9634\u6027",
    loveStyle: "Traditional, ambitious, provider, slow to open up",
    loveStyleChinese: "\u4F20\u7EDF\u578B\u3001\u6709\u91CE\u5FC3\u3001\u4F9B\u517B\u8005\u3001\u6162\u70ED",
    communicationStyle: "Reserved, practical, goal-oriented, authoritative",
    communicationStyleChinese: "\u5185\u655B\u3001\u52A1\u5B9E\u3001\u76EE\u6807\u5BFC\u5411\u3001\u6709\u6743\u5A01\u611F",
    conflictStyle: "Cold withdrawal, uses logic, emotionally distant",
    conflictStyleChinese: "\u51B7\u6DE1\u9000\u7F29\u3001\u7528\u903B\u8F91\u3001\u60C5\u611F\u758F\u79BB",
    attachmentTendency: "Avoidant, shows love through providing",
    attachmentTendencyChinese: "\u56DE\u907F\u578B\uFF0C\u901A\u8FC7\u4F9B\u517B\u8868\u8FBE\u7231",
    coreNeed: "Achievement and respect",
    coreNeedChinese: "\u6210\u5C31\u4E0E\u5C0A\u91CD"
  },
  {
    id: "aquarius",
    name: "Aquarius",
    nameChinese: "\u6C34\u74F6\u5EA7",
    symbol: "\u2652",
    element: "Air",
    elementChinese: "\u98CE",
    modality: "Fixed",
    modalityChinese: "\u56FA\u5B9A",
    rulingPlanet: "Uranus/Saturn",
    rulingPlanetChinese: "\u5929\u738B\u661F/\u571F\u661F",
    polarity: "Masculine/Yang",
    polarityChinese: "\u9633\u6027",
    loveStyle: "Unconventional, friendship-based, intellectual, detached",
    loveStyleChinese: "\u975E\u4F20\u7EDF\u3001\u4EE5\u53CB\u8C0A\u4E3A\u57FA\u7840\u3001\u667A\u6027\u3001\u8D85\u7136",
    communicationStyle: "Innovative, abstract, humanitarian, sometimes aloof",
    communicationStyleChinese: "\u521B\u65B0\u3001\u62BD\u8C61\u3001\u4EBA\u9053\u4E3B\u4E49\u3001\u6709\u65F6\u51B7\u6F20",
    conflictStyle: "Intellectualizes, detaches emotionally, stubborn in beliefs",
    conflictStyleChinese: "\u7406\u667A\u5316\u3001\u60C5\u611F\u62BD\u79BB\u3001\u4FE1\u5FF5\u56FA\u6267",
    attachmentTendency: "Avoidant, values independence above all",
    attachmentTendencyChinese: "\u56DE\u907F\u578B\uFF0C\u72EC\u7ACB\u6027\u9AD8\u4E8E\u4E00\u5207",
    coreNeed: "Intellectual freedom and humanitarian purpose",
    coreNeedChinese: "\u601D\u60F3\u81EA\u7531\u4E0E\u4EBA\u9053\u4E3B\u4E49\u4F7F\u547D"
  },
  {
    id: "pisces",
    name: "Pisces",
    nameChinese: "\u53CC\u9C7C\u5EA7",
    symbol: "\u2653",
    element: "Water",
    elementChinese: "\u6C34",
    modality: "Mutable",
    modalityChinese: "\u53D8\u52A8",
    rulingPlanet: "Neptune/Jupiter",
    rulingPlanetChinese: "\u6D77\u738B\u661F/\u6728\u661F",
    polarity: "Feminine/Yin",
    polarityChinese: "\u9634\u6027",
    loveStyle: "Dreamy, self-sacrificing, empathic, boundary-less",
    loveStyleChinese: "\u68A6\u5E7B\u3001\u81EA\u6211\u727A\u7272\u3001\u5171\u60C5\u3001\u65E0\u8FB9\u754C\u611F",
    communicationStyle: "Intuitive, poetic, evasive, emotionally absorbing",
    communicationStyleChinese: "\u76F4\u89C9\u578B\u3001\u8BD7\u610F\u3001\u56DE\u907F\u6027\u3001\u60C5\u611F\u5438\u6536\u578B",
    conflictStyle: "Avoids, plays victim, escapes into fantasy",
    conflictStyleChinese: "\u56DE\u907F\u3001\u626E\u6F14\u53D7\u5BB3\u8005\u3001\u9003\u5165\u5E7B\u60F3",
    attachmentTendency: "Anxious, merges with partner, loses self",
    attachmentTendencyChinese: "\u7126\u8651\u578B\uFF0C\u4E0E\u4F34\u4FA3\u878D\u5408\u3001\u5931\u53BB\u81EA\u6211",
    coreNeed: "Spiritual connection and unconditional love",
    coreNeedChinese: "\u7075\u6027\u8FDE\u63A5\u4E0E\u65E0\u6761\u4EF6\u7684\u7231"
  }
];
function getZodiacMeta(id) {
  return ZODIAC_META.find((s) => s.id === id);
}
var ELEMENT_COMPATIBILITY = {
  Fire: {
    Fire: { score: 80, dynamic: "Passionate and exciting but can burn out without grounding", dynamicChinese: "\u6FC0\u60C5\u56DB\u5C04\u4F46\u7F3A\u4E4F\u7A33\u5B9A\u53EF\u80FD\u71C3\u5C3D" },
    Earth: { score: 55, dynamic: "Fire inspires, Earth stabilizes \u2014 needs patience", dynamicChinese: "\u706B\u6FC0\u52B1\uFF0C\u571F\u7A33\u5B9A\u2014\u2014\u9700\u8981\u8010\u5FC3" },
    Air: { score: 90, dynamic: "Air fans Fire's flames \u2014 intellectually and passionately stimulating", dynamicChinese: "\u98CE\u52A9\u706B\u52BF\u2014\u2014\u667A\u6027\u4E0E\u6FC0\u60C5\u7684\u53CC\u91CD\u523A\u6FC0" },
    Water: { score: 45, dynamic: "Steam or extinguished \u2014 intense but emotionally challenging", dynamicChinese: "\u84B8\u6C7D\u6216\u7184\u706D\u2014\u2014\u5F3A\u70C8\u4F46\u60C5\u611F\u4E0A\u5145\u6EE1\u6311\u6218" }
  },
  Earth: {
    Fire: { score: 55, dynamic: "Grounding meets passion \u2014 complementary if respectful", dynamicChinese: "\u7A33\u5B9A\u9047\u4E0A\u6FC0\u60C5\u2014\u2014\u4E92\u76F8\u5C0A\u91CD\u5219\u4E92\u8865" },
    Earth: { score: 85, dynamic: "Stable and reliable but may lack excitement", dynamicChinese: "\u7A33\u5B9A\u53EF\u9760\u4F46\u53EF\u80FD\u7F3A\u4E4F\u6FC0\u60C5" },
    Air: { score: 50, dynamic: "Different wavelengths \u2014 Earth is practical, Air is theoretical", dynamicChinese: "\u4E0D\u540C\u9891\u7387\u2014\u2014\u571F\u52A1\u5B9E\uFF0C\u98CE\u7406\u8BBA" },
    Water: { score: 88, dynamic: "Nurturing and fertile \u2014 emotionally and materially supportive", dynamicChinese: "\u6ECB\u517B\u4E0E\u4E30\u9976\u2014\u2014\u60C5\u611F\u548C\u7269\u8D28\u4E0A\u4E92\u76F8\u652F\u6301" }
  },
  Air: {
    Fire: { score: 90, dynamic: "Exciting and dynamic \u2014 ideas meet action", dynamicChinese: "\u6FC0\u52A8\u4EBA\u5FC3\u2014\u2014\u601D\u60F3\u9047\u4E0A\u884C\u52A8" },
    Earth: { score: 50, dynamic: "Head vs hands \u2014 can learn from each other", dynamicChinese: "\u5934\u8111vs\u53CC\u624B\u2014\u2014\u53EF\u4EE5\u4E92\u76F8\u5B66\u4E60" },
    Air: { score: 75, dynamic: "Intellectually stimulating but may lack emotional depth", dynamicChinese: "\u667A\u6027\u523A\u6FC0\u4F46\u53EF\u80FD\u7F3A\u4E4F\u60C5\u611F\u6DF1\u5EA6" },
    Water: { score: 55, dynamic: "Mist \u2014 beautiful but confusing, logic meets emotion", dynamicChinese: "\u8584\u96FE\u2014\u2014\u7F8E\u4E3D\u4F46\u56F0\u60D1\uFF0C\u903B\u8F91\u9047\u4E0A\u60C5\u611F" }
  },
  Water: {
    Fire: { score: 45, dynamic: "Intense chemistry but fundamental tension", dynamicChinese: "\u5F3A\u70C8\u5316\u5B66\u53CD\u5E94\u4F46\u6839\u672C\u6027\u5F20\u529B" },
    Earth: { score: 88, dynamic: "Deep roots \u2014 emotionally rich and stable", dynamicChinese: "\u6DF1\u6839\u2014\u2014\u60C5\u611F\u4E30\u5BCC\u4E14\u7A33\u5B9A" },
    Air: { score: 55, dynamic: "Waves and wind \u2014 stimulating but turbulent", dynamicChinese: "\u6CE2\u6D6A\u4E0E\u98CE\u2014\u2014\u523A\u6FC0\u4F46\u52A8\u8361" },
    Water: { score: 82, dynamic: "Oceanic depth \u2014 profoundly empathic but may drown in emotion", dynamicChinese: "\u6D77\u6D0B\u822C\u6DF1\u9083\u2014\u2014\u6DF1\u5EA6\u5171\u60C5\u4F46\u53EF\u80FD\u6EBA\u4E8E\u60C5\u611F" }
  }
};
var MODALITY_COMPATIBILITY = {
  Cardinal: {
    Cardinal: { score: 65, dynamic: "Both want to lead \u2014 power struggles likely", dynamicChinese: "\u90FD\u60F3\u9886\u5BFC\u2014\u2014\u6743\u529B\u6597\u4E89\u5728\u6240\u96BE\u514D" },
    Fixed: { score: 75, dynamic: "Initiator meets sustainer \u2014 complementary if flexible", dynamicChinese: "\u53D1\u8D77\u8005\u9047\u4E0A\u575A\u5B88\u8005\u2014\u2014\u7075\u6D3B\u5219\u4E92\u8865" },
    Mutable: { score: 80, dynamic: "Leader meets adapter \u2014 smooth dynamic", dynamicChinese: "\u9886\u5BFC\u8005\u9047\u4E0A\u9002\u5E94\u8005\u2014\u2014\u987A\u7545\u7684\u52A8\u6001" }
  },
  Fixed: {
    Cardinal: { score: 75, dynamic: "Stability meets initiative \u2014 balanced partnership", dynamicChinese: "\u7A33\u5B9A\u9047\u4E0A\u4E3B\u52A8\u2014\u2014\u5E73\u8861\u7684\u4F19\u4F34\u5173\u7CFB" },
    Fixed: { score: 60, dynamic: "Immovable meets immovable \u2014 deep loyalty but stubborn standoffs", dynamicChinese: "\u4E0D\u53EF\u52A8\u6447\u9047\u4E0A\u4E0D\u53EF\u52A8\u6447\u2014\u2014\u6DF1\u5EA6\u5FE0\u8BDA\u4F46\u56FA\u6267\u5BF9\u5CD9" },
    Mutable: { score: 78, dynamic: "Anchor meets flow \u2014 grounding and adaptable", dynamicChinese: "\u951A\u9047\u4E0A\u6D41\u6C34\u2014\u2014\u624E\u6839\u4E14\u7075\u6D3B" }
  },
  Mutable: {
    Cardinal: { score: 80, dynamic: "Flexible support for the leader \u2014 harmonious", dynamicChinese: "\u7075\u6D3B\u652F\u6301\u9886\u5BFC\u8005\u2014\u2014\u548C\u8C10" },
    Fixed: { score: 78, dynamic: "Adaptability meets determination \u2014 balanced", dynamicChinese: "\u9002\u5E94\u529B\u9047\u4E0A\u51B3\u5FC3\u2014\u2014\u5E73\u8861" },
    Mutable: { score: 70, dynamic: "Both flexible but may lack direction", dynamicChinese: "\u90FD\u7075\u6D3B\u4F46\u53EF\u80FD\u7F3A\u4E4F\u65B9\u5411" }
  }
};
function getPolarityScore(p1, p2) {
  if (p1 === p2) {
    return { score: 70, dynamic: "Same polarity \u2014 understanding but may lack spark", dynamicChinese: "\u76F8\u540C\u6781\u6027\u2014\u2014\u7406\u89E3\u4F46\u53EF\u80FD\u7F3A\u4E4F\u706B\u82B1" };
  }
  return { score: 85, dynamic: "Complementary polarities \u2014 magnetic attraction, yin-yang balance", dynamicChinese: "\u4E92\u8865\u6781\u6027\u2014\u2014\u78C1\u6027\u5438\u5F15\uFF0C\u9634\u9633\u5E73\u8861" };
}
function calculateCompatibility(sign1, sign2) {
  const elementCompat = ELEMENT_COMPATIBILITY[sign1.element][sign2.element];
  const modalityCompat = MODALITY_COMPATIBILITY[sign1.modality][sign2.modality];
  const polarityCompat = getPolarityScore(sign1.polarity, sign2.polarity);
  const overallScore = Math.round(
    elementCompat.score * 0.4 + modalityCompat.score * 0.3 + polarityCompat.score * 0.3
  );
  return {
    overallScore,
    elementCompat,
    modalityCompat,
    polarityCompat
  };
}
function formatCompatibilityForPrompt(sign1, sign2, compat, language) {
  const isEn = language === "en";
  if (isEn) {
    return `=== Compatibility Analysis Data ===

--- Person A: ${sign1.name} (${sign1.symbol}) ---
Element: ${sign1.element} | Modality: ${sign1.modality} | Ruling Planet: ${sign1.rulingPlanet}
Polarity: ${sign1.polarity}
Love Style: ${sign1.loveStyle}
Communication Style: ${sign1.communicationStyle}
Conflict Style: ${sign1.conflictStyle}
Attachment Tendency: ${sign1.attachmentTendency}
Core Need: ${sign1.coreNeed}

--- Person B: ${sign2.name} (${sign2.symbol}) ---
Element: ${sign2.element} | Modality: ${sign2.modality} | Ruling Planet: ${sign2.rulingPlanet}
Polarity: ${sign2.polarity}
Love Style: ${sign2.loveStyle}
Communication Style: ${sign2.communicationStyle}
Conflict Style: ${sign2.conflictStyle}
Attachment Tendency: ${sign2.attachmentTendency}
Core Need: ${sign2.coreNeed}

--- Astrological Compatibility Metrics ---
Element Interaction (${sign1.element} \xD7 ${sign2.element}): Score ${compat.elementCompat.score}/100 \u2014 ${compat.elementCompat.dynamic}
Modality Interaction (${sign1.modality} \xD7 ${sign2.modality}): Score ${compat.modalityCompat.score}/100 \u2014 ${compat.modalityCompat.dynamic}
Polarity Interaction: Score ${compat.polarityCompat.score}/100 \u2014 ${compat.polarityCompat.dynamic}
Composite Score: ${compat.overallScore}/100`;
  }
  return `=== \u517C\u5BB9\u6027\u5206\u6790\u6570\u636E ===

--- \u7532\u65B9\uFF1A${sign1.nameChinese}\uFF08${sign1.symbol}\uFF09---
\u5143\u7D20\uFF1A${sign1.elementChinese} | \u6A21\u5F0F\uFF1A${sign1.modalityChinese} | \u5B88\u62A4\u661F\uFF1A${sign1.rulingPlanetChinese}
\u6781\u6027\uFF1A${sign1.polarityChinese}
\u7231\u60C5\u98CE\u683C\uFF1A${sign1.loveStyleChinese}
\u6C9F\u901A\u98CE\u683C\uFF1A${sign1.communicationStyleChinese}
\u51B2\u7A81\u98CE\u683C\uFF1A${sign1.conflictStyleChinese}
\u4F9D\u604B\u503E\u5411\uFF1A${sign1.attachmentTendencyChinese}
\u6838\u5FC3\u9700\u6C42\uFF1A${sign1.coreNeedChinese}

--- \u4E59\u65B9\uFF1A${sign2.nameChinese}\uFF08${sign2.symbol}\uFF09---
\u5143\u7D20\uFF1A${sign2.elementChinese} | \u6A21\u5F0F\uFF1A${sign2.modalityChinese} | \u5B88\u62A4\u661F\uFF1A${sign2.rulingPlanetChinese}
\u6781\u6027\uFF1A${sign2.polarityChinese}
\u7231\u60C5\u98CE\u683C\uFF1A${sign2.loveStyleChinese}
\u6C9F\u901A\u98CE\u683C\uFF1A${sign2.communicationStyleChinese}
\u51B2\u7A81\u98CE\u683C\uFF1A${sign2.conflictStyleChinese}
\u4F9D\u604B\u503E\u5411\uFF1A${sign2.attachmentTendencyChinese}
\u6838\u5FC3\u9700\u6C42\uFF1A${sign2.coreNeedChinese}

--- \u5360\u661F\u517C\u5BB9\u6027\u6307\u6807 ---
\u5143\u7D20\u4E92\u52A8\uFF08${sign1.elementChinese} \xD7 ${sign2.elementChinese}\uFF09\uFF1A${compat.elementCompat.score}/100 \u2014 ${compat.elementCompat.dynamicChinese}
\u6A21\u5F0F\u4E92\u52A8\uFF08${sign1.modalityChinese} \xD7 ${sign2.modalityChinese}\uFF09\uFF1A${compat.modalityCompat.score}/100 \u2014 ${compat.modalityCompat.dynamicChinese}
\u6781\u6027\u4E92\u52A8\uFF1A${compat.polarityCompat.score}/100 \u2014 ${compat.polarityCompat.dynamicChinese}
\u7EFC\u5408\u8BC4\u5206\uFF1A${compat.overallScore}/100`;
}
var compatibilityRouter = router({
  // Get all zodiac signs for selection
  getSigns: publicProcedure.query(() => {
    return ZODIAC_META.map((s) => ({
      id: s.id,
      name: s.name,
      nameChinese: s.nameChinese,
      symbol: s.symbol,
      element: s.element,
      elementChinese: s.elementChinese
    }));
  }),
  // Quick compatibility score (no LLM, instant)
  getQuickScore: publicProcedure.input(z9.object({
    sign1: z9.string(),
    sign2: z9.string()
  })).query(({ input }) => {
    const meta1 = getZodiacMeta(input.sign1);
    const meta2 = getZodiacMeta(input.sign2);
    if (!meta1 || !meta2) throw new Error("Invalid zodiac sign");
    const compat = calculateCompatibility(meta1, meta2);
    return {
      overallScore: compat.overallScore,
      elementScore: compat.elementCompat.score,
      modalityScore: compat.modalityCompat.score,
      polarityScore: compat.polarityCompat.score,
      sign1: { name: meta1.name, nameChinese: meta1.nameChinese, symbol: meta1.symbol, element: meta1.element, elementChinese: meta1.elementChinese },
      sign2: { name: meta2.name, nameChinese: meta2.nameChinese, symbol: meta2.symbol, element: meta2.element, elementChinese: meta2.elementChinese }
    };
  }),
  // Full deep compatibility analysis (LLM)
  analyze: publicProcedure.input(z9.object({
    person1Name: z9.string().optional().default(""),
    person1Sign: z9.string(),
    person2Name: z9.string().optional().default(""),
    person2Sign: z9.string(),
    language: z9.enum(["zh", "en"]).optional().default("zh")
  })).mutation(async ({ input, ctx }) => {
    const { person1Name, person1Sign, person2Name, person2Sign, language } = input;
    const isEn = language === "en";
    const meta1 = getZodiacMeta(person1Sign);
    const meta2 = getZodiacMeta(person2Sign);
    if (!meta1 || !meta2) throw new Error("Invalid zodiac sign");
    const compat = calculateCompatibility(meta1, meta2);
    const compatData = formatCompatibilityForPrompt(meta1, meta2, compat, language);
    const name1 = person1Name || (isEn ? "Person A" : "\u7532\u65B9");
    const name2 = person2Name || (isEn ? "Person B" : "\u4E59\u65B9");
    const systemPrompt = isEn ? `You are a master relationship astrologer with 30 years of experience in synastry (relationship chart analysis), combining Western astrology, Jungian psychology, and attachment theory. You create deeply insightful, multi-dimensional compatibility reports that reveal the hidden dynamics between two people.

IMPORTANT RULES:
- Base your analysis on the actual astrological properties: element interaction, modality dynamics, planetary rulers, and polarity
- Incorporate psychological frameworks: attachment styles, love languages, communication patterns, and shadow dynamics
- Each section should be substantive (5-8 sentences minimum), providing genuine insight \u2014 not generic platitudes
- Be honest about challenges while offering constructive growth paths
- Reference specific astrological symbolism (planetary rulers, element interactions) throughout
- Use warm, wise, and compassionate language befitting a seasoned relationship counselor
- Scores should reflect genuine astrological compatibility, not artificially inflated numbers

FORMAT your response with these 10 sections:

## \u{1F4AB} Cosmic Connection Overview
Synthesize the overall energetic signature of this pairing in 5-8 sentences. Describe the fundamental nature of their connection \u2014 is it magnetic, challenging, harmonious, or transformative? Reference the element and modality interaction. Set the tone for the entire reading.

## \u{1F525} Passion & Physical Chemistry
Analyze the physical and passionate dimension in 5-8 sentences. How do their Mars energies interact? What is the sexual and physical chemistry like? Is the attraction instant or slow-building? What keeps the spark alive or threatens to extinguish it?

## \u{1F495} Emotional Resonance & Love Language
Explore emotional compatibility in 5-8 sentences. How do their Moon energies (emotional needs) align? Do they speak the same love language? How does each person's attachment style interact with the other's? What emotional patterns emerge?

## \u{1F5E3}\uFE0F Communication & Intellectual Bond
Analyze how they communicate and connect mentally in 5-8 sentences. How do their Mercury energies interact? Can they have deep conversations? How do they handle disagreements verbally? Is there intellectual stimulation or frustration?

## \u{1F91D} Trust & Loyalty Dynamics
Examine the trust foundation in 5-8 sentences. How do their Saturn and Pluto energies affect commitment? What are each person's loyalty patterns? Where might jealousy, possessiveness, or trust issues arise? How can they build unshakeable trust?

## \u{1F331} Growth & Evolution Together
Explore how they catalyze each other's growth in 5-8 sentences. What lessons does each person bring to the other? How do their Jupiter energies expand each other's horizons? What personal transformations does this relationship trigger?

## \u26A1 Conflict Patterns & Resolution
Analyze how they fight and resolve conflict in 5-8 sentences. Based on their conflict styles, what recurring arguments are likely? What triggers each person? What resolution strategies work best for this specific pairing?

## \u{1F3E0} Long-Term & Domestic Harmony
Assess long-term compatibility in 5-8 sentences. How do their values around home, family, finances, and lifestyle align? What does daily life look like together? Are their life goals compatible? What compromises are needed?

## \u{1F319} Shadow Work & Hidden Challenges
Reveal the unconscious dynamics in 5-8 sentences. What shadow aspects does each person project onto the other? What unresolved wounds might this relationship trigger? How can they do shadow work together to deepen their bond?

## \u2728 Cosmic Blessing & Guidance
Provide 2-3 relationship affirmations specific to this pairing. End with a wise cosmic message about the highest potential of this union and practical advice for nurturing it.

After the 10 sections, provide scores in a JSON block:
\`\`\`json
{"loveScore": <1-100>, "passionScore": <1-100>, "communicationScore": <1-100>, "trustScore": <1-100>, "growthScore": <1-100>, "longTermScore": <1-100>, "summary": "<one-line relationship summary>"}
\`\`\`` : `\u4F60\u662F\u4E00\u4F4D\u62E5\u670930\u5E74\u7ECF\u9A8C\u7684\u5173\u7CFB\u5360\u661F\u5927\u5E08\uFF0C\u7CBE\u901A\u5408\u76D8\u5206\u6790\uFF08synastry\uFF09\uFF0C\u878D\u5408\u897F\u65B9\u5360\u661F\u672F\u3001\u8363\u683C\u5FC3\u7406\u5B66\u548C\u4F9D\u604B\u7406\u8BBA\u3002\u4F60\u521B\u4F5C\u6DF1\u5165\u3001\u591A\u7EF4\u5EA6\u7684\u517C\u5BB9\u6027\u62A5\u544A\uFF0C\u63ED\u793A\u4E24\u4E2A\u4EBA\u4E4B\u95F4\u9690\u85CF\u7684\u52A8\u6001\u5173\u7CFB\u3002

\u91CD\u8981\u89C4\u5219\uFF1A
- \u57FA\u4E8E\u5B9E\u9645\u5360\u661F\u5C5E\u6027\u8FDB\u884C\u5206\u6790\uFF1A\u5143\u7D20\u4E92\u52A8\u3001\u6A21\u5F0F\u52A8\u6001\u3001\u884C\u661F\u5B88\u62A4\u548C\u6781\u6027
- \u878D\u5165\u5FC3\u7406\u5B66\u6846\u67B6\uFF1A\u4F9D\u604B\u98CE\u683C\u3001\u7231\u7684\u8BED\u8A00\u3001\u6C9F\u901A\u6A21\u5F0F\u548C\u9634\u5F71\u52A8\u6001
- \u6BCF\u4E2A\u7EF4\u5EA6\u63D0\u4F9B\u6DF1\u5165\u5206\u6790\uFF085-8\u53E5\u8BDD\u4EE5\u4E0A\uFF09\uFF0C\u7ED9\u51FA\u771F\u6B63\u7684\u6D1E\u89C1\u2014\u2014\u800C\u975E\u6CDB\u6CDB\u4E4B\u8C08
- \u5BF9\u6311\u6218\u8BDA\u5B9E\uFF0C\u540C\u65F6\u63D0\u4F9B\u5EFA\u8BBE\u6027\u7684\u6210\u957F\u8DEF\u5F84
- \u5168\u6587\u5F15\u7528\u5177\u4F53\u7684\u5360\u661F\u8C61\u5F81\uFF08\u884C\u661F\u5B88\u62A4\u3001\u5143\u7D20\u4E92\u52A8\uFF09
- \u4F7F\u7528\u6E29\u6696\u3001\u667A\u6167\u3001\u5BCC\u6709\u540C\u7406\u5FC3\u7684\u8BED\u8A00\uFF0C\u4F53\u73B0\u8D44\u6DF1\u5173\u7CFB\u54A8\u8BE2\u5E08\u7684\u98CE\u8303
- \u8BC4\u5206\u5E94\u53CD\u6620\u771F\u5B9E\u7684\u5360\u661F\u517C\u5BB9\u6027\uFF0C\u4E0D\u8981\u4EBA\u4E3A\u62D4\u9AD8

\u683C\u5F0F\u8981\u6C42\uFF08\u5FC5\u987B\u5305\u542B\u4EE5\u4E0B10\u4E2A\u7EF4\u5EA6\uFF09\uFF1A

## \u{1F4AB} \u5B87\u5B99\u8FDE\u63A5\u6982\u89C8
\u75285-8\u53E5\u8BDD\u7EFC\u5408\u8FD9\u5BF9\u7EC4\u5408\u7684\u6574\u4F53\u80FD\u91CF\u7279\u5F81\u3002\u63CF\u8FF0\u4ED6\u4EEC\u8FDE\u63A5\u7684\u6839\u672C\u6027\u8D28\u2014\u2014\u662F\u78C1\u6027\u5438\u5F15\u3001\u5145\u6EE1\u6311\u6218\u3001\u548C\u8C10\u5171\u632F\u8FD8\u662F\u53D8\u9769\u6027\u7684\uFF1F\u5F15\u7528\u5143\u7D20\u548C\u6A21\u5F0F\u4E92\u52A8\u3002\u4E3A\u6574\u4E2A\u89E3\u8BFB\u5B9A\u4E0B\u57FA\u8C03\u3002

## \u{1F525} \u6FC0\u60C5\u4E0E\u8EAB\u4F53\u5316\u5B66\u53CD\u5E94
\u75285-8\u53E5\u8BDD\u5206\u6790\u8EAB\u4F53\u548C\u6FC0\u60C5\u7EF4\u5EA6\u3002\u4ED6\u4EEC\u7684\u706B\u661F\u80FD\u91CF\u5982\u4F55\u4E92\u52A8\uFF1F\u6027\u548C\u8EAB\u4F53\u5316\u5B66\u53CD\u5E94\u5982\u4F55\uFF1F\u5438\u5F15\u529B\u662F\u77AC\u95F4\u7684\u8FD8\u662F\u6162\u6162\u5EFA\u7ACB\u7684\uFF1F\u4EC0\u4E48\u80FD\u4FDD\u6301\u706B\u82B1\u6216\u5A01\u80C1\u7184\u706D\u5B83\uFF1F

## \u{1F495} \u60C5\u611F\u5171\u9E23\u4E0E\u7231\u7684\u8BED\u8A00
\u75285-8\u53E5\u8BDD\u63A2\u7D22\u60C5\u611F\u517C\u5BB9\u6027\u3002\u4ED6\u4EEC\u7684\u6708\u4EAE\u80FD\u91CF\uFF08\u60C5\u611F\u9700\u6C42\uFF09\u5982\u4F55\u5BF9\u9F50\uFF1F\u4ED6\u4EEC\u8BF4\u540C\u4E00\u79CD\u7231\u7684\u8BED\u8A00\u5417\uFF1F\u6BCF\u4E2A\u4EBA\u7684\u4F9D\u604B\u98CE\u683C\u5982\u4F55\u4E0E\u5BF9\u65B9\u4E92\u52A8\uFF1F\u4F1A\u51FA\u73B0\u4EC0\u4E48\u60C5\u611F\u6A21\u5F0F\uFF1F

## \u{1F5E3}\uFE0F \u6C9F\u901A\u4E0E\u667A\u6027\u7EBD\u5E26
\u75285-8\u53E5\u8BDD\u5206\u6790\u4ED6\u4EEC\u5982\u4F55\u6C9F\u901A\u548C\u7CBE\u795E\u8FDE\u63A5\u3002\u4ED6\u4EEC\u7684\u6C34\u661F\u80FD\u91CF\u5982\u4F55\u4E92\u52A8\uFF1F\u80FD\u5426\u8FDB\u884C\u6DF1\u5EA6\u5BF9\u8BDD\uFF1F\u5982\u4F55\u53E3\u5934\u5904\u7406\u5206\u6B67\uFF1F\u662F\u667A\u6027\u523A\u6FC0\u8FD8\u662F\u632B\u8D25\uFF1F

## \u{1F91D} \u4FE1\u4EFB\u4E0E\u5FE0\u8BDA\u52A8\u6001
\u75285-8\u53E5\u8BDD\u5BA1\u89C6\u4FE1\u4EFB\u57FA\u7840\u3002\u4ED6\u4EEC\u7684\u571F\u661F\u548C\u51A5\u738B\u661F\u80FD\u91CF\u5982\u4F55\u5F71\u54CD\u627F\u8BFA\uFF1F\u6BCF\u4E2A\u4EBA\u7684\u5FE0\u8BDA\u6A21\u5F0F\u662F\u4EC0\u4E48\uFF1F\u5AC9\u5992\u3001\u5360\u6709\u6B32\u6216\u4FE1\u4EFB\u95EE\u9898\u53EF\u80FD\u5728\u54EA\u91CC\u51FA\u73B0\uFF1F\u5982\u4F55\u5EFA\u7ACB\u7262\u4E0D\u53EF\u7834\u7684\u4FE1\u4EFB\uFF1F

## \u{1F331} \u5171\u540C\u6210\u957F\u4E0E\u8FDB\u5316
\u75285-8\u53E5\u8BDD\u63A2\u7D22\u4ED6\u4EEC\u5982\u4F55\u50AC\u5316\u5F7C\u6B64\u7684\u6210\u957F\u3002\u6BCF\u4E2A\u4EBA\u7ED9\u5BF9\u65B9\u5E26\u6765\u4EC0\u4E48\u529F\u8BFE\uFF1F\u4ED6\u4EEC\u7684\u6728\u661F\u80FD\u91CF\u5982\u4F55\u62D3\u5C55\u5F7C\u6B64\u7684\u89C6\u91CE\uFF1F\u8FD9\u6BB5\u5173\u7CFB\u89E6\u53D1\u4E86\u4EC0\u4E48\u4E2A\u4EBA\u8F6C\u53D8\uFF1F

## \u26A1 \u51B2\u7A81\u6A21\u5F0F\u4E0E\u5316\u89E3\u4E4B\u9053
\u75285-8\u53E5\u8BDD\u5206\u6790\u4ED6\u4EEC\u5982\u4F55\u4E89\u5435\u548C\u89E3\u51B3\u51B2\u7A81\u3002\u57FA\u4E8E\u4ED6\u4EEC\u7684\u51B2\u7A81\u98CE\u683C\uFF0C\u53EF\u80FD\u51FA\u73B0\u54EA\u4E9B\u53CD\u590D\u7684\u4E89\u8BBA\uFF1F\u4EC0\u4E48\u89E6\u53D1\u6BCF\u4E2A\u4EBA\uFF1F\u4EC0\u4E48\u5316\u89E3\u7B56\u7565\u6700\u9002\u5408\u8FD9\u5BF9\u7279\u5B9A\u7EC4\u5408\uFF1F

## \u{1F3E0} \u957F\u671F\u76F8\u5904\u4E0E\u5BB6\u5EAD\u548C\u8C10
\u75285-8\u53E5\u8BDD\u8BC4\u4F30\u957F\u671F\u517C\u5BB9\u6027\u3002\u4ED6\u4EEC\u5728\u5BB6\u5EAD\u3001\u5BB6\u4EBA\u3001\u8D22\u52A1\u548C\u751F\u6D3B\u65B9\u5F0F\u65B9\u9762\u7684\u4EF7\u503C\u89C2\u5982\u4F55\u5BF9\u9F50\uFF1F\u65E5\u5E38\u751F\u6D3B\u5728\u4E00\u8D77\u662F\u4EC0\u4E48\u6837\u7684\uFF1F\u4EBA\u751F\u76EE\u6807\u662F\u5426\u517C\u5BB9\uFF1F\u9700\u8981\u4EC0\u4E48\u59A5\u534F\uFF1F

## \u{1F319} \u9634\u5F71\u5DE5\u4F5C\u4E0E\u9690\u85CF\u6311\u6218
\u75285-8\u53E5\u8BDD\u63ED\u793A\u65E0\u610F\u8BC6\u52A8\u6001\u3002\u6BCF\u4E2A\u4EBA\u5C06\u4EC0\u4E48\u9634\u5F71\u9762\u6295\u5C04\u5230\u5BF9\u65B9\u8EAB\u4E0A\uFF1F\u8FD9\u6BB5\u5173\u7CFB\u53EF\u80FD\u89E6\u53D1\u4EC0\u4E48\u672A\u6108\u5408\u7684\u4F24\u53E3\uFF1F\u5982\u4F55\u4E00\u8D77\u505A\u9634\u5F71\u5DE5\u4F5C\u6765\u6DF1\u5316\u4ED6\u4EEC\u7684\u7EBD\u5E26\uFF1F

## \u2728 \u5B87\u5B99\u795D\u798F\u4E0E\u6307\u5F15
\u63D0\u4F9B2-3\u6761\u9488\u5BF9\u8FD9\u5BF9\u7EC4\u5408\u7684\u5173\u7CFB\u80AF\u5B9A\u8BED\u3002\u4EE5\u667A\u6167\u7684\u5B87\u5B99\u5BC4\u8BED\u6536\u5C3E\uFF0C\u5173\u4E8E\u8FD9\u6BB5\u7ED3\u5408\u7684\u6700\u9AD8\u6F5C\u80FD\u548C\u57F9\u80B2\u5B83\u7684\u5B9E\u7528\u5EFA\u8BAE\u3002

\u572810\u4E2A\u7EF4\u5EA6\u4E4B\u540E\uFF0C\u63D0\u4F9B\u4EE5\u4E0B\u8BC4\u5206\u7684JSON\u5757\uFF1A
\`\`\`json
{"loveScore": <1-100>, "passionScore": <1-100>, "communicationScore": <1-100>, "trustScore": <1-100>, "growthScore": <1-100>, "longTermScore": <1-100>, "summary": "<\u4E00\u53E5\u8BDD\u5173\u7CFB\u603B\u7ED3>"}
\`\`\``;
    const userPrompt = isEn ? `Generate a deep compatibility analysis between ${name1} (${meta1.name}) and ${name2} (${meta2.name}).

${compatData}

Please provide a professional, in-depth synastry analysis with all 10 dimensions followed by the JSON scores block.` : `\u751F\u6210${name1}\uFF08${meta1.nameChinese}\uFF09\u548C${name2}\uFF08${meta2.nameChinese}\uFF09\u7684\u6DF1\u5EA6\u517C\u5BB9\u6027\u5206\u6790\u3002

${compatData}

\u8BF7\u63D0\u4F9B\u4E13\u4E1A\u3001\u6DF1\u5165\u7684\u5408\u76D8\u5206\u6790\uFF0C\u5305\u542B\u5168\u90E810\u4E2A\u7EF4\u5EA6\uFF0C\u6700\u540E\u9644\u4E0AJSON\u8BC4\u5206\u5757\u3002`;
    const response = await invokeLLM({
      language,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    const rawContentRaw = response.choices[0]?.message?.content || "";
    const rawContent = typeof rawContentRaw === "string" ? rawContentRaw : "";
    if (response.degradation) {
      return {
        id: void 0,
        overallScore: compat.overallScore,
        scores: {
          loveScore: 0,
          passionScore: 0,
          communicationScore: 0,
          trustScore: 0,
          growthScore: 0,
          longTermScore: 0,
          summary: response.degradation.message
        },
        deepAnalysis: response.degradation.message,
        source: "daily_limit",
        degradation: response.degradation,
        elementCompat: {
          score: compat.elementCompat.score,
          dynamic: isEn ? compat.elementCompat.dynamic : compat.elementCompat.dynamicChinese
        },
        modalityCompat: {
          score: compat.modalityCompat.score,
          dynamic: isEn ? compat.modalityCompat.dynamic : compat.modalityCompat.dynamicChinese
        },
        polarityCompat: {
          score: compat.polarityCompat.score,
          dynamic: isEn ? compat.polarityCompat.dynamic : compat.polarityCompat.dynamicChinese
        },
        sign1: { name: meta1.name, nameChinese: meta1.nameChinese, symbol: meta1.symbol, element: meta1.element, elementChinese: meta1.elementChinese },
        sign2: { name: meta2.name, nameChinese: meta2.nameChinese, symbol: meta2.symbol, element: meta2.element, elementChinese: meta2.elementChinese }
      };
    }
    let scores = {
      loveScore: compat.overallScore,
      passionScore: 70,
      communicationScore: 70,
      trustScore: 70,
      growthScore: 75,
      longTermScore: 70,
      summary: isEn ? "A unique cosmic pairing with growth potential." : "\u72EC\u7279\u7684\u5B87\u5B99\u914D\u5BF9\uFF0C\u5177\u6709\u6210\u957F\u6F5C\u529B\u3002"
    };
    try {
      const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        scores = { ...scores, ...parsed };
      }
    } catch {
    }
    const deepAnalysis = rawContent.replace(/```json[\s\S]*?```/g, "").trim();
    const db = await getDb();
    let reportId;
    if (db) {
      const [inserted] = await db.insert(compatibilityReports).values({
        userId: ctx.user?.id || null,
        sessionId: nanoid5(),
        person1Name: name1,
        person1Sign,
        person2Name: name2,
        person2Sign,
        overallScore: compat.overallScore,
        scores,
        basicReading: scores.summary,
        deepAnalysis,
        isPaid: false
      });
      reportId = inserted.insertId;
      if (ctx.user?.id) {
        const [existingGrowth] = await db.select().from(userGrowth).where(eq11(userGrowth.userId, ctx.user.id)).limit(1);
        if (existingGrowth) {
          await db.update(userGrowth).set({
            intimateRelationships: sql8`${userGrowth.intimateRelationships} + 3`,
            totalPoints: sql8`${userGrowth.totalPoints} + 5`
          }).where(eq11(userGrowth.userId, ctx.user.id));
        }
      }
    }
    return {
      id: reportId,
      overallScore: compat.overallScore,
      scores,
      deepAnalysis,
      source: "ai",
      degradation: null,
      elementCompat: {
        score: compat.elementCompat.score,
        dynamic: isEn ? compat.elementCompat.dynamic : compat.elementCompat.dynamicChinese
      },
      modalityCompat: {
        score: compat.modalityCompat.score,
        dynamic: isEn ? compat.modalityCompat.dynamic : compat.modalityCompat.dynamicChinese
      },
      polarityCompat: {
        score: compat.polarityCompat.score,
        dynamic: isEn ? compat.polarityCompat.dynamic : compat.polarityCompat.dynamicChinese
      },
      sign1: { name: meta1.name, nameChinese: meta1.nameChinese, symbol: meta1.symbol, element: meta1.element, elementChinese: meta1.elementChinese },
      sign2: { name: meta2.name, nameChinese: meta2.nameChinese, symbol: meta2.symbol, element: meta2.element, elementChinese: meta2.elementChinese }
    };
  }),
  // Get user's past compatibility reports
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const reports = await db.select({
      id: compatibilityReports.id,
      person1Name: compatibilityReports.person1Name,
      person1Sign: compatibilityReports.person1Sign,
      person2Name: compatibilityReports.person2Name,
      person2Sign: compatibilityReports.person2Sign,
      overallScore: compatibilityReports.overallScore,
      createdAt: compatibilityReports.createdAt
    }).from(compatibilityReports).where(eq11(compatibilityReports.userId, ctx.user.id)).orderBy(desc9(compatibilityReports.createdAt)).limit(20);
    return reports;
  })
});

// server/routers/shareTracking.ts
import { z as z10 } from "zod";
init_db();
init_schema();
import { sql as sql9, gte, desc as desc10 } from "drizzle-orm";
var shareTrackingRouter = router({
  /**
   * Track a share event (public - works for anonymous users too)
   */
  track: publicProcedure.input(
    z10.object({
      platform: z10.string().max(30),
      type: z10.string().max(30),
      lang: z10.string().max(5).default("en")
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) return { success: false };
    const userId = ctx.user?.id ?? null;
    await db.insert(shareEvents).values({
      userId,
      platform: input.platform,
      type: input.type,
      lang: input.lang
    });
    return { success: true };
  }),
  /**
   * Get share statistics (admin only)
   */
  stats: protectedProcedure.input(
    z10.object({
      days: z10.number().min(1).max(365).default(30)
    }).optional()
  ).query(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      return { byPlatform: [], byType: [], byDay: [], total: 0 };
    }
    const db = await getDb();
    if (!db) return { byPlatform: [], byType: [], byDay: [], total: 0 };
    const days = input?.days ?? 30;
    const since = new Date(Date.now() - days * 864e5);
    const [totalResult] = await db.select({ count: sql9`count(*)` }).from(shareEvents).where(gte(shareEvents.createdAt, since));
    const total = totalResult?.count ?? 0;
    const byPlatform = await db.select({
      platform: shareEvents.platform,
      count: sql9`count(*)`
    }).from(shareEvents).where(gte(shareEvents.createdAt, since)).groupBy(shareEvents.platform).orderBy(desc10(sql9`count(*)`));
    const byType = await db.select({
      type: shareEvents.type,
      count: sql9`count(*)`
    }).from(shareEvents).where(gte(shareEvents.createdAt, since)).groupBy(shareEvents.type).orderBy(desc10(sql9`count(*)`));
    const byDay = await db.select({
      date: sql9`DATE(created_at)`.as("date"),
      count: sql9`count(*)`
    }).from(shareEvents).where(gte(shareEvents.createdAt, since)).groupBy(sql9`DATE(created_at)`).orderBy(sql9`DATE(created_at)`);
    return { byPlatform, byType, byDay, total };
  })
});

// server/routers/accessCode.ts
import { z as z11 } from "zod";
import { TRPCError as TRPCError4 } from "@trpc/server";
import { and as and10, desc as desc11, eq as eq12, sql as sql10 } from "drizzle-orm";
init_db();
init_schema();
var DEFAULT_FRIEND_CODE = "FRIEND2026";
var DEFAULT_MAX_USES = 30;
var tablesReady = false;
async function ensureAccessCodeTables() {
  if (tablesReady) return;
  const db = await getDb();
  if (!db) return;
  await db.execute(sql10`
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
  await db.execute(sql10`
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
  const [existing] = await db.select({ id: accessCodes.id }).from(accessCodes).where(eq12(accessCodes.code, DEFAULT_FRIEND_CODE)).limit(1);
  if (!existing) {
    const expires = /* @__PURE__ */ new Date();
    expires.setDate(expires.getDate() + 90);
    await db.insert(accessCodes).values({
      code: DEFAULT_FRIEND_CODE,
      label: "Friend beta",
      membershipType: "lifetime",
      maxUses: DEFAULT_MAX_USES,
      usedCount: 0,
      status: "active",
      expiresAt: expires,
      note: "auto-seeded for friend testing"
    });
  }
  tablesReady = true;
}
function normalizeCode(raw3) {
  return raw3.trim().toUpperCase().replace(/\s+/g, "");
}
function membershipEndDate(type) {
  if (type === "lifetime") return null;
  const end = /* @__PURE__ */ new Date();
  if (type === "monthly") end.setMonth(end.getMonth() + 1);
  else end.setFullYear(end.getFullYear() + 1);
  return end;
}
function typeLabel(type, zh = false) {
  if (type === "lifetime") return zh ? "\u7EC8\u8EAB\u4F1A\u5458" : "lifetime";
  if (type === "yearly") return zh ? "\u5E74\u5EA6\u4F1A\u5458" : "yearly";
  return zh ? "\u6708\u5EA6\u4F1A\u5458" : "monthly";
}
async function activateMembership(userId, type, paymentMethod, transactionId) {
  const db = await getDb();
  if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  await db.update(memberships).set({ status: "cancelled", autoRenew: false }).where(and10(eq12(memberships.userId, userId), eq12(memberships.status, "active")));
  const now = /* @__PURE__ */ new Date();
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
    autoRenew: false
  });
}
var accessCodeRouter = router({
  /** Public: validate code shape / remaining slots (no auth required for UX) */
  preview: publicProcedure.input(z11.object({ code: z11.string().min(3).max(40) })).query(async ({ input }) => {
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) return { valid: false, reason: "unavailable" };
    const code = normalizeCode(input.code);
    const [row] = await db.select().from(accessCodes).where(eq12(accessCodes.code, code)).limit(1);
    if (!row) return { valid: false, reason: "not_found" };
    if (row.status === "disabled") return { valid: false, reason: "disabled" };
    if (row.status === "exhausted" || row.usedCount >= row.maxUses) {
      return { valid: false, reason: "exhausted" };
    }
    if (row.expiresAt && new Date(row.expiresAt) < /* @__PURE__ */ new Date()) {
      return { valid: false, reason: "expired" };
    }
    return {
      valid: true,
      reason: "ok",
      membershipType: row.membershipType,
      remaining: Math.max(0, row.maxUses - row.usedCount),
      label: row.label
    };
  }),
  /** Redeem after login → lifetime (or configured) membership */
  redeem: protectedProcedure.input(z11.object({ code: z11.string().min(3).max(40) })).mutation(async ({ ctx, input }) => {
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const code = normalizeCode(input.code);
    const [row] = await db.select().from(accessCodes).where(eq12(accessCodes.code, code)).limit(1);
    if (!row) {
      throw new TRPCError4({ code: "NOT_FOUND", message: "Invalid code / \u5151\u6362\u7801\u65E0\u6548" });
    }
    if (row.status === "disabled") {
      throw new TRPCError4({ code: "BAD_REQUEST", message: "This code is disabled / \u5151\u6362\u7801\u5DF2\u505C\u7528" });
    }
    if (row.expiresAt && new Date(row.expiresAt) < /* @__PURE__ */ new Date()) {
      throw new TRPCError4({ code: "BAD_REQUEST", message: "This code has expired / \u5151\u6362\u7801\u5DF2\u8FC7\u671F" });
    }
    if (row.usedCount >= row.maxUses || row.status === "exhausted") {
      throw new TRPCError4({ code: "BAD_REQUEST", message: "Code fully redeemed / \u5151\u6362\u540D\u989D\u5DF2\u6EE1" });
    }
    const [already] = await db.select({ id: accessCodeRedemptions.id }).from(accessCodeRedemptions).where(
      and10(
        eq12(accessCodeRedemptions.codeId, row.id),
        eq12(accessCodeRedemptions.userId, ctx.user.id)
      )
    ).limit(1);
    if (already) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "You already redeemed this code / \u4F60\u5DF2\u5151\u6362\u8FC7\u6B64\u7801"
      });
    }
    const nextCount = row.usedCount + 1;
    const nextStatus = nextCount >= row.maxUses ? "exhausted" : "active";
    const updated = await db.update(accessCodes).set({
      usedCount: nextCount,
      status: nextStatus
    }).where(
      and10(
        eq12(accessCodes.id, row.id),
        eq12(accessCodes.status, "active"),
        eq12(accessCodes.usedCount, row.usedCount)
      )
    );
    const affected = updated?.[0]?.affectedRows ?? updated?.affectedRows ?? 1;
    if (affected === 0) {
      throw new TRPCError4({ code: "BAD_REQUEST", message: "Code fully redeemed / \u5151\u6362\u540D\u989D\u5DF2\u6EE1" });
    }
    await db.insert(accessCodeRedemptions).values({
      codeId: row.id,
      code: row.code,
      userId: ctx.user.id,
      membershipType: row.membershipType
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
      icon: "crown"
    });
    return {
      success: true,
      membershipType: row.membershipType,
      typeLabel: typeLabel(row.membershipType, true),
      typeLabelEn: typeLabel(row.membershipType, false)
    };
  }),
  /** Admin: list codes + redemption counts */
  adminList: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Admin only" });
    }
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(accessCodes).orderBy(desc11(accessCodes.createdAt)).limit(50);
    return rows.map((r) => ({
      ...r,
      remaining: Math.max(0, r.maxUses - r.usedCount),
      isExpired: r.expiresAt ? new Date(r.expiresAt) < /* @__PURE__ */ new Date() : false
    }));
  }),
  /** Admin: recent redemptions */
  adminRedemptions: protectedProcedure.input(z11.object({ limit: z11.number().min(1).max(100).default(30) }).optional()).query(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Admin only" });
    }
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) return [];
    return db.select().from(accessCodeRedemptions).orderBy(desc11(accessCodeRedemptions.createdAt)).limit(input?.limit ?? 30);
  }),
  /** Admin: create a new code */
  adminCreate: protectedProcedure.input(
    z11.object({
      code: z11.string().min(4).max(40).optional(),
      label: z11.string().max(100).optional(),
      membershipType: z11.enum(["monthly", "yearly", "lifetime"]).default("lifetime"),
      maxUses: z11.number().int().min(1).max(1e3).default(30),
      expiresInDays: z11.number().int().min(1).max(365).optional(),
      note: z11.string().max(200).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Admin only" });
    }
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const code = normalizeCode(input.code || "") || `BETA${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    let expiresAt = null;
    if (input.expiresInDays) {
      expiresAt = /* @__PURE__ */ new Date();
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
        note: input.note
      });
    } catch {
      throw new TRPCError4({ code: "CONFLICT", message: "Code already exists / \u5151\u6362\u7801\u5DF2\u5B58\u5728" });
    }
    return { success: true, code };
  }),
  /** Admin: disable a code */
  adminDisable: protectedProcedure.input(z11.object({ id: z11.number().int().positive() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Admin only" });
    }
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    await db.update(accessCodes).set({ status: "disabled" }).where(eq12(accessCodes.id, input.id));
    return { success: true };
  }),
  /** Admin: re-enable + optionally reset remaining */
  adminEnable: protectedProcedure.input(
    z11.object({
      id: z11.number().int().positive(),
      maxUses: z11.number().int().min(1).max(1e3).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Admin only" });
    }
    await ensureAccessCodeTables();
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const patch = { status: "active" };
    if (input.maxUses !== void 0) patch.maxUses = input.maxUses;
    await db.update(accessCodes).set(patch).where(eq12(accessCodes.id, input.id));
    return { success: true };
  })
});

// server/storage.ts
init_env();
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
var customerServiceKnowledge = {
  greetings: ["\u4F60\u597D", "\u60A8\u597D", "\u5728\u5417", "hello", "hi", "hey", "good morning", "good evening"],
  services: ["\u670D\u52A1", "\u529F\u80FD", "\u505A\u4EC0\u4E48", "service", "feature", "what can", "what do"],
  pricing: ["\u4EF7\u683C", "\u591A\u5C11\u94B1", "\u8D39\u7528", "\u6536\u8D39", "price", "cost", "how much", "pricing", "plan"],
  tarot: ["\u5854\u7F57", "\u5360\u535C", "\u62BD\u724C", "\u7B97\u5366", "tarot", "card reading", "fortune"],
  bazi: ["\u516B\u5B57", "\u547D\u7406", "\u751F\u8FB0", "\u7CBE\u6279", "bazi", "ba zi", "destiny", "birth chart"],
  horoscope: ["\u661F\u5EA7", "\u8FD0\u52BF", "\u661F\u8C61", "horoscope", "zodiac", "star sign"],
  dream: ["\u89E3\u68A6", "\u68A6\u5883", "\u505A\u68A6", "dream", "nightmare", "dream meaning"],
  refund: ["\u9000\u6B3E", "\u53D6\u6D88", "\u4E0D\u60F3\u8981", "refund", "cancel", "money back"],
  contact: ["\u8054\u7CFB", "\u5BA2\u670D", "\u4EBA\u5DE5", "\u7535\u8BDD", "\u90AE\u7BB1", "contact", "email", "support", "help"]
};
var customerServiceResponses = {
  greetings: {
    zh: "\u60A8\u597D\uFF01\u6B22\u8FCE\u6765\u5230\u6D1E\u5BDF\u672A\u6765\u5BA2\u670D\u4E2D\u5FC3\u3002\u6211\u662FAI\u52A9\u624B\uFF0C\u53EF\u4EE5\u4E3A\u60A8\u89E3\u7B54\u5E38\u89C1\u95EE\u9898\u3002",
    en: "Hello! Welcome to Fortune Insight support. I'm an AI assistant here to help with common questions."
  },
  services: {
    zh: "\u6D1E\u5BDF\u672A\u6765\u63D0\u4F9B\u4EE5\u4E0B\u670D\u52A1\uFF1A\n\n\u{1F0CF} **AI\u5854\u7F57\u5360\u535C** - \u4E09\u724C\u9635\u89E3\u8BFB\u60A8\u7684\u8FC7\u53BB\u3001\u73B0\u5728\u548C\u672A\u6765\n\u2728 **AI\u516B\u5B57\u7CBE\u6279** - \u6839\u636E\u60A8\u7684\u751F\u8FB0\u63D0\u4F9B\u547D\u7406\u5206\u6790\n\u{1F31F} **\u661F\u5EA7\u8FD0\u52BF** - \u6BCF\u65E5\u661F\u5EA7\u8FD0\u52BF\u89E3\u8BFB\n\u{1F319} **AI\u89E3\u68A6** - \u4E13\u4E1A\u68A6\u5883\u5206\u6790\u4E0E\u5FC3\u7406\u89E3\u8BFB",
    en: "Fortune Insight offers these services:\n\n\u{1F0CF} **AI Tarot Reading** - 3-card spread for past, present & future\n\u2728 **AI BaZi Analysis** - Destiny analysis based on your birth date\n\u{1F31F} **Horoscope** - Daily zodiac fortune readings\n\u{1F319} **AI Dream Interpretation** - Professional dream analysis with psychology insights"
  },
  pricing: {
    zh: "\u5173\u4E8E\u4EF7\u683C\uFF1A\n\n\u{1F381} **\u514D\u8D39\u4F53\u9A8C** - \u5854\u7F57\u5360\u535C\u6BCF\u5929\u514D\u8D391\u6B21\uFF0C\u661F\u5EA7\u8FD0\u52BF\u65E0\u9650\u514D\u8D39\n\u{1F48E} **\u5355\u6B21\u8D2D\u4E70** - \u5854\u7F57\u6DF1\u5EA6\u89E3\u8BFB$1.99\uFF0C\u516B\u5B57\u62A5\u544A$4.99\n\u{1F451} **\u4F1A\u5458\u8BA2\u9605** - \u6708\u4ED8$9.99\uFF0C\u5E74\u4ED8$59.99\uFF08\u7701\u4E00\u534A\uFF09\uFF0C\u65E0\u9650\u4F7F\u7528\u6240\u6709\u529F\u80FD\n\n\u8BE6\u7EC6\u4EF7\u683C\u8BF7\u67E5\u770B\u4F1A\u5458\u4E2D\u5FC3\u9875\u9762\uFF01",
    en: "Pricing:\n\n\u{1F381} **Free** - 1 free tarot reading/day, unlimited horoscopes\n\u{1F48E} **Single Purchase** - Tarot deep reading $1.99, BaZi report $4.99\n\u{1F451} **Membership** - Monthly $9.99, Yearly $59.99 (save 50%), unlimited access\n\nVisit the Membership page for full details!"
  },
  tarot: {
    zh: "\u5173\u4E8E\u5854\u7F57\u5360\u535C\uFF1A\n\n\u6211\u4EEC\u7684AI\u5854\u7F57\u4F7F\u7528\u7ECF\u5178\u97E6\u7279\u5854\u7F57\u724C\u7EC4\uFF0C\u60A8\u53EF\u4EE5\u9009\u62E9\u7231\u60C5\u3001\u4E8B\u4E1A\u3001\u8D22\u8FD0\u7B49\u95EE\u9898\u7C7B\u578B\uFF0C\u7136\u540E\u4EB2\u81EA\u62BD\u53D6\u4E09\u5F20\u724C\u3002AI\u4F1A\u7ED3\u5408\u60A8\u7684\u95EE\u9898\u548C\u724C\u9762\u7ED9\u51FA\u4E2A\u6027\u5316\u89E3\u8BFB\u3002\n\n\u70B9\u51FB\u5BFC\u822A\u680F\u300C\u5854\u7F57\u5360\u535C\u300D\u5373\u53EF\u5F00\u59CB\u4F53\u9A8C\uFF01",
    en: "About Tarot Reading:\n\nOur AI Tarot uses the classic Rider-Waite deck. Choose a question type (love, career, finance), then draw 3 cards. AI provides personalized interpretations based on your question and cards.\n\nClick 'Tarot' in the navigation to start!"
  },
  bazi: {
    zh: "\u5173\u4E8E\u516B\u5B57\u7CBE\u6279\uFF1A\n\n\u8F93\u5165\u60A8\u7684\u51FA\u751F\u65E5\u671F\u548C\u65F6\u8FB0\uFF0CAI\u4F1A\u4E3A\u60A8\u751F\u6210\u4E13\u4E1A\u7684\u547D\u7406\u5206\u6790\u62A5\u544A\uFF0C\u5305\u62EC\u6027\u683C\u7279\u70B9\u3001\u5929\u8D4B\u6F5C\u80FD\u3001\u4E8B\u4E1A\u65B9\u5411\u7B49\u3002\u62A5\u544A\u53EF\u4EE5\u5BFC\u51FAPDF\u4FDD\u5B58\u3002\n\n\u70B9\u51FB\u5BFC\u822A\u680F\u300C\u516B\u5B57\u7CBE\u6279\u300D\u5F00\u59CB\u4F53\u9A8C\uFF01",
    en: "About BaZi Analysis:\n\nEnter your birth date and time. AI generates a professional destiny analysis including personality traits, hidden talents, and career direction. Reports can be exported as PDF.\n\nClick 'BaZi' in the navigation to start!"
  },
  horoscope: {
    zh: "\u5173\u4E8E\u661F\u5EA7\u8FD0\u52BF\uFF1A\n\n\u9009\u62E9\u60A8\u7684\u661F\u5EA7\uFF0C\u5373\u53EF\u83B7\u53D6\u4ECA\u65E5\u8FD0\u52BF\u89E3\u8BFB\uFF0C\u5305\u62EC\u7EFC\u5408\u8FD0\u52BF\u3001\u7231\u60C5\u3001\u4E8B\u4E1A\u3001\u8D22\u8FD0\u7B49\u65B9\u9762\u7684\u5206\u6790\u548C\u5EFA\u8BAE\u3002\n\n\u70B9\u51FB\u5BFC\u822A\u680F\u300C\u661F\u5EA7\u8FD0\u52BF\u300D\u67E5\u770B\uFF01",
    en: "About Horoscope:\n\nSelect your zodiac sign to get today's fortune reading, including overall luck, love, career, and financial analysis with personalized advice.\n\nClick 'Horoscope' in the navigation to check!"
  },
  dream: {
    zh: "\u5173\u4E8EAI\u89E3\u68A6\uFF1A\n\n\u8BB0\u5F55\u60A8\u7684\u68A6\u5883\u5185\u5BB9\u548C\u60C5\u7EEA\uFF0CAI\u4F1A\u4ECE\u5FC3\u7406\u5B66\u89D2\u5EA6\u4E3A\u60A8\u89E3\u8BFB\u68A6\u5883\u542B\u4E49\u3002\u68A6\u5883\u8BB0\u5F55\u53EF\u4EE5\u5BFC\u51FAPDF\u68A6\u5883\u65E5\u8BB0\u3002\n\n\u70B9\u51FB\u5BFC\u822A\u680F\u300CAI\u89E3\u68A6\u300D\u5F00\u59CB\u4F53\u9A8C\uFF01",
    en: "About Dream Interpretation:\n\nRecord your dream content and emotions. AI interprets dream meanings from a psychological perspective. Dream records can be exported as a PDF dream journal.\n\nClick 'Dream' in the navigation to start!"
  },
  refund: {
    zh: "\u5173\u4E8E\u9000\u6B3E\uFF1A\n\n\u5982\u679C\u60A8\u5BF9\u670D\u52A1\u4E0D\u6EE1\u610F\uFF0C\u53EF\u4EE5\u5728\u8D2D\u4E70\u540E7\u5929\u5185\u7533\u8BF7\u9000\u6B3E\u3002\u8BF7\u63D0\u4F9B\u60A8\u7684\u8BA2\u5355\u53F7\u548C\u9000\u6B3E\u539F\u56E0\u3002",
    en: "About Refunds:\n\nIf you're not satisfied, you can request a refund within 7 days of purchase. Please provide your order number and reason for the refund."
  },
  contact: {
    zh: "\u8054\u7CFB\u65B9\u5F0F\uFF1A\n\n\u{1F4E7} **\u90AE\u7BB1**: fortuneinsight@outlook.com\n\u{1F4AC} **\u5728\u7EBF\u5BA2\u670D**: \u60A8\u6B63\u5728\u4F7F\u7528\u7684\u8FD9\u4E2A\u804A\u5929\u7A97\u53E3",
    en: "Contact us:\n\n\u{1F4E7} **Email**: fortuneinsight@outlook.com\n\u{1F4AC} **Live Chat**: This chat window you're using right now"
  },
  default: {
    zh: "\u611F\u8C22\u60A8\u7684\u63D0\u95EE\uFF01\u6211\u662FAI\u52A9\u624B\uFF0C\u60A8\u7684\u95EE\u9898\u5DF2\u8BB0\u5F55\u3002\n\n\u60A8\u53EF\u4EE5\u5C1D\u8BD5\u95EE\u6211\uFF1A\n- \u60A8\u4EEC\u6709\u54EA\u4E9B\u670D\u52A1\uFF1F\n- \u4EF7\u683C\u662F\u591A\u5C11\uFF1F\n- \u5982\u4F55\u4F7F\u7528\u5854\u7F57\u5360\u535C\uFF1F",
    en: "Thanks for your question! I'm an AI assistant and your message has been recorded.\n\nYou can ask me about:\n- What services do you offer?\n- What are the prices?\n- How does tarot reading work?"
  }
};
async function generateAICustomerServiceReply(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  const isChinese = /[\u4e00-\u9fff]/.test(userMessage);
  const lang = isChinese ? "zh" : "en";
  for (const [category, keywords] of Object.entries(customerServiceKnowledge)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      const resp = customerServiceResponses[category] || customerServiceResponses.default;
      return resp[lang];
    }
  }
  try {
    const response = await invokeLLM({
      language: lang,
      messages: [
        {
          role: "system",
          content: `You are the AI customer service assistant for Fortune Insight (\u6D1E\u5BDF\u672A\u6765). The platform offers AI Tarot Reading, BaZi Analysis, Horoscope, and Dream Interpretation.

IMPORTANT: Reply in the SAME LANGUAGE as the user's message. If they write in Chinese, reply in Chinese. If they write in English, reply in English.

Services: Tarot ($1.99/reading or free 1/day), BaZi ($4.99/report), Horoscope (free), Dream ($1.99/reading or free 1/month). Membership: Monthly $9.99, Yearly $59.99 (save 50%), Lifetime $149.99.

Rules:
- Keep replies under 100 words
- Be warm and helpful
- Guide users to relevant pages
- For issues you can't resolve, tell users to email fortuneinsight@outlook.com`
        },
        { role: "user", content: userMessage }
      ]
    });
    const content = response.choices[0]?.message?.content;
    const isCn = /[\u4e00-\u9fff]/.test(userMessage);
    return typeof content === "string" ? content : customerServiceResponses.default[isCn ? "zh" : "en"];
  } catch (e) {
    console.error("LLM call failed:", e);
    const isCn = /[\u4e00-\u9fff]/.test(userMessage);
    return customerServiceResponses.default[isCn ? "zh" : "en"];
  }
}
var appRouter = router({
  system: systemRouter,
  shareTracking: shareTrackingRouter,
  accessCode: accessCodeRouter,
  /** Lightweight admin console APIs */
  admin: router({
    overview: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      const empty = {
        users: { total: 0, last7d: 0, last24h: 0 },
        membership: { activeTrial: 0, activePaid: 0, expired: 0 },
        readings: { tarot: 0, bazi: 0, dream: 0, last7d: 0 },
        ops: { openContacts: 0, waitingChats: 0, codeRedemptions: 0 },
        recentUsers: []
      };
      if (!db) return empty;
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
      const now = /* @__PURE__ */ new Date();
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
        [dream7]
      ] = await Promise.all([
        db.select({ c: sql12`count(*)` }).from(users),
        db.select({ c: sql12`count(*)` }).from(users).where(sql12`${users.createdAt} >= ${weekAgo}`),
        db.select({ c: sql12`count(*)` }).from(users).where(sql12`${users.createdAt} >= ${dayAgo}`),
        db.select({ c: sql12`count(*)` }).from(tarotReadings),
        db.select({ c: sql12`count(*)` }).from(baziReadings),
        db.select({ c: sql12`count(*)` }).from(dreamRecords),
        db.select().from(memberships).where(eq14(memberships.status, "active")),
        db.select({ c: sql12`count(*)` }).from(memberships).where(eq14(memberships.status, "expired")),
        db.select({ c: sql12`count(*)` }).from(contactSubmissions),
        db.select({ c: sql12`count(*)` }).from(chatSessions).where(eq14(chatSessions.status, "waiting")),
        db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          loginMethod: users.loginMethod,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn
        }).from(users).orderBy(desc12(users.createdAt)).limit(12),
        db.select({ c: sql12`count(*)` }).from(tarotReadings).where(sql12`${tarotReadings.createdAt} >= ${weekAgo}`),
        db.select({ c: sql12`count(*)` }).from(baziReadings).where(sql12`${baziReadings.createdAt} >= ${weekAgo}`),
        db.select({ c: sql12`count(*)` }).from(dreamRecords).where(sql12`${dreamRecords.createdAt} >= ${weekAgo}`)
      ]);
      let codeRedemptions = 0;
      try {
        const rows = await db.execute(sql12`SELECT COUNT(*) AS c FROM access_code_redemptions`);
        const arr = rows;
        const first = Array.isArray(arr) ? arr[0] : arr[0]?.[0];
        if (first && typeof first === "object" && "c" in first) {
          codeRedemptions = Number(first.c ?? 0);
        }
      } catch {
        codeRedemptions = 0;
      }
      let activeTrial = 0;
      let activePaid = 0;
      const membershipByUser = /* @__PURE__ */ new Map();
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
          last24h: Number(user24h?.c || 0)
        },
        membership: {
          activeTrial,
          activePaid,
          expired: Number(expiredCount?.c || 0)
        },
        readings: {
          tarot: Number(tarotTotal?.c || 0),
          bazi: Number(baziTotal?.c || 0),
          dream: Number(dreamTotal?.c || 0),
          last7d: Number(tarot7?.c || 0) + Number(bazi7?.c || 0) + Number(dream7?.c || 0)
        },
        ops: {
          openContacts: Number(contactsTotal?.c || 0),
          waitingChats: Number(waitingChats?.c || 0),
          codeRedemptions
        },
        recentUsers: recentRaw.map((u) => ({
          ...u,
          membershipLabel: membershipByUser.get(u.id) ?? null
        }))
      };
    })
  }),
  // Public stats for homepage dynamic counters
  stats: router({
    getHomepageStats: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { totalReadings: 0, totalUsers: 0, totalCommunityPosts: 0 };
      const [[tarotCount], [baziCount], [dreamCount], [horoscopeCount], [userCount], [postCount]] = await Promise.all([
        db.select({ c: sql12`count(*)` }).from(tarotReadings),
        db.select({ c: sql12`count(*)` }).from(baziReadings),
        db.select({ c: sql12`count(*)` }).from(dreamRecords),
        db.select({ c: sql12`count(*)` }).from(horoscopes),
        db.select({ c: sql12`count(*)` }).from(users),
        db.select({ c: sql12`count(*)` }).from(communityPosts)
      ]);
      return {
        totalReadings: Number(tarotCount?.c || 0) + Number(baziCount?.c || 0) + Number(dreamCount?.c || 0) + Number(horoscopeCount?.c || 0),
        totalUsers: Number(userCount?.c || 0),
        totalCommunityPosts: Number(postCount?.c || 0)
      };
    })
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
      return { success: true };
    }),
    /** Native email/password register (no Manus portal) */
    register: publicProcedure.input(
      z12.object({
        email: z12.string().email(),
        password: z12.string().min(8).max(128),
        name: z12.string().min(1).max(80).optional()
      })
    ).mutation(async ({ input, ctx }) => {
      const { registerWithEmail: registerWithEmail2 } = await Promise.resolve().then(() => (init_localAuth(), localAuth_exports));
      const { sdk: sdk2 } = await Promise.resolve().then(() => (init_sdk(), sdk_exports));
      const result = await registerWithEmail2(input);
      if (!result.ok) {
        throw new TRPCError5({ code: "BAD_REQUEST", message: result.error });
      }
      const sessionToken = await sdk2.createSessionToken(result.user.openId, {
        name: result.user.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS
      });
      return {
        success: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        }
      };
    }),
    /** Native email/password login */
    login: publicProcedure.input(
      z12.object({
        email: z12.string().email(),
        password: z12.string().min(1).max(128)
      })
    ).mutation(async ({ input, ctx }) => {
      const { loginWithEmail: loginWithEmail2 } = await Promise.resolve().then(() => (init_localAuth(), localAuth_exports));
      const { sdk: sdk2 } = await Promise.resolve().then(() => (init_sdk(), sdk_exports));
      const result = await loginWithEmail2(input);
      if (!result.ok) {
        throw new TRPCError5({ code: "UNAUTHORIZED", message: result.error });
      }
      const sessionToken = await sdk2.createSessionToken(result.user.openId, {
        name: result.user.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS
      });
      return {
        success: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        }
      };
    })
  }),
  // 使用次数查询路由
  usage: router({
    getStatus: protectedProcedure.input(z12.object({
      featureType: z12.enum(["tarot", "bazi", "dream", "horoscope"])
    })).query(async ({ input, ctx }) => {
      return getUsageStatus(ctx.user.id, input.featureType);
    }),
    getAllStatus: protectedProcedure.query(async ({ ctx }) => {
      const [tarot, bazi, dream, horoscope] = await Promise.all([
        getUsageStatus(ctx.user.id, "tarot"),
        getUsageStatus(ctx.user.id, "bazi"),
        getUsageStatus(ctx.user.id, "dream"),
        getUsageStatus(ctx.user.id, "horoscope")
      ]);
      return { tarot, bazi, dream, horoscope };
    }),
    getFreeLimits: publicProcedure.query(() => {
      return FREE_LIMITS;
    })
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
      const [progress] = await db.select().from(userGrowth).where(eq14(userGrowth.userId, ctx.user.id)).limit(1);
      if (!progress) {
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
          badges: []
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
          lastActiveDate: null
        };
      }
      return progress;
    }),
    addPoints: protectedProcedure.input(z12.object({
      dimension: z12.enum([
        "selfAwareness",
        "emotionalManagement",
        "intimateRelationships",
        "careerPotential",
        "wealthMindset",
        "healthWellness",
        "spiritualGrowth",
        "socialConnection"
      ]),
      points: z12.number().min(1).max(100)
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u4E0D\u53EF\u7528");
      const { dimension, points } = input;
      await db.update(userGrowth).set({
        [dimension]: sql12`${userGrowth[dimension]} + ${points}`,
        totalPoints: sql12`${userGrowth.totalPoints} + ${points}`
      }).where(eq14(userGrowth.userId, ctx.user.id));
      return { success: true };
    }),
    // Record daily activity and update streak
    recordActivity: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { streak: 0, longestStreak: 0 };
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      const [progress] = await db.select().from(userGrowth).where(eq14(userGrowth.userId, ctx.user.id)).limit(1);
      if (!progress) {
        await db.insert(userGrowth).values({
          userId: ctx.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
          totalPoints: 0,
          level: 1,
          badges: []
        });
        return { streak: 1, longestStreak: 1, isNewDay: true };
      }
      if (progress.lastActiveDate === today) {
        return {
          streak: progress.currentStreak || 0,
          longestStreak: progress.longestStreak || 0,
          isNewDay: false
        };
      }
      let newStreak = 1;
      if (progress.lastActiveDate === yesterday) {
        newStreak = (progress.currentStreak || 0) + 1;
      }
      const newLongest = Math.max(newStreak, progress.longestStreak || 0);
      await db.update(userGrowth).set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today
      }).where(eq14(userGrowth.userId, ctx.user.id));
      return { streak: newStreak, longestStreak: newLongest, isNewDay: true };
    })
  }),
  // 社区路由
  community: router({
    getPosts: publicProcedure.input(z12.object({
      type: z12.enum(["insight", "story", "article"]).optional(),
      limit: z12.number().min(1).max(50).default(20),
      offset: z12.number().min(0).default(0)
    })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const { type, limit, offset } = input;
      const whereClause = type ? and11(eq14(communityPosts.status, "published"), eq14(communityPosts.type, type)) : eq14(communityPosts.status, "published");
      const posts = await db.select({
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
        userName: users.name
      }).from(communityPosts).leftJoin(users, eq14(communityPosts.userId, users.id)).where(whereClause).orderBy(desc12(communityPosts.createdAt)).limit(limit).offset(offset);
      const userIds = Array.from(new Set(posts.map((p) => p.userId)));
      const activeMemberships = userIds.length > 0 ? await db.select({ userId: memberships.userId }).from(memberships).where(and11(
        eq14(memberships.status, "active"),
        sql12`${memberships.userId} IN (${sql12.join(userIds.map((id) => sql12`${id}`), sql12`, `)})`
      )) : [];
      const premiumUserIds = new Set(activeMemberships.map((m) => m.userId));
      return posts.map((post) => ({
        ...post,
        isPremiumUser: premiumUserIds.has(post.userId),
        displayName: post.userName || null
      }));
    }),
    createPost: protectedProcedure.input(z12.object({
      type: z12.enum(["insight", "story", "article"]),
      title: z12.string().max(200).optional(),
      content: z12.string().min(1).max(5e3)
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u4E0D\u53EF\u7528");
      const [post] = await db.insert(communityPosts).values({
        userId: ctx.user.id,
        type: input.type,
        title: input.title ?? null,
        content: input.content,
        status: "published"
      }).$returningId();
      return { id: post.id };
    }),
    likePost: protectedProcedure.input(z12.object({ postId: z12.number() })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u4E0D\u53EF\u7528");
      const [existing] = await db.select().from(postLikes).where(and11(
        eq14(postLikes.postId, input.postId),
        eq14(postLikes.userId, ctx.user.id)
      )).limit(1);
      if (existing) {
        await db.delete(postLikes).where(eq14(postLikes.id, existing.id));
        await db.update(communityPosts).set({ likesCount: sql12`${communityPosts.likesCount} - 1` }).where(eq14(communityPosts.id, input.postId));
        return { liked: false };
      } else {
        await db.insert(postLikes).values({
          postId: input.postId,
          userId: ctx.user.id
        });
        await db.update(communityPosts).set({ likesCount: sql12`${communityPosts.likesCount} + 1` }).where(eq14(communityPosts.id, input.postId));
        const [likedPost] = await db.select({ userId: communityPosts.userId }).from(communityPosts).where(eq14(communityPosts.id, input.postId)).limit(1);
        if (likedPost && likedPost.userId !== ctx.user.id) {
          await createNotification({
            userId: likedPost.userId,
            type: "community",
            title: "Someone liked your post!",
            message: `${ctx.user.name || "A user"} liked your community post.`,
            link: "/community",
            icon: "users"
          });
        }
        return { liked: true };
      }
    }),
    /** F2-1: list comments for a post (public) */
    getComments: publicProcedure.input(z12.object({
      postId: z12.number().int().positive(),
      limit: z12.number().min(1).max(50).default(20)
    })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select({
        id: postComments.id,
        postId: postComments.postId,
        userId: postComments.userId,
        content: postComments.content,
        createdAt: postComments.createdAt,
        userName: users.name
      }).from(postComments).leftJoin(users, eq14(postComments.userId, users.id)).where(eq14(postComments.postId, input.postId)).orderBy(desc12(postComments.createdAt)).limit(input.limit);
      return rows.map((r) => ({
        ...r,
        displayName: r.userName || null
      }));
    }),
    /** F2-1: add a comment (auth required) */
    addComment: protectedProcedure.input(z12.object({
      postId: z12.number().int().positive(),
      content: z12.string().min(1).max(1e3)
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      }
      const [post] = await db.select({ id: communityPosts.id, userId: communityPosts.userId }).from(communityPosts).where(eq14(communityPosts.id, input.postId)).limit(1);
      if (!post) {
        throw new TRPCError5({ code: "NOT_FOUND", message: "Post not found" });
      }
      const [inserted] = await db.insert(postComments).values({
        postId: input.postId,
        userId: ctx.user.id,
        content: input.content.trim()
      }).$returningId();
      await db.update(communityPosts).set({ commentsCount: sql12`${communityPosts.commentsCount} + 1` }).where(eq14(communityPosts.id, input.postId));
      if (post.userId !== ctx.user.id) {
        await createNotification({
          userId: post.userId,
          type: "community",
          title: "New comment on your post",
          message: `${ctx.user.name || "A user"} commented on your post.`,
          link: "/community",
          icon: "users"
        });
      }
      return { id: inserted.id, success: true };
    })
  }),
  // 支付与会员路由
  payment: router({
    createCheckout: protectedProcedure.input(z12.object({
      productId: z12.string()
    })).mutation(async ({ input, ctx }) => {
      if (!(input.productId in PRODUCTS)) {
        throw new Error(`Invalid product: ${input.productId}`);
      }
      const origin = ctx.req.headers.origin || "https://fortunesite.one";
      const checkoutUrl = await createCheckoutSession(
        ctx.user.id,
        ctx.user.email || "",
        ctx.user.name || "",
        input.productId,
        origin
      );
      return { checkoutUrl };
    }),
    getMembership: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      await grantSignupTrialIfNeeded(ctx.user.id);
      const [membership] = await db.select().from(memberships).where(and11(
        eq14(memberships.userId, ctx.user.id),
        eq14(memberships.status, "active")
      )).orderBy(desc12(memberships.createdAt)).limit(1);
      if (!membership) return null;
      if (membership.endDate && new Date(membership.endDate) < /* @__PURE__ */ new Date()) {
        await hasActiveMembership(ctx.user.id);
        return null;
      }
      const isTrial = !!membership.paymentMethod?.startsWith("trial:");
      const daysLeft = membership.endDate ? Math.max(
        0,
        Math.ceil(
          (new Date(membership.endDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
        )
      ) : null;
      return { ...membership, isTrial, daysLeft };
    }),
    getOrders: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const userOrders = await db.select().from(orders).where(eq14(orders.userId, ctx.user.id)).orderBy(desc12(orders.createdAt)).limit(50);
      return userOrders;
    }),
    getCharityDonations: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const donations = await db.select().from(charityDonations).where(eq14(charityDonations.userId, ctx.user.id)).orderBy(desc12(charityDonations.createdAt)).limit(50);
      return donations;
    }),
    getProducts: publicProcedure.query(() => {
      return Object.entries(PRODUCTS).map(([productKey, product]) => ({
        productKey,
        ...product,
        priceDisplay: (product.price / 100).toFixed(2)
      }));
    }),
    getSingleProducts: publicProcedure.query(() => {
      return getSinglePurchaseProducts().map((p) => ({
        ...p,
        priceDisplay: (p.price / 100).toFixed(2)
      }));
    }),
    getMembershipProducts: publicProcedure.query(() => {
      return getMembershipProducts().map((p) => ({
        ...p,
        priceDisplay: (p.price / 100).toFixed(2)
      }));
    }),
    /**
     * Admin: list users + membership status (for granting free access to friends)
     */
    adminListUsers: protectedProcedure.input(z12.object({
      search: z12.string().optional(),
      limit: z12.number().min(1).max(100).default(30)
    }).optional()).query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) return [];
      const search = input?.search?.trim();
      const limit = input?.limit ?? 30;
      const baseUsers = search ? await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn
      }).from(users).where(
        sql12`(${users.name} LIKE ${`%${search}%`} OR ${users.email} LIKE ${`%${search}%`} OR CAST(${users.id} AS CHAR) = ${search})`
      ).orderBy(desc12(users.lastSignedIn)).limit(limit) : await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn
      }).from(users).orderBy(desc12(users.lastSignedIn)).limit(limit);
      if (baseUsers.length === 0) return [];
      const userIds = baseUsers.map((u) => u.id);
      const activeMemberships = await db.select().from(memberships).where(
        and11(
          eq14(memberships.status, "active"),
          sql12`${memberships.userId} IN (${sql12.join(userIds.map((id) => sql12`${id}`), sql12`, `)})`
        )
      );
      const membershipByUser = /* @__PURE__ */ new Map();
      for (const m of activeMemberships) {
        const existing = membershipByUser.get(m.userId);
        if (!existing || m.type === "lifetime" || new Date(m.createdAt) > new Date(existing.createdAt)) {
          membershipByUser.set(m.userId, m);
        }
      }
      return baseUsers.map((u) => {
        const m = membershipByUser.get(u.id);
        const expired = m?.endDate ? new Date(m.endDate) < /* @__PURE__ */ new Date() : false;
        return {
          ...u,
          membership: m && !expired ? {
            id: m.id,
            type: m.type,
            status: m.status,
            startDate: m.startDate,
            endDate: m.endDate,
            paymentMethod: m.paymentMethod
          } : null
        };
      });
    }),
    /**
     * Admin: grant complimentary membership (friends / testers / comp)
     * Lifetime has no endDate → unlimited access to all paid features.
     */
    adminGrantMembership: protectedProcedure.input(z12.object({
      userId: z12.number().int().positive().optional(),
      email: z12.string().email().optional(),
      type: z12.enum(["monthly", "yearly", "lifetime"]).default("lifetime"),
      note: z12.string().max(200).optional()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      if (!input.userId && !input.email) {
        throw new Error("Provide userId or email");
      }
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      let targetUser;
      if (input.userId) {
        const [u] = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq14(users.id, input.userId)).limit(1);
        targetUser = u;
      } else if (input.email) {
        const [u] = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq14(users.email, input.email)).limit(1);
        targetUser = u;
      }
      if (!targetUser) {
        throw new Error("User not found. Ask them to log in once first.");
      }
      await db.update(memberships).set({ status: "cancelled", autoRenew: false }).where(
        and11(
          eq14(memberships.userId, targetUser.id),
          eq14(memberships.status, "active")
        )
      );
      const now = /* @__PURE__ */ new Date();
      let endDate = null;
      if (input.type === "monthly") {
        endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (input.type === "yearly") {
        endDate = new Date(now);
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      await db.insert(memberships).values({
        userId: targetUser.id,
        type: input.type,
        status: "active",
        startDate: now,
        endDate,
        price: "0.00",
        charityAmount: "0.00",
        paymentMethod: input.note ? `comp:${input.note.slice(0, 80)}` : `comp:admin:${ctx.user.id}`,
        transactionId: `comp_${Date.now()}_${targetUser.id}`,
        autoRenew: false
      });
      const typeLabel2 = input.type === "lifetime" ? "\u7EC8\u8EAB\u4F1A\u5458" : input.type === "yearly" ? "\u5E74\u5EA6\u4F1A\u5458" : "\u6708\u5EA6\u4F1A\u5458";
      await createNotification({
        userId: targetUser.id,
        type: "membership",
        title: "Membership Activated",
        message: `You've been gifted ${input.type} membership. Enjoy unlimited access!`,
        link: "/membership",
        icon: "crown"
      });
      return {
        success: true,
        userId: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        type: input.type,
        typeLabel: typeLabel2,
        endDate
      };
    }),
    /**
     * Admin: revoke complimentary / any active membership
     */
    adminRevokeMembership: protectedProcedure.input(z12.object({
      userId: z12.number().int().positive()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(memberships).set({ status: "cancelled", autoRenew: false }).where(
        and11(
          eq14(memberships.userId, input.userId),
          eq14(memberships.status, "active")
        )
      );
      await createNotification({
        userId: input.userId,
        type: "membership",
        title: "Membership Ended",
        message: "Your complimentary membership has been revoked.",
        link: "/membership",
        icon: "crown"
      });
      return { success: true };
    })
  }),
  // AI解梦路由 (Professional dream symbol database)
  dream: dreamRouter,
  // 语音功能路由
  voice: router({
    // 上传音频文件
    uploadAudio: publicProcedure.input(z12.object({
      audioData: z12.string(),
      // base64编码的音频数据
      mimeType: z12.string().default("audio/webm")
    })).mutation(async ({ input }) => {
      const audioBuffer = Buffer.from(input.audioData, "base64");
      const sizeMB = audioBuffer.length / (1024 * 1024);
      if (sizeMB > 16) {
        throw new Error("\u97F3\u9891\u6587\u4EF6\u8FC7\u5927\uFF0C\u8BF7\u63A7\u5236\u5728\u4E24\u5206\u949F\u4EE5\u5185");
      }
      const ext = input.mimeType.includes("webm") ? "webm" : input.mimeType.includes("mp4") ? "m4a" : "webm";
      const fileName = `voice-${Date.now()}-${nanoid6(6)}.${ext}`;
      const { url } = await storagePut(fileName, audioBuffer, input.mimeType);
      return { url, fileName };
    }),
    // 语音转文字
    transcribe: publicProcedure.input(z12.object({
      audioUrl: z12.string(),
      language: z12.string().optional(),
      prompt: z12.string().optional()
    })).mutation(async ({ input }) => {
      const result = await transcribeAudio({
        audioUrl: input.audioUrl,
        language: input.language,
        prompt: input.prompt
      });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    }),
    // 文字转语音（TTS）
    synthesize: publicProcedure.input(z12.object({
      text: z12.string().max(4e3),
      voice: z12.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]).default("nova"),
      speed: z12.number().min(0.25).max(4).default(1)
    })).mutation(async ({ input }) => {
      const { ENV: ENV2 } = await Promise.resolve().then(() => (init_env(), env_exports));
      if (!ENV2.forgeApiUrl || !ENV2.forgeApiKey) {
        throw new Error("\u8BED\u97F3\u5408\u6210\u670D\u52A1\u672A\u914D\u7F6E");
      }
      const baseUrl = ENV2.forgeApiUrl.endsWith("/") ? ENV2.forgeApiUrl : `${ENV2.forgeApiUrl}/`;
      const response = await fetch(`${baseUrl}v1/audio/speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ENV2.forgeApiKey}`
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          input: input.text,
          voice: input.voice,
          speed: input.speed,
          response_format: "mp3"
        })
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`\u8BED\u97F3\u5408\u6210\u5931\u8D25: ${response.status} ${errorText}`);
      }
      const audioBuffer = await response.arrayBuffer();
      const fileName = `tts-${Date.now()}-${nanoid6(6)}.mp3`;
      const { url } = await storagePut(fileName, Buffer.from(audioBuffer), "audio/mpeg");
      return { url, duration: null };
    })
  }),
  // 用户反馈路由
  feedback: router({
    // 提交反馈
    submit: publicProcedure.input(z12.object({
      sourceType: z12.enum(["tarot", "bazi", "horoscope", "dream"]),
      sourceId: z12.number().optional(),
      rating: z12.number().min(1).max(5),
      tags: z12.array(z12.string()).optional(),
      comment: z12.string().max(500).optional(),
      isAnonymous: z12.boolean().optional(),
      sessionId: z12.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u4E0D\u53EF\u7528");
      const feedbackData = {
        userId: ctx.user?.id || null,
        sessionId: input.sessionId || nanoid6(),
        sourceType: input.sourceType,
        sourceId: input.sourceId || null,
        rating: input.rating,
        tags: input.tags || [],
        comment: input.comment || null,
        isAnonymous: input.isAnonymous || false
      };
      await db.insert(userFeedbacks).values(feedbackData);
      return { success: true, message: "\u611F\u8C22\u60A8\u7684\u53CD\u9988\uFF01" };
    }),
    // 检查是否已提交反馈
    checkSubmitted: publicProcedure.input(z12.object({
      sourceType: z12.enum(["tarot", "bazi", "horoscope", "dream"]),
      sourceId: z12.number().optional(),
      sessionId: z12.string().optional()
    })).query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { submitted: false };
      if (ctx.user?.id && input.sourceId) {
        const [existing] = await db.select().from(userFeedbacks).where(and11(
          eq14(userFeedbacks.userId, ctx.user.id),
          eq14(userFeedbacks.sourceType, input.sourceType),
          eq14(userFeedbacks.sourceId, input.sourceId)
        )).limit(1);
        return { submitted: !!existing };
      }
      if (input.sessionId) {
        const [existing] = await db.select().from(userFeedbacks).where(and11(
          eq14(userFeedbacks.sessionId, input.sessionId),
          eq14(userFeedbacks.sourceType, input.sourceType)
        )).limit(1);
        return { submitted: !!existing };
      }
      return { submitted: false };
    }),
    // 获取反馈统计（管理员用）
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) return null;
      const feedbacks = await db.select().from(userFeedbacks).orderBy(desc12(userFeedbacks.createdAt)).limit(500);
      const bySource = {};
      feedbacks.forEach((f) => {
        if (!bySource[f.sourceType]) {
          bySource[f.sourceType] = { count: 0, avgRating: 0, ratings: [] };
        }
        bySource[f.sourceType].count++;
        bySource[f.sourceType].ratings.push(f.rating);
      });
      Object.keys(bySource).forEach((key) => {
        const ratings = bySource[key].ratings;
        bySource[key].avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      });
      const tagCount = {};
      feedbacks.forEach((f) => {
        const tags = f.tags || [];
        tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });
      return {
        totalFeedbacks: feedbacks.length,
        bySource,
        topTags: Object.entries(tagCount).map(([tag, count2]) => ({ tag, count: count2 })).sort((a, b) => b.count - a.count).slice(0, 10),
        recentFeedbacks: feedbacks.slice(0, 20)
      };
    })
  }),
  // 联系我们路由
  contact: router({
    submit: publicProcedure.input(z12.object({
      name: z12.string().min(1, "\u8BF7\u8F93\u5165\u60A8\u7684\u59D3\u540D"),
      email: z12.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
      subject: z12.string().min(1, "\u8BF7\u8F93\u5165\u4E3B\u9898"),
      category: z12.enum(["general", "technical", "billing", "partnership", "feedback", "other"]),
      message: z12.string().min(10, "\u6D88\u606F\u5185\u5BB9\u81F3\u5C1110\u4E2A\u5B57\u7B26")
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25");
      const insertData = {
        name: input.name,
        email: input.email,
        subject: input.subject,
        category: input.category,
        message: input.message,
        status: "pending"
      };
      if (ctx.user?.id) {
        insertData.userId = ctx.user.id;
      }
      await db.insert(contactSubmissions).values(insertData);
      const categoryLabels = {
        general: "\u4E00\u822C\u54A8\u8BE2",
        technical: "\u6280\u672F\u652F\u6301",
        billing: "\u8D26\u5355\u95EE\u9898",
        partnership: "\u5546\u52A1\u5408\u4F5C",
        feedback: "\u610F\u89C1\u53CD\u9988",
        other: "\u5176\u4ED6"
      };
      try {
        await notifyOwner({
          title: `\u{1F4E9} \u65B0\u8054\u7CFB\u8868\u5355: ${input.subject}`,
          content: `**\u7C7B\u578B**: ${categoryLabels[input.category] || input.category}
**\u59D3\u540D**: ${input.name}
**\u90AE\u7BB1**: ${input.email}

**\u5185\u5BB9**:
${input.message}`
        });
      } catch (e) {
        console.error("Failed to send notification:", e);
      }
      return { success: true, message: "\u60A8\u7684\u6D88\u606F\u5DF2\u6210\u529F\u63D0\u4EA4\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u56DE\u590D\u60A8\uFF01" };
    }),
    // 管理员获取所有联系表单
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) return [];
      const submissions = await db.select().from(contactSubmissions).orderBy(desc12(contactSubmissions.createdAt)).limit(100);
      return submissions;
    }),
    // 管理员更新状态
    updateStatus: protectedProcedure.input(z12.object({
      id: z12.number(),
      status: z12.enum(["pending", "replied", "resolved", "closed"]),
      adminNotes: z12.string().optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25");
      const updateData = {
        status: input.status
      };
      if (input.adminNotes) {
        updateData.adminNotes = input.adminNotes;
      }
      if (input.status === "replied") {
        updateData.repliedAt = /* @__PURE__ */ new Date();
      }
      await db.update(contactSubmissions).set(updateData).where(eq14(contactSubmissions.id, input.id));
      return { success: true };
    })
  }),
  // 在线客服聊天路由
  chat: router({
    // 创建新的聊天会话
    createSession: publicProcedure.input(z12.object({
      userName: z12.string().optional(),
      userEmail: z12.string().email().optional(),
      topic: z12.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25");
      const sessionId = nanoid6();
      const insertData = {
        sessionId,
        userName: input.userName || ctx.user?.name || "\u6E38\u5BA2",
        userEmail: input.userEmail || ctx.user?.email,
        topic: input.topic || "\u4E00\u822C\u54A8\u8BE2",
        status: "waiting"
      };
      if (ctx.user?.id) {
        insertData.userId = ctx.user.id;
      }
      await db.insert(chatSessions).values(insertData);
      await db.insert(chatMessages).values({
        sessionId,
        senderType: "system",
        senderName: "\u7CFB\u7EDF",
        content: "\u60A8\u597D\uFF01\u6B22\u8FCE\u8054\u7CFB\u6D1E\u5BDF\u672A\u6765\u5BA2\u670D\u3002\u8BF7\u63CF\u8FF0\u60A8\u7684\u95EE\u9898\uFF0C\u6211\u4EEC\u7684\u5BA2\u670D\u4EBA\u5458\u5C06\u5C3D\u5FEB\u4E3A\u60A8\u670D\u52A1\u3002",
        messageType: "system"
      });
      try {
        await notifyOwner({
          title: `\u{1F4AC} \u65B0\u5BA2\u670D\u4F1A\u8BDD`,
          content: `**\u7528\u6237**: ${insertData.userName}
**\u4E3B\u9898**: ${insertData.topic}

\u8BF7\u524D\u5F80\u7BA1\u7406\u540E\u53F0\u5904\u7406`
        });
      } catch (e) {
        console.error("Failed to send notification:", e);
      }
      return { sessionId };
    }),
    // 发送消息
    sendMessage: publicProcedure.input(z12.object({
      sessionId: z12.string(),
      content: z12.string().min(1),
      messageType: z12.enum(["text", "image", "file"]).default("text"),
      fileUrl: z12.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25");
      const sessions = await db.select().from(chatSessions).where(eq14(chatSessions.sessionId, input.sessionId)).limit(1);
      if (sessions.length === 0) {
        throw new Error("\u4F1A\u8BDD\u4E0D\u5B58\u5728");
      }
      const session = sessions[0];
      if (session.status === "closed") {
        throw new Error("\u4F1A\u8BDD\u5DF2\u5173\u95ED");
      }
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        senderType: "user",
        senderId: ctx.user?.id,
        senderName: ctx.user?.name || session.userName || "\u6E38\u5BA2",
        content: input.content,
        messageType: input.messageType,
        fileUrl: input.fileUrl
      });
      await db.update(chatSessions).set({ lastMessageAt: /* @__PURE__ */ new Date() }).where(eq14(chatSessions.sessionId, input.sessionId));
      if (session.status === "waiting") {
        try {
          const aiResponse = await generateAICustomerServiceReply(input.content);
          if (aiResponse) {
            await db.insert(chatMessages).values({
              sessionId: input.sessionId,
              senderType: "system",
              senderName: "AI\u52A9\u624B",
              content: aiResponse,
              messageType: "text"
            });
          }
        } catch (e) {
          console.error("AI auto-reply failed:", e);
        }
      }
      return { success: true };
    }),
    // 获取会话消息
    getMessages: publicProcedure.input(z12.object({
      sessionId: z12.string(),
      lastId: z12.number().optional()
    })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      let query = db.select().from(chatMessages).where(eq14(chatMessages.sessionId, input.sessionId)).orderBy(chatMessages.createdAt).limit(100);
      if (input.lastId) {
        query = db.select().from(chatMessages).where(and11(
          eq14(chatMessages.sessionId, input.sessionId),
          sql12`${chatMessages.id} > ${input.lastId}`
        )).orderBy(chatMessages.createdAt).limit(100);
      }
      return await query;
    }),
    // 获取会话状态
    getSession: publicProcedure.input(z12.object({ sessionId: z12.string() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const sessions = await db.select().from(chatSessions).where(eq14(chatSessions.sessionId, input.sessionId)).limit(1);
      return sessions[0] || null;
    }),
    // 用户关闭会话
    closeSession: publicProcedure.input(z12.object({
      sessionId: z12.string(),
      rating: z12.number().min(1).max(5).optional(),
      feedback: z12.string().optional()
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25");
      await db.update(chatSessions).set({
        status: "closed",
        closedAt: /* @__PURE__ */ new Date(),
        closedBy: "user",
        rating: input.rating,
        feedback: input.feedback
      }).where(eq14(chatSessions.sessionId, input.sessionId));
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        senderType: "system",
        senderName: "\u7CFB\u7EDF",
        content: "\u4F1A\u8BDD\u5DF2\u7ED3\u675F\uFF0C\u611F\u8C22\u60A8\u7684\u54A8\u8BE2\uFF01",
        messageType: "system"
      });
      return { success: true };
    }),
    // 管理员获取所有会话
    adminGetSessions: protectedProcedure.input(z12.object({
      status: z12.enum(["waiting", "active", "closed", "all"]).default("all")
    })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) return [];
      if (input.status === "all") {
        return await db.select().from(chatSessions).orderBy(desc12(chatSessions.updatedAt)).limit(100);
      }
      return await db.select().from(chatSessions).where(eq14(chatSessions.status, input.status)).orderBy(desc12(chatSessions.updatedAt)).limit(100);
    }),
    // 管理员发送消息
    adminSendMessage: protectedProcedure.input(z12.object({
      sessionId: z12.string(),
      content: z12.string().min(1)
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25");
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        senderType: "admin",
        senderId: ctx.user.id,
        senderName: ctx.user.name || "\u5BA2\u670D",
        content: input.content,
        messageType: "text"
      });
      await db.update(chatSessions).set({
        status: "active",
        assignedAdminId: ctx.user.id,
        lastMessageAt: /* @__PURE__ */ new Date()
      }).where(eq14(chatSessions.sessionId, input.sessionId));
      return { success: true };
    }),
    // 管理员关闭会话
    adminCloseSession: protectedProcedure.input(z12.object({ sessionId: z12.string() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new Error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25");
      await db.update(chatSessions).set({
        status: "closed",
        closedAt: /* @__PURE__ */ new Date(),
        closedBy: "admin"
      }).where(eq14(chatSessions.sessionId, input.sessionId));
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        senderType: "system",
        senderName: "\u7CFB\u7EDF",
        content: "\u5BA2\u670D\u5DF2\u7ED3\u675F\u672C\u6B21\u4F1A\u8BDD\uFF0C\u611F\u8C22\u60A8\u7684\u54A8\u8BE2\uFF01",
        messageType: "system"
      });
      return { success: true };
    }),
    // 管理员获取客服统计数据
    adminGetStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError5({ code: "FORBIDDEN", message: "Admin only" });
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
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }
      const allSessions = await db.select().from(chatSessions);
      const totalSessions = allSessions.length;
      const waitingSessions = allSessions.filter((s) => s.status === "waiting").length;
      const activeSessions = allSessions.filter((s) => s.status === "active").length;
      const closedSessions = allSessions.filter((s) => s.status === "closed").length;
      const now = /* @__PURE__ */ new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      const todaySessions = allSessions.filter(
        (s) => s.createdAt && new Date(s.createdAt) >= todayStart
      ).length;
      const weekSessions = allSessions.filter(
        (s) => s.createdAt && new Date(s.createdAt) >= weekStart
      ).length;
      const ratedSessions = allSessions.filter((s) => s.rating !== null && s.rating !== void 0);
      const avgRating = ratedSessions.length > 0 ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length : 0;
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratedSessions.forEach((s) => {
        const rating = s.rating;
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating]++;
        }
      });
      let totalResponseTime = 0;
      let respondedCount = 0;
      for (const session of allSessions) {
        if (session.status !== "waiting" && session.createdAt) {
          const messages = await db.select().from(chatMessages).where(eq14(chatMessages.sessionId, session.sessionId)).orderBy(chatMessages.createdAt);
          const firstAdminMessage = messages.find((m) => m.senderType === "admin");
          if (firstAdminMessage && firstAdminMessage.createdAt) {
            const responseTime = new Date(firstAdminMessage.createdAt).getTime() - new Date(session.createdAt).getTime();
            totalResponseTime += responseTime;
            respondedCount++;
          }
        }
      }
      const avgResponseTime = respondedCount > 0 ? Math.round(totalResponseTime / respondedCount / 1e3 / 60) : 0;
      return {
        totalSessions,
        waitingSessions,
        activeSessions,
        closedSessions,
        avgRating: Math.round(avgRating * 10) / 10,
        avgResponseTime,
        todaySessions,
        weekSessions,
        ratingDistribution
      };
    })
  }),
  // 报告持久化存储路由
  reports: router({
    // 保存报告
    save: protectedProcedure.input(z12.object({
      reportType: z12.enum(["tarot", "bazi", "horoscope", "dream"]),
      title: z12.string().min(1).max(200),
      inputSummary: z12.string().optional(),
      reportData: z12.any(),
      aiInterpretation: z12.string().optional(),
      isPaid: z12.boolean().optional()
    })).mutation(async ({ ctx, input }) => {
      const reportId = await saveReport({
        userId: ctx.user.id,
        reportType: input.reportType,
        title: input.title,
        inputSummary: input.inputSummary,
        reportData: input.reportData,
        aiInterpretation: input.aiInterpretation,
        isPaid: input.isPaid
      });
      const typeLabel2 = {
        tarot: "Tarot Reading",
        bazi: "BaZi Analysis",
        horoscope: "Horoscope",
        dream: "Dream Interpretation"
      };
      await createNotification({
        userId: ctx.user.id,
        type: "report",
        title: `${typeLabel2[input.reportType] || "Report"} Saved`,
        message: `Your ${input.title} has been saved to your profile.`,
        link: "/profile",
        icon: "file"
      });
      return { id: reportId };
    }),
    // 获取报告列表
    list: protectedProcedure.input(z12.object({
      reportType: z12.enum(["tarot", "bazi", "horoscope", "dream"]).optional(),
      limit: z12.number().min(1).max(50).default(20),
      offset: z12.number().min(0).default(0),
      favoritesOnly: z12.boolean().optional()
    }).optional()).query(async ({ ctx, input }) => {
      return getUserReports(ctx.user.id, {
        reportType: input?.reportType,
        limit: input?.limit,
        offset: input?.offset,
        favoritesOnly: input?.favoritesOnly
      });
    }),
    // 获取单个报告详情
    getById: protectedProcedure.input(z12.object({ id: z12.number() })).query(async ({ ctx, input }) => {
      const report = await getReportById(input.id, ctx.user.id);
      if (!report) {
        throw new Error("Report not found");
      }
      return report;
    }),
    // 切换收藏
    toggleFavorite: protectedProcedure.input(z12.object({ id: z12.number() })).mutation(async ({ ctx, input }) => {
      const isFavorite = await toggleReportFavorite(input.id, ctx.user.id);
      return { isFavorite };
    }),
    // 删除报告
    delete: protectedProcedure.input(z12.object({ id: z12.number() })).mutation(async ({ ctx, input }) => {
      const deleted = await deleteReport(input.id, ctx.user.id);
      return { deleted };
    })
  })
});

// server/_core/context.ts
init_sdk();
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs3 from "fs";
import { nanoid as nanoid7 } from "nanoid";
import path4 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";

// client/vite-plugin-sw-version.ts
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
function swVersionPlugin() {
  return {
    name: "sw-version",
    apply: "build",
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "..", "dist", "public");
      const swPath = path.join(outDir, "sw.js");
      if (!fs.existsSync(swPath)) {
        console.warn("[sw-version] sw.js not found in build output, skipping version injection");
        return;
      }
      const buildId = crypto.createHash("md5").update(Date.now().toString() + crypto.randomBytes(8).toString("hex")).digest("hex").slice(0, 12);
      const version = `build-${buildId}`;
      let swContent = fs.readFileSync(swPath, "utf-8");
      swContent = swContent.replace(/__SW_VERSION__/g, version);
      fs.writeFileSync(swPath, swContent, "utf-8");
      console.log(`[sw-version] Injected SW version: ${version}`);
    }
  };
}

// vite.config.ts
var plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  // Pre-compress assets at build time (gzip + brotli)
  compression({
    algorithms: ["gzip", "brotliCompress"],
    exclude: [/\.(br)$/, /\.(gz)$/],
    threshold: 1024
  }),
  // Inject unique build hash into sw.js so browsers detect new deployments
  swVersionPlugin()
];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path2.resolve(import.meta.dirname),
  root: path2.resolve(import.meta.dirname, "client"),
  publicDir: path2.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    /**
     * Chunk splitting strategy:
     * 
     * Prefer fewer chunks on high-TTFB hosts (less request overhead).
     * 
     * Strategy: 
     * - 1 core vendor chunk (React + ReactDOM + tRPC + Query + all utils)
     * - 1 UI vendor chunk (Radix UI)
     * - Lazy-loaded: animation, markdown, charts (only when needed)
     * - Page-level code splitting for all routes
     * 
     * Total first-load HTTP requests: HTML + CSS + vendor.js + vendor-ui.js + index.js = 5 parallel
     */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion") || id.includes("@motionone")) {
              return "vendor-animation";
            }
            if (id.includes("react-markdown") || id.includes("remark") || id.includes("rehype") || id.includes("unified") || id.includes("micromark") || id.includes("mdast") || id.includes("hast")) {
              return "vendor-markdown";
            }
            if (id.includes("recharts") || id.includes("d3-")) {
              return "vendor-charts";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-ui";
            }
            return "vendor";
          }
        }
      }
    },
    minify: "esbuild",
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    sourcemap: false,
    chunkSizeWarningLimit: 900
  },
  server: {
    host: true,
    allowedHosts: ["all"],
    hmr: {
      clientPort: 443,
      protocol: "wss"
    },
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/shopStatic.ts
import fs2 from "fs";
import https from "https";
import path3 from "path";
import { fileURLToPath } from "url";
var __dirname2 = path3.dirname(fileURLToPath(import.meta.url));
var SHOP_PRETTY = {
  "/shop": "/shop/index.html",
  "/shop/": "/shop/index.html",
  "/shop/listing-rewrite": "/shop/listing-rewrite.html",
  "/shop/listing-rewrite/": "/shop/listing-rewrite.html",
  "/shop/s/monday-mood": "/shop/s/monday-mood.html",
  "/shop/s/monday-mood/": "/shop/s/monday-mood.html",
  "/shop/s/focus-todo": "/shop/s/focus-todo.html",
  "/shop/s/focus-todo/": "/shop/s/focus-todo.html",
  "/shop/d/k7m2-ship": "/shop/d/k7m2-ship.html",
  "/shop/d/k7m2-ship/": "/shop/d/k7m2-ship.html",
  "/shop/d/applocale-thanks": "/shop/d/applocale-thanks.html",
  "/shop/d/applocale-thanks/": "/shop/d/applocale-thanks.html",
  "/shop/d/brief-thanks": "/shop/d/brief-thanks.html",
  "/shop/d/brief-thanks/": "/shop/d/brief-thanks.html"
};
var MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};
function publicRoots() {
  return [
    path3.resolve(__dirname2, "public"),
    path3.resolve(__dirname2, "..", "..", "dist", "public"),
    path3.resolve(__dirname2, "..", "..", "client", "public")
  ];
}
function isShopPath(pathname) {
  return pathname === "/shop" || pathname.startsWith("/shop/");
}
function resolveShopRelative(urlPath) {
  return SHOP_PRETTY[urlPath] ?? urlPath;
}
function resolveShopFile(urlPath) {
  const rel = resolveShopRelative(urlPath);
  for (const root of publicRoots()) {
    const file = path3.normalize(path3.join(root, rel.replace(/^\//, "")));
    if (!file.startsWith(root)) continue;
    if (fs2.existsSync(file) && fs2.statSync(file).isFile()) return file;
  }
  return null;
}
function sendShopFile(res, file) {
  const ext = path3.extname(file).toLowerCase();
  res.set({
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "public, max-age=3600" : "public, max-age=86400",
    "X-Content-Type-Options": "nosniff",
    "X-Fortune-Shop": "local"
  });
  res.sendFile(file);
}
function proxyShopFromRender(req, res) {
  const edge = process.env.SHOP_EDGE_URL?.replace(/\/$/, "") || "https://fortune-insight.onrender.com";
  const target = `${edge}${req.originalUrl || req.url || "/shop/"}`;
  https.get(target, (up) => {
    if ((up.statusCode || 500) >= 400) {
      res.status(up.statusCode || 502).type("text/plain").send("shop unavailable");
      return;
    }
    const headers = { ...up.headers };
    delete headers["transfer-encoding"];
    headers["x-fortune-shop"] = "render-edge";
    res.writeHead(up.statusCode || 200, headers);
    up.pipe(res);
  }).on("error", () => {
    res.status(502).type("text/plain").send("shop edge unavailable");
  });
}
function registerShopStaticRoutes(app) {
  app.use((req, res, next) => {
    const method = req.method || "GET";
    if (method !== "GET" && method !== "HEAD") {
      next();
      return;
    }
    const urlPath = decodeURIComponent((req.originalUrl || req.url || "/").split("?")[0]);
    if (!isShopPath(urlPath)) {
      next();
      return;
    }
    const file = resolveShopFile(urlPath);
    if (file) {
      if (method === "HEAD") {
        res.set({
          "Content-Type": MIME[path3.extname(file).toLowerCase()] || "application/octet-stream",
          "X-Fortune-Shop": "local"
        });
        res.status(200).end();
        return;
      }
      sendShopFile(res, file);
      return;
    }
    if (method === "HEAD") {
      res.status(404).end();
      return;
    }
    proxyShopFromRender(req, res);
  });
}

// server/_core/vite.ts
var PUBLIC_HTML_PRETTY_PATHS = {
  "/free-tarot": "/free-tarot.html",
  "/free-tarot/": "/free-tarot.html",
  "/shop": "/shop/index.html",
  "/shop/": "/shop/index.html",
  "/shop/listing-rewrite": "/shop/listing-rewrite.html",
  "/shop/listing-rewrite/": "/shop/listing-rewrite.html",
  "/shop/s/monday-mood": "/shop/s/monday-mood.html",
  "/shop/s/monday-mood/": "/shop/s/monday-mood.html",
  "/shop/s/focus-todo": "/shop/s/focus-todo.html",
  "/shop/s/focus-todo/": "/shop/s/focus-todo.html",
  "/shop/d/k7m2-ship": "/shop/d/k7m2-ship.html",
  "/shop/d/k7m2-ship/": "/shop/d/k7m2-ship.html",
  "/shop/d/applocale-thanks": "/shop/d/applocale-thanks.html",
  "/shop/d/applocale-thanks/": "/shop/d/applocale-thanks.html",
  "/shop/d/brief-thanks": "/shop/d/brief-thanks.html",
  "/shop/d/brief-thanks/": "/shop/d/brief-thanks.html"
};
function registerFreeTarotPrettyPath(app) {
  registerPublicHtmlPrettyPaths(app);
}
function registerPublicHtmlPrettyPaths(app) {
  app.use((req, _res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    const target = PUBLIC_HTML_PRETTY_PATHS[req.path];
    if (target) {
      req.url = target;
    }
    next();
  });
}
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  registerFreeTarotPrettyPath(app);
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    if (trySendAsset404(req, res)) return;
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid7()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
var MIME_TYPES = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};
function servePreCompressed(distPath) {
  return (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const urlPath = req.path;
    const filePath = path4.join(distPath, urlPath);
    if (!fs3.existsSync(filePath) || fs3.statSync(filePath).isDirectory()) {
      return next();
    }
    const ext = path4.extname(urlPath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const acceptEncoding = req.headers["accept-encoding"] || "";
    const isHashedAsset = urlPath.startsWith("/assets/");
    const cacheControl = isHashedAsset ? "public, max-age=31536000, immutable" : "public, max-age=3600";
    if (acceptEncoding.includes("br")) {
      const brPath = filePath + ".br";
      if (fs3.existsSync(brPath)) {
        res.set({
          "Content-Type": contentType,
          "Content-Encoding": "br",
          "Cache-Control": cacheControl,
          "Vary": "Accept-Encoding",
          "X-Content-Type-Options": "nosniff"
        });
        if (isHashedAsset) {
          res.removeHeader("ETag");
          res.removeHeader("Last-Modified");
        }
        return res.sendFile(brPath);
      }
    }
    if (acceptEncoding.includes("gzip")) {
      const gzPath = filePath + ".gz";
      if (fs3.existsSync(gzPath)) {
        res.set({
          "Content-Type": contentType,
          "Content-Encoding": "gzip",
          "Cache-Control": cacheControl,
          "Vary": "Accept-Encoding",
          "X-Content-Type-Options": "nosniff"
        });
        if (isHashedAsset) {
          res.removeHeader("ETag");
          res.removeHeader("Last-Modified");
        }
        return res.sendFile(gzPath);
      }
    }
    next();
  };
}
function getRequestPathname(req) {
  return (req.originalUrl || req.url || req.path || "").split("?")[0];
}
function shouldReturnAsset404(pathname) {
  const p = pathname.split("?")[0] || "";
  return p.startsWith("/assets/") || /\.(js|css|map|mjs|wasm)$/i.test(p);
}
function trySendAsset404(req, res) {
  const p = getRequestPathname(req);
  if (!shouldReturnAsset404(p)) return false;
  res.set({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.status(404).type("text/plain").send("Asset not found");
  return true;
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path4.resolve(import.meta.dirname, "../..", "dist", "public") : path4.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  registerFreeTarotPrettyPath(app);
  app.use((_req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("X-DNS-Prefetch-Control", "on");
    next();
  });
  app.use(servePreCompressed(distPath));
  app.use(
    "/assets",
    express.static(path4.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
      etag: false,
      lastModified: false
    })
  );
  app.use("/sw.js", (_req, res, next) => {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    next();
  });
  app.use(
    express.static(distPath, {
      maxAge: "1h",
      etag: true
    })
  );
  app.use((req, res) => {
    if (trySendAsset404(req, res)) return;
    const pathname = getRequestPathname(req);
    if (isShopPath(pathname)) {
      res.status(404).type("text/plain").send("shop page not found");
      return;
    }
    res.set({
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff"
    });
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/og-image.ts
import { Router as Router2 } from "express";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import fs4 from "fs";
import path5 from "path";
import https2 from "https";
import http from "http";

// server/og-icons.ts
function drawCrystalBall(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;
  const glow = ctx.createRadialGradient(cx, cy - r * 0.1, r * 0.2, cx, cy - r * 0.1, r * 1.2);
  glow.addColorStop(0, hexAlpha(color, 0.3));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r * 1.2, 0, Math.PI * 2);
  ctx.fill();
  const ballGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.35, r * 0.1, cx, cy - r * 0.1, r);
  ballGrad.addColorStop(0, hexAlpha(color, 0.6));
  ballGrad.addColorStop(0.5, hexAlpha(color, 0.25));
  ballGrad.addColorStop(1, hexAlpha(color, 0.1));
  ctx.fillStyle = ballGrad;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexAlpha(color, 0.5);
  ctx.lineWidth = size * 0.03;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = hexAlpha("#ffffff", 0.25);
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.25, cy - r * 0.4, r * 0.2, r * 0.12, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha(color, 0.35);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.6, cy + r * 0.85);
  ctx.quadraticCurveTo(cx - r * 0.7, cy + r * 1.15, cx - r * 0.3, cy + r * 1.15);
  ctx.lineTo(cx + r * 0.3, cy + r * 1.15);
  ctx.quadraticCurveTo(cx + r * 0.7, cy + r * 1.15, cx + r * 0.6, cy + r * 0.85);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawYinYang(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.3);
  glow.addColorStop(0, hexAlpha(color, 0.15));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha("#ffffff", 0.85);
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha(color, 0.7);
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha("#ffffff", 0.85);
  ctx.beginPath();
  ctx.arc(cx, cy - r / 2, r / 2, Math.PI / 2, -Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha(color, 0.7);
  ctx.beginPath();
  ctx.arc(cx, cy + r / 2, r / 2, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha(color, 0.8);
  ctx.beginPath();
  ctx.arc(cx, cy - r / 2, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha("#ffffff", 0.9);
  ctx.beginPath();
  ctx.arc(cx, cy + r / 2, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexAlpha(color, 0.4);
  ctx.lineWidth = size * 0.025;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
function drawStar(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.4);
  glow.addColorStop(0, hexAlpha(color, 0.25));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
  ctx.fill();
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = i * Math.PI / spikes - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  const starGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  starGrad.addColorStop(0, hexAlpha(color, 0.9));
  starGrad.addColorStop(1, hexAlpha(color, 0.5));
  ctx.fillStyle = starGrad;
  ctx.fill();
  ctx.strokeStyle = hexAlpha(color, 0.3);
  ctx.lineWidth = size * 0.02;
  ctx.stroke();
  ctx.restore();
}
function drawMoon(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.3);
  glow.addColorStop(0, hexAlpha(color, 0.2));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexAlpha(color, 0.8);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.beginPath();
  ctx.arc(cx + r * 0.45, cy - r * 0.15, r * 0.75, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  const starPositions = [
    { x: cx + r * 0.8, y: cy - r * 0.7, s: size * 0.06 },
    { x: cx + r * 1, y: cy - r * 0.2, s: size * 0.04 },
    { x: cx + r * 0.6, y: cy + r * 0.6, s: size * 0.05 }
  ];
  for (const sp of starPositions) {
    drawSmallStar(ctx, sp.x, sp.y, sp.s, color, 0.6);
  }
  ctx.restore();
}
function drawHearts(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  drawHeart(ctx, cx, cy, size * 0.8, color, 0.8);
  drawHeart(ctx, cx + size * 0.3, cy - size * 0.2, size * 0.5, color, 0.5);
  ctx.restore();
}
function drawHeart(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.7);
  ctx.bezierCurveTo(cx - s * 1.2, cy - s * 0.1, cx - s * 0.7, cy - s * 0.9, cx, cy - s * 0.35);
  ctx.bezierCurveTo(cx + s * 0.7, cy - s * 0.9, cx + s * 1.2, cy - s * 0.1, cx, cy + s * 0.7);
  ctx.closePath();
  const heartGrad = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
  heartGrad.addColorStop(0, hexAlpha(color, 0.9));
  heartGrad.addColorStop(1, hexAlpha(color, 0.5));
  ctx.fillStyle = heartGrad;
  ctx.fill();
  ctx.restore();
}
function drawSparkle(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.2);
  glow.addColorStop(0, hexAlpha(color, 0.3));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
  ctx.fill();
  const armLen = r;
  const armWidth = r * 0.15;
  ctx.fillStyle = hexAlpha(color, 0.9);
  ctx.beginPath();
  ctx.moveTo(cx, cy - armLen);
  ctx.quadraticCurveTo(cx + armWidth, cy - armWidth, cx + armLen, cy);
  ctx.quadraticCurveTo(cx + armWidth, cy + armWidth, cx, cy + armLen);
  ctx.quadraticCurveTo(cx - armWidth, cy + armWidth, cx - armLen, cy);
  ctx.quadraticCurveTo(cx - armWidth, cy - armWidth, cx, cy - armLen);
  ctx.closePath();
  ctx.fill();
  const d = r * 0.55;
  const dw = r * 0.1;
  ctx.fillStyle = hexAlpha(color, 0.6);
  ctx.beginPath();
  ctx.moveTo(cx, cy - d);
  ctx.quadraticCurveTo(cx + dw, cy - dw, cx + d, cy);
  ctx.quadraticCurveTo(cx + dw, cy + dw, cx, cy + d);
  ctx.quadraticCurveTo(cx - dw, cy + dw, cx - d, cy);
  ctx.quadraticCurveTo(cx - dw, cy - dw, cx, cy - d);
  ctx.closePath();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.translate(-cx, -cy);
  ctx.beginPath();
  ctx.moveTo(cx, cy - d);
  ctx.quadraticCurveTo(cx + dw, cy - dw, cx + d, cy);
  ctx.quadraticCurveTo(cx + dw, cy + dw, cx, cy + d);
  ctx.quadraticCurveTo(cx - dw, cy + dw, cx - d, cy);
  ctx.quadraticCurveTo(cx - dw, cy - dw, cx, cy - d);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.restore();
}
function drawSmallHeart(ctx, x, y, size, color) {
  ctx.save();
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.5);
  ctx.bezierCurveTo(x - s * 1, y - s * 0.2, x - s * 0.5, y - s * 0.8, x, y - s * 0.2);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.8, x + s * 1, y - s * 0.2, x, y + s * 0.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
function drawSmallBriefcase(ctx, x, y, size, color) {
  ctx.save();
  const s = size;
  ctx.fillStyle = color;
  roundRectPath(ctx, x - s * 0.45, y - s * 0.2, s * 0.9, s * 0.6, s * 0.08);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.08;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.2, y - s * 0.2);
  ctx.lineTo(x - s * 0.2, y - s * 0.38);
  ctx.quadraticCurveTo(x - s * 0.2, y - s * 0.48, x - s * 0.1, y - s * 0.48);
  ctx.lineTo(x + s * 0.1, y - s * 0.48);
  ctx.quadraticCurveTo(x + s * 0.2, y - s * 0.48, x + s * 0.2, y - s * 0.38);
  ctx.lineTo(x + s * 0.2, y - s * 0.2);
  ctx.stroke();
  ctx.fillStyle = hexAlpha(color, 0.5);
  ctx.fillRect(x - s * 0.02, y - s * 0.15, s * 0.04, s * 0.45);
  ctx.restore();
}
function drawSmallCoin(ctx, x, y, size, color) {
  ctx.save();
  const r = size * 0.4;
  ctx.fillStyle = hexAlpha(color, 0.8);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexAlpha(color, 0.5);
  ctx.lineWidth = size * 0.06;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = hexAlpha("#000000", 0.5);
  ctx.font = `bold ${size * 0.4}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", x, y + 1);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.restore();
}
function drawSmallStar(ctx, cx, cy, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const r = size;
  const w = size * 0.25;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + w, cy - w, cx + r, cy);
  ctx.quadraticCurveTo(cx + w, cy + w, cx, cy + r);
  ctx.quadraticCurveTo(cx - w, cy + w, cx - r, cy);
  ctx.quadraticCurveTo(cx - w, cy - w, cx, cy - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
function hexAlpha(hex, alpha) {
  if (hex.startsWith("rgba")) return hex;
  if (hex.startsWith("rgb")) {
    const match = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function drawIcon(ctx, type, cx, cy, size, color, alpha = 1) {
  switch (type) {
    case "crystal-ball":
      drawCrystalBall(ctx, cx, cy, size, color, alpha);
      break;
    case "yin-yang":
      drawYinYang(ctx, cx, cy, size, color, alpha);
      break;
    case "star":
      drawStar(ctx, cx, cy, size, color, alpha);
      break;
    case "moon":
      drawMoon(ctx, cx, cy, size, color, alpha);
      break;
    case "hearts":
      drawHearts(ctx, cx, cy, size, color, alpha);
      break;
    case "sparkle":
      drawSparkle(ctx, cx, cy, size, color, alpha);
      break;
  }
}

// server/og-image.ts
var FONTS_DIR = path5.join(import.meta.dirname || __dirname, "fonts");
var fontDefs = [
  {
    filename: "DejaVuSans.ttf",
    familyName: "DejaVuSans",
    systemPaths: [
      "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
      "/usr/share/fonts/TTF/DejaVuSans.ttf"
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/kFBFiwQTMGDsTFVM.ttf"
  },
  {
    filename: "DejaVuSans-Bold.ttf",
    familyName: "DejaVuSans-Bold",
    systemPaths: [
      "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
      "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf"
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/MAenJYmuXGuvXSYu.ttf"
  },
  {
    filename: "NotoSansCJKsc-Regular.otf",
    familyName: "NotoSansCJKSC",
    systemPaths: [
      "/usr/share/fonts/opentype/noto/NotoSansCJKsc-Regular.otf",
      "/usr/share/fonts/noto-cjk/NotoSansCJKsc-Regular.otf"
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/KzZkWiFRVyOPUjKF.otf"
  },
  {
    filename: "NotoSansCJKsc-Bold.otf",
    familyName: "NotoSansCJKSC-Bold",
    systemPaths: [
      "/usr/share/fonts/opentype/noto/NotoSansCJKsc-Bold.otf",
      "/usr/share/fonts/noto-cjk/NotoSansCJKsc-Bold.otf"
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/tFaIhkaVmuuKHPjI.otf"
  }
];
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https2 : http;
    const file = fs4.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs4.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs4.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (e) => {
      file.close();
      fs4.unlinkSync(dest);
      reject(e);
    });
  });
}
async function ensureFonts() {
  if (!fs4.existsSync(FONTS_DIR)) {
    fs4.mkdirSync(FONTS_DIR, { recursive: true });
  }
  for (const def of fontDefs) {
    const localPath = path5.join(FONTS_DIR, def.filename);
    if (fs4.existsSync(localPath)) {
      try {
        GlobalFonts.registerFromPath(localPath, def.familyName);
        console.log(`[OG Font] Registered from project: ${def.familyName}`);
        continue;
      } catch (e) {
        console.warn(`[OG Font] Failed to register local ${def.familyName}:`, e);
      }
    }
    let registered = false;
    for (const sp of def.systemPaths) {
      if (fs4.existsSync(sp)) {
        try {
          GlobalFonts.registerFromPath(sp, def.familyName);
          console.log(`[OG Font] Registered from system: ${def.familyName} (${sp})`);
          try {
            fs4.copyFileSync(sp, localPath);
          } catch {
          }
          registered = true;
          break;
        } catch {
        }
      }
    }
    if (registered) continue;
    try {
      console.log(`[OG Font] Downloading ${def.familyName} from CDN...`);
      await downloadFile(def.cdnUrl, localPath);
      GlobalFonts.registerFromPath(localPath, def.familyName);
      console.log(`[OG Font] Downloaded and registered: ${def.familyName}`);
    } catch (e) {
      console.error(`[OG Font] Failed to download ${def.familyName}:`, e);
    }
  }
}
var fontsReady = ensureFonts();
var themes = {
  tarot: {
    bgGradient: ["#0c0520", "#1a0a3e", "#0c0520"],
    accent: "#c8a45a",
    accentLight: "#f0d878",
    icon: "crystal-ball",
    label: { zh: "AI\u5854\u7F57\u5360\u535C", en: "AI Tarot Reading" }
  },
  bazi: {
    bgGradient: ["#0a0800", "#1a1005", "#0a0800"],
    accent: "#d4a853",
    accentLight: "#f5d98a",
    icon: "yin-yang",
    label: { zh: "AI\u516B\u5B57\u7CBE\u6279", en: "AI BaZi Analysis" }
  },
  horoscope: {
    bgGradient: ["#050a18", "#0f2a58", "#050a18"],
    accent: "#60a5fa",
    accentLight: "#93c5fd",
    icon: "star",
    label: { zh: "\u661F\u5EA7\u8FD0\u52BF", en: "Horoscope" }
  },
  dream: {
    bgGradient: ["#020d0d", "#0f4040", "#020d0d"],
    accent: "#2dd4bf",
    accentLight: "#5eead4",
    icon: "moon",
    label: { zh: "AI\u89E3\u68A6", en: "Dream Interpretation" }
  },
  compatibility: {
    bgGradient: ["#0d0515", "#2a1050", "#0d0515"],
    accent: "#f472b6",
    accentLight: "#fb7185",
    icon: "hearts",
    label: { zh: "\u661F\u5EA7\u5408\u76D8", en: "Compatibility" }
  },
  default: {
    bgGradient: ["#080918", "#0f1428", "#080918"],
    accent: "#d4a843",
    accentLight: "#f0d878",
    icon: "sparkle",
    label: { zh: "\u6D1E\u5BDF\u672A\u6765", en: "Fortune Insight" }
  }
};
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function wrapText(ctx, text2, maxWidth, maxLines) {
  const lines = [];
  const paragraphs = text2.split(/\n/);
  for (const para of paragraphs) {
    if (lines.length >= maxLines) break;
    const chars = para.split("");
    let currentLine = "";
    for (const char of chars) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;
        if (lines.length >= maxLines) {
          lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1) + "...";
          break;
        }
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }
  }
  return lines;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
function drawBackground(ctx, W, H, theme) {
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, theme.bgGradient[0]);
  bgGrad.addColorStop(0.5, theme.bgGradient[1]);
  bgGrad.addColorStop(1, theme.bgGradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 15; i++) {
    const cx = (i * 137.5 + 50) % W;
    const cy = (i * 89.3 + 30) % H;
    const r = 20 + i * 17 % 70;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, hexToRgba(theme.accent, 0.3));
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const barGrad = ctx.createLinearGradient(0, 0, 0, H);
  barGrad.addColorStop(0, hexToRgba(theme.accent, 0.8));
  barGrad.addColorStop(0.5, hexToRgba(theme.accentLight, 0.6));
  barGrad.addColorStop(1, hexToRgba(theme.accent, 0.3));
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, 5, H);
  ctx.fillStyle = hexToRgba(theme.accent, 0.15);
  ctx.fillRect(40, 38, W - 80, 1);
  ctx.fillRect(40, H - 38, W - 80, 1);
}
function drawHeader(ctx, W, theme, lang, fontFamily) {
  ctx.font = `bold 15px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accent, 0.6);
  ctx.textAlign = "left";
  const brandLabel = lang === "zh" ? "FORTUNE INSIGHT \xB7 \u6D1E\u5BDF\u672A\u6765" : "FORTUNE INSIGHT";
  ctx.fillText(brandLabel, 48, 68);
  const typeLabel2 = theme.label[lang];
  ctx.font = `bold 16px ${fontFamily}`;
  const badgeWidth = ctx.measureText(typeLabel2).width + 28;
  const badgeX = W - badgeWidth - 48;
  ctx.fillStyle = hexToRgba(theme.accent, 0.12);
  roundRect(ctx, badgeX, 50, badgeWidth, 30, 15);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.25);
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX, 50, badgeWidth, 30, 15);
  ctx.stroke();
  ctx.fillStyle = theme.accent;
  ctx.textAlign = "center";
  ctx.fillText(typeLabel2, badgeX + badgeWidth / 2, 71);
  ctx.textAlign = "left";
}
function drawFooter(ctx, W, H, theme, lang, fontFamily) {
  const ctaY = H - 62;
  ctx.font = `bold 18px ${fontFamily}`;
  const ctaText = lang === "zh" ? "\u2605 \u6765 fortunesite.one \u83B7\u53D6\u4F60\u7684\u4E13\u5C5E\u5206\u6790" : "\u2605 Get your free reading at fortunesite.one";
  drawSparkle(ctx, 55, ctaY - 1, 16, theme.accentLight, 0.9);
  const ctaWidth = ctx.measureText(ctaText).width + 36;
  ctx.fillStyle = hexToRgba(theme.accent, 0.1);
  roundRect(ctx, 40, ctaY - 18, ctaWidth, 34, 17);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.2);
  ctx.lineWidth = 1;
  roundRect(ctx, 40, ctaY - 18, ctaWidth, 34, 17);
  ctx.stroke();
  ctx.fillStyle = theme.accentLight;
  ctx.fillText(ctaText, 58, ctaY + 4);
  ctx.font = `14px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "right";
  ctx.fillText("fortunesite.one", W - 48, H - 48);
  ctx.textAlign = "left";
}
function drawScoreBar(ctx, x, y, w, h, score, maxScore, color, label, fontFamily) {
  ctx.font = `bold 14px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.textAlign = "left";
  ctx.fillText(label, x, y - 6);
  ctx.textAlign = "right";
  ctx.fillStyle = color;
  ctx.fillText(`${score}`, x + w, y - 6);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, x, y + 2, w, h, h / 2);
  ctx.fill();
  const fillW = Math.max(score / maxScore * w, h);
  const barGrad = ctx.createLinearGradient(x, y, x + fillW, y);
  barGrad.addColorStop(0, hexToRgba(color, 0.9));
  barGrad.addColorStop(1, hexToRgba(color, 0.5));
  ctx.fillStyle = barGrad;
  roundRect(ctx, x, y + 2, fillW, h, h / 2);
  ctx.fill();
}
function drawPill(ctx, x, y, text2, color, fontFamily) {
  ctx.font = `bold 13px ${fontFamily}`;
  const tw = ctx.measureText(text2).width;
  const pw = tw + 20;
  const ph = 26;
  ctx.fillStyle = hexToRgba(color, 0.12);
  roundRect(ctx, x, y, pw, ph, 13);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(color, 0.3);
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, pw, ph, 13);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text2, x + pw / 2, y + 17);
  ctx.textAlign = "left";
  return pw + 8;
}
function drawTarotCard(ctx, x, y, w, h, name, isReversed, color, fontFamily) {
  ctx.fillStyle = hexToRgba(color, 0.08);
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(color, 0.4);
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 8);
  ctx.stroke();
  ctx.strokeStyle = hexToRgba(color, 0.15);
  ctx.lineWidth = 0.5;
  roundRect(ctx, x + 4, y + 4, w - 8, h - 8, 5);
  ctx.stroke();
  ctx.font = `bold 13px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  const lines = wrapText(ctx, name, w - 16, 2);
  let ty = y + h / 2 - (lines.length - 1) * 8;
  for (const line of lines) {
    ctx.fillText(line, x + w / 2, ty);
    ty += 18;
  }
  if (isReversed) {
    ctx.font = `bold 10px ${fontFamily}`;
    ctx.fillStyle = hexToRgba("#ff6b6b", 0.9);
    ctx.fillText("\u2193 R", x + w / 2, y + h - 8);
  } else {
    ctx.font = `bold 10px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(color, 0.6);
    ctx.fillText("\u2191", x + w / 2, y + h - 8);
  }
  ctx.textAlign = "left";
}
function renderTarot(ctx, W, H, theme, title, summary, data, lang, fontFamily) {
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const titleLines = wrapText(ctx, title, W - 120, 1);
  ctx.fillText(titleLines[0] || title, 48, 120);
  const underGrad = ctx.createLinearGradient(48, 132, 300, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 250, 2);
  if (data.spread) {
    drawPill(ctx, 48, 146, data.spread, theme.accent, fontFamily);
  }
  const cards = (data.cards || "").split(",").map((s) => s.trim()).filter(Boolean);
  const positions = (data.positions || "").split(",").map((s) => s.trim());
  if (cards.length > 0) {
    const cardW = Math.min(110, (W - 120) / Math.min(cards.length, 8) - 10);
    const cardH = 140;
    const startX = 48;
    const cardY = 185;
    const maxCards = Math.min(cards.length, 7);
    for (let i = 0; i < maxCards; i++) {
      const isReversed = (positions[i] || "").toLowerCase().includes("reverse") || (positions[i] || "").toLowerCase().includes("\u9006");
      drawTarotCard(ctx, startX + i * (cardW + 8), cardY, cardW, cardH, cards[i], isReversed, theme.accent, fontFamily);
    }
    if (cards.length > maxCards) {
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.fillStyle = hexToRgba(theme.accent, 0.6);
      ctx.fillText(`+${cards.length - maxCards}`, startX + maxCards * (cardW + 8) + 4, cardY + cardH / 2);
    }
  }
  const summaryY = cards.length > 0 ? 350 : 180;
  ctx.font = `18px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  const summaryLines = wrapText(ctx, summary, W - 120, 4);
  let sy = summaryY;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 28;
  }
  drawIcon(ctx, "crystal-ball", W - 130, H - 130, 180, theme.accent, 0.1);
}
function renderHoroscope(ctx, W, H, theme, title, summary, data, lang, fontFamily) {
  const isZh = lang === "zh";
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 48, 120);
  const underGrad = ctx.createLinearGradient(48, 132, 350, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 300, 2);
  const overall = parseInt(data.overall || "0", 10);
  if (overall > 0) {
    const cx = W - 160;
    const cy = 180;
    const radius = 70;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 8;
    ctx.stroke();
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + overall / 100 * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt";
    ctx.font = `bold 42px ${fontFamily}`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(String(overall), cx, cy + 12);
    ctx.font = `13px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(theme.accent, 0.8);
    ctx.fillText(isZh ? "\u7EFC\u5408\u8FD0\u52BF" : "Overall", cx, cy + 32);
    ctx.textAlign = "left";
  }
  const barX = 48;
  const barW = W - 340;
  const barH = 10;
  let barY = 160;
  const scores = [
    { label: isZh ? "\u2665 \u7231\u60C5" : "\u2665 Love", score: parseInt(data.love || "0", 10), color: "#f472b6", iconFn: drawSmallHeart },
    { label: isZh ? "\u25A0 \u4E8B\u4E1A" : "\u25A0 Career", score: parseInt(data.career || "0", 10), color: "#60a5fa", iconFn: drawSmallBriefcase },
    { label: isZh ? "\u25CF \u8D22\u8FD0" : "\u25CF Wealth", score: parseInt(data.wealth || "0", 10), color: "#fbbf24", iconFn: drawSmallCoin }
  ];
  for (const s of scores) {
    if (s.score > 0) {
      s.iconFn(ctx, barX + 7, barY - 10, 14, s.color);
      const labelWithIcon = "   " + s.label.replace(/^[\u2665\u25a0\u25cf] /, "");
      drawScoreBar(ctx, barX, barY, barW, barH, s.score, 100, s.color, labelWithIcon, fontFamily);
      barY += 42;
    }
  }
  let pillX = 48;
  const pillY = barY + 15;
  if (data.luckyColor) {
    pillX += drawPill(ctx, pillX, pillY, `${isZh ? "\u5E78\u8FD0\u8272" : "Lucky"}: ${data.luckyColor}`, theme.accent, fontFamily);
  }
  if (data.luckyNumber) {
    pillX += drawPill(ctx, pillX, pillY, `${isZh ? "\u5E78\u8FD0\u6570" : "Lucky #"}: ${data.luckyNumber}`, theme.accentLight, fontFamily);
  }
  const summaryStartY = pillY + 50;
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 3);
  let sy = summaryStartY;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }
  drawIcon(ctx, "star", W - 120, H - 120, 160, theme.accent, 0.08);
}
function renderBazi(ctx, W, H, theme, title, summary, data, lang, fontFamily) {
  const isZh = lang === "zh";
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 48, 120);
  const underGrad = ctx.createLinearGradient(48, 132, 300, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 250, 2);
  let pillX = 48;
  const pillY = 150;
  if (data.birth) {
    pillX += drawPill(ctx, pillX, pillY, `${isZh ? "\u51FA\u751F" : "Birth"}: ${data.birth}`, theme.accent, fontFamily);
  }
  if (data.gender) {
    pillX += drawPill(ctx, pillX, pillY, data.gender, theme.accentLight, fontFamily);
  }
  const fiveElements = isZh ? [
    { name: "\u91D1", color: "#fbbf24", eng: "Metal" },
    { name: "\u6728", color: "#22c55e", eng: "Wood" },
    { name: "\u6C34", color: "#3b82f6", eng: "Water" },
    { name: "\u706B", color: "#ef4444", eng: "Fire" },
    { name: "\u571F", color: "#a16207", eng: "Earth" }
  ] : [
    { name: "Metal", color: "#fbbf24", eng: "Metal" },
    { name: "Wood", color: "#22c55e", eng: "Wood" },
    { name: "Water", color: "#3b82f6", eng: "Water" },
    { name: "Fire", color: "#ef4444", eng: "Fire" },
    { name: "Earth", color: "#a16207", eng: "Earth" }
  ];
  const elemStartX = 48;
  const elemY = 200;
  const elemW = 90;
  const elemH = 90;
  const elemGap = 12;
  ctx.font = `bold 15px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accent, 0.7);
  ctx.fillText(isZh ? "\u4E94\u884C\u5206\u5E03" : "Five Elements", elemStartX, elemY - 8);
  for (let i = 0; i < fiveElements.length; i++) {
    const el = fiveElements[i];
    const ex = elemStartX + i * (elemW + elemGap);
    ctx.fillStyle = hexToRgba(el.color, 0.1);
    roundRect(ctx, ex, elemY + 6, elemW, elemH, 10);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(el.color, 0.35);
    ctx.lineWidth = 1.5;
    roundRect(ctx, ex, elemY + 6, elemW, elemH, 10);
    ctx.stroke();
    ctx.font = isZh ? `bold 32px ${fontFamily}` : `bold 18px ${fontFamily}`;
    ctx.fillStyle = el.color;
    ctx.textAlign = "center";
    ctx.fillText(el.name, ex + elemW / 2, elemY + (isZh ? 50 : 45));
    if (isZh) {
      ctx.font = `11px ${fontFamily}`;
      ctx.fillStyle = hexToRgba(el.color, 0.6);
      ctx.fillText(el.eng, ex + elemW / 2, elemY + 72);
    }
    ctx.textAlign = "left";
  }
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 4);
  let sy = elemY + elemH + 40;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }
  drawIcon(ctx, "yin-yang", W - 130, H - 120, 170, theme.accent, 0.1);
}
function renderDream(ctx, W, H, theme, title, summary, data, lang, fontFamily) {
  const isZh = lang === "zh";
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const displayTitle = data.dreamTitle || title;
  const titleLines = wrapText(ctx, displayTitle, W - 120, 1);
  ctx.fillText(titleLines[0] || displayTitle, 48, 120);
  const underGrad = ctx.createLinearGradient(48, 132, 300, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 250, 2);
  let pillX = 48;
  const pillY = 148;
  if (data.dreamType) {
    pillX += drawPill(ctx, pillX, pillY, data.dreamType, theme.accent, fontFamily);
  }
  if (data.clarity) {
    const clarityLabel = isZh ? `\u6E05\u6670\u5EA6 ${data.clarity}` : `Clarity ${data.clarity}`;
    pillX += drawPill(ctx, pillX, pillY, clarityLabel, theme.accentLight, fontFamily);
  }
  const emotions = (data.emotions || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (emotions.length > 0) {
    let emX = 48;
    const emY = pillY + 42;
    ctx.font = `bold 13px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(theme.accent, 0.6);
    ctx.fillText(isZh ? "\u60C5\u7EEA" : "Emotions", emX, emY - 2);
    emX = 48;
    const emPillY = emY + 8;
    for (const em of emotions.slice(0, 5)) {
      emX += drawPill(ctx, emX, emPillY, em, "#a78bfa", fontFamily);
    }
  }
  const elements = (data.elements || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (elements.length > 0) {
    const elY = emotions.length > 0 ? pillY + 90 : pillY + 42;
    let elX = 48;
    ctx.font = `bold 13px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(theme.accent, 0.6);
    ctx.fillText(isZh ? "\u68A6\u5883\u5143\u7D20" : "Elements", elX, elY - 2);
    elX = 48;
    const elPillY = elY + 8;
    for (const el of elements.slice(0, 5)) {
      elX += drawPill(ctx, elX, elPillY, el, theme.accent, fontFamily);
    }
  }
  const summaryStartY = emotions.length > 0 && elements.length > 0 ? 310 : emotions.length > 0 || elements.length > 0 ? 270 : 200;
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 5);
  let sy = summaryStartY;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }
  drawIcon(ctx, "moon", W - 130, H - 120, 170, theme.accent, 0.1);
}
function renderCompatibility(ctx, W, H, theme, title, summary, data, lang, fontFamily) {
  const isZh = lang === "zh";
  ctx.font = `bold 34px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 48, 115);
  const underGrad = ctx.createLinearGradient(48, 128, 350, 128);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 128, 300, 2);
  const sign1 = data.sign1 || (data.name1 || "?");
  const sign2 = data.sign2 || (data.name2 || "?");
  const name1 = data.name1 || (isZh ? "\u7532\u65B9" : "Person A");
  const name2 = data.name2 || (isZh ? "\u4E59\u65B9" : "Person B");
  const circleY = 220;
  const circleR = 55;
  const leftCx = 160;
  const rightCx = W - 160;
  ctx.fillStyle = hexToRgba(theme.accent, 0.1);
  ctx.beginPath();
  ctx.arc(leftCx, circleY, circleR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(leftCx, circleY, circleR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `bold 28px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(sign1, leftCx, circleY + 8);
  ctx.font = `bold 14px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accent, 0.8);
  ctx.fillText(name1.slice(0, 8), leftCx, circleY + 32);
  ctx.fillStyle = hexToRgba(theme.accentLight, 0.1);
  ctx.beginPath();
  ctx.arc(rightCx, circleY, circleR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accentLight, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rightCx, circleY, circleR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `bold 28px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(sign2, rightCx, circleY + 8);
  ctx.font = `bold 14px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accentLight, 0.8);
  ctx.fillText(name2.slice(0, 8), rightCx, circleY + 32);
  const midX = (leftCx + rightCx) / 2;
  ctx.strokeStyle = hexToRgba(theme.accent, 0.25);
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(leftCx + circleR + 10, circleY);
  ctx.lineTo(rightCx - circleR - 10, circleY);
  ctx.stroke();
  ctx.setLineDash([]);
  drawIcon(ctx, "hearts", midX, circleY, 40, theme.accent, 0.9);
  const matchScore = data.matchScore || "";
  if (matchScore) {
    ctx.font = `bold 20px ${fontFamily}`;
    ctx.fillStyle = theme.accentLight;
    ctx.fillText(matchScore, midX, circleY + 42);
  }
  ctx.textAlign = "left";
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 4);
  let sy = circleY + circleR + 40;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }
  drawIcon(ctx, "hearts", W - 120, H - 120, 160, theme.accent, 0.08);
}
function renderDefault(ctx, W, H, theme, title, summary, lang, fontFamily) {
  ctx.font = `bold 40px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const titleLines = wrapText(ctx, title, W - 140, 2);
  let y = 140;
  for (const line of titleLines) {
    ctx.fillText(line, 48, y);
    y += 52;
  }
  const underGrad = ctx.createLinearGradient(48, y + 4, 350, y + 4);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, y + 4, 300, 3);
  ctx.font = `20px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  const summaryLines = wrapText(ctx, summary, W - 140, 5);
  y += 40;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, y);
    y += 32;
  }
  drawIcon(ctx, theme.icon, W - 130, H - 120, 170, theme.accent, 0.12);
}
function generateOgImage(type, title, summary, lang = "en", data = {}) {
  const W = 1200;
  const H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const theme = themes[type] || themes.default;
  const fontFamily = lang === "zh" ? "NotoSansCJKSC, NotoSansCJKSC-Bold, 'Noto Sans CJK SC', sans-serif" : "DejaVuSans, DejaVuSans-Bold, 'DejaVu Sans', sans-serif";
  drawBackground(ctx, W, H, theme);
  drawHeader(ctx, W, theme, lang, fontFamily);
  const hasPersonalData = Object.values(data).some((v) => v && v.length > 0);
  switch (type) {
    case "tarot":
      renderTarot(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "horoscope":
      renderHoroscope(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "bazi":
      renderBazi(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "dream":
      renderDream(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "compatibility":
      renderCompatibility(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    default:
      renderDefault(ctx, W, H, theme, title, summary, lang, fontFamily);
      break;
  }
  drawFooter(ctx, W, H, theme, lang, fontFamily);
  return canvas.toBuffer("image/png");
}
var imageCache = /* @__PURE__ */ new Map();
var MAX_CACHE = 200;
var CACHE_TTL = 36e5;
function getCachedImage(key) {
  const entry = imageCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    imageCache.delete(key);
    return null;
  }
  return entry.buffer;
}
function setCachedImage(key, buffer) {
  if (imageCache.size >= MAX_CACHE) {
    const oldest = imageCache.keys().next().value;
    if (oldest) imageCache.delete(oldest);
  }
  imageCache.set(key, { buffer, timestamp: Date.now() });
}
var ogImageRouter = Router2();
ogImageRouter.get("/", async (req, res) => {
  try {
    await fontsReady;
    const type = req.query.type || "default";
    const title = req.query.title || "Fortune Insight";
    const summary = req.query.summary || "Discover your true self with AI-powered divination";
    const lang = req.query.lang || "en";
    const data = {
      cards: req.query.cards,
      positions: req.query.positions,
      spread: req.query.spread,
      sign: req.query.sign,
      overall: req.query.overall,
      love: req.query.love,
      career: req.query.career,
      wealth: req.query.wealth,
      luckyColor: req.query.luckyColor,
      luckyNumber: req.query.luckyNumber,
      birth: req.query.birth,
      gender: req.query.gender,
      dreamTitle: req.query.dreamTitle,
      emotions: req.query.emotions,
      elements: req.query.elements,
      dreamType: req.query.dreamType,
      clarity: req.query.clarity,
      sign1: req.query.sign1,
      sign2: req.query.sign2,
      name1: req.query.name1,
      name2: req.query.name2,
      matchScore: req.query.matchScore
    };
    const dataKey = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}=${v.slice(0, 30)}`).join("&");
    const cacheKey = `${type}:${lang}:${title.slice(0, 50)}:${summary.slice(0, 60)}:${dataKey.slice(0, 200)}`;
    let buffer = getCachedImage(cacheKey);
    if (!buffer) {
      buffer = generateOgImage(type, title, summary, lang, data);
      setCachedImage(cacheKey, buffer);
    }
    res.set({
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Content-Length": String(buffer.length)
    });
    res.end(buffer);
  } catch (err) {
    console.error("[OG Image] Generation failed:", err);
    res.status(500).json({ error: "Failed to generate OG image" });
  }
});

// server/og-meta.ts
var SOCIAL_CRAWLERS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "TelegramBot",
  "WhatsApp",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "Pinterest",
  "Googlebot",
  "bingbot",
  "Applebot",
  "vkShare",
  "W3C_Validator",
  "redditbot",
  "Embedly",
  "Quora Link Preview",
  "outbrain",
  "rogerbot",
  "Screaming Frog"
];
function isSocialCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SOCIAL_CRAWLERS.some((bot) => ua.includes(bot.toLowerCase()));
}
var typeConfig = {
  tarot: {
    defaultTitle: { zh: "AI\u5854\u7F57\u5360\u535C\u7ED3\u679C", en: "AI Tarot Reading Result" },
    defaultDescription: {
      zh: "\u6211\u521A\u505A\u4E86AI\u5854\u7F57\u5360\u535C\uFF0C\u7ED3\u679C\u5F88\u6709\u542F\u53D1\uFF01\u6765\u8BD5\u8BD5\u4F60\u7684\u514D\u8D39\u5854\u7F57\u5360\u535C\u5427\u3002",
      en: "I just got my AI tarot reading \u2014 it was incredibly insightful! Try your free reading now."
    }
  },
  bazi: {
    defaultTitle: { zh: "AI\u516B\u5B57\u7CBE\u6279\u7ED3\u679C", en: "AI BaZi Analysis Result" },
    defaultDescription: {
      zh: "\u6211\u7684AI\u516B\u5B57\u5206\u6790\u7ED3\u679C\u51FA\u6765\u4E86\uFF0C\u975E\u5E38\u51C6\u786E\uFF01\u6765\u770B\u770B\u4F60\u7684\u547D\u7406\u5206\u6790\u3002",
      en: "My AI BaZi destiny analysis was spot on! Discover your birth chart insights."
    }
  },
  horoscope: {
    defaultTitle: { zh: "\u661F\u5EA7\u8FD0\u52BF\u89E3\u8BFB", en: "Horoscope Reading" },
    defaultDescription: {
      zh: "\u4ECA\u65E5\u661F\u5EA7\u8FD0\u52BF\u89E3\u8BFB\uFF0C\u770B\u770B\u661F\u661F\u4E3A\u4F60\u5E26\u6765\u4EC0\u4E48\u542F\u793A\u3002",
      en: "Today's horoscope reading \u2014 see what the stars have in store for you."
    }
  },
  dream: {
    defaultTitle: { zh: "AI\u89E3\u68A6\u5206\u6790", en: "AI Dream Interpretation" },
    defaultDescription: {
      zh: "AI\u5E2E\u6211\u89E3\u8BFB\u4E86\u68A6\u5883\u7684\u6DF1\u5C42\u542B\u4E49\uFF0C\u975E\u5E38\u6709\u8DA3\uFF01\u6765\u5206\u6790\u4F60\u7684\u68A6\u5427\u3002",
      en: "AI decoded the deeper meaning of my dream \u2014 fascinating! Analyze your dreams too."
    }
  },
  compatibility: {
    defaultTitle: { zh: "\u661F\u5EA7\u5408\u76D8\u5206\u6790", en: "Compatibility Analysis" },
    defaultDescription: {
      zh: "\u521A\u505A\u4E86\u661F\u5EA7\u5408\u76D8\u5206\u6790\uFF0C\u770B\u770B\u6211\u4EEC\u7684\u7F18\u5206\u6307\u6570\uFF01\u4F60\u4E5F\u6765\u8BD5\u8BD5\u3002",
      en: "Just got our compatibility analysis \u2014 see our chemistry score! Try yours too."
    }
  }
};
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var PERSONALIZED_KEYS = [
  "cards",
  "positions",
  "spread",
  "sign",
  "overall",
  "love",
  "career",
  "wealth",
  "luckyColor",
  "luckyNumber",
  "birth",
  "gender",
  "dreamTitle",
  "emotions",
  "elements",
  "dreamType",
  "clarity",
  "sign1",
  "sign2",
  "name1",
  "name2",
  "matchScore"
];
function ogMetaMiddleware(req, res, next) {
  if (!req.path.startsWith("/share")) {
    return next();
  }
  const userAgent = req.headers["user-agent"] || "";
  if (!isSocialCrawler(userAgent)) {
    return next();
  }
  const type = req.query.type || "tarot";
  const lang = req.query.lang || "en";
  const rawTitle = req.query.title;
  const rawSummary = req.query.summary;
  const config = typeConfig[type] || typeConfig.tarot;
  const title = rawTitle || config.defaultTitle[lang];
  const description = rawSummary || config.defaultDescription[lang];
  const siteName = lang === "zh" ? "\u6D1E\u5BDF\u672A\u6765 \xB7 AI\u547D\u7406\u5E73\u53F0" : "Fortune Insight \xB7 AI Divination";
  const origin = `${req.protocol}://${req.get("host")}`;
  const ogImageParams = new URLSearchParams();
  ogImageParams.set("type", type);
  ogImageParams.set("title", title.slice(0, 60));
  ogImageParams.set("summary", description.slice(0, 120));
  ogImageParams.set("lang", lang);
  for (const key of PERSONALIZED_KEYS) {
    const val = req.query[key];
    if (val) {
      ogImageParams.set(key, val.slice(0, 100));
    }
  }
  const ogImageUrl = `${origin}/api/og-image?${ogImageParams.toString()}`;
  const pageUrl = `${origin}${req.originalUrl}`;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description.slice(0, 300));
  const safeSiteName = escapeHtml(siteName);
  const html = `<!DOCTYPE html>
<html lang="${lang === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle} \u2014 ${safeSiteName}</title>
  <meta name="description" content="${safeDesc}" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:site_name" content="${safeSiteName}" />
  <meta property="og:locale" content="${lang === "zh" ? "zh_CN" : "en_US"}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />
  
  <!-- Redirect regular browsers to the main site -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(origin)}/" />
</head>
<body>
  <h1>${safeTitle}</h1>
  <p>${safeDesc}</p>
  <p><a href="${escapeHtml(origin)}/">Visit Fortune Insight</a></p>
</body>
</html>`;
  res.set({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=3600"
  });
  res.status(200).send(html);
}

// server/_core/index.ts
init_env();

// server/_core/securityHeaders.ts
function securityHeadersMiddleware(req, res, next) {
  const isProd = process.env.NODE_ENV === "production";
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (isProd) {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy-Report-Only",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        "connect-src 'self' https: wss:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join("; ")
    );
  }
  next();
}
function trpcPrefixGuard(req, res, next) {
  if (req.path === "/trpc" || req.path.startsWith("/trpc/")) {
    res.status(404).type("application/json").json({
      error: {
        message: 'No procedure at this path. Use "/api/trpc" instead of "/trpc".',
        code: "NOT_FOUND",
        hint: "/api/trpc"
      }
    });
    return;
  }
  next();
}

// server/fullServerRoutes.ts
init_env();
import {
  Router as Router3,
  raw as raw2
} from "express";

// server/tarot_rules.mjs
var MAJORS = [
  {
    id: 0,
    name_en: "The Fool",
    name_zh: "\u611A\u8005",
    keywords_en: ["beginnings", "faith", "spontaneity"],
    keywords_zh: ["\u5F00\u59CB", "\u4FE1\u4EFB", "\u968F\u6027"],
    upright_en: "A fresh path opens. Trust the first step more than the map.",
    upright_zh: "\u65B0\u8DEF\u6B63\u5728\u5C55\u5F00\u3002\u6BD4\u8D77\u5730\u56FE\uFF0C\u66F4\u8981\u4FE1\u4EFB\u8FC8\u51FA\u7684\u7B2C\u4E00\u6B65\u3002",
    reversed_en: "Hesitation or recklessness \u2014 pause before leaping.",
    reversed_zh: "\u72B9\u8C6B\u6216\u51B2\u52A8\u2014\u2014\u8DC3\u51FA\u524D\u5148\u505C\u4E00\u79D2\u3002"
  },
  {
    id: 1,
    name_en: "The Magician",
    name_zh: "\u9B54\u672F\u5E08",
    keywords_en: ["focus", "skill", "will"],
    keywords_zh: ["\u4E13\u6CE8", "\u6280\u80FD", "\u610F\u5FD7"],
    upright_en: "You already have tools. Align intention with action.",
    upright_zh: "\u5DE5\u5177\u5DF2\u5728\u624B\u3002\u628A\u610F\u56FE\u4E0E\u884C\u52A8\u5BF9\u9F50\u3002",
    reversed_en: "Scattered energy or half-truths \u2014 simplify and be honest.",
    reversed_zh: "\u80FD\u91CF\u5206\u6563\u6216\u8A00\u4E0D\u7531\u8877\u2014\u2014\u7B80\u5316\uFF0C\u5E76\u8BDA\u5B9E\u3002"
  },
  {
    id: 2,
    name_en: "The High Priestess",
    name_zh: "\u5973\u796D\u53F8",
    keywords_en: ["intuition", "mystery", "stillness"],
    keywords_zh: ["\u76F4\u89C9", "\u795E\u79D8", "\u9759\u5FC3"],
    upright_en: "Listen inward. Not every answer is public yet.",
    upright_zh: "\u5411\u5185\u542C\u3002\u4E0D\u662F\u6BCF\u4E2A\u7B54\u6848\u90FD\u9002\u5408\u7ACB\u523B\u516C\u5F00\u3002",
    reversed_en: "Noise drowning intuition \u2014 protect quiet time.",
    reversed_zh: "\u566A\u97F3\u76D6\u8FC7\u76F4\u89C9\u2014\u2014\u4FDD\u62A4\u72EC\u5904\u4E0E\u5B89\u9759\u3002"
  },
  {
    id: 3,
    name_en: "The Empress",
    name_zh: "\u5973\u7687",
    keywords_en: ["nurture", "abundance", "body"],
    keywords_zh: ["\u6ECB\u517B", "\u4E30\u76DB", "\u8EAB\u4F53"],
    upright_en: "Growth through care \u2014 people, projects, or yourself.",
    upright_zh: "\u7528\u7167\u987E\u4FC3\u6210\u751F\u957F\u2014\u2014\u5BF9\u4EBA\u3001\u5BF9\u4E8B\u3001\u5BF9\u81EA\u5DF1\u3002",
    reversed_en: "Overgiving or neglect of the body \u2014 restore balance.",
    reversed_zh: "\u8FC7\u5EA6\u4ED8\u51FA\u6216\u5FFD\u7565\u8EAB\u4F53\u2014\u2014\u5148\u627E\u56DE\u5E73\u8861\u3002"
  },
  {
    id: 4,
    name_en: "The Emperor",
    name_zh: "\u7687\u5E1D",
    keywords_en: ["structure", "boundary", "authority"],
    keywords_zh: ["\u7ED3\u6784", "\u8FB9\u754C", "\u6743\u5A01"],
    upright_en: "Build order. Clear rules free energy for what matters.",
    upright_zh: "\u5EFA\u7ACB\u79E9\u5E8F\u3002\u6E05\u6670\u89C4\u5219\u628A\u7CBE\u529B\u8FD8\u7ED9\u771F\u6B63\u91CD\u8981\u7684\u4E8B\u3002",
    reversed_en: "Rigidity or control struggles \u2014 loosen the grip.",
    reversed_zh: "\u50F5\u786C\u6216\u63A7\u5236\u6B32\u2014\u2014\u677E\u4E00\u677E\u63E1\u7D27\u7684\u624B\u3002"
  },
  {
    id: 5,
    name_en: "The Hierophant",
    name_zh: "\u6559\u7687",
    keywords_en: ["tradition", "mentor", "shared values"],
    keywords_zh: ["\u4F20\u7EDF", "\u5BFC\u5E08", "\u5171\u540C\u4EF7\u503C"],
    upright_en: "Learn from a trusted system or teacher.",
    upright_zh: "\u5411\u53EF\u4FE1\u7684\u4F53\u7CFB\u6216\u8001\u5E08\u5B66\u4E60\u3002",
    reversed_en: "Question dogma; find your own rite.",
    reversed_zh: "\u8D28\u7591\u6559\u6761\uFF1B\u627E\u5230\u5C5E\u4E8E\u81EA\u5DF1\u7684\u4EEA\u5F0F\u3002"
  },
  {
    id: 6,
    name_en: "The Lovers",
    name_zh: "\u604B\u4EBA",
    keywords_en: ["choice", "alignment", "bond"],
    keywords_zh: ["\u9009\u62E9", "\u5951\u5408", "\u8FDE\u7ED3"],
    upright_en: "A values-aligned choice \u2014 heart and head can meet.",
    upright_zh: "\u4EF7\u503C\u5BF9\u9F50\u7684\u9009\u62E9\u2014\u2014\u5FC3\u4E0E\u8111\u53EF\u4EE5\u76F8\u9047\u3002",
    reversed_en: "Misalignment or avoidance of a real choice.",
    reversed_zh: "\u4EF7\u503C\u9519\u4F4D\uFF0C\u6216\u56DE\u907F\u771F\u6B63\u7684\u9009\u62E9\u3002"
  },
  {
    id: 7,
    name_en: "The Chariot",
    name_zh: "\u6218\u8F66",
    keywords_en: ["drive", "direction", "discipline"],
    keywords_zh: ["\u52A8\u529B", "\u65B9\u5411", "\u7EAA\u5F8B"],
    upright_en: "Hold the reins. Progress needs both speed and steering.",
    upright_zh: "\u63E1\u7D27\u7F30\u7EF3\u3002\u524D\u8FDB\u9700\u8981\u901F\u5EA6\uFF0C\u4E5F\u9700\u8981\u65B9\u5411\u3002",
    reversed_en: "Scattered will \u2014 pick one lane.",
    reversed_zh: "\u610F\u5FD7\u5206\u6563\u2014\u2014\u5148\u9009\u4E00\u6761\u8F66\u9053\u3002"
  },
  {
    id: 8,
    name_en: "Strength",
    name_zh: "\u529B\u91CF",
    keywords_en: ["courage", "soft power", "patience"],
    keywords_zh: ["\u52C7\u6C14", "\u67D4\u529B", "\u8010\u5FC3"],
    upright_en: "Gentle firmness tames what force cannot.",
    upright_zh: "\u67D4\u800C\u575A\u5B9A\uFF0C\u80FD\u9A6F\u670D\u86EE\u529B\u505A\u4E0D\u5230\u7684\u4E8B\u3002",
    reversed_en: "Self-doubt \u2014 remember past times you stayed kind under pressure.",
    reversed_zh: "\u81EA\u6211\u6000\u7591\u2014\u2014\u8BB0\u5F97\u90A3\u4E9B\u4F60\u66FE\u5728\u538B\u529B\u4E0B\u4ECD\u4FDD\u6301\u6E29\u67D4\u7684\u65F6\u523B\u3002"
  },
  {
    id: 9,
    name_en: "The Hermit",
    name_zh: "\u9690\u8005",
    keywords_en: ["solitude", "insight", "pause"],
    keywords_zh: ["\u72EC\u5904", "\u6D1E\u89C1", "\u6682\u505C"],
    upright_en: "Step back to see clearly. Wisdom needs space.",
    upright_zh: "\u9000\u4E00\u6B65\u624D\u770B\u5F97\u6E05\u3002\u667A\u6167\u9700\u8981\u7A7A\u95F4\u3002",
    reversed_en: "Isolation past usefulness \u2014 rejoin carefully.",
    reversed_zh: "\u72EC\u5904\u8FC7\u4E86\u5934\u2014\u2014\u8C28\u614E\u5730\u91CD\u65B0\u8FDE\u7ED3\u3002"
  },
  {
    id: 10,
    name_en: "Wheel of Fortune",
    name_zh: "\u547D\u8FD0\u4E4B\u8F6E",
    keywords_en: ["cycle", "turn", "timing"],
    keywords_zh: ["\u5468\u671F", "\u8F6C\u6298", "\u65F6\u673A"],
    upright_en: "A turn in the cycle \u2014 ride change without clinging.",
    upright_zh: "\u5468\u671F\u5728\u8F6C\u2014\u2014\u62E5\u62B1\u53D8\u5316\uFF0C\u4E0D\u6267\u7740\u65E7\u5C40\u3002",
    reversed_en: "Resistance to change delays the next chapter.",
    reversed_zh: "\u6297\u62D2\u53D8\u5316\uFF0C\u4F1A\u63A8\u8FDF\u4E0B\u4E00\u7AE0\u3002"
  },
  {
    id: 11,
    name_en: "Justice",
    name_zh: "\u6B63\u4E49",
    keywords_en: ["truth", "fairness", "consequence"],
    keywords_zh: ["\u771F\u76F8", "\u516C\u5E73", "\u56E0\u679C"],
    upright_en: "Weigh honestly. Fair outcomes follow clear facts.",
    upright_zh: "\u8BDA\u5B9E\u6743\u8861\u3002\u6E05\u6670\u4E8B\u5B9E\u5E26\u6765\u516C\u6B63\u7ED3\u679C\u3002",
    reversed_en: "Bias or unfinished accounts \u2014 face them.",
    reversed_zh: "\u504F\u89C1\u6216\u672A\u4E86\u7ED3\u7684\u8D26\u2014\u2014\u6B63\u89C6\u5B83\u4EEC\u3002"
  },
  {
    id: 12,
    name_en: "The Hanged Man",
    name_zh: "\u5012\u540A\u4EBA",
    keywords_en: ["surrender", "new angle", "wait"],
    keywords_zh: ["\u653E\u4E0B", "\u65B0\u89C6\u89D2", "\u7B49\u5F85"],
    upright_en: "Pause is productive. See the scene upside down.",
    upright_zh: "\u6682\u505C\u4E5F\u662F\u4E00\u79CD\u524D\u8FDB\u3002\u628A\u573A\u666F\u5012\u8FC7\u6765\u770B\u3002",
    reversed_en: "Stalling that is no longer sacrifice \u2014 choose a side.",
    reversed_zh: "\u505C\u6EDE\u5DF2\u4E0D\u662F\u727A\u7272\u2014\u2014\u8BE5\u505A\u9009\u62E9\u4E86\u3002"
  },
  {
    id: 13,
    name_en: "Death",
    name_zh: "\u6B7B\u795E",
    keywords_en: ["ending", "release", "renewal"],
    keywords_zh: ["\u7ED3\u675F", "\u91CA\u653E", "\u66F4\u65B0"],
    upright_en: "Something completes so something else can live.",
    upright_zh: "\u6709\u4E9B\u7ED3\u675F\uFF0C\u662F\u4E3A\u4E86\u8BA9\u522B\u7684\u5F00\u59CB\u6D3B\u8FC7\u6765\u3002",
    reversed_en: "Clinging to a finished form blocks renewal.",
    reversed_zh: "\u7D27\u6293\u5DF2\u7ED3\u675F\u7684\u5F62\u6001\uFF0C\u4F1A\u6321\u4F4F\u66F4\u65B0\u3002"
  },
  {
    id: 14,
    name_en: "Temperance",
    name_zh: "\u8282\u5236",
    keywords_en: ["blend", "moderation", "healing"],
    keywords_zh: ["\u8C03\u548C", "\u9002\u5EA6", "\u7597\u6108"],
    upright_en: "Mix opposites slowly. Healing is a pour, not a flood.",
    upright_zh: "\u6162\u6162\u8C03\u548C\u5BF9\u7ACB\u3002\u7597\u6108\u662F\u503E\u6CE8\uFF0C\u4E0D\u662F\u6D2A\u6C34\u3002",
    reversed_en: "Excess or impatience \u2014 restore the middle path.",
    reversed_zh: "\u8FC7\u5EA6\u6216\u4E0D\u8010\u2014\u2014\u56DE\u5230\u4E2D\u9053\u3002"
  },
  {
    id: 15,
    name_en: "The Devil",
    name_zh: "\u6076\u9B54",
    keywords_en: ["attachment", "shadow", "temptation"],
    keywords_zh: ["\u6267\u7740", "\u9634\u5F71", "\u8BF1\u60D1"],
    upright_en: "Name the chain. Awareness loosens what denial tightens.",
    upright_zh: "\u5148\u8BF4\u51FA\u90A3\u6761\u94FE\u5B50\u3002\u89C9\u5BDF\u80FD\u677E\u5F00\u5426\u8BA4\u52D2\u7D27\u7684\u4E1C\u897F\u3002",
    reversed_en: "Breaking free begins \u2014 keep walking out.",
    reversed_zh: "\u6323\u8131\u5DF2\u7ECF\u5F00\u59CB\u2014\u2014\u7EE7\u7EED\u5F80\u5916\u8D70\u3002"
  },
  {
    id: 16,
    name_en: "The Tower",
    name_zh: "\u9AD8\u5854",
    keywords_en: ["shock", "truth", "rebuild"],
    keywords_zh: ["\u9707\u52A8", "\u771F\u76F8", "\u91CD\u5EFA"],
    upright_en: "False structure falls. What remains can be real.",
    upright_zh: "\u865A\u5047\u7ED3\u6784\u5012\u584C\u3002\u7559\u4E0B\u7684\u624D\u53EF\u80FD\u662F\u771F\u7684\u3002",
    reversed_en: "Delayed collapse or fear of change \u2014 brace, then rebuild.",
    reversed_zh: "\u5EF6\u8FDF\u7684\u5D29\u584C\u6216\u5BF9\u53D8\u5316\u7684\u6050\u60E7\u2014\u2014\u5148\u7A33\u4F4F\uFF0C\u518D\u91CD\u5EFA\u3002"
  },
  {
    id: 17,
    name_en: "The Star",
    name_zh: "\u661F\u661F",
    keywords_en: ["hope", "clarity", "renewal"],
    keywords_zh: ["\u5E0C\u671B", "\u6E05\u660E", "\u66F4\u65B0"],
    upright_en: "After the storm, quiet hope. Follow the small light.",
    upright_zh: "\u98CE\u66B4\u540E\u662F\u5B89\u9759\u7684\u5E0C\u671B\u3002\u8DDF\u7740\u90A3\u70B9\u5C0F\u5149\u8D70\u3002",
    reversed_en: "Dimmed faith \u2014 rest, then look up again.",
    reversed_zh: "\u4FE1\u5FC3\u53D8\u6DE1\u2014\u2014\u5148\u4F11\u606F\uFF0C\u518D\u62AC\u5934\u3002"
  },
  {
    id: 18,
    name_en: "The Moon",
    name_zh: "\u6708\u4EAE",
    keywords_en: ["uncertainty", "dream", "emotion"],
    keywords_zh: ["\u4E0D\u786E\u5B9A", "\u68A6\u5883", "\u60C5\u7EEA"],
    upright_en: "Foggy path. Trust feelings as data, not as verdicts.",
    upright_zh: "\u8DEF\u5F84\u6709\u96FE\u3002\u628A\u60C5\u7EEA\u5F53\u6570\u636E\uFF0C\u4E0D\u8981\u5F53\u5224\u51B3\u3002",
    reversed_en: "Illusions thinning \u2014 reality is kinder than the fear story.",
    reversed_zh: "\u5E7B\u89C9\u5728\u6563\u2014\u2014\u73B0\u5B9E\u5F80\u5F80\u6BD4\u6050\u60E7\u6545\u4E8B\u66F4\u6E29\u548C\u3002"
  },
  {
    id: 19,
    name_en: "The Sun",
    name_zh: "\u592A\u9633",
    keywords_en: ["vitality", "joy", "visibility"],
    keywords_zh: ["\u6D3B\u529B", "\u559C\u60A6", "\u88AB\u770B\u89C1"],
    upright_en: "Warm clarity. Share success without shrinking.",
    upright_zh: "\u6E29\u6696\u800C\u6E05\u6670\u3002\u5206\u4EAB\u6210\u529F\uFF0C\u4E0D\u5FC5\u7F29\u5C0F\u81EA\u5DF1\u3002",
    reversed_en: "Temporary cloud over joy \u2014 the light is still yours.",
    reversed_zh: "\u559C\u60A6\u6682\u65F6\u88AB\u4E91\u906E\u4F4F\u2014\u2014\u5149\u4ECD\u5C5E\u4E8E\u4F60\u3002"
  },
  {
    id: 20,
    name_en: "Judgement",
    name_zh: "\u5BA1\u5224",
    keywords_en: ["calling", "review", "rise"],
    keywords_zh: ["\u53EC\u5524", "\u590D\u76D8", "\u5347\u8D77"],
    upright_en: "A wake-up call. Integrate the past and step up.",
    upright_zh: "\u4E00\u58F0\u5524\u9192\u3002\u6574\u5408\u8FC7\u53BB\uFF0C\u518D\u7AD9\u8D77\u6765\u3002",
    reversed_en: "Self-judgment loop \u2014 forgive enough to move.",
    reversed_zh: "\u81EA\u6211\u5BA1\u5224\u5FAA\u73AF\u2014\u2014\u539F\u8C05\u5230\u80FD\u7EE7\u7EED\u8D70\u3002"
  },
  {
    id: 21,
    name_en: "The World",
    name_zh: "\u4E16\u754C",
    keywords_en: ["completion", "wholeness", "threshold"],
    keywords_zh: ["\u5B8C\u6210", "\u5706\u6EE1", "\u95E8\u69DB"],
    upright_en: "A cycle completes. Celebrate, then choose the next world.",
    upright_zh: "\u4E00\u4E2A\u5468\u671F\u5B8C\u6210\u3002\u5E86\u795D\uFF0C\u518D\u9009\u4E0B\u4E00\u4E2A\u4E16\u754C\u3002",
    reversed_en: "Almost there \u2014 close the last open loop.",
    reversed_zh: "\u5C31\u5DEE\u4E00\u6B65\u2014\u2014\u5148\u5408\u4E0A\u6700\u540E\u4E00\u4E2A\u5F00\u73AF\u3002"
  }
];
var DISCLAIMER_EN = "Educational and entertainment only \u2014 not medical, legal, financial, or professional advice.";
var DISCLAIMER_ZH = "\u4EC5\u4F9B\u5A31\u4E50\u4E0E\u81EA\u6211\u53CD\u601D\uFF0C\u4E0D\u6784\u6210\u533B\u7597\u3001\u6CD5\u5F8B\u3001\u8D22\u52A1\u6216\u4E13\u4E1A\u5EFA\u8BAE\u3002";
function drawSingleCard(opts = {}) {
  const lang = opts.language === "en" ? "en" : "zh";
  const q = String(opts.question || "").trim();
  const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  let seed = hash(`${day}|${q}|preview`);
  const idx = seed % MAJORS.length;
  seed = seed * 1103515245 + 12345 >>> 0;
  const upright = seed % 2 === 0;
  const base = MAJORS[idx];
  const meaning = lang === "en" ? upright ? base.upright_en : base.reversed_en : upright ? base.upright_zh : base.reversed_zh;
  const keywords = lang === "en" ? base.keywords_en : base.keywords_zh;
  const name = lang === "en" ? base.name_en : base.name_zh;
  const orientation = lang === "en" ? upright ? "upright" : "reversed" : upright ? "\u6B63\u4F4D" : "\u9006\u4F4D";
  const summary = lang === "en" ? `${name} (${orientation}): ${meaning}` : `${name}\uFF08${orientation}\uFF09\uFF1A${meaning}`;
  return {
    ok: true,
    spread: "single",
    card: {
      id: base.id,
      name_en: base.name_en,
      name_zh: base.name_zh,
      upright,
      orientation,
      keywords,
      meaning
    },
    summary,
    disclaimer: lang === "en" ? DISCLAIMER_EN : DISCLAIMER_ZH,
    source: "rules",
    meta: {
      version: "sx3-1.0",
      language: lang,
      question: q ? q.slice(0, 200) : null
    }
  };
}
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// server/fullServerRoutes.ts
var SERVICE = "fortune-insight";
var VERSION = "full-1.0";
var DEFAULT_RATE_LIMIT = 20;
var DEFAULT_RATE_WINDOW_SEC = 3600;
var BODY_LIMIT_BYTES = 32e3;
function positiveInteger(value, fallback, minimum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(minimum, Math.floor(parsed));
}
function buildFullHealthPayload() {
  const modernLlmReady = Boolean(
    ENV.llmApiUrl.trim() && ENV.llmApiKey.trim()
  );
  const legacyForgeReady = Boolean(ENV.forgeApiKey.trim());
  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    mode: "full",
    db: Boolean(ENV.databaseUrl.trim()),
    stripe: Boolean(
      ENV.stripeSecretKey.trim() && ENV.stripeWebhookSecret.trim()
    ),
    llm: modernLlmReady || legacyForgeReady,
    tarot_preview: true,
    manus_login: false,
    spread: "single",
    source_default: "rules"
  };
}
function sendJson(res, status, payload) {
  return res.status(status).set({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  }).json(payload);
}
function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  return req.socket.remoteAddress || "unknown";
}
function createTarotPreviewRouter(options = {}) {
  const rateLimit = positiveInteger(
    options.rateLimit?.toString() ?? process.env.TAROT_RATE_LIMIT,
    DEFAULT_RATE_LIMIT,
    1
  );
  const rateWindowSec = positiveInteger(
    options.rateWindowSec?.toString() ?? process.env.TAROT_RATE_WINDOW_SEC,
    DEFAULT_RATE_WINDOW_SEC,
    10
  );
  const now = options.now ?? Date.now;
  const hits = /* @__PURE__ */ new Map();
  const router2 = Router3();
  const checkRate = (ip) => {
    const windowStart = now() / 1e3 - rateWindowSec;
    const recentHits = (hits.get(ip) ?? []).filter((hit) => hit > windowStart);
    if (recentHits.length >= rateLimit) {
      hits.set(ip, recentHits);
      return { ok: false, remaining: 0 };
    }
    recentHits.push(now() / 1e3);
    hits.set(ip, recentHits);
    return { ok: true, remaining: rateLimit - recentHits.length };
  };
  router2.options("/", (_req, res) => {
    res.status(204).set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    }).end();
  });
  router2.post(
    "/",
    (req, res, next) => {
      const rate = checkRate(clientIp(req));
      if (!rate.ok) {
        sendJson(res, 429, {
          ok: false,
          error: "rate_limited",
          error_detail: `max ${rateLimit} previews per ${rateWindowSec}s`,
          disclaimer: "Educational only."
        });
        return;
      }
      res.locals.tarotPreviewRate = rate;
      next();
    },
    raw2({ type: "*/*", limit: BODY_LIMIT_BYTES }),
    (req, res) => {
      let body = {};
      try {
        const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body ?? "");
        if (rawBody.trim()) {
          const parsed = JSON.parse(rawBody);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("invalid_json");
          }
          body = parsed;
        }
      } catch {
        sendJson(res, 400, { ok: false, error: "invalid_json" });
        return;
      }
      const result = drawSingleCard({
        question: typeof body.question === "string" ? body.question : void 0,
        language: typeof body.language === "string" ? body.language : void 0
      });
      const rate = res.locals.tarotPreviewRate;
      result.meta = {
        ...result.meta,
        rate_remaining: rate.remaining,
        service: SERVICE
      };
      res.status(200).set({
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": "*"
      }).json(result);
    }
  );
  router2.all("/", (_req, res) => {
    sendJson(res, 405, { ok: false, error: "method_not_allowed" });
  });
  router2.use(
    (error, _req, res, _next) => {
      if (error.type === "entity.too.large") {
        sendJson(res, 413, { ok: false, error: "body_too_large" });
        return;
      }
      sendJson(res, 400, { ok: false, error: "invalid_body" });
    }
  );
  return router2;
}
function registerFullServerRoutes(app) {
  app.get(["/health", "/api/health"], (_req, res) => {
    sendJson(res, 200, buildFullHealthPayload());
  });
  app.use("/api/tarot/preview", createTarotPreviewRouter());
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    const host = process.env.HOST || "0.0.0.0";
    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  warnMissingEnv();
  const app = express2();
  const server = createServer(app);
  app.use(compression2({
    level: 6,
    // balanced speed/compression ratio
    threshold: 1024,
    // only compress responses > 1KB
    filter: (req, res) => {
      if (req.path.startsWith("/api/stripe/webhook")) return false;
      return compression2.filter(req, res);
    }
  }));
  app.use(securityHeadersMiddleware);
  app.use(trpcPrefixGuard);
  registerFullServerRoutes(app);
  app.use("/api/stripe", stripeRouter);
  app.use("/api/og-image", ogImageRouter);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  app.use(ogMetaMiddleware);
  registerShopStaticRoutes(app);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
