import { Price } from "@/components/ui/Price"
import type { Quote } from "@/types"

interface PriceBreakdownProps {
  quote: Quote
  compact?: boolean
}

function PriceBreakdown({ quote, compact = false }: PriceBreakdownProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <h4 className="font-medium text-gray-900">Price Breakdown</h4>

      {quote.priceBreakdown.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="text-gray-600">
            {item.name}
            {item.quantity && item.quantity > 1 && (
              <span className="text-gray-400"> × {item.quantity}</span>
            )}
          </span>
          <Price amount={item.amount} size="sm" />
        </div>
      ))}

      <div className="border-t border-gray-200 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <Price amount={quote.subtotal} size="sm" />
        </div>
        {quote.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{quote.discount.toLocaleString()} ₫</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service Fee</span>
          <Price amount={quote.serviceFee} size="sm" />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
        <span className="font-semibold text-gray-900">Total</span>
        <Price amount={quote.total} size="xl" />
      </div>

      {quote.expiresAt && (
        <p className="text-xs text-gray-400 text-right">
          Quote valid until {new Date(quote.expiresAt).toLocaleString()}
        </p>
      )}
    </div>
  )
}

export { PriceBreakdown }
