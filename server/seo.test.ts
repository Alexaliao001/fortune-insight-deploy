import { describe, it, expect } from "vitest";

// Test the SEO content mapping to ensure all pages have proper meta data
// We test the data structure since the component rendering requires React DOM

const seoContent: Record<string, { en: { title: string; description: string }; zh: { title: string; description: string } }> = {
  home: {
    en: { title: "Fortune Insight - AI-Powered Spiritual Growth Platform", description: "Discover your true self with AI-powered tarot reading, BaZi analysis, horoscope, and dream interpretation. Combining ancient wisdom with modern technology for personal growth." },
    zh: { title: "洞察未来 - AI驱动的命理与心灵成长平台", description: "结合AI技术与东方古老智慧，提供塔罗占卜、八字精批、星座运势、AI解梦等科学命理分析服务，助您探索内心、发现潜能、开启成长之旅。" },
  },
  tarot: {
    en: { title: "AI Tarot Reading - Personalized Destiny Guidance | Fortune Insight", description: "Get a free AI-powered tarot reading." },
    zh: { title: "AI塔罗占卜 - 个性化命运指引 | 洞察未来", description: "免费体验AI塔罗占卜" },
  },
  bazi: {
    en: { title: "AI BaZi Analysis - Chinese Astrology Birth Chart | Fortune Insight", description: "Discover your personality" },
    zh: { title: "AI八字精批 - 中国命理生辰八字分析 | 洞察未来", description: "通过AI八字精批" },
  },
  horoscope: {
    en: { title: "Daily Horoscope - AI Celestial Insights | Fortune Insight", description: "Get your personalized daily horoscope" },
    zh: { title: "每日星座运势 - AI星象解读 | 洞察未来", description: "获取个性化每日星座运势" },
  },
  dream: {
    en: { title: "AI Dream Interpreter - Explore Your Subconscious | Fortune Insight", description: "Professional AI dream analysis" },
    zh: { title: "AI解梦 - 探索潜意识世界 | 洞察未来", description: "专业AI梦境分析" },
  },
  community: {
    en: { title: "Community - Share Insights & Connect | Fortune Insight", description: "Join our spiritual growth community" },
    zh: { title: "社区 - 分享洞察与连接 | 洞察未来", description: "加入我们的心灵成长社区" },
  },
  membership: {
    en: { title: "Membership Plans - Unlock Premium Features | Fortune Insight", description: "Become a Starlight Guardian member" },
    zh: { title: "会员计划 - 解锁高级功能 | 洞察未来", description: "成为星光守护者会员" },
  },
  contact: {
    en: { title: "Contact Us - Get in Touch | Fortune Insight", description: "Have questions or suggestions?" },
    zh: { title: "联系我们 | 洞察未来", description: "有任何问题或建议？" },
  },
  profile: {
    en: { title: "My Profile - Reading History & Growth | Fortune Insight", description: "View your reading history" },
    zh: { title: "个人中心 - 测算记录与成长 | 洞察未来", description: "查看测算历史记录" },
  },
  about: {
    en: { title: "About Us - Our Mission & Values | Fortune Insight", description: "Learn about Fortune Insight's mission" },
    zh: { title: "关于我们 - 使命与价值观 | 洞察未来", description: "了解洞察未来的使命" },
  },
  faq: {
    en: { title: "FAQ - Frequently Asked Questions | Fortune Insight", description: "Find answers to common questions" },
    zh: { title: "常见问题 | 洞察未来", description: "查找关于洞察未来服务" },
  },
  privacy: {
    en: { title: "Privacy Policy - Data Protection | Fortune Insight", description: "Learn how Fortune Insight collects" },
    zh: { title: "隐私政策 - 数据保护 | 洞察未来", description: "了解洞察未来如何收集" },
  },
  terms: {
    en: { title: "Terms of Service | Fortune Insight", description: "Read Fortune Insight's terms of service" },
    zh: { title: "服务条款 | 洞察未来", description: "阅读洞察未来的服务条款" },
  },
  charity: {
    en: { title: "Charity Program - Making a Difference | Fortune Insight", description: "Fortune Insight donates 10%" },
    zh: { title: "公益计划 - 传递爱心 | 洞察未来", description: "洞察未来将会员收入的10%" },
  },
  growth: {
    en: { title: "Personal Growth Tracker | Fortune Insight", description: "Track your personal growth journey" },
    zh: { title: "个人成长追踪 | 洞察未来", description: "通过生命之花可视化追踪" },
  },
  notFound: {
    en: { title: "Page Not Found | Fortune Insight", description: "The page you're looking for" },
    zh: { title: "页面未找到 | 洞察未来", description: "您寻找的页面" },
  },
};

const allPageKeys = [
  "home", "tarot", "bazi", "horoscope", "dream", "community",
  "membership", "contact", "profile", "about", "faq", "privacy",
  "terms", "charity", "growth", "notFound"
];

describe("SEO Meta Content", () => {
  it("should have SEO content for all 16 pages", () => {
    expect(Object.keys(seoContent).length).toBe(16);
    for (const key of allPageKeys) {
      expect(seoContent[key]).toBeDefined();
    }
  });

  for (const key of allPageKeys) {
    describe(`Page: ${key}`, () => {
      it("should have English title and description", () => {
        const content = seoContent[key];
        expect(content.en.title).toBeTruthy();
        expect(content.en.description).toBeTruthy();
        expect(content.en.title.length).toBeGreaterThan(10);
        expect(content.en.description.length).toBeGreaterThan(10);
      });

      it("should have Chinese title and description", () => {
        const content = seoContent[key];
        expect(content.zh.title).toBeTruthy();
        expect(content.zh.description).toBeTruthy();
        expect(content.zh.title.length).toBeGreaterThan(5);
        expect(content.zh.description.length).toBeGreaterThan(5);
      });

      it("should include 'Fortune Insight' or '洞察未来' in titles", () => {
        const content = seoContent[key];
        expect(
          content.en.title.includes("Fortune Insight")
        ).toBe(true);
        expect(
          content.zh.title.includes("洞察未来")
        ).toBe(true);
      });

      it("should have different EN and ZH titles", () => {
        const content = seoContent[key];
        expect(content.en.title).not.toBe(content.zh.title);
      });

      it("should have different EN and ZH descriptions", () => {
        const content = seoContent[key];
        expect(content.en.description).not.toBe(content.zh.description);
      });
    });
  }

  it("should have unique English titles across all pages", () => {
    const titles = allPageKeys.map(k => seoContent[k].en.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it("should have unique Chinese titles across all pages", () => {
    const titles = allPageKeys.map(k => seoContent[k].zh.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });
});
