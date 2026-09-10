import { defineConfig } from "@playwright/test"

/**
 * Playwright config for the UI & link audit suite.
 * Separate from playwright.config.ts (which scopes testDir to ./e2e)
 * so the audit can live in audit/ without touching E2E defaults.
 */
export default defineConfig({
  // Resolved relative to this config file (audit/), so "." = the audit dir
  testDir: ".",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "off",
    video: "off",
    trace: "off",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
