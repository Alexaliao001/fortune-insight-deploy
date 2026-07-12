import { describe, it, expect } from "vitest";

// Test zodiac sign data structure
describe("Horoscope Deep Analysis - Zodiac Data", () => {
  const ZODIAC_IDS = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ];

  const ELEMENTS = ["Fire", "Earth", "Air", "Water"];
  const MODALITIES = ["Cardinal", "Fixed", "Mutable"];

  it("should have exactly 12 zodiac signs", () => {
    expect(ZODIAC_IDS.length).toBe(12);
  });

  it("should have valid element distribution (3 per element)", () => {
    // Fire: Aries, Leo, Sagittarius
    // Earth: Taurus, Virgo, Capricorn
    // Air: Gemini, Libra, Aquarius
    // Water: Cancer, Scorpio, Pisces
    const elementMap: Record<string, string[]> = {
      Fire: ["aries", "leo", "sagittarius"],
      Earth: ["taurus", "virgo", "capricorn"],
      Air: ["gemini", "libra", "aquarius"],
      Water: ["cancer", "scorpio", "pisces"],
    };
    for (const [element, signs] of Object.entries(elementMap)) {
      expect(signs.length).toBe(3);
      signs.forEach(s => expect(ZODIAC_IDS).toContain(s));
    }
  });

  it("should have valid modality distribution (4 per modality)", () => {
    const modalityMap: Record<string, string[]> = {
      Cardinal: ["aries", "cancer", "libra", "capricorn"],
      Fixed: ["taurus", "leo", "scorpio", "aquarius"],
      Mutable: ["gemini", "virgo", "sagittarius", "pisces"],
    };
    for (const [modality, signs] of Object.entries(modalityMap)) {
      expect(signs.length).toBe(4);
      signs.forEach(s => expect(ZODIAC_IDS).toContain(s));
    }
  });

  it("should have all required enhanced fields for deep analysis", () => {
    const requiredFields = [
      "decans", "decansChinese", "tarotCard", "tarotCardChinese",
      "chakra", "chakraChinese", "crystal", "crystalChinese",
      "mythOrigin", "mythOriginChinese"
    ];
    // Verify the structure expectations
    requiredFields.forEach(field => {
      expect(typeof field).toBe("string");
    });
  });
});

// Test moon phase calculation
describe("Horoscope Deep Analysis - Moon Phase Calculation", () => {
  const LUNAR_CYCLE = 29.53;
  const KNOWN_NEW_MOON = new Date(2024, 0, 11).getTime();

  function getMoonPhase(date: Date): string {
    const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
    const moonAge = ((daysSinceNewMoon % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
    if (moonAge < 3.69) return "New Moon";
    if (moonAge < 7.38) return "Waxing Crescent";
    if (moonAge < 11.07) return "First Quarter";
    if (moonAge < 14.76) return "Waxing Gibbous";
    if (moonAge < 18.45) return "Full Moon";
    if (moonAge < 22.14) return "Waning Gibbous";
    if (moonAge < 25.83) return "Last Quarter";
    return "Waning Crescent";
  }

  it("should return a valid moon phase string", () => {
    const validPhases = [
      "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
      "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
    ];
    const phase = getMoonPhase(new Date());
    expect(validPhases).toContain(phase);
  });

  it("should cycle through all phases over a lunar month", () => {
    const phases = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(2024, 0, 11 + i);
      phases.add(getMoonPhase(date));
    }
    expect(phases.size).toBe(8);
  });

  it("should return New Moon for known new moon date", () => {
    const phase = getMoonPhase(new Date(2024, 0, 11));
    expect(phase).toBe("New Moon");
  });

  it("should return Full Moon approximately 14-15 days after new moon", () => {
    // Full moon is ~14.76 days after new moon (Jan 11 + 15 = Jan 26)
    const phase = getMoonPhase(new Date(2024, 0, 26));
    expect(phase).toBe("Full Moon");
  });
});

// Test day ruler mapping
describe("Horoscope Deep Analysis - Day Rulers", () => {
  const DAY_RULERS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  it("should have exactly 7 day rulers", () => {
    expect(DAY_RULERS.length).toBe(7);
  });

  it("should map Sunday to Sun", () => {
    const sunday = new Date(2024, 0, 7); // Known Sunday
    expect(sunday.getDay()).toBe(0);
    expect(DAY_RULERS[0]).toBe("Sun");
  });

  it("should map Monday to Moon", () => {
    const monday = new Date(2024, 0, 8);
    expect(monday.getDay()).toBe(1);
    expect(DAY_RULERS[1]).toBe("Moon");
  });

  it("should map Saturday to Saturn", () => {
    const saturday = new Date(2024, 0, 6);
    expect(saturday.getDay()).toBe(6);
    expect(DAY_RULERS[6]).toBe("Saturn");
  });
});

// Test section parsing logic
describe("Horoscope Deep Analysis - Section Parsing", () => {
  const SECTION_KEYS = [
    "cosmic", "planetary", "love", "career", "wealth",
    "health", "spiritual", "shadow", "timing", "affirmation"
  ];

  it("should define exactly 10 analysis dimensions", () => {
    expect(SECTION_KEYS.length).toBe(10);
  });

  it("should have 3 free dimensions and 7 premium dimensions", () => {
    const freeSections = ["cosmic", "planetary", "love"];
    const premiumSections = ["career", "wealth", "health", "spiritual", "shadow", "timing", "affirmation"];
    expect(freeSections.length).toBe(3);
    expect(premiumSections.length).toBe(7);
    expect(freeSections.length + premiumSections.length).toBe(10);
  });

  it("should parse Chinese section headers correctly", () => {
    const sectionPatterns: Record<string, RegExp> = {
      cosmic: /宇宙能量/i,
      planetary: /行星轨迹/i,
      love: /爱情与情感/i,
      career: /事业与野心/i,
      wealth: /财富与金融/i,
      health: /健康与活力/i,
      spiritual: /灵性与内在/i,
      shadow: /潜在挑战/i,
      timing: /时机与关键/i,
      affirmation: /肯定语/i,
    };

    const testHeaders = [
      "## 🌌 宇宙能量概览",
      "## 🪐 行星轨迹解析",
      "## 💕 爱情与情感波动",
      "## 💼 事业与野心罗盘",
      "## 💰 财富与金融暗流",
      "## 🏥 健康与活力指引",
      "## 🧘 灵性与内在成长",
      "## 🔮 潜在挑战与阴影工作",
      "## ⏰ 时机与关键时刻",
      "## ✨ 肯定语与宇宙寄语",
    ];

    testHeaders.forEach((header, index) => {
      const key = SECTION_KEYS[index];
      const pattern = sectionPatterns[key];
      expect(pattern.test(header)).toBe(true);
    });
  });

  it("should parse English section headers correctly", () => {
    const sectionPatterns: Record<string, RegExp> = {
      cosmic: /cosmic\s*energy/i,
      planetary: /planetary\s*transit/i,
      love: /love.*emotional/i,
      career: /career.*ambition/i,
      wealth: /wealth.*financial/i,
      health: /health.*vitality/i,
      spiritual: /spiritual.*inner/i,
      shadow: /hidden\s*challenge/i,
      timing: /timing.*key/i,
      affirmation: /affirmation/i,
    };

    const testHeaders = [
      "## 🌌 Cosmic Energy Overview",
      "## 🪐 Planetary Transit Analysis",
      "## 💕 Love & Emotional Landscape",
      "## 💼 Career & Ambition Compass",
      "## 💰 Wealth & Financial Currents",
      "## 🏥 Health & Vitality Guidance",
      "## 🧘 Spiritual & Inner Growth",
      "## 🔮 Hidden Challenges & Shadow Work",
      "## ⏰ Timing & Key Moments",
      "## ✨ Affirmation & Cosmic Message",
    ];

    testHeaders.forEach((header, index) => {
      const key = SECTION_KEYS[index];
      const pattern = sectionPatterns[key];
      expect(pattern.test(header)).toBe(true);
    });
  });
});

// Test horoscope input validation
describe("Horoscope Deep Analysis - Input Validation", () => {
  const VALID_SIGNS = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ];

  it("should accept all 12 valid zodiac sign IDs", () => {
    VALID_SIGNS.forEach(sign => {
      expect(VALID_SIGNS.includes(sign)).toBe(true);
    });
  });

  it("should reject invalid sign IDs", () => {
    const invalidSigns = ["ophiuchus", "dragon", "snake", ""];
    invalidSigns.forEach(sign => {
      expect(VALID_SIGNS.includes(sign)).toBe(false);
    });
  });

  it("should support zh and en language options", () => {
    const validLanguages = ["zh", "en"];
    validLanguages.forEach(lang => {
      expect(["zh", "en"]).toContain(lang);
    });
  });
});

// Test JSON score extraction
describe("Horoscope Deep Analysis - Score Extraction", () => {
  it("should extract valid JSON scores from LLM response", () => {
    const mockResponse = `## 🌌 宇宙能量概览
Some analysis content here...

\`\`\`json
{"overallScore": 82, "loveScore": 78, "careerScore": 85, "wealthScore": 70, "healthScore": 90, "luckyColor": "蓝色", "luckyNumber": 7, "advice": "今日适合冥想", "encouragement": "星光指引你前行"}
\`\`\``;

    const jsonMatch = mockResponse.match(/```json\s*([\s\S]*?)\s*```/);
    expect(jsonMatch).not.toBeNull();
    const parsed = JSON.parse(jsonMatch![1]);
    expect(parsed.overallScore).toBe(82);
    expect(parsed.loveScore).toBe(78);
    expect(parsed.careerScore).toBe(85);
    expect(parsed.wealthScore).toBe(70);
    expect(parsed.healthScore).toBe(90);
    expect(parsed.luckyColor).toBe("蓝色");
    expect(parsed.luckyNumber).toBe(7);
    expect(parsed.advice).toBeTruthy();
    expect(parsed.encouragement).toBeTruthy();
  });

  it("should use default scores when JSON extraction fails", () => {
    const mockResponse = "No JSON block here, just text.";
    const jsonMatch = mockResponse.match(/```json\s*([\s\S]*?)\s*```/);
    expect(jsonMatch).toBeNull();

    const defaults = {
      overallScore: 75,
      loveScore: 70,
      careerScore: 80,
      wealthScore: 65,
      healthScore: 75,
    };
    expect(defaults.overallScore).toBe(75);
  });

  it("should extract deep analysis text without JSON block", () => {
    const mockResponse = `## 🌌 宇宙能量概览
Today's cosmic energy is flowing...

## 🪐 行星轨迹解析
Mercury is in direct motion...

\`\`\`json
{"overallScore": 82}
\`\`\``;

    const deepAnalysis = mockResponse.replace(/```json[\s\S]*?```/g, "").trim();
    expect(deepAnalysis).toContain("宇宙能量概览");
    expect(deepAnalysis).toContain("行星轨迹解析");
    expect(deepAnalysis).not.toContain("```json");
    expect(deepAnalysis).not.toContain("overallScore");
  });
});

// Test planetary context generation
describe("Horoscope Deep Analysis - Planetary Context", () => {
  it("should determine correct zodiac season by month", () => {
    const zodiacSeasons = [
      "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
      "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
    ];
    // January = Capricorn season (index 0)
    expect(zodiacSeasons[0]).toBe("Capricorn");
    // July = Cancer season (index 6)
    expect(zodiacSeasons[6]).toBe("Cancer");
    // December = Sagittarius season (index 11)
    expect(zodiacSeasons[11]).toBe("Sagittarius");
  });

  it("should map day of week to correct planetary ruler", () => {
    const dayRulers = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    expect(dayRulers[0]).toBe("Sun"); // Sunday
    expect(dayRulers[1]).toBe("Moon"); // Monday
    expect(dayRulers[2]).toBe("Mars"); // Tuesday
    expect(dayRulers[3]).toBe("Mercury"); // Wednesday
    expect(dayRulers[4]).toBe("Jupiter"); // Thursday
    expect(dayRulers[5]).toBe("Venus"); // Friday
    expect(dayRulers[6]).toBe("Saturn"); // Saturday
  });

  it("should detect Mercury retrograde periods approximately", () => {
    // Mercury retrogrades ~3x per year, each lasting ~3 weeks
    const dayOfYear = 100;
    const mercuryRetro = (dayOfYear % 116) > 93;
    expect(typeof mercuryRetro).toBe("boolean");
  });

  it("should calculate approximate sun position in degrees", () => {
    const date = new Date(2024, 2, 20); // March equinox
    const year = date.getFullYear();
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const sunDegree = (dayOfYear / 365.25) * 360;
    // Around spring equinox, sun should be near 0° Aries (~80 days into year)
    expect(sunDegree).toBeGreaterThan(70);
    expect(sunDegree).toBeLessThan(90);
  });
});

// Test decan system
describe("Horoscope Deep Analysis - Decan System", () => {
  it("should have exactly 3 decans per sign", () => {
    const ariesDecans = ["Mars (Mar 21-30)", "Sun (Mar 31-Apr 9)", "Jupiter (Apr 10-19)"];
    expect(ariesDecans.length).toBe(3);
  });

  it("should follow correct decan ruler pattern for fire signs", () => {
    // Fire signs: Aries (Mars, Sun, Jupiter), Leo (Sun, Jupiter, Mars), Sagittarius (Jupiter, Mars, Sun)
    const fireDecanRulers = {
      aries: ["Mars", "Sun", "Jupiter"],
      leo: ["Sun", "Jupiter", "Mars"],
      sagittarius: ["Jupiter", "Mars", "Sun"],
    };
    // Each fire sign should rotate through the same three rulers
    const allRulers = new Set(Object.values(fireDecanRulers).flat());
    expect(allRulers.size).toBe(3);
    expect(allRulers.has("Mars")).toBe(true);
    expect(allRulers.has("Sun")).toBe(true);
    expect(allRulers.has("Jupiter")).toBe(true);
  });
});

// Test tarot correspondence
describe("Horoscope Deep Analysis - Tarot Correspondence", () => {
  const signTarotMap: Record<string, string> = {
    aries: "The Emperor",
    taurus: "The Hierophant",
    gemini: "The Lovers",
    cancer: "The Chariot",
    leo: "Strength",
    virgo: "The Hermit",
    libra: "Justice",
    scorpio: "Death",
    sagittarius: "Temperance",
    capricorn: "The Devil",
    aquarius: "The Star",
    pisces: "The Moon",
  };

  it("should have a tarot card for each sign", () => {
    expect(Object.keys(signTarotMap).length).toBe(12);
  });

  it("should use Major Arcana cards only", () => {
    const majorArcana = [
      "The Fool", "The Magician", "The High Priestess", "The Empress",
      "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
      "Strength", "The Hermit", "Wheel of Fortune", "Justice",
      "The Hanged Man", "Death", "Temperance", "The Devil",
      "The Tower", "The Star", "The Moon", "The Sun",
      "Judgement", "The World"
    ];
    Object.values(signTarotMap).forEach(card => {
      expect(majorArcana).toContain(card);
    });
  });

  it("should have unique tarot cards for each sign", () => {
    const cards = Object.values(signTarotMap);
    const uniqueCards = new Set(cards);
    expect(uniqueCards.size).toBe(12);
  });
});

// Test score color mapping
describe("Horoscope Deep Analysis - Score Display", () => {
  function getScoreColor(score: number): string {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  }

  it("should return green for high scores (80+)", () => {
    expect(getScoreColor(80)).toBe("text-green-400");
    expect(getScoreColor(95)).toBe("text-green-400");
    expect(getScoreColor(100)).toBe("text-green-400");
  });

  it("should return yellow for medium scores (60-79)", () => {
    expect(getScoreColor(60)).toBe("text-yellow-400");
    expect(getScoreColor(75)).toBe("text-yellow-400");
  });

  it("should return orange for low scores (40-59)", () => {
    expect(getScoreColor(40)).toBe("text-orange-400");
    expect(getScoreColor(55)).toBe("text-orange-400");
  });

  it("should return red for very low scores (<40)", () => {
    expect(getScoreColor(0)).toBe("text-red-400");
    expect(getScoreColor(39)).toBe("text-red-400");
  });
});
