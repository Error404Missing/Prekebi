import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase credentials not configured")
    // Return a dummy client object to prevent crashes
    return {
      from: () => ({
        select: () => Promise.reject(new Error("Supabase not configured")),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null } }),
      },
    } as any
  }

  const cookieStore = await cookies()

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignored in Server Components
        }
      },
    },
  })
}

export async function createClient() {
  return createServerClient()
}
