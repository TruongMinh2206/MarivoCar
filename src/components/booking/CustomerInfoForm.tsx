"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { bookingCustomerSchema, type BookingCustomerInput } from "@/schemas/booking"

interface CustomerInfoFormProps {
  onSubmit: (data: BookingCustomerInput) => void
  onBack: () => void
  loading?: boolean
}

function CustomerInfoForm({ onSubmit, onBack, loading }: CustomerInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingCustomerInput>({
    resolver: zodResolver(bookingCustomerSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
        <p className="text-sm text-gray-500">Who will be using this service?</p>
      </div>

      <Input
        label="Full Name"
        placeholder="John Smith"
        {...register("fullName")}
        error={errors.fullName?.message}
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="email"
          label="Email"
          placeholder="john@example.com"
          {...register("email")}
          error={errors.email?.message}
          required
        />
        <Input
          type="tel"
          label="Phone Number"
          placeholder="+84 xxx xxx xxx"
          {...register("phone")}
          error={errors.phone?.message}
          required
        />
      </div>

      <Input
        label="Hotel / Accommodation (optional)"
        placeholder="e.g., JW Marriott Phu Quoc"
        {...register("hotel")}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Special Requests (optional)
        </label>
        <textarea
          {...register("specialRequest")}
          rows={3}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-marivo-500/20 focus:border-marivo-500 hover:border-gray-400"
          placeholder="Any special requirements or notes..."
        />
        {errors.specialRequest && (
          <p className="mt-1 text-sm text-red-600">{errors.specialRequest.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1" loading={loading}>
          Review Booking
        </Button>
      </div>
    </form>
  )
}

export { CustomerInfoForm }
