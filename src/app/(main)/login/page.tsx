"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/contexts/AuthContext"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const registered = searchParams.get("registered")
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(
    registered === "1" ? "Account created successfully. Please sign in." : ""
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await login(email, password, rememberMe)

      // Show success briefly before redirect
      setSuccess("Sign in successful! Redirecting...")
      setTimeout(() => {
        router.push(callbackUrl)
        router.refresh()
      }, 500)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 lg:py-20 bg-surface-alt">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-headline-md font-headline-md font-bold text-primary">
                MARIVO
              </span>
              <span className="hidden sm:inline text-label-sm font-label-sm text-outline leading-tight">
                Phu Quoc
                <br />
                Travel
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-headline-sm font-headline-sm font-bold text-primary mb-2">
              Sign In
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant font-sans">
              Welcome back! Sign in to access your account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/30">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 p-3 rounded-lg bg-success/10 border border-success/30">
              <p className="text-success text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block font-sans"
              >
                Email Address <span className="text-error">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition font-sans placeholder:text-outline-variant"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block font-sans"
              >
                Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition font-sans placeholder:text-outline-variant"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-outline-variant text-travel-blue focus:ring-travel-blue/20 accent-travel-blue"
                />
                <span className="text-sm text-on-surface-variant font-sans">
                  Remember Me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-travel-blue hover:underline font-sans"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="cta"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {!loading && <LogIn className="h-4 w-4" />}
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center mt-6 text-sm text-on-surface-variant font-sans">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-travel-blue hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-on-surface-variant font-sans">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
