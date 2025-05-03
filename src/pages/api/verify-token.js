// pages/api/verify-token.js
import jwt from "jsonwebtoken";
import supabaseAdmin from "lib/supabaseAdmin";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user from database
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, role, agency_id")
      .eq("id", decoded.user_id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}
