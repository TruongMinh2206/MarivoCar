import { defineConfig, devices } from "@playwright/test"
import path from "node:path"

/**
 * Playwright config for running the E2E suite against THIS worktree.
 *
 * The default playwright.config.ts targets port 3000 with
 * reuseExistingServer, which in a multi-worktree setup (five agents
 * sharing one MySQL instance) silently tests whatever worktree owns
 * port 3000 — not necessarily this one. This config always boots its
 * own `next dev` on port 3100 so results validate this working tree.
 *
 * Run all specs:    npx playwright test -c e2e/playwright.worktree.config.ts
 * Run one spec:     npx playwright test -c e2e/playwright.worktree.config.ts booking-flow.spec.ts
 */
export default defineConfig({
  testDir: ".",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npx next dev -p 3100",
    cwd: path.resolve(__dirname, ".."),
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
