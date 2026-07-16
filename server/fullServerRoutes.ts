import {
  Router,
  raw,
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { ENV } from "./_core/env";
import { drawSingleCard } from "./tarot_rules.mjs";

const SERVICE = "fortune-insight";
const VERSION = "full-1.0";
const DEFAULT_RATE_LIMIT = 20;
const DEFAULT_RATE_WINDOW_SEC = 3600;
const BODY_LIMIT_BYTES = 32_000;

type RateResult = {
  ok: boolean;
  remaining: number;
};

type TarotPreviewOptions = {
  rateLimit?: number;
  rateWindowSec?: number;
  now?: () => number;
};

function positiveInteger(
  value: string | undefined,
  fallback: number,
  minimum: number
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(minimum, Math.floor(parsed));
}

export function buildFullHealthPayload() {
  const modernLlmReady = Boolean(
    ENV.llmApiUrl.trim() && ENV.llmApiKey.trim()
  );
  const legacyForgeReady = Boolean(ENV.forgeApiKey.trim());

  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    mode: "full" as const,
    db: Boolean(ENV.databaseUrl.trim()),
    stripe: Boolean(
      ENV.stripeSecretKey.trim() && ENV.stripeWebhookSecret.trim()
    ),
    llm: modernLlmReady || legacyForgeReady,
    tarot_preview: true,
    manus_login: false,
    spread: "single",
    source_default: "rules",
  };
}

function sendJson(res: Response, status: number, payload: unknown) {
  return res
    .status(status)
    .set({
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    })
    .json(payload);
}

function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  return req.socket.remoteAddress || "unknown";
}

export function createTarotPreviewRouter(
  options: TarotPreviewOptions = {}
) {
  const rateLimit = positiveInteger(
    options.rateLimit?.toString() ?? process.env.TAROT_RATE_LIMIT,
    DEFAULT_RATE_LIMIT,
    1
  );
  const rateWindowSec = positiveInteger(
    options.rateWindowSec?.toString() ?? process.env.TAROT_RATE_WINDOW_SEC,
    DEFAULT_RATE_WINDOW_SEC,
    10
  );
  const now = options.now ?? Date.now;
  const hits = new Map<string, number[]>();
  const router = Router();

  const checkRate = (ip: string): RateResult => {
    const windowStart = now() / 1000 - rateWindowSec;
    const recentHits = (hits.get(ip) ?? []).filter(hit => hit > windowStart);
    if (recentHits.length >= rateLimit) {
      hits.set(ip, recentHits);
      return { ok: false, remaining: 0 };
    }
    recentHits.push(now() / 1000);
    hits.set(ip, recentHits);
    return { ok: true, remaining: rateLimit - recentHits.length };
  };

  router.options("/", (_req, res) => {
    res
      .status(204)
      .set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
      })
      .end();
  });

  router.post(
    "/",
    (req, res, next) => {
      const rate = checkRate(clientIp(req));
      if (!rate.ok) {
        sendJson(res, 429, {
          ok: false,
          error: "rate_limited",
          error_detail: `max ${rateLimit} previews per ${rateWindowSec}s`,
          disclaimer: "Educational only.",
        });
        return;
      }
      res.locals.tarotPreviewRate = rate;
      next();
    },
    raw({ type: "*/*", limit: BODY_LIMIT_BYTES }),
    (req, res) => {
      let body: Record<string, unknown> = {};
      try {
        const rawBody = Buffer.isBuffer(req.body)
          ? req.body.toString("utf8")
          : String(req.body ?? "");
        if (rawBody.trim()) {
          const parsed = JSON.parse(rawBody);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("invalid_json");
          }
          body = parsed as Record<string, unknown>;
        }
      } catch {
        sendJson(res, 400, { ok: false, error: "invalid_json" });
        return;
      }

      const result = drawSingleCard({
        question:
          typeof body.question === "string" ? body.question : undefined,
        language:
          typeof body.language === "string" ? body.language : undefined,
      });
      const rate = res.locals.tarotPreviewRate as RateResult;
      result.meta = {
        ...result.meta,
        rate_remaining: rate.remaining,
        service: SERVICE,
      };

      res
        .status(200)
        .set({
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "Access-Control-Allow-Origin": "*",
        })
        .json(result);
    }
  );

  router.all("/", (_req, res) => {
    sendJson(res, 405, { ok: false, error: "method_not_allowed" });
  });

  router.use(
    (
      error: { type?: string },
      _req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      if (error.type === "entity.too.large") {
        sendJson(res, 413, { ok: false, error: "body_too_large" });
        return;
      }
      sendJson(res, 400, { ok: false, error: "invalid_body" });
    }
  );

  return router;
}

export function registerFullServerRoutes(app: Express): void {
  app.get(["/health", "/api/health"], (_req, res) => {
    sendJson(res, 200, buildFullHealthPayload());
  });
  app.use("/api/tarot/preview", createTarotPreviewRouter());
}
