import { prisma } from "./prisma"
import { AppError } from "./errors"
import { calculatePrice } from "./price-engine"
import { checkAvailability } from "./availability-engine"
import { QUOTE_EXPIRY_MINUTES } from "./constants"
import type { Quote, LocationOption } from "@/types"

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

// Quotes are persisted to the database so they survive dev-server hot reloads and
// restarts. (Previously they lived in an in-memory Map, which caused QUOTE_EXPIRED
// errors whenever the server recompiled between quote creation and booking submission.)
const QUOTE_CODE_LEN = 8

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

  const quoteCode = generateQuoteCode()
  const expiresAt = new Date(Date.now() + QUOTE_EXPIRY_MINUTES * 60 * 1000)

  // Persist the quote so it survives server restarts / hot reloads
  const stored = await prisma.quote.create({
    data: {
      quoteCode,
      serviceId: input.serviceId,
      vehicleId: input.vehicleId,
      tripType: input.tripType,
      date: input.date,
      time: input.time,
      flightNumber: input.flightNumber,
      passengers: input.passengers,
      luggage: input.luggage,
      pickupLocationId: input.pickupId,
      dropoffLocationId: input.dropoffId,
      priceBreakdown: priceResult.breakdown as unknown as object,
      subtotal: priceResult.subtotal,
      discount: priceResult.discount,
      serviceFee: priceResult.serviceFee,
      total: priceResult.total,
      currency: priceResult.currency,
      expiresAt,
    },
  })

  const quote: Quote = {
    quoteId: stored.id,
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
          type: pickup.type as LocationOption["type"],
          area: pickup.area,
        }
      : undefined,
    dropoff: dropoff
      ? {
          id: dropoff.id,
          name: dropoff.name,
          slug: dropoff.slug,
          type: dropoff.type as LocationOption["type"],
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

  return quote
}

export async function getQuote(quoteId: string): Promise<Quote | null> {
  const stored = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      service: true,
      vehicle: true,
    },
  })

  if (!stored) return null

  // Check expiry
  if (new Date(stored.expiresAt).getTime() < Date.now()) {
    return null
  }

  // Reconstruct pickup/dropoff from location ids (Quote stores location ids as
  // plain scalars, so we resolve them manually when present).
  let pickup: LocationOption | undefined
  let dropoff: LocationOption | undefined
  if (stored.pickupLocationId) {
    const loc = await prisma.location.findUnique({ where: { id: stored.pickupLocationId } })
    if (loc) {
      pickup = {
        id: loc.id,
        name: loc.name,
        slug: loc.slug,
        type: loc.type as LocationOption["type"],
        area: loc.area,
      }
    }
  }
  if (stored.dropoffLocationId) {
    const loc = await prisma.location.findUnique({ where: { id: stored.dropoffLocationId } })
    if (loc) {
      dropoff = {
        id: loc.id,
        name: loc.name,
        slug: loc.slug,
        type: loc.type as LocationOption["type"],
        area: loc.area,
      }
    }
  }

  return {
    quoteId: stored.id,
    serviceId: stored.serviceId,
    serviceName: stored.service?.name || "",
    vehicleId: stored.vehicleId || undefined,
    vehicleName: stored.vehicle?.name,
    tripType: stored.tripType as Quote["tripType"],
    date: stored.date,
    time: stored.time,
    passengers: stored.passengers,
    luggage: stored.luggage,
    pickup,
    dropoff,
    flightNumber: stored.flightNumber || undefined,
    priceBreakdown: (stored.priceBreakdown as unknown as Quote["priceBreakdown"]) || [],
    subtotal: Number(stored.subtotal),
    discount: Number(stored.discount),
    serviceFee: Number(stored.serviceFee),
    total: Number(stored.total),
    currency: stored.currency,
    expiresAt: stored.expiresAt.toISOString(),
  }
}

export async function validateQuote(quoteId: string): Promise<Quote> {
  const quote = await getQuote(quoteId)
  if (!quote) {
    throw new AppError(
      400,
      "QUOTE_EXPIRED",
      "Quote has expired. Please create a new quote."
    )
  }
  return quote
}

// Mark a quote as used once a booking is created from it (prevents reuse).
export async function markQuoteUsed(quoteId: string): Promise<void> {
  await prisma.quote.update({
    where: { id: quoteId },
    data: { isUsed: true },
  })
}

function generateQuoteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < QUOTE_CODE_LEN; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `QT-${code}`
}
