"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { resolveSessionUser } from "@/lib/auth-session"

export interface AuthUser {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  image?: string | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      const json = await res.json()
      // The API wraps the payload in the successResponse envelope
      // ({data:{user}}) when a session exists but returns {user:null}
      // without one — resolveSessionUser handles both shapes. Reading
      // only json.user here dropped valid sessions on every page load.
      setUser(resolveSessionUser(json))
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error?.message || "Login failed")
      }
      setUser(resolveSessionUser(json))
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
      setLoading(false)
    }
  }, [])

  const isAdmin = !!user && ["ADMIN", "SUPER_ADMIN", "MANAGER", "STAFF"].includes(user.role)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        logout,
        refresh,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    return {
      user: null,
      loading: false,
      isAdmin: false,
      login: async () => {},
      logout: async () => {},
      refresh: async () => {},
      isAuthenticated: false,
    }
  }
  return ctx
}
