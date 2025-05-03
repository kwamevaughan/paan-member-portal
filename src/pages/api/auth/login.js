import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import supabaseAdmin from "lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user || !user.is_active)
      return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await supabaseAdmin
      .from("users")
      .update({ last_login: new Date().toISOString(), last_ip: clientIp })
      .eq("id", user.id);

    const jwtSecret = process.env.JWT_SECRET;
    const secretKey = new TextEncoder().encode(jwtSecret);

    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretKey);

    const refreshToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.REFRESH_SECRET));

    res.setHeader("Set-Cookie", [
      `refresh_token=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${
        7 * 24 * 60 * 60
      }`,
    ]);


    return res.status(200).json({
      token: accessToken,
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
