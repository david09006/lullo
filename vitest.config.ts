import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';

// Standalone Vitest config — intentionally does NOT load the Hydrogen/Oxygen/
// React-Router Vite plugins (those target the Workers runtime and conflict with
// a jsdom unit-test environment). Unit tests cover pure logic (cart, bundles,
// money, utils) and light component rendering.
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['app/**/*.{test,spec}.{ts,tsx}', 'test/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
});
