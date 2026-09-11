import { describe, it, expect } from "vitest"

import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../auth"

describe("registerSchema", () => {
  const validInput = {
    name: "Nguyen Van A",
    email: "a@example.com",
    phone: "+84912345678",
    password: "Password1",
  }

  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it("normalizes the email to lowercase", () => {
    const result = registerSchema.parse({ ...validInput, email: "A@Example.COM" })
    expect(result.email).toBe("a@example.com")
  })

  it("trims whitespace from name, email and phone", () => {
    const result = registerSchema.parse({
      ...validInput,
      name: "  Nguyen Van A  ",
      email: " a@example.com ",
      phone: " +84912345678 ",
    })
    expect(result.name).toBe("Nguyen Van A")
    expect(result.email).toBe("a@example.com")
    expect(result.phone).toBe("+84912345678")
  })

  it("rejects email that is not a valid address", () => {
    const result = registerSchema.safeParse({ ...validInput, email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("rejects name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...validInput, name: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid phone formats", () => {
    const result = registerSchema.safeParse({ ...validInput, phone: "abc" })
    expect(result.success).toBe(false)
  })

  describe("password policy", () => {
    it("rejects passwords shorter than 8 characters", () => {
      const result = registerSchema.safeParse({ ...validInput, password: "Pass1" })
      expect(result.success).toBe(false)
    })

    it("rejects passwords without an uppercase letter", () => {
      const result = registerSchema.safeParse({ ...validInput, password: "password1" })
      expect(result.success).toBe(false)
    })

    it("rejects passwords without a number", () => {
      const result = registerSchema.safeParse({ ...validInput, password: "Password" })
      expect(result.success).toBe(false)
    })

    it("accepts an 8+ character password with uppercase and number", () => {
      const result = registerSchema.safeParse({ ...validInput, password: "Password1" })
      expect(result.success).toBe(true)
    })

    it("accepts longer passwords with special characters too", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: "Customer@123456",
      })
      expect(result.success).toBe(true)
    })
  })
})

describe("forgotPasswordSchema", () => {
  it("accepts a valid email and normalizes it to lowercase", () => {
    const result = forgotPasswordSchema.parse({ email: "A@Example.com " })
    expect(result.email).toBe("a@example.com")
  })

  it("rejects an invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "nope" })
    expect(result.success).toBe(false)
  })

  it("rejects a missing email", () => {
    const result = forgotPasswordSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("resetPasswordSchema", () => {
  const validInput = { token: "reset-token", password: "NewPassword1" }

  it("accepts a valid reset payload", () => {
    const result = resetPasswordSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it("rejects a missing token", () => {
    const result = resetPasswordSchema.safeParse({ password: "NewPassword1" })
    expect(result.success).toBe(false)
  })

  it("rejects an empty token", () => {
    const result = resetPasswordSchema.safeParse({ token: "", password: "NewPassword1" })
    expect(result.success).toBe(false)
  })

  it("applies the same password policy as registerSchema", () => {
    const result = resetPasswordSchema.safeParse({
      token: "reset-token",
      password: "weak",
    })
    expect(result.success).toBe(false)
  })
})
