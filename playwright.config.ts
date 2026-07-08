import {defineConfig, devices} from '@playwright/test';

// End-to-end tests for the core shopping journeys, run against a Hydrogen dev
// server on port 4321. If one is already running (e.g. the local preview), it's
// reused; otherwise Playwright starts one.
const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Serial against the single shared dev server to avoid request contention.
  workers: 1,
  reporter: process.env.CI ? 'github' : [['list']],
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome']}},
    {name: 'mobile', use: {...devices['Pixel 7']}},
  ],
  webServer: {
    command: 'npm run dev -- --port 4321',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
