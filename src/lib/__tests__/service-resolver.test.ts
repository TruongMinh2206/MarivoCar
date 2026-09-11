import { describe, it, expect } from "vitest"
import {
  resolveServiceRequest,
  CUID_PATTERN,
} from "../service-resolver"

/**
 * Unit tests for the booking wizard service resolver (Gói 1 — C1).
 *
 * The old resolver used /^[a-z0-9]{20,}$/ WITHOUT the hyphen, so every slug
 * URL (e.g. "four-islands-tour") failed the test and silently fell back to
 * the hardcoded airport sedan. These tests pin the new contract:
 *
 *   1. ?serviceId= cuid param wins over the URL segment
 *   2. slug segments (with hyphens!) are recognized as slugs
 *   3. legacy numeric ids are flagged invalid — never silently coerced
 */
describe("CUID_PATTERN", () => {
  it("accepts a real Prisma cuid", () => {
    expect(CUID_PATTERN.test("cmtuhvfuu000tfyq8stoq3hb6")).toBe(true)
  })

  it("accepts a cuid-like id from the newer seed set", () => {
    expect(CUID_PATTERN.test("cmtblxlas000tu9rwbu8plc91")).toBe(true)
  })

  it("rejects a slug with hyphens as a cuid", () => {
    expect(CUID_PATTERN.test("four-islands-tour")).toBe(false)
  })

  it("rejects legacy numeric ids", () => {
    expect(CUID_PATTERN.test("20")).toBe(false)
  })

  it("rejects room names with spaces (legacy hotel bug)", () => {
    expect(CUID_PATTERN.test("Deluxe Ocean View")).toBe(false)
  })

  it("rejects empty input", () => {
    expect(CUID_PATTERN.test("")).toBe(false)
  })
})

describe("resolveServiceRequest", () => {
  it("prefers the serviceId query param over the slug segment", () => {
    // Arrange
    const input = {
      segmentId: "four-islands-tour",
      serviceIdParam: "cmtuhvfuu000tfyq8stoq3hb6",
    }

    // Act
    const result = resolveServiceRequest(input)

    // Assert
    expect(result).toEqual({
      kind: "id",
      value: "cmtuhvfuu000tfyq8stoq3hb6",
    })
  })

  it("resolves a hyphenated slug segment as kind slug", () => {
    const result = resolveServiceRequest({
      segmentId: "four-islands-tour",
      serviceIdParam: null,
    })

    expect(result).toEqual({ kind: "slug", value: "four-islands-tour" })
  })

  it("resolves a plain slug without hyphens as kind slug", () => {
    const result = resolveServiceRequest({
      segmentId: "sedan",
      serviceIdParam: null,
    })

    expect(result).toEqual({ kind: "slug", value: "sedan" })
  })

  it("falls back to the slug segment when the param is not a cuid", () => {
    // e.g. /booking/four-islands-tour?serviceId=garbage
    const result = resolveServiceRequest({
      segmentId: "four-islands-tour",
      serviceIdParam: "not-a-cuid",
    })

    expect(result).toEqual({ kind: "slug", value: "four-islands-tour" })
  })

  it("resolves a cuid segment as kind id", () => {
    const result = resolveServiceRequest({
      segmentId: "cmtuhvfuu000tfyq8stoq3hb6",
      serviceIdParam: null,
    })

    expect(result).toEqual({ kind: "id", value: "cmtuhvfuu000tfyq8stoq3hb6" })
  })

  it("resolves a cuid segment even when a garbage param is present", () => {
    const result = resolveServiceRequest({
      segmentId: "cmtblxlas000tu9rwbu8plc91",
      serviceIdParam: "20",
    })

    expect(result).toEqual({
      kind: "id",
      value: "cmtblxlas000tu9rwbu8plc91",
    })
  })

  it("flags legacy numeric segments as invalid — no silent fallback", () => {
    // The old code turned "20" into the sedan service. Never again.
    const result = resolveServiceRequest({
      segmentId: "20",
      serviceIdParam: null,
    })

    expect(result.kind).toBe("invalid")
  })

  it("flags room-name segments (spaces) as invalid", () => {
    const result = resolveServiceRequest({
      segmentId: "Deluxe%20Ocean%20View",
      serviceIdParam: null,
    })

    expect(result.kind).toBe("invalid")
  })

  it("flags an empty segment with no param as invalid", () => {
    const result = resolveServiceRequest({
      segmentId: "",
      serviceIdParam: null,
    })

    expect(result.kind).toBe("invalid")
  })

  it("flags url-encoded garbage as invalid", () => {
    const result = resolveServiceRequest({
      segmentId: "%3Cscript%3E",
      serviceIdParam: null,
    })

    expect(result.kind).toBe("invalid")
  })

  it("treats a null segment with a valid cuid param as id", () => {
    const result = resolveServiceRequest({
      segmentId: null,
      serviceIdParam: "cmtuhvfuu000tfyq8stoq3hb6",
    })

    expect(result).toEqual({
      kind: "id",
      value: "cmtuhvfuu000tfyq8stoq3hb6",
    })
  })
})
