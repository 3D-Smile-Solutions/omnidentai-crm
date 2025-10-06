// backend/src/controllers/authController.js
import supabase from "../utils/supabaseClient.js";

// Helper to set refresh cookie consistently
const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

// POST /auth/signup
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) return res.status(400).json({ error: authError.message });

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

    // Fetch profile data from client_profiles
    const { data: profile, error: profileError } = await supabase
      .from("client_profiles")
      .select("id, first_name, last_name")
      .eq("id", data.user.id)
      .single();

    // Set refresh_token in HttpOnly cookie
    setRefreshCookie(res, data.session.refresh_token);

    res.json({
      message: "Login successful",
      session: { access_token: data.session.access_token },
      user: {
        ...data.user,
        first_name: profile?.first_name,
        last_name: profile?.last_name
      },
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
      if (!error && data?.user) {
        // Fetch profile data from client_profiles
        const { data: profile, error: profileError } = await supabase
          .from("client_profiles")
          .select("id, first_name, last_name")
          .eq("id", data.user.id)
          .single();

        if (!profileError && profile) {
          return res.json({ 
            user: { 
              ...data.user, 
              first_name: profile.first_name, 
              last_name: profile.last_name 
            } 
          });
        }
        return res.json({ user: data.user });
      }
    }

    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "Not authenticated" });

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return res.status(401).json({ error: error.message });

    setRefreshCookie(res, data.session.refresh_token);

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from("client_profiles")
      .select("id, first_name, last_name")
      .eq("id", data.user.id)
      .single();

    res.json({ 
      user: { 
        ...data.user, 
        first_name: profile?.first_name, 
        last_name: profile?.last_name 
      }, 
      access_token: data.session.access_token 
    });
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

    setRefreshCookie(res, data.session.refresh_token);

    res.json({ access_token: data.session.access_token, user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================================
// NEW: Settings endpoints
// ========================================

// PUT /auth/update-profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { first_name, last_name } = req.body;

    console.log('📝 Updating profile for user:', userId);

    const { data, error } = await supabase
      .from('client_profiles')
      .update({ first_name, last_name })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating profile:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Profile updated successfully');
    res.json({ 
      message: 'Profile updated successfully',
      user: data 
    });

  } catch (error) {
    console.error('❌ Error in updateProfile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /auth/change-password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    console.log('🔐 Changing password for user:', userId);

    // Update password using Supabase Admin API
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (error) {
      console.error('❌ Error updating password:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Password changed successfully');
    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('❌ Error in changePassword:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};