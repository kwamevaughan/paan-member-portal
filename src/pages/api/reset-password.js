import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY 
  );

  try {
    let firstName = "User";
    // Query candidates table
    const { data: candidateData, error: candidateError } = await supabaseAdmin
      .from("candidates")
      .select("primaryContactName")
      .eq("primaryContactEmail", email)
      .single();

    if (candidateData && !candidateError) {
      firstName = candidateData.primaryContactName?.split(" ")[0] || "User";
    } else {
      // Fallback to auth.users
      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.getUserByEmail(email);

      if (userData && !userError) {
        const metaData = userData.user?.user_metadata || {};
        firstName = metaData.full_name || metaData.name || "User";
        firstName = firstName.split(" ")[0] || "User";
      }
    }

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_BASE_URL_DEV
        : process.env.NEXT_PUBLIC_BASE_URL_PROD;
    const redirectTo = `${baseUrl}/reset-password`;

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo,
      data: { firstName },
    });

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("API: Password reset error:", error);
    return res.status(500).json({ error: error.message });
  }
}
