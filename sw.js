/**
 * Service Worker - Fortune Insight
 * 
 * Deployment-aware caching strategy:
 * 
 * 1. CACHE_VERSION is injected at build time via Vite plugin (or manually bumped).
 *    When a new version deploys, the SW file changes → browser detects update →
 *    install event fires → activate purges ALL old caches → clients get notified.
 * 
 * 2. Hashed assets (/assets/*): Cache First, immutable (hash change = new URL).
 * 3. HTML/navigation: Network First, always fetch fresh (server sends max-age=0).
 * 4. API: Network First with offline fallback.
 * 5. Images/media: Cache First with 7-day soft limit.
 * 
 * Key behaviors on new deployment:
 * - skipWaiting(): new SW activates immediately (no waiting for old tabs to close)
 * - activate purges ALL caches from previous versions
 * - postMessage('SW_UPDATED') notifies all clients → app shows update banner
 */

// build-9ddc4cf7303f is replaced at build time by the Vite plugin.
// If not replaced (dev mode), falls back to a timestamp-based version.
const CACHE_VERSION = typeof 'build-9ddc4cf7303f' !== 'undefined' 
  ? 'build-9ddc4cf7303f' 
  : 'dev-' + Date.now();

const CACHE_PREFIX = 'fortune-';
const STATIC_CACHE = `${CACHE_PREFIX}static-${CACHE_VERSION}`;
const API_CACHE = `${CACHE_PREFIX}api-${CACHE_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}images-${CACHE_VERSION}`;

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version: ${CACHE_VERSION}`);
  // Skip waiting so the new SW takes over immediately
  event.waitUntil(self.skipWaiting());
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version: ${CACHE_VERSION}`);
  event.waitUntil(
    (async () => {
      // 1. Purge ALL caches that don't match the current version
      const cacheNames = await caches.keys();
      const deletions = cacheNames
        .filter((name) => {
          // Delete any fortune-* cache that doesn't end with current version
          if (!name.startsWith(CACHE_PREFIX)) return false;
          return name !== STATIC_CACHE && name !== API_CACHE && name !== IMAGE_CACHE;
        })
        .map((name) => {
          console.log(`[SW] Purging old cache: ${name}`);
          return caches.delete(name);
        });
      await Promise.all(deletions);

      // 2. Take control of all open tabs immediately
      await self.clients.claim();

      // 3. Notify all clients that a new version is active
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_UPDATED',
          version: CACHE_VERSION,
        });
      });

      console.log(`[SW] Version ${CACHE_VERSION} is now active, ${deletions.length} old caches purged`);
    })()
  );
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function isHashedAsset(url) {
  // Vite/Rollup hashes are base64-ish (mixed case), not pure hex:
  // /assets/Home-BkIMASkO.js, /assets/vendor-C87DU7gg.js
  return (
    url.pathname.startsWith('/assets/') &&
    /\.[A-Za-z0-9_-]{6,}\.(js|css|mjs)$/.test(url.pathname)
  );
}

function isImageOrMedia(url) {
  return /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|mp3|mp4)$/i.test(url.pathname);
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

function shouldSkip(url) {
  // Skip third-party, non-http, chrome-extension, etc.
  if (!url.protocol.startsWith('http')) return true;
  if (url.hostname.includes('stripe')) return true;
  if (url.hostname.includes('umami')) return true;
  // Only cache same-origin assets
  if (url.origin !== self.location.origin) return true;
  return false;
}

// ─── Cache Strategies ───────────────────────────────────────────────────────

/** Cache First for hashed assets (immutable by nature) */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  // Never reuse a cached non-JS/CSS body for asset URLs (e.g. stale HTML 200)
  if (cached) {
    const ct = cached.headers.get('content-type') || '';
    const isAssetOk =
      ct.includes('javascript') ||
      ct.includes('css') ||
      ct.includes('application/json') ||
      ct.includes('wasm') ||
      ct.includes('font');
    if (cached.ok && isAssetOk) return cached;
    // Drop bad cache entry and refetch
    try {
      const cache = await caches.open(cacheName);
      await cache.delete(request);
    } catch {
      // ignore
    }
  }

  try {
    const response = await fetch(request);
    const ct = response.headers.get('content-type') || '';
    const isAssetOk =
      ct.includes('javascript') ||
      ct.includes('css') ||
      ct.includes('application/json') ||
      ct.includes('wasm') ||
      ct.includes('font');
    // Only cache real successful asset responses (never HTML SPA fallback)
    if (response.ok && isAssetOk) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const fallback = await caches.match(request);
    if (fallback) return fallback;
    throw err;
  }
}

/** Network First for HTML navigation and API */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

/** Network First for navigation with offline fallback to cached index.html */
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put('/', response.clone());
    }
    return response;
  } catch (err) {
    // Offline: serve cached index.html (SPA router handles the rest)
    const cached = await caches.match('/');
    if (cached) return cached;
    throw err;
  }
}

// ─── Fetch Handler ──────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (shouldSkip(url)) return;

  // Navigation (HTML pages) → always Network First
  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(request));
    return;
  }

  // Hashed assets → Cache First (immutable)
  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // API → Network First with offline fallback
  if (isApiRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Images/media → Cache First
  if (isImageOrMedia(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Same-origin other resources → Network First (catch new SW.js, manifest, etc.)
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }
});

// ─── Push Notifications ─────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        data: data.url,
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(self.clients.openWindow(event.notification.data));
  }
});
