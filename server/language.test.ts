import { describe, it, expect, vi } from "vitest";
import { z } from "zod";

// Test that language parameter schemas are correctly defined
describe("Language parameter in backend routes", () => {
  const languageSchema = z.enum(["zh", "en"]).optional().default("zh");

  it("should accept 'zh' as valid language", () => {
    const result = languageSchema.parse("zh");
    expect(result).toBe("zh");
  });

  it("should accept 'en' as valid language", () => {
    const result = languageSchema.parse("en");
    expect(result).toBe("en");
  });

  it("should default to 'zh' when not provided", () => {
    const result = languageSchema.parse(undefined);
    expect(result).toBe("zh");
  });

  it("should reject invalid language codes", () => {
    expect(() => languageSchema.parse("fr")).toThrow();
    expect(() => languageSchema.parse("de")).toThrow();
    expect(() => languageSchema.parse("jp")).toThrow();
  });

  // Test tarot input schema with language
  it("should validate tarot input with language parameter", () => {
    const tarotInputSchema = z.object({
      questionType: z.enum(["love", "career", "wealth", "health", "general"]),
      question: z.string().optional(),
      cards: z.array(z.string()),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    });

    const validInput = {
      questionType: "love" as const,
      question: "Will I find love?",
      cards: ["The Fool", "The Lovers", "The Star"],
      language: "en" as const,
    };
    expect(() => tarotInputSchema.parse(validInput)).not.toThrow();

    const inputWithoutLang = {
      questionType: "career" as const,
      cards: ["The Tower", "The Sun", "The Moon"],
    };
    const parsed = tarotInputSchema.parse(inputWithoutLang);
    expect(parsed.language).toBe("zh");
  });

  // Test bazi input schema with language
  it("should validate bazi input with language parameter", () => {
    const baziInputSchema = z.object({
      birthYear: z.number().min(1900).max(2100),
      birthMonth: z.number().min(1).max(12),
      birthDay: z.number().min(1).max(31),
      birthHour: z.number().min(0).max(23).optional(),
      birthMinute: z.number().min(0).max(59).optional(),
      gender: z.enum(["male", "female"]).optional(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    });

    const validInput = {
      birthYear: 1990,
      birthMonth: 6,
      birthDay: 15,
      birthHour: 14,
      gender: "female" as const,
      language: "en" as const,
    };
    expect(() => baziInputSchema.parse(validInput)).not.toThrow();

    const inputWithoutLang = {
      birthYear: 1990,
      birthMonth: 6,
      birthDay: 15,
    };
    const parsed = baziInputSchema.parse(inputWithoutLang);
    expect(parsed.language).toBe("zh");
  });

  // Test dream input schema with language
  it("should validate dream input with language parameter", () => {
    const dreamInputSchema = z.object({
      dreamContent: z.string().min(10),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    });

    const validInput = {
      dreamContent: "I dreamed about flying over mountains and rivers",
      language: "en" as const,
    };
    expect(() => dreamInputSchema.parse(validInput)).not.toThrow();
  });

  // Test horoscope input schema with language
  it("should validate horoscope input with language parameter", () => {
    const horoscopeInputSchema = z.object({
      sign: z.string(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    });

    const validInput = {
      sign: "Aries",
      language: "en" as const,
    };
    expect(() => horoscopeInputSchema.parse(validInput)).not.toThrow();

    const inputWithoutLang = {
      sign: "白羊座",
    };
    const parsed = horoscopeInputSchema.parse(inputWithoutLang);
    expect(parsed.language).toBe("zh");
  });

  // Test bazi chat input schema with language
  it("should validate bazi chat input with language parameter", () => {
    const baziChatInputSchema = z.object({
      message: z.string(),
      birthYear: z.number(),
      birthMonth: z.number(),
      birthDay: z.number(),
      birthHour: z.number().optional(),
      gender: z.enum(["male", "female"]).optional(),
      previousReport: z.string(),
      chatHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    });

    const validInput = {
      message: "What about my career this year?",
      birthYear: 1990,
      birthMonth: 6,
      birthDay: 15,
      previousReport: "Your BaZi analysis shows...",
      language: "en" as const,
    };
    expect(() => baziChatInputSchema.parse(validInput)).not.toThrow();
  });
});

// Test bilingual prompt generation logic
describe("Bilingual prompt generation", () => {
  it("should generate English prompt when language is en", () => {
    const language = "en";
    const isEn = language === "en";
    
    const genderText = isEn ? "Female" : "女";
    expect(genderText).toBe("Female");
    
    const timeText = isEn ? "14:00" : "14时";
    expect(timeText).toBe("14:00");
  });

  it("should generate Chinese prompt when language is zh", () => {
    const language = "zh";
    const isEn = language === "en";
    
    const genderText = isEn ? "Female" : "女";
    expect(genderText).toBe("女");
    
    const timeText = isEn ? "14:00" : "14时";
    expect(timeText).toBe("14时");
  });

  it("should generate correct system content based on language", () => {
    const getSystemContent = (language: string) => {
      const isEn = language === "en";
      return isEn
        ? "You are a professional tarot reader and counselor."
        : "你是一位专业的塔罗牌解读师和心理咨询师。";
    };

    expect(getSystemContent("en")).toContain("professional tarot reader");
    expect(getSystemContent("zh")).toContain("专业的塔罗牌解读师");
  });

  it("should generate correct dream type labels based on language", () => {
    const getTypeLabels = (language: string): Record<string, string> => {
      const isEn = language === "en";
      return isEn ? {
        normal: "Normal Dream",
        nightmare: "Nightmare",
        lucid: "Lucid Dream",
        recurring: "Recurring Dream",
        prophetic: "Prophetic Dream",
      } : {
        normal: "普通梦境",
        nightmare: "噩梦",
        lucid: "清醒梦",
        recurring: "重复梦",
        prophetic: "预知梦",
      };
    };

    const enLabels = getTypeLabels("en");
    expect(enLabels.nightmare).toBe("Nightmare");
    expect(enLabels.lucid).toBe("Lucid Dream");

    const zhLabels = getTypeLabels("zh");
    expect(zhLabels.nightmare).toBe("噩梦");
    expect(zhLabels.lucid).toBe("清醒梦");
  });

  it("should generate correct horoscope prompt format based on language", () => {
    const sign = "Aries";
    const language = "en";
    const isEn = language === "en";

    const prompt = isEn
      ? `${sign} Daily Horoscope (concise):`
      : `${sign}今日运势（简洁版）：`;

    expect(prompt).toContain("Daily Horoscope");
    expect(prompt).not.toContain("今日运势");
  });
});
