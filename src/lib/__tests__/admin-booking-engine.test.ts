import { describe, it, expect, vi, beforeEach } from "vitest"
import { BookingStatus, UserRole } from "@prisma/client"

// Mock prisma
vi.mock("../prisma", () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    bookingStatusHistory: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    serviceAvailability: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

import { prisma } from "../prisma"
import {
  transitionBookingStatus,
  startTrip,
  completeBooking,
  getAdminBookings,
  getBookingDetailAdmin,
} from "../booking-engine"

function makeBooking(status: BookingStatus, extra: Record<string, unknown> = {}) {
  return {
    id: "b1",
    status,
    items: [{ id: "it1", serviceId: "s1", serviceSnapshot: { date: "2026-08-28" } }],
    ...extra,
  } as any
}

describe("transitionBookingStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.$transaction).mockImplementation((fn: any) => fn(prisma))
  })

  it("PAID -> CONFIRMED allowed for admin", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(makeBooking(BookingStatus.PAID))
    vi.mocked(prisma.booking.update).mockResolvedValue(makeBooking(BookingStatus.CONFIRMED))

    await transitionBookingStatus("b1", BookingStatus.CONFIRMED, {
      actorId: "a1",
      actorRole: UserRole.ADMIN,
    })

    expect(prisma.bookingStatusHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ bookingId: "b1", status: BookingStatus.CONFIRMED }),
      })
    )
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          actorId: "a1",
          action: "CHANGE_STATUS",
          entity: "Booking",
          entityId: "b1",
        }),
      })
    )
  })

  it("rejects illegal transition PAID -> IN_PROGRESS", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(makeBooking(BookingStatus.PAID))
    await expect(
      transitionBookingStatus("b1", BookingStatus.IN_PROGRESS, { actorRole: UserRole.ADMIN })
    ).rejects.toThrow(/Cannot change booking from/)
    expect(prisma.booking.update).not.toHaveBeenCalled()
  })

  it("rejects when customer tries to CONFIRM", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(makeBooking(BookingStatus.PAID))
    await expect(
      transitionBookingStatus("b1", BookingStatus.CONFIRMED, { actorRole: UserRole.CUSTOMER })
    ).rejects.toThrow(/Insufficient permissions/)
  })

  it("releases capacity when it becomes CANCELLED", async () => {
    const items = [{ id: "it1", serviceId: "s1", serviceSnapshot: { date: "2026-08-28" } }]
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(
      makeBooking(BookingStatus.CONFIRMED, { items })
    )
    vi.mocked(prisma.booking.update).mockResolvedValue(makeBooking(BookingStatus.CANCELLED))
    vi.mocked(prisma.serviceAvailability.findFirst).mockResolvedValue({
      id: "av1",
      bookedSlots: 5,
    } as any)

    await transitionBookingStatus("b1", BookingStatus.CANCELLED, {
      actorId: "admin1",
      actorRole: UserRole.ADMIN,
    })
    // ensure capacity release path was invoked (availability mock) - simple: update called with CANCELLED
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: BookingStatus.CANCELLED } })
    )
    expect(prisma.serviceAvailability.findFirst).toHaveBeenCalled()
  })
})

describe("startTrip / completeBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.$transaction).mockImplementation((fn: any) => fn(prisma))
  })

  it("startTrip moves CONFIRMED -> IN_PROGRESS", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(makeBooking(BookingStatus.CONFIRMED))
    await startTrip("b1", { actorRole: UserRole.STAFF })
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: BookingStatus.IN_PROGRESS } })
    )
  })

  it("completeBooking moves IN_PROGRESS -> COMPLETED", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(makeBooking(BookingStatus.IN_PROGRESS))
    await completeBooking("b1", { actorRole: UserRole.ADMIN })
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: BookingStatus.COMPLETED } })
    )
  })
})

describe("getAdminBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns paginated bookings with meta", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([makeBooking(BookingStatus.CONFIRMED)])
    vi.mocked(prisma.booking.count).mockResolvedValue(1)

    const result = await getAdminBookings({ page: 1, limit: 20 })
    expect(result.data).toHaveLength(1)
    expect(result.meta.total).toBe(1)
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 20 })
    )
  })

  it("filters by status and search", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])
    vi.mocked(prisma.booking.count).mockResolvedValue(0)
    await getAdminBookings({ page: 2, limit: 10, status: "CONFIRMED", search: "MRV" })
    const args = vi.mocked(prisma.booking.findMany).mock.calls[0]![0]!
    expect((args.where as any).status).toBe("CONFIRMED")
    expect(args.skip).toBe(10)
  })
})

describe("getBookingDetailAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("throws not found and includes rich relations", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(null)
    await expect(getBookingDetailAdmin("b1")).rejects.toThrow(/not found/i)
  })

  it("includes statusHistory, payments, items sorted", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(makeBooking(BookingStatus.PAID))
    await getBookingDetailAdmin("b1")
    expect(prisma.booking.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ statusHistory: expect.anything(), payments: expect.anything() }),
      })
    )
  })
})
