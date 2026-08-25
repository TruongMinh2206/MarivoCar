"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, MapPin, Phone } from "lucide-react"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/Button"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  {
    label: "Transport",
    children: [
      { label: "Airport Transfer", href: "/airport-transfer", icon: "✈️" },
      { label: "Private Car", href: "/private-car", icon: "🚗" },
      { label: "Rent a Car", href: "/rent-a-car", icon: "🔑" },
      { label: "Taxi", href: "tel:+842973999999", icon: "🚕", external: true },
    ],
  },
  { label: "Tours", href: "/tours" },
  { label: "Tickets", href: "/tickets" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Spa", href: "/spa" },
  { label: "Guide", href: "/guide" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <>
      {/* Top bar */}
      <div className="hidden bg-marivo-900 text-white text-xs py-1.5 lg:block">
        <div className="container-marivo flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Phu Quoc, Vietnam
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> +84-xxx-xxx-xxx
            </span>
          </div>
          <span>24/7 Support Available</span>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-[var(--z-sticky)] bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container-marivo">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold font-display text-marivo-700">
                MARIVO
              </span>
              <span className="hidden sm:inline text-[10px] text-gray-400 leading-tight">
                Phu Quoc<br />Travel
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        pathname === item.href
                          ? "text-marivo-600 bg-marivo-50"
                          : "text-gray-600 hover:text-marivo-600 hover:bg-gray-50"
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={cn(
                          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          item.children?.some((c) => pathname === c.href)
                            ? "text-marivo-600 bg-marivo-50"
                            : "text-gray-600 hover:text-marivo-600 hover:bg-gray-50"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>

                      {/* Dropdown */}
                      {activeDropdown === item.label && item.children && (
                        <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                pathname === child.href
                                  ? "bg-marivo-50 text-marivo-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <span className="text-lg">{child.icon}</span>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                href="/my-bookings"
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === "/my-bookings"
                    ? "text-marivo-600 bg-marivo-50"
                    : "text-gray-600 hover:text-marivo-600 hover:bg-gray-50"
                )}
              >
                My Bookings
              </Link>

              <Link href="/login" className="hidden sm:block">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="container-marivo py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.label ? null : item.label
                          )
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            activeDropdown === item.label && "rotate-180"
                          )}
                        />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                                pathname === child.href
                                  ? "bg-marivo-50 text-marivo-600"
                                  : "text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              <span>{child.icon}</span>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-sm font-medium",
                        pathname === item.href
                          ? "bg-marivo-50 text-marivo-600"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                <Link
                  href="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  My Bookings
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
