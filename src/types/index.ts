// MARIVO.vn Global Types
export * from "./api"

// ============ Service Types ============
export type ServiceCategorySlug =
  | "hotels"
  | "airport-transfer"
  | "private-car"
  | "rent-a-car"
  | "taxi"
  | "tours"
  | "tickets"
  | "restaurants"
  | "spa"
  | "products"
  | "guide"

export interface ServiceListItem {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  basePrice: number
  currency: string
  rating: number
  reviewCount: number
  isFeatured: boolean
  category: {
    id: string
    name: string
    slug: string
    icon: string | null
  }
  images: Array<{
    url: string
    alt: string | null
    isPrimary: boolean
  }>
  location?: {
    name: string
    area: string | null
  } | null
  // Transport-specific
  vehicles?: Array<{
    id: string
    name: string
    seats: number
    luggage: number
    pricePerTrip: number
    vehicleType: {
      name: string
      slug: string
    }
  }>
  // Tour-specific
  tour?: {
    duration: string | null
    capacity: number | null
  } | null
  // Ticket-specific
  ticket?: {
    validFrom: string | null
    validUntil: string | null
  } | null
}

export interface ServiceDetail {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  description: string | null
  basePrice: number
  currency: string
  rating: number
  reviewCount: number
  isActive: boolean
  isFeatured: boolean
  metadata: Record<string, unknown> | null
  policies: Record<string, unknown> | null
  cancellationPolicy: Record<string, unknown> | null
  category: {
    id: string
    name: string
    slug: string
    icon: string | null
  }
  location: {
    id: string
    name: string
    slug: string
    type: string
    address: string | null
    latitude: number | null
    longitude: number | null
    area: string | null
  } | null
  images: Array<{
    id: string
    url: string
    alt: string | null
    isPrimary: boolean
    sortOrder: number
  }>
  prices: Array<{
    id: string
    name: string
    priceType: string
    basePrice: number
    currency: string
    minQuantity: number
    maxQuantity: number | null
    dayOfWeek: number | null
    validFrom: string | null
    validUntil: string | null
  }>
  vehicles?: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    seats: number
    luggage: number
    pricePerTrip: number
    pricePerHour: number | null
    currency: string
    vehicleType: {
      name: string
      slug: string
      icon: string | null
    }
    images: Array<{
      url: string
      alt: string | null
      isPrimary: boolean
    }>
  }>
  tour?: {
    duration: string | null
    meetingPoint: string | null
    schedule: Record<string, unknown> | null
    capacity: number | null
    included: Record<string, unknown> | null
    excluded: Record<string, unknown> | null
  } | null
  ticket?: {
    validFrom: string | null
    validUntil: string | null
    entryInfo: string | null
    availability: Record<string, unknown> | null
  } | null
  hotel?: {
    stars: number | null
    amenities: Record<string, unknown> | null
    checkIn: string | null
    checkOut: string | null
    rooms: Array<{
      id: string
      name: string
      description: string | null
      price: number
      currency: string
      capacity: number
      amenities: Record<string, unknown> | null
    }>
  } | null
  restaurant?: {
    openingHours: Record<string, unknown> | null
    menu: Record<string, unknown> | null
    contact: Record<string, unknown> | null
    reservation: boolean
  } | null
  spa?: {
    services: Record<string, unknown> | null
    schedule: Record<string, unknown> | null
  } | null
  reviews?: Array<{
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
      name: string | null
      image: string | null
    }
  }>
}

// ============ Location Types ============
export interface LocationOption {
  id: string
  name: string
  slug: string
  type: string
  area: string | null
}

// ============ Quote Types ============
export interface PriceBreakdownItem {
  name: string
  amount: number
  quantity?: number
}

export interface Quote {
  quoteId: string
  serviceId: string
  serviceName: string
  vehicleId?: string
  vehicleName?: string
  tripType: "ONE_WAY" | "ROUND_TRIP"
  date: string
  time: string
  passengers: number
  luggage: number
  pickup?: LocationOption
  dropoff?: LocationOption
  flightNumber?: string
  priceBreakdown: PriceBreakdownItem[]
  subtotal: number
  discount: number
  serviceFee: number
  total: number
  currency: string
  expiresAt: string
}

// ============ Booking Types ============
export type BookingStatus =
  | "DRAFT"
  | "PENDING"
  | "WAITING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "PAYMENT_FAILED"
  | "REFUND_REQUESTED"
  | "REFUNDED"

export interface BookingDetail {
  id: string
  bookingCode: string
  status: BookingStatus
  currency: string
  subtotal: number
  discount: number
  serviceFee: number
  total: number
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    serviceId: string
    serviceName: string
    quantity: number
    unitPrice: number
    total: number
    serviceSnapshot: Record<string, unknown>
    metadata: Record<string, unknown> | null
  }>
  customer: {
    fullName: string
    email: string
    phone: string
    hotel?: string
    specialRequest?: string
  }
  payments?: Array<{
    id: string
    provider: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }>
  voucher?: {
    id: string
    qrCode: string
  }
}

// ============ Payment Types ============
export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "REFUNDED"

// ============ Review Types ============
export interface Review {
  id: string
  rating: number
  comment: string | null
  images: Array<{ url: string; alt: string | null }>
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
  booking: {
    bookingCode: string
  }
}

// ============ Navigation ============
export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
}

// ============ Filter Types ============
export interface ServiceFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  seats?: number
  vehicleType?: string
  sort?: "popular" | "price_asc" | "price_desc" | "rating" | "newest"
  page?: number
  limit?: number
}
