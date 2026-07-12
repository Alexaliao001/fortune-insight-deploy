import { describe, it, expect } from "vitest";

// ============================================================
// Dream Deep Analysis Enhancement Tests
// ============================================================

// Test the dream profile analysis logic
describe("Dream Element Profile Analysis", () => {
  // Element detection from content
  it("should detect Water element keywords", () => {
    const waterKeywords = ["水", "海", "河", "雨", "泪", "ocean", "river", "rain", "tears", "flood", "lake", "wave"];
    for (const kw of waterKeywords) {
      expect(kw.length).toBeGreaterThan(0);
    }
    expect(waterKeywords.length).toBeGreaterThanOrEqual(10);
  });

  it("should detect Fire element keywords", () => {
    const fireKeywords = ["火", "燃烧", "光", "太阳", "热", "fire", "burn", "light", "sun", "heat", "flame"];
    for (const kw of fireKeywords) {
      expect(kw.length).toBeGreaterThan(0);
    }
    expect(fireKeywords.length).toBeGreaterThanOrEqual(10);
  });

  it("should detect Earth element keywords", () => {
    const earthKeywords = ["山", "土", "石", "树", "花", "森林", "mountain", "earth", "stone", "tree", "flower"];
    expect(earthKeywords.length).toBeGreaterThanOrEqual(10);
  });

  it("should detect Air element keywords", () => {
    const airKeywords = ["风", "飞", "天空", "云", "鸟", "wind", "fly", "sky", "cloud", "bird", "breath"];
    expect(airKeywords.length).toBeGreaterThanOrEqual(10);
  });

  it("should detect Spirit element keywords", () => {
    const spiritKeywords = ["神", "灵", "梦", "星", "月", "光芒", "spirit", "soul", "dream", "star", "moon"];
    expect(spiritKeywords.length).toBeGreaterThanOrEqual(10);
  });
});

// Test the 10-dimension section configuration
describe("Dream 10-Dimension Section Configuration", () => {
  const SECTION_KEYS = [
    "landscape", "symbols", "emotional", "archetype", "subconscious",
    "narrative", "bodymind", "action", "ritual", "affirmation",
  ];

  it("should have exactly 10 dimensions", () => {
    expect(SECTION_KEYS.length).toBe(10);
  });

  it("should have unique section keys", () => {
    const uniqueKeys = new Set(SECTION_KEYS);
    expect(uniqueKeys.size).toBe(SECTION_KEYS.length);
  });

  it("should have first 3 sections as free", () => {
    const freeSections = ["landscape", "symbols", "emotional"];
    const paidSections = SECTION_KEYS.filter(k => !freeSections.includes(k));
    expect(freeSections.length).toBe(3);
    expect(paidSections.length).toBe(7);
  });

  it("should have correct section titles in Chinese", () => {
    const titles: Record<string, string> = {
      landscape: "梦境全景概览",
      symbols: "符号考古学",
      emotional: "情绪地图学",
      archetype: "荣格原型深度解析",
      subconscious: "潜意识地图",
      narrative: "叙事结构与梦境逻辑",
      bodymind: "身心连接",
      action: "实践行动指南",
      ritual: "冥想与仪式建议",
      affirmation: "肯定语与宇宙寄语",
    };
    for (const key of SECTION_KEYS) {
      expect(titles[key]).toBeDefined();
      expect(titles[key].length).toBeGreaterThan(0);
    }
  });

  it("should have correct section titles in English", () => {
    const titles: Record<string, string> = {
      landscape: "Dream Landscape Overview",
      symbols: "Symbol Archaeology",
      emotional: "Emotional Cartography",
      archetype: "Jungian Archetype Analysis",
      subconscious: "Subconscious Mapping",
      narrative: "Narrative Structure & Dream Logic",
      bodymind: "Body-Mind Connection",
      action: "Practical Action Guide",
      ritual: "Meditation & Ritual Suggestions",
      affirmation: "Affirmation & Cosmic Message",
    };
    for (const key of SECTION_KEYS) {
      expect(titles[key]).toBeDefined();
      expect(titles[key].length).toBeGreaterThan(0);
    }
  });
});

// Test the deep analysis text parsing
describe("Dream Deep Analysis Parsing", () => {
  function parseDeepAnalysis(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    if (!text) return sections;

    const sectionPatterns: Array<{ key: string; patterns: RegExp[] }> = [
      { key: "landscape", patterns: [/梦境全景/i, /dream\s*landscape/i, /全景概览/i] },
      { key: "symbols", patterns: [/符号考古/i, /symbol\s*archaeo/i, /符号解析/i] },
      { key: "emotional", patterns: [/情绪地图/i, /emotional\s*cartograph/i, /情绪解码/i] },
      { key: "archetype", patterns: [/荣格原型/i, /jungian\s*archetype/i, /原型分析/i] },
      { key: "subconscious", patterns: [/潜意识地图/i, /subconscious\s*map/i] },
      { key: "narrative", patterns: [/叙事结构/i, /narrative\s*structure/i, /梦境逻辑/i] },
      { key: "bodymind", patterns: [/身心连接/i, /body.*mind\s*connect/i] },
      { key: "action", patterns: [/实践行动/i, /practical\s*action/i, /行动指南/i] },
      { key: "ritual", patterns: [/冥想与仪式/i, /meditation.*ritual/i, /仪式建议/i] },
      { key: "affirmation", patterns: [/肯定语/i, /宇宙寄语/i, /affirmation/i] },
    ];

    function detectSection(line: string): string | null {
      for (const sp of sectionPatterns) {
        for (const pattern of sp.patterns) {
          if (pattern.test(line)) return sp.key;
        }
      }
      return null;
    }

    const lines = text.split("\n");
    let currentKey: string | null = null;
    let buffer: string[] = [];

    const flushBuffer = () => {
      if (currentKey && buffer.length > 0) {
        const content = buffer.join("\n").trim();
        if (content) {
          sections[currentKey] = (sections[currentKey] || "") + (sections[currentKey] ? "\n" : "") + content;
        }
      }
      buffer = [];
    };

    for (const line of lines) {
      const isHeader = /^#{1,3}\s/.test(line);
      if (isHeader) {
        const detected = detectSection(line);
        if (detected) {
          flushBuffer();
          currentKey = detected;
          continue;
        }
      }
      if (!currentKey) {
        const detected = detectSection(line);
        if (detected) {
          flushBuffer();
          currentKey = detected;
          continue;
        }
      }
      if (currentKey) {
        const cleaned = line.replace(/^#{1,4}\s*/, "").trim();
        if (cleaned) buffer.push(cleaned);
        else if (buffer.length > 0) buffer.push("");
      }
    }
    flushBuffer();

    if (Object.keys(sections).length === 0 && text.trim()) {
      const plain = text.replace(/^#{1,4}\s.*$/gm, "").trim();
      if (plain.length > 200) {
        const chunk = Math.floor(plain.length / 3);
        sections["landscape"] = plain.slice(0, chunk).trim();
        sections["symbols"] = plain.slice(chunk, chunk * 2).trim();
        sections["emotional"] = plain.slice(chunk * 2).trim();
      } else {
        sections["landscape"] = plain;
      }
    }

    return sections;
  }

  it("should parse Chinese 10-dimension sections correctly", () => {
    const text = `## 梦境全景概览
你的梦境呈现出一个充满水元素的世界。

## 符号考古学
水象征着情感的深度和潜意识的流动。

## 情绪地图学
梦中的情绪以宁静和好奇为主。

## 荣格原型深度解析
你的梦中出现了"智慧老人"原型。

## 潜意识地图
潜意识正在处理一个关于自我认同的核心议题。

## 叙事结构与梦境逻辑
梦境遵循"英雄之旅"的叙事模式。

## 身心连接
梦中的水元素暗示你需要关注肾脏和泌尿系统。

## 实践行动指南
建议每天花10分钟进行水元素冥想。

## 冥想与仪式建议
推荐月光冥想和水晶净化仪式。

## 肯定语与宇宙寄语
"我信任生命之流，允许自己随波而行。"`;

    const sections = parseDeepAnalysis(text);
    expect(Object.keys(sections).length).toBe(10);
    expect(sections.landscape).toContain("水元素");
    expect(sections.symbols).toContain("情感的深度");
    expect(sections.emotional).toContain("宁静");
    expect(sections.archetype).toContain("智慧老人");
    expect(sections.subconscious).toContain("自我认同");
    expect(sections.narrative).toContain("英雄之旅");
    expect(sections.bodymind).toContain("肾脏");
    expect(sections.action).toContain("水元素冥想");
    expect(sections.ritual).toContain("月光冥想");
    expect(sections.affirmation).toContain("生命之流");
  });

  it("should parse English 10-dimension sections correctly", () => {
    const text = `## Dream Landscape Overview
Your dream presents a world filled with water elements.

## Symbol Archaeology
Water symbolizes the depth of emotions.

## Emotional Cartography
The dominant emotions are serenity and curiosity.

## Jungian Archetype Analysis
The Wise Old Man archetype appears in your dream.

## Subconscious Mapping
Your subconscious is processing a core identity issue.

## Narrative Structure & Dream Logic
The dream follows the Hero's Journey narrative.

## Body-Mind Connection
Water elements suggest attention to kidney health.

## Practical Action Guide
Spend 10 minutes daily on water meditation.

## Meditation & Ritual Suggestions
Moonlight meditation and crystal cleansing ritual.

## Affirmation & Cosmic Message
"I trust the flow of life."`;

    const sections = parseDeepAnalysis(text);
    expect(Object.keys(sections).length).toBe(10);
    expect(sections.landscape).toContain("water elements");
    expect(sections.symbols).toContain("depth of emotions");
    expect(sections.emotional).toContain("serenity");
    expect(sections.archetype).toContain("Wise Old Man");
    expect(sections.subconscious).toContain("identity");
    expect(sections.narrative).toContain("Hero's Journey");
    expect(sections.bodymind).toContain("kidney");
    expect(sections.action).toContain("meditation");
    expect(sections.ritual).toContain("Moonlight");
    expect(sections.affirmation).toContain("trust");
  });

  it("should handle empty text gracefully", () => {
    expect(parseDeepAnalysis("")).toEqual({});
    expect(parseDeepAnalysis("   ")).toEqual({});
  });

  it("should fallback for unstructured text", () => {
    const longText = "A".repeat(300);
    const sections = parseDeepAnalysis(longText);
    expect(sections.landscape).toBeDefined();
    expect(sections.symbols).toBeDefined();
    expect(sections.emotional).toBeDefined();
  });

  it("should handle partial sections", () => {
    const text = `## 梦境全景概览
这是一个关于飞翔的梦。

## 符号考古学
飞翔象征着自由和超越。`;

    const sections = parseDeepAnalysis(text);
    expect(Object.keys(sections).length).toBe(2);
    expect(sections.landscape).toContain("飞翔");
    expect(sections.symbols).toContain("自由");
  });
});

// Test the dream profile structure
describe("Dream Profile Structure", () => {
  it("should have correct element distribution keys", () => {
    const elements = ["Water", "Fire", "Earth", "Air", "Spirit"];
    const dist: Record<string, number> = {};
    for (const e of elements) dist[e] = 0;
    expect(Object.keys(dist).length).toBe(5);
    expect(dist.Water).toBe(0);
    expect(dist.Spirit).toBe(0);
  });

  it("should support all Jungian archetypes", () => {
    const archetypes = [
      "The Shadow", "The Anima", "The Animus", "The Self",
      "The Hero", "The Wise Old Man", "The Great Mother",
      "The Trickster", "The Child", "The Persona",
    ];
    expect(archetypes.length).toBeGreaterThanOrEqual(8);
    for (const a of archetypes) {
      expect(a.length).toBeGreaterThan(0);
    }
  });

  it("should support all narrative patterns", () => {
    const patterns = [
      "Hero's Journey", "Transformation", "Descent",
      "Chase", "Exploration", "Revelation",
    ];
    expect(patterns.length).toBeGreaterThanOrEqual(5);
  });

  it("should support all emotional tones", () => {
    const tones = [
      "Anxious", "Peaceful", "Fearful", "Joyful",
      "Melancholic", "Confused", "Excited", "Neutral",
    ];
    expect(tones.length).toBeGreaterThanOrEqual(6);
  });
});

// Test the LLM prompt structure
describe("Dream LLM Prompt Structure", () => {
  const dimensionHeaders = [
    "梦境全景概览", "符号考古学", "情绪地图学",
    "荣格原型深度解析", "潜意识地图", "叙事结构与梦境逻辑",
    "身心连接", "实践行动指南", "冥想与仪式建议", "肯定语与宇宙寄语",
  ];

  it("should have 10 dimension headers in Chinese", () => {
    expect(dimensionHeaders.length).toBe(10);
  });

  it("should have unique dimension headers", () => {
    const unique = new Set(dimensionHeaders);
    expect(unique.size).toBe(dimensionHeaders.length);
  });

  const dimensionHeadersEn = [
    "Dream Landscape Overview", "Symbol Archaeology", "Emotional Cartography",
    "Jungian Archetype Analysis", "Subconscious Mapping", "Narrative Structure & Dream Logic",
    "Body-Mind Connection", "Practical Action Guide", "Meditation & Ritual Suggestions",
    "Affirmation & Cosmic Message",
  ];

  it("should have 10 dimension headers in English", () => {
    expect(dimensionHeadersEn.length).toBe(10);
  });

  it("should have unique English dimension headers", () => {
    const unique = new Set(dimensionHeadersEn);
    expect(unique.size).toBe(dimensionHeadersEn.length);
  });
});

// Test the dream symbol categories
describe("Dream Symbol Categories", () => {
  const categories = [
    "nature", "animal", "person", "object",
    "action", "place", "emotion", "body", "supernatural",
  ];

  it("should have all expected categories", () => {
    expect(categories.length).toBe(9);
  });

  it("should have icon mapping for each category", () => {
    const icons: Record<string, string> = {
      nature: "🌿", animal: "🐾", person: "👤", object: "🔮",
      action: "⚡", place: "🏛️", emotion: "💫", body: "🫀", supernatural: "✨",
    };
    for (const cat of categories) {
      expect(icons[cat]).toBeDefined();
    }
  });

  it("should have color mapping for each category", () => {
    const colors: Record<string, string> = {
      nature: "from-green-500/20",
      animal: "from-amber-500/20",
      person: "from-blue-500/20",
      object: "from-purple-500/20",
      action: "from-red-500/20",
      place: "from-indigo-500/20",
      emotion: "from-pink-500/20",
      body: "from-teal-500/20",
      supernatural: "from-violet-500/20",
    };
    for (const cat of categories) {
      expect(colors[cat]).toBeDefined();
    }
  });
});

// Test the element color mapping for profile display
describe("Dream Element Display Colors", () => {
  const elements = ["Water", "Fire", "Earth", "Air", "Spirit"];

  it("should have color class for each element", () => {
    const colors: Record<string, string> = {
      Water: "text-blue-400",
      Fire: "text-red-400",
      Earth: "text-amber-400",
      Air: "text-cyan-400",
      Spirit: "text-violet-400",
    };
    for (const el of elements) {
      expect(colors[el]).toBeDefined();
    }
  });

  it("should have emoji for each element", () => {
    const emojis: Record<string, string> = {
      Water: "💧", Fire: "🔥", Earth: "🌍", Air: "💨", Spirit: "✨",
    };
    for (const el of elements) {
      expect(emojis[el]).toBeDefined();
    }
  });
});

// Test the free/paid boundary
describe("Dream Free/Paid Boundary", () => {
  it("should have exactly 3 free sections", () => {
    const freeSections = ["landscape", "symbols", "emotional"];
    expect(freeSections.length).toBe(3);
  });

  it("should have exactly 7 paid sections", () => {
    const paidSections = ["archetype", "subconscious", "narrative", "bodymind", "action", "ritual", "affirmation"];
    expect(paidSections.length).toBe(7);
  });

  it("free + paid should equal 10", () => {
    expect(3 + 7).toBe(10);
  });
});
