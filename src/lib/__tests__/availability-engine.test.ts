import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../prisma", () => ({
  prisma: {
    service: { findUnique: vi.fn() },
    serviceAvailability: { findFirst: vi.fn(), update: vi.fn() },
  },
}))

import { checkAvailability, reserveCapacity, releaseCapacity } from "../availability-engine"
import { prisma } from "../prisma"

describe("Availability Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("checkAvailability", () => {
    it("should return available when no availability records exist (no constraints)", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        isActive: true,
        availability: [],
      } as any)

      const result = await checkAvailability({
        serviceId: "svc-1",
        date: "2025-03-15",
        passengers: 4,
      })

      expect(result.available).toBe(true)
      expect(result.remainingCapacity).toBe(999)
    })

    it("should check day-of-week availability when no date-specific record", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        isActive: true,
        availability: [],
      } as any)
      // Saturday = 6
      vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue({
        id: "avail-1",
        maxCapacity: 20,
        bookedCount: 5,
        isActive: true,
      } as any)

      const result = await checkAvailability({
        serviceId: "svc-1",
        date: "2025-03-15", // Saturday
        passengers: 4,
      })

      expect(result.available).toBe(true)
      expect(result.remainingCapacity).toBe(15)
    })

    it("should return unavailable when day-of-week capacity insufficient", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        isActive: true,
        availability: [],
      } as any)
      vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue({
        id: "avail-1",
        maxCapacity: 20,
        bookedCount: 18,
        isActive: true,
      } as any)

      const result = await checkAvailability({
        serviceId: "svc-1",
        date: "2025-03-15",
        passengers: 4,
      })

      expect(result.available).toBe(false)
      expect(result.remainingCapacity).toBe(2)
      expect(result.message).toContain("2 spots remaining")
    })

    it("should check date-specific availability from service include", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        isActive: true,
        availability: [
          { maxCapacity: 20, bookedCount: 5, isActive: true },
        ],
      } as any)

      const result = await checkAvailability({
        serviceId: "svc-1",
        date: "2025-03-15",
        passengers: 4,
      })

      expect(result.available).toBe(true)
      expect(result.remainingCapacity).toBe(15)
    })

    it("should return unavailable when date-specific fully booked", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        isActive: true,
        availability: [
          { maxCapacity: 20, bookedCount: 20, isActive: true },
        ],
      } as any)

      const result = await checkAvailability({
        serviceId: "svc-1",
        date: "2025-03-15",
        passengers: 1,
      })

      expect(result.available).toBe(false)
      expect(result.remainingCapacity).toBe(0)
      expect(result.message).toContain("fully booked")
    })

    it("should throw for non-existent service", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue(null)

      await expect(
        checkAvailability({
          serviceId: "nonexistent",
          date: "2025-03-15",
          passengers: 2,
        })
      ).rejects.toThrow("Service not found")
    })

    it("should return unavailable for inactive service", async () => {
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        id: "svc-1",
        isActive: false,
        availability: [],
      } as any)

      const result = await checkAvailability({
        serviceId: "svc-1",
        date: "2025-03-15",
        passengers: 2,
      })

      expect(result.available).toBe(false)
      expect(result.message).toContain("unavailable")
    })
  })

  describe("reserveCapacity", () => {
    it("should reserve capacity when available", async () => {
      vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue({
        id: "avail-1",
        maxCapacity: 20,
        bookedCount: 5,
        isActive: true,
      } as any)
      vi.mocked(prisma.serviceAvailability.update).mockResolvedValue({} as any)

      await reserveCapacity("svc-1", "2025-03-15", 4)

      expect(prisma.serviceAvailability.update).toHaveBeenCalledWith({
        where: { id: "avail-1" },
        data: { bookedCount: { increment: 4 } },
      })
    })

    it("should throw when capacity insufficient", async () => {
      vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue({
        id: "avail-1",
        maxCapacity: 20,
        bookedCount: 18,
        isActive: true,
      } as any)

      await expect(reserveCapacity("svc-1", "2025-03-15", 4)).rejects.toThrow(
        "Not enough capacity"
      )
    })

    it("should skip if no availability record (no tracking)", async () => {
      vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue(null)

      await expect(
        reserveCapacity("svc-1", "2025-03-15", 4)
      ).resolves.toBeUndefined()
      expect(prisma.serviceAvailability.update).not.toHaveBeenCalled()
    })
  })

  describe("releaseCapacity", () => {
    it("should release reserved capacity", async () => {
      vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue({
        id: "avail-1",
        bookedCount: 9,
      } as any)
      vi.mocked(prisma.serviceAvailability.update).mockResolvedValue({} as any)

      await releaseCapacity("svc-1", "2025-03-15", 4)

      expect(prisma.serviceAvailability.update).toHaveBeenCalledWith({
        where: { id: "avail-1" },
        data: { bookedCount: { decrement: 4 } },
      })
    })

    it("should skip if no availability record", async () => {
      vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue(null)

      await expect(
        releaseCapacity("svc-1", "2025-03-15", 4)
      ).resolves.toBeUndefined()
    })
  })
})
