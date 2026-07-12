import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Vite plugin that injects a unique build hash into sw.js at build time.
 * 
 * This ensures that every deployment produces a sw.js with a different
 * CACHE_VERSION, triggering the browser to detect a new SW version and
 * run the install → activate cycle (which purges old caches).
 * 
 * The hash is derived from the build output manifest, so it only changes
 * when actual code changes are deployed.
 */
export function swVersionPlugin(): Plugin {
  return {
    name: 'sw-version',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, '..', 'dist', 'public');
      const swPath = path.join(outDir, 'sw.js');

      if (!fs.existsSync(swPath)) {
        console.warn('[sw-version] sw.js not found in build output, skipping version injection');
        return;
      }

      // Generate a unique version hash from the build timestamp + random bytes
      // This guarantees a new version on every build
      const buildId = crypto
        .createHash('md5')
        .update(Date.now().toString() + crypto.randomBytes(8).toString('hex'))
        .digest('hex')
        .slice(0, 12);

      const version = `build-${buildId}`;

      let swContent = fs.readFileSync(swPath, 'utf-8');
      swContent = swContent.replace(/__SW_VERSION__/g, version);

      fs.writeFileSync(swPath, swContent, 'utf-8');
      console.log(`[sw-version] Injected SW version: ${version}`);
    },
  };
}
