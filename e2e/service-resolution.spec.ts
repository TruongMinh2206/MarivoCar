import { test, expect } from "@playwright/test"

/**
 * Gói 1 — C1/C2 regression suite: the booking wizard must resolve the
 * REAL service from the URL (`?serviceId=` param first, then slug segment,
 * then cuid segment) and must NOT silently fall back to the sedan airport
 * transfer when the service doesn't exist.
 *
 * Seeded services (prisma/seed.ts) used here:
 *   - slug "four-islands-tour" → "4 Islands Tour by Speedboat", 1,200,000₫
 *   - slug "airport-transfer-sedan" → 350,000₫ (the old hardcoded fallback)
 */
test.describe("booking wizard service resolution", () => {
  test("slug segment with hyphens resolves the real tour service", async ({ page }) => {
    // The old regex /^[a-z0-9]{20,}$/ failed on the hyphens → sedan fallback.
    await page.goto("/booking/four-islands-tour")

    // Wizard must show the tour's name somewhere — and crucially NOT the
    // sedan fallback name.
    await expect(
      page.getByRole("heading", { name: /trip information/i })
    ).toBeVisible({ timeout: 15_000 })

    await expect(page.getByText(/4 islands tour/i).first()).toBeVisible()
  })

  test("?serviceId= param wins and prices the wizard with the real base price", async ({ page }) => {
    // Look up the real tour service id via the public API (slug is stable in seed)
    const res = await page.request.get("/api/services/four-islands-tour")
    expect(res.ok()).toBeTruthy()
    const service = (await res.json()).data as {
      id: string
      name: string
      basePrice: string
    }
    expect(service.name).toMatch(/4 islands/i)

    await page.goto(`/booking/four-islands-tour?serviceId=${service.id}`)

    // Fill step 1
    await expect(
      page.getByRole("heading", { name: /trip information/i })
    ).toBeVisible({ timeout: 15_000 })

    await page
      .getByLabel(/destination|drop.?off/i)
      .or(page.locator('input[name="to"], #to').first())
      .fill("Hon Thom Cable Car Station")

    const dateStr = new Date().toISOString().split("T")[0]
    await page
      .getByLabel(/date/i)
      .or(page.locator('input[type="date"], #date').first())
      .fill(dateStr)
    await page.locator("#time").selectOption("afternoon")
    await page.getByRole("button", { name: /continue|next/i }).first().click()

    // Fill step 2
    await expect(
      page.getByRole("heading", { name: /customer information/i })
    ).toBeVisible({ timeout: 10_000 })
    await page
      .getByLabel(/full name|name/i)
      .or(page.locator("#fullName").first())
      .fill("Resolver Guest")
    await page
      .getByLabel(/email/i)
      .or(page.locator("#email").first())
      .fill(`resolver-${Date.now()}@example.com`)
    await page
      .getByLabel(/phone/i)
      .or(page.locator("#phone").first())
      .fill("+84991234567")
    await page.getByRole("button", { name: /continue|next/i }).first().click()

    // Step 3: confirmation — the sidebar total must be priced from the tour's
    // real basePrice (C2 regression: was hardcoded 350,000 → 350k-based math).
    await expect(
      page.getByRole("heading", { name: /confirmation|confirm/i })
    ).toBeVisible({ timeout: 10_000 })

    const basePrice = Number(service.basePrice)
    // One-way: base + 5% service fee (mirrors server price-engine)
    const expectedTotal = Math.round(basePrice * 1.05)
    await expect(
      page.getByText(expectedTotal.toLocaleString("vi-VN")).first()
    ).toBeVisible()

    // Submit — the persisted booking must reference the TOUR, not the sedan.
    await page.getByRole("button", { name: /pay now/i }).first().click()
    await expect(
      page.getByText(/MRV/i).first()
    ).toBeVisible({ timeout: 30_000 })

    const code = await page
      .getByText(/MRV\w+/i)
      .first()
      .textContent()
    const bookingCode = (code ?? "").match(/MRV[\w-]+/i)?.[0]
    expect(bookingCode).toBeTruthy()

    const detailRes = await page.request.get(`/api/bookings/${bookingCode}`)
    expect(detailRes.ok()).toBeTruthy()
    const detail = (await detailRes.json()).data as {
      items: Array<{ serviceId: string }>
    }
    expect(detail.items[0].serviceId).toBe(service.id)
  })

  test("unknown slug shows a not-found state instead of silently booking the sedan", async ({ page }) => {
    await page.goto("/booking/khong-ton-tai")

    // No silent fallback: wizard steps must NOT render; a friendly
    // "not found" message with a way back to the catalog must.
    await expect(
      page.getByRole("heading", { name: /service not found|not found/i })
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      page.getByRole("heading", { name: /trip information/i })
    ).not.toBeVisible()

    // A route back to the catalog exists
    await expect(
      page.getByRole("link", { name: /browse|back|home|services/i }).first()
    ).toBeVisible()
  })

  test("legacy numeric segment /booking/20 shows the not-found state too", async ({ page }) => {
    await page.goto("/booking/20")

    await expect(
      page.getByRole("heading", { name: /service not found|not found/i })
    ).toBeVisible({ timeout: 15_000 })
    await expect(
      page.getByRole("heading", { name: /trip information/i })
    ).not.toBeVisible()
  })

  test("plain cuid segment still resolves (legacy deep links keep working)", async ({ page }) => {
    const res = await page.request.get("/api/services/airport-transfer-sedan")
    const service = (await res.json()).data as { id: string }

    await page.goto(`/booking/${service.id}`)

    await expect(
      page.getByRole("heading", { name: /trip information/i })
    ).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/airport transfer/i).first()).toBeVisible()
  })
})
