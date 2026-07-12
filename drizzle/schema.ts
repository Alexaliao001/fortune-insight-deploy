import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
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
  referredBy: int("referredBy"), // userId of the person who referred this user
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 会员订阅表
 */
export const memberships = mysqlTable("memberships", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = typeof memberships.$inferInsert;

/**
 * 塔罗占卜记录表
 */
export const tarotReadings = mysqlTable("tarot_readings", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TarotReading = typeof tarotReadings.$inferSelect;
export type InsertTarotReading = typeof tarotReadings.$inferInsert;

/**
 * 八字分析记录表
 */
export const baziReadings = mysqlTable("bazi_readings", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BaziReading = typeof baziReadings.$inferSelect;
export type InsertBaziReading = typeof baziReadings.$inferInsert;

/**
 * 星座运势表
 */
export const horoscopes = mysqlTable("horoscopes", {
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
  deepAnalysis: text("deepAnalysis"), // JSON string with 10-dimension analysis
  advice: text("advice"),
  luckyColor: varchar("luckyColor", { length: 20 }),
  luckyNumber: int("luckyNumber"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Horoscope = typeof horoscopes.$inferSelect;
export type InsertHoroscope = typeof horoscopes.$inferInsert;

/**
 * 用户成长记录表（生命之花系统）
 */
export const userGrowth = mysqlTable("user_growth", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserGrowth = typeof userGrowth.$inferSelect;
export type InsertUserGrowth = typeof userGrowth.$inferInsert;

/**
 * 社区帖子表
 */
export const communityPosts = mysqlTable("community_posts", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

/**
 * 帖子点赞表
 */
export const postLikes = mysqlTable("post_likes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = typeof postLikes.$inferInsert;

/**
 * 帖子评论表
 */
export const postComments = mysqlTable("post_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  parentId: int("parentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = typeof postComments.$inferInsert;

/**
 * 支付订单表
 */
export const orders = mysqlTable("orders", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * 公益捐赠记录表
 */
export const charityDonations = mysqlTable("charity_donations", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  userId: int("userId"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  projectName: varchar("projectName", { length: 100 }).notNull(),
  projectDescription: text("projectDescription"),
  status: mysqlEnum("status", ["pending", "donated", "failed"]).default("pending").notNull(),
  donatedAt: timestamp("donatedAt"),
  notificationSent: boolean("notificationSent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CharityDonation = typeof charityDonations.$inferSelect;
export type InsertCharityDonation = typeof charityDonations.$inferInsert;

/**
 * 使用次数追踪表 - 记录用户每日/每月的免费使用次数
 */
export const usageTracking = mysqlTable("usage_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  featureType: mysqlEnum("featureType", ["tarot", "bazi", "dream", "horoscope"]).notNull(),
  usedCount: int("usedCount").default(0).notNull(),
  periodType: mysqlEnum("periodType", ["daily", "monthly"]).notNull(),
  periodKey: varchar("periodKey", { length: 10 }).notNull(), // "2026-02-06" or "2026-02"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

/**
 * 单次购买凭证表 - 记录用户购买的单次使用权
 */
export const purchaseCredits = mysqlTable("purchase_credits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  featureType: mysqlEnum("featureType", ["tarot", "bazi", "dream", "compatibility"]).notNull(),
  credits: int("credits").default(1).notNull(), // 购买的次数
  usedCredits: int("usedCredits").default(0).notNull(), // 已使用的次数
  stripeSessionId: varchar("stripeSessionId", { length: 200 }),
  status: mysqlEnum("status", ["active", "exhausted", "expired"]).default("active").notNull(),
  expiresAt: timestamp("expiresAt"), // 可选过期时间
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PurchaseCredit = typeof purchaseCredits.$inferSelect;
export type InsertPurchaseCredit = typeof purchaseCredits.$inferInsert;


/**
 * 梦境记录表（AI解梦功能）
 */
export const dreamRecords = mysqlTable("dream_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 64 }),
  title: varchar("title", { length: 200 }),
  dreamContent: text("dreamContent").notNull(),
  dreamDate: timestamp("dreamDate"),
  emotions: json("emotions"), // 梦中情绪：["恐惧", "快乐", "困惑"...]
  keyElements: json("keyElements"), // 关键元素：["水", "飞翔", "追逐"...]
  dreamType: mysqlEnum("dreamType", ["normal", "nightmare", "lucid", "recurring", "prophetic"]).default("normal"),
  clarity: int("clarity"), // 梦境清晰度 1-5
  interpretation: text("interpretation"), // AI解读
  psychologyInsight: text("psychologyInsight"), // 心理学洞察
  growthSuggestion: text("growthSuggestion"), // 成长建议
  symbolAnalysis: json("symbolAnalysis"), // 符号分析 [{symbol, meaning}]
  deepAnalysis: text("deepAnalysis"), // JSON string with 10-dimension deep analysis
  tags: json("tags"), // 用户自定义标签: ["string"...]
  isPaid: boolean("isPaid").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DreamRecord = typeof dreamRecords.$inferSelect;
export type InsertDreamRecord = typeof dreamRecords.$inferInsert;


/**
 * 用户反馈表
 */
export const userFeedbacks = mysqlTable("user_feedbacks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 64 }),
  // 反馈来源：tarot塔罗、bazi八字、horoscope星座、dream解梦
  sourceType: mysqlEnum("sourceType", ["tarot", "bazi", "horoscope", "dream"]).notNull(),
  sourceId: int("sourceId"), // 关联的记录ID
  rating: int("rating").notNull(), // 1-5星评分
  tags: json("tags"), // 快捷标签：["解读准确", "建议实用", "体验流畅"...]
  comment: text("comment"), // 文字反馈
  isAnonymous: boolean("isAnonymous").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFeedback = typeof userFeedbacks.$inferSelect;
export type InsertUserFeedback = typeof userFeedbacks.$inferInsert;


/**
 * 联系表单提交记录表
 */
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // 可选，已登录用户自动关联
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["general", "technical", "billing", "partnership", "feedback", "other"]).default("general").notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "replied", "resolved", "closed"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  repliedAt: timestamp("repliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;


/**
 * 客服会话表
 */
export const chatSessions = mysqlTable("chat_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  userId: int("userId"), // 可选，游客也可以发起聊天
  userName: varchar("userName", { length: 100 }),
  userEmail: varchar("userEmail", { length: 320 }),
  status: mysqlEnum("status", ["waiting", "active", "closed"]).default("waiting").notNull(),
  assignedAdminId: int("assignedAdminId"),
  topic: varchar("topic", { length: 200 }),
  lastMessageAt: timestamp("lastMessageAt"),
  closedAt: timestamp("closedAt"),
  closedBy: mysqlEnum("closedBy", ["user", "admin", "system"]),
  rating: int("rating"), // 用户评分 1-5
  feedback: text("feedback"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

/**
 * 聊天消息表
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  senderType: mysqlEnum("senderType", ["user", "admin", "system"]).notNull(),
  senderId: int("senderId"), // 用户或管理员ID
  senderName: varchar("senderName", { length: 100 }),
  content: text("content").notNull(),
  messageType: mysqlEnum("messageType", ["text", "image", "file", "system"]).default("text").notNull(),
  fileUrl: text("fileUrl"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;


/**
 * 保存的报告表 - 用户可重复查看已生成的报告
 */
export const savedReports = mysqlTable("saved_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reportType: mysqlEnum("reportType", ["tarot", "bazi", "horoscope", "dream"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  inputSummary: text("inputSummary"), // 用户输入摘要（如问题、生日等）
  reportData: json("reportData").notNull(), // 完整的结构化报告数据
  aiInterpretation: text("aiInterpretation"), // AI解读文本
  isPaid: boolean("isPaid").default(false),
  isFavorite: boolean("isFavorite").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedReport = typeof savedReports.$inferSelect;
export type InsertSavedReport = typeof savedReports.$inferInsert;

/**
 * 通知表 - 站内通知系统
 * type: system=系统通知, report=报告完成, membership=会员相关, community=社区互动, admin=管理员广播
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // null = broadcast to all users
  type: mysqlEnum("type", ["system", "report", "membership", "community", "admin", "promotion"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  link: varchar("link", { length: 500 }), // optional deep link
  icon: varchar("icon", { length: 50 }), // lucide icon name
  isRead: boolean("isRead").default(false).notNull(),
  isBroadcast: boolean("isBroadcast").default(false).notNull(), // true = sent to all users
  metadata: json("metadata"), // extra data like reportId, postId etc
  expiresAt: timestamp("expiresAt"), // optional expiration
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * 广播通知已读记录 - 追踪用户已读的广播通知
 */
export const broadcastReadReceipts = mysqlTable("broadcast_read_receipts", {
  id: int("id").autoincrement().primaryKey(),
  notificationId: int("notificationId").notNull(),
  userId: int("userId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
});

export type BroadcastReadReceipt = typeof broadcastReadReceipts.$inferSelect;
export type InsertBroadcastReadReceipt = typeof broadcastReadReceipts.$inferInsert;

/**
 * Referral 邀请系统表
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(), // 邀请人
  referredId: int("referredId").notNull(), // 被邀请人
  referralCode: varchar("referralCode", { length: 20 }).notNull(), // 使用的邀请码
  status: mysqlEnum("status", ["pending", "completed", "rewarded"]).default("pending").notNull(),
  referrerRewarded: boolean("referrerRewarded").default(false).notNull(),
  referredRewarded: boolean("referredRewarded").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Referral 奖励记录表
 */
export const referralRewards = mysqlTable("referral_rewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  referralId: int("referralId").notNull(),
  rewardType: mysqlEnum("rewardType", ["bonus_credits"]).default("bonus_credits").notNull(),
  featureType: mysqlEnum("featureType", ["tarot", "bazi", "dream", "all"]).default("all").notNull(),
  creditsAmount: int("creditsAmount").default(1).notNull(),
  claimed: boolean("claimed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReferralReward = typeof referralRewards.$inferSelect;
export type InsertReferralReward = typeof referralRewards.$inferInsert;

/**
 * 合盘（关系兼容性分析）记录表
 */
export const compatibilityReports = mysqlTable("compatibility_reports", {
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
  scores: json("scores"), // { love, communication, values, trust, growth, passion }
  basicReading: text("basicReading"),
  deepAnalysis: text("deepAnalysis"), // Full multi-dimension LLM analysis
  isPaid: boolean("isPaid").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompatibilityReport = typeof compatibilityReports.$inferSelect;
export type InsertCompatibilityReport = typeof compatibilityReports.$inferInsert;

// Email marketing queue
export const emailQueue = mysqlTable("email_queue", {
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
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailQueue = typeof emailQueue.$inferSelect;
export type InsertEmailQueue = typeof emailQueue.$inferInsert;

// Share tracking events
export const shareEvents = mysqlTable("share_events", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId"), // nullable for anonymous shares
  platform: varchar("platform", { length: 30 }).notNull(), // whatsapp, telegram, twitter, wechat, weibo, native, download, copy
  type: varchar("type", { length: 30 }).notNull(), // tarot, bazi, horoscope, dream, compatibility
  lang: varchar("lang", { length: 5 }).default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ShareEvent = typeof shareEvents.$inferSelect;
export type InsertShareEvent = typeof shareEvents.$inferInsert;

/**
 * 内测 / 活动兑换码（朋友自助开通会员）
 */
export const accessCodes = mysqlTable("access_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  label: varchar("label", { length: 100 }),
  membershipType: mysqlEnum("membershipType", ["monthly", "yearly", "lifetime"]).default("lifetime").notNull(),
  maxUses: int("maxUses").default(30).notNull(), // 总兑换上限
  usedCount: int("usedCount").default(0).notNull(),
  status: mysqlEnum("status", ["active", "disabled", "exhausted"]).default("active").notNull(),
  expiresAt: timestamp("expiresAt"), // null = 永不过期
  createdBy: int("createdBy"), // admin userId
  note: varchar("note", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = typeof accessCodes.$inferInsert;

/**
 * 兑换记录（一人一码一次）
 */
export const accessCodeRedemptions = mysqlTable("access_code_redemptions", {
  id: int("id").autoincrement().primaryKey(),
  codeId: int("codeId").notNull(),
  code: varchar("code", { length: 40 }).notNull(),
  userId: int("userId").notNull(),
  membershipType: mysqlEnum("membershipType", ["monthly", "yearly", "lifetime"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AccessCodeRedemption = typeof accessCodeRedemptions.$inferSelect;
export type InsertAccessCodeRedemption = typeof accessCodeRedemptions.$inferInsert;
