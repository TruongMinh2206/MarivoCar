"use client"
import Link from "next/link"
import { CheckCircle2, Car, Calendar, MapPin, Plane, Printer, Home } from "lucide-react"

export default function PaymentSuccessPage() {
  const bookingCode = "MRV250620-0001"

  return (
    <>
      <main className="flex-grow flex items-center justify-center py-16 px-5 md:px-16">
        <div className="max-w-2xl w-full bg-surface-container-lowest rounded-xl shadow-modal border border-outline-variant p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 text-success mb-6">
            <CheckCircle2 className="h-16 w-16" />
          </div>

          {/* Title */}
          <h1 className="text-headline-md font-headline-md text-primary mb-2">
            Thank you! Your booking is confirmed.
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mb-6">
            We&apos;ve sent the confirmation and voucher to your email.
          </p>

          {/* Booking Reference */}
          <div className="bg-surface-container rounded-lg p-4 mb-8 inline-block">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
              Booking Reference
            </span>
            <span className="text-headline-sm font-headline-sm font-bold text-travel-blue">
              {bookingCode}
            </span>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 text-left mb-8">
            <div className="flex items-start gap-4 border-b border-outline-variant pb-4 mb-4">
              <div className="bg-surface p-3 rounded-lg text-travel-blue">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-label-md font-label-md text-primary text-lg">Private Car 7 Seats</h3>
                <p className="text-body-md font-body-md text-on-surface-variant">Airport Transfer</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Date & Time</span>
                <p className="text-body-md font-body-md text-primary font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-travel-blue" />
                  Oct 24, 2024 - 14:30
                </p>
              </div>
              <div>
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Pickup Location</span>
                <p className="text-body-md font-body-md text-primary font-medium flex items-center gap-2">
                  <Plane className="h-4 w-4 text-travel-blue" />
                  Phu Quoc International Airport (PQC)
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Drop-off Location</span>
                <p className="text-body-md font-body-md text-primary font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-travel-blue" />
                  JW Marriott Phu Quoc Emerald Bay Resort &amp; Spa
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/my-bookings"
              className="w-full sm:w-auto px-6 py-3 bg-primary-container text-on-primary rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity"
            >
              View My Booking
            </Link>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 border-2 border-outline text-on-surface rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Voucher
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 text-travel-blue hover:bg-surface-container rounded-lg text-label-md font-label-md transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
