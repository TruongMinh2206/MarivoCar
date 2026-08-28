"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, FileText, LogOut, User } from "lucide-react"
import { cn } from "@/utils/cn"
import { useAuth } from "@/contexts/AuthContext"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Airport Transfer", href: "/airport-transfer" },
  { label: "Private Car", href: "/private-car" },
  { label: "Tours", href: "/tours" },
  { label: "Tickets", href: "/tickets" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Spa", href: "/spa" },
  { label: "Guide", href: "/guide" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout, loading } = useAuth()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    router.push("/")
    router.refresh()
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <>
      {/* Desktop Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sticky sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
          {/* Brand */}
          <Link href="/" className="text-xl font-black text-primary tracking-tight font-display">
            MARIVO.vn
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-label-md font-label-md transition-colors",
                  pathname === item.href
                    ? "text-travel-blue"
                    : "text-on-surface-variant hover:text-travel-blue"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!loading && isAuthenticated && user ? (
              /* Logged in state */
              <>
                <Link
                  href="/my-bookings"
                  className="hidden md:flex text-on-surface-variant text-label-md font-label-md hover:text-travel-blue transition-colors items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  My Bookings
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-label-sm font-label-sm text-on-primary">
                    {userInitial}
                  </div>
                  <span className="hidden md:block text-label-md font-label-md text-on-surface max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-on-surface-variant hover:text-error transition-colors p-2"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : !loading ? (
              /* Logged out state */
              <>
                <Link
                  href="/login"
                  className="text-primary text-label-md font-label-md hover:text-travel-blue transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/my-bookings"
                  className="hidden md:flex bg-primary-container text-white px-4 py-2 rounded text-label-md font-label-md hover:opacity-90 transition-opacity items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  My Bookings
                </Link>
              </>
            ) : null}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-primary -mr-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-[60] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-[70] md:hidden overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant">
              <Link href="/" className="text-xl font-black text-primary tracking-tight font-display" onClick={() => setMobileOpen(false)}>
                MARIVO.vn
              </Link>
              <button
                className="p-2 text-primary -mr-2"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="px-5 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-semibold transition-colors",
                    pathname === item.href
                      ? "bg-travel-blue/5 text-travel-blue"
                      : "text-on-surface-variant hover:bg-surface-container"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="px-5 py-4 border-t border-outline-variant space-y-3">
              <Link
                href="/my-bookings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <FileText className="h-5 w-5" />
                My Bookings
              </Link>

              {!loading && isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-label-sm font-label-sm text-on-primary">
                      {userInitial}
                    </div>
                    <span className="text-base font-semibold text-on-surface">{user.name}</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false) }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-semibold text-error hover:bg-error/5 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : !loading ? (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-primary-container text-white px-4 py-3 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  )
}
