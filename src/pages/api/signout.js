// pages/api/signout.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { redirectTo, authUserId } = req.body;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // Delete auth.users entry if authUserId is provided
    if (authUserId) {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        authUserId
      );
      if (deleteError) {
        console.error("API: Delete user error:", deleteError);
        throw deleteError;
      }
      console.log("API: Deleted auth.users entry:", authUserId);
    }

    // Perform sign-out
    const { error } = await supabaseAdmin.auth.signOut();
    if (error) {
      console.error("API: Sign-out error:", error);
      throw error;
    }

    // Server-side redirect
    res.setHeader(
      "Location",
      redirectTo || "https://member-portal.paan.africa/"
    );
    return res.status(302).end();
  } catch (error) {
    console.error("API: Sign-out error:", error);
    return res.status(500).json({ error: error.message });
  }
}
