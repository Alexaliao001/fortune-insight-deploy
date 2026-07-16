import express, { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export function registerFreeTarotPrettyPath(app: Express): void {
  app.use((req, _res, next) => {
    if (
      (req.method === "GET" || req.method === "HEAD") &&
      (req.path === "/free-tarot" || req.path === "/free-tarot/")
    ) {
      req.url = "/free-tarot.html";
    }
    next();
  });
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  registerFreeTarotPrettyPath(app);
  app.use(vite.middlewares);
  // F0-1: after Vite middleware, never SPA-fallback missing /assets/* or static modules
  app.use("*", async (req, res, next) => {
    if (trySendAsset404(req, res)) return;

    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * MIME type map for pre-compressed files
 */
const MIME_TYPES: Record<string, string> = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

/**
 * Serve pre-compressed files (.br / .gz) when available.
 * Falls back to the original file if no compressed variant exists.
 */
function servePreCompressed(distPath: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only handle GET/HEAD for static assets
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    
    const urlPath = req.path;
    const filePath = path.join(distPath, urlPath);
    
    // Check if the original file exists
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return next();
    }
    
    const ext = path.extname(urlPath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    // Determine cache headers based on path
    const isHashedAsset = urlPath.startsWith('/assets/');
    const cacheControl = isHashedAsset 
      ? 'public, max-age=31536000, immutable' // 1 year for hashed assets
      : 'public, max-age=3600'; // 1 hour for other static files
    
    // Try brotli first, then gzip, then original
    if (acceptEncoding.includes('br')) {
      const brPath = filePath + '.br';
      if (fs.existsSync(brPath)) {
        res.set({
          'Content-Type': contentType,
          'Content-Encoding': 'br',
          'Cache-Control': cacheControl,
          'Vary': 'Accept-Encoding',
          'X-Content-Type-Options': 'nosniff',
        });
        if (isHashedAsset) {
          res.removeHeader('ETag');
          res.removeHeader('Last-Modified');
        }
        return res.sendFile(brPath);
      }
    }
    
    if (acceptEncoding.includes('gzip')) {
      const gzPath = filePath + '.gz';
      if (fs.existsSync(gzPath)) {
        res.set({
          'Content-Type': contentType,
          'Content-Encoding': 'gzip',
          'Cache-Control': cacheControl,
          'Vary': 'Accept-Encoding',
          'X-Content-Type-Options': 'nosniff',
        });
        if (isHashedAsset) {
          res.removeHeader('ETag');
          res.removeHeader('Last-Modified');
        }
        return res.sendFile(gzPath);
      }
    }
    
    // Fall through to express.static
    next();
  };
}

/**
 * Path for SPA vs asset decisions. Prefer originalUrl — Express `req.path`
 * under catch-all middleware can be wrong and cause HTML 200 for missing JS.
 */
export function getRequestPathname(req: {
  originalUrl?: string;
  url?: string;
  path?: string;
}): string {
  return (req.originalUrl || req.url || req.path || "").split("?")[0];
}

/**
 * Missing hashed chunks / static module URLs must never fall through to index.html.
 * (F0-1 / chunk TypeError prevention)
 */
export function shouldReturnAsset404(pathname: string): boolean {
  const p = pathname.split("?")[0] || "";
  return p.startsWith("/assets/") || /\.(js|css|map|mjs|wasm)$/i.test(p);
}

/**
 * If this request path is a missing asset/module URL, write 404 plain text and return true.
 * Used by both `setupVite` (pnpm dev) and `serveStatic` (pnpm start).
 */
export function trySendAsset404(
  req: { originalUrl?: string; url?: string; path?: string },
  res: Response
): boolean {
  const p = getRequestPathname(req);
  if (!shouldReturnAsset404(p)) return false;
  res.set({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.status(404).type("text/plain").send("Asset not found");
  return true;
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  registerFreeTarotPrettyPath(app);

  // Performance and security headers for all responses
  app.use((_req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-DNS-Prefetch-Control', 'on');
    next();
  });

  // Serve pre-compressed files first (brotli > gzip > original)
  app.use(servePreCompressed(distPath));

  // Hashed assets (JS/CSS with content hash) - aggressive long-term cache
  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
      etag: false,
      lastModified: false,
    })
  );

  // sw.js must NEVER be cached - browsers need to always check for updates
  app.use('/sw.js', (_req, res, next) => {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    next();
  });

  // Other static files (images, manifest, etc.) - moderate cache
  app.use(
    express.static(distPath, {
      maxAge: "1h",
      etag: true,
    })
  );

  // fall through to index.html if the file doesn't exist
  // HTML should have short cache to pick up new deployments quickly
  app.use((req, res) => {
    if (trySendAsset404(req, res)) return;

    res.set({
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    });
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
