import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase env missing')
  return createClient(supabaseUrl, supabaseAnonKey)
} 