import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("../prisma", () => ({
  prisma: {
    service: { findUnique: vi.fn() },
    location: { findUnique: vi.fn() },
    quote: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

// Mock price and availability engines
vi.mock("../price-engine", () => ({
  calculatePrice: vi.fn().mockResolvedValue({
    subtotal: 500000,
    discount: 0,
    serviceFee: 25000,
    total: 525000,
    currency: "VND",
    breakdown: [],
  }),
}))

vi.mock("../availability-engine", () => ({
  checkAvailability: vi.fn().mockResolvedValue({
    available: true,
    remainingCapacity: 10,
    maxCapacity: 20,
  }),
}))

import { createQuote, getQuote, validateQuote, markQuoteUsed } from "../quote-engine"
import { prisma } from "../prisma"

// Build a stored Quote row as Prisma would return it
function buildStoredQuote(overrides: Record<string, unknown> = {}) {
  return {
    id: "qt-1",
    quoteCode: "QT-ABC123",
    serviceId: "svc-1",
    vehicleId: null,
    tripType: "ONE_WAY",
    date: "2025-03-20",
    time: "10:00",
    flightNumber: null,
    passengers: 2,
    luggage: 1,
    pickupLocationId: null,
    dropoffLocationId: null,
    priceBreakdown: [],
    subtotal: 500000,
    discount: 0,
    serviceFee: 25000,
    total: 525000,
    currency: "VND",
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    isUsed: false,
    createdAt: new Date(),
    service: { id: "svc-1", name: "Airport Transfer" },
    vehicle: null,
    ...overrides,
  } as any
}

describe("Quote Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("createQuote", () => {
    it("should persist a quote to the database with an expiry in the future", async () => {
      const stored = buildStoredQuote()
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        name: "Airport Transfer",
        isActive: true,
        vehicles: [],
        category: {},
      } as any)
      vi.mocked(prisma.quote.create).mockResolvedValue(stored)

      const now = new Date("2025-03-15T10:00:00Z")
      vi.setSystemTime(now)

      const quote = await createQuote({
        serviceId: "svc-1",
        tripType: "ONE_WAY",
        date: "2025-03-20",
        time: "10:00",
        passengers: 2,
        luggage: 1,
      })

      expect(prisma.quote.create).toHaveBeenCalled()
      expect(quote.quoteId).toBe("qt-1")
      expect(quote.serviceId).toBe("svc-1")
      expect(quote.serviceName).toBe("Airport Transfer")
      expect(quote.total).toBe(525000)
      expect(new Date(quote.expiresAt).getTime()).toBeGreaterThan(now.getTime())
    })

    it("should throw for non-existent service", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue(null)

      await expect(
        createQuote({
          serviceId: "nonexistent",
          tripType: "ONE_WAY",
          date: "2025-03-20",
          time: "10:00",
          passengers: 2,
          luggage: 1,
        })
      ).rejects.toThrow("Service not found")
    })

    it("should throw for unavailable service", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        name: "Airport Transfer",
        isActive: false,
        vehicles: [],
        category: {},
      } as any)

      await expect(
        createQuote({
          serviceId: "svc-1",
          tripType: "ONE_WAY",
          date: "2025-03-20",
          time: "10:00",
          passengers: 2,
          luggage: 1,
        })
      ).rejects.toThrow("Service is no longer available")
    })
  })

  describe("getQuote", () => {
    it("should return quote from the database if not expired", async () => {
      vi.mocked(prisma.quote.findUnique).mockResolvedValue(buildStoredQuote())

      const retrieved = await getQuote("qt-1")
      expect(retrieved).toBeDefined()
      expect(retrieved?.quoteId).toBe("qt-1")
      expect(retrieved?.serviceName).toBe("Airport Transfer")
    })

    it("should return null for an expired quote", async () => {
      vi.mocked(prisma.quote.findUnique).mockResolvedValue(
        buildStoredQuote({
          expiresAt: new Date(Date.now() - 60 * 1000),
        })
      )

      const retrieved = await getQuote("qt-1")
      expect(retrieved).toBeNull()
    })

    it("should return null for a non-existent quote", async () => {
      vi.mocked(prisma.quote.findUnique).mockResolvedValue(null)
      expect(await getQuote("nonexistent")).toBeNull()
    })
  })

  describe("validateQuote", () => {
    it("should return a valid quote", async () => {
      vi.mocked(prisma.quote.findUnique).mockResolvedValue(buildStoredQuote())
      const validated = await validateQuote("qt-1")
      expect(validated.quoteId).toBe("qt-1")
    })

    it("should throw for an expired quote", async () => {
      vi.mocked(prisma.quote.findUnique).mockResolvedValue(
        buildStoredQuote({
          expiresAt: new Date(Date.now() - 60 * 1000),
        })
      )
      await expect(validateQuote("qt-1")).rejects.toThrow("Quote has expired")
    })
  })

  describe("markQuoteUsed", () => {
    it("should mark the quote as used", async () => {
      vi.mocked(prisma.quote.update).mockResolvedValue(buildStoredQuote())
      await markQuoteUsed("qt-1")
      expect(prisma.quote.update).toHaveBeenCalledWith({
        where: { id: "qt-1" },
        data: { isUsed: true },
      })
    })
  })
})
