import { PriceBreakdown } from "./PriceBreakdown"
import { Button } from "@/components/ui/Button"
import type { Quote } from "@/types"
import type { BookingCustomerInput } from "@/schemas/booking"

interface BookingConfirmationProps {
  quote: Quote
  customer: BookingCustomerInput
  onConfirm: () => void
  onBack: () => void
  loading?: boolean
}

function BookingConfirmation({
  quote,
  customer,
  onConfirm,
  onBack,
  loading,
}: BookingConfirmationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Confirm Your Booking</h3>
        <p className="text-sm text-gray-500">Please review your booking details</p>
      </div>

      {/* Trip Summary */}
      <div className="rounded-xl border border-gray-200 p-4 space-y-3">
        <h4 className="font-medium text-gray-900">Trip Details</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Service</span>
            <p className="font-medium">{quote.serviceName}</p>
          </div>
          <div>
            <span className="text-gray-500">Trip Type</span>
            <p className="font-medium">{quote.tripType === "ONE_WAY" ? "One Way" : "Round Trip"}</p>
          </div>
          <div>
            <span className="text-gray-500">Date</span>
            <p className="font-medium">{quote.date}</p>
          </div>
          <div>
            <span className="text-gray-500">Time</span>
            <p className="font-medium">{quote.time}</p>
          </div>
          {quote.vehicleName && (
            <div>
              <span className="text-gray-500">Vehicle</span>
              <p className="font-medium">{quote.vehicleName}</p>
            </div>
          )}
          <div>
            <span className="text-gray-500">Passengers</span>
            <p className="font-medium">{quote.passengers}</p>
          </div>
          {quote.flightNumber && (
            <div>
              <span className="text-gray-500">Flight</span>
              <p className="font-medium">{quote.flightNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Info */}
      <div className="rounded-xl border border-gray-200 p-4 space-y-3">
        <h4 className="font-medium text-gray-900">Customer Information</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Name</span>
            <p className="font-medium">{customer.fullName}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="font-medium">{customer.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone</span>
            <p className="font-medium">{customer.phone}</p>
          </div>
          {customer.hotel && (
            <div>
              <span className="text-gray-500">Hotel</span>
              <p className="font-medium">{customer.hotel}</p>
            </div>
          )}
        </div>
        {customer.specialRequest && (
          <div className="text-sm">
            <span className="text-gray-500">Special Request</span>
            <p className="mt-1 text-gray-700">{customer.specialRequest}</p>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="rounded-xl border border-gray-200 p-4">
        <PriceBreakdown quote={quote} />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button className="flex-1" onClick={onConfirm} loading={loading}>
          Confirm & Proceed to Payment
        </Button>
      </div>
    </div>
  )
}

export { BookingConfirmation }
