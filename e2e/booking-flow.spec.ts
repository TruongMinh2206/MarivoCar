import { test, expect } from "@playwright/test"

/**
 * Full P0 booking flow (guest checkout):
 *
 * home → airport transfer list → service detail → booking wizard
 *   → quote + booking API → mock payment → success → my-bookings lookup
 */
test.describe("P0 booking flow", () => {
  test("home page lists seeded services", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    // Featured services load from the API (seeded data)
    const cards = page.locator("a[href*='/airport-transfer/'], a[href*='/tours/']")
    await expect(cards.first()).toBeVisible({ timeout: 15_000 })
    expect(await cards.count()).toBeGreaterThanOrEqual(3)
  })

  test("airport transfer list shows seeded services with filters", async ({ page }) => {
    await page.goto("/airport-transfer")

    // Page heading (exact h1 — service cards also contain "Airport Transfer" in h3)
    await expect(
      page.getByRole("heading", {
        name: "Airport Transfer in Phu Quoc",
        level: 1,
      })
    ).toBeVisible()

    // Seeded services render as cards linking to detail pages
    const detailLinks = page.locator("a[href*='/airport-transfer/']")
    await expect(detailLinks.first()).toBeVisible({ timeout: 15_000 })
    expect(await detailLinks.count()).toBeGreaterThanOrEqual(3)
  })

  test("service detail page shows booking info", async ({ page }) => {
    await page.goto("/airport-transfer")

    const firstCard = page.locator("a[href*='/airport-transfer/']").first()
    await firstCard.click()

    // Detail page has a way into the booking flow
    await expect(
      page.getByRole("link", { name: /book/i }).first()
    ).toBeVisible({ timeout: 15_000 })
  })

  test("guest completes the 4-step booking wizard end to end", async ({ page }) => {
    // ── Step 1: Trip information ────────────────────────────────────────────
    // Real seeded service slug (this used to be /booking/sedan, which only
    // worked by accident: the slug "sedan" matched no service and the old
    // wizard silently fell back to the airport sedan).
    await page.goto("/booking/airport-transfer-sedan")

    await expect(
      page.getByRole("heading", { name: /trip information/i })
    ).toBeVisible()

    await page
      .getByLabel(/destination|drop.?off/i)
      .or(page.locator('input[name="to"], #to').first())
      .fill("JW Marriott Phu Quoc")

    const today = new Date()
    const dateStr = today.toISOString().split("T")[0]
    await page
      .getByLabel(/date/i)
      .or(page.locator('input[type="date"], #date').first())
      .fill(dateStr)

    // #time is a <select> with morning/afternoon/evening options
    await page.locator("#time").selectOption("afternoon")

    await page.getByRole("button", { name: /continue|next/i }).first().click()

    // ── Step 2: Customer information ────────────────────────────────────────
    await expect(
      page.getByRole("heading", { name: /customer information/i })
    ).toBeVisible({ timeout: 10_000 })

    const email = `e2e-${Date.now()}@example.com`
    await page
      .getByLabel(/full name|name/i)
      .or(page.locator("#fullName").first())
      .fill("E2E Guest")

    await page
      .getByLabel(/email/i)
      .or(page.locator("#email").first())
      .fill(email)

    await page
      .getByLabel(/phone/i)
      .or(page.locator("#phone").first())
      .fill("+84999999999")

    await page.getByRole("button", { name: /continue|next/i }).first().click()

    // ── Step 3: Confirmation ───────────────────────────────────────────────
    await expect(
      page.getByRole("heading", { name: /confirmation|confirm/i })
    ).toBeVisible({ timeout: 10_000 })

    // Submit the booking (persists via /api/quotes + /api/bookings)
    await page.getByRole("button", { name: /pay now/i }).first().click()

    // ── Step 4: Processing → Complete ────────────────────────────────────────
    await expect(
      page.getByText(/booking reference|MRV/i).first()
    ).toBeVisible({ timeout: 30_000 })
  })

  test("my-bookings lookup finds the guest booking by email", async ({ page }) => {
    // Create a booking through the API (fast path for the lookup test)
    const createRes = await page.request.post("/api/quotes", {
      data: {
        serviceId: "cmtuhvfuu000tfyq8stoq3hb6",
        tripType: "ONE_WAY",
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        passengers: 2,
        luggage: 1,
      },
    })
    expect(createRes.ok()).toBeTruthy()
    const quote = (await createRes.json()).data

    const bookingRes = await page.request.post("/api/bookings", {
      data: {
        quoteId: quote.quoteId,
        customer: {
          fullName: "Lookup Guest",
          email: "lookup@example.com",
          phone: "+84988888888",
        },
      },
    })
    expect(bookingRes.ok()).toBeTruthy()
    const booking = (await bookingRes.json()).data

    // ── Lookup in the UI ─────────────────────────────────────────────────────
    await page.goto("/my-bookings")
    await page
      .getByPlaceholder(/enter your email/i)
      .fill("lookup@example.com")
    await page.getByRole("button", { name: /search/i }).click()

    await expect(
      page.getByText(booking.bookingCode).first()
    ).toBeVisible({ timeout: 15_000 })
  })

  test("mock payment webhook flow updates booking to PAID", async ({ page }) => {
    // Create a fresh booking via API
    const createRes = await page.request.post("/api/quotes", {
      data: {
        serviceId: "cmtuhvfuu000tfyq8stoq3hb6",
        tripType: "ONE_WAY",
        date: new Date().toISOString().split("T")[0],
        time: "16:00",
        passengers: 1,
        luggage: 0,
      },
    })
    const quote = (await createRes.json()).data

    const bookingRes = await page.request.post("/api/bookings", {
      data: {
        quoteId: quote.quoteId,
        customer: {
          fullName: "Pay Guest",
          email: "pay@example.com",
          phone: "+84977777777",
        },
      },
    })
    const booking = (await bookingRes.json()).data

    // Initialize payment with the mock provider
    const payRes = await page.request.post("/api/payments", {
      data: { bookingId: booking.id, provider: "mock" },
    })
    expect(payRes.ok()).toBeTruthy()
    const payment = (await payRes.json()).data

    // Simulate the provider success callback (what the mock page does)
    const webhookRes = await page.request.post(
      "/api/payments/webhook?provider=mock",
      {
        data: {
          transactionId: payment.paymentUrl.match(/txn=([^&]+)/)?.[1],
          amount: payment.amount,
          currency: payment.currency,
          status: "PAID",
        },
      }
    )
    expect(webhookRes.ok()).toBeTruthy()
    expect(((await webhookRes.json()).success) ?? true).toBeTruthy()

    // The booking must now be PAID
    const detailRes = await page.request.get(`/api/bookings/${booking.id}`)
    const detail = (await detailRes.json()).data
    expect(detail.status).toBe("PAID")

    // Success page renders the real booking data
    const successPage = await page.goto(
      `/payment/success?booking=${booking.bookingCode}`
    )
    await expect(
      page.getByText(booking.bookingCode).first()
    ).toBeVisible({ timeout: 10_000 })
    expect(successPage?.status()).toBe(200)
  })
})
