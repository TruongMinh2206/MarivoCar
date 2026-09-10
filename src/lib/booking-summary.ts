import { prisma } from "@/lib/prisma"
import type { PaymentResultBooking } from "@/components/payment/PaymentResultCard"

/**
 * Load a booking summary for payment result pages.
 * Returns null when the booking code is missing or unknown.
 */
export async function loadBookingSummary(
  bookingCode: string
): Promise<PaymentResultBooking | null> {
  if (!bookingCode) return null

  const booking = await prisma.booking.findFirst({
    where: { bookingCode },
    include: {
      items: { take: 1 },
      pickupLocation: { select: { name: true } },
      dropoffLocation: { select: { name: true } },
    },
  })

  if (!booking) return null

  const firstItem = booking.items[0]
  const service = firstItem
    ? await prisma.service.findUnique({
        where: { id: firstItem.serviceId },
        select: { name: true, category: { select: { name: true } } },
      })
    : null

  const tripDate = booking.tripDate
    ? booking.tripDate.toISOString().split("T")[0]
    : ""

  return {
    bookingCode: booking.bookingCode,
    customerName: booking.customerName || "",
    status: booking.status,
    total: Number(booking.total),
    currency: booking.currency,
    tripDate,
    tripTime: booking.tripTime || "",
    pickupLocation: booking.pickupLocation?.name || "",
    dropoffLocation: booking.dropoffLocation?.name || "",
    serviceName: firstItem?.serviceName || service?.name || "",
    serviceCategory: service?.category?.name || "",
  }
}

/** Safely read a single search param value (string or string[]). */
export function searchParamValue(
  params: Record<string, string | string[] | undefined>,
  key: string
): string {
  const value = params[key]
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}
