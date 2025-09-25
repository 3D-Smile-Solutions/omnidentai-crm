// backend/src/controllers/authController.js
import supabase from "../utils/supabaseClient.js";

// Helper to set refresh cookie consistently
const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in prod
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/", // important so it's sent on all routes
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

// POST /auth/signup
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // bypass email verification
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // insert dentist profile
    const { error: profileError } = await supabase
      .from("client_profiles")
      .insert([{ id: authUser.user.id, first_name: firstName, last_name: lastName }]);

    if (profileError) return res.status(400).json({ error: profileError.message });

    res.json({ message: "Signup successful", userId: authUser.user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    // set refresh_token in HttpOnly cookie
    setRefreshCookie(res, data.session.refresh_token);

    res.json({
      message: "Login successful",
      session: { access_token: data.session.access_token },
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /auth/me
export const me = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) return res.json({ user: data.user });
    }

    // If no token OR expired, try using refresh_token cookie
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "Not authenticated" });

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return res.status(401).json({ error: error.message });

    // renew cookie
    setRefreshCookie(res, data.session.refresh_token);

    res.json({ user: data.user, access_token: data.session.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/logout
export const logout = async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.clearCookie("refresh_token", {
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/refresh
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "Missing refresh token" });

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return res.status(401).json({ error: error.message });

    // refresh cookie again
    setRefreshCookie(res, data.session.refresh_token);

    res.json({ access_token: data.session.access_token, user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
