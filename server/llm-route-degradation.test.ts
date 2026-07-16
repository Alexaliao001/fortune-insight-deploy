import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { ENV } from "./_core/env";
import { resetLlmBudgetMemoryForTests } from "./_core/llmBudget";
import { router } from "./_core/trpc";
import { consumeUsage } from "./db";
import { baziRouter } from "./routers/bazi";
import { compatibilityRouter } from "./routers/compatibility";
import { dreamRouter } from "./routers/dream";
import { horoscopeRouter } from "./routers/horoscope";
import { tarotRouter } from "./routers/tarot";

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
  getUsageStatus: vi.fn().mockResolvedValue({ canUse: true }),
  consumeUsage: vi.fn(),
}));

const testRouter = router({
  tarot: tarotRouter,
  bazi: baziRouter,
  dream: dreamRouter,
  horoscope: horoscopeRouter,
  compatibility: compatibilityRouter,
});

const authContext: TrpcContext = {
  user: {
    id: 1,
    openId: "daily-limit-user",
    email: "daily-limit@example.com",
    name: "Daily Limit User",
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
};

const originalEnv = { ...ENV };

describe("five AI routes at the service daily limit", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    Object.assign(ENV, originalEnv, {
      llmApiUrl: "https://provider.example/v1",
      llmApiKey: "test-key",
      llmDailyMaxCalls: "0",
    });
    resetLlmBudgetMemoryForTests();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    Object.assign(ENV, originalEnv);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns the same structured degradation contract without provider traffic", async () => {
    const caller = testRouter.createCaller(authContext);
    const results = await Promise.all([
      caller.tarot.getReading({ questionType: "general", language: "en" }),
      caller.bazi.getReading({
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 1,
        language: "en",
      }),
      caller.dream.interpret({
        dreamContent: "I was flying over a quiet ocean at sunrise.",
        language: "en",
      }),
      caller.horoscope.getDaily({ sign: "aries", language: "en" }),
      caller.compatibility.analyze({
        person1Sign: "aries",
        person2Sign: "leo",
        language: "en",
      }),
    ]);

    for (const result of results) {
      expect(result.source).toBe("daily_limit");
      expect(result.degradation).toMatchObject({
        code: "LLM_DAILY_LIMIT",
        source: "daily_limit",
      });
    }
    expect(fetch).not.toHaveBeenCalled();
    expect(consumeUsage).not.toHaveBeenCalled();
  });
});
