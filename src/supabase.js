import { createClient } from "@supabase/supabase-js";

// Reads config injected at build time (Vite inlines VITE_* env vars).
// If either is missing, the app runs in pure localStorage mode (no sync) and
// everything still works — you can deploy first, add Supabase later.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

// Single-student setup: the whole progress blob lives in one row.
export const TABLE = "app_state";
export const STATE_ID = "singleton";
