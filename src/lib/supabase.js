import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://lfwfjumpotdugzveihgl.supabase.co";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_M51NGbx8aPz_VhyGSGemHw_7tMjsHv4";

export const isCloudConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export const supabase = isCloudConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
