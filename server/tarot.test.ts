import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { invokeLLM } from "./_core/llm";
import { consumeUsage } from "./db";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            overview: "This is a test reading overview",
            cardInterpretations: [
              { cardName: "The Fool", position: "Past", interpretation: "New beginnings" },
              { cardName: "The Magician", position: "Present", interpretation: "Manifestation" },
              { cardName: "The High Priestess", position: "Future", interpretation: "Intuition" },
            ],
            synthesis: "Overall synthesis of the reading",
            advice: "Practical advice for the querent",
            affirmation: "A positive affirmation",
          }),
        },
      },
    ],
  }),
}));

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
  }),
  getUsageStatus: vi.fn().mockResolvedValue({ canUse: true, used: 0, limit: 3 }),
  consumeUsage: vi.fn().mockResolvedValue(undefined),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("tarot.getReading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a tarot reading for valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tarot.getReading({
      questionType: "love",
      question: "How is my love life?",
    });

    expect(result).toBeDefined();
    expect(result.reading).toBeDefined();
    expect(result.cards).toBeDefined();
    expect(Array.isArray(result.cards)).toBe(true);
  });

  it("should accept different question types", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const questionTypes = ["love", "career", "wealth", "health", "general"] as const;

    for (const questionType of questionTypes) {
      const result = await caller.tarot.getReading({
        questionType,
      });

      expect(result).toBeDefined();
      expect(result.reading).toBeDefined();
      expect(result.spread).toBeDefined();
    }
  });

  it("should work without a specific question", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tarot.getReading({
      questionType: "general",
    });

    expect(result).toBeDefined();
    expect(result.reading).toBeDefined();
    expect(result.cards).toBeDefined();
  });

  it("should accept a specific spread type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tarot.getReading({
      questionType: "love",
      spreadId: "three-card",
    });

    expect(result).toBeDefined();
    expect(result.spread).toBeDefined();
  });

  it("returns daily-limit degradation without consuming authenticated usage", async () => {
    vi.mocked(invokeLLM).mockResolvedValueOnce({
      id: "daily-limit",
      created: 0,
      model: "none",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content:
              "Today's AI interpretation quota has been reached. You can still view the basic calculated result; please return tomorrow. This attempt does not consume your usage allowance.",
          },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      degradation: {
        code: "LLM_DAILY_LIMIT",
        source: "daily_limit",
        message:
          "Today's AI interpretation quota has been reached. You can still view the basic calculated result; please return tomorrow. This attempt does not consume your usage allowance.",
        retryAt: "2026-07-17T00:00:00.000Z",
        dailyLimit: 200,
      },
    });

    const result = await appRouter.createCaller(createAuthContext()).tarot.getReading({
      questionType: "general",
      language: "en",
    });

    expect(result.source).toBe("daily_limit");
    expect(result.degradation?.code).toBe("LLM_DAILY_LIMIT");
    expect(consumeUsage).not.toHaveBeenCalled();
  });
});
