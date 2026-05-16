import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, action } = await req.json();

    if (!email || !action) {
      return new Response(
        JSON.stringify({ error: "Missing email or action parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action !== "grant" && action !== "revoke") {
      return new Response(
        JSON.stringify({ error: "Action must be 'grant' or 'revoke'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // First, find the user by email using admin API
    const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!listRes.ok) {
      const err = await listRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch users", details: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { users } = await listRes.json();
    const targetUser = users.find((u: { email: string }) => u.email === email);

    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: `No user found with email: ${email}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the user's app_metadata
    const currentAppMeta = targetUser.app_metadata || {};
    const newRole = action === "grant" ? "admin" : "user";
    const updatedAppMeta = { ...currentAppMeta, role: newRole };

    const updateRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${targetUser.id}`, {
      method: "PUT",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app_metadata: updatedAppMeta }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to update user role", details: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const updatedUser = await updateRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        user_id: targetUser.id,
        email: targetUser.email,
        role: newRole,
        message: `Admin role ${action === "grant" ? "granted to" : "revoked from"} ${email}`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
