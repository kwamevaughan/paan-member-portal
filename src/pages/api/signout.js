// pages/api/signout.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { redirectTo, authUserId } = req.body;
  console.log("API: /api/signout called with:", { redirectTo, authUserId });

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    if (authUserId) {
      console.log("API: Attempting to delete auth.users entry:", authUserId);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        authUserId
      );
      if (deleteError) {
        console.error("API: Delete user error:", deleteError);
        throw deleteError;
      }
      console.log("API: Successfully deleted auth.users entry:", authUserId);
    }

    const { error } = await supabaseAdmin.auth.signOut();
    if (error) {
      console.error("API: Sign-out error:", error);
      throw error;
    }

    console.log(
      "API: Returning redirect URL:",
      redirectTo || "https://member-portal.paan.africa/"
    );
    return res
      .status(200)
      .json({ redirectTo: redirectTo || "https://member-portal.paan.africa/" });
  } catch (error) {
    console.error("API: Sign-out error:", error);
    return res.status(500).json({ error: error.message });
  }
}
