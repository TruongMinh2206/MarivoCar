import { test, expect } from "@playwright/test"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Auth flows (Gói 4 — feat/auth-flows):
 *
 * 1. Register via the real API → account exists → login works right away
 *    and the header switches to the logged-in UI.
 * 2. Forgot-password never reveals whether the email exists.
 * 3. Register duplicate email → 409.
 * 4. Reset-password round-trip: the issued token changes the password,
 *    the old password stops working, the token is single-use.
 * 5. Login brute-force: 5 wrong attempts allowed, the 6th gets 429.
 *
 * NOTE on rate-limit buckets: every test uses its own `x-forwarded-for`
 * identity so the in-memory per-IP buckets stay isolated — the register
 * limit is 3/hour and the suite registers more accounts than that.
 */
test.describe("auth flows", () => {
  test("register → login immediately → logged-in header", async ({ page }) => {
    const email = `e2e-auth-${Date.now()}@example.com`
    const password = "E2ePassword1"

    // ── Register via the UI form ─────────────────────────────────────────
    await page.goto("/register")

    await page.getByLabel(/full name/i).fill("E2E Auth User")
    await page.getByLabel(/email address/i).fill(email)
    await page.getByLabel(/phone number/i).fill("+84912345678")
    await page.getByLabel(/^password/i).fill(password)
    await page.getByLabel(/confirm password/i).fill(password)
    await page.getByRole("checkbox").check()

    await page.getByRole("button", { name: /create account/i }).click()

    // Lands on /login with the success banner
    await expect(page).toHaveURL(/\/login\?registered=1/, { timeout: 15_000 })
    await expect(page.getByText(/account created successfully/i)).toBeVisible()

    // ── Login with the fresh account ─────────────────────────────────────
    await page.getByLabel(/email address/i).fill(email)
    await page.getByLabel(/^password/i).fill(password)
    await page.getByRole("button", { name: /sign in/i }).click()

    // Logged-in UI: header shows the avatar + name, My Bookings link
    await expect(page.getByText("E2E Auth User").first()).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByRole("link", { name: /my bookings/i }).first()).toBeVisible()
  })

  test("register duplicate email returns 409", async ({ request }) => {
    const email = `e2e-dup-${Date.now()}@example.com`

    const first = await request.post("/api/auth/register", {
      headers: { "x-forwarded-for": "203.0.113.2" },
      data: {
        name: "Dup User",
        email,
        phone: "+84912345678",
        password: "E2ePassword1",
      },
    })
    expect(first.status()).toBe(201)

    const second = await request.post("/api/auth/register", {
      headers: { "x-forwarded-for": "203.0.113.2" },
      data: {
        name: "Dup User",
        email,
        phone: "+84912345678",
        password: "E2ePassword1",
      },
    })
    expect(second.status()).toBe(409)
  })

  test("forgot-password returns generic success regardless of account existence", async ({ request }) => {
    const known = `e2e-known-${Date.now()}@example.com`
    await request.post("/api/auth/register", {
      headers: { "x-forwarded-for": "203.0.113.3" },
      data: {
        name: "Known User",
        email: known,
        phone: "+84912345678",
        password: "E2ePassword1",
      },
    })

    const knownRes = await request.post("/api/auth/forgot-password", {
      headers: { "x-forwarded-for": "203.0.113.3" },
      data: { email: known },
    })
    expect(knownRes.status()).toBe(200)
    const knownJson = await knownRes.json()

    const ghostRes = await request.post("/api/auth/forgot-password", {
      headers: { "x-forwarded-for": "203.0.113.4" },
      data: { email: `ghost-${Date.now()}@example.com` },
    })
    expect(ghostRes.status()).toBe(200)
    const ghostJson = await ghostRes.json()

    // Anti-enumeration: identical generic message, no token in the response
    expect(knownJson.data.message).toBe(ghostJson.data.message)
    expect(JSON.stringify(knownJson)).not.toMatch(/token/i)
  })

  test("reset-password round-trip: token changes the password and is single-use", async ({ request }) => {
    const email = `e2e-reset-${Date.now()}@example.com`
    const oldPassword = "OldPassword1"
    const newPassword = "NewPassword9"

    // Register an account to reset
    const reg = await request.post("/api/auth/register", {
      headers: { "x-forwarded-for": "203.0.113.5" },
      data: {
        name: "Reset User",
        email,
        phone: "+84912345678",
        password: oldPassword,
      },
    })
    expect(reg.status()).toBe(201)

    // Request the reset link. In dev the email is only logged, so the E2E
    // reads the freshly issued token from the DB (exactly what the email
    // link would carry) to drive the rest of the flow.
    const forgot = await request.post("/api/auth/forgot-password", {
      headers: { "x-forwarded-for": "203.0.113.5" },
      data: { email },
    })
    expect(forgot.status()).toBe(200)

    const token = await prisma.verificationToken.findFirst({
      where: { identifier: email },
      orderBy: { expires: "desc" },
    })
    expect(token).toBeTruthy()

    // A forged token must be rejected first
    const badReset = await request.post("/api/auth/reset-password", {
      headers: { "x-forwarded-for": "203.0.113.5" },
      data: { token: "not-a-real-token", password: newPassword },
    })
    expect(badReset.status()).toBe(400)
    expect((await badReset.json()).error.message).toMatch(/invalid|expired/i)

    // Consume the real token — the old password no longer works after it
    const goodReset = await request.post("/api/auth/reset-password", {
      headers: { "x-forwarded-for": "203.0.113.5" },
      data: { token: token!.token, password: newPassword },
    })
    expect(goodReset.status()).toBe(200)

    const oldRejected = await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "203.0.113.6" },
      data: { email, password: oldPassword },
    })
    expect(oldRejected.status()).toBe(401)

    const newAccepted = await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "203.0.113.6" },
      data: { email, password: newPassword },
    })
    expect(newAccepted.status()).toBe(200)

    // The token is single-use — replaying it fails
    const replay = await request.post("/api/auth/reset-password", {
      headers: { "x-forwarded-for": "203.0.113.5" },
      data: { token: token!.token, password: "Another9Password" },
    })
    expect(replay.status()).toBe(400)
  })

  test("login brute-force gets 429 after the limit", async ({ request }) => {
    const email = `e2e-brute-${Date.now()}@example.com`
    const ip = "203.0.113.7"

    // Register (its own bucket identity — the register limit is 3/h)
    await request.post("/api/auth/register", {
      headers: { "x-forwarded-for": ip },
      data: {
        name: "Brute Target",
        email,
        phone: "+84912345678",
        password: "E2ePassword1",
      },
    })

    // 5 wrong attempts are allowed (RATE_LIMIT.LOGIN max: 5 / 15m) …
    for (let i = 0; i < 5; i++) {
      const res = await request.post("/api/auth/login", {
        headers: { "x-forwarded-for": ip },
        data: { email, password: "WrongPass1" },
      })
      expect(res.status()).toBe(401)
    }

    // … the 6th is blocked with 429 + Retry-After
    const blocked = await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": ip },
      data: { email, password: "WrongPass1" },
    })
    expect(blocked.status()).toBe(429)
    const body = await blocked.json()
    expect(body.error.message).toMatch(/too many/i)
    expect(blocked.headers()["retry-after"]).toBeTruthy()
  })
})

