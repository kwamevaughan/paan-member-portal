// pages/api/auth/verify-token.js
import { supabaseServer } from "@/lib/supabase";

// Helper function to find user in either candidates or hr_users table
const findUserInTables = async (supabase, authUserId) => {
  try {
    // First, try to find user in candidates table
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .select(
        "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName"
      )
      .eq("auth_user_id", authUserId)
      .single();

    if (candidateData && !candidateError) {
      return {
        id: candidateData.id,
        email: candidateData.primaryContactEmail,
        full_name: candidateData.primaryContactName,
        agency_id: candidateData.agencyName,
        userType: 'candidate'
      };
    }

    // If not found in candidates, try hr_users table
    const { data: hrUserData, error: hrUserError } = await supabase
      .from("hr_users")
      .select("id, username, name")
      .eq("id", authUserId)
      .single();

    if (hrUserData && !hrUserError) {
      return {
        id: hrUserData.id,
        email: hrUserData.username,
        full_name: hrUserData.name,
        agency_id: null,
        userType: 'hr_user'
      };
    }

    // User not found in either table
    return null;
  } catch (error) {
    console.error("Error finding user in tables:", error);
    return null;
  }
};

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
    
    const userData = await findUserInTables(supabase, user.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        agency_id: userData.agency_id,
      },
    });
  } catch (err) {
    console.error("API: Verify token error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
