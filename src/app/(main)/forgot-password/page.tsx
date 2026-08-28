"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const usersRaw = localStorage.getItem("marivo_users")
      const users: Array<{ email: string }> = usersRaw ? JSON.parse(usersRaw) : []
      const exists = users.some((u) => u.email === email.trim().toLowerCase())

      if (!exists) {
        setError("No account found with this email address.")
        setLoading(false)
        return
      }

      setSent(true)
      setLoading(false)
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 lg:py-20 bg-surface-alt">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-headline-md font-headline-md font-bold text-primary">MARIVO</span>
            </Link>
          </div>

          {sent ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Mail className="h-8 w-8 text-success" />
                </div>
              </div>
              <h1 className="text-headline-sm font-headline-sm font-bold text-primary mb-2 text-center">
                Check Your Email
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant text-center mb-8">
                We have sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>
              <Link
                href="/login"
                className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors"
              >
                Back to Sign In
              </Link>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-headline-sm font-headline-sm font-bold text-primary mb-2">
                  Forgot Password?
                </h1>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Enter your email address and we will send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/30">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError("") }}
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition placeholder:text-outline-variant"
                  />
                </div>

                <Button type="submit" variant="cta" size="lg" loading={loading} className="w-full">
                  {!loading && <Mail className="h-4 w-4" />}
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-travel-blue hover:underline font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
