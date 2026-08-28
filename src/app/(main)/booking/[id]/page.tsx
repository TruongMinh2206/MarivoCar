"use client"

import { useState, useEffect, useCallback, useRef, use } from "react"
import Link from "next/link"
import QRCode from "qrcode"
import {
  Check,
  Car,
  User,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  Plane,
  Users,
  Luggage,
  CheckCircle2,
  FileText,
  Home,
  Copy,
  CheckCircle,
  Building2,
} from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/utils/cn"

// ─── Step definitions ────────────────────────────────────────────────────────

const STEPS = [
  { label: "Trip Information", short: "Trip Info", icon: Car },
  { label: "Customer Information", short: "Customer", icon: User },
  { label: "Confirmation", short: "Confirm", icon: FileText },
  { label: "Payment", short: "Payment", icon: CreditCard },
  { label: "Complete", short: "Done", icon: CheckCircle2 },
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface TripData {
  tripType: "one-way" | "round-trip"
  from: string
  to: string
  date: string
  time: string
  flightNumber: string
  passengers: number
  luggage: number
}

interface CustomerData {
  fullName: string
  email: string
  phone: string
  hotel: string
  specialRequest: string
}

// ─── Shared input styles (design tokens) ─────────────────────────────────────

const inputClasses =
  "w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-ink-outline focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none transition-colors"

const labelClasses = "text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider"

const cardClasses = "bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient"

// ─── Step 1: Trip Information ────────────────────────────────────────────────

function StepTripInformation({
  data,
  onNext,
}: {
  data: TripData
  onNext: (data: TripData) => void
}) {
  const [form, setForm] = useState<TripData>(data)
  const [errors, setErrors] = useState<Partial<Record<keyof TripData, string>>>({})

  const today = new Date().toISOString().split("T")[0]

  const update = (field: keyof TripData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof TripData, string>> = {}
    if (!form.from.trim()) errs.from = "Pickup location is required"
    if (!form.to.trim()) errs.to = "Destination is required"
    if (!form.date) errs.date = "Travel date is required"
    if (!form.time) errs.time = "Travel time is required"
    if (form.passengers < 1) errs.passengers = "At least 1 passenger required"
    if (form.passengers > 16) errs.passengers = "Maximum 16 passengers"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onNext(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          Trip Information
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Tell us about your trip
        </p>
      </div>

      {/* Trip Type - Segmented Toggle */}
      <div className="space-y-2">
        <label className="text-label-md font-label-md text-on-surface block">Transfer Type</label>
        <div className="inline-flex bg-surface-container rounded-lg p-1">
          {(["one-way", "round-trip"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update("tripType", type)}
              className={cn(
                "px-6 py-2 rounded-md text-label-md font-label-md transition-all",
                form.tripType === type
                  ? "bg-surface-container-lowest text-primary shadow-ambient"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              {type === "one-way" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>
      </div>

      {/* From & To with swap button */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 relative">
        <div className="space-y-1.5">
          <label htmlFor="from" className="text-label-md font-label-md text-on-surface block">
            From (Pickup)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              id="from"
              type="text"
              value={form.from}
              onChange={(e) => update("from", e.target.value)}
              placeholder="Phu Quoc International Airport (PQC)"
              className={cn("w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none transition-colors", errors.from && "border-error focus:border-error focus:ring-error/20")}
            />
          </div>
          {errors.from && <p className="text-xs text-error">{errors.from}</p>}
        </div>

        {/* Swap Button */}
        <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2 z-10 w-8 h-8 bg-surface-container-lowest border border-outline-variant rounded-full items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors shadow-ambient">
          <ArrowRight className="h-4 w-4 text-on-surface-variant rotate-90" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="to" className="text-label-md font-label-md text-on-surface block">
            To (Destination)
          </label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              id="to"
              type="text"
              value={form.to}
              onChange={(e) => update("to", e.target.value)}
              placeholder="Enter hotel or address"
              className={cn("w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none transition-colors", errors.to && "border-error focus:border-error focus:ring-error/20")}
            />
          </div>
          {errors.to && <p className="text-xs text-error">{errors.to}</p>}
        </div>
      </div>

      {/* Date & Time with icons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="date" className="text-label-md font-label-md text-on-surface block">
            Pickup Date
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              id="date"
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={cn("w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none transition-colors", errors.date && "border-error focus:border-error focus:ring-error/20")}
            />
          </div>
          {errors.date && <p className="text-xs text-error">{errors.date}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="time" className="text-label-md font-label-md text-on-surface block">
            Pickup Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <select
              id="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              className={cn("w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none appearance-none transition-colors", errors.time && "border-error focus:border-error focus:ring-error/20")}
            >
              <option value="">Select time</option>
              <option value="morning">Morning (06:00 - 12:00)</option>
              <option value="afternoon">Afternoon (12:00 - 17:00)</option>
              <option value="evening">Evening (17:00 - 21:00)</option>
            </select>
          </div>
          {errors.time && <p className="text-xs text-error">{errors.time}</p>}
        </div>
      </div>

      {/* Flight Number with helper text */}
      <div className="space-y-1.5">
        <label htmlFor="flightNumber" className="text-label-md font-label-md text-on-surface block">
          Flight Number
        </label>
        <input
          id="flightNumber"
          type="text"
          value={form.flightNumber}
          onChange={(e) => update("flightNumber", e.target.value)}
          placeholder="e.g. VN123"
          className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none transition-colors"
        />
        <p className="text-label-sm font-label-sm text-outline">For flight tracking</p>
      </div>

      {/* Passengers & Luggage with icons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="passengers" className="text-label-md font-label-md text-on-surface block">
            Passengers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <select
              id="passengers"
              value={form.passengers}
              onChange={(e) => update("passengers", parseInt(e.target.value))}
              className={cn("w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none appearance-none transition-colors", errors.passengers && "border-error focus:border-error focus:ring-error/20")}
            >
              <option value={1}>1-3 People</option>
              <option value={4}>4-6 People</option>
              <option value={7}>7-10 People</option>
              <option value={11}>11+ People</option>
            </select>
          </div>
          {errors.passengers && <p className="text-xs text-error">{errors.passengers}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="luggage" className="text-label-md font-label-md text-on-surface block">
            Luggage
          </label>
          <div className="relative">
            <Luggage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <select
              id="luggage"
              value={form.luggage}
              onChange={(e) => update("luggage", parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none appearance-none transition-colors"
            >
              <option value={0}>None</option>
              <option value={2}>Standard (2-3 bags)</option>
              <option value={4}>Large (4-6 bags)</option>
              <option value={6}>Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-6 border-t border-outline-variant flex justify-end">
        <button
          type="submit"
          className="bg-secondary-container text-on-secondary-fixed-variant px-8 py-4 rounded-lg text-label-md font-label-md font-bold shadow-ambient hover:shadow hover:bg-secondary-fixed-dim transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
        >
          Continue to Details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}

// ─── Step 2: Customer Information ────────────────────────────────────────────

function StepCustomerInformation({
  data,
  tripData,
  onNext,
  onBack,
}: {
  data: CustomerData
  tripData: TripData
  onNext: (data: CustomerData) => void
  onBack: () => void
}) {
  const [form, setForm] = useState<CustomerData>(data)
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({})

  const update = (field: keyof CustomerData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof CustomerData, string>> = {}
    if (!form.fullName.trim()) errs.fullName = "Full name is required"
    if (!form.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address"
    if (!form.phone.trim()) errs.phone = "Phone number is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onNext(form)
  }

  const summaryCard = (
    <div className={cn(cardClasses, "p-5 sticky top-24")}>
      <h3 className="text-label-md font-label-md text-on-surface mb-4">Booking Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
          <span className="truncate">{tripData.from || "N/A"}</span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
          <span className="truncate">{tripData.to || "N/A"}</span>
        </div>
        <div className="border-t border-outline-variant pt-3 mt-3 space-y-2">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Clock className="h-4 w-4 text-ink-outline shrink-0" />
            <span>{tripData.date || "Not set"} &middot; {tripData.time || "Not set"}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Users className="h-4 w-4 text-ink-outline shrink-0" />
            <span>{tripData.passengers} passenger{tripData.passengers !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Luggage className="h-4 w-4 text-ink-outline shrink-0" />
            <span>{tripData.luggage} luggage item{tripData.luggage !== 1 ? "s" : ""}</span>
          </div>
          {tripData.flightNumber && (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <Plane className="h-4 w-4 text-ink-outline shrink-0" />
              <span>{tripData.flightNumber}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          Customer Information
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Who will be using this service?
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="fullName" className={labelClasses}>
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Your full name"
          className={cn(inputClasses, errors.fullName && "border-error focus:border-error focus:ring-error/20")}
          required
        />
        {errors.fullName && <p className="text-xs text-error">{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
            className={cn(inputClasses, errors.email && "border-error focus:border-error focus:ring-error/20")}
            required
          />
          {errors.email && <p className="text-xs text-error">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className={labelClasses}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+84 xxx xxx xxx"
            className={cn(inputClasses, errors.phone && "border-error focus:border-error focus:ring-error/20")}
            required
          />
          {errors.phone && <p className="text-xs text-error">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="hotel" className={labelClasses}>
          Hotel (optional)
        </label>
        <input
          id="hotel"
          type="text"
          value={form.hotel}
          onChange={(e) => update("hotel", e.target.value)}
          placeholder="e.g. JW Marriott Phu Quoc"
          className={inputClasses}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="specialRequest" className={labelClasses}>
          Special Request (optional)
        </label>
        <textarea
          id="specialRequest"
          value={form.specialRequest}
          onChange={(e) => update("specialRequest", e.target.value)}
          rows={3}
          placeholder="Any special requirements or notes..."
          className={cn(inputClasses, "resize-none")}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-sm font-bold hover:bg-secondary-fixed-dim transition-colors active:scale-[0.98]"
        >
          Continue
        </button>
      </div>

      {/* Desktop sidebar summary (hidden on mobile) */}
      <div className="hidden lg:block">{summaryCard}</div>
    </form>
  )
}

// ─── Step 3: Confirmation ────────────────────────────────────────────────────

function StepConfirmation({
  tripData,
  customerData,
  paymentMethod,
  onSetPayment,
  onPayNow,
  onBack,
  submitting,
  submitError,
}: {
  tripData: TripData
  customerData: CustomerData
  paymentMethod: string
  onSetPayment: (method: string) => void
  onPayNow: () => void
  onBack: () => void
  submitting: boolean
  submitError: string
}) {
  // Mock pricing
  const basePrice = 350000
  const subtotal = basePrice * tripData.passengers
  const discount = tripData.tripType === "round-trip" ? Math.round(subtotal * 0.1) : 0
  const serviceFee = 25000
  const total = subtotal - discount + serviceFee

  const formatPrice = (amount: number) =>
    amount.toLocaleString("vi-VN") + " ₫"

  const summaryCard = (
    <div className={cn(cardClasses, "p-5")}>
      <h3 className="text-label-md font-label-md text-on-surface mb-4">Booking Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
          <span className="truncate">{tripData.from}</span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
          <span className="truncate">{tripData.to}</span>
        </div>
        <div className="border-t border-outline-variant pt-3 mt-3 space-y-2">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Clock className="h-4 w-4 text-ink-outline shrink-0" />
            <span>{tripData.date} &middot; {tripData.time}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Users className="h-4 w-4 text-ink-outline shrink-0" />
            <span>{tripData.passengers} passenger{tripData.passengers !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Luggage className="h-4 w-4 text-ink-outline shrink-0" />
            <span>{tripData.luggage} luggage item{tripData.luggage !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="border-t border-outline-variant pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Total</span>
            <span className="text-lg font-bold text-on-surface">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          Confirm Your Booking
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Please review your booking details
        </p>
      </div>

      {/* Trip Details */}
      <div className={cn(cardClasses, "p-5 space-y-4")}>
        <h3 className="text-label-md font-label-md text-on-surface">Trip Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-on-surface-variant block mb-0.5">Service</span>
            <p className="font-medium text-on-surface">Airport Transfer</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Vehicle</span>
            <p className="font-medium text-on-surface">Standard Sedan</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Trip Type</span>
            <p className="font-medium text-on-surface">
              {tripData.tripType === "one-way" ? "One Way" : "Round Trip"}
            </p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Date</span>
            <p className="font-medium text-on-surface">{tripData.date}</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Time</span>
            <p className="font-medium text-on-surface capitalize">{tripData.time}</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Passengers</span>
            <p className="font-medium text-on-surface">{tripData.passengers}</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Luggage</span>
            <p className="font-medium text-on-surface">{tripData.luggage}</p>
          </div>
          {tripData.flightNumber && (
            <div>
              <span className="text-on-surface-variant block mb-0.5">Flight</span>
              <p className="font-medium text-on-surface">{tripData.flightNumber}</p>
            </div>
          )}
          <div>
            <span className="text-on-surface-variant block mb-0.5">Pickup</span>
            <p className="font-medium text-on-surface">{tripData.from}</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Destination</span>
            <p className="font-medium text-on-surface">{tripData.to}</p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className={cn(cardClasses, "p-5 space-y-4")}>
        <h3 className="text-label-md font-label-md text-on-surface">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-on-surface-variant block mb-0.5">Name</span>
            <p className="font-medium text-on-surface">{customerData.fullName}</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Email</span>
            <p className="font-medium text-on-surface">{customerData.email}</p>
          </div>
          <div>
            <span className="text-on-surface-variant block mb-0.5">Phone</span>
            <p className="font-medium text-on-surface">{customerData.phone}</p>
          </div>
          {customerData.hotel && (
            <div>
              <span className="text-on-surface-variant block mb-0.5">Hotel</span>
              <p className="font-medium text-on-surface">{customerData.hotel}</p>
            </div>
          )}
        </div>
        {customerData.specialRequest && (
          <div className="text-sm">
            <span className="text-on-surface-variant block mb-0.5">Special Request</span>
            <p className="text-on-surface">{customerData.specialRequest}</p>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className={cn(cardClasses, "p-5 space-y-3")}>
        <h3 className="text-label-md font-label-md text-on-surface">Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">
              Base Price &times; {tripData.passengers} passenger{tripData.passengers !== 1 ? "s" : ""}
            </span>
            <span className="text-on-surface">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Round Trip Discount (10%)</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Service Fee</span>
            <span className="text-on-surface">{formatPrice(serviceFee)}</span>
          </div>
        </div>
        <div className="border-t border-outline-variant pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-on-surface">Total</span>
            <span className="text-headline-sm font-headline-sm font-bold text-on-surface">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className={cn(cardClasses, "p-5 space-y-4")}>
        <h3 className="text-label-md font-label-md text-on-surface">Payment Method</h3>
        <div className="space-y-3">
          {[
            { id: "pay-now", label: "Pay Now", desc: "Pay securely with credit card or e-wallet" },
            { id: "bank-transfer", label: "Bank Transfer", desc: "Transfer to our bank account" },
            { id: "pay-later", label: "Pay Later", desc: "Pay in cash upon arrival" },
          ].map((method) => (
            <label
              key={method.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 p-3.5 cursor-pointer transition-all",
                paymentMethod === method.id
                  ? "border-travel-blue bg-travel-blue/5"
                  : "border-outline-variant hover:border-ink-outline"
              )}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={() => onSetPayment(method.id)}
                className="sr-only"
              />
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  paymentMethod === method.id
                    ? "border-travel-blue"
                    : "border-outline-variant"
                )}
              >
                {paymentMethod === method.id && (
                  <div className="h-2.5 w-2.5 rounded-full bg-travel-blue" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-label-md font-label-md text-on-surface">{method.label}</p>
                <p className="text-xs text-on-surface-variant">{method.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg border border-error/40 bg-error/5 p-3 text-sm text-error">
          {submitError} Please go back and try again.
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onPayNow}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-sm font-bold hover:bg-secondary-fixed-dim transition-colors active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating booking...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay Now
            </>
          )}
        </button>
      </div>

      {/* Desktop sidebar summary (hidden on mobile) */}
      <div className="hidden lg:block">{summaryCard}</div>
    </div>
  )
}

// ─── Step 4: Payment Processing ──────────────────────────────────────────────

function StepPayment({ bookingCode }: { bookingCode: string }) {
  return (
    <div className="text-center py-12 space-y-6">
      <div className="mx-auto w-16 h-16 border-4 border-outline-variant border-t-travel-blue rounded-full animate-spin" />
      <div className="space-y-2">
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          Processing your payment...
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Please do not close this page
        </p>
      </div>
      <div className={cn(cardClasses, "inline-block px-5 py-3")}>
        <p className="text-xs text-on-surface-variant">
          Booking Reference:{" "}
          <span className="font-mono font-semibold text-on-surface">{bookingCode}</span>
        </p>
      </div>
      <p className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
        <Shield className="h-3.5 w-3.5 text-success" />
        Your payment is secure and encrypted
      </p>
    </div>
  )
}

// ─── Step 4a: Bank Transfer ──────────────────────────────────────────────────

const BANK_INFO = {
  bankName: "Vietcombank",
  accountNumber: "1234 5678 9012",
  accountHolder: "CONG TY TNHH MARIVO",
  branch: "Chi nhanh Phu Quoc",
  content: "MARIVO booking",
}

function StepBankTransfer({
  total,
  bookingCode,
  onConfirm,
  onBack,
}: {
  total: number
  bookingCode: string
  onConfirm: () => void
  onBack: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const payload = [
      " bankName:", BANK_INFO.bankName,
      " | account:", BANK_INFO.accountNumber,
      " | holder:", BANK_INFO.accountHolder,
      " | amount:", total,
      " | content:", `${BANK_INFO.content} ${bookingCode}`,
    ].join("")
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
  }, [total, bookingCode])

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          Bank Transfer Payment
        </h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Transfer the exact amount to our bank account below
        </p>
      </div>

      {/* Amount to Pay */}
      <div className={cn(cardClasses, "p-5 text-center")}>
        <p className="text-label-md font-label-md text-on-surface-variant mb-2">
          Amount to Transfer
        </p>
        <p className="text-headline-md font-headline-md font-bold text-travel-blue">
          {total.toLocaleString("vi-VN")} ₫
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          Booking: <span className="font-mono font-semibold">{bookingCode}</span>
        </p>
      </div>

      {/* QR Code + Bank Details */}
      <div className={cn(cardClasses, "p-5")}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* QR Code */}
          <div className="flex-shrink-0 text-center">
            <p className="text-label-md font-label-md text-on-surface mb-3">
              Scan QR Code
            </p>
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

          {/* Bank Details */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-travel-blue" />
              <h3 className="text-label-md font-label-md text-on-surface">
                Transfer Details
              </h3>
            </div>

            {[
              { label: "Bank", value: BANK_INFO.bankName },
              { label: "Account Number", value: BANK_INFO.accountNumber, copyable: true },
              { label: "Account Holder", value: BANK_INFO.accountHolder, copyable: true },
              { label: "Branch", value: BANK_INFO.branch },
              { label: "Transfer Content", value: `${BANK_INFO.content} ${bookingCode}`, copyable: true },
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
      <div className={cn(cardClasses, "p-5")}>
        <h3 className="text-label-md font-label-md text-on-surface mb-3">
          Payment Instructions
        </h3>
        <ol className="space-y-2 text-sm text-on-surface-variant list-decimal list-inside">
          <li>Open your banking app or visit your bank</li>
          <li>Transfer the exact amount shown above</li>
          <li>Include the booking code in the transfer content</li>
          <li>Click &quot;I&apos;ve Completed Transfer&quot; below after payment</li>
        </ol>
        <div className="mt-3 p-3 bg-travel-blue/5 rounded-lg">
          <p className="text-xs text-travel-blue">
            <strong>Note:</strong> Your booking will be confirmed once we verify the transfer (usually within 30 minutes during business hours).
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-sm font-bold hover:bg-secondary-fixed-dim transition-colors active:scale-[0.98]"
        >
          <CheckCircle2 className="h-4 w-4" />
          I&apos;ve Completed Transfer
        </button>
      </div>
    </div>
  )
}

// ─── Step 5: Complete ────────────────────────────────────────────────────────

function StepComplete({
  bookingCode,
  serviceName,
  customerName,
}: {
  bookingCode: string
  serviceName: string
  customerName: string
}) {
  return (
    <div className="text-center py-8 space-y-6">
      {/* Success Icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-10 w-10 text-success" />
      </div>

      <div className="space-y-2">
        <h2 className="text-headline-md font-headline-md text-on-surface">
          Thank you{bookingCode ? "" : "!"}
        </h2>
        <p className="text-base text-on-surface-variant">
          Your booking{bookingCode ? ` ${bookingCode}` : ""} has been submitted.
        </p>
      </div>

      {/* Booking Code */}
      {bookingCode && (
        <div className={cn(cardClasses, "inline-block px-6 py-4")}>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
            Booking Code
          </p>
          <p className="text-body-xl font-body-xl font-mono font-bold text-travel-blue">
            {bookingCode}
          </p>
        </div>
      )}

      <p className="text-body-md font-body-md text-on-surface-variant">
        We&apos;ve sent the confirmation to your email.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 max-w-sm mx-auto">
        <Link
          href="/my-bookings"
          className="flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-sm font-bold hover:bg-secondary-fixed-dim transition-colors"
        >
          View My Booking
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Compact Booking Summary */}
      <div className={cn(cardClasses, "p-5 text-left max-w-sm mx-auto space-y-3")}>
        <h3 className="text-label-md font-label-md text-on-surface">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Reference</span>
            <span className="font-mono font-medium text-on-surface">{bookingCode || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Service</span>
            <span className="text-on-surface">{serviceName || "Airport Transfer"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Customer</span>
            <span className="text-on-surface">{customerName || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Status</span>
            <span className="inline-flex items-center gap-1 text-warning font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              Awaiting Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Progress Indicator ──────────────────────────────────────────────────────

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const progressPercent = (currentStep / (STEPS.length - 1)) * 100

  return (
    <nav aria-label="Booking progress" className="mb-10 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Background bar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container-high -z-10 rounded-full" />
        {/* Progress fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-travel-blue -z-10 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step.label} className="flex flex-col items-center gap-2 relative z-10">
              {/* Step circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                  isCompleted && "bg-travel-blue text-on-primary border-travel-blue",
                  isCurrent && "bg-surface-container-lowest text-travel-blue border-travel-blue shadow-ambient",
                  !isCompleted && !isCurrent && "bg-surface-container-lowest text-outline border-outline-variant"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-label-md font-label-md">{index + 1}</span>
                )}
              </div>
              {/* Step label */}
              <span
                className={cn(
                  "text-label-sm font-label-sm whitespace-nowrap",
                  isCompleted && "text-on-surface",
                  isCurrent && "text-primary font-bold",
                  !isCompleted && !isCurrent && "text-outline"
                )}
              >
                {step.short}
              </span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}

// ─── Main Booking Page ───────────────────────────────────────────────────────

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Service id comes from the URL: /booking/[id] (a Prisma service id like
  // "cmtblxlas000tu9rwbu8plc91"). Legacy links used plain numbers (e.g. /booking/20)
  // which don't exist in the DB — fall back to the first sedan service in that case.
  const paramsResolved = use(params)
  const rawId = paramsResolved?.id || ""

  // Resolve a valid service id; if the URL id isn't a Prisma cuid, default to the
  // standard airport-transfer sedan so quote/booking creation doesn't fail.
  const SERVICE_ID = /^[a-z0-9]{20,}$/.test(rawId)
    ? rawId
    : "cmtblxlas000tu9rwbu8plc91"

  const [currentStep, setCurrentStep] = useState(0)

  // Created booking result (persisted to DB)
  const [bookingResult, setBookingResult] = useState<{
    bookingId: string
    bookingCode: string
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [tripData, setTripData] = useState<TripData>({
    tripType: "one-way",
    from: "Phu Quoc Airport (PQC)",
    to: "",
    date: "",
    time: "",
    flightNumber: "",
    passengers: 1,
    luggage: 0,
  })

  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    email: "",
    phone: "",
    hotel: "",
    specialRequest: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("pay-now")
  const [showBankTransfer, setShowBankTransfer] = useState(false)

  // Auto-advance from payment processing (step 3) to complete (step 4)
  useEffect(() => {
    if (currentStep === 3 && !showBankTransfer) {
      const timer = setTimeout(() => {
        setCurrentStep(4)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, showBankTransfer])

  const handleTripNext = useCallback((data: TripData) => {
    setTripData(data)
    setCurrentStep(1)
  }, [])

  const handleCustomerNext = useCallback((data: CustomerData) => {
    setCustomerData(data)
    setCurrentStep(2)
  }, [])

  // Create the real quote + booking in the backend (persists to MySQL).
  const submitBooking = useCallback(async (): Promise<boolean> => {
    if (submitting) return false
    setSubmitting(true)
    setSubmitError("")
    try {
      // 1) Create a quote so the server recalculates price & reserves capacity
      const quoteRes = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: SERVICE_ID,
          tripType: tripData.tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY",
          date: tripData.date,
          time: tripData.time,
          flightNumber: tripData.flightNumber || undefined,
          passengers: tripData.passengers,
          luggage: tripData.luggage,
        }),
      })
      const quoteData = await quoteRes.json()
      if (!quoteRes.ok || !quoteData.data?.quoteId) {
        throw new Error(quoteData.error?.message || "Could not create quote")
      }
      const quoteId = quoteData.data.quoteId

      // 2) Create the booking with the customer's details (guest user by email)
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          customer: {
            fullName: customerData.fullName,
            email: customerData.email,
            phone: customerData.phone,
            hotel: customerData.hotel || undefined,
            specialRequest: customerData.specialRequest || undefined,
          },
        }),
      })
      const bookingData = await bookingRes.json()
      if (!bookingRes.ok || !bookingData.data?.bookingCode) {
        const details = bookingData.error?.details
        const detailStr = details ? " " + JSON.stringify(details) : ""
        throw new Error((bookingData.error?.message || "Could not create booking") + detailStr)
      }
      setBookingResult({
        bookingId: bookingData.data.id,
        bookingCode: bookingData.data.bookingCode,
      })
      return true
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Booking failed. Please try again.")
      return false
    } finally {
      setSubmitting(false)
    }
  }, [submitting, SERVICE_ID, tripData, customerData])

  const handlePayNow = useCallback(async () => {
    // Persist the booking regardless of payment method (status = WAITING_PAYMENT),
    // then advance to the payment step only after it succeeds.
    const ok = await submitBooking()
    if (ok) {
      setShowBankTransfer(paymentMethod === "bank-transfer")
      setCurrentStep(3)
    }
  }, [submitBooking, paymentMethod])

  // Calculate total for bank transfer (server price from quote is authoritative,
  // but we keep parity with the booking-engine formula for the transfer screen)
  const calculateTotal = useCallback(() => {
    const basePrice = 350000
    const subtotal = basePrice * tripData.passengers
    const discount = tripData.tripType === "round-trip" ? Math.round(subtotal * 0.1) : 0
    const serviceFee = 25000
    return subtotal - discount + serviceFee
  }, [tripData])

  return (
    <div className="min-h-screen bg-background">
      <div className="container-marivo py-8">
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator currentStep={currentStep} />

          {/* Step 0: Trip Information */}
          {currentStep === 0 && (
            <div className={cn(cardClasses, "p-6")}>
              <StepTripInformation data={tripData} onNext={handleTripNext} />
            </div>
          )}

          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
              <div className={cn(cardClasses, "p-6")}>
                <StepCustomerInformation
                  data={customerData}
                  tripData={tripData}
                  onNext={handleCustomerNext}
                  onBack={() => setCurrentStep(0)}
                />
              </div>
              {/* Desktop sidebar */}
              <aside className="hidden lg:block">
                <div className={cn(cardClasses, "p-5 sticky top-24")}>
                  <h3 className="text-label-md font-label-md text-on-surface mb-4">
                    Booking Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
                      <span className="truncate">{tripData.from}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
                      <span className="truncate">{tripData.to || "Not set"}</span>
                    </div>
                    <div className="border-t border-outline-variant pt-3 mt-3 space-y-2">
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Clock className="h-4 w-4 text-ink-outline shrink-0" />
                        <span>{tripData.date || "Not set"} &middot; {tripData.time || "Not set"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Users className="h-4 w-4 text-ink-outline shrink-0" />
                        <span>{tripData.passengers} passenger{tripData.passengers !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Luggage className="h-4 w-4 text-ink-outline shrink-0" />
                        <span>{tripData.luggage} luggage item{tripData.luggage !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {currentStep === 2 && (
            <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
              <div>
                <StepConfirmation
                  tripData={tripData}
                  customerData={customerData}
                  paymentMethod={paymentMethod}
                  onSetPayment={setPaymentMethod}
                  onPayNow={handlePayNow}
                  onBack={() => setCurrentStep(1)}
                  submitting={submitting}
                  submitError={submitError}
                />
              </div>
              {/* Desktop sidebar */}
              <aside className="hidden lg:block">
                <div className={cn(cardClasses, "p-5 sticky top-24")}>
                  <h3 className="text-label-md font-label-md text-on-surface mb-4">
                    Booking Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
                      <span className="truncate">{tripData.from}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-travel-blue shrink-0" />
                      <span className="truncate">{tripData.to}</span>
                    </div>
                    <div className="border-t border-outline-variant pt-3 mt-3 space-y-2">
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Clock className="h-4 w-4 text-ink-outline shrink-0" />
                        <span>{tripData.date} &middot; {tripData.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Users className="h-4 w-4 text-ink-outline shrink-0" />
                        <span>{tripData.passengers} passenger{tripData.passengers !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Luggage className="h-4 w-4 text-ink-outline shrink-0" />
                        <span>{tripData.luggage} luggage item{tripData.luggage !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="border-t border-outline-variant pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Total</span>
                        <span className="text-lg font-bold text-on-surface">
                          {(350000 * tripData.passengers - (tripData.tripType === "round-trip" ? Math.round(350000 * tripData.passengers * 0.1) : 0) + 25000).toLocaleString("vi-VN")} &#x20AB;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Step 3: Payment Processing */}
          {currentStep === 3 && showBankTransfer && paymentMethod === "bank-transfer" ? (
            <div className={cn(cardClasses, "p-6")}>
              <StepBankTransfer
                total={calculateTotal()}
                bookingCode={bookingResult?.bookingCode || "MRV250620-0001"}
                onConfirm={() => {
                  setShowBankTransfer(false)
                  setCurrentStep(4)
                }}
                onBack={() => {
                  setShowBankTransfer(false)
                  setCurrentStep(2)
                }}
              />
            </div>
          ) : currentStep === 3 ? (
            <div className={cn(cardClasses, "p-6")}>
              <StepPayment bookingCode={bookingResult?.bookingCode || "MRV250620-0001"} />
            </div>
          ) : null}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className={cn(cardClasses, "p-6")}>
              <StepComplete
                bookingCode={bookingResult?.bookingCode || ""}
                serviceName="Airport Transfer"
                customerName={customerData.fullName}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
