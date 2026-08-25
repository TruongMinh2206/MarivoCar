import { prisma } from "./prisma"
import { BOOKING_CODE_PREFIX } from "./constants"

export function generateBookingCode(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")

  // Use timestamp + random for uniqueness
  const timestamp = `${yy}${mm}${dd}`
  const sequence = String(Math.floor(Math.random() * 9999)).padStart(4, "0")

  return `${BOOKING_CODE_PREFIX}${timestamp}-${sequence}`
}

export async function ensureUniqueBookingCode(): Promise<string> {
  let code = generateBookingCode()
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const existing = await prisma.booking.findUnique({
      where: { bookingCode: code },
    })

    if (!existing) return code

    code = generateBookingCode()
    attempts++
  }

  throw new Error("Unable to generate unique booking code")
}
