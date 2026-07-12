/**
 * F2-1: community comment procedures exist and enforce auth on write.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
  grantSignupTrialIfNeeded: vi.fn().mockResolvedValue({ granted: false }),
  hasActiveMembership: vi.fn().mockResolvedValue(false),
  getUsageStatus: vi.fn(),
  consumeUsage: vi.fn(),
  saveReport: vi.fn(),
  getUserReports: vi.fn(),
  getReportById: vi.fn(),
  toggleReportFavorite: vi.fn(),
  deleteReport: vi.fn(),
}));

function anonCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function userCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "local:c@example.com",
      email: "c@example.com",
      name: "C",
      passwordHash: null,
      loginMethod: "email",
      role: "user",
      avatarUrl: null,
      zodiacSign: null,
      birthDate: null,
      birthTime: null,
      birthPlace: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      welcomeEmailSent: false,
      referralCode: null,
      referredBy: null,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { cookie: () => {}, clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("F2-1 community comments API surface", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getComments is public and returns [] when db unavailable", async () => {
    const caller = appRouter.createCaller(anonCtx());
    const rows = await caller.community.getComments({ postId: 1 });
    expect(rows).toEqual([]);
  });

  it("addComment requires auth", async () => {
    const caller = appRouter.createCaller(anonCtx());
    try {
      await caller.community.addComment({ postId: 1, content: "hi" });
      expect.fail("expected UNAUTHORIZED");
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).toBe("UNAUTHORIZED");
    }
  });

  it("addComment with auth hits db path (unavailable → INTERNAL)", async () => {
    const caller = appRouter.createCaller(userCtx());
    try {
      await caller.community.addComment({ postId: 1, content: "hello world" });
      expect.fail("expected error without db");
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
      // db null → INTERNAL_SERVER_ERROR from our handler
      expect((e as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});
