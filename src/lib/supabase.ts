import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://orqiaahseiudprjguimw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hYS6V5iI9fzBzUWJZ0ZKXQ_nZJw1HD-';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://placeholder-project.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
