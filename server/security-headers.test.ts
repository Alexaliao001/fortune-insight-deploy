import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { securityHeadersMiddleware, trpcPrefixGuard } from "./_core/securityHeaders";

function mockRes() {
  const headers: Record<string, string> = {};
  const res = {
    statusCode: 200,
    body: null as unknown,
    setHeader: (k: string, v: string) => {
      headers[k] = v;
    },
    getHeader: (k: string) => headers[k],
    status: (code: number) => {
      res.statusCode = code;
      return res;
    },
    type: () => res,
    json: (body: unknown) => {
      res.body = body;
      return res;
    },
  };
  return { res: res as unknown as Response, headers };
}

describe("securityHeadersMiddleware", () => {
  const prev = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = prev;
  });

  it("always sets nosniff", () => {
    process.env.NODE_ENV = "development";
    const { res, headers } = mockRes();
    const next = vi.fn();
    securityHeadersMiddleware({} as Request, res, next as NextFunction);
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(next).toHaveBeenCalled();
  });

  it("production sets X-Frame-Options DENY and CSP-Report-Only", () => {
    process.env.NODE_ENV = "production";
    const { res, headers } = mockRes();
    securityHeadersMiddleware({} as Request, res, vi.fn() as NextFunction);
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Content-Security-Policy-Report-Only"]).toMatch(/default-src/);
  });
});

describe("trpcPrefixGuard", () => {
  it("returns JSON 404 for /trpc/* without SPA HTML", () => {
    const { res, headers } = mockRes();
    const next = vi.fn();
    trpcPrefixGuard({ path: "/trpc/auth.me" } as Request, res, next as NextFunction);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(404);
    expect(res.body).toMatchObject({
      error: { hint: "/api/trpc" },
    });
  });

  it("passes through non-/trpc paths", () => {
    const { res } = mockRes();
    const next = vi.fn();
    trpcPrefixGuard({ path: "/api/trpc/auth.me" } as Request, res, next as NextFunction);
    expect(next).toHaveBeenCalled();
  });
});
