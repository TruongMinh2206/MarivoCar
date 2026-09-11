/**
 * Booking wizard service resolver (Gói 1 — fixes C1).
 *
 * The wizard URL is `/booking/[id]` where [id] has historically carried
 * three different things:
 *
 *   1. a Prisma cuid        — /booking/cmtuhvfuu000tfyq8stoq3hb6   (old deep links)
 *   2. a service slug       — /booking/four-islands-tour           (canonical, from
 *                              detail pages: /booking/{slug}?serviceId={cuid})
 *   3. garbage              — /booking/20, /booking/Deluxe%20Ocean%20View
 *                              (legacy hardcoded links from the old [id] pages)
 *
 * The previous implementation "solved" this with /^[a-z0-9]{20,}$/ (which
 * rejects every slug because slugs contain `-`) and a SILENT fallback to the
 * hardcoded airport sedan service id. Net effect: every booking made from a
 * slug link was persisted as an airport transfer.
 *
 * This resolver makes the resolution explicit and never silently coercive:
 * unresolved input is surfaced as `kind: "invalid"` and the caller MUST
 * render a not-found state.
 */

/** Prisma cuids on this project look like "cmtuhvfuu000tfyq8stoq3hb6". */
export const CUID_PATTERN = /^c[a-z0-9]{20,}$/

/**
 * Service slugs are kebab-case: lowercase letters, digits, single hyphens,
 * no leading/trailing hyphen. This deliberately ACCEPTS hyphens (the old
 * regex did not — that was the core bug) and requires at least one letter,
 * so legacy purely-numeric segments ("20") are rejected up front instead of
 * being sent to the API as a bogus slug lookup.
 */
const SLUG_PATTERN = /^(?=.*[a-z])[a-z0-9]+(?:-[a-z0-9]+)*$/

export type ServiceResolution =
  | { kind: "id"; value: string }
  | { kind: "slug"; value: string }
  | { kind: "invalid"; reason: "empty" | "malformed" }

/** Strip an optional trailing slash and percent-decode the segment. */
function normalizeSegment(segment: string | null | undefined): string {
  if (!segment) return ""
  let value = segment
  try {
    value = decodeURIComponent(segment)
  } catch {
    // Malformed percent-encoding (e.g. "%3Cscript%3E" with stray "%") —
    // keep the raw value; the pattern checks below will reject it.
  }
  return value.replace(/\/+$/, "").trim()
}

/**
 * Decide how the wizard should look the service up.
 *
 * Priority (contract with the detail pages / Gói 2):
 *   1. `serviceIdParam` — the `?serviceId=` cuid, most explicit
 *   2. slug segment      — canonical URL form
 *   3. cuid segment      — legacy deep links
 * Anything else → `invalid`. There is intentionally NO fallback service:
 * a wrong booking is worse than a visible error.
 */
export function resolveServiceRequest(input: {
  segmentId: string | null | undefined
  serviceIdParam: string | null | undefined
}): ServiceResolution {
  const segment = normalizeSegment(input.segmentId)
  const param = normalizeSegment(input.serviceIdParam)

  if (param && CUID_PATTERN.test(param)) {
    return { kind: "id", value: param }
  }

  if (segment && CUID_PATTERN.test(segment)) {
    return { kind: "id", value: segment }
  }

  if (segment && SLUG_PATTERN.test(segment)) {
    return { kind: "slug", value: segment }
  }

  return {
    kind: "invalid",
    reason: segment ? "malformed" : "empty",
  }
}
