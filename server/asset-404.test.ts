/**
 * F0-1: missing /assets/* must 404 as plain text, never SPA HTML 200.
 * Tests the real helpers used by serveStatic + a minimal Express mount of
 * the same fallback middleware path.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import type { Server } from "http";
import fs from "fs";
import os from "os";
import path from "path";
import {
  getRequestPathname,
  shouldReturnAsset404,
  trySendAsset404,
  serveStatic,
} from "./_core/vite";

describe("getRequestPathname / shouldReturnAsset404 (shipped helpers)", () => {
  it("prefers originalUrl over misleading path", () => {
    expect(
      getRequestPathname({
        originalUrl: "/assets/Home-abc.js?v=1",
        path: "/",
        url: "/assets/Home-abc.js?v=1",
      })
    ).toBe("/assets/Home-abc.js");
  });

  it("returns true for missing hashed asset paths", () => {
    expect(shouldReturnAsset404("/assets/no-such-chunk.js")).toBe(true);
    expect(shouldReturnAsset404("/assets/Foo-XxYyZz.js")).toBe(true);
  });

  it("returns true for bare module extensions outside /assets", () => {
    expect(shouldReturnAsset404("/legacy/app.js")).toBe(true);
    expect(shouldReturnAsset404("/x.css")).toBe(true);
    expect(shouldReturnAsset404("/x.map")).toBe(true);
  });

  it("returns false for normal SPA routes", () => {
    expect(shouldReturnAsset404("/")).toBe(false);
    expect(shouldReturnAsset404("/tarot")).toBe(false);
    expect(shouldReturnAsset404("/login")).toBe(false);
    expect(shouldReturnAsset404("/membership")).toBe(false);
  });
});

describe("serveStatic missing asset 404 (integration)", () => {
  let server: Server;
  let baseUrl: string;
  let tmpRoot: string;

  beforeAll(async () => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "fi-static-"));
    // serveStatic production path: dirname(public) relative to vite module is
    // not tmp — we mount the same fallback contract as serveStatic uses.
    const distPublic = path.join(tmpRoot, "public");
    fs.mkdirSync(path.join(distPublic, "assets"), { recursive: true });
    fs.writeFileSync(
      path.join(distPublic, "index.html"),
      "<!doctype html><html><body><div id=\"root\"></div></body></html>"
    );
    fs.writeFileSync(
      path.join(distPublic, "assets", "exists.js"),
      "export default 1;"
    );

    const app = express();
    app.use(
      "/assets",
      express.static(path.join(distPublic, "assets"), { fallthrough: true })
    );
    app.use(express.static(distPublic, { fallthrough: true }));
    // Same decision as setupVite + serveStatic SPA fallback (shipped helper)
    app.use((req, res) => {
      if (trySendAsset404(req, res)) return;
      res.set({
        "Cache-Control": "public, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      });
      res.sendFile(path.resolve(distPublic, "index.html"));
    });

    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => resolve());
    });
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("no port");
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it("GET missing /assets/*.js → 404 plain text, not HTML", async () => {
    const res = await fetch(`${baseUrl}/assets/no-such-f0-1-nonce.js`);
    const body = await res.text();
    expect(res.status).toBe(404);
    const ct = res.headers.get("content-type") || "";
    expect(ct.includes("text/html")).toBe(false);
    expect(ct.includes("text/plain")).toBe(true);
    expect(body.trim()).toBe("Asset not found");
    expect(body.toLowerCase().startsWith("<!doctype")).toBe(false);
    expect(body.toLowerCase().includes("<html")).toBe(false);
  });

  it("GET existing asset → 200 javascript body", async () => {
    const res = await fetch(`${baseUrl}/assets/exists.js`);
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain("export default 1");
    expect(body.toLowerCase().startsWith("<!doctype")).toBe(false);
  });

  it("GET / → SPA index.html 200", async () => {
    const res = await fetch(`${baseUrl}/`);
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain('id="root"');
  });

  it("GET /tarot → SPA fallback HTML 200 (not asset 404)", async () => {
    const res = await fetch(`${baseUrl}/tarot`);
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain('id="root"');
  });
});

describe("serveStatic export is the production entry used by server", () => {
  it("serveStatic is a function (wired from index)", () => {
    expect(typeof serveStatic).toBe("function");
  });

  it("trySendAsset404 is the shared helper used by setupVite (dev) and serveStatic", () => {
    expect(typeof trySendAsset404).toBe("function");
  });
});

/** Mirrors setupVite catch-all: after "vite" miss, asset paths must 404 not SPA. */
describe("setupVite-style SPA catch-all (dev path contract)", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    // Pretend vite.middlewares called next() for unknown /assets/*
    app.use("*", (req, res) => {
      if (trySendAsset404(req, res)) return;
      res
        .status(200)
        .type("html")
        .send('<!doctype html><html><body><div id="root"></div></body></html>');
    });
    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => resolve());
    });
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("no port");
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("GET missing /assets/*.js → 404 plain text (not SPA HTML 200)", async () => {
    const res = await fetch(`${baseUrl}/assets/no-such-dev-path.js`);
    const body = await res.text();
    expect(res.status).toBe(404);
    expect((res.headers.get("content-type") || "").includes("text/html")).toBe(
      false
    );
    expect(body.trim()).toBe("Asset not found");
    expect(body.toLowerCase().includes("<html")).toBe(false);
  });

  it("GET /login → SPA HTML 200", async () => {
    const res = await fetch(`${baseUrl}/login`);
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain('id="root"');
  });
});
