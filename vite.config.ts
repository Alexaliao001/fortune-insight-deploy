import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import { swVersionPlugin } from "./client/vite-plugin-sw-version";

// Do not inject host-platform runtime plugins into public HTML (view-source hygiene).

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  // Pre-compress assets at build time (gzip + brotli)
  compression({
    algorithms: ["gzip", "brotliCompress"],
    exclude: [/\.(br)$/, /\.(gz)$/],
    threshold: 1024,
  }),
  // Inject unique build hash into sw.js so browsers detect new deployments
  swVersionPlugin(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    /**
     * Chunk splitting strategy:
     * 
     * Prefer fewer chunks on high-TTFB hosts (less request overhead).
     * 
     * Strategy: 
     * - 1 core vendor chunk (React + ReactDOM + tRPC + Query + all utils)
     * - 1 UI vendor chunk (Radix UI)
     * - Lazy-loaded: animation, markdown, charts (only when needed)
     * - Page-level code splitting for all routes
     * 
     * Total first-load HTTP requests: HTML + CSS + vendor.js + vendor-ui.js + index.js = 5 parallel
     */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // framer-motion - only needed for specific animated pages
            if (id.includes('framer-motion') || id.includes('@motionone')) {
              return 'vendor-animation';
            }
            // Markdown renderer - only needed for AI response display
            if (id.includes('react-markdown') || id.includes('remark') || 
                id.includes('rehype') || id.includes('unified') || 
                id.includes('micromark') || id.includes('mdast') || 
                id.includes('hast')) {
              return 'vendor-markdown';
            }
            // Charts - only needed for specific pages
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // Everything else into ONE core vendor chunk
            return 'vendor';
          }
        },
      },
    },
    minify: 'esbuild',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  server: {
    host: true,
    allowedHosts: ["all"],
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
