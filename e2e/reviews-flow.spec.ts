import { test, expect } from "@playwright/test"

/**
 * Guest review flow: create a booking through the API, post a review for it,
 * then verify the review is visible on the service detail page.
 *
 * Mirrors the API-driven pattern of booking-flow.spec.ts:112-150.
 */

const SERVICE_ID = "cmtuhvfuu000tfyq8stoq3hb6" // Airport Transfer - Sedan (seeded)
const SERVICE_DETAIL_URL = "/airport-transfer/airport-transfer-sedan"
const REVIEWER_EMAIL = "reviewer@example.com"

test.describe("Guest review flow", () => {
  test("posted review appears on the service detail page", async ({ page }) => {
    // ── Step 1: Create a booking through the API ─────────────────────────────
    const createRes = await page.request.post("/api/quotes", {
      data: {
        serviceId: SERVICE_ID,
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
          fullName: "Review Guest",
          email: REVIEWER_EMAIL,
          phone: "+84986666666",
        },
      },
    })
    expect(bookingRes.ok()).toBeTruthy()
    const booking = (await bookingRes.json()).data

    // ── Step 2: Post a review via the API (201 expected) ────────────────────
    const reviewRes = await page.request.post("/api/reviews", {
      data: {
        serviceId: SERVICE_ID,
        bookingCode: booking.bookingCode,
        email: REVIEWER_EMAIL,
        rating: 5,
        comment: `E2E: excellent sedan transfer (${booking.bookingCode})`,
      },
    })
    expect(reviewRes.status()).toBe(201)
    const review = (await reviewRes.json()).data
    expect(review.rating).toBe(5)

    // ── Step 3: Open the service detail page ────────────────────────────────
    await page.goto(SERVICE_DETAIL_URL)

    // The booking CTA is still intact (package-5 must not break it)
    await expect(
      page.getByRole("link", { name: /^book now$/i })
    ).toBeVisible({ timeout: 15_000 })

    // ── Step 4: The review shows up in the reviews section ──────────────────
    // <section aria-labelledby="reviews-heading"> is exposed as a region
    const reviewsSection = page.getByRole("region", { name: /^reviews$/i })
    await expect(reviewsSection).toBeVisible()

    await expect(
      reviewsSection.getByText(
        `E2E: excellent sedan transfer (${booking.bookingCode})`
      )
    ).toBeVisible({ timeout: 15_000 })
  })

  test("404 page renders for a non-existent URL", async ({ page }) => {
    await page.goto("/this-page-does-not-exist")

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /washed away with the tide/i
    )
    await expect(
      page.getByRole("link", { name: /back to home/i })
    ).toBeVisible()
    // Category chips link to real sections
    await expect(
      page.getByRole("link", { name: /^tours$/i })
    ).toBeVisible()
  })

  test("review with mismatched email is rejected with 403", async ({ page }) => {
    // Booking created with reviewer@example.com
    const createRes = await page.request.post("/api/quotes", {
      data: {
        serviceId: SERVICE_ID,
        tripType: "ONE_WAY",
        date: new Date().toISOString().split("T")[0],
        time: "11:00",
        passengers: 1,
        luggage: 0,
      },
    })
    const quote = (await createRes.json()).data

    const bookingRes = await page.request.post("/api/bookings", {
      data: {
        quoteId: quote.quoteId,
        customer: {
          fullName: "Mismatch Guest",
          email: "owner@example.com",
          phone: "+84985555555",
        },
      },
    })
    expect(bookingRes.ok()).toBeTruthy()
    const booking = (await bookingRes.json()).data

    // Someone else tries to review the booking
    const reviewRes = await page.request.post("/api/reviews", {
      data: {
        serviceId: SERVICE_ID,
        bookingCode: booking.bookingCode,
        email: "attacker@example.com",
        rating: 1,
        comment: "should not be accepted",
      },
    })
    expect(reviewRes.status()).toBe(403)
  })
})
