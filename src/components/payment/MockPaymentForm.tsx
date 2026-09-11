"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, XCircle, ShieldCheck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/format"

interface Props {
  /** Transaction id issued by the mock payment provider */
  txn: string
  /** Amount to pay (in the smallest unit, e.g. VND) */
  amount: number
  currency: string
  /** Booking reference for redirect targets */
  bookingCode: string
}

type PaymentStatus = "PAID" | "CANCELLED"

export function MockPaymentForm({ txn, amount, currency, bookingCode }: Props) {
  const router = useRouter()
  const [processing, setProcessing] = useState<PaymentStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  // A mock provider session without a transaction id can never be completed.
  if (!txn) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <AlertTriangle className="h-8 w-8 text-error" />
        </div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          Invalid payment session
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant">
          This payment link is missing its transaction reference. Please start
          the payment again from your booking.
        </p>
        <Button variant="outline" onClick={() => router.push("/my-bookings")}>
          Go to My Bookings
        </Button>
      </div>
    )
  }

  const sendCallback = async (status: PaymentStatus): Promise<void> => {
    setProcessing(status)
    setError(null)
    try {
      const res = await fetch("/api/payments/webhook?provider=mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txn,
          amount,
          currency,
          status,
        }),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error?.message || "Webhook rejected the payment")
      }

      if (status === "PAID") {
        router.push(`/payment/success?booking=${encodeURIComponent(bookingCode)}`)
      } else {
        router.push(`/payment/failed?booking=${encodeURIComponent(bookingCode)}`)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not complete the payment"
      )
      setProcessing(null)
    }
  }

  const handlePay = (): void => {
    if (processing === null) {
      void sendCallback("PAID")
    }
  }

  const handleCancel = (): void => {
    if (processing === null) {
      void sendCallback("CANCELLED")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
          <ShieldCheck className="h-7 w-7 text-travel-blue" />
        </div>
        <h1 className="text-headline-md font-headline-md text-primary">
          Mock Payment Gateway
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Simulate the result of this payment — no real money moves.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">Booking reference</span>
          <span className="font-mono font-semibold text-on-surface">
            {bookingCode}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body-md font-body-md text-on-surface-variant">
            Amount due
          </span>
          <span className="text-headline-sm font-headline-sm font-bold text-on-surface">
            {formatPrice(amount, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>Transaction</span>
          <span className="font-mono">{txn}</span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-error/40 bg-error/5 p-3 text-sm text-error"
        >
          Could not complete the payment: {error}. Please try again.
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="blue"
          size="lg"
          onClick={handlePay}
          disabled={processing !== null}
          loading={processing === "PAID"}
        >
          <CreditCard className="h-4 w-4" />
          Pay {formatPrice(amount, currency)}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleCancel}
          disabled={processing !== null}
          loading={processing === "CANCELLED"}
        >
          <XCircle className="h-4 w-4" />
          Cancel payment
        </Button>
      </div>

      <p className="text-center text-xs text-outline">
        Sandbox provider for development & testing only
      </p>
    </div>
  )
}
