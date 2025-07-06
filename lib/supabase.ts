import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Task = {
  id: string
  title: string
  icon: string
  completed: boolean
  user_id?: string
  created_at?: string
}

export type User = {
  id: string
  email?: string
  name: string
  is_guest: boolean
}
