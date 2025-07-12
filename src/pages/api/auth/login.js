import { createClient } from "@supabase/supabase-js";

// Helper function to find user in either candidates or hr_users table
const findUserInTables = async (supabase, authUserId) => {
  try {
    // First, try to find user in candidates table
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .select(
        "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id"
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("API: Supabase auth error:", authError);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Fetch user data from either candidates or hr_users table
    const userData = await findUserInTables(supabase, authData.user.id);

    if (!userData) {
      console.error("API: User not found in either table");
      return res.status(401).json({ error: "No account found for this email" });
    }

    // Update last login only for candidates (hr_users don't have this field)
    if (userData.userType === 'candidate') {
      const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await supabase
        .from("candidates")
        .update({ last_login: new Date().toISOString(), last_ip: clientIp })
        .eq("auth_user_id", authData.user.id);
    }

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        agency_id: userData.agency_id,
      },
    });
  } catch (error) {
    console.error("API: Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
