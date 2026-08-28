"use client"
import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Download, Phone, Mail, MapPin, Car, User, AlertTriangle, Info } from "lucide-react"
import { ErrorState } from "@/components/ui/ErrorState"

interface VoucherData {
  id: string
  code: string
  qrCode: string
  booking: {
    bookingCode: string
    status: string
    total: number
    currency: string
    customerName: string
    customerEmail: string
    customerPhone: string
    vehicle?: string
    date?: string
    time?: string
    pickup?: string
    dropoff?: string
    passengers?: number
    luggage?: number
    specialRequest?: string
    items: Array<{
      serviceName: string
      quantity: number
      unitPrice: number
      total: number
    }>
  }
}

export default function VoucherPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [voucher, setVoucher] = useState<VoucherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVoucher() {
      try {
        const res = await fetch(`/api/vouchers/${id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error?.message || "Voucher not found")
        setVoucher(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error")
      } finally {
        setLoading(false)
      }
    }
    fetchVoucher()
  }, [id])

  if (loading) {
    return (
      <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-16 flex justify-center">
        <div className="h-96 w-full max-w-3xl bg-surface-container rounded-xl animate-pulse" />
      </section>
    )
  }

  if (error || !voucher) {
    return (
      <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-16">
        <ErrorState title="Voucher Not Found" message={error || "This voucher could not be found."} />
      </section>
    )
  }

  const b = voucher.booking

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12">
      {/* ── Voucher Header ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="mb-4 md:mb-0">
          <div className="font-display-lg-mobile text-display-lg-mobile font-black text-primary tracking-tight">
            MARIVO<span className="text-travel-blue">.vn</span>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">
            Phu Quoc Travel Expert
          </div>
        </div>
        <div className="text-left md:text-right">
          <h1 className="font-headline-md text-headline-md font-bold text-outline uppercase tracking-wider">
            Booking Voucher
          </h1>
        </div>
      </header>

      {/* ── Status Header ── */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-surface-container-low p-6 rounded-lg">
        <div>
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            Booking Reference
          </div>
          <div className="font-display-lg text-display-lg text-primary font-bold mb-3">
            {b.bookingCode}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-success text-white rounded font-label-sm text-label-sm font-bold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Status: {b.status}
          </div>
        </div>
        <div className="w-32 h-32 bg-surface-container-lowest p-2 rounded border border-outline-variant flex-shrink-0">
          {voucher.qrCode ? (
            <img src={voucher.qrCode} alt="QR Code" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container rounded">
              <span className="text-outline text-xs">QR Code</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Two Column Details ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Service Details */}
        <div className="border border-outline-variant rounded-lg p-6 bg-surface-container-lowest">
          <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant pb-4 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-travel-blue" />
            Transfer Service
          </h2>
          <dl className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] items-start">
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Vehicle</dt>
              <dd className="font-body-md text-body-md text-primary font-bold">{b.vehicle || "7 Seat SUV (Private)"}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-start">
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Date & Time</dt>
              <dd className="font-body-md text-body-md text-on-surface">{b.date || "15 Nov 2024"}, {b.time || "14:30"} (Local Time)</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-start">
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pick-up</dt>
              <dd className="font-body-md text-body-md text-on-surface">{b.pickup || "Phu Quoc International Airport (PQC)"}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-start">
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Drop-off</dt>
              <dd className="font-body-md text-body-md text-on-surface">{b.dropoff || "JW Marriott Phu Quoc Emerald Bay"}</dd>
            </div>
            <div className="border-t border-outline-variant pt-4 mt-2 flex gap-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="text-label-md font-label-md">{b.passengers || 4} Passengers</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="text-label-md font-label-md">{b.luggage || 3} Luggage</span>
              </div>
            </div>
          </dl>
        </div>

        {/* Customer Details */}
        <div className="border border-outline-variant rounded-lg p-6 bg-surface-container-lowest">
          <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant pb-4 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-travel-blue" />
            Lead Passenger
          </h2>
          <dl className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] items-center">
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Name</dt>
              <dd className="font-body-md text-body-md text-primary font-bold">{b.customerName}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Phone</dt>
              <dd className="font-body-md text-body-md text-on-surface">{b.customerPhone}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center">
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Email</dt>
              <dd className="font-body-md text-body-md text-on-surface">{b.customerEmail}</dd>
            </div>
            {b.specialRequest && (
              <div className="grid grid-cols-[120px_1fr] items-start pt-4 border-t border-outline-variant">
                <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Special Req.</dt>
                <dd className="font-body-md text-body-md text-on-surface">{b.specialRequest}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* ── Important Information ── */}
      <div className="border border-outline-variant rounded-lg p-6 bg-surface mb-10">
        <h3 className="font-label-md text-label-md font-bold text-primary mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-warning" />
          Important Information
        </h3>
        <ul className="list-disc pl-5 space-y-2 font-body-md text-body-md text-on-surface-variant">
          <li><strong>Meeting Point:</strong> Please look for our driver holding a sign with the lead passenger&apos;s name at the arrival gate exit.</li>
          <li><strong>Waiting Time:</strong> Free waiting time is up to 60 minutes after actual flight landing time. If you are delayed, please contact support immediately.</li>
          <li><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the scheduled pickup time. Non-refundable thereafter.</li>
          <li>Please present this voucher (printed or on mobile) to the driver upon meeting.</li>
        </ul>
      </div>

      {/* ── Footer / Contact ── */}
      <footer className="border-t-2 border-outline-variant pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="font-label-sm text-label-sm text-on-surface-variant">
          Need assistance with this booking?
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-1.5 font-label-md text-label-md text-primary">
            <Phone className="h-4 w-4 text-outline" />
            +84 90 123 4567
          </div>
          <div className="flex items-center gap-1.5 font-label-md text-label-md text-primary">
            <Mail className="h-4 w-4 text-outline" />
            support@marivo.vn
          </div>
        </div>
      </footer>

      {/* ── Print Actions ── */}
      <div className="mt-8 flex gap-3 justify-center">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md font-label-md font-semibold hover:bg-surface-container transition-colors"
        >
          <Download className="h-4 w-4" /> Print Voucher
        </button>
        <Link
          href="/my-bookings"
          className="flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-label-md font-label-md font-bold hover:bg-secondary-fixed-dim transition-colors"
        >
          View My Bookings
        </Link>
      </div>
    </section>
  )
}
