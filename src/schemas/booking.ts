import { z } from "zod"

export const quoteSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  vehicleId: z.string().optional(),
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP"], { required_error: "Trip type is required" }),
  pickupId: z.string().optional(),
  dropoffId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  flightNumber: z.string().optional(),
  passengers: z.number().int().positive("Passengers must be at least 1"),
  luggage: z.number().int().min(0, "Luggage cannot be negative"),
})

export const bookingCustomerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone must be at least 8 characters").regex(/^[+]?[0-9s()-]+$/, "Invalid phone number"),
  hotel: z.string().optional(),
  specialRequest: z.string().max(500, "Special request must be under 500 characters").optional(),
})

export const bookingCreateSchema = z.object({
  quoteId: z.string().min(1, "Quote is required"),
  customer: bookingCustomerSchema,
  notes: z.string().max(500).optional(),
})

export const paymentInitSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  provider: z.string().min(1, "Payment provider is required"),
  paymentMethod: z.string().optional(),
})

export const reviewSchema = z.object({
  serviceId: z.string().min(1),
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export type QuoteInput = z.infer<typeof quoteSchema>
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>
export type BookingCustomerInput = z.infer<typeof bookingCustomerSchema>
export type PaymentInitInput = z.infer<typeof paymentInitSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ContactInput = z.infer<typeof contactSchema>
