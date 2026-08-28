"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { quoteSchema, type QuoteInput } from "@/schemas/booking"

interface TripInfoFormProps {
  serviceId: string
  serviceName: string
  vehicles?: Array<{
    id: string
    name: string
    seats: number
    luggage: number
    pricePerTrip: number
    vehicleType: { name: string; slug: string }
  }>
  locations?: Array<{ id: string; name: string; slug: string; type: string; area: string | null }>
  onSubmit: (data: QuoteInput) => void
  loading?: boolean
}

const TIME_SLOTS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
]

function TripInfoForm({
  serviceId,
  serviceName,
  vehicles,
  locations,
  onSubmit,
  loading,
}: TripInfoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      serviceId,
      tripType: "ONE_WAY",
      passengers: 1,
      luggage: 0,
      date: "",
      time: "",
    },
  })

  const tripType = watch("tripType")

  const locationOptions = [
    { value: "", label: "Select location" },
    ...(locations || []).map((loc) => ({
      value: loc.id,
      label: `${loc.name}${loc.area ? ` (${loc.area})` : ""}`,
    })),
  ]

  const vehicleOptions = [
    { value: "", label: "Select vehicle" },
    ...(vehicles || []).map((v) => ({
      value: v.id,
      label: `${v.vehicleType.name} - ${v.name} (${v.seats} seats, ${v.luggage} luggage)`,
    })),
  ]

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Trip Information</h3>
        <p className="text-sm text-gray-500">{serviceName}</p>
      </div>

      {/* Trip Type */}
      <div className="flex gap-3">
        <label className="flex-1">
          <input
            type="radio"
            value="ONE_WAY"
            {...register("tripType")}
            className="sr-only peer"
          />
          <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-3 text-center text-sm font-medium peer-checked:border-marivo-600 peer-checked:bg-marivo-50 peer-checked:text-marivo-700 transition-colors">
            🚗 One Way
          </div>
        </label>
        <label className="flex-1">
          <input
            type="radio"
            value="ROUND_TRIP"
            {...register("tripType")}
            className="sr-only peer"
          />
          <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-3 text-center text-sm font-medium peer-checked:border-marivo-600 peer-checked:bg-marivo-50 peer-checked:text-marivo-700 transition-colors">
            🔄 Round Trip
          </div>
        </label>
      </div>

      {/* Vehicle */}
      {vehicles && vehicles.length > 0 && (
        <Select
          label="Vehicle"
          options={vehicleOptions}
          {...register("vehicleId")}
          error={errors.vehicleId?.message}
        />
      )}

      {/* Pickup & Dropoff */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Pickup Location"
          options={locationOptions}
          {...register("pickupId")}
          error={errors.pickupId?.message}
        />
        <Select
          label="Drop-off Location"
          options={locationOptions}
          {...register("dropoffId")}
          error={errors.dropoffId?.message}
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="date"
          label="Travel Date"
          min={today}
          {...register("date")}
          error={errors.date?.message}
          required
        />
        <Select
          label="Travel Time"
          options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
          placeholder="Select time"
          {...register("time")}
          error={errors.time?.message}
          required
        />
      </div>

      {/* Round trip date */}
      {tripType === "ROUND_TRIP" && (
        <Input
          type="date"
          label="Return Date"
          min={today}
          {...register("date")}
          helperText="Same as travel date for now"
        />
      )}

      {/* Flight Number */}
      <Input
        label="Flight Number (optional)"
        placeholder="e.g., VN123"
        {...register("flightNumber")}
      />

      {/* Passengers & Luggage */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="number"
          label="Passengers"
          min={1}
          max={50}
          {...register("passengers", { valueAsNumber: true })}
          error={errors.passengers?.message}
          required
        />
        <Input
          type="number"
          label="Luggage Items"
          min={0}
          max={50}
          {...register("luggage", { valueAsNumber: true })}
          error={errors.luggage?.message}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Get Price Quote
      </Button>
    </form>
  )
}

export { TripInfoForm }
