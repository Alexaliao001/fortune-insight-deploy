import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

// Mock bazi readings for testing
const mockBaziReadings = [
  {
    id: 1,
    userId: 1,
    sessionId: "test-session-1",
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    birthHour: 10,
    birthMinute: null,
    gender: "female" as const,
    baziChart: { year: "庚午", month: "辛巳", day: "甲子", hour: "己巳" },
    personalityAnalysis: "性格温和，善于沟通",
    talentAnalysis: "具有艺术天赋",
    careerSuggestions: "适合从事创意行业",
    fullReport: "完整的八字分析报告内容...",
    isPaid: false,
    reportUrl: null,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    userId: 1,
    sessionId: "test-session-2",
    birthYear: 1985,
    birthMonth: 8,
    birthDay: 20,
    birthHour: null,
    birthMinute: null,
    gender: "male" as const,
    baziChart: null,
    personalityAnalysis: null,
    talentAnalysis: null,
    careerSuggestions: null,
    fullReport: "另一份八字分析报告...",
    isPaid: true,
    reportUrl: null,
    createdAt: new Date("2026-01-02"),
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

function createUnauthContext(): TrpcContext {
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

describe("bazi.exportSingle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should require authentication", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bazi.exportSingle({ readingId: 1 })
    ).rejects.toThrow();
  });

  it("should export a single bazi reading as HTML", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([mockBaziReadings[0]]),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bazi.exportSingle({ readingId: 1 });

    expect(result).toBeDefined();
    expect(result.html).toContain("八字");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.filename).toContain("BaZi_Report");
    expect(result.filename.endsWith(".html")).toBe(true);
  });

  it("should throw error when reading not found", async () => {
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
      caller.bazi.exportSingle({ readingId: 999 })
    ).rejects.toThrow("Reading not found");
  });

  it("should throw error when database is unavailable", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bazi.exportSingle({ readingId: 1 })
    ).rejects.toThrow("Database unavailable");
  });
});

describe("bazi.exportBatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should require authentication", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bazi.exportBatch({})
    ).rejects.toThrow();
  });

  it("should export all bazi readings as HTML", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => Promise.resolve(mockBaziReadings),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bazi.exportBatch({});

    expect(result).toBeDefined();
    expect(result.html).toContain("八字");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.filename).toContain("BaZi_Records");
    expect(result.count).toBe(2);
  });

  it("should throw error when no readings found", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue({
      select: () => ({
        from: () => ({
          where: () => ({
            orderBy: () => Promise.resolve([]),
          }),
        }),
      }),
    } as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bazi.exportBatch({})
    ).rejects.toThrow("No readings found");
  });

  it("should throw error when database is unavailable", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bazi.exportBatch({})
    ).rejects.toThrow("Database unavailable");
  });
});

describe("generateBaziPDFHTML", () => {
  it("should generate valid HTML with bazi data", async () => {
    const { generateBaziPDFHTML } = await import("./pdfGenerator");
    
    const html = generateBaziPDFHTML(mockBaziReadings as any);
    
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("洞察未来");
    expect(html).toContain("八字");
    expect(html).toContain("1990年5月15日");
    expect(html).toContain("1985年8月20日");
  });

  it("should include birth info in the report", async () => {
    const { generateBaziPDFHTML } = await import("./pdfGenerator");
    
    const html = generateBaziPDFHTML([mockBaziReadings[0]] as any, "测试报告");
    
    expect(html).toContain("测试报告");
    expect(html).toContain("10时");
    expect(html).toContain("女");
  });

  it("should handle missing optional fields", async () => {
    const { generateBaziPDFHTML } = await import("./pdfGenerator");
    
    const html = generateBaziPDFHTML([mockBaziReadings[1]] as any);
    
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("1985年8月20日");
    // Should not crash with null baziChart
  });
});
