import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const FOOTER_LINKS = {
  about: [
    { label: "About Us", href: "/guide" },
    { label: "Contact Us", href: "/contact" },
    { label: "Partner With Us", href: "/contact" },
  ],
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
    { label: "Phu Quoc Guide", href: "/guide" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/guide" },
    { label: "Terms of Service", href: "/guide" },
    { label: "FAQ", href: "/guide" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary w-full">
      <div className="py-12 px-5 md:px-16 max-w-[1280px] mx-auto">
        {/* Brand */}
        <div className="mb-8">
          <span className="text-xl font-black text-secondary-container font-display">
            MARIVO.vn
          </span>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* About */}
          <div className="flex flex-col gap-3">
            {FOOTER_LINKS.about.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-label-sm font-label-sm text-on-primary-container hover:text-secondary-container transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <span className="text-label-sm font-label-sm font-bold text-white/60 uppercase tracking-wider mb-1">Services</span>
            {FOOTER_LINKS.services.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-label-sm font-label-sm text-on-primary-container hover:text-secondary-container transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3">
            <span className="text-label-sm font-label-sm font-bold text-white/60 uppercase tracking-wider mb-1">Explore</span>
            {FOOTER_LINKS.explore.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-label-sm font-label-sm text-on-primary-container hover:text-secondary-container transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-label-sm font-label-sm font-bold text-white/60 uppercase tracking-wider mb-1">Contact</span>
            <a href="tel:+842973999999" className="flex items-center gap-2 text-label-sm font-label-sm text-on-primary-container hover:text-secondary-container transition-colors">
              <Phone className="h-3.5 w-3.5" />
              +84-297-399-9999
            </a>
            <a href="mailto:info@marivo.vn" className="flex items-center gap-2 text-label-sm font-label-sm text-on-primary-container hover:text-secondary-container transition-colors">
              <Mail className="h-3.5 w-3.5" />
              info@marivo.vn
            </a>
            <span className="flex items-center gap-2 text-label-sm font-label-sm text-on-primary-container">
              <MapPin className="h-3.5 w-3.5" />
              Phu Quoc, Vietnam
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-label-sm font-label-sm text-on-primary-container text-center md:text-left">
            &copy; {new Date().getFullYear()} MARIVO.vn - Phu Quoc Travel Expert. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Payment indicators */}
            <div className="flex items-center gap-2 text-label-sm font-label-sm text-white/40">
              <span className="px-2 py-1 border border-white/10 rounded text-[10px] font-bold">VISA</span>
              <span className="px-2 py-1 border border-white/10 rounded text-[10px] font-bold">MC</span>
              <span className="px-2 py-1 border border-white/10 rounded text-[10px] font-bold">VNPAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
