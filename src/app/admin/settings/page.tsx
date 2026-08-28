"use client"

import { useState } from "react"
import { Save, Building2, Clock, Bell, CreditCard, Users } from "lucide-react"

const tabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const [companyName, setCompanyName] = useState("MARIVO.vn")
  const [email, setEmail] = useState("contact@marivo.vn")
  const [phone, setPhone] = useState("+84 297 392 8888")
  const [address, setAddress] = useState("123 Nguyen Hue, Phu Quoc, Kien Giang, Vietnam")

  const [operatingDays, setOperatingDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ])
  const [openTime, setOpenTime] = useState("08:00")
  const [closeTime, setCloseTime] = useState("22:00")

  const toggleDay = (day: string) => {
    setOperatingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const inputClasses =
    "w-full rounded-lg border border-outline-variant bg-surface-alt px-4 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-travel-blue focus:outline-none focus:ring-1 focus:ring-travel-blue"

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-md text-headline-md text-primary">Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-outline-variant">
        <nav className="flex gap-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-travel-blue text-travel-blue"
                    : "border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "general" && (
        <div className="space-y-8">
          {/* Business Info Section */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt">
                <Building2 className="h-5 w-5 text-on-surface-variant" />
              </div>
              <div>
                <h2 className="text-body-md font-body-md font-semibold text-primary">
                  Business Information
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Manage your company details and contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Operating Hours Section */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt">
                <Clock className="h-5 w-5 text-on-surface-variant" />
              </div>
              <div>
                <h2 className="text-body-md font-body-md font-semibold text-primary">
                  Operating Hours
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Set your business operating schedule
                </p>
              </div>
            </div>

            {/* Day Checkboxes */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-on-surface">
                Open Days
              </label>
              <div className="flex flex-wrap gap-3">
                {days.map((day) => (
                  <label
                    key={day}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      operatingDays.includes(day)
                        ? "border-travel-blue bg-travel-blue/10 text-travel-blue"
                        : "border-outline-variant bg-surface-alt text-on-surface-variant hover:bg-surface-container-lowest"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={operatingDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        operatingDays.includes(day)
                          ? "border-travel-blue bg-travel-blue"
                          : "border-outline-variant bg-surface-container-lowest"
                      }`}
                    >
                      {operatingDays.includes(day) && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {day}
                  </label>
                ))}
              </div>
            </div>

            {/* Time Inputs */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div className="mt-6 text-outline">to</div>

              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-lg bg-travel-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-travel-blue/90 focus:outline-none focus:ring-2 focus:ring-travel-blue focus:ring-offset-2">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Other Tabs - Placeholder Content */}
      {activeTab === "notifications" && (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt">
              <Bell className="h-5 w-5 text-on-surface-variant" />
            </div>
            <div>
              <h2 className="text-body-md font-body-md font-semibold text-primary">
                Notification Settings
              </h2>
              <p className="text-sm text-on-surface-variant">
                Configure how and when you receive notifications
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt">
              <CreditCard className="h-5 w-5 text-on-surface-variant" />
            </div>
            <div>
              <h2 className="text-body-md font-body-md font-semibold text-primary">
                Payment Settings
              </h2>
              <p className="text-sm text-on-surface-variant">
                Manage payment methods and billing information
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt">
              <Users className="h-5 w-5 text-on-surface-variant" />
            </div>
            <div>
              <h2 className="text-body-md font-body-md font-semibold text-primary">
                Team Management
              </h2>
              <p className="text-sm text-on-surface-variant">
                Manage team members and their roles
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
