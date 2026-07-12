import { describe, it, expect, vi, beforeEach } from "vitest";

// ========== Compatibility Engine Tests ==========
// Test the zodiac compatibility calculation logic

// Zodiac sign metadata (mirror from compatibility router)
const ZODIAC_SIGNS: Record<string, {
  element: string;
  modality: string;
  polarity: string;
  rulingPlanet: string;
}> = {
  aries: { element: "fire", modality: "cardinal", polarity: "masculine", rulingPlanet: "Mars" },
  taurus: { element: "earth", modality: "fixed", polarity: "feminine", rulingPlanet: "Venus" },
  gemini: { element: "air", modality: "mutable", polarity: "masculine", rulingPlanet: "Mercury" },
  cancer: { element: "water", modality: "cardinal", polarity: "feminine", rulingPlanet: "Moon" },
  leo: { element: "fire", modality: "fixed", polarity: "masculine", rulingPlanet: "Sun" },
  virgo: { element: "earth", modality: "mutable", polarity: "feminine", rulingPlanet: "Mercury" },
  libra: { element: "air", modality: "cardinal", polarity: "masculine", rulingPlanet: "Venus" },
  scorpio: { element: "water", modality: "fixed", polarity: "feminine", rulingPlanet: "Pluto" },
  sagittarius: { element: "fire", modality: "mutable", polarity: "masculine", rulingPlanet: "Jupiter" },
  capricorn: { element: "earth", modality: "cardinal", polarity: "feminine", rulingPlanet: "Saturn" },
  aquarius: { element: "air", modality: "fixed", polarity: "masculine", rulingPlanet: "Uranus" },
  pisces: { element: "water", modality: "mutable", polarity: "feminine", rulingPlanet: "Neptune" },
};

// Element compatibility matrix
const ELEMENT_COMPAT: Record<string, Record<string, number>> = {
  fire: { fire: 80, air: 90, earth: 50, water: 40 },
  earth: { earth: 80, water: 85, fire: 50, air: 45 },
  air: { air: 75, fire: 90, water: 50, earth: 45 },
  water: { water: 80, earth: 85, air: 50, fire: 40 },
};

// Modality compatibility
const MODALITY_COMPAT: Record<string, Record<string, number>> = {
  cardinal: { cardinal: 60, fixed: 75, mutable: 85 },
  fixed: { fixed: 65, cardinal: 75, mutable: 70 },
  mutable: { mutable: 70, cardinal: 85, fixed: 70 },
};

function calculateElementCompat(sign1: string, sign2: string) {
  const e1 = ZODIAC_SIGNS[sign1].element;
  const e2 = ZODIAC_SIGNS[sign2].element;
  return ELEMENT_COMPAT[e1][e2];
}

function calculateModalityCompat(sign1: string, sign2: string) {
  const m1 = ZODIAC_SIGNS[sign1].modality;
  const m2 = ZODIAC_SIGNS[sign2].modality;
  return MODALITY_COMPAT[m1][m2];
}

function calculatePolarityCompat(sign1: string, sign2: string) {
  const p1 = ZODIAC_SIGNS[sign1].polarity;
  const p2 = ZODIAC_SIGNS[sign2].polarity;
  return p1 === p2 ? 70 : 85; // Opposite polarities complement
}

function calculateOverallScore(sign1: string, sign2: string) {
  const element = calculateElementCompat(sign1, sign2);
  const modality = calculateModalityCompat(sign1, sign2);
  const polarity = calculatePolarityCompat(sign1, sign2);
  return Math.round(element * 0.45 + modality * 0.30 + polarity * 0.25);
}

describe("Compatibility Engine - Element Compatibility", () => {
  it("should give high score for fire-air combination", () => {
    const score = calculateElementCompat("aries", "gemini");
    expect(score).toBe(90);
  });

  it("should give high score for earth-water combination", () => {
    const score = calculateElementCompat("taurus", "cancer");
    expect(score).toBe(85);
  });

  it("should give moderate score for same element", () => {
    const score = calculateElementCompat("aries", "leo");
    expect(score).toBe(80);
  });

  it("should give low score for fire-water combination", () => {
    const score = calculateElementCompat("aries", "cancer");
    expect(score).toBe(40);
  });

  it("should give low score for earth-air combination", () => {
    const score = calculateElementCompat("taurus", "gemini");
    expect(score).toBe(45);
  });

  it("should be symmetric", () => {
    expect(calculateElementCompat("aries", "cancer")).toBe(calculateElementCompat("cancer", "aries"));
  });
});

describe("Compatibility Engine - Modality Compatibility", () => {
  it("should give high score for cardinal-mutable", () => {
    const score = calculateModalityCompat("aries", "gemini");
    expect(score).toBe(85);
  });

  it("should give moderate score for cardinal-fixed", () => {
    const score = calculateModalityCompat("aries", "taurus");
    expect(score).toBe(75);
  });

  it("should give lower score for same cardinal modality", () => {
    const score = calculateModalityCompat("aries", "cancer");
    expect(score).toBe(60);
  });

  it("should give moderate score for fixed-fixed", () => {
    const score = calculateModalityCompat("taurus", "leo");
    expect(score).toBe(65);
  });
});

describe("Compatibility Engine - Polarity Compatibility", () => {
  it("should give higher score for opposite polarities", () => {
    // Aries (masculine) + Taurus (feminine)
    const score = calculatePolarityCompat("aries", "taurus");
    expect(score).toBe(85);
  });

  it("should give lower score for same polarity", () => {
    // Aries (masculine) + Gemini (masculine)
    const score = calculatePolarityCompat("aries", "gemini");
    expect(score).toBe(70);
  });
});

describe("Compatibility Engine - Overall Score", () => {
  it("should calculate weighted overall score correctly", () => {
    // Aries + Gemini: element=90, modality=85, polarity=70
    // 90*0.45 + 85*0.30 + 70*0.25 = 40.5 + 25.5 + 17.5 = 84
    const score = calculateOverallScore("aries", "gemini");
    expect(score).toBe(84);
  });

  it("should give high score for fire-air signs", () => {
    const score = calculateOverallScore("leo", "libra");
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it("should give high score for earth-water signs", () => {
    const score = calculateOverallScore("taurus", "pisces");
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it("should give lower score for fire-water signs", () => {
    const score = calculateOverallScore("aries", "cancer");
    expect(score).toBeLessThanOrEqual(65);
  });

  it("should produce scores between 0 and 100", () => {
    const signs = Object.keys(ZODIAC_SIGNS);
    for (const s1 of signs) {
      for (const s2 of signs) {
        const score = calculateOverallScore(s1, s2);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });

  it("should be symmetric", () => {
    const signs = Object.keys(ZODIAC_SIGNS);
    for (const s1 of signs) {
      for (const s2 of signs) {
        expect(calculateOverallScore(s1, s2)).toBe(calculateOverallScore(s2, s1));
      }
    }
  });
});

describe("Compatibility Engine - All 12 Signs Coverage", () => {
  const signs = Object.keys(ZODIAC_SIGNS);

  it("should have exactly 12 zodiac signs", () => {
    expect(signs).toHaveLength(12);
  });

  it("should have valid element for each sign", () => {
    for (const sign of signs) {
      expect(["fire", "earth", "air", "water"]).toContain(ZODIAC_SIGNS[sign].element);
    }
  });

  it("should have valid modality for each sign", () => {
    for (const sign of signs) {
      expect(["cardinal", "fixed", "mutable"]).toContain(ZODIAC_SIGNS[sign].modality);
    }
  });

  it("should have valid polarity for each sign", () => {
    for (const sign of signs) {
      expect(["masculine", "feminine"]).toContain(ZODIAC_SIGNS[sign].polarity);
    }
  });

  it("should have 3 fire signs", () => {
    expect(signs.filter(s => ZODIAC_SIGNS[s].element === "fire")).toHaveLength(3);
  });

  it("should have 3 earth signs", () => {
    expect(signs.filter(s => ZODIAC_SIGNS[s].element === "earth")).toHaveLength(3);
  });

  it("should have 3 air signs", () => {
    expect(signs.filter(s => ZODIAC_SIGNS[s].element === "air")).toHaveLength(3);
  });

  it("should have 3 water signs", () => {
    expect(signs.filter(s => ZODIAC_SIGNS[s].element === "water")).toHaveLength(3);
  });

  it("should have 4 cardinal signs", () => {
    expect(signs.filter(s => ZODIAC_SIGNS[s].modality === "cardinal")).toHaveLength(4);
  });

  it("should have 4 fixed signs", () => {
    expect(signs.filter(s => ZODIAC_SIGNS[s].modality === "fixed")).toHaveLength(4);
  });

  it("should have 4 mutable signs", () => {
    expect(signs.filter(s => ZODIAC_SIGNS[s].modality === "mutable")).toHaveLength(4);
  });
});

// ========== Deep Analysis Parsing Tests ==========
describe("Compatibility Report - Deep Analysis Parsing", () => {
  const sampleAnalysis = `## 💫 宇宙连接概览
这两个星座之间存在着深层的宇宙连接。

## 🔥 激情与身体化学反应
火元素与风元素的结合创造了强烈的化学反应。

## 💕 情感共鸣与爱的语言
他们在情感表达上有着天然的默契。

## 🗣️ 沟通与智性纽带
沟通是这段关系的强项。

## 🤝 信任与忠诚动态
信任需要时间来建立。

## 🌱 共同成长与进化
两人在成长道路上相互促进。

## ⚡ 冲突模式与化解之道
冲突主要来自于不同的处事方式。

## 🏠 长期相处与家庭和谐
长期来看，这段关系有很好的发展潜力。

## 🌙 阴影工作与隐藏挑战
需要注意的隐藏挑战包括沟通中的误解。

## ✨ 宇宙祝福与指引
宇宙给予这段关系特别的祝福。`;

  // Simple section detection test
  const sectionPatterns: Array<{ key: string; patterns: RegExp[] }> = [
    { key: "cosmic", patterns: [/宇宙连接/i, /cosmic\s*connection/i, /💫/] },
    { key: "passion", patterns: [/激情/i, /身体化学/i, /passion.*physical/i, /🔥/] },
    { key: "emotional", patterns: [/情感共鸣/i, /爱的语言/i, /emotional\s*resonance/i, /💕/] },
    { key: "communication", patterns: [/沟通与智性/i, /communication.*intellectual/i, /🗣️/] },
    { key: "trust", patterns: [/信任与忠诚/i, /trust.*loyalty/i, /🤝/] },
    { key: "growth", patterns: [/共同成长/i, /growth.*evolution/i, /🌱/] },
    { key: "conflict", patterns: [/冲突模式/i, /conflict.*pattern/i, /⚡/] },
    { key: "longterm", patterns: [/长期相处/i, /long.?term/i, /🏠/] },
    { key: "shadow", patterns: [/阴影工作/i, /shadow\s*work/i, /🌙/] },
    { key: "blessing", patterns: [/宇宙祝福/i, /cosmic\s*blessing/i, /✨/] },
  ];

  function detectSection(line: string): string | null {
    for (const sp of sectionPatterns) {
      for (const pattern of sp.patterns) {
        if (pattern.test(line)) return sp.key;
      }
    }
    return null;
  }

  it("should detect all 10 section headers", () => {
    const lines = sampleAnalysis.split("\n").filter(l => l.startsWith("##"));
    const detected = lines.map(l => detectSection(l)).filter(Boolean);
    expect(detected).toHaveLength(10);
  });

  it("should detect cosmic section", () => {
    expect(detectSection("## 💫 宇宙连接概览")).toBe("cosmic");
  });

  it("should detect passion section", () => {
    expect(detectSection("## 🔥 激情与身体化学反应")).toBe("passion");
  });

  it("should detect emotional section", () => {
    expect(detectSection("## 💕 情感共鸣与爱的语言")).toBe("emotional");
  });

  it("should detect communication section", () => {
    expect(detectSection("## 🗣️ 沟通与智性纽带")).toBe("communication");
  });

  it("should detect trust section", () => {
    expect(detectSection("## 🤝 信任与忠诚动态")).toBe("trust");
  });

  it("should detect growth section", () => {
    expect(detectSection("## 🌱 共同成长与进化")).toBe("growth");
  });

  it("should detect conflict section", () => {
    expect(detectSection("## ⚡ 冲突模式与化解之道")).toBe("conflict");
  });

  it("should detect longterm section", () => {
    expect(detectSection("## 🏠 长期相处与家庭和谐")).toBe("longterm");
  });

  it("should detect shadow section", () => {
    expect(detectSection("## 🌙 阴影工作与隐藏挑战")).toBe("shadow");
  });

  it("should detect blessing section", () => {
    expect(detectSection("## ✨ 宇宙祝福与指引")).toBe("blessing");
  });

  // English headers
  it("should detect English cosmic section", () => {
    expect(detectSection("## Cosmic Connection Overview")).toBe("cosmic");
  });

  it("should detect English passion section", () => {
    expect(detectSection("## Passion & Physical Chemistry")).toBe("passion");
  });

  it("should detect English trust section", () => {
    expect(detectSection("## Trust & Loyalty Dynamics")).toBe("trust");
  });

  it("should detect English shadow section", () => {
    expect(detectSection("## Shadow Work & Hidden Challenges")).toBe("shadow");
  });
});

// ========== Products Tests ==========
describe("Compatibility Product Configuration", () => {
  it("should have COMPATIBILITY_SINGLE product defined", async () => {
    const { PRODUCTS } = await import("./products");
    expect(PRODUCTS.COMPATIBILITY_SINGLE).toBeDefined();
    expect(PRODUCTS.COMPATIBILITY_SINGLE.price).toBe(299);
    expect(PRODUCTS.COMPATIBILITY_SINGLE.featureType).toBe("compatibility");
  });

  it("should have correct product structure", async () => {
    const { PRODUCTS } = await import("./products");
    const product = PRODUCTS.COMPATIBILITY_SINGLE;
    expect(product.id).toBe("compatibility_single");
    expect(product.currency).toBe("usd");
    expect(product.interval).toBe("one_time");
    expect(product.credits).toBe(1);
  });
});

// ========== Score Label Tests ==========
describe("Compatibility Score Labels", () => {
  function getScoreLabel(score: number, isEn: boolean) {
    if (score >= 90) return isEn ? "Soulmate" : "灵魂伴侣";
    if (score >= 80) return isEn ? "Excellent" : "极佳";
    if (score >= 70) return isEn ? "Great" : "很好";
    if (score >= 60) return isEn ? "Good" : "良好";
    if (score >= 50) return isEn ? "Moderate" : "一般";
    return isEn ? "Challenging" : "需要磨合";
  }

  it("should return Soulmate for 90+", () => {
    expect(getScoreLabel(95, true)).toBe("Soulmate");
    expect(getScoreLabel(90, false)).toBe("灵魂伴侣");
  });

  it("should return Excellent for 80-89", () => {
    expect(getScoreLabel(85, true)).toBe("Excellent");
    expect(getScoreLabel(80, false)).toBe("极佳");
  });

  it("should return Great for 70-79", () => {
    expect(getScoreLabel(75, true)).toBe("Great");
    expect(getScoreLabel(70, false)).toBe("很好");
  });

  it("should return Good for 60-69", () => {
    expect(getScoreLabel(65, true)).toBe("Good");
    expect(getScoreLabel(60, false)).toBe("良好");
  });

  it("should return Moderate for 50-59", () => {
    expect(getScoreLabel(55, true)).toBe("Moderate");
    expect(getScoreLabel(50, false)).toBe("一般");
  });

  it("should return Challenging for below 50", () => {
    expect(getScoreLabel(40, true)).toBe("Challenging");
    expect(getScoreLabel(30, false)).toBe("需要磨合");
  });
});

// ========== Famous Compatibility Pairs ==========
describe("Compatibility - Famous Zodiac Pairs", () => {
  it("Aries + Leo (fire-fire) should have high compatibility", () => {
    const score = calculateOverallScore("aries", "leo");
    expect(score).toBeGreaterThanOrEqual(65);
  });

  it("Taurus + Cancer (earth-water) should have high compatibility", () => {
    const score = calculateOverallScore("taurus", "cancer");
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it("Gemini + Sagittarius (air-fire) should have high compatibility", () => {
    const score = calculateOverallScore("gemini", "sagittarius");
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it("Scorpio + Pisces (water-water) should have high compatibility", () => {
    const score = calculateOverallScore("scorpio", "pisces");
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it("Same sign should have moderate-to-high compatibility", () => {
    const signs = Object.keys(ZODIAC_SIGNS);
    for (const sign of signs) {
      const score = calculateOverallScore(sign, sign);
      expect(score).toBeGreaterThanOrEqual(60);
    }
  });
});
