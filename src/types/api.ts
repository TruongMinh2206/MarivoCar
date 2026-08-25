export interface ApiResponse<T> { data: T; meta?: PaginationMeta }
export interface ApiError { error: { code: string; message: string; requestId?: string } }
export interface PaginationMeta { total: number; page: number; limit: number; totalPages: number }
export interface ServiceQuery { category?: string; search?: string; minPrice?: number; maxPrice?: number; rating?: number; sort?: string; page?: number; limit?: number }
export interface QuoteRequest { serviceId: string; vehicleId?: string; tripType: string; pickupId?: string; dropoffId?: string; date: string; time: string; flightNumber?: string; passengers: number; luggage: number }
export interface BookingRequest { quoteId: string; customer: { fullName: string; email: string; phone: string; hotel?: string; specialRequest?: string }; notes?: string }
export interface PaymentRequest { bookingId: string; provider: string; paymentMethod?: string }
export interface BookingDetail { id: string; bookingCode: string; status: string; currency: string; subtotal: number; discount: number; serviceFee: number; total: number; createdAt: string; items: any[]; customer?: any; payments?: any[]; voucher?: any }
