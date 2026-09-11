"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = "Full name is required."
    }

    if (!email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required."
    } else if (!/^[\d\s\-+()]{7,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number."
    }

    if (!password) {
      newErrors.password = "Password is required."
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters."
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter and one number."
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password."
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    if (!termsAccepted) {
      newErrors.terms = "You must agree to the Terms & Conditions."
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError("")

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        const message =
          json?.error?.message || "An unexpected error occurred. Please try again."
        setServerError(
          res.status === 409
            ? "An account with this email already exists. Please use a different email."
            : message
        )
        setLoading(false)
        return
      }

      // Redirect to login with success message
      router.push("/login?registered=1")
    } catch {
      setServerError("An unexpected error occurred. Please try again.")
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
              Create Account
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant font-sans">
              Join MARIVO to book your next Phu Quoc adventure.
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/30">
              <p className="text-error text-sm">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block font-sans"
              >
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Nguyen Van A"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                }}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition font-sans placeholder:text-outline-variant"
              />
              {errors.name && (
                <p className="mt-1.5 text-error text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block font-sans"
              >
                Email Address <span className="text-error">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition font-sans placeholder:text-outline-variant"
              />
              {errors.email && (
                <p className="mt-1.5 text-error text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block font-sans"
              >
                Phone Number <span className="text-error">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+84 912 345 678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                }}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition font-sans placeholder:text-outline-variant"
              />
              {errors.phone && (
                <p className="mt-1.5 text-error text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block font-sans"
              >
                Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
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
              {errors.password && (
                <p className="mt-1.5 text-error text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="text-label-sm font-label-sm text-on-surface-variant mb-1.5 block font-sans"
              >
                Confirm Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword)
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }))
                  }}
                  className="w-full px-4 py-3 pr-12 border border-outline-variant rounded-lg text-on-surface focus:border-travel-blue focus:ring-2 focus:ring-travel-blue/20 outline-none transition font-sans placeholder:text-outline-variant"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-error text-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked)
                    if (errors.terms)
                      setErrors((prev) => ({ ...prev, terms: undefined }))
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-outline-variant text-travel-blue focus:ring-travel-blue/20 accent-travel-blue"
                />
                <span className="text-sm text-on-surface-variant font-sans">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-travel-blue hover:underline"
                  >
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-travel-blue hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1.5 text-error text-sm">{errors.terms}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="cta"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {!loading && <UserPlus className="h-4 w-4" />}
              Create Account
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center mt-6 text-sm text-on-surface-variant font-sans">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-travel-blue hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
