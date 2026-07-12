import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 1,
                userId: 1,
                title: "飞翔之梦",
                dreamContent: "我梦见自己在天空中飞翔，感觉非常自由和快乐",
                emotions: ["快乐", "自由"],
                keyElements: ["飞翔", "天空"],
                dreamType: "normal",
                clarity: 4,
                interpretation: "## 梦境解读\n这是一个关于自由的美好梦境...",
                createdAt: new Date("2026-01-05"),
                updatedAt: new Date("2026-01-05"),
              },
              {
                id: 2,
                userId: 1,
                title: "追逐之梦",
                dreamContent: "我梦见被什么东西追逐，一直在逃跑",
                emotions: ["恐惧", "焦虑"],
                keyElements: ["追逐", "逃跑"],
                dreamType: "nightmare",
                clarity: 3,
                interpretation: "## 梦境解读\n这个梦可能反映了现实中的压力...",
                createdAt: new Date("2026-01-04"),
                updatedAt: new Date("2026-01-04"),
              },
            ]),
          }),
          limit: vi.fn().mockResolvedValue([
            {
              id: 1,
              userId: 1,
              title: "飞翔之梦",
              dreamContent: "我梦见自己在天空中飞翔，感觉非常自由和快乐",
              emotions: ["快乐", "自由"],
              keyElements: ["飞翔", "天空"],
              dreamType: "normal",
              clarity: 4,
              interpretation: "## 梦境解读\n这是一个关于自由的美好梦境...",
              createdAt: new Date("2026-01-05"),
              updatedAt: new Date("2026-01-05"),
            },
          ]),
        }),
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

describe("dream.exportSingle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should require authentication", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dream.exportSingle({ id: 1 })).rejects.toThrow();
  });

  it("should export a single dream as HTML", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.exportSingle({ id: 1 });

    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("filename");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.html).toContain("洞察未来");
    expect(result.html).toContain("飞翔之梦");
    expect(result.filename).toContain("Dream_");
  });
});

describe("dream.exportBatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should require authentication", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dream.exportBatch({})).rejects.toThrow();
  });

  it("should export multiple dreams as HTML", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.exportBatch({});

    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("filename");
    expect(result).toHaveProperty("count");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.html).toContain("洞察未来");
    expect(result.html).toContain("Dream Journal");
    expect(result.filename).toContain("Dream_Journal");
  });

  it("should accept limit parameter", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dream.exportBatch({ limit: 10 });

    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("count");
  });
});

describe("generateDreamPDFHTML", () => {
  it("should generate valid HTML with dream content", async () => {
    const { generateDreamPDFHTML } = await import("./pdfGenerator");
    
    const mockDream = {
      id: 1,
      userId: 1,
      title: "测试梦境",
      dreamContent: "这是一个测试梦境的内容",
      emotions: ["快乐", "平静"],
      keyElements: ["水", "飞翔"],
      dreamType: "normal",
      clarity: 4,
      interpretation: "## 解读\n这是AI的解读内容",
      dreamDate: null,
      createdAt: new Date("2026-01-05"),
      updatedAt: new Date("2026-01-05"),
    };

    const html = generateDreamPDFHTML([mockDream]);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("测试梦境");
    expect(html).toContain("这是一个测试梦境的内容");
    expect(html).toContain("快乐");
    expect(html).toContain("水");
    expect(html).toContain("洞察未来");
  });

  it("should handle multiple dreams", async () => {
    const { generateDreamPDFHTML } = await import("./pdfGenerator");
    
    const mockDreams = [
      {
        id: 1,
        userId: 1,
        title: "梦境一",
        dreamContent: "第一个梦境内容",
        emotions: ["快乐"],
        keyElements: ["水"],
        dreamType: "normal",
        clarity: 4,
        interpretation: "解读一",
        dreamDate: null,
        createdAt: new Date("2026-01-05"),
        updatedAt: new Date("2026-01-05"),
      },
      {
        id: 2,
        userId: 1,
        title: "梦境二",
        dreamContent: "第二个梦境内容",
        emotions: ["恐惧"],
        keyElements: ["追逐"],
        dreamType: "nightmare",
        clarity: 3,
        interpretation: "解读二",
        dreamDate: null,
        createdAt: new Date("2026-01-04"),
        updatedAt: new Date("2026-01-04"),
      },
    ];

    const html = generateDreamPDFHTML(mockDreams, "Dream Journal");

    expect(html).toContain("梦境一");
    expect(html).toContain("梦境二");
    expect(html).toContain("Dream Journal");
    expect(html).toContain("共 2 条梦境记录");
  });

  it("should handle dreams without optional fields", async () => {
    const { generateDreamPDFHTML } = await import("./pdfGenerator");
    
    const mockDream = {
      id: 1,
      userId: 1,
      title: null,
      dreamContent: "简单的梦境内容",
      emotions: null,
      keyElements: null,
      dreamType: null,
      clarity: null,
      interpretation: null,
      dreamDate: null,
      createdAt: new Date("2026-01-05"),
      updatedAt: new Date("2026-01-05"),
    };

    const html = generateDreamPDFHTML([mockDream as any]);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("简单的梦境内容");
  });
});
