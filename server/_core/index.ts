import "dotenv/config";
import express from "express";
import compression from "compression";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { stripeRouter } from "../stripe";
import { ogImageRouter } from "../og-image";
import { ogMetaMiddleware } from "../og-meta";
import { warnMissingEnv } from "./env";
import { securityHeadersMiddleware, trpcPrefixGuard } from "./securityHeaders";
import { registerFullServerRoutes } from "../fullServerRoutes";
import { registerShopStaticRoutes } from "../shopStatic";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    const host = process.env.HOST || "0.0.0.0";
    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  warnMissingEnv();
  const app = express();
  const server = createServer(app);
  
  // Enable gzip/deflate compression for all responses
  // This reduces transfer size by 60-80% for text-based content
  app.use(compression({
    level: 6, // balanced speed/compression ratio
    threshold: 1024, // only compress responses > 1KB
    filter: (req, res) => {
      // Don't compress Stripe webhook responses or SSE streams
      if (req.path.startsWith('/api/stripe/webhook')) return false;
      return compression.filter(req, res);
    },
  }));

  // Security headers (prod XFO + CSP-RO) + wrong /trpc prefix JSON 404
  app.use(securityHeadersMiddleware);
  app.use(trpcPrefixGuard);

  // Full-server liveness + the zero-cost SX3 rules preview.
  // Preview owns its small raw body parser, so this must stay before express.json().
  registerFullServerRoutes(app);

  // Stripe webhook - MUST be BEFORE express.json() for signature verification
  // The stripeRouter uses express.raw() internally for the webhook endpoint
  app.use("/api/stripe", stripeRouter);

  // OG Image generation endpoint (no body parsing needed)
  app.use("/api/og-image", ogImageRouter);
  
  // Configure body parser with larger size limit for file uploads
  // This MUST come AFTER the Stripe webhook route
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // OG meta tag injection for social crawlers (must be before Vite/static)
  app.use(ogMetaMiddleware);

  // Shop static (local files) or Render edge proxy — before SPA fallback
  registerShopStaticRoutes(app);

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
