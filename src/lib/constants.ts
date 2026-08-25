// MARIVO.vn Constants

export const APP_NAME = "MARIVO"
export const APP_DESCRIPTION = "Phu Quoc Travel Services Booking Platform"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Business
export const BUSINESS_TIMEZONE = "Asia/Ho_Chi_Minh"
export const DEFAULT_CURRENCY = "VND"
export const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+84-xxx-xxx-xxx"

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Booking
export const BOOKING_CODE_PREFIX = "MRV"
export const QUOTE_EXPIRY_MINUTES = 30
export const MAX_PASSENGERS = 50
export const MAX_LUGGAGE = 50

// Service Fee (percentage)
export const SERVICE_FEE_PERCENTAGE = 5

// Rate Limits
export const RATE_LIMIT = {
  LOGIN: { windowMs: 15 * 60 * 1000, max: 5 },
  REGISTER: { windowMs: 60 * 60 * 1000, max: 3 },
  QUOTE: { windowMs: 60 * 1000, max: 30 },
  BOOKING: { windowMs: 60 * 1000, max: 10 },
  CONTACT: { windowMs: 60 * 1000, max: 5 },
  REVIEW: { windowMs: 60 * 1000, max: 3 },
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, max: 3 },
} as const

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
export const MAX_IMAGE_DIMENSION = 2048

// Cache
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const
