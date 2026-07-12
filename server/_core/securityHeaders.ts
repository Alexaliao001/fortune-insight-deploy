import type { Request, Response, NextFunction } from "express";

/**
 * Production security headers (G20).
 * Dev skips strict CSP so Vite HMR works; XFO still applied in prod only for framing risk.
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  const isProd = process.env.NODE_ENV === "production";

  // Always useful
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (isProd) {
    res.setHeader("X-Frame-Options", "DENY");
    // CSP-Report-Only first wave: avoid breaking assets; enforce XFO above.
    res.setHeader(
      "Content-Security-Policy-Report-Only",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        "connect-src 'self' https: wss:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    );
  }

  next();
}

/** JSON 404 for mistaken /trpc prefix (must use /api/trpc). */
export function trpcPrefixGuard(req: Request, res: Response, next: NextFunction) {
  // Only exact /trpc or /trpc/*
  if (req.path === "/trpc" || req.path.startsWith("/trpc/")) {
    res.status(404).type("application/json").json({
      error: {
        message: 'No procedure at this path. Use "/api/trpc" instead of "/trpc".',
        code: "NOT_FOUND",
        hint: "/api/trpc",
      },
    });
    return;
  }
  next();
}
