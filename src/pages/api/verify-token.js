// pages/api/auth/verify-token.js
import { supabaseServer } from "@/lib/supabase";

export default async function handler(req, res) {
  try {
    const supabase = supabaseServer(req);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return res.status(401).json({ error: "Invalid session" });
    }
    const { data, error: dbError } = await supabase
      .from("candidates")
      .select(
        "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName"
      )
      .eq("auth_user_id", user.id)
      .single();
    if (dbError || !data) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      user: {
        id: data.id,
        email: data.primaryContactEmail,
        full_name: data.primaryContactName,
        agency_id: data.agencyName,
      },
    });
  } catch (err) {
    console.error("API: Verify token error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
