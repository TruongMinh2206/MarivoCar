"use client"

import { AuthProvider } from "@/contexts/AuthContext"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
