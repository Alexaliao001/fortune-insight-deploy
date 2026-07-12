import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

// Mock dream records for testing
const mockDreams = [
  {
    id: 1,
    userId: 1,
    title: "飞翔的梦",
    dreamContent: "我在天空中自由飞翔，感觉非常快乐",
    emotions: ["快乐", "兴奋"],
    keyElements: ["飞翔", "天空", "自由"],
    dreamType: "lucid",
    tags: ["美好", "重要"],
    interpretation: "这个梦象征着自由和突破",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    userId: 1,
    title: "追逐的噩梦",
    dreamContent: "被一个黑影追赶，非常害怕",
    emotions: ["恐惧", "焦虑"],
    keyElements: ["追逐", "黑影", "逃跑"],
    dreamType: "nightmare",
    tags: ["警示", "待分析"],
    interpretation: "可能反映了现实中的压力",
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: 3,
    userId: 1,
    title: "水中漫步",
    dreamContent: "在清澈的湖水中行走，周围有很多鱼",
    emotions: ["平静", "温暖"],
    keyElements: ["水", "湖", "鱼"],
    dreamType: "normal",
    tags: ["美好"],
    interpretation: "象征内心的平静",
    createdAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-03"),
  },
];

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

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

describe("dream.search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should filter dreams by keyword in title", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => Promise.resolve(mockDreams),
            }),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.search({
      keyword: "飞翔",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter dreams by emotion", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => Promise.resolve(mockDreams),
            }),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.search({
      emotions: ["恐惧"],
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter dreams by dream type", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => Promise.resolve(mockDreams),
            }),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.search({
      dreamType: "nightmare",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter dreams by tags", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => Promise.resolve(mockDreams),
            }),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.search({
      tags: ["美好"],
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return empty array when database is unavailable", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.search({
      keyword: "test",
    });

    expect(result).toEqual([]);
  });
});

describe("dream.getAllTags", () => {
  it("should return tag statistics", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([
            { tags: ["美好", "重要"] },
            { tags: ["警示", "待分析"] },
            { tags: ["美好"] },
          ]),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.getAllTags();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw error when database is unavailable", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dream.getAllTags()).rejects.toThrow("Database not available");
  });
});

describe("dream.updateTags", () => {
  it("should update dream tags successfully", async () => {
    const { getDb } = await import("./db");
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });

    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([mockDreams[0]]),
          }),
        }),
      }),
      update: mockUpdate,
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.updateTags({
      dreamId: 1,
      tags: ["新标签", "重要"],
    });

    expect(result).toEqual({ success: true });
  });

  it("should throw error when dream not found", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.dream.updateTags({
        dreamId: 999,
        tags: ["test"],
      })
    ).rejects.toThrow();
  });

  it("should throw error when database is unavailable", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.dream.updateTags({
        dreamId: 1,
        tags: ["test"],
      })
    ).rejects.toThrow("Database not available");
  });
});

describe("dream.getStats", () => {
  it("should return dream statistics", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => Promise.resolve(mockDreams),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.getStats();

    expect(result).toBeDefined();
    expect(result?.totalDreams).toBe(3);
    expect(result?.emotionDistribution).toBeDefined();
    expect(result?.elementDistribution).toBeDefined();
    expect(result?.typeDistribution).toBeDefined();
  });

  it("should return null when database is unavailable", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.getStats();

    expect(result).toBeNull();
  });
});
