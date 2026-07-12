import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: `## 🌙 梦境概述
这是一个关于飞翔的美好梦境，象征着自由和超越。

## 🔮 符号解析
飞翔代表着对自由的渴望和对现实束缚的超越。

## 🧠 心理学视角
从荣格心理学角度，飞翔梦通常反映了自我实现的渴望。

## 🌟 人生启示
这个梦提示您可能正在寻求突破和成长。

## 🌱 成长建议
建议您关注内心的真实渴望，勇敢追求自己的目标。`,
        },
      },
    ],
  }),
}));

// Mock database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue({}),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    }),
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(authenticated = false): TrpcContext {
  const user: AuthenticatedUser | null = authenticated
    ? {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("dream.interpret", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should interpret a dream successfully", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.interpret({
      dreamContent: "我梦见自己在天空中飞翔，感觉非常自由和快乐",
      emotions: ["快乐", "自由"],
      keyElements: ["飞翔", "天空"],
      dreamType: "normal",
      clarity: 4,
    });

    expect(result).toHaveProperty("interpretation");
    expect(result.interpretation).toContain("梦境概述");
    expect(result.interpretation).toContain("符号解析");
    expect(result.interpretation).toContain("心理学视角");
  });

  it("should accept dream with title", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.interpret({
      title: "飞翔之梦",
      dreamContent: "我梦见自己在天空中飞翔，俯瞰大地",
      dreamType: "lucid",
    });

    expect(result).toHaveProperty("interpretation");
    expect(typeof result.interpretation).toBe("string");
  });

  it("should reject dream content that is too short", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.dream.interpret({
        dreamContent: "短梦",
      })
    ).rejects.toThrow();
  });

  it("should handle nightmare type", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.interpret({
      dreamContent: "我梦见被什么东西追逐，非常害怕，一直在逃跑",
      emotions: ["恐惧", "焦虑"],
      keyElements: ["追逐", "逃跑"],
      dreamType: "nightmare",
      clarity: 3,
    });

    expect(result).toHaveProperty("interpretation");
  });

  it("should handle recurring dream type", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.interpret({
      dreamContent: "我经常梦见自己在考试，但是什么都不会，非常焦虑",
      emotions: ["焦虑", "困惑"],
      keyElements: ["考试", "失败"],
      dreamType: "recurring",
    });

    expect(result).toHaveProperty("interpretation");
  });
});

describe("dream.getHistory", () => {
  it("should require authentication", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dream.getHistory()).rejects.toThrow();
  });

  it("should return empty array for authenticated user with no dreams", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.getHistory();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("dream.getById", () => {
  it("should require authentication", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dream.getById({ id: 1 })).rejects.toThrow();
  });

  it("should return null for non-existent dream", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.getById({ id: 999 });
    expect(result).toBeNull();
  });
});
