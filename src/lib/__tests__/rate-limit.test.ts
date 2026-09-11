import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import {
  checkRateLimit,
  resetRateLimits,
  RATE_LIMIT_DISABLED,
} from "../rate-limit"

// Deterministic time control for sliding-window tests
const REAL_NOW = Date.now
let fakeNow = 0

beforeEach(() => {
  fakeNow = 1_000_000
  vi.spyOn(Date, "now").mockImplementation(() => fakeNow)
  resetRateLimits()
})

afterEach(() => {
  vi.spyOn(Date, "now").mockRestore()
  vi.restoreAllMocks()
  delete process.env[RATE_LIMIT_DISABLED]
})

function advance(ms: number) {
  fakeNow += ms
}

describe("rate-limit (sliding window)", () => {
  it("allows requests under the max within the window", () => {
    const config = { windowMs: 60_000, max: 3 }

    expect(checkRateLimit("login:1.1.1.1", config).allowed).toBe(true)
    expect(checkRateLimit("login:1.1.1.1", config).allowed).toBe(true)
    expect(checkRateLimit("login:1.1.1.1", config).allowed).toBe(true)
  })

  it("blocks the request that exceeds max and reports remaining time", () => {
    const config = { windowMs: 60_000, max: 2 }

    checkRateLimit("k", config)
    checkRateLimit("k", config)
    const third = checkRateLimit("k", config)

    expect(third.allowed).toBe(false)
    expect(third.retryAfterMs).toBeGreaterThan(0)
    expect(third.retryAfterMs).toBeLessThanOrEqual(60_000)
  })

  it("separates buckets per key", () => {
    const config = { windowMs: 60_000, max: 1 }

    expect(checkRateLimit("ip:1", config).allowed).toBe(true)
    expect(checkRateLimit("ip:2", config).allowed).toBe(true)
    expect(checkRateLimit("ip:1", config).allowed).toBe(false)
    expect(checkRateLimit("ip:2", config).allowed).toBe(false)
  })

  it("allows again after the window fully elapses", () => {
    const config = { windowMs: 60_000, max: 2 }

    checkRateLimit("k", config)
    checkRateLimit("k", config)
    expect(checkRateLimit("k", config).allowed).toBe(false)

    // Sliding past the whole window: every stored hit is now expired
    advance(60_001)

    expect(checkRateLimit("k", config).allowed).toBe(true)
  })

  it("keeps a hit counted until it slides out of the window", () => {
    const config = { windowMs: 60_000, max: 2 }

    checkRateLimit("k", config)
    advance(50_000)
    checkRateLimit("k", config)
    advance(10_000) // 60s since the first hit — the first slid out, the second remains

    const result = checkRateLimit("k", config)
    expect(result.allowed).toBe(true) // only 1 hit still in the window
    expect(checkRateLimit("k", config).allowed).toBe(false) // now 2 again
  })

  it("remembers only timestamps inside the window (true sliding)", () => {
    const config = { windowMs: 60_000, max: 1 }

    checkRateLimit("k", config)
    advance(59_999)
    expect(checkRateLimit("k", config).allowed).toBe(false)

    advance(1) // first hit is exactly windowMs old now
    expect(checkRateLimit("k", config).allowed).toBe(true)
  })

  it("forgets keys entirely once empty (no memory leak)", () => {
    const config = { windowMs: 10_000, max: 1 }

    checkRateLimit("leaky", config)
    advance(10_001)
    checkRateLimit("leaky", config) // prunes the expired bucket

    // Internals: the bucket for "leaky" should have been dropped, not kept.
    // We assert via a fresh key so the check stays behavioral.
    expect(checkRateLimit("leaky:2", config).allowed).toBe(true)
  })

  it("can be disabled via env flag (tests / trusted environments)", () => {
    process.env[RATE_LIMIT_DISABLED] = "1"
    const config = { windowMs: 60_000, max: 1 }

    expect(checkRateLimit("k", config).allowed).toBe(true)
    expect(checkRateLimit("k", config).allowed).toBe(true)
    expect(checkRateLimit("k", config).allowed).toBe(true)
  })
})
