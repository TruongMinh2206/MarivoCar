import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const FOOTER_LINKS = {
  services: [
    { label: "Airport Transfer", href: "/airport-transfer" },
    { label: "Private Car", href: "/private-car" },
    { label: "Rent a Car", href: "/rent-a-car" },
    { label: "Tours & Experiences", href: "/tours" },
    { label: "Sightseeing Tickets", href: "/tickets" },
  ],
  explore: [
    { label: "Hotels", href: "/hotels" },
    { label: "Restaurants", href: "/restaurants" },
    { label: "Spa & Wellness", href: "/spa" },
    { label: "Local Products", href: "/products" },
    { label: "Phu Quoc Guide", href: "/guide" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "My Bookings", href: "/my-bookings" },
    { label: "FAQ", href: "/guide" },
    { label: "Terms of Service", href: "/guide" },
    { label: "Privacy Policy", href: "/guide" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-marivo-950 text-white">
      <div className="container-marivo py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold font-display">MARIVO</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 max-w-sm leading-relaxed">
              Everything you need for your Phu Quoc trip — in one place.
              Discover, compare, and book the best travel services.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+84-xxx-xxx-xxx</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>info@marivo.vn</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Phu Quoc, Kien Giang, Vietnam</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MARIVO.vn. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Made with ❤️ in Phu Quoc</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
