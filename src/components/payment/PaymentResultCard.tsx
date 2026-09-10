import Link from "next/link"
import {
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Plane,
  Home,
  RefreshCw,
  Phone,
} from "lucide-react"
import { PrintButton } from "./PrintButton"

export interface PaymentResultBooking {
  bookingCode: string
  customerName: string
  status: string
  total: number
  currency: string
  tripDate: string
  tripTime: string
  pickupLocation: string
  dropoffLocation: string
  serviceName: string
  serviceCategory: string
}

interface Props {
  result: "success" | "failed"
  booking: PaymentResultBooking | null
}

function formatPrice(amount: number, currency: string): string {
  return `${amount.toLocaleString()} ${currency}`
}

export function PaymentResultCard({ result, booking }: Props) {
  // ── Missing booking: show a friendly not-found state ───────────────────────
  if (!booking) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-error/10">
          <XCircle className="h-12 w-12 text-error" />
        </div>
        <div>
          <h1 className="text-headline-md font-headline-md text-primary mb-2">
            Booking not found
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            We could not find the booking this payment belongs to.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md font-label-md font-semibold hover:bg-surface-container transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    )
  }

  const isSuccess = result === "success"

  // ── Header ────────────────────────────────────────────────────────────────
  const header = isSuccess ? (
    <>
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-16 w-16 text-success" />
      </div>
      <h1 className="text-headline-md font-headline-md text-primary mb-2">
        Thank you! Your booking is confirmed.
      </h1>
      <p className="text-body-lg font-body-lg text-on-surface-variant mb-6">
        We&apos;ve sent the confirmation and voucher to your email.
      </p>
    </>
  ) : (
    <>
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-error/10">
        <XCircle className="h-12 w-12 text-error" />
      </div>
      <h1 className="text-headline-md font-headline-md font-bold text-primary mb-2">
        Payment was not completed
      </h1>
      <p className="text-body-lg font-body-lg text-on-surface-variant max-w-md mx-auto mb-6">
        We were unable to process your payment. Your booking has been saved and
        you can retry the payment at any time.
      </p>
    </>
  )

  // ── Actions ───────────────────────────────────────────────────────────────
  const actions = isSuccess ? (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link
        href={`/my-bookings/${booking.bookingCode}`}
        className="w-full sm:w-auto px-6 py-3 bg-primary-container text-on-primary rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity"
      >
        View My Booking
      </Link>
      <PrintButton />
      <Link
        href="/"
        className="w-full sm:w-auto px-6 py-3 text-travel-blue hover:bg-surface-container rounded-lg text-label-md font-label-md transition-colors"
      >
        Back to Home
      </Link>
    </div>
  ) : (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link
        href={`/my-bookings/${booking.bookingCode}/payment`}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-label-md font-label-md font-bold hover:bg-secondary-fixed-dim transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Retry Payment
      </Link>
      <Link
        href="/contact"
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-travel-blue text-white px-6 py-3 rounded-lg text-label-md font-label-md font-bold hover:bg-travel-blue/90 transition-colors"
      >
        <Phone className="h-4 w-4" />
        Contact Support
      </Link>
      <Link
        href="/"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md font-label-md font-semibold hover:bg-surface-container transition-colors"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  )

  return (
    <div className="text-center">
      {header}

      {/* Booking reference */}
      <div className="bg-surface-container rounded-lg p-4 mb-8 inline-block">
        <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
          Booking Reference
        </span>
        <span className="text-headline-sm font-headline-sm font-bold text-travel-blue">
          {booking.bookingCode}
        </span>
        {!isSuccess && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-warning text-label-sm font-label-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              Pending Payment
            </span>
          </div>
        )}
      </div>

      {/* Booking summary */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 text-left mb-8">
        <div className="flex items-start gap-4 border-b border-outline-variant pb-4 mb-4">
          <div className="bg-surface p-3 rounded-lg text-travel-blue">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-label-md font-label-md text-primary text-lg">
              {booking.serviceName}
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant">
              {booking.serviceCategory}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">
              Date &amp; Time
            </span>
            <p className="text-body-md font-body-md text-primary font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-travel-blue" />
              {booking.tripDate} - {booking.tripTime}
            </p>
          </div>
          <div>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">
              Pickup Location
            </span>
            <p className="text-body-md font-body-md text-primary font-medium flex items-center gap-2">
              <Plane className="h-4 w-4 text-travel-blue" />
              {booking.pickupLocation}
            </p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">
              Drop-off Location
            </span>
            <p className="text-body-md font-body-md text-primary font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-travel-blue" />
              {booking.dropoffLocation}
            </p>
          </div>
          <div className="sm:col-span-2 border-t border-outline-variant pt-4">
            <div className="flex justify-between items-center">
              <span className="text-body-md font-body-md text-on-surface-variant">
                Total {isSuccess ? "Paid" : "Due"}
              </span>
              <span className="text-lg font-bold text-on-surface">
                {formatPrice(booking.total, booking.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {actions}
    </div>
  )
}
