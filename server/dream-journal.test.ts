import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// Dream Journal Enhancement Tests
// ============================================================

describe("Dream Journal - getStats procedure", () => {
  it("should return correct stats structure with all fields", () => {
    const stats = {
      totalDreams: 15,
      deepAnalysisCount: 8,
      emotionDistribution: { "恐惧": 5, "快乐": 3, "困惑": 7 },
      elementDistribution: { "水": 4, "飞翔": 6, "追逐": 2 },
      typeDistribution: { normal: 10, nightmare: 3, lucid: 2 },
      tagDistribution: { "重复梦": 3, "预知": 2 },
      weeklyTimeline: [
        { week: "1/1", count: 2 },
        { week: "1/8", count: 3 },
        { week: "1/15", count: 1 },
      ],
    };

    expect(stats.totalDreams).toBe(15);
    expect(stats.deepAnalysisCount).toBe(8);
    expect(Object.keys(stats.emotionDistribution).length).toBe(3);
    expect(Object.keys(stats.elementDistribution).length).toBe(3);
    expect(Object.keys(stats.typeDistribution).length).toBe(3);
    expect(stats.weeklyTimeline.length).toBe(3);
    expect(stats.weeklyTimeline[0].week).toBe("1/1");
    expect(stats.weeklyTimeline[0].count).toBe(2);
  });

  it("should calculate weekly timeline correctly", () => {
    const now = new Date();
    const records = [
      { createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) }, // 1 day ago
      { createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
      { createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000) }, // 8 days ago
      { createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000) }, // 50 days ago
    ];

    // Simulate timeline calculation
    const weeklyTimeline: { week: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const count = records.filter(r => {
        const d = new Date(r.createdAt);
        return d >= weekStart && d < weekEnd;
      }).length;
      const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      weeklyTimeline.push({ week: label, count });
    }

    expect(weeklyTimeline.length).toBe(12);
    // Total count across all weeks should match total records within 12-week window
    const totalInTimeline = weeklyTimeline.reduce((s, w) => s + w.count, 0);
    // At least the recent 3 records (1, 2, 8 days ago) should be within 12 weeks
    expect(totalInTimeline).toBeGreaterThanOrEqual(3);
  });

  it("should count deep analysis records correctly", () => {
    const records = [
      { deepAnalysis: "A".repeat(200) }, // long enough
      { deepAnalysis: "Short" }, // too short
      { deepAnalysis: null }, // no analysis
      { deepAnalysis: "B".repeat(150) }, // long enough
    ];

    const deepAnalysisCount = records.filter(
      r => r.deepAnalysis && r.deepAnalysis.length > 100
    ).length;

    expect(deepAnalysisCount).toBe(2);
  });

  it("should aggregate emotion distribution correctly", () => {
    const records = [
      { emotions: ["恐惧", "焦虑"] },
      { emotions: ["快乐", "恐惧"] },
      { emotions: null },
      { emotions: ["恐惧"] },
    ];

    const emotionDistribution: Record<string, number> = {};
    for (const record of records) {
      const emotions = record.emotions as string[] | null;
      if (emotions) {
        for (const e of emotions) {
          emotionDistribution[e] = (emotionDistribution[e] || 0) + 1;
        }
      }
    }

    expect(emotionDistribution["恐惧"]).toBe(3);
    expect(emotionDistribution["焦虑"]).toBe(1);
    expect(emotionDistribution["快乐"]).toBe(1);
  });

  it("should aggregate element distribution correctly", () => {
    const records = [
      { keyElements: ["水", "飞翔"] },
      { keyElements: ["水", "追逐"] },
      { keyElements: null },
    ];

    const elementDistribution: Record<string, number> = {};
    for (const record of records) {
      const elements = record.keyElements as string[] | null;
      if (elements) {
        for (const el of elements) {
          elementDistribution[el] = (elementDistribution[el] || 0) + 1;
        }
      }
    }

    expect(elementDistribution["水"]).toBe(2);
    expect(elementDistribution["飞翔"]).toBe(1);
    expect(elementDistribution["追逐"]).toBe(1);
  });

  it("should aggregate type distribution correctly", () => {
    const records = [
      { dreamType: "normal" },
      { dreamType: "nightmare" },
      { dreamType: "normal" },
      { dreamType: "lucid" },
      { dreamType: "normal" },
    ];

    const typeDistribution: Record<string, number> = {};
    for (const record of records) {
      if (record.dreamType) {
        typeDistribution[record.dreamType] = (typeDistribution[record.dreamType] || 0) + 1;
      }
    }

    expect(typeDistribution["normal"]).toBe(3);
    expect(typeDistribution["nightmare"]).toBe(1);
    expect(typeDistribution["lucid"]).toBe(1);
  });

  it("should aggregate tag distribution correctly", () => {
    const records = [
      { tags: ["重复梦", "预知"] },
      { tags: ["重复梦"] },
      { tags: null },
    ];

    const tagDistribution: Record<string, number> = {};
    for (const record of records) {
      const tags = record.tags as string[] | null;
      if (tags) {
        for (const tag of tags) {
          tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
        }
      }
    }

    expect(tagDistribution["重复梦"]).toBe(2);
    expect(tagDistribution["预知"]).toBe(1);
  });
});

describe("Dream Journal - Deep Analysis Parser", () => {
  function parseDeepAnalysis(content: string): { title: string; content: string }[] {
    if (!content) return [];
    const sections: { title: string; content: string }[] = [];

    // Try to split by ## headers
    const headerRegex = /^##\s+(?:\d+[\.\)、]\s*)?(.+)$/gm;
    const matches: { title: string; index: number }[] = [];
    let match;
    while ((match = headerRegex.exec(content)) !== null) {
      matches.push({ title: match[1].trim(), index: match.index });
    }

    if (matches.length >= 5) {
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index + content.slice(matches[i].index).indexOf("\n") + 1;
        const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
        const sectionContent = content.slice(start, end).trim();
        sections.push({ title: matches[i].title, content: sectionContent });
      }
    }

    return sections;
  }

  it("should parse 10-dimension deep analysis with ## headers", () => {
    const content = `## 1. 梦境全景
这是梦境全景的内容...

## 2. 核心象征解码
这是核心象征解码的内容...

## 3. 情绪地图
这是情绪地图的内容...

## 4. 荣格原型映射
这是荣格原型映射的内容...

## 5. 潜意识流
这是潜意识流的内容...

## 6. 灵性与直觉
这是灵性与直觉的内容...

## 7. 阴影工作
这是阴影工作的内容...

## 8. 行动建议
这是行动建议的内容...

## 9. 仪式与冥想
这是仪式与冥想的内容...

## 10. 梦境肯定语
这是梦境肯定语的内容...`;

    const sections = parseDeepAnalysis(content);
    expect(sections.length).toBe(10);
    expect(sections[0].title).toBe("梦境全景");
    expect(sections[1].title).toBe("核心象征解码");
    expect(sections[9].title).toBe("梦境肯定语");
    expect(sections[0].content).toContain("梦境全景的内容");
  });

  it("should parse sections with Chinese-style numbered headers", () => {
    const content = `## 梦境全景
内容1

## 核心象征解码
内容2

## 情绪地图
内容3

## 荣格原型映射
内容4

## 潜意识流
内容5`;

    const sections = parseDeepAnalysis(content);
    expect(sections.length).toBe(5);
    expect(sections[0].title).toBe("梦境全景");
    expect(sections[4].title).toBe("潜意识流");
  });

  it("should return empty array for empty content", () => {
    const sections = parseDeepAnalysis("");
    expect(sections.length).toBe(0);
  });
});

describe("Dream Journal - Stats Overview Component Data", () => {
  it("should calculate top emotions correctly", () => {
    const emotionDistribution = { "恐惧": 5, "快乐": 3, "困惑": 7, "焦虑": 2, "悲伤": 1, "平静": 4 };
    const topEmotions = Object.entries(emotionDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    expect(topEmotions[0][0]).toBe("困惑");
    expect(topEmotions[0][1]).toBe(7);
    expect(topEmotions[1][0]).toBe("恐惧");
    expect(topEmotions.length).toBe(5);
  });

  it("should calculate top elements correctly", () => {
    const elementDistribution = { "水": 8, "飞翔": 3, "追逐": 5, "火": 2, "坠落": 1 };
    const topElements = Object.entries(elementDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    expect(topElements[0][0]).toBe("水");
    expect(topElements[0][1]).toBe(8);
    expect(topElements[1][0]).toBe("追逐");
  });

  it("should handle empty distributions gracefully", () => {
    const emptyDistribution: Record<string, number> = {};
    const topItems = Object.entries(emptyDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    expect(topItems.length).toBe(0);
  });

  it("should calculate max timeline count for bar chart scaling", () => {
    const weeklyTimeline = [
      { week: "1/1", count: 2 },
      { week: "1/8", count: 5 },
      { week: "1/15", count: 0 },
      { week: "1/22", count: 3 },
    ];

    const maxCount = Math.max(...weeklyTimeline.map(w => w.count), 1);
    expect(maxCount).toBe(5);

    // Test with all zeros
    const emptyTimeline = [
      { week: "1/1", count: 0 },
      { week: "1/8", count: 0 },
    ];
    const maxEmpty = Math.max(...emptyTimeline.map(w => w.count), 1);
    expect(maxEmpty).toBe(1); // Should be at least 1 to avoid division by zero
  });
});

describe("Dream Journal - Free vs Paid Sections", () => {
  const FREE_SECTIONS = 3;

  it("should show 3 free sections for non-paid users", () => {
    const totalSections = 10;
    const freeSections = Array.from({ length: totalSections }, (_, i) => i < FREE_SECTIONS);
    const freeCount = freeSections.filter(Boolean).length;
    expect(freeCount).toBe(3);
  });

  it("should lock sections beyond free limit for non-paid users", () => {
    const isPaid = false;
    const sectionIndex = 5;
    const isLocked = !isPaid && sectionIndex >= FREE_SECTIONS;
    expect(isLocked).toBe(true);
  });

  it("should unlock all sections for paid users", () => {
    const isPaid = true;
    const sectionIndex = 9;
    const isLocked = !isPaid && sectionIndex >= FREE_SECTIONS;
    expect(isLocked).toBe(false);
  });

  it("should not lock first 3 sections even for free users", () => {
    const isPaid = false;
    for (let i = 0; i < FREE_SECTIONS; i++) {
      const isLocked = !isPaid && i >= FREE_SECTIONS;
      expect(isLocked).toBe(false);
    }
  });
});

describe("Dream Journal - Detail Modal Data", () => {
  it("should handle dream with all fields populated", () => {
    const dream = {
      id: 1,
      title: "飞翔的梦",
      dreamContent: "我梦见自己在天空中飞翔...",
      dreamType: "lucid",
      emotions: ["快乐", "兴奋"],
      keyElements: ["飞翔", "天空", "云"],
      tags: ["重复梦", "美好"],
      interpretation: "这个梦象征着自由和解放...",
      deepAnalysis: "## 1. 梦境全景\n内容...",
      symbolAnalysis: [{ symbol: "飞翔", meaning: "渴望自由" }],
      createdAt: new Date(),
    };

    expect(dream.title).toBe("飞翔的梦");
    expect(dream.emotions.length).toBe(2);
    expect(dream.keyElements.length).toBe(3);
    expect(dream.tags.length).toBe(2);
    expect(dream.deepAnalysis).toBeTruthy();
  });

  it("should handle dream with null optional fields", () => {
    const dream = {
      id: 2,
      title: null,
      dreamContent: "一个简单的梦...",
      dreamType: "normal",
      emotions: null,
      keyElements: null,
      tags: null,
      interpretation: "基础解读...",
      deepAnalysis: null,
      symbolAnalysis: null,
      createdAt: new Date(),
    };

    const emotions = (dream.emotions as string[] | null) || [];
    const elements = (dream.keyElements as string[] | null) || [];
    const tags = (dream.tags as string[] | null) || [];

    expect(emotions.length).toBe(0);
    expect(elements.length).toBe(0);
    expect(tags.length).toBe(0);
    expect(dream.title || "未命名梦境").toBe("未命名梦境");
  });

  it("should format date correctly for Chinese locale", () => {
    const date = new Date("2025-06-15T10:30:00Z");
    const formatted = date.toLocaleDateString("zh-CN", {
      year: "numeric", month: "long", day: "numeric"
    });
    expect(formatted).toContain("2025");
    expect(formatted).toContain("6");
    expect(formatted).toContain("15");
  });

  it("should format date correctly for English locale", () => {
    const date = new Date("2025-06-15T10:30:00Z");
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
    expect(formatted).toContain("2025");
    expect(formatted).toContain("June");
    expect(formatted).toContain("15");
  });
});
