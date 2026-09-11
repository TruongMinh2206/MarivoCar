import Link from "next/link"
import { Home, Compass } from "lucide-react"

const POPULAR_CATEGORIES = [
  { href: "/airport-transfer", label: "Airport Transfers" },
  { href: "/tours", label: "Tours" },
  { href: "/hotels", label: "Hotels" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/spa", label: "Spa" },
  { href: "/tickets", label: "Tickets" },
]

const linkChipClass =
  "rounded-full border border-outline-variant px-4 py-1.5 text-label-md font-label-md text-on-surface-variant hover:border-primary hover:text-primary hover:bg-surface-container transition-colors"

export default function NotFound() {
  return (
    <main className="container-marivo flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      {/* Oversized 404 with brand color contrast */}
      <p
        aria-hidden="true"
        className="font-display text-[7rem] leading-none font-black tracking-tight text-surface-container md:text-[10rem]"
        style={{ WebkitTextStroke: "2px var(--color-cta)" }}
      >
        404
      </p>

      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-1.5 text-label-md font-label-md text-on-surface-variant">
        <Compass className="h-4 w-4 text-travel-blue" />
        Lost in Phu Quoc?
      </p>

      <h1 className="mt-4 font-headline-md text-headline-md text-primary font-bold">
        This page washed away with the tide
      </h1>

      <p className="mt-3 max-w-md text-body-lg font-body-lg text-on-surface-variant">
        The page you are looking for does not exist or has been moved. Let us
        get you back to planning your trip.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-label-md font-label-md font-semibold text-on-primary shadow-ambient transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Link>

      <nav aria-label="Popular categories" className="mt-10">
        <p className="mb-3 text-label-md font-label-md text-outline uppercase tracking-wider">
          Or explore
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_CATEGORIES.map((category) => (
            <li key={category.href}>
              <Link href={category.href} className={linkChipClass}>
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}
