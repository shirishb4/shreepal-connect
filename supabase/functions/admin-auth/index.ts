import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, email, password, user_metadata, user_id } = await req.json();

    // Action: confirm-email — confirms an existing user's email
    if (action === "confirm-email") {
      if (!user_id) throw new Error("user_id is required");

      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        email_confirm: true,
      });

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, user: data.user }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: signup — creates a new user with auto-confirmed email
    if (action === "signup") {
      if (!email || !password) throw new Error("email and password are required");

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: user_metadata || {},
      });

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, user: data.user }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: update-user — updates email/password for an existing user
    if (action === "update-user") {
      if (!user_id) throw new Error("user_id is required");
      const updates: Record<string, unknown> = {};
      if (email) { updates.email = email; updates.email_confirm = true; }
      if (password) updates.password = password;

      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, updates);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, user: data.user }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action. Use 'signup', 'confirm-email', or 'update-user'.");
  } catch (error: any) {
    console.error("admin-auth error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
