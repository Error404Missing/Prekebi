import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

function getClient() {
  if (client) return client
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured. Database features will not work.")
    // Return a dummy client to prevent initialization errors
    return {} as SupabaseClient
  }
  
  client = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}

export { getClient as createClient, getClient as createBrowserClient }
