import path from "node:path";
import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { ENV } from "./_core/env";
import { registerFreeTarotPrettyPath } from "./_core/vite";
import {
  createTarotPreviewRouter,
  registerFullServerRoutes,
} from "./fullServerRoutes";

const originalEnv = { ...ENV };

afterEach(() => {
  Object.assign(ENV, originalEnv);
});

describe("full server public routes", () => {
  it("reports full-mode integration readiness without leaking configuration values", async () => {
    Object.assign(ENV, {
      databaseUrl: "mysql://health-db-secret",
      stripeSecretKey: "sk_health_secret",
      stripeWebhookSecret: "whsec_health_secret",
      llmApiUrl: "https://llm-health-secret.example/v1",
      llmApiKey: "llm_health_secret",
      forgeApiKey: "",
    });
    const app = express();
    registerFullServerRoutes(app);

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.body).toMatchObject({
      ok: true,
      service: "fortune-insight",
      mode: "full",
      db: true,
      stripe: true,
      llm: true,
      tarot_preview: true,
      manus_login: false,
    });
    const serialized = JSON.stringify(response.body);
    expect(serialized).not.toContain("health-secret");
    expect(serialized).not.toContain("sk_health_secret");
    expect(serialized).not.toContain("whsec_health_secret");
    expect(serialized).not.toContain("llm_health_secret");
  });

  it("keeps the SX3 rules source and per-IP 429 contract", async () => {
    const app = express();
    app.use(
      "/api/tarot/preview",
      createTarotPreviewRouter({ rateLimit: 1, rateWindowSec: 3600 })
    );

    const first = await request(app)
      .post("/api/tarot/preview")
      .set("x-forwarded-for", "203.0.113.10")
      .send({ question: "today", language: "en" });

    expect(first.status).toBe(200);
    expect(first.body).toMatchObject({
      ok: true,
      spread: "single",
      source: "rules",
      meta: {
        version: "sx3-1.0",
        rate_remaining: 0,
        service: "fortune-insight",
      },
    });

    const limited = await request(app)
      .post("/api/tarot/preview")
      .set("x-forwarded-for", "203.0.113.10")
      .send({ language: "en" });

    expect(limited.status).toBe(429);
    expect(limited.body).toMatchObject({
      ok: false,
      error: "rate_limited",
    });
  });

  it("serves the existing static product page at its pretty path", async () => {
    const app = express();
    registerFreeTarotPrettyPath(app);
    app.use(express.static(path.resolve("client/public")));

    const response = await request(app).get("/free-tarot");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain("POST /api/tarot/preview");
    expect(response.text).toContain('fetch("/health")');
  });
});
