import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../prisma", () => ({
  prisma: {
    service: { findUnique: vi.fn() },
  },
}))

import { calculatePrice } from "../price-engine"
import { prisma } from "../prisma"

describe("Price Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("calculatePrice", () => {
    it("should calculate base price from service", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        basePrice: 500000,
        currency: "VND",
        isActive: true,
        prices: [],
        vehicles: [],
        category: {},
      } as any)

      const result = await calculatePrice({
        serviceId: "svc-1",
        tripType: "ONE_WAY",
        date: "2025-03-15",
        passengers: 2,
        luggage: 1,
      })

      expect(result.subtotal).toBe(500000)
      expect(result.discount).toBe(0)
      expect(result.serviceFee).toBe(25000) // 5%
      expect(result.total).toBe(525000)
      expect(result.currency).toBe("VND")
    })

    it("should use vehicle price override", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        basePrice: 500000,
        currency: "VND",
        isActive: true,
        prices: [],
        vehicles: [{ pricePerTrip: 700000, currency: "VND", name: "SUV" }],
        category: {},
      } as any)

      const result = await calculatePrice({
        serviceId: "svc-1",
        vehicleId: "veh-1",
        tripType: "ONE_WAY",
        date: "2025-03-15",
        passengers: 2,
        luggage: 1,
      })

      expect(result.subtotal).toBe(700000) // vehicle price overrides base
    })

    it("should apply round trip discount (10% off return)", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        basePrice: 500000,
        currency: "VND",
        isActive: true,
        prices: [],
        vehicles: [],
        category: {},
      } as any)

      const result = await calculatePrice({
        serviceId: "svc-1",
        tripType: "ROUND_TRIP",
        date: "2025-03-15",
        passengers: 2,
        luggage: 1,
      })

      // ROUND_TRIP = basePrice + basePrice * 0.9 = 500000 + 450000 = 950000
      expect(result.subtotal).toBe(950000)
      expect(result.serviceFee).toBe(47500) // 5% of 950000
      expect(result.total).toBe(997500)
    })

    it("should throw for non-existent service", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue(null)

      await expect(
        calculatePrice({
          serviceId: "nonexistent",
          tripType: "ONE_WAY",
          date: "2025-03-15",
          passengers: 2,
          luggage: 1,
        })
      ).rejects.toThrow("Service not found")
    })

    it("should throw for inactive service", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        isActive: false,
        prices: [],
        vehicles: [],
        category: {},
      } as any)

      await expect(
        calculatePrice({
          serviceId: "svc-1",
          tripType: "ONE_WAY",
          date: "2025-03-15",
          passengers: 2,
          luggage: 1,
        })
      ).rejects.toThrow("Service is no longer available")
    })

    it("should use date-specific pricing when applicable", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        basePrice: 500000,
        currency: "VND",
        isActive: true,
        prices: [
          {
            priceType: "DATE_RANGE",
            basePrice: 600000,
            currency: "VND",
            validFrom: new Date("2025-03-01"),
            validUntil: new Date("2025-03-31"),
            minQuantity: 1,
            maxQuantity: null,
            isActive: true,
          },
        ],
        vehicles: [],
        category: {},
      } as any)

      const result = await calculatePrice({
        serviceId: "svc-1",
        tripType: "ONE_WAY",
        date: "2025-03-15",
        passengers: 2,
        luggage: 1,
      })

      expect(result.subtotal).toBe(600000) // date-specific price
    })

    it("should use group pricing when applicable", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        basePrice: 500000,
        currency: "VND",
        isActive: true,
        prices: [
          {
            priceType: "GROUP",
            basePrice: 400000,
            currency: "VND",
            minQuantity: 5,
            maxQuantity: 10,
            validFrom: null,
            validUntil: null,
            isActive: true,
          },
        ],
        vehicles: [],
        category: {},
      } as any)

      const result = await calculatePrice({
        serviceId: "svc-1",
        tripType: "ONE_WAY",
        date: "2025-03-15",
        passengers: 2,
        luggage: 1,
        quantity: 6,
      })

      expect(result.subtotal).toBe(400000) // group price
    })
  })
})
