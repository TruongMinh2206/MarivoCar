import { prisma } from "./prisma"
import { AppError } from "./errors"
import { SERVICE_FEE_PERCENTAGE } from "./constants"
import type { PriceBreakdownItem } from "@/types"

interface PriceInput {
  serviceId: string
  vehicleId?: string
  tripType: "ONE_WAY" | "ROUND_TRIP"
  date: string
  passengers: number
  luggage: number
  quantity?: number
}

interface PriceResult {
  subtotal: number
  discount: number
  serviceFee: number
  total: number
  currency: string
  breakdown: PriceBreakdownItem[]
}

export async function calculatePrice(input: PriceInput): Promise<PriceResult> {
  const service = await prisma.service.findUnique({
    where: { id: input.serviceId },
    include: {
      prices: { where: { isActive: true } },
      vehicles: input.vehicleId
        ? { where: { id: input.vehicleId, isActive: true } }
        : true,
      category: true,
    },
  })

  if (!service) {
    throw new AppError(404, "SERVICE_NOT_FOUND", "Service not found")
  }

  if (!service.isActive) {
    throw new AppError(400, "SERVICE_UNAVAILABLE", "Service is no longer available")
  }

  let basePrice = Number(service.basePrice)
  let currency = service.currency
  const breakdown: PriceBreakdownItem[] = []

  // Vehicle price override
  if (input.vehicleId && service.vehicles.length > 0) {
    const vehicle = service.vehicles[0]
    basePrice = Number(vehicle.pricePerTrip)
    currency = vehicle.currency
  }

  // Check for date-specific pricing
  const date = new Date(input.date)
  const applicablePrice = service.prices.find((p) => {
    if (!p.validFrom || !p.validUntil) return false
    return date >= p.validFrom && date <= p.validUntil
  })

  if (applicablePrice) {
    basePrice = Number(applicablePrice.basePrice)
    currency = applicablePrice.currency
  }

  // Check for group pricing
  const quantity = input.quantity || 1
  const groupPrice = service.prices.find(
    (p) =>
      p.priceType === "GROUP" &&
      p.minQuantity <= quantity &&
      (!p.maxQuantity || p.maxQuantity >= quantity)
  )

  if (groupPrice) {
    basePrice = Number(groupPrice.basePrice)
    currency = groupPrice.currency
  }

  // Base price
  breakdown.push({
    name: "Base Price",
    amount: basePrice,
  })

  let subtotal = basePrice

  // Round trip doubles the price
  if (input.tripType === "ROUND_TRIP") {
    const roundTripPrice = basePrice * 0.9 // 10% discount for round trip
    breakdown.push({
      name: "Return Trip (10% off)",
      amount: roundTripPrice,
    })
    subtotal = basePrice + roundTripPrice
  }

  // Calculate discount (if any applicable promotions)
  let discount = 0

  // Calculate service fee
  const serviceFee = Math.round(subtotal * (SERVICE_FEE_PERCENTAGE / 100))
  breakdown.push({
    name: `Service Fee (${SERVICE_FEE_PERCENTAGE}%)`,
    amount: serviceFee,
  })

  const total = subtotal - discount + serviceFee

  return {
    subtotal,
    discount,
    serviceFee,
    total,
    currency,
    breakdown,
  }
}
