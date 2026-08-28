"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const requirements = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character", test: (p: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(p) },
  ]

  const allValid = requirements.every((r) => r.test(password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.")
      return
    }

    if (!allValid) {
      setError("Please meet all password requirements.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful reset
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <>
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </div>
        <h1 className="text-headline-sm font-headline-sm font-bold text-primary mb-2 text-center">
          Password Reset Successfully
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant text-center mb-8">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors"
        >
          Back to Sign In
        </Link>
      </>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-headline-sm font-headline-sm font-bold text-primary mb-2">
          Reset Password
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/30">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block"
          >
            New Password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              className="w-full px-4 py-3 pr-12 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition placeholder:text-outline-variant"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block"
          >
            Confirm Password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError("") }}
              className="w-full px-4 py-3 pr-12 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition placeholder:text-outline-variant"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
              tabIndex={-1}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-surface-alt rounded-lg p-4">
          <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Password must contain:</p>
          <ul className="space-y-1.5">
            {requirements.map((req) => (
              <li key={req.label} className="flex items-center gap-2 text-xs">
                <CheckCircle
                  className={`h-3.5 w-3.5 ${
                    req.test(password) ? "text-success" : "text-outline-variant"
                  }`}
                />
                <span className={req.test(password) ? "text-success" : "text-on-surface-variant"}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" variant="cta" size="lg" loading={loading} className="w-full">
          {!loading && <Lock className="h-4 w-4" />}
          Reset Password
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-travel-blue hover:underline font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
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

          <Suspense
            fallback={
              <div className="text-center py-8 text-on-surface-variant">Loading...</div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
