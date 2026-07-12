// 洞察未来 - 产品配置

// 免费额度配置
export const FREE_LIMITS = {
  tarot: { count: 1, period: "daily" as const, label: "每天1次免费" },
  bazi: { count: 1, period: "monthly" as const, label: "每月1次免费" },
  dream: { count: 1, period: "monthly" as const, label: "每月1次免费" },
  horoscope: { count: -1, period: "daily" as const, label: "无限免费" }, // -1 = unlimited
} as const;

export type FeatureType = keyof typeof FREE_LIMITS;

export const PRODUCTS = {
  // === 单次购买产品（低价转化） ===

  // 单次塔罗深度解读
  TAROT_SINGLE: {
    id: "tarot_single",
    name: "Tarot Deep Reading",
    nameZh: "塔罗深度解读",
    description: "One deep tarot reading with detailed analysis",
    descriptionZh: "一次深度塔罗牌解读，含详细分析报告",
    price: 199, // $1.99
    currency: "usd",
    interval: "one_time" as const,
    featureType: "tarot" as const,
    credits: 1,
  },

  // 塔罗3次包
  TAROT_PACK_3: {
    id: "tarot_pack_3",
    name: "Tarot 3-Pack",
    nameZh: "塔罗3次包",
    description: "3 deep tarot readings at a discount",
    descriptionZh: "3次深度塔罗解读，优惠价",
    price: 499, // $4.99 (save 17%)
    currency: "usd",
    interval: "one_time" as const,
    featureType: "tarot" as const,
    credits: 3,
  },

  // 单次八字完整报告
  BAZI_SINGLE: {
    id: "bazi_single",
    name: "BaZi Full Report",
    nameZh: "八字完整报告",
    description: "One comprehensive BaZi destiny analysis",
    descriptionZh: "一次完整的八字命理分析报告",
    price: 499, // $4.99
    currency: "usd",
    interval: "one_time" as const,
    featureType: "bazi" as const,
    credits: 1,
  },

  // 单次解梦深度分析
  DREAM_SINGLE: {
    id: "dream_single",
    name: "Dream Deep Analysis",
    nameZh: "解梦深度分析",
    description: "One in-depth dream interpretation with psychology insights",
    descriptionZh: "一次深度梦境解读，含心理学洞察",
    price: 199, // $1.99
    currency: "usd",
    interval: "one_time" as const,
    featureType: "dream" as const,
    credits: 1,
  },

  // 解梦5次包
  DREAM_PACK_5: {
    id: "dream_pack_5",
    name: "Dream 5-Pack",
    nameZh: "解梦5次包",
    description: "5 dream interpretations at a discount",
    descriptionZh: "5次深度解梦分析，优惠价",
    price: 799, // $7.99 (save 20%)
    currency: "usd",
    interval: "one_time" as const,
    featureType: "dream" as const,
    credits: 5,
  },

  // === 会员订阅（高价值锁定） ===

  // 月度会员
  MONTHLY_MEMBERSHIP: {
    id: "monthly_membership",
    name: "Monthly Membership",
    nameZh: "月度会员",
    description: "Unlimited access to all features",
    descriptionZh: "无限次使用所有功能",
    price: 999, // $9.99
    currency: "usd",
    interval: "month" as const,
    features: [
      "无限次塔罗占卜",
      "无限次八字分析",
      "无限次解梦分析",
      "深度解读报告",
      "专属成长建议",
      "优先客服支持",
    ],
    featuresEn: [
      "Unlimited Tarot Readings",
      "Unlimited BaZi Analysis",
      "Unlimited Dream Interpretation",
      "Deep Analysis Reports",
      "Personal Growth Advice",
      "Priority Support",
    ],
    charityPercentage: 10,
  },

  // 年度会员
  YEARLY_MEMBERSHIP: {
    id: "yearly_membership",
    name: "Yearly Membership",
    nameZh: "年度会员",
    description: "Best value - save 50% compared to monthly",
    descriptionZh: "最超值 - 比月付节省50%",
    price: 5999, // $59.99 (= $5/month)
    currency: "usd",
    interval: "year" as const,
    features: [
      "包含月度会员所有权益",
      "年度运势报告",
      "专属生命之花徽章",
      "社区VIP标识",
      "优先体验新功能",
    ],
    featuresEn: [
      "All Monthly Membership Benefits",
      "Annual Fortune Report",
      "Exclusive Life Flower Badge",
      "Community VIP Badge",
      "Early Access to New Features",
    ],
    charityPercentage: 10,
    popular: true,
  },

  // 终身会员
  LIFETIME_MEMBERSHIP: {
    id: "lifetime_membership",
    name: "Lifetime Membership",
    nameZh: "终身会员",
    description: "One-time purchase, lifetime access to all premium features",
    descriptionZh: "一次购买，终身使用所有高级功能",
    price: 14999, // $149.99
    currency: "usd",
    interval: "one_time" as const,
    features: [
      "包含年度会员所有权益",
      "终身免费使用",
      "专属定制报告",
      "一对一咨询机会",
      "创始会员荣誉",
    ],
    featuresEn: [
      "All Yearly Membership Benefits",
      "Lifetime Free Access",
      "Custom Reports",
      "1-on-1 Consultation",
      "Founding Member Honor",
    ],
    charityPercentage: 10,
  },

  // 单次合盘分析
  COMPATIBILITY_SINGLE: {
    id: "compatibility_single",
    name: "Compatibility Analysis",
    nameZh: "合盘分析",
    description: "One in-depth relationship compatibility analysis",
    descriptionZh: "一次深度关系兼容性分析报告",
    price: 299, // $2.99
    currency: "usd",
    interval: "one_time" as const,
    featureType: "compatibility" as const,
    credits: 1,
  },

  // 保留旧的产品ID兼容性
  TAROT_DEEP_READING: {
    id: "tarot_deep_reading",
    name: "Tarot Deep Reading",
    nameZh: "塔罗深度解读",
    description: "Single deep tarot reading",
    descriptionZh: "单次塔罗深度解读",
    price: 199,
    currency: "usd",
    interval: "one_time" as const,
    featureType: "tarot" as const,
    credits: 1,
  },

  BAZI_FULL_REPORT: {
    id: "bazi_full_report",
    name: "BaZi Full Report",
    nameZh: "八字详批报告",
    description: "Single comprehensive BaZi analysis",
    descriptionZh: "单次完整八字命理分析",
    price: 499,
    currency: "usd",
    interval: "one_time" as const,
    featureType: "bazi" as const,
    credits: 1,
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;
export type Product = typeof PRODUCTS[ProductId];

// 获取产品信息
export function getProduct(productId: ProductId): Product {
  return PRODUCTS[productId];
}

// 计算公益捐赠金额
export function calculateCharityAmount(productId: ProductId, amount: number): number {
  const product = PRODUCTS[productId];
  const percentage = 'charityPercentage' in product ? product.charityPercentage : 10;
  return Math.floor(amount * percentage / 100);
}

// 获取单次购买产品列表
export function getSinglePurchaseProducts() {
  return Object.entries(PRODUCTS)
    .filter(([key, p]) => 'featureType' in p && p.interval === 'one_time' && !['TAROT_DEEP_READING', 'BAZI_FULL_REPORT'].includes(key))
    .map(([key, p]) => ({ productKey: key as ProductId, ...p }));
}

// 获取会员订阅产品列表
export function getMembershipProducts() {
  return Object.entries(PRODUCTS)
    .filter(([_, p]) => p.interval !== 'one_time' || p.id.includes('lifetime'))
    .filter(([key]) => ['MONTHLY_MEMBERSHIP', 'YEARLY_MEMBERSHIP', 'LIFETIME_MEMBERSHIP'].includes(key))
    .map(([key, p]) => ({ productKey: key as ProductId, ...p }));
}
