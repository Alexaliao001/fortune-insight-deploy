import { build } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// Just run vite build with visualizer plugin
const result = await build({
  configFile: path.resolve(import.meta.dirname, 'vite.config.ts'),
  plugins: [
    visualizer({
      filename: 'bundle-stats.html',
      gzipSize: true,
      template: 'treemap',
    }),
  ],
});
