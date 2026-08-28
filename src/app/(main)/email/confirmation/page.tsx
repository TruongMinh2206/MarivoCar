import Link from "next/link"
import { CheckCircle2, Plane, MapPin, Calendar, Users } from "lucide-react"

export const metadata = {
  title: "Email Confirmation Preview | MARIVO.vn",
}

export default function EmailConfirmationPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-4">Email Confirmation Preview</h1>
        <p className="text-body-md font-body-md text-on-surface-variant">This is a preview of the booking confirmation email sent to customers.</p>
      </div>

      {/* Email Preview Card */}
      <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
        {/* Email Header */}
        <div className="bg-primary-container p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Plane className="h-6 w-6 text-white" />
            <span className="text-body-xl font-body-xl font-bold text-white">MARIVO.vn</span>
          </div>
          <p className="text-on-primary-container text-body-md font-body-md">Phu Quoc Travel Expert</p>
        </div>

        {/* Email Body */}
        <div className="p-8 space-y-6">
          {/* Success Badge */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-headline-md font-bold text-primary mb-2">Booking Confirmed!</h2>
            <p className="text-on-surface-variant text-body-md font-body-md">
              Thank you for booking with MARIVO.vn. Your trip to Phu Quoc is all set.
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-surface-alt rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Booking Code</span>
              <span className="font-mono text-body-lg font-body-lg font-bold text-travel-blue">MRV250826-0001</span>
            </div>
            <div className="border-t border-outline-variant pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Plane className="h-4 w-4 text-travel-blue" />
                <span className="text-on-surface-variant">Service:</span>
                <span className="font-medium text-on-surface">Airport Transfer - Premium SUV</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-travel-blue" />
                <span className="text-on-surface-variant">Route:</span>
                <span className="font-medium text-on-surface">PQC Airport → Salinda Resort</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-travel-blue" />
                <span className="text-on-surface-variant">Date:</span>
                <span className="font-medium text-on-surface">August 28, 2026 - 14:30 PM</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-travel-blue" />
                <span className="text-on-surface-variant">Passengers:</span>
                <span className="font-medium text-on-surface">2 adults</span>
              </div>
            </div>
            <div className="border-t border-outline-variant pt-3 flex justify-between">
              <span className="font-semibold text-on-surface">Total Paid</span>
              <span className="text-lg font-bold text-primary">1,200,000 ₫</span>
            </div>
          </div>

          {/* What's Next */}
          <div>
            <h3 className="text-headline-sm font-headline-sm text-primary mb-3">What happens next?</h3>
            <ol className="space-y-2 text-body-md font-body-md text-on-surface-variant">
              <li className="flex gap-2"><span className="text-travel-blue font-bold">1.</span> Our driver will contact you 24 hours before pickup</li>
              <li className="flex gap-2"><span className="text-travel-blue font-bold">2.</span> Meet your driver at the airport arrival gate</li>
              <li className="flex gap-2"><span className="text-travel-blue font-bold">3.</span> Enjoy your ride to the hotel in comfort</li>
            </ol>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/my-bookings"
              className="inline-block bg-secondary-container text-on-secondary-fixed-variant px-8 py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors"
            >
              View My Booking
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-outline-variant pt-6 text-center">
            <p className="text-xs text-outline mb-2">Need help? Contact us at any time.</p>
            <p className="text-xs text-on-surface-variant">
              <span className="text-travel-blue">info@marivo.vn</span> · <span className="text-travel-blue">+84 297 399 9999</span>
            </p>
          </div>
        </div>

        {/* Email Footer */}
        <div className="bg-surface-container p-6 text-center">
          <p className="text-xs text-outline">
            © 2026 MARIVO.vn — Phu Quoc Travel Expert. All Rights Reserved.
          </p>
          <p className="text-xs text-outline mt-1">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </div>
    </section>
  )
}
