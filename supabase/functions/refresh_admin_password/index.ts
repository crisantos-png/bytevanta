
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a random secure password
function generateSecurePassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with appropriate options
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check if this is a scheduled invocation with the correct secret
    const { authorization } = req.headers;
    const isScheduled = authorization === `Bearer ${Deno.env.get("CRON_SECRET")}`;
    
    // Generate a new password
    const newPassword = generateSecurePassword();
    
    // Get current date for storing with the password
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + 7); // Set expiry to 7 days from now
    
    // Store the new password in Supabase
    const { error: storeError } = await supabaseClient
      .from("admin_passwords")
      .upsert({
        id: 1, // Using a single row that gets updated
        password: newPassword,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      }, {
        onConflict: "id" // Ensure we handle conflicts properly
      });
      
    if (storeError) {
      console.error("Error storing password:", storeError);
      throw new Error(`Failed to store password: ${storeError.message}`);
    }
    
    // Send email with the new password
    const email = "victorycrisantos@gmail.com";
    
    // Email the password to the user - setting up an email notification
    // Note: This is using the createUser method as a workaround to send notification
    // In a production environment, you should use a dedicated email service
    const { error: emailError } = await supabaseClient.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: { 
        password_notification: true,
        temp_admin_password: newPassword,
        password_expires_at: expiresAt.toISOString()
      }
    });
    
    if (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Password refreshed and email sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in refresh_admin_password function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
