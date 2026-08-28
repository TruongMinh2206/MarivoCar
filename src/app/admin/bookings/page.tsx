"use client"

import { useState } from "react"
import { Search, Filter, Download, Edit, Trash2, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"

const mockBookings = [
  {
    id: "BK-2024-001",
    customer: "Nguyen Van Minh",
    service: "Airport Transfer",
    date: "2024-03-15",
    amount: "1,200,000",
    status: "Confirmed",
  },
  {
    id: "BK-2024-002",
    customer: "Tran Thi Lan",
    service: "Private Car",
    date: "2024-03-16",
    amount: "850,000",
    status: "Confirmed",
  },
  {
    id: "BK-2024-003",
    customer: "Le Hoang Nam",
    service: "Tours",
    date: "2024-03-17",
    amount: "2,500,000",
    status: "Pending",
  },
  {
    id: "BK-2024-004",
    customer: "Pham Thanh Hoa",
    service: "Hotels",
    date: "2024-03-18",
    amount: "3,200,000",
    status: "Confirmed",
  },
  {
    id: "BK-2024-005",
    customer: "Vo Ngoc Anh",
    service: "Airport Transfer",
    date: "2024-03-19",
    amount: "1,200,000",
    status: "Cancelled",
  },
  {
    id: "BK-2024-006",
    customer: "Hoang Minh Duc",
    service: "Restaurants",
    date: "2024-03-20",
    amount: "650,000",
    status: "Confirmed",
  },
  {
    id: "BK-2024-007",
    customer: "Bui Thi Mai",
    service: "Spa",
    date: "2024-03-21",
    amount: "450,000",
    status: "Pending",
  },
  {
    id: "BK-2024-008",
    customer: "Do Quoc Bao",
    service: "Tours",
    date: "2024-03-22",
    amount: "2,800,000",
    status: "Cancelled",
  },
]

const statusStyles: Record<string, string> = {
  Confirmed: "bg-success/10 text-success",
  Pending: "bg-secondary-fixed text-on-secondary-fixed-variant",
  Cancelled: "bg-error/10 text-error",
}

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-surface-alt p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary">Bookings</h1>
        <button className="inline-flex items-center gap-2 rounded-btn bg-secondary-container px-4 py-2 text-label-md text-on-secondary-fixed-variant transition-colors hover:bg-secondary-container/80">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-ambient">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-btn border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-btn border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-8 text-body-md text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-btn border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
            <span className="text-outline">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-btn border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Booking ID
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-label-sm font-semibold text-on-surface-variant">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-label-sm font-semibold text-on-surface-variant">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-label-sm font-semibold text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-outline-variant last:border-b-0 hover:bg-surface-alt/50"
                >
                  <td className="px-4 py-4 text-body-md font-medium text-travel-blue">
                    {booking.id}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface">
                    {booking.customer}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {booking.service}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {booking.date}
                  </td>
                  <td className="px-4 py-4 text-right text-body-md font-medium text-on-surface">
                    {booking.amount} VNĐ
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-label-sm font-label-sm ${statusStyles[booking.status] || ""}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button className="rounded p-1 text-outline transition-colors hover:bg-surface-alt hover:text-on-surface">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-outline transition-colors hover:bg-error/10 hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-outline transition-colors hover:bg-surface-alt hover:text-on-surface">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-body-md text-on-surface-variant">
            Showing {filteredBookings.length} of {mockBookings.length} bookings
          </p>
          <div className="flex items-center gap-1">
            <button className="inline-flex items-center gap-1 rounded-btn px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-btn bg-primary text-on-primary">
              1
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-on-surface-variant transition-colors hover:bg-surface-alt">
              2
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-on-surface-variant transition-colors hover:bg-surface-alt">
              3
            </button>
            <button className="inline-flex items-center gap-1 rounded-btn px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-alt">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
