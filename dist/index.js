/**
 * Fortune Insight — static SPA host + SX3 minimal tarot API.
 * Zero npm deps. Start: node dist/index.js (copied from this file on deploy).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drawSingleCard } from "./tarot_rules.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Prefer dist/public when running from dist/index.js; fall back for local server/
const rootCandidates = [
  path.join(__dirname, "public"),
  path.join(__dirname, "..", "dist", "public"),
  path.join(__dirname, "..", "public"),
];
const root = rootCandidates.find((p) => fs.existsSync(p)) || rootCandidates[0];
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const VERSION = "sx3-1.1";
const SERVICE = "fortune-insight";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".br": "application/octet-stream",
  ".gz": "application/octet-stream",
  ".webmanifest": "application/manifest+json",
};

// Sliding-window rate limit: N requests / windowSec per IP
const RATE_LIMIT = Math.max(1, Number(process.env.TAROT_RATE_LIMIT || 20));
const RATE_WINDOW_SEC = Math.max(10, Number(process.env.TAROT_RATE_WINDOW_SEC || 3600));
const hits = new Map(); // ip -> number[]

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function checkRate(ip) {
  const now = Date.now() / 1000;
  const windowStart = now - RATE_WINDOW_SEC;
  let arr = hits.get(ip) || [];
  arr = arr.filter((t) => t > windowStart);
  if (arr.length >= RATE_LIMIT) {
    hits.set(ip, arr);
    return { ok: false, remaining: 0 };
  }
  arr.push(now);
  hits.set(ip, arr);
  return { ok: true, remaining: RATE_LIMIT - arr.length };
}

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

function readBody(req, limit = 32_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("body_too_large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function healthPayload() {
  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    tarot_preview: true,
    manus_login: false,
    mode: "static+api",
    spread: "single",
    source_default: "rules",
  };
}

async function handleTarotPreview(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
    });
    return res.end();
  }
  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const ip = clientIp(req);
  const rate = checkRate(ip);
  if (!rate.ok) {
    return sendJson(res, 429, {
      ok: false,
      error: "rate_limited",
      error_detail: `max ${RATE_LIMIT} previews per ${RATE_WINDOW_SEC}s`,
      disclaimer: "Educational only.",
    });
  }

  let body = {};
  try {
    const raw = await readBody(req);
    if (raw.trim()) body = JSON.parse(raw);
  } catch (e) {
    if (String(e.message) === "body_too_large") {
      return sendJson(res, 413, { ok: false, error: "body_too_large" });
    }
    return sendJson(res, 400, { ok: false, error: "invalid_json" });
  }

  const result = drawSingleCard({
    question: body.question,
    language: body.language,
  });
  result.meta = { ...(result.meta || {}), rate_remaining: rate.remaining, service: SERVICE };
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(result));
}

function serveStatic(req, res, urlPath) {
  if (urlPath === "/") urlPath = "/index.html";
  // pretty path for free tarot
  if (urlPath === "/free-tarot" || urlPath === "/free-tarot/") {
    urlPath = "/free-tarot.html";
  }
  const file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end("forbidden");
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      fs.readFile(path.join(root, "index.html"), (e2, html) => {
        if (e2) {
          res.writeHead(404);
          return res.end("not found");
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

    if (urlPath === "/health" || urlPath === "/api/health") {
      return sendJson(res, 200, healthPayload());
    }
    if (urlPath === "/api/tarot/preview") {
      return await handleTarotPreview(req, res);
    }

    return serveStatic(req, res, urlPath);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) sendJson(res, 500, { ok: false, error: "internal" });
  }
});

server.listen(port, host, () => {
  console.log(`${SERVICE} ${host}:${port} root=${root} version=${VERSION}`);
});
