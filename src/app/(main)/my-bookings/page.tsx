"use client"
import { useState } from "react"
import Link from "next/link"
import { Search, Calendar, MapPin, Users, Clock } from "lucide-react"
import { format } from "date-fns"
import { useMyBookings } from "@/hooks/useMyBookings"
import { StatusBadge } from "@/components/ui/Badge"
import { Price } from "@/components/ui/Price"
import { NoBookingsYet } from "@/components/ui/EmptyState"
import { ErrorState } from "@/components/ui/ErrorState"
import { ServiceCardSkeleton } from "@/components/ui/LoadingSkeleton"
import { cn } from "@/utils/cn"

const TABS = [
  { id: "ALL", label: "All Bookings" },
  { id: "UPCOMING", label: "Upcoming" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
]

const MOCK_IMAGES: Record<string, string> = {
  "airport transfer": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=200&fit=crop",
  "private car": "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=200&fit=crop",
  "hotel": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop",
  "tour": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
  "default": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop",
}

export default function MyBookingsPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const { bookings, loading, error, activeTab, setActiveTab } = useMyBookings(email)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setEmail(emailInput.trim())
    }
  }

  if (!email) {
    return (
      <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
            <Search className="h-8 w-8 text-travel-blue" />
          </div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary mb-4">
            My Bookings
          </h1>
          <p className="text-on-surface-variant text-body-lg font-body-lg mb-8">
            Enter your email to view your bookings.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none"
            />
            <button type="submit" className="bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded-lg text-label-md font-label-md font-bold hover:bg-secondary-fixed-dim transition-colors">
              Search
            </button>
          </form>
          <p className="text-xs text-outline mt-4">
            Or search by booking code:{" "}
            <Link href="/my-bookings/MRV250315-0001" className="text-travel-blue underline">
              MRV250315-0001
            </Link>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary mb-4">My Bookings</h1>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
          Manage your upcoming trips, review past stays, and stay updated on your itinerary.
        </p>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2">
          Showing bookings for <span className="font-medium">{email}</span>
          <button
            onClick={() => { setEmail(null); setEmailInput("") }}
            className="ml-2 text-travel-blue underline text-xs"
          >
            Change
          </button>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-outline-variant mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-travel-blue text-travel-blue"
                : "border-transparent text-on-surface-variant hover:text-travel-blue"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : bookings.length === 0 ? (
        <NoBookingsYet />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const serviceName = booking.items.map((item) => item.serviceName).join(", ")
            const imgKey = Object.keys(MOCK_IMAGES).find(k => serviceName.toLowerCase().includes(k)) || "default"
            return (
              <Link key={booking.id} href={`/my-bookings/${booking.bookingCode}`}>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-ambient hover:shadow-hover transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Image */}
                  <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-surface-container relative">
                    <img src={MOCK_IMAGES[imgKey]} alt={serviceName} className="absolute inset-0 w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                          ID: #{booking.bookingCode}
                        </span>
                        <h3 className="text-headline-sm font-headline-sm text-primary">{serviceName}</h3>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-body-md font-body-md text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(booking.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(booking.createdAt), "HH:mm")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">Phu Quoc</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{booking.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)} traveler(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Action & Price */}
                  <div className="w-full md:w-auto md:text-right flex flex-col justify-between shrink-0 gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-outline-variant md:pl-6">
                    <Price amount={Number(booking.total)} size="lg" />
                    <span className="bg-primary-container text-on-primary text-sm font-semibold px-6 py-3 rounded-lg hover:bg-tertiary-container transition-colors whitespace-nowrap w-full md:w-auto text-center">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
