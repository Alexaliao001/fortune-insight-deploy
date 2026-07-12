import { lazy, ComponentType } from "react";

/**
 * Enhanced lazy() that handles stale chunk errors after deployments.
 *
 * When a new version is deployed, JS chunk filenames change (content hash).
 * Users with cached HTML still reference old chunk names → 404 / HTML fallback
 * → TypeError: Failed to fetch dynamically imported module.
 *
 * Recovery:
 * 1. Clear SW caches + unregister SW (stale asset maps)
 * 2. Hard reload with cache-bust query once
 * 3. On second failure, surface error to ErrorBoundary
 */

const RELOAD_KEY = "chunk-reload-attempted";

function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("failed to fetch dynamically imported module") ||
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    msg.includes("dynamically imported module") ||
    msg.includes("failed to load module script") ||
    msg.includes("error loading dynamically imported module") ||
    // MIME mismatch when server returns HTML for a missing .js
    msg.includes("expected a javascript") ||
    msg.includes("mime type")
  );
}

async function hardRecoverFromStaleChunks(): Promise<void> {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    // ignore
  }

  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch {
    // ignore
  }

  const url = new URL(window.location.href);
  url.searchParams.set("_chunk_reload", String(Date.now()));
  window.location.replace(url.toString());
}

export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      if (isChunkLoadError(error)) {
        const hasReloaded = sessionStorage.getItem(RELOAD_KEY);

        if (!hasReloaded) {
          sessionStorage.setItem(RELOAD_KEY, "true");
          console.warn(
            "[lazyWithRetry] Chunk load failed, clearing caches and hard-reloading..."
          );
          void hardRecoverFromStaleChunks();
          return new Promise(() => {});
        }

        sessionStorage.removeItem(RELOAD_KEY);
        console.error(
          "[lazyWithRetry] Chunk load failed even after reload. Propagating error."
        );
        throw error;
      }

      throw error;
    }
  });
}

/**
 * Clear the reload flag on successful page load.
 * Call this once in the app root (e.g., main.tsx or App.tsx).
 */
export function clearChunkReloadFlag() {
  sessionStorage.removeItem(RELOAD_KEY);
  // Drop cache-bust query from a previous hard recover so URL stays clean
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("_chunk_reload")) {
      url.searchParams.delete("_chunk_reload");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  } catch {
    // ignore
  }
}
