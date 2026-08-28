"use client"

import { useState } from "react"
import {
  CreditCard,
  TrendingUp,
  Clock,
  AlertCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const summaryCards = [
  {
    label: "Total Revenue",
    value: "₫45,231,000",
    icon: DollarSign,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Pending",
    value: "₫2,340,000",
    icon: Clock,
    color: "text-on-secondary-fixed-variant",
    bg: "bg-secondary-container",
  },
  {
    label: "Refunded",
    value: "₫1,200,000",
    icon: TrendingUp,
    color: "text-travel-blue",
    bg: "bg-travel-blue/10",
  },
  {
    label: "Failed",
    value: "₫450,000",
    icon: AlertCircle,
    color: "text-error",
    bg: "bg-error/10",
  },
]

const mockPayments = [
  {
    paymentId: "PAY-001",
    bookingId: "BK-2024-001",
    customer: "Nguyen Van Minh",
    method: "Credit Card",
    amount: "1,200,000",
    status: "Completed",
    date: "2024-03-15",
  },
  {
    paymentId: "PAY-002",
    bookingId: "BK-2024-002",
    customer: "Tran Thi Lan",
    method: "Bank Transfer",
    amount: "850,000",
    status: "Completed",
    date: "2024-03-16",
  },
  {
    paymentId: "PAY-003",
    bookingId: "BK-2024-003",
    customer: "Le Hoang Nam",
    method: "Cash",
    amount: "2,500,000",
    status: "Pending",
    date: "2024-03-17",
  },
  {
    paymentId: "PAY-004",
    bookingId: "BK-2024-004",
    customer: "Pham Thi Mai",
    method: "Credit Card",
    amount: "3,200,000",
    status: "Completed",
    date: "2024-03-18",
  },
  {
    paymentId: "PAY-005",
    bookingId: "BK-2024-005",
    customer: "Hoang Van Duc",
    method: "Momo",
    amount: "1,200,000",
    status: "Refunded",
    date: "2024-03-19",
  },
  {
    paymentId: "PAY-006",
    bookingId: "BK-2024-006",
    customer: "Vo Thi Thanh",
    method: "Credit Card",
    amount: "650,000",
    status: "Failed",
    date: "2024-03-20",
  },
  {
    paymentId: "PAY-007",
    bookingId: "BK-2024-007",
    customer: "Dang Van Khoa",
    method: "Bank Transfer",
    amount: "450,000",
    status: "Completed",
    date: "2024-03-21",
  },
  {
    paymentId: "PAY-008",
    bookingId: "BK-2024-008",
    customer: "Bui Thi Nga",
    method: "Cash",
    amount: "2,800,000",
    status: "Pending",
    date: "2024-03-22",
  },
]

const statusStyles: Record<string, string> = {
  Completed: "bg-success/10 text-success",
  Pending: "bg-secondary-container text-on-secondary-fixed-variant",
  Refunded: "bg-travel-blue/10 text-travel-blue",
  Failed: "bg-error/10 text-error",
}

export default function PaymentsPage() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filteredPayments = mockPayments.filter((payment) => {
    if (!dateFrom && !dateTo) return true
    const d = payment.date
    if (dateFrom && d < dateFrom) return false
    if (dateTo && d > dateTo) return false
    return true
  })

  return (
    <div className="min-h-screen bg-surface-alt p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary">Payments</h1>
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

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-headline-sm font-headline-sm font-bold text-primary">
                  {card.value}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {card.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Payment ID
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Booking ID
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Method
                </th>
                <th className="px-4 py-3 text-right text-label-sm font-semibold text-on-surface-variant">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-label-sm font-semibold text-on-surface-variant">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.paymentId}
                  className="border-b border-outline-variant last:border-b-0 hover:bg-surface-alt/50"
                >
                  <td className="px-4 py-4 text-body-md font-medium text-travel-blue">
                    {payment.paymentId}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface">
                    {payment.bookingId}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface">
                    {payment.customer}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {payment.method}
                  </td>
                  <td className="px-4 py-4 text-right text-body-md font-medium text-on-surface">
                    {payment.amount} VNĐ
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-label-sm font-label-sm ${statusStyles[payment.status] || ""}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {payment.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-body-md text-on-surface-variant">
            Showing {filteredPayments.length} of {mockPayments.length} payments
          </p>
          <div className="flex items-center gap-1">
            <button
              className="inline-flex items-center gap-1 rounded-btn px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
              disabled
            >
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
