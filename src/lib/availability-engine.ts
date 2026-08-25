import { prisma } from "./prisma"
import { AppError } from "./errors"

interface AvailabilityCheck {
  serviceId: string
  vehicleId?: string
  date: string
  time?: string
  passengers: number
}

interface AvailabilityResult {
  available: boolean
  remainingCapacity: number
  maxCapacity: number
  message?: string
}

export async function checkAvailability(
  input: AvailabilityCheck
): Promise<AvailabilityResult> {
  const service = await prisma.service.findUnique({
    where: { id: input.serviceId },
    include: {
      availability: {
        where: {
          isActive: true,
          specificDate: new Date(input.date),
        },
      },
    },
  })

  if (!service) {
    throw new AppError(404, "SERVICE_NOT_FOUND", "Service not found")
  }

  if (!service.isActive) {
    return {
      available: false,
      remainingCapacity: 0,
      maxCapacity: 0,
      message: "This service is currently unavailable",
    }
  }

  // If no specific availability records, check general day-of-week availability
  if (service.availability.length === 0) {
    const dayOfWeek = new Date(input.date).getDay()
    const generalAvailability = await prisma.serviceAvailability.findFirst({
      where: {
        serviceId: input.serviceId,
        isActive: true,
        dayOfWeek,
        specificDate: null,
      },
    })

    if (generalAvailability) {
      const remaining = generalAvailability.maxCapacity - generalAvailability.bookedCount
      if (input.passengers > remaining) {
        return {
          available: false,
          remainingCapacity: remaining,
          maxCapacity: generalAvailability.maxCapacity,
          message: `Only ${remaining} spots remaining for this date`,
        }
      }
      return {
        available: true,
        remainingCapacity: remaining,
        maxCapacity: generalAvailability.maxCapacity,
      }
    }

    // No availability constraints - service is available
    return {
      available: true,
      remainingCapacity: 999,
      maxCapacity: 999,
    }
  }

  // Check specific date availability
  const dateAvailability = service.availability[0]
  const remaining = dateAvailability.maxCapacity - dateAvailability.bookedCount

  if (remaining <= 0) {
    return {
      available: false,
      remainingCapacity: 0,
      maxCapacity: dateAvailability.maxCapacity,
      message: "This service is fully booked for the selected date",
    }
  }

  if (input.passengers > remaining) {
    return {
      available: false,
      remainingCapacity: remaining,
      maxCapacity: dateAvailability.maxCapacity,
      message: `Only ${remaining} spots remaining for this date`,
    }
  }

  return {
    available: true,
    remainingCapacity: remaining,
    maxCapacity: dateAvailability.maxCapacity,
  }
}

export async function reserveCapacity(
  serviceId: string,
  date: string,
  quantity: number
): Promise<void> {
  const availability = await prisma.serviceAvailability.findFirst({
    where: {
      serviceId,
      isActive: true,
      specificDate: new Date(date),
    },
  })

  if (!availability) return // No capacity tracking for this service

  const remaining = availability.maxCapacity - availability.bookedCount
  if (quantity > remaining) {
    throw new AppError(
      409,
      "CAPACITY_EXCEEDED",
      "Not enough capacity available for the selected date"
    )
  }

  await prisma.serviceAvailability.update({
    where: { id: availability.id },
    data: { bookedCount: { increment: quantity } },
  })
}

export async function releaseCapacity(
  serviceId: string,
  date: string,
  quantity: number
): Promise<void> {
  const availability = await prisma.serviceAvailability.findFirst({
    where: {
      serviceId,
      isActive: true,
      specificDate: new Date(date),
    },
  })

  if (!availability) return

  await prisma.serviceAvailability.update({
    where: { id: availability.id },
    data: { bookedCount: { decrement: quantity } },
  })
}
