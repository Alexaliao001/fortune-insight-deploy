/**
 * Fortune Insight — Render edge: local /shop static + proxy → Nube full app.
 * Keeps Google/CNAME path feature-parity with production (full-1.0 + tRPC).
 * Zero npm deps. Start: NODE_ENV=production node dist/index.js
 */
import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SERVICE = "fortune-insight";
const VERSION = "proxy-nube-1.1";
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const UPSTREAM_IP = process.env.NUBE_UPSTREAM_IP || "64.118.142.148";
const PUBLIC_HOST = process.env.PUBLIC_HOST || "fortunesite.one";

const STATIC_ROOT = path.join(__dirname, "public");

const SHOP_PRETTY = {
  "/shop": "/shop/index.html",
  "/shop/": "/shop/index.html",
  "/shop/listing-rewrite": "/shop/listing-rewrite.html",
  "/shop/listing-rewrite/": "/shop/listing-rewrite.html",
  "/shop/s/monday-mood": "/shop/s/monday-mood.html",
  "/shop/s/monday-mood/": "/shop/s/monday-mood.html",
  "/shop/s/focus-todo": "/shop/s/focus-todo.html",
  "/shop/s/focus-todo/": "/shop/s/focus-todo.html",
  "/shop/d/k7m2-ship": "/shop/d/k7m2-ship.html",
  "/shop/d/k7m2-ship/": "/shop/d/k7m2-ship.html",
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 64,
  servername: PUBLIC_HOST,
});

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

function filterHeaders(src) {
  const out = {};
  for (const [k, v] of Object.entries(src || {})) {
    if (v == null) continue;
    if (HOP_BY_HOP.has(k.toLowerCase())) continue;
    out[k] = v;
  }
  out.host = PUBLIC_HOST;
  out["x-forwarded-proto"] = "https";
  out["x-fortune-edge"] = VERSION;
  return out;
}

function sendJson(res, code, body) {
  const raw = JSON.stringify(body);
  res.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(raw);
}

function isShopPath(urlPath) {
  return urlPath === "/shop" || urlPath.startsWith("/shop/");
}

function resolveShopFile(urlPath) {
  const mapped = SHOP_PRETTY[urlPath];
  const rel = mapped || urlPath;
  const file = path.normalize(path.join(STATIC_ROOT, rel));
  if (!file.startsWith(STATIC_ROOT)) return null;
  return file;
}

function serveShopStatic(req, res, urlPath) {
  const file = resolveShopFile(urlPath);
  if (!file) {
    res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    res.end("forbidden");
    return true;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, {
        "content-type": "text/plain; charset=utf-8",
        "x-content-type-options": "nosniff",
      });
      res.end("shop page not found");
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "content-type": MIME[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "public, max-age=3600" : "public, max-age=86400",
      "x-content-type-options": "nosniff",
      "x-fortune-edge": VERSION,
    });
    res.end(data);
  });
  return true;
}

function proxyToNube(req, res) {
  const opts = {
    hostname: UPSTREAM_IP,
    port: 443,
    path: req.url || "/",
    method: req.method || "GET",
    headers: filterHeaders(req.headers),
    agent,
    servername: PUBLIC_HOST,
    timeout: 60000,
  };

  const up = https.request(opts, (ures) => {
    const headers = { ...ures.headers };
    delete headers.connection;
    delete headers["transfer-encoding"];
    res.writeHead(ures.statusCode || 502, headers);
    ures.pipe(res);
  });

  up.on("timeout", () => {
    up.destroy();
    if (!res.headersSent) sendJson(res, 504, { ok: false, error: "upstream_timeout" });
  });
  up.on("error", (err) => {
    if (!res.headersSent) {
      sendJson(res, 502, {
        ok: false,
        error: "upstream_error",
        detail: String(err.message || err),
      });
    } else {
      res.destroy();
    }
  });

  req.pipe(up);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const method = req.method || "GET";

  // Local liveness for Render before upstream is reachable
  if (urlPath === "/health" || urlPath === "/api/health") {
    const opts = {
      hostname: UPSTREAM_IP,
      port: 443,
      path: "/api/health",
      method: "GET",
      headers: { host: PUBLIC_HOST, accept: "application/json" },
      agent,
      servername: PUBLIC_HOST,
      timeout: 8000,
    };
    const up = https.request(opts, (ures) => {
      const chunks = [];
      ures.on("data", (c) => chunks.push(c));
      ures.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        try {
          const json = JSON.parse(text);
          sendJson(res, ures.statusCode || 200, {
            ...json,
            edge: VERSION,
            edge_upstream: UPSTREAM_IP,
          });
        } catch {
          sendJson(res, 200, {
            ok: true,
            service: SERVICE,
            version: VERSION,
            mode: "proxy",
            upstream_raw: text.slice(0, 200),
          });
        }
      });
    });
    up.on("timeout", () => {
      up.destroy();
      sendJson(res, 200, {
        ok: true,
        service: SERVICE,
        version: VERSION,
        mode: "proxy",
        upstream: "timeout",
      });
    });
    up.on("error", () => {
      sendJson(res, 200, {
        ok: true,
        service: SERVICE,
        version: VERSION,
        mode: "proxy",
        upstream: "unreachable",
      });
    });
    up.end();
    return;
  }

  // Serve /shop from local static files BEFORE Nube proxy (avoid SPA shell)
  if ((method === "GET" || method === "HEAD") && isShopPath(urlPath)) {
    if (method === "HEAD") {
      const file = resolveShopFile(urlPath);
      if (!file || !fs.existsSync(file)) {
        res.writeHead(404);
        res.end();
        return;
      }
      const ext = path.extname(file).toLowerCase();
      res.writeHead(200, {
        "content-type": MIME[ext] || "application/octet-stream",
        "x-fortune-edge": VERSION,
      });
      res.end();
      return;
    }
    serveShopStatic(req, res, urlPath);
    return;
  }

  proxyToNube(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(
    `${SERVICE} ${HOST}:${PORT} shop=local proxy→https://${UPSTREAM_IP} host=${PUBLIC_HOST} version=${VERSION} static=${STATIC_ROOT}`
  );
});
