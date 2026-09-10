import type { MetadataRoute } from "next"

/**
 * Robots rules: allow all crawlers except private flows (booking, payment,
 * vouchers, admin, account pages).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/booking",
        "/payment",
        "/my-bookings",
        "/voucher",
        "/login",
        "/register",
        "/reset-password",
        "/forgot-password",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
