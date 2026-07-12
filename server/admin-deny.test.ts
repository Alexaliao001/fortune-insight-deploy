/**
 * F0-4: non-admin callers must receive FORBIDDEN on admin procedures
 * (not INTERNAL_SERVER_ERROR from bare Error throws).
 */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

function userCtx(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "local:user@example.com",
      email: "user@example.com",
      name: "Normal User",
      passwordHash: null,
      loginMethod: "email",
      role,
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
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

async function expectForbidden(fn: () => Promise<unknown>) {
  try {
    await fn();
    expect.fail("expected TRPCError FORBIDDEN");
  } catch (e) {
    expect(e).toBeInstanceOf(TRPCError);
    const err = e as TRPCError;
    expect(err.code).toBe("FORBIDDEN");
    // Must not look like unhandled INTERNAL
    expect(err.code).not.toBe("INTERNAL_SERVER_ERROR");
  }
}

describe("F0-4 admin deny (role=user)", () => {
  it("admin.overview → FORBIDDEN", async () => {
    const caller = appRouter.createCaller(userCtx("user"));
    await expectForbidden(() => caller.admin.overview());
  });

  it("payment.adminListUsers → FORBIDDEN", async () => {
    const caller = appRouter.createCaller(userCtx("user"));
    await expectForbidden(() => caller.payment.adminListUsers({ limit: 10 }));
  });

  it("payment.adminGrantMembership → FORBIDDEN", async () => {
    const caller = appRouter.createCaller(userCtx("user"));
    await expectForbidden(() =>
      caller.payment.adminGrantMembership({ userId: 1, type: "lifetime" })
    );
  });

  it("payment.adminRevokeMembership → FORBIDDEN", async () => {
    const caller = appRouter.createCaller(userCtx("user"));
    await expectForbidden(() =>
      caller.payment.adminRevokeMembership({ userId: 1 })
    );
  });

  it("accessCode.adminList → FORBIDDEN", async () => {
    const caller = appRouter.createCaller(userCtx("user"));
    await expectForbidden(() => caller.accessCode.adminList());
  });
});
