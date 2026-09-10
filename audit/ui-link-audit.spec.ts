import { test } from "@playwright/test"
import fs from "node:fs/promises"

/**
 * UI & Link Audit for MARIVO.vn
 *
 * 1. Visits every public page and saves a screenshot to audit/screenshots/
 * 2. Clicks key CTAs (nav links, service cards, Book Now buttons) and
 *    verifies the destination URL matches the link's href intent
 *
 * Output: audit/audit-results.json (consumed by the report writer)
 * Run: npx playwright test audit/ui-link-audit.spec.ts
 */

const BASE = "http://localhost:3000"
const SHOT_DIR = "audit/screenshots"

type Finding = {
  page: string
  action: string
  status: "PASS" | "WARN" | "FAIL"
  detail: string
}

const PAGES: Array<{ name: string; path: string }> = [
  { name: "home", path: "/" },
  { name: "airport-transfer", path: "/airport-transfer" },
  { name: "airport-transfer-detail", path: "/airport-transfer/airport-transfer-sedan" },
  { name: "private-car", path: "/private-car" },
  { name: "rent-a-car", path: "/rent-a-car" },
  { name: "tours", path: "/tours" },
  { name: "tours-detail", path: "/tours/four-islands-tour" },
  { name: "tickets", path: "/tickets" },
  { name: "hotels", path: "/hotels" },
  { name: "hotels-detail-legacy", path: "/hotels/1" },
  { name: "restaurants", path: "/restaurants" },
  { name: "spa", path: "/spa" },
  { name: "products", path: "/products" },
  { name: "taxi", path: "/taxi" },
  { name: "guide", path: "/guide" },
  { name: "guide-article", path: "/guide/top-10-things-to-do" },
  { name: "contact", path: "/contact" },
  { name: "my-bookings", path: "/my-bookings" },
  { name: "login", path: "/login" },
  { name: "register", path: "/register" },
  { name: "forgot-password", path: "/forgot-password" },
  { name: "booking-wizard", path: "/booking/cmtuhvfuu000tfyq8stoq3hb6" },
  { name: "booking-legacy-id", path: "/booking/20" },
]

const findings: Finding[] = []

function log(f: Finding) {
  findings.push(f)
  const icon = f.status === "PASS" ? "PASS" : f.status === "WARN" ? "WARN" : "FAIL"
  console.log(`[${icon}] ${f.page} | ${f.action} | ${f.detail}`)
}

test.describe("UI & link audit", () => {
  let shotIndex = 0

  // ─── 1. Capture every public page ─────────────────────────────────────────
  for (const p of PAGES) {
    test(`capture: ${p.name} (${p.path})`, async ({ page }) => {
      test.setTimeout(30_000)
      await page.setViewportSize({ width: 1280, height: 800 })
      const resp = await page.goto(`${BASE}${p.path}`, { waitUntil: "domcontentloaded" })
      const status = resp?.status() ?? 0

      if (status >= 400) {
        log({
          page: p.name,
          action: "page load",
          status: "FAIL",
          detail: `HTTP ${status} on ${p.path}`,
        })
        return
      }

      // Allow client-side data fetching to settle
      await page.waitForLoadState("networkidle").catch(() => {})
      await page.waitForTimeout(1_000)

      const file = `${SHOT_DIR}/${String(shotIndex++).padStart(2, "0")}-${p.name}.png`
      await page.screenshot({ path: file, fullPage: true })

      log({
        page: p.name,
        action: "page load",
        status: "PASS",
        detail: `HTTP ${status}, screenshot → ${file}`,
      })
    })
  }

  // ─── 2. CTA click verification ─────────────────────────────────────────────

  test("home: hero Search → /airport-transfer", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Search" }).first().click()
    await page.waitForURL(/\/airport-transfer/)
    log({ page: "home", action: "click hero Search", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("home: category grid Taxi → /taxi", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Taxi" }).first().click()
    await page.waitForURL(/\/taxi/)
    log({ page: "home", action: "click Taxi category tile", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("home: category grid Spa → /spa", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Spa" }).first().click()
    await page.waitForURL(/\/spa/)
    log({ page: "home", action: "click Spa category tile", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("home: Popular Services card destination", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: /Private Airport Transfer/i }).first().click()
    await page.waitForURL(/\/airport-transfer/)
    const url = page.url()
    // All 4 "Popular Services" cards (transfer/tour/ticket/spa) link to the
    // same /airport-transfer list — card content and destination do not match.
    log({
      page: "home",
      action: "click Popular Services card",
      status: "WARN",
      detail: `→ ${url} — every popular card hardcodes /airport-transfer regardless of card type`,
    })
  })

  test("home: CTA Book Airport Transfer → /airport-transfer", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Book Airport Transfer" }).first().click()
    await page.waitForURL(/\/airport-transfer/)
    log({ page: "home", action: "click Book Airport Transfer CTA", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("home: CTA Explore Tours → /tours", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Explore Tours" }).first().click()
    await page.waitForURL(/\/tours/)
    log({ page: "home", action: "click Explore Tours CTA", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("nav: Airport Transfer → /airport-transfer", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Airport Transfer", exact: true }).first().click()
    await page.waitForURL(/\/airport-transfer$/)
    log({ page: "nav", action: "click Airport Transfer", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("nav: Guide → /guide", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Guide", exact: true }).first().click()
    await page.waitForURL(/\/guide/)
    log({ page: "nav", action: "click Guide", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("nav: Sign In → /login", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Sign In", exact: true }).first().click()
    await page.waitForURL(/\/login/)
    log({ page: "nav", action: "click Sign In", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("footer: Rent a Car → /rent-a-car", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Rent a Car" }).first().click()
    await page.waitForURL(/\/rent-a-car/)
    log({ page: "footer", action: "click Rent a Car", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("footer: Contact Us → /contact", async ({ page }) => {
    await page.goto(BASE)
    await page.getByRole("link", { name: "Contact Us" }).first().click()
    await page.waitForURL(/\/contact/)
    log({ page: "footer", action: "click Contact Us", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("category: service card → detail page", async ({ page }) => {
    await page.goto(`${BASE}/airport-transfer`)
    const firstCard = page.locator("a[href*='/airport-transfer/']").first()
    await firstCard.click()
    await page.waitForURL(/\/airport-transfer\/.+$/)
    log({ page: "airport-transfer", action: "click service card", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("category: card → Book Now → booking wizard", async ({ page }) => {
    await page.goto(`${BASE}/airport-transfer`)
    await page.locator("a[href*='/airport-transfer/']").first().click()
    await page.waitForURL(/\/airport-transfer\/.+$/)
    await page.getByRole("link", { name: /book now/i }).first().click()
    await page.waitForURL(/\/booking\//)
    log({ page: "service-detail", action: "click Book Now", status: "PASS", detail: `→ ${page.url()}` })
  })

  test("booking wizard: step 1 → 2 transition", async ({ page }) => {
    await page.goto(`${BASE}/booking/cmtuhvfuu000tfyq8stoq3hb6`)
    const heading = page.getByRole("heading", { name: /trip information/i })
    await heading.waitFor({ timeout: 15_000 })
    await page.locator("#to").fill("JW Marriott Phu Quoc")
    await page.locator("#date").fill(new Date().toISOString().split("T")[0])
    await page.locator("#time").selectOption("afternoon")
    await page.getByRole("button", { name: /continue/i }).first().click()
    await page
      .getByRole("heading", { name: /customer information/i })
      .waitFor({ timeout: 10_000 })
    log({ page: "booking-wizard", action: "step 1 continue", status: "PASS", detail: "step 1 → step 2 works" })
  })

  test("my-bookings: guest lookup form", async ({ page }) => {
    await page.goto(`${BASE}/my-bookings`)
    await page.getByPlaceholder(/enter your email/i).waitFor({ timeout: 10_000 })
    log({ page: "my-bookings", action: "render lookup form", status: "PASS", detail: "email lookup input present" })
  })

  test("login: wrong password shows error", async ({ page }) => {
    await page.goto(`${BASE}/login`)
    const email = page.locator('input[type="email"], #email').first()
    const password = page.locator('input[type="password"], #password').first()
    await email.waitFor({ timeout: 10_000 })
    await email.fill("admin@marivo.vn")
    await password.fill("wrong-password")
    await page.getByRole("button", { name: /sign in|log in/i }).first().click()
    await page
      .getByText(/invalid|incorrect|error|failed/i)
      .first()
      .waitFor({ timeout: 10_000 })
    log({ page: "login", action: "submit wrong password", status: "PASS", detail: "error surfaced, no crash" })
  })

  // ─── 3. Write results ──────────────────────────────────────────────────────
  test.afterAll(async () => {
    const counts = { pass: 0, warn: 0, fail: 0 }
    for (const f of findings) {
      if (f.status === "PASS") counts.pass += 1
      else if (f.status === "WARN") counts.warn += 1
      else counts.fail += 1
    }
    await fs.writeFile(
      "audit/audit-results.json",
      JSON.stringify(
        { generatedAt: new Date().toISOString(), counts, findings },
        null,
        2
      )
    )
    console.log(
      `\nAudit complete: ${counts.pass} PASS / ${counts.warn} WARN / ${counts.fail} FAIL`
    )
  })
})
