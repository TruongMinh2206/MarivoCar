import { test, expect } from "@playwright/test"

/**
 * Legacy [id] detail pages → dynamic DB-backed detail pages.
 *
 * Context: seven category folders used to ship static [id] detail routes
 * (hotels, tours, tickets, spa, products, restaurants, rent-a-car) that
 * rendered hardcoded data with dead booking links (/booking/20, /booking/40,
 * /booking/${room.name}). In Next.js App Router those routes shadowed the
 * DB-backed [category]/[slug] route for the same URL shape, so users saw
 * fabricated services instead of seeded ones.
 *
 * This spec locks in the correct behavior:
 *   1. /<category>/<slug> renders the DB service (name, price) — not legacy
 *      hardcoded content.
 *   2. Book Now navigates to the wizard with the contract URL
 *      /booking/<slug>?serviceId=<cuid>.
 *   3. /rent-a-car and /products list pages show the seeded services (M4).
 *   4. Numeric legacy URLs (/hotels/1) fall through to the dynamic route and
 *      surface the error state instead of a fabricated detail page.
 */
const BASE = "http://localhost:3100"

// Seeded slugs — see prisma/seed.ts
const DB_SERVICES = [
  {
    slug: "four-islands-tour",
    category: "tours",
    name: "4 Islands Tour by Speedboat",
    basePrice: 1_200_000,
  },
  {
    slug: "jw-marriott-phu-quoc-emerald-bay",
    category: "hotels",
    name: "JW Marriott Phu Quoc Emerald Bay Resort & Spa",
    basePrice: 5_000_000,
  },
  {
    slug: "phu-quoc-spa-retreat",
    category: "spa",
    name: "Phu Quoc Spa Retreat",
    basePrice: 400_000,
  },
] as const

function vnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount)
}

test.describe("DB-backed detail pages replace legacy [id] pages", () => {
  for (const svc of DB_SERVICES) {
    test(`detail page /${svc.category}/${svc.slug} renders DB service data`, async ({
      page,
    }) => {
      await page.goto(`${BASE}/${svc.category}/${svc.slug}`)

      // The DB name renders as the page h1 — legacy pages showed hardcoded
      // names ("4 Islands Snorkeling Tour", "Premier Village Phu Quoc") that
      // do not match this seeded name.
      await expect(
        page.getByRole("heading", { level: 1, name: svc.name })
      ).toBeVisible({ timeout: 20_000 })

      // The DB price (formatted vi-VN) renders in the sidebar; legacy pages
      // showed USD prices ($150 / $220) instead of seeded VND prices.
      await expect(page.getByText(`${vnd(svc.basePrice)} ₫`).first()).toBeVisible({
        timeout: 10_000,
      })
    })
  }

  test("detail page Book Now navigates to wizard with contract URL", async ({
    page,
  }) => {
    await page.goto(`${BASE}/tours/four-islands-tour`)

    // Contract: /booking/<slug>?serviceId=<cuid> — emitted by this page,
    // consumed by the booking wizard (Gói 1).
    const bookNow = page.getByRole("link", { name: /book now/i }).first()
    await expect(bookNow).toBeVisible({ timeout: 20_000 })

    const href = await bookNow.getAttribute("href")
    expect(href).toMatch(
      /^\/booking\/four-islands-tour\?serviceId=[a-z0-9]{20,}$/
    )

    await bookNow.click()
    await page.waitForURL(/\/booking\/four-islands-tour\?serviceId=/)
    await expect(
      page.getByRole("heading", { name: /trip information/i })
    ).toBeVisible({ timeout: 20_000 })
  })

  test("numeric legacy URL /hotels/1 surfaces error state, not legacy content", async ({
    page,
  }) => {
    await page.goto(`${BASE}/hotels/1`)

    // With the legacy [id] route gone, /hotels/1 falls through to
    // [category]/[slug]; the service API 404s for slug "1" and the page
    // renders its error state instead of a fabricated hotel detail page.
    await expect(
      page.getByText(/service not found/i).first()
    ).toBeVisible({ timeout: 20_000 })

    // Legacy hardcoded content must NOT render.
    await expect(page.getByText("Premier Village Phu Quoc")).toHaveCount(0)
  })

  test("rent-a-car list shows seeded self-drive services", async ({ page }) => {
    await page.goto(`${BASE}/rent-a-car`)

    const cards = page.locator("a[href*='/rent-a-car/']")
    await expect(cards.first()).toBeVisible({ timeout: 20_000 })
    expect(await cards.count()).toBeGreaterThanOrEqual(2)
  })

  test("products list shows seeded local specialties", async ({ page }) => {
    await page.goto(`${BASE}/products`)

    const cards = page.locator("a[href*='/products/']")
    await expect(cards.first()).toBeVisible({ timeout: 20_000 })
    expect(await cards.count()).toBeGreaterThanOrEqual(2)
  })
})
