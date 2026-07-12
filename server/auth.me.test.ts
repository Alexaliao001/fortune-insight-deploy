/**
 * F0-2: auth.me must never return passwordHash to the client.
 * Drives the real appRouter.auth.me procedure with a full user that HAS a hash.
 */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createCtxWithHash(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "local:secret-user@example.com",
      email: "secret-user@example.com",
      name: "Secret User",
      passwordHash: "salt:deadbeefcafebabe_should_never_leak",
      loginMethod: "email",
      role: "user",
      avatarUrl: null,
      zodiacSign: null,
      birthDate: null,
      birthTime: null,
      birthPlace: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      lastSignedIn: new Date("2026-01-01T00:00:00.000Z"),
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

describe("auth.me (F0-2 passwordHash strip)", () => {
  it("returns null when unauthenticated", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const me = await appRouter.createCaller(ctx).auth.me();
    expect(me).toBeNull();
  });

  it("returns user fields but never passwordHash even when present on ctx.user", async () => {
    const ctx = createCtxWithHash();
    // Prove the fixture actually carries a hash before the procedure
    expect(ctx.user?.passwordHash).toBe("salt:deadbeefcafebabe_should_never_leak");

    const me = await appRouter.createCaller(ctx).auth.me();
    expect(me).not.toBeNull();
    expect(me!.id).toBe(42);
    expect(me!.email).toBe("secret-user@example.com");
    expect(me!.name).toBe("Secret User");
    expect(me!.role).toBe("user");

    // Core contract
    expect(me).not.toHaveProperty("passwordHash");
    expect(JSON.stringify(me)).not.toContain("passwordHash");
    expect(JSON.stringify(me)).not.toContain("deadbeefcafebabe");
  });
});
