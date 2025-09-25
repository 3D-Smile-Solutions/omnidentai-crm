import supabase from "../utils/supabaseClient.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    // 1) If client sent access token in header -> validate it
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        req.user = data.user;
        req.access_token = token;
        return next();
      }
      // otherwise fallthrough to cookie attempt
    }

    // 2) Try refresh token cookie (HttpOnly)
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data?.session) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    // Renew cookie (use secure:true in production)
    res.cookie("refresh_token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    req.user = data.user;
    req.access_token = data.session.access_token;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
