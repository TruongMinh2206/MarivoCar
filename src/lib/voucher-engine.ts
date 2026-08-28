import { prisma } from "./prisma"
import { AppError } from "./errors"
import { BookingStatus } from "@prisma/client"
import QRCode from "qrcode"

interface VoucherData {
  bookingCode: string
  customerName: string
  serviceName: string
  date: string
  time: string
  tripType: string
  passengers: number
  pickup?: string
  dropoff?: string
  qrCodeDataUrl: string
}

// Generate voucher HTML for email/PDF
export function generateVoucherHtml(data: VoucherData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🎫 MARIVO Travel Voucher</h1>
  </div>
  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${data.qrCodeDataUrl}" alt="Booking QR Code" style="width: 150px; height: 150px;" />
    </div>

    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h2 style="margin: 0 0 12px; color: #4F46E5; font-size: 20px;">${data.bookingCode}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; color: #6b7280;">Passenger</td><td style="padding: 4px 0; font-weight: bold;">${data.customerName}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Service</td><td style="padding: 4px 0; font-weight: bold;">${data.serviceName}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Date</td><td style="padding: 4px 0; font-weight: bold;">${data.date}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Time</td><td style="padding: 4px 0; font-weight: bold;">${data.time}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Trip Type</td><td style="padding: 4px 0; font-weight: bold;">${data.tripType === "ROUND_TRIP" ? "Round Trip" : "One Way"}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Passengers</td><td style="padding: 4px 0; font-weight: bold;">${data.passengers}</td></tr>
        ${data.pickup ? `<tr><td style="padding: 4px 0; color: #6b7280;">Pickup</td><td style="padding: 4px 0; font-weight: bold;">${data.pickup}</td></tr>` : ""}
        ${data.dropoff ? `<tr><td style="padding: 4px 0; color: #6b7280;">Dropoff</td><td style="padding: 4px 0; font-weight: bold;">${data.dropoff}</td></tr>` : ""}
      </table>
    </div>

    <p style="color: #6b7280; font-size: 12px; text-align: center;">
      Please present this voucher to your driver/guide upon arrival.
      <br/>For assistance: support@marivo.vn | +84 xxx xxx xxx
    </p>
  </div>
</body>
</html>`
}

// Generate voucher data from booking
export async function generateVoucher(bookingCode: string): Promise<VoucherData> {
  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    include: {
      items: {
        include: { service: { select: { name: true } } },
      },
    },
  })

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.PAID) {
    throw new AppError(
      400,
      "BOOKING_NOT_CONFIRMED",
      "Voucher is only available for confirmed/paid bookings"
    )
  }

  const item = booking.items[0]
  const snapshot = (item?.serviceSnapshot as Record<string, unknown>) || {}

  // Generate QR code with booking data
  const qrPayload = JSON.stringify({
    code: booking.bookingCode,
    service: snapshot.name || item?.serviceName || "Service",
    date: snapshot.date || "",
    time: snapshot.time || "",
    passengers: snapshot.passengers || 1,
  })

  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 300,
    margin: 2,
    color: { dark: "#1e1b4b", light: "#ffffff" },
  })

  return {
    bookingCode: booking.bookingCode,
    customerName: booking.customerName || "Guest",
    serviceName: item?.serviceName || "Service",
    date: (snapshot.date as string) || "",
    time: (snapshot.time as string) || "",
    tripType: (snapshot.tripType as string) || "ONE_WAY",
    passengers: (snapshot.passengers as number) || 1,
    pickup: snapshot.pickup as string | undefined,
    dropoff: snapshot.dropoff as string | undefined,
    qrCodeDataUrl,
  }
}