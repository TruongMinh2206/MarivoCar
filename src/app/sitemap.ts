import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

/**
 * Dynamic sitemap: static pages + one URL per active category, service and
 * published guide article.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticEntries: MetadataRoute.Sitemap = [
    "",
    "/contact",
    "/guide",
    "/my-bookings",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  // ── Category list pages + service detail pages ────────────────────────────
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true, category: { select: { slug: true } }, updatedAt: true },
  })

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/${service.category.slug}/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // ── Guide articles ────────────────────────────────────────────────────────
  const guides = await prisma.guide.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  })

  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guide/${guide.slug}`,
    lastModified: guide.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticEntries, ...categoryEntries, ...serviceEntries, ...guideEntries]
}
