import {
  CalendarCheck,
  DollarSign,
  Package,
  Users,
} from "lucide-react"

const STATS = [
  {
    label: "Total Bookings",
    value: "1,234",
    icon: CalendarCheck,
    change: "+12.5%",
    changeType: "positive" as const,
  },
  {
    label: "Revenue",
    value: "₫45,231,000",
    icon: DollarSign,
    change: "+8.2%",
    changeType: "positive" as const,
  },
  {
    label: "Active Services",
    value: "48",
    icon: Package,
    change: "+3",
    changeType: "positive" as const,
  },
  {
    label: "Customers",
    value: "892",
    icon: Users,
    change: "+24.1%",
    changeType: "positive" as const,
  },
]

const RECENT_BOOKINGS = [
  {
    id: "BK-2024-0891",
    customer: "Nguyen Van Minh",
    service: "Airport Transfer",
    amount: "1,200,000",
    status: "CONFIRMED",
    date: "2024-08-25",
  },
  {
    id: "BK-2024-0890",
    customer: "Sarah Johnson",
    service: "Island Hopping Tour",
    amount: "3,500,000",
    status: "PAID",
    date: "2024-08-24",
  },
  {
    id: "BK-2024-0889",
    customer: "Tran Thi Lan",
    service: "Hotel Booking",
    amount: "2,800,000",
    status: "PENDING",
    date: "2024-08-24",
  },
  {
    id: "BK-2024-0888",
    customer: "David Kim",
    service: "Snorkeling Tour",
    amount: "1,800,000",
    status: "COMPLETED",
    date: "2024-08-23",
  },
  {
    id: "BK-2024-0887",
    customer: "Le Hoang Nam",
    service: "VinWonders Ticket",
    amount: "950,000",
    status: "CANCELLED",
    date: "2024-08-22",
  },
]

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-success/10 text-success",
  PAID: "bg-travel-blue/10 text-travel-blue",
  PENDING: "bg-secondary-container text-on-secondary-fixed-variant",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-error/10 text-error",
}

const BAR_DATA = [
  { month: "May", value: 65 },
  { month: "Jun", value: 82 },
  { month: "Jul", value: 95 },
  { month: "Aug", value: 78 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt">
                  <Icon className="h-5 w-5 text-on-surface-variant" />
                </div>
                <span className="text-label-sm font-label-sm text-success">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-headline-sm font-headline-sm font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {stat.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient">
          <div className="border-b border-outline-variant px-6 py-4">
            <h2 className="text-body-md font-body-md font-semibold text-primary">
              Recent Bookings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-alt">
                  <th className="px-6 py-3 text-left text-label-sm font-label-sm text-on-surface-variant">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-label-sm font-label-sm text-on-surface-variant">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-label-sm font-label-sm text-on-surface-variant">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-label-sm font-label-sm text-on-surface-variant">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-label-sm font-label-sm text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-label-sm font-label-sm text-on-surface-variant">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {RECENT_BOOKINGS.map((booking) => (
                  <tr key={booking.id} className="hover:bg-surface-alt/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-travel-blue">
                      {booking.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-on-surface">
                      {booking.customer}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-on-surface-variant">
                      {booking.service}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-on-surface">
                      {booking.amount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-label-sm font-label-sm ${
                          STATUS_STYLES[booking.status] ?? "bg-surface-alt text-on-surface-variant"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-on-surface-variant">
                      {booking.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <h2 className="mb-6 text-body-md font-body-md font-semibold text-primary">
            Monthly Bookings
          </h2>
          <div className="flex items-end justify-between gap-3 h-48">
            {BAR_DATA.map((bar) => (
              <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-label-sm font-label-sm text-on-surface-variant">
                  {bar.value}
                </span>
                <div
                  className="w-full rounded-t-lg bg-travel-blue transition-all"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="text-xs text-on-surface-variant">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-outline-variant pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">Total this period</span>
              <span className="font-semibold text-primary">320</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
