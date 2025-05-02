// src/pages/api/auth/login.js
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // ✅ ESM import required for jose
import supabaseAdmin from "lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch user by email
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "Account is disabled" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last_login and last_ip
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await supabaseAdmin
      .from("users")
      .update({
        last_login: new Date().toISOString(),
        last_ip: clientIp,
      })
      .eq("id", user.id);

    // Generate JWT token using jose
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const secretKey = new TextEncoder().encode(jwtSecret);

    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretKey);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        agency_id: user.agency_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
