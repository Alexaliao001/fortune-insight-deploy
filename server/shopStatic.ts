import fs from "fs";
import https from "https";
import path from "path";
import type { Express, NextFunction, Request, Response } from "express";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SHOP_PRETTY: Record<string, string> = {
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
  "/shop/d/applocale-thanks": "/shop/d/applocale-thanks.html",
  "/shop/d/applocale-thanks/": "/shop/d/applocale-thanks.html",
  "/shop/d/brief-thanks": "/shop/d/brief-thanks.html",
  "/shop/d/brief-thanks/": "/shop/d/brief-thanks.html",
  "/shop/brief": "/shop/brief/index.html",
  "/shop/brief/": "/shop/brief/index.html",
};

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const SHOP_BRIEF_ARCHIVE_PATHS = new Set(["/shop/brief", "/shop/brief/"]);
const SHOP_BRIEF_ARCHIVE_FILE = "/shop/brief/index.html";

/** Public roots that may contain a shop/ subdirectory. */
function publicRoots(): string[] {
  const cwd = process.cwd();
  return [
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "..", "client", "public"),
    path.resolve(cwd, "dist", "public"),
    path.resolve(cwd, "public"),
  ];
}

export function isShopPath(pathname: string): boolean {
  return pathname === "/shop" || pathname.startsWith("/shop/");
}

export function resolveShopRelative(urlPath: string): string {
  return SHOP_PRETTY[urlPath] ?? urlPath;
}

function shopRelativeCandidates(urlPath: string): string[] {
  const mapped = resolveShopRelative(urlPath);
  const candidates = [mapped];
  if (mapped === urlPath) {
    if (urlPath.endsWith("/")) {
      candidates.push(`${urlPath}index.html`);
    } else if (!path.extname(urlPath)) {
      candidates.push(`${urlPath}/index.html`);
    }
  }
  return candidates;
}

export function resolveShopFile(urlPath: string): string | null {
  for (const rel of shopRelativeCandidates(urlPath)) {
    for (const root of publicRoots()) {
      const file = path.normalize(path.join(root, rel.replace(/^\//, "")));
      if (!file.startsWith(root)) continue;
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
    }
  }
  return null;
}

function shopEdgeOrigin(): string {
  return process.env.SHOP_EDGE_URL?.replace(/\/$/, "") || "https://fortune-insight.onrender.com";
}

function isShopEdgeSameHost(req: Request): boolean {
  const host = (req.headers.host || "").split(":")[0].toLowerCase();
  if (!host) return false;
  try {
    return new URL(shopEdgeOrigin()).hostname.toLowerCase() === host;
  } catch {
    return false;
  }
}

function sendShopFile(res: Response, file: string): void {
  const ext = path.extname(file).toLowerCase();
  res.set({
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "public, max-age=3600" : "public, max-age=86400",
    "X-Content-Type-Options": "nosniff",
    "X-Fortune-Shop": "local",
  });
  res.sendFile(file);
}

function resolveShopBriefArchiveFile(): string | null {
  return (
    resolveShopFile(SHOP_BRIEF_ARCHIVE_FILE) ??
    resolveShopFile("/shop/brief/") ??
    resolveShopFile("/shop/brief")
  );
}

function sendShopBriefArchive(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const method = req.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    next();
    return;
  }

  const urlPath = decodeURIComponent((req.originalUrl || req.url || "/").split("?")[0]);
  if (!SHOP_BRIEF_ARCHIVE_PATHS.has(urlPath)) {
    next();
    return;
  }

  const file = resolveShopBriefArchiveFile();
  if (!file) {
    next();
    return;
  }

  if (method === "HEAD") {
    res.set({
      "Content-Type": MIME[".html"],
      "X-Fortune-Shop": "local",
    });
    res.status(200).end();
    return;
  }

  sendShopFile(res, file);
}

/**
 * Dedicated handler for Storefront Brief English archive pretty URLs.
 * Register before registerShopStaticRoutes and SPA fallback.
 */
export function registerShopBriefArchiveRoute(app: Express): void {
  for (const routePath of SHOP_BRIEF_ARCHIVE_PATHS) {
    app.get(routePath, sendShopBriefArchive);
    app.head(routePath, sendShopBriefArchive);
  }
}

function proxyShopFromRender(req: Request, res: Response): void {
  const edge = shopEdgeOrigin();
  const target = `${edge}${req.originalUrl || req.url || "/shop/"}`;

  https
    .get(target, (up) => {
      if ((up.statusCode || 500) >= 400) {
        res.status(up.statusCode || 502).type("text/plain").send("shop unavailable");
        return;
      }
      const headers: Record<string, string | string[]> = { ...up.headers };
      delete headers["transfer-encoding"];
      headers["x-fortune-shop"] = "render-edge";
      res.writeHead(up.statusCode || 200, headers);
      up.pipe(res);
    })
    .on("error", () => {
      res.status(502).type("text/plain").send("shop edge unavailable");
    });
}

/**
 * Serve /shop/* from local static files on Nube (or dev), else proxy to Render edge.
 * Register before SPA fallback.
 */
export function registerShopStaticRoutes(app: Express): void {
  app.use((req, res, next) => {
    const method = req.method || "GET";
    if (method !== "GET" && method !== "HEAD") {
      next();
      return;
    }

    const urlPath = decodeURIComponent((req.originalUrl || req.url || "/").split("?")[0]);
    if (!isShopPath(urlPath)) {
      next();
      return;
    }

    const file = resolveShopFile(urlPath);
    if (file) {
      if (method === "HEAD") {
        res.set({
          "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
          "X-Fortune-Shop": "local",
        });
        res.status(200).end();
        return;
      }
      sendShopFile(res, file);
      return;
    }

    if (method === "HEAD") {
      res.status(404).end();
      return;
    }
    // On Render (same host as SHOP_EDGE_URL), fall through to express.static pretty URLs.
    if (isShopEdgeSameHost(req)) {
      next();
      return;
    }
    proxyShopFromRender(req, res);
  });
}
