/**
 * F0-5: auth register/login failures must be TRPC BAD_REQUEST / UNAUTHORIZED
 * (not bare Error → INTERNAL_SERVER_ERROR).
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";

vi.mock("./localAuth", () => ({
  registerWithEmail: vi.fn(),
  loginWithEmail: vi.fn(),
}));

vi.mock("./_core/sdk", () => ({
  sdk: {
    createSessionToken: vi.fn().mockResolvedValue("fake-token"),
  },
}));

import { registerWithEmail, loginWithEmail } from "./localAuth";
import { appRouter } from "./routers";

const registerMock = vi.mocked(registerWithEmail);
const loginMock = vi.mocked(loginWithEmail);

function publicCtx(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("F0-5 auth error codes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("register business failure → BAD_REQUEST", async () => {
    registerMock.mockResolvedValue({
      ok: false,
      error: "Email already registered / 该邮箱已注册，请直接登录",
    });
    const caller = appRouter.createCaller(publicCtx());
    try {
      await caller.auth.register({
        email: "dup@example.com",
        password: "TestFriend90!",
      });
      expect.fail("expected error");
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).toBe("BAD_REQUEST");
      expect((e as TRPCError).code).not.toBe("INTERNAL_SERVER_ERROR");
      expect((e as TRPCError).message).toMatch(/already registered|已注册/i);
    }
  });

  it("login wrong password → UNAUTHORIZED", async () => {
    loginMock.mockResolvedValue({
      ok: false,
      error: "Invalid email or password / 邮箱或密码错误",
    });
    const caller = appRouter.createCaller(publicCtx());
    try {
      await caller.auth.login({
        email: "x@example.com",
        password: "wrong-password",
      });
      expect.fail("expected error");
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).toBe("UNAUTHORIZED");
      expect((e as TRPCError).code).not.toBe("INTERNAL_SERVER_ERROR");
    }
  });

  it("zod rejects short password before localAuth (BAD_REQUEST)", async () => {
    const caller = appRouter.createCaller(publicCtx());
    try {
      await caller.auth.register({
        email: "short@example.com",
        password: "123",
      });
      expect.fail("expected error");
    } catch (e) {
      // tRPC input validation
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).toBe("BAD_REQUEST");
      expect(registerMock).not.toHaveBeenCalled();
    }
  });
});
