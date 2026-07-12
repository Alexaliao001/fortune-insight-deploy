import { describe, expect, it } from "vitest";
import { z } from "zod";

// 八字对话输入验证schema
const baziChatInputSchema = z.object({
  message: z.string().min(1).max(500),
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
});

describe("bazi.chat", () => {
  describe("input validation", () => {
    it("accepts valid chat input with all fields", () => {
      const input = {
        message: "今年的事业运势如何？",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        birthHour: 10,
        gender: "female" as const,
        previousReport: "这是之前的八字分析报告...",
        chatHistory: [
          { role: "user" as const, content: "你好" },
          { role: "assistant" as const, content: "你好！有什么可以帮助您的？" },
        ],
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("accepts valid chat input with minimal fields", () => {
      const input = {
        message: "请问我的财运如何？",
        birthYear: 1985,
        birthMonth: 12,
        birthDay: 25,
        previousReport: "八字分析报告内容...",
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("rejects empty message", () => {
      const input = {
        message: "",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        previousReport: "报告内容",
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("rejects message exceeding 500 characters", () => {
      const input = {
        message: "a".repeat(501),
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        previousReport: "报告内容",
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("accepts valid gender values", () => {
      const maleInput = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        gender: "male" as const,
        previousReport: "报告",
      };

      const femaleInput = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        gender: "female" as const,
        previousReport: "报告",
      };

      expect(baziChatInputSchema.safeParse(maleInput).success).toBe(true);
      expect(baziChatInputSchema.safeParse(femaleInput).success).toBe(true);
    });

    it("rejects invalid gender values", () => {
      const input = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        gender: "other",
        previousReport: "报告",
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("chat history validation", () => {
    it("accepts valid chat history", () => {
      const input = {
        message: "继续问",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        previousReport: "报告",
        chatHistory: [
          { role: "user" as const, content: "第一个问题" },
          { role: "assistant" as const, content: "第一个回答" },
          { role: "user" as const, content: "第二个问题" },
          { role: "assistant" as const, content: "第二个回答" },
        ],
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("accepts empty chat history", () => {
      const input = {
        message: "第一个问题",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        previousReport: "报告",
        chatHistory: [],
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("rejects invalid role in chat history", () => {
      const input = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        previousReport: "报告",
        chatHistory: [
          { role: "system", content: "系统消息" },
        ],
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("birth info validation", () => {
    it("accepts valid birth year range", () => {
      const currentYear = new Date().getFullYear();
      
      const input1990 = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 1,
        previousReport: "报告",
      };

      const input2020 = {
        message: "测试",
        birthYear: 2020,
        birthMonth: 1,
        birthDay: 1,
        previousReport: "报告",
      };

      expect(baziChatInputSchema.safeParse(input1990).success).toBe(true);
      expect(baziChatInputSchema.safeParse(input2020).success).toBe(true);
    });

    it("accepts valid birth month range (1-12)", () => {
      const inputJan = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 1,
        previousReport: "报告",
      };

      const inputDec = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 12,
        birthDay: 1,
        previousReport: "报告",
      };

      expect(baziChatInputSchema.safeParse(inputJan).success).toBe(true);
      expect(baziChatInputSchema.safeParse(inputDec).success).toBe(true);
    });

    it("accepts valid birth day range (1-31)", () => {
      const inputDay1 = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 1,
        previousReport: "报告",
      };

      const inputDay31 = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 31,
        previousReport: "报告",
      };

      expect(baziChatInputSchema.safeParse(inputDay1).success).toBe(true);
      expect(baziChatInputSchema.safeParse(inputDay31).success).toBe(true);
    });

    it("accepts optional birth hour (0-23)", () => {
      const inputHour0 = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 1,
        birthHour: 0,
        previousReport: "报告",
      };

      const inputHour23 = {
        message: "测试",
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 1,
        birthHour: 23,
        previousReport: "报告",
      };

      expect(baziChatInputSchema.safeParse(inputHour0).success).toBe(true);
      expect(baziChatInputSchema.safeParse(inputHour23).success).toBe(true);
    });
  });
});

describe("quick questions", () => {
  const quickQuestions = [
    "今年的事业运势如何？",
    "我适合什么类型的工作？",
    "感情方面需要注意什么？",
    "如何发挥我的天赋优势？",
    "今年有什么需要特别注意的？",
    "我的财运怎么样？",
  ];

  it("all quick questions are within valid length", () => {
    quickQuestions.forEach((q) => {
      expect(q.length).toBeGreaterThan(0);
      expect(q.length).toBeLessThanOrEqual(500);
    });
  });

  it("quick questions are valid input messages", () => {
    quickQuestions.forEach((q) => {
      const input = {
        message: q,
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        previousReport: "八字分析报告",
      };

      const result = baziChatInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
