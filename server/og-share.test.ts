import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { ogImageRouter } from "./og-image";
import { ogMetaMiddleware } from "./og-meta";

// Test OG Image endpoint
describe("OG Image API", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use("/api/og-image", ogImageRouter);
  });

  it("should return a PNG image for default type", async () => {
    const res = await request(app).get("/api/og-image");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/png");
    expect(Number(res.headers["content-length"])).toBeGreaterThan(1000);
  });

  it("should return a PNG for tarot type", async () => {
    const res = await request(app).get(
      "/api/og-image?type=tarot&title=My+Reading&summary=Great+fortune&lang=en"
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/png");
  });

  it("should return a PNG for bazi type with Chinese text", async () => {
    const res = await request(app).get(
      `/api/og-image?type=bazi&title=${encodeURIComponent("八字精批")}&summary=${encodeURIComponent("金水相生")}&lang=zh`
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/png");
  });

  it("should return a PNG for compatibility type", async () => {
    const res = await request(app).get(
      "/api/og-image?type=compatibility&title=Love+Match&summary=92+percent&lang=en"
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/png");
  });

  it("should return a PNG for horoscope type", async () => {
    const res = await request(app).get(
      "/api/og-image?type=horoscope&title=Daily+Horoscope&summary=Stars+align&lang=en"
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/png");
  });

  it("should return a PNG for dream type", async () => {
    const res = await request(app).get(
      "/api/og-image?type=dream&title=Dream+Analysis&summary=Flying+dream&lang=en"
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/png");
  });

  it("should set cache headers", async () => {
    const res = await request(app).get("/api/og-image?type=tarot");
    expect(res.headers["cache-control"]).toContain("public");
    expect(res.headers["cache-control"]).toContain("max-age=86400");
  });

  it("should serve cached image on second request", async () => {
    const res1 = await request(app).get(
      "/api/og-image?type=tarot&title=Cache+Test&summary=test&lang=en"
    );
    const res2 = await request(app).get(
      "/api/og-image?type=tarot&title=Cache+Test&summary=test&lang=en"
    );
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    // Both should return same size (cached)
    expect(res1.headers["content-length"]).toBe(res2.headers["content-length"]);
  });
});

// Test OG Meta middleware
describe("OG Meta Middleware", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(ogMetaMiddleware);
    // Fallback for non-share routes
    app.use("*", (_req, res) => {
      res.status(200).send("SPA");
    });
  });

  it("should return OG meta HTML for social crawlers on /share", async () => {
    const res = await request(app)
      .get("/share?type=tarot&title=My+Reading&summary=Great+fortune&lang=en")
      .set("User-Agent", "facebookexternalhit/1.1");

    expect(res.status).toBe(200);
    expect(res.text).toContain('og:title');
    expect(res.text).toContain("My Reading");
    expect(res.text).toContain("Great fortune");
    expect(res.text).toContain("og:image");
    expect(res.text).toContain("twitter:card");
    expect(res.text).toContain("summary_large_image");
  });

  it("should pass through for regular users on /share", async () => {
    const res = await request(app)
      .get("/share?type=tarot&title=My+Reading")
      .set("User-Agent", "Mozilla/5.0 Chrome/120");

    expect(res.status).toBe(200);
    expect(res.text).toBe("SPA");
  });

  it("should pass through for non-share routes", async () => {
    const res = await request(app)
      .get("/tarot")
      .set("User-Agent", "facebookexternalhit/1.1");

    expect(res.status).toBe(200);
    expect(res.text).toBe("SPA");
  });

  it("should handle Twitterbot user agent", async () => {
    const res = await request(app)
      .get("/share?type=horoscope&lang=en")
      .set("User-Agent", "Twitterbot/1.0");

    expect(res.status).toBe(200);
    expect(res.text).toContain('og:title');
    expect(res.text).toContain("Horoscope");
  });

  it("should handle TelegramBot user agent", async () => {
    const res = await request(app)
      .get("/share?type=dream&lang=zh")
      .set("User-Agent", "TelegramBot (like TwitterBot)");

    expect(res.status).toBe(200);
    expect(res.text).toContain('og:title');
    expect(res.text).toContain("AI解梦");
  });

  it("should use Chinese locale for zh lang", async () => {
    const res = await request(app)
      .get("/share?type=bazi&lang=zh")
      .set("User-Agent", "facebookexternalhit/1.1");

    expect(res.status).toBe(200);
    expect(res.text).toContain("zh_CN");
    expect(res.text).toContain("zh-CN");
  });

  it("should use English locale for en lang", async () => {
    const res = await request(app)
      .get("/share?type=tarot&lang=en")
      .set("User-Agent", "facebookexternalhit/1.1");

    expect(res.status).toBe(200);
    expect(res.text).toContain("en_US");
  });

  it("should include og:image URL pointing to /api/og-image", async () => {
    const res = await request(app)
      .get("/share?type=tarot&title=Test&summary=Summary&lang=en")
      .set("User-Agent", "facebookexternalhit/1.1");

    expect(res.status).toBe(200);
    expect(res.text).toContain("/api/og-image");
    expect(res.text).toContain("type=tarot");
  });

  it("should escape HTML in title and summary", async () => {
    const res = await request(app)
      .get(`/share?type=tarot&title=${encodeURIComponent('<script>alert("xss")</script>')}&lang=en`)
      .set("User-Agent", "facebookexternalhit/1.1");

    expect(res.status).toBe(200);
    expect(res.text).not.toContain("<script>");
    expect(res.text).toContain("&lt;script&gt;");
  });
});
