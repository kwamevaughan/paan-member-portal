import jwt from "jsonwebtoken";
import supabaseAdmin from "lib/supabaseAdmin";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("🔐 /api/verify-token endpoint was called");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("user_id, email, full_name, role, partner_id")
      .eq("email", decoded.email) // Use .eq("user_id", decoded.user_id) if JWT includes user_id
      .single();

    if (error || !user) {
      console.error("Supabase error:", error);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User fetched:", user);
    // Map user_id to id and partner_id to agency_id for compatibility
    res.status(200).json({
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        agency_id: user.partner_id,
      },
    });
  } catch (err) {
    console.error("Token verification error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
}
