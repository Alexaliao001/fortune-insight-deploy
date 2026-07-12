import { Helmet } from "react-helmet-async";
import { useTranslation } from "@/contexts/LanguageContext";

interface SEOHeadProps {
  titleKey?: string;
  descriptionKey?: string;
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const SITE_NAME = "Fortune Insight";
const BASE_URL = "https://fortunesite.one";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

// SEO content for each page in both languages
// Title: 30-60 characters | Description: 50-160 characters | Keywords: relevant terms
const seoContent: Record<string, {
  en: { title: string; description: string; keywords: string };
  zh: { title: string; description: string; keywords: string };
}> = {
  home: {
    en: {
      title: "Fortune Insight - Free AI Tarot Reading, Love & Horoscope",
      description: "Free AI-powered love tarot reading, BaZi analysis, daily horoscope & dream interpretation. No signup needed. Ancient wisdom meets modern AI.",
      keywords: "free AI tarot reading, love tarot, horoscope today, BaZi analysis, dream interpretation, fortune telling",
    },
    zh: {
      title: "洞察未来 - AI驱动的命理与心灵成长平台",
      description: "结合AI技术与东方古老智慧，提供塔罗占卜、八字精批、星座运势、AI解梦等科学命理分析服务，助您探索内心、发现潜能。",
      keywords: "AI命理分析, 塔罗占卜, 八字精批, 星座运势, AI解梦",
    },
  },
  tarot: {
    en: {
      title: "Free AI Love Tarot Reading - Will They Text Back? | Fortune Insight",
      description: "Free AI tarot reading for love, relationships & more. No signup needed. Get personalized insights from a full 78-card Rider-Waite deck powered by AI.",
      keywords: "free love tarot reading, AI tarot, relationship tarot, will he text back, tarot reading online free, love tarot spread, tarot cards meaning, online tarot",
    },
    zh: {
      title: "AI塔罗占卜 - 个性化命运指引 | 洞察未来",
      description: "免费体验AI塔罗占卜，涵盖爱情、事业、财运、健康等主题。融合传统塔罗智慧与人工智能，为您提供个性化命运解读。",
      keywords: "AI塔罗占卜, 免费塔罗, 爱情塔罗, 事业塔罗, 塔罗牌在线, 塔罗解读, 命运指引, 塔罗占卜免费",
    },
  },
  bazi: {
    en: {
      title: "AI BaZi Analysis - Chinese Astrology | Fortune Insight",
      description: "Discover your personality, talents, and life direction through AI-powered BaZi (Four Pillars of Destiny) analysis based on millennia of Chinese astrology.",
      keywords: "BaZi analysis, Four Pillars of Destiny, Chinese astrology, birth chart, AI astrology, Chinese horoscope, destiny analysis, personality analysis",
    },
    zh: {
      title: "AI八字精批 - 中国命理生辰八字分析 | 洞察未来",
      description: "通过AI八字精批深入分析您的性格特点、天赋潜能和人生方向。基于千年中国命理学智慧，结合现代AI技术提供精准解读。",
      keywords: "八字精批, 四柱八字, 生辰八字, AI八字分析, 命理分析, 八字算命, 中国命理学, 性格分析, 人生方向",
    },
  },
  horoscope: {
    en: {
      title: "Daily Horoscope - AI Celestial Insights | Fortune Insight",
      description: "Get your personalized daily horoscope with AI-powered celestial insights. Navigate life's rhythms with positive psychology guidance for all 12 zodiac signs.",
      keywords: "daily horoscope, zodiac signs, astrology, AI horoscope, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces",
    },
    zh: {
      title: "每日星座运势 - AI星象解读 | 洞察未来",
      description: "获取个性化每日星座运势，AI驱动的星象解读。结合积极心理学建议，助您把握生活节奏，活出最好的自己。",
      keywords: "每日星座运势, 星座运势, AI星座, 十二星座, 白羊座, 金牛座, 双子座, 巨蟹座, 狮子座, 处女座, 天秤座, 天蝎座, 射手座, 摩羯座, 水瓶座, 双鱼座",
    },
  },
  dream: {
    en: {
      title: "AI Dream Interpreter - Subconscious | Fortune Insight",
      description: "Professional AI dream analysis to explore your subconscious mind. Record dreams, discover hidden meanings, and gain psychological insights for personal growth.",
      keywords: "dream interpretation, AI dream analysis, dream meaning, subconscious, dream dictionary, dream symbols, psychology, personal growth, dream journal",
    },
    zh: {
      title: "AI解梦 - 探索潜意识世界 | 洞察未来",
      description: "专业AI梦境分析，探索您的潜意识世界。记录梦境、发现隐藏含义，获得心理学洞察，促进个人成长与自我认知。",
      keywords: "AI解梦, 梦境分析, 解梦大全, 潜意识, 梦的含义, 梦境解读, 心理学, 个人成长, 梦境记录",
    },
  },
  compatibility: {
    en: {
      title: "Compatibility Analysis - Zodiac Synastry | Fortune Insight",
      description: "Discover the cosmic dynamics between two souls. AI-powered zodiac compatibility analysis covering love, passion, trust, communication, and long-term harmony.",
      keywords: "zodiac compatibility, synastry, love compatibility, relationship astrology, zodiac match, star sign compatibility, couple analysis",
    },
    zh: {
      title: "合盘分析 - 星座关系兼容性 | 洞察未来",
      description: "探索两个灵魂之间的宇宙动态。AI驱动的星座合盘分析，涵盖爱情、激情、信任、沟通与长期和谐等10个维度。",
      keywords: "星座合盘, 合盘分析, 爱情兼容性, 星座配对, 关系分析, 星座匹配, 情侣分析",
    },
  },
  community: {
    en: {
      title: "Community - Share Insights & Connect | Fortune Insight",
      description: "Join our spiritual growth community. Share reading insights, connect with like-minded people, and explore expert content on psychology and astrology.",
      keywords: "spiritual community, astrology community, tarot community, personal growth, share insights, like-minded people, psychology, spiritual growth forum",
    },
    zh: {
      title: "社区 - 分享洞察与连接 | 洞察未来",
      description: "加入我们的心灵成长社区，分享您的测算感悟，与志同道合的朋友交流，探索心理学和命理学的专业内容。",
      keywords: "心灵成长社区, 命理社区, 塔罗社区, 个人成长, 分享感悟, 志同道合, 心理学, 命理学交流",
    },
  },
  membership: {
    en: {
      title: "Membership Plans - Unlock Premium Features | Fortune Insight",
      description: "Become a Starlight Guardian member. Unlock unlimited readings, in-depth analysis reports, and exclusive features. 10% of revenue donated to charity.",
      keywords: "membership, premium features, unlimited readings, Starlight Guardian, subscription, in-depth analysis, exclusive features, charity donation",
    },
    zh: {
      title: "会员计划 - 解锁高级功能 | 洞察未来",
      description: "成为星光守护者会员，解锁无限次测算、深度分析报告和专属功能。会员收入的10%将捐赠给公益项目。",
      keywords: "会员计划, 高级功能, 无限测算, 星光守护者, 订阅, 深度分析, 专属功能, 公益捐赠",
    },
  },
  contact: {
    en: {
      title: "Contact Us - Get in Touch | Fortune Insight",
      description: "Have questions or suggestions? Reach out to the Fortune Insight team. We help with inquiries about our AI-powered spiritual growth services and partnerships.",
      keywords: "contact Fortune Insight, customer support, feedback, partnership, inquiries, help, spiritual growth platform",
    },
    zh: {
      title: "联系我们 - 获取帮助 | 洞察未来",
      description: "有任何问题或建议？联系洞察未来团队。我们随时为您解答关于服务、会员或合作的疑问，期待您的反馈。",
      keywords: "联系我们, 客户支持, 反馈建议, 合作咨询, 帮助中心, 洞察未来",
    },
  },
  profile: {
    en: {
      title: "My Profile - Reading History & Growth | Fortune Insight",
      description: "View your reading history, track personal growth progress, manage membership, and export reports. Your spiritual growth journey at a glance.",
      keywords: "profile, reading history, personal growth, membership management, export reports, spiritual journey, growth tracking",
    },
    zh: {
      title: "个人中心 - 测算记录与成长 | 洞察未来",
      description: "查看测算历史记录、追踪个人成长进度、管理会员状态、导出报告。一览您的心灵成长之旅，记录每一步成长。",
      keywords: "个人中心, 测算记录, 个人成长, 会员管理, 导出报告, 成长追踪",
    },
  },
  about: {
    en: {
      title: "About Us - Our Mission & Values | Fortune Insight",
      description: "Learn about Fortune Insight's mission to combine AI technology with ancient Eastern wisdom. Discover our values, team, and commitment to personal growth.",
      keywords: "about Fortune Insight, mission, values, AI technology, ancient wisdom, personal growth, spiritual growth platform, team",
    },
    zh: {
      title: "关于我们 - 使命与价值观 | 洞察未来",
      description: "了解洞察未来的使命：将AI技术与东方古老智慧相结合。了解我们的价值观、团队和帮助您发掘潜能的承诺。",
      keywords: "关于洞察未来, 使命, 价值观, AI技术, 东方智慧, 个人成长, 心灵成长平台, 团队",
    },
  },
  faq: {
    en: {
      title: "FAQ - Frequently Asked Questions | Fortune Insight",
      description: "Find answers to common questions about Fortune Insight's AI-powered services, membership plans, payment methods, privacy policies, and charity program.",
      keywords: "FAQ, frequently asked questions, help, Fortune Insight, membership, payment, privacy, charity, AI services",
    },
    zh: {
      title: "常见问题 - 帮助中心 | 洞察未来",
      description: "查找关于洞察未来服务、会员计划、支付方式、隐私政策和公益计划的常见问题解答，快速获取帮助。",
      keywords: "常见问题, 帮助中心, 洞察未来, 会员计划, 支付方式, 隐私政策, 公益计划",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy - Data Protection | Fortune Insight",
      description: "Learn how Fortune Insight collects, uses, and protects your personal data. We employ industry-standard security measures and never sell your information.",
      keywords: "privacy policy, data protection, personal data, security, Fortune Insight, GDPR, data collection, information security",
    },
    zh: {
      title: "隐私政策 - 数据保护 | 洞察未来",
      description: "了解洞察未来如何收集、使用和保护您的个人数据。我们采用行业标准安全措施，绝不出售您的信息。",
      keywords: "隐私政策, 数据保护, 个人数据, 安全措施, 洞察未来, 信息安全",
    },
  },
  terms: {
    en: {
      title: "Terms of Service - User Agreement | Fortune Insight",
      description: "Read Fortune Insight's terms of service covering account usage, payment policies, intellectual property, user responsibilities, and service guidelines.",
      keywords: "terms of service, user agreement, account usage, payment policy, intellectual property, Fortune Insight, service terms",
    },
    zh: {
      title: "服务条款 - 用户协议 | 洞察未来",
      description: "阅读洞察未来的服务条款，涵盖账户使用、支付政策、知识产权和用户责任，了解您的权利与义务。",
      keywords: "服务条款, 用户协议, 账户使用, 支付政策, 知识产权, 洞察未来",
    },
  },
  charity: {
    en: {
      title: "Charity Program - Making a Difference | Fortune Insight",
      description: "Fortune Insight donates 10% of membership revenue to charity. Learn about our education, mental health, community care, and environmental protection projects.",
      keywords: "charity program, donation, education, mental health, community care, environmental protection, social responsibility, Fortune Insight charity",
    },
    zh: {
      title: "公益计划 - 传递爱心 | 洞察未来",
      description: "洞察未来将会员收入的10%捐赠给公益项目。了解我们在教育助学、心理健康、社区关怀和环境保护方面的公益行动。",
      keywords: "公益计划, 慈善捐赠, 教育助学, 心理健康, 社区关怀, 环境保护, 社会责任, 洞察未来公益",
    },
  },
  growth: {
    en: {
      title: "Personal Growth Tracker | Fortune Insight",
      description: "Track your personal growth journey with the Life Flower visualization. Monitor progress across self-awareness, emotional management, and relationships.",
      keywords: "personal growth, growth tracker, Life Flower, self-awareness, emotional management, relationships, self-improvement, growth visualization",
    },
    zh: {
      title: "个人成长追踪 | 洞察未来",
      description: "通过生命之花可视化追踪您的个人成长之旅。监测自我认知、情绪管理、亲密关系等多维度成长进度。",
      keywords: "个人成长, 成长追踪, 生命之花, 自我认知, 情绪管理, 亲密关系, 自我提升, 成长可视化",
    },
  },
  notFound: {
    en: {
      title: "Page Not Found | Fortune Insight",
      description: "The page you're looking for seems to have vanished into the stars. Let us guide you back to Fortune Insight's spiritual growth platform.",
      keywords: "page not found, 404, Fortune Insight",
    },
    zh: {
      title: "页面未找到 | 洞察未来",
      description: "您寻找的页面似乎已消失在星空之中。让我们带您回到洞察未来的心灵成长平台。",
      keywords: "页面未找到, 404, 洞察未来",
    },
  },
};

export default function SEOHead({ titleKey, descriptionKey, title, description, keywords, path = "/", image, type = "website", noindex = false }: SEOHeadProps) {
  const { language } = useTranslation();
  const lang = language === "zh" ? "zh" : "en";

  // Use titleKey to look up content, or fall back to direct title/description props
  const content = titleKey ? seoContent[titleKey] : null;
  const finalTitle = title || (content ? content[lang].title : `${SITE_NAME} - AI-Powered Spiritual Growth Platform`);
  const finalDescription = description || (content ? content[lang].description : "Discover your true self with AI-powered tarot reading, BaZi analysis, daily horoscope, and dream interpretation. Ancient wisdom meets modern AI technology.");
  const finalKeywords = keywords || (content ? content[lang].keywords : "AI tarot reading, BaZi analysis, daily horoscope, dream interpretation, spiritual growth, fortune telling, personal growth");
  const canonicalUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* HTML Lang */}
      <html lang={lang === "zh" ? "zh-CN" : "en"} />

      {/* Basic Meta */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="language" content={lang === "zh" ? "zh-CN" : "en"} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === "zh" ? "zh_CN" : "en_US"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}

export { seoContent };
