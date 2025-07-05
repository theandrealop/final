import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Only create the real Supabase client when running in the browser and the
 * required env vars are available. During static prerender the env vars are
 * missing, so we export a typed stub instead to avoid build-time crashes.
 */
function createBrowserClient(): SupabaseClient | null {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }
  return null
}

export const supabase = createBrowserClient() as unknown as SupabaseClient

// Types for our database tables
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
}

// Auth helper functions
export const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    console.log("SignUp response:", { data, error })
    return { data, error }
  } catch (err) {
    console.error("SignUp catch error:", err)
    return { data: null, error: err }
  }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}
