import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
 const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string; if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Variables de entorno de Supabase no configuradas');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);