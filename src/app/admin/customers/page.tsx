"use client"

import { useState } from "react"
import { Search, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react"

const mockCustomers = [
  {
    id: "C-001",
    name: "Nguyen Van Minh",
    email: "minh.nguyen@email.com",
    phone: "0901 234 567",
    bookingsCount: 12,
    totalSpent: "15,800,000",
    joinedDate: "2023-06-15",
  },
  {
    id: "C-002",
    name: "Tran Thi Lan",
    email: "lan.tran@email.com",
    phone: "0912 345 678",
    bookingsCount: 8,
    totalSpent: "9,450,000",
    joinedDate: "2023-08-22",
  },
  {
    id: "C-003",
    name: "Le Hoang Nam",
    email: "nam.le@email.com",
    phone: "0923 456 789",
    bookingsCount: 5,
    totalSpent: "6,200,000",
    joinedDate: "2023-11-10",
  },
  {
    id: "C-004",
    name: "Pham Thi Mai",
    email: "mai.pham@email.com",
    phone: "0934 567 890",
    bookingsCount: 15,
    totalSpent: "21,350,000",
    joinedDate: "2023-04-05",
  },
  {
    id: "C-005",
    name: "Hoang Van Duc",
    email: "duc.hoang@email.com",
    phone: "0945 678 901",
    bookingsCount: 3,
    totalSpent: "3,100,000",
    joinedDate: "2024-01-18",
  },
  {
    id: "C-006",
    name: "Vo Thi Thanh",
    email: "thanh.vo@email.com",
    phone: "0956 789 012",
    bookingsCount: 10,
    totalSpent: "12,700,000",
    joinedDate: "2023-09-30",
  },
  {
    id: "C-007",
    name: "Dang Van Khoa",
    email: "khoa.dang@email.com",
    phone: "0967 890 123",
    bookingsCount: 7,
    totalSpent: "8,650,000",
    joinedDate: "2023-12-12",
  },
  {
    id: "C-008",
    name: "Bui Thi Nga",
    email: "nga.bui@email.com",
    phone: "0978 901 234",
    bookingsCount: 6,
    totalSpent: "5,400,000",
    joinedDate: "2024-02-25",
  },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = mockCustomers.filter((customer) => {
    const q = searchQuery.toLowerCase()
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.id.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-surface-alt p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary">Customers</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-btn border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Phone
                </th>
                <th className="px-4 py-3 text-center text-label-sm font-semibold text-on-surface-variant">
                  Bookings
                </th>
                <th className="px-4 py-3 text-right text-label-sm font-semibold text-on-surface-variant">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Joined
                </th>
                <th className="px-4 py-3 text-center text-label-sm font-semibold text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-outline-variant last:border-b-0 hover:bg-surface-alt/50"
                >
                  <td className="px-4 py-4 text-body-md font-medium text-travel-blue">
                    {customer.id}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface">
                    {customer.name}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {customer.email}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {customer.phone}
                  </td>
                  <td className="px-4 py-4 text-center text-body-md text-on-surface">
                    {customer.bookingsCount}
                  </td>
                  <td className="px-4 py-4 text-right text-body-md font-medium text-on-surface">
                    {customer.totalSpent} VNĐ
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {customer.joinedDate}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button className="rounded p-1 text-outline transition-colors hover:bg-surface-alt hover:text-on-surface">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-outline transition-colors hover:bg-surface-alt hover:text-on-surface">
                        <Edit className="h-4 w-4" />
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
            Showing {filteredCustomers.length} of {mockCustomers.length} customers
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
