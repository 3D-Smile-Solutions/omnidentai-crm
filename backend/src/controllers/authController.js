import supabase from "../utils/supabaseClient.js";

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
      .insert([
        { id: authUser.user.id, first_name: firstName, last_name: lastName }
      ]);

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

    res.json({
      message: "Login successful",
      session: data.session,
      user: data.user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /auth/me
export const me = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: error.message });

    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/logout
export const logout = async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// refreshtoken
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "Missing refresh token" });

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return res.status(401).json({ error: error.message });

    // refresh cookie again
    res.cookie("refresh_token", data.session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ access_token: data.session.access_token, user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
