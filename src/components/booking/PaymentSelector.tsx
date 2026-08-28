"use client"
import { useState } from "react"
import { CreditCard, Wallet, Building2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/utils/cn"

interface PaymentSelectorProps {
  bookingId: string
  total: number
  currency: string
  onPaymentInit: (provider: string) => void
  loading?: boolean
}

const PAYMENT_METHODS = [
  {
    id: "momo",
    name: "MoMo",
    description: "Pay with MoMo e-wallet",
    icon: <Wallet className="h-6 w-6" />,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "vnpay",
    name: "VNPay",
    description: "Pay with VNPay (ATM/Visa/Master)",
    icon: <CreditCard className="h-6 w-6" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Transfer directly to our bank account",
    icon: <Building2 className="h-6 w-6" />,
    color: "bg-green-100 text-green-700",
  },
]

function PaymentSelector({
  bookingId,
  total,
  currency,
  onPaymentInit,
  loading,
}: PaymentSelectorProps) {
  const [selected, setSelected] = useState<string>("momo")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
        <p className="text-sm text-gray-500">
          Total: <span className="font-semibold text-marivo-700">{total.toLocaleString()} {currency === "VND" ? "₫" : currency}</span>
        </p>
      </div>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={cn(
              "flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
              selected === method.id
                ? "border-marivo-600 bg-marivo-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => setSelected(method.id)}
              className="sr-only"
            />
            <div className={cn("rounded-lg p-2", method.color)}>
              {method.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{method.name}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                selected === method.id ? "border-marivo-600" : "border-gray-300"
              )}
            >
              {selected === method.id && (
                <div className="h-2.5 w-2.5 rounded-full bg-marivo-600" />
              )}
            </div>
          </label>
        ))}
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={() => onPaymentInit(selected)}
        loading={loading}
      >
        Pay {total.toLocaleString()} {currency === "VND" ? "₫" : currency}
      </Button>

      <p className="text-xs text-center text-gray-400">
        🔒 Your payment is secured with SSL encryption
      </p>
    </div>
  )
}

export { PaymentSelector }
