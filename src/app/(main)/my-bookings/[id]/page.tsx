"use client"
import { use, useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronRight, Calendar, MapPin, Users, Clock, CreditCard } from "lucide-react"
import { StatusBadge } from "@/components/ui/Badge"
import { Price } from "@/components/ui/Price"
import { ErrorState } from "@/components/ui/ErrorState"
import { ServiceDetailSkeleton } from "@/components/ui/LoadingSkeleton"
import type { BookingDetail } from "@/types"

const STATUS_TIMELINE = [
  "DRAFT",
  "PENDING",
  "WAITING_PAYMENT",
  "PAID",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
]

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error?.message || "Booking not found")
        setBooking(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error")
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [id])

  if (loading) {
    return (
      <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
        <ServiceDetailSkeleton />
      </section>
    )
  }

  if (error || !booking) {
    return (
      <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
        <ErrorState title="Booking Not Found" message={error || "This booking could not be found."} />
      </section>
    )
  }

  const currentStepIndex = STATUS_TIMELINE.indexOf(booking.status)

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-6">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/my-bookings" className="hover:text-travel-blue">My Bookings</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{booking.bookingCode}</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">
                  {booking.bookingCode}
                </h1>
                <StatusBadge status={booking.status} />
              </div>
              <p className="mt-1 text-body-md font-body-md text-on-surface-variant">
                Booked on {format(new Date(booking.createdAt), "MMMM d, yyyy 'at' HH:mm")}
              </p>
            </div>
            <div className="text-right">
              <Price amount={Number(booking.total)} size="xl" />
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6">
          <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Booking Status</h2>
          <div className="flex items-center gap-0 overflow-x-auto">
            {STATUS_TIMELINE.map((status, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              return (
                <div key={status} className="flex items-center flex-1 min-w-[100px]">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isCompleted ? "bg-travel-blue" : "bg-outline-variant"
                      } ${isCurrent ? "ring-4 ring-surface-container" : ""}`}
                    />
                    <span className="mt-2 text-label-sm font-label-sm text-on-surface-variant whitespace-nowrap">
                      {status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {index < STATUS_TIMELINE.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 ${
                        index < currentStepIndex ? "bg-travel-blue" : "bg-outline-variant"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Trip Info */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6">
            <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Trip Information</h2>
            <div className="space-y-3 text-body-md font-body-md">
              {booking.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-on-surface-variant">{item.serviceName}</span>
                  <span className="font-medium">× {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6">
            <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Customer Information</h2>
            <div className="space-y-3 text-body-md font-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Name</span>
                <span className="font-medium">{booking.customer?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Email</span>
                <span className="font-medium">{booking.customer?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Phone</span>
                <span className="font-medium">{booking.customer?.phone}</span>
              </div>
              {booking.customer?.hotel && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Hotel</span>
                  <span className="font-medium">{booking.customer.hotel}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {booking.payments && booking.payments.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6">
            <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Payment Information</h2>
            <div className="space-y-3 text-body-md font-body-md">
              {booking.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-travel-blue" />
                    <span className="font-medium">{payment.provider}</span>
                    <span className="text-outline">· {payment.status}</span>
                  </div>
                  <Price amount={Number(payment.amount)} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {["WAITING_PAYMENT", "PENDING"].includes(booking.status) && (
            <Link
              href={`/my-bookings/${booking.id}/payment`}
              className="bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors"
            >
              Complete Payment
            </Link>
          )}
          {["PENDING", "CONFIRMED"].includes(booking.status) && (
            <button
              onClick={() => {
                fetch(`/api/bookings/${booking.id}`, {
                  method: "PATCH",
                  body: JSON.stringify({ status: "CANCELLED" }),
                }).then(() => window.location.reload())
              }}
              className="border-2 border-error text-error px-6 py-3 rounded-lg font-semibold hover:bg-error/10 transition-colors"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
