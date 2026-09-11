import { defineConfig, devices } from "@playwright/test"

/**
 * E2E config for the MARIVO P0 flow.
 *
 * Tests run against `next dev` (webServer) so they hit the real API routes
 * and the seeded MySQL database.
 *
 * Parallel agents/worktrees each get their own port via E2E_PORT so they
 * don't reuse each other's dev server (reuseExistingServer would otherwise
 * bind to whichever server already holds the port).
 */
const port = process.env.E2E_PORT || "3000"
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${port}`

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npm run dev -- -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
