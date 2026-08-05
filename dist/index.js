/**
 * Fortune Insight — Render edge proxy → Nube full app.
 * Keeps Google/CNAME path feature-parity with production (full-1.0 + tRPC).
 * Zero npm deps. Start: NODE_ENV=production node dist/index.js
 */
import http from "node:http";
import https from "node:https";

const SERVICE = "fortune-insight";
const VERSION = "proxy-nube-1.0";
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const UPSTREAM_IP = process.env.NUBE_UPSTREAM_IP || "64.118.142.148";
const PUBLIC_HOST = process.env.PUBLIC_HOST || "fortunesite.one";

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

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  // Local liveness for Render before upstream is reachable
  if (urlPath === "/health" || urlPath === "/api/health") {
    // Prefer upstream health so dashboards see full-1.0 when Nube is up
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
      sendJson(res, 502, { ok: false, error: "upstream_error", detail: String(err.message || err) });
    } else {
      res.destroy();
    }
  });

  req.pipe(up);
});

server.listen(PORT, HOST, () => {
  console.log(
    `${SERVICE} ${HOST}:${PORT} proxy→https://${UPSTREAM_IP} host=${PUBLIC_HOST} version=${VERSION}`
  );
});
