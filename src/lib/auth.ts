import { createHash, randomBytes } from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { UnauthorizedError, ForbiddenError } from "./errors"
import { UserRole } from "@prisma/client"

export const SESSION_COOKIE_NAME = "marivo_session"

const SALT_ROUNDS = 10
const SESSION_DAYS = 7

/**
 * Hash a plaintext password with bcrypt.
 */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a plaintext password against a bcrypt hash.
 */
export function verifyPassword(
  password: string,
  hash: string | null | undefined
): Promise<boolean> {
  if (!hash) return Promise.resolve(false)
  return bcrypt.compare(password, hash)
}

/**
 * Hash a session token before it is stored in the DB so a leaked DB dump
 * does not expose usable session tokens.
 */
function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

/**
 * Create a DB-backed session for a user. Returns the raw token (to be set as
 * an HttpOnly cookie) while storing only its hash.
 */
export async function createSession(userId: string) {
  const rawToken = randomBytes(32).toString("base64url")
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000)

  await prisma.session.create({
    data: {
      sessionToken: hashSessionToken(rawToken),
      userId,
      expires,
    },
  })

  return { sessionToken: rawToken, expires }
}

/**
 * Destroy a session (logout). Lookup by hashed token.
 */
export async function destroySession(rawToken: string) {
  await prisma.session.delete({
    where: { sessionToken: hashSessionToken(rawToken) },
  })
}

export interface AuthResult {
  session: { sessionToken: string; expires: Date } | null
  user: {
    id: string
    email: string
    name: string | null
    phone: string | null
    role: UserRole
    image: string | null
  } | null
}

/**
 * Resolve the current user + session from a raw cookie token (already read
 * server-side). Returns null if the token is invalid, expired, or the user is
 * inactive — never throws for a missing/invalid token.
 */
export async function getSessionUser(
  rawToken: string | null | undefined
): Promise<AuthResult> {
  if (!rawToken) return { session: null, user: null }

  const session = await prisma.session.findUnique({
    where: { sessionToken: hashSessionToken(rawToken) },
    include: { user: true },
  })

  if (!session) return { session: null, user: null }
  if (session.expires.getTime() < Date.now()) return { session: null, user: null }
  if (!session.user.isActive) return { session: null, user: null }

  return {
    session: { sessionToken: rawToken, expires: session.expires },
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      phone: session.user.phone,
      role: session.user.role,
      image: session.user.image,
    },
  }
}

type AuthLike = Awaited<ReturnType<typeof getSessionUser>>

/**
 * Require an authenticated user. Throws 401 when unauthenticated.
 */
export async function requireUser(auth: AuthLike): Promise<AuthResult> {
  if (!auth.user) {
    throw new UnauthorizedError("Authentication required")
  }
  return auth
}

/**
 * Require an authenticated user with at least one of the given roles.
 * Accepts a resolved AuthResult (callers fetch the session/cookie first).
 */
export function requireRole(roles: UserRole[]) {
  return async function (auth: AuthLike): Promise<AuthResult> {
    await requireUser(auth)
    if (!auth.user || !roles.includes(auth.user.role)) {
      throw new ForbiddenError("Insufficient permissions")
    }
    return auth
  }
}

/**
 * Convenience: any staff/manage/admin level role.
 */
export const requireAdmin = requireRole([
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.MANAGER,
  UserRole.STAFF,
])

/**
 * Super admin only — for user/role management.
 */
export const requireSuperAdmin = requireRole([UserRole.SUPER_ADMIN])
