import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

/**
 * Playwright E2E regression suite for Farmart.
 * See https://playwright.dev/docs/test-configuration.
 *
 * - `npx playwright test`        run every spec in `e2e/` against every project
 * - `npx playwright show-report` open the HTML report (pass/fail per project)
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* `next dev` compiles routes on first hit, so allow extra time per test. */
  timeout: 60_000,
  expect: { timeout: 15_000 },
  /* HTML report groups results by project; `list` keeps terminal output readable. */
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    /* Firefox is opt-in (`PW_FIREFOX=1 npx playwright test`): the bundled
       Firefox build fails to launch on some macOS versions ("Could not find profile folder"). */
    ...(process.env.PW_FIREFOX
      ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }]
      : []),
  ],

  /* Start the Next.js dev server (seeds SQLite on first API hit) before the tests. */
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
