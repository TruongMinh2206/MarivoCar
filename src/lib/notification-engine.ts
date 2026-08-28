import { prisma } from "./prisma"

interface EmailInput {
  to: string
  subject: string
  html: string
  text?: string
}

// Resend integration (placeholder - add RESEND_API_KEY to .env)
async function sendEmail(input: EmailInput): Promise<boolean> {
  // In production, use Resend:
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({ from: 'MARIVO <noreply@marivo.vn>', to: input.to, subject: input.subject, html: input.html })

  console.log(`[EMAIL] To: ${input.to} | Subject: ${input.subject}`)
  return true
}

// Generate booking confirmation HTML email
export function bookingConfirmationEmail(booking: {
  bookingCode: string
  customerName: string
  serviceName: string
  date: string
  time: string
  tripType: string
  total: number
  currency: string
}) {
  const tripLabel = booking.tripType === "ROUND_TRIP" ? "Round Trip" : "One Way"
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">✅ Booking Confirmed!</h1>
  </div>
  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>${booking.customerName}</strong>,</p>
    <p>Your booking has been confirmed. Here are the details:</p>

    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Booking Code:</strong> <span style="color: #4F46E5; font-size: 18px;">${booking.bookingCode}</span></p>
      <p style="margin: 4px 0;"><strong>Service:</strong> ${booking.serviceName}</p>
      <p style="margin: 4px 0;"><strong>Trip:</strong> ${tripLabel}</p>
      <p style="margin: 4px 0;"><strong>Date:</strong> ${booking.date} at ${booking.time}</p>
      <p style="margin: 4px 0;"><strong>Total:</strong> ${booking.total.toLocaleString()} ${booking.currency}</p>
    </div>

    <p>Please save your booking code. You can use it to view your booking at any time.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/my-bookings/${booking.bookingCode}"
         style="background: #4F46E5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
        View Booking
      </a>
    </div>

    <p style="color: #6b7280; font-size: 12px;">If you have any questions, please contact us at support@marivo.vn</p>
  </div>
</body>
</html>`
}

// Generate payment success HTML email
export function paymentSuccessEmail(booking: {
  bookingCode: string
  customerName: string
  total: number
  currency: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">💰 Payment Received!</h1>
  </div>
  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>${booking.customerName}</strong>,</p>
    <p>We have received your payment of <strong>${booking.total.toLocaleString()} ${booking.currency}</strong>.</p>
    <p>Booking Code: <strong style="color: #4F46E5;">${booking.bookingCode}</strong></p>
    <p>Your booking is now confirmed. We look forward to serving you!</p>
  </div>
</body>
</html>`
}

// Send notification and save to DB
export async function sendNotification(params: {
  userId?: string
  type: string
  title: string
  message: string
  email: string
  emailSubject: string
  emailHtml: string
}): Promise<void> {
  // Save to database
  await prisma.notification.create({
    data: {
      userId: params.userId || "",
      type: params.type,
      title: params.title,
      message: params.message,
      isRead: false,
    },
  })

  // Send email
  try {
    await sendEmail({
      to: params.email,
      subject: params.emailSubject,
      html: params.emailHtml,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
    // Don't throw - email failure shouldn't block the booking flow
  }
}

// Send booking confirmation notification
export async function notifyBookingConfirmed(booking: {
  userId?: string
  customerName: string
  customerEmail: string
  bookingCode: string
  serviceName: string
  date: string
  time: string
  tripType: string
  total: number
  currency: string
}) {
  const html = bookingConfirmationEmail(booking)

  await sendNotification({
    userId: booking.userId,
    type: "BOOKING_CONFIRMED",
    title: `Booking ${booking.bookingCode} Confirmed`,
    message: `Your booking for ${booking.serviceName} on ${booking.date} has been confirmed.`,
    email: booking.customerEmail,
    emailSubject: `Booking Confirmed - ${booking.bookingCode}`,
    emailHtml: html,
  })
}

// Send payment success notification
export async function notifyPaymentReceived(booking: {
  userId?: string
  customerName: string
  customerEmail: string
  bookingCode: string
  total: number
  currency: string
}) {
  const html = paymentSuccessEmail(booking)

  await sendNotification({
    userId: booking.userId,
    type: "PAYMENT_RECEIVED",
    title: `Payment Received for ${booking.bookingCode}`,
    message: `Payment of ${booking.total.toLocaleString()} ${booking.currency} received.`,
    email: booking.customerEmail,
    emailSubject: `Payment Confirmed - ${booking.bookingCode}`,
    emailHtml: html,
  })
}