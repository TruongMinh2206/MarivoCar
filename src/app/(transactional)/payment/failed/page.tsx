import Link from "next/link"
import { XCircle, RefreshCw, Phone, ArrowLeft } from "lucide-react"

export default function PaymentFailedPage() {
  const bookingCode = "MRV250620-0001"

  return (
    <main className="flex-grow flex items-center justify-center py-16 px-5 md:px-16">
      <div className="max-w-2xl w-full bg-surface-container-lowest rounded-xl shadow-modal border border-outline-variant p-8 md:p-12 text-center">
        {/* Error Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-error/10 mb-6">
          <XCircle className="h-12 w-12 text-error" />
        </div>

        {/* Title */}
        <h1 className="text-headline-md font-headline-md font-bold text-primary mb-2">
          Payment was not completed
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-md mx-auto mb-6">
          We were unable to process your payment. Your booking has been saved
          and you can retry the payment at any time.
        </p>

        {/* Booking Reference */}
        <div className="bg-surface-container rounded-lg p-4 mb-8 inline-block">
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
            Booking Reference
          </span>
          <span className="text-headline-sm font-headline-sm font-bold text-travel-blue">
            {bookingCode}
          </span>
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-warning text-label-sm font-label-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              Pending Payment
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/my-bookings"
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
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
