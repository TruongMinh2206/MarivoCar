import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "MARIVO - Phu Quoc Travel Services",
    template: "%s | MARIVO",
  },
  description:
    "Everything you need for your Phu Quoc trip — in one place. Book airport transfers, tours, hotels, tickets and more.",
  keywords: [
    "Phu Quoc",
    "travel",
    "booking",
    "airport transfer",
    "tours",
    "hotels",
    "Vietnam",
  ],
  authors: [{ name: "MARIVO" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MARIVO",
    title: "MARIVO - Phu Quoc Travel Services",
    description:
      "Everything you need for your Phu Quoc trip — in one place.",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
