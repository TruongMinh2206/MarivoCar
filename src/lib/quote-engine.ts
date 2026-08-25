import { prisma } from "./prisma"
import { AppError } from "./errors"
import { calculatePrice } from "./price-engine"
import { checkAvailability } from "./availability-engine"
import { QUOTE_EXPIRY_MINUTES } from "./constants"
import { v4 as uuid } from "uuid"
import type { Quote } from "@/types"

interface QuoteInput {
  serviceId: string
  vehicleId?: string
  tripType: "ONE_WAY" | "ROUND_TRIP"
  pickupId?: string
  dropoffId?: string
  date: string
  time: string
  flightNumber?: string
  passengers: number
  luggage: number
}

// In-memory quote store (replace with Redis in production)
const quoteStore = new Map<string, Quote & { createdAt: number }>()

// Cleanup expired quotes every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, quote] of quoteStore.entries()) {
    if (new Date(quote.expiresAt).getTime() < now) {
      quoteStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export async function createQuote(input: QuoteInput): Promise<Quote> {
  // Validate service exists
  const service = await prisma.service.findUnique({
    where: { id: input.serviceId },
    include: {
      vehicles: input.vehicleId
        ? { where: { id: input.vehicleId, isActive: true } }
        : false,
      category: true,
    },
  })

  if (!service) {
    throw new AppError(404, "SERVICE_NOT_FOUND", "Service not found")
  }

  if (!service.isActive) {
    throw new AppError(400, "SERVICE_UNAVAILABLE", "Service is no longer available")
  }

  // Check availability
  const availability = await checkAvailability({
    serviceId: input.serviceId,
    vehicleId: input.vehicleId,
    date: input.date,
    time: input.time,
    passengers: input.passengers,
  })

  if (!availability.available) {
    throw new AppError(
      400,
      "SERVICE_UNAVAILABLE",
      availability.message || "Service is not available for the selected date"
    )
  }

  // Validate pickup/dropoff locations
  let pickup, dropoff
  if (input.pickupId) {
    pickup = await prisma.location.findUnique({ where: { id: input.pickupId } })
    if (!pickup) {
      throw new AppError(400, "INVALID_LOCATION", "Pickup location not found")
    }
  }
  if (input.dropoffId) {
    dropoff = await prisma.location.findUnique({ where: { id: input.dropoffId } })
    if (!dropoff) {
      throw new AppError(400, "INVALID_LOCATION", "Dropoff location not found")
    }
  }

  // Calculate price
  const priceResult = await calculatePrice({
    serviceId: input.serviceId,
    vehicleId: input.vehicleId,
    tripType: input.tripType,
    date: input.date,
    passengers: input.passengers,
    luggage: input.luggage,
  })

  const quoteId = uuid()
  const expiresAt = new Date(Date.now() + QUOTE_EXPIRY_MINUTES * 60 * 1000)

  const quote: Quote = {
    quoteId,
    serviceId: input.serviceId,
    serviceName: service.name,
    vehicleId: input.vehicleId,
    vehicleName: service.vehicles?.[0]?.name,
    tripType: input.tripType,
    date: input.date,
    time: input.time,
    passengers: input.passengers,
    luggage: input.luggage,
    pickup: pickup
      ? {
          id: pickup.id,
          name: pickup.name,
          slug: pickup.slug,
          type: pickup.type,
          area: pickup.area,
        }
      : undefined,
    dropoff: dropoff
      ? {
          id: dropoff.id,
          name: dropoff.name,
          slug: dropoff.slug,
          type: dropoff.type,
          area: dropoff.area,
        }
      : undefined,
    flightNumber: input.flightNumber,
    priceBreakdown: priceResult.breakdown,
    subtotal: priceResult.subtotal,
    discount: priceResult.discount,
    serviceFee: priceResult.serviceFee,
    total: priceResult.total,
    currency: priceResult.currency,
    expiresAt: expiresAt.toISOString(),
  }

  // Store quote
  quoteStore.set(quoteId, { ...quote, createdAt: Date.now() })

  return quote
}

export function getQuote(quoteId: string): Quote | null {
  const stored = quoteStore.get(quoteId)
  if (!stored) return null

  // Check expiry
  if (new Date(stored.expiresAt).getTime() < Date.now()) {
    quoteStore.delete(quoteId)
    return null
  }

  return stored
}

export function validateQuote(quoteId: string): Quote {
  const quote = getQuote(quoteId)
  if (!quote) {
    throw new AppError(
      400,
      "QUOTE_EXPIRED",
      "Quote has expired. Please create a new quote."
    )
  }
  return quote
}
