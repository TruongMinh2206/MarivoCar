import { test, expect } from "@playwright/test"

/**
 * Home + footer content (Gói 3):
 *
 * 1. Popular Services cards — each card links to its own category
 *    (not all /airport-transfer) and shows VND prices (₫, no $)
 * 2. Explore Guides cards — link to real seeded guide articles
 * 3. Footer legal links — /privacy /terms /faq exist (HTTP 200, in sitemap)
 */

const POPULAR_CARDS = [
  { title: "Private Airport Transfer", href: "/airport-transfer", price: /350[.,]000/ },
  { title: "4 Islands Snorkeling Tour", href: "/tours", price: /1[.,]200[.,]000/ },
  { title: "VinWonders Full Day Pass", href: "/tickets", price: /950[.,]000/ },
  { title: "Premium Spa Package", href: "/spa", price: /400[.,]000/ },
]

const GUIDE_CARDS = [
  { title: "Top 10 Things to Do in Phu Quoc", slug: "top-10-things-to-do" },
  { title: "Phu Quoc Food Guide: What to Eat", slug: "phu-quoc-food-guide" },
  {
    title: "Getting Around Phu Quoc: Transportation Guide",
    slug: "phu-quoc-transportation-guide",
  },
]

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "FAQ", href: "/faq" },
]

test.describe("home: Popular Services cards", () => {
  test("each popular card links to its own category (4 distinct destinations)", async ({
    page,
  }) => {
    await page.goto("/")

    const hrefs: Array<string | null> = []
    for (const card of POPULAR_CARDS) {
      const link = page
        .getByRole("link", { name: new RegExp(card.title, "i") })
        .first()
      await expect(link).toBeVisible()
      hrefs.push(await link.getAttribute("href"))
    }

    // Card content matches its destination category
    for (let i = 0; i < POPULAR_CARDS.length; i++) {
      expect(hrefs[i]).toBe(POPULAR_CARDS[i].href)
    }

    // 4 cards → 4 different categories
    expect(new Set(hrefs).size).toBe(POPULAR_CARDS.length)
  })

  for (const card of POPULAR_CARDS) {
    test(`"${card.title}" navigates to ${card.href} with a VND price`, async ({
      page,
    }) => {
      await page.goto("/")

      const link = page
        .getByRole("link", { name: new RegExp(card.title, "i") })
        .first()
      await expect(link).toBeVisible()

      // Price is VND: seeded amount formatted vi-VN + ₫
      const cardText = (await link.textContent()) ?? ""
      expect(cardText).toMatch(card.price)
      expect(cardText).toContain("₫")

      await link.click()
      await expect(page).toHaveURL(new RegExp(`${card.href}$`))
    })
  }

  test("home page shows no USD ($) prices", async ({ page }) => {
    await page.goto("/")
    // innerText = visible text only (textContent would include inline
    // Next.js dev scripts that legitimately contain $ characters)
    const bodyText = (await page.locator("body").innerText()) ?? ""
    expect(bodyText).not.toContain("$")
  })
})

test.describe("home: Explore Guides cards", () => {
  for (const guide of GUIDE_CARDS) {
    test(`guide card "${guide.title}" navigates to /guide/${guide.slug}`, async ({
      page,
    }) => {
      await page.goto("/")

      const link = page
        .getByRole("link", { name: new RegExp(guide.title, "i") })
        .first()
      await expect(link).toBeVisible()

      await link.click()
      await expect(page).toHaveURL(new RegExp(`/guide/${guide.slug}$`))
    })
  }
})

test.describe("footer: legal links", () => {
  for (const link of LEGAL_LINKS) {
    test(`footer "${link.label}" → ${link.href} returns HTTP 200`, async ({
      page,
    }) => {
      await page.goto("/")

      const footerLink = page
        .getByRole("link", { name: link.label, exact: true })
        .first()
      await expect(footerLink).toBeVisible()
      expect(await footerLink.getAttribute("href")).toBe(link.href)

      const response = await page.request.get(link.href)
      expect(response.status()).toBe(200)
    })
  }

  test("legal pages are listed in the sitemap", async ({ request }) => {
    const response = await request.get("/sitemap.xml")
    expect(response.status()).toBe(200)

    const xml = await response.text()
    for (const link of LEGAL_LINKS) {
      expect(xml).toContain(`<loc>http://localhost:3000${link.href}</loc>`)
    }
  })
})
