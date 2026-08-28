"use client"
import { use, useState, useEffect, useRef } from "react"
import Link from "next/link"
import QRCode from "qrcode"
import { format } from "date-fns"
import {
  CreditCard,
  Copy,
  CheckCircle,
  CheckCircle2,
  ArrowLeft,
  Home,
  ShieldCheck,
  Building2,
} from "lucide-react"
import { Price } from "@/components/ui/Price"
import { ErrorState } from "@/components/ui/ErrorState"
import { ServiceDetailSkeleton } from "@/components/ui/LoadingSkeleton"
import type { BookingDetail } from "@/types"

const BANK_INFO = {
  bankName: "Vietcombank",
  accountNumber: "1234 5678 9012",
  accountHolder: "CONG TY TNHH MARIVO",
  branch: "Chi nhanh Phu Quoc",
  content: "MARIVO booking",
}

export default function BookingPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

  const canPay =
    booking && ["WAITING_PAYMENT", "PENDING"].includes(booking.status)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleConfirm = async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || "Could not record payment")
      setBooking((prev) => (prev ? { ...prev, status: "PAID" } : prev))
      setConfirmed(true)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Could not record payment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

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

  // If there is nothing left to pay (and we are not on the just-confirmed screen),
  // tell the user rather than showing transfer UI.
  if (!canPay && !confirmed) {
    return (
      <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
        <div className="max-w-xl mx-auto text-center bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-8 space-y-4">
          <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
          <h1 className="text-headline-md font-headline-md text-on-surface">
            {booking.bookingCode}
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            This booking is currently{" "}
            <span className="font-semibold text-on-surface">
              {booking.status.replace(/_/g, " ").toLowerCase()}
            </span>{" "}
            and no payment is required right now.
          </p>
          <Link
            href={`/my-bookings/${id}`}
            className="inline-flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Booking
          </Link>
        </div>
      </section>
    )
  }

  const total = Number(booking.total)
  const bookingCode = booking.bookingCode
  const transferContent = `${BANK_INFO.content} ${bookingCode}`
  const qrPayload = [
    " bankName:", BANK_INFO.bankName,
    " | account:", BANK_INFO.accountNumber,
    " | holder:", BANK_INFO.accountHolder,
    " | amount:", total,
    " | content:", transferContent,
  ].join("")

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-6">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/my-bookings" className="hover:text-travel-blue">My Bookings</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href={`/my-bookings/${id}`} className="hover:text-travel-blue">{bookingCode}</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Payment</li>
        </ol>
      </nav>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6 text-center">
          <h1 className="text-headline-md font-headline-md text-on-surface mb-1">
            Complete Your Payment
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Booking <span className="font-mono font-semibold text-travel-blue">{bookingCode}</span>
          </p>
          <p className="mt-3 text-xs text-on-surface-variant">
            Booked on {format(new Date(booking.createdAt), "MMMM d, yyyy")}
          </p>
        </div>

        {/* Amount */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6 text-center">
          <p className="text-label-md font-label-md text-on-surface-variant mb-2">Amount to Transfer</p>
          <Price amount={total} size="xl" />
        </div>

        {/* Bank Transfer */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-travel-blue" />
            <h2 className="text-headline-sm font-headline-sm text-primary">
              Bank Transfer Details
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <QRPanel payload={qrPayload} />
            <div className="flex-1 space-y-4 w-full">
              {[
                { label: "Bank", value: BANK_INFO.bankName },
                { label: "Account Number", value: BANK_INFO.accountNumber, copyable: true },
                { label: "Account Holder", value: BANK_INFO.accountHolder, copyable: true },
                { label: "Branch", value: BANK_INFO.branch },
                { label: "Transfer Content", value: transferContent, copyable: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-outline-variant last:border-0">
                  <div>
                    <p className="text-xs text-on-surface-variant">{item.label}</p>
                    <p className="text-sm font-medium text-on-surface">{item.value}</p>
                  </div>
                  {item.copyable && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="flex items-center gap-1 text-xs text-travel-blue hover:text-travel-blue/80 transition-colors px-2 py-1 rounded hover:bg-travel-blue/5"
                    >
                      {copied === item.label ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6">
          <h2 className="text-headline-sm font-headline-sm text-primary mb-3">Payment Instructions</h2>
          <ol className="space-y-2 text-sm text-on-surface-variant list-decimal list-inside">
            <li>Open your banking app or visit your bank</li>
            <li>Transfer the exact amount shown above</li>
            <li>Include the booking code in the transfer content</li>
            <li>Click &quot;I&apos;ve Completed Transfer&quot; below after payment</li>
          </ol>
          <div className="mt-3 p-3 bg-travel-blue/5 rounded-lg">
            <p className="text-xs text-travel-blue flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Your booking will be confirmed once we verify the transfer (usually within 30 minutes during business hours).
            </p>
          </div>
        </div>

        {confirmed ? (
          <div className="bg-success/10 border border-success/30 rounded-xl p-6 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
            <h2 className="text-headline-sm font-headline-sm text-on-surface">
              Transfer Registered
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Thank you! We&apos;ll confirm your booking <span className="font-mono font-semibold">{bookingCode}</span> once the transfer is verified.
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Link
                href={`/my-bookings/${id}`}
                className="flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-sm font-bold hover:bg-secondary-fixed-dim transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Booking
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {submitError && (
              <div className="rounded-lg border border-error/40 bg-error/5 p-3 text-sm text-error">
                {submitError}
              </div>
            )}
            <div className="flex gap-3">
              <Link
                href={`/my-bookings/${id}`}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-sm font-bold hover:bg-secondary-fixed-dim transition-colors active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Recording payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    I&apos;ve Completed Transfer
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function QRPanel({ payload }: { payload: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, payload, {
      width: 220,
      margin: 2,
      color: { dark: "#1a1a2e", light: "#ffffff" },
    })
    QRCode.toDataURL(payload, {
      width: 220,
      margin: 2,
      color: { dark: "#1a1a2e", light: "#ffffff" },
    }).then(setQrDataUrl)
  }, [payload])

  return (
    <div className="flex-shrink-0 text-center">
      <p className="text-label-md font-label-md text-on-surface mb-3">Scan QR Code</p>
      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt="Bank Transfer QR Code"
          className="w-[220px] h-[220px] rounded-lg border border-outline-variant"
        />
      ) : (
        <div className="w-[220px] h-[220px] rounded-lg border border-outline-variant flex items-center justify-center bg-surface-alt">
          <canvas ref={canvasRef} className="hidden" />
          <div className="animate-pulse text-on-surface-variant text-sm">Generating QR...</div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
