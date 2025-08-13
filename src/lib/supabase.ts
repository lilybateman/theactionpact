import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

// For production builds, use fallback values if env vars are missing
const finalSupabaseUrl = supabaseUrl || 'https://ycmwglhpnxiomamtdezc.supabase.co'
const finalSupabaseAnonKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbXdnbGhwbnhpb21hbXRkZXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzIyNTQsImV4cCI6MjA3MDU0ODI1NH0.q2rA6InNpgifggchZaHqFEQg60iDLLbuktuFfDy0F0g'

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey)
