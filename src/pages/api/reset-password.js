import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_KEY
    ) {
      throw new Error(
        "Supabase configuration missing: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set"
      );
    }

    let firstName = "User";
    
    // First, try to find user in candidates table
    const { data: candidateData, error: candidateError } = await supabaseAdmin
      .from("candidates")
      .select("primaryContactName")
      .eq("primaryContactEmail", email)
      .single();

    if (candidateData && !candidateError) {
      console.log("API: Found candidate:", candidateData);
      firstName = candidateData.primaryContactName?.split(" ")[0] || "User";
    } else {
      console.log("API: Candidate not found, checking hr_users table");
      
      // If not found in candidates, try hr_users table
      const { data: hrUserData, error: hrUserError } = await supabaseAdmin
        .from("hr_users")
        .select("name")
        .eq("username", email)
        .single();

      if (hrUserData && !hrUserError) {
        console.log("API: Found HR user:", hrUserData);
        firstName = hrUserData.name?.split(" ")[0] || "User";
      } else {
        console.log("API: HR user not found, falling back to auth.users");
        // Fallback to auth.users
        const { data: userData, error: userError } =
          await supabaseAdmin.auth.admin.getUserByEmail(email);
        if (userData?.user && !userError) {
          console.log("API: Found auth user:", userData.user.user_metadata);
          const metaData = userData.user.user_metadata || {};
          firstName = metaData.full_name || metaData.name || "User";
          firstName = firstName.split(" ")[0] || "User";
        } else {
          console.log("API: Auth user error:", userError?.message);
        }
      }
    }

    console.log("API: Sending reset email with firstName:", firstName);

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_BASE_URL_DEV
        : process.env.NEXT_PUBLIC_BASE_URL_PROD;
    const redirectTo = `${baseUrl}/reset-password?email=${encodeURIComponent(
      email
    )}`;

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo,
      data: { firstName },
    });

    if (error) {
      console.error("API: Password reset error:", error);
      throw new Error(error.message);
    }

    console.log(`API: Successfully sent password reset email to ${email}`);
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("API: Password reset error:", error);
    return res.status(500).json({ error: error.message });
  }
}
