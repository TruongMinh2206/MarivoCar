import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getPaginationParams } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = getPaginationParams(request)
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rating = searchParams.get("rating")
    const sort = searchParams.get("sort") || "popular"
    const featured = searchParams.get("featured")

    // Build where clause
    const where: Record<string, unknown> = { isActive: true }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ]
    }

    if (minPrice || maxPrice) {
      where.basePrice = {}
      if (minPrice) (where.basePrice as Record<string, number>).gte = Number(minPrice)
      if (maxPrice) (where.basePrice as Record<string, number>).lte = Number(maxPrice)
    }

    if (rating) {
      where.rating = { gte: Number(rating) }
    }

    if (featured === "true") {
      where.isFeatured = true
    }

    // Build orderBy
    let orderBy: Record<string, string>
    switch (sort) {
      case "price_asc":
        orderBy = { basePrice: "asc" }
        break
      case "price_desc":
        orderBy = { basePrice: "desc" }
        break
      case "rating":
        orderBy = { rating: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      default: // popular
        orderBy = { reviewCount: "desc" }
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true, icon: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true, alt: true, isPrimary: true },
          },
          location: {
            select: { name: true, area: true },
          },
          vehicles: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              seats: true,
              luggage: true,
              pricePerTrip: true,
              vehicleType: {
                select: { name: true, slug: true },
              },
            },
            take: 3,
          },
          tour: {
            select: { duration: true, capacity: true },
          },
          ticket: {
            select: { validFrom: true, validUntil: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ])

    return successResponse(services, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return errorResponse(error)
  }
}
