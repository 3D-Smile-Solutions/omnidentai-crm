// backend/src/controllers/sessionController.js
import supabase from "../utils/supabaseClient.js";
import { logActivity as logActivityHelper } from '../middlewares/sessionLogger.js';

/**
 * Get all sessions for current user (session history)
 * GET /auth/session-history
 */
export const getSessionHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('📊 Fetching session history for user:', userId);

    const { data: sessions, error } = await supabase
      .from('session_logs')
      .select('*')
      .eq('user_id', userId)
      .order('session_start', { ascending: false });

    if (error) {
      console.error('❌ Error fetching sessions:', error);
      return res.status(400).json({ error: error.message });
    }

    // Transform data to match frontend expectations
    const transformedSessions = sessions.map(session => {
      const start = new Date(session.session_start);
      const end = session.session_end ? new Date(session.session_end) : new Date();
      const durationMinutes = Math.round((end - start) / 1000 / 60);

      return {
        id: session.id,
        user_id: session.user_id,
        login_time: session.session_start,
        logout_time: session.session_end,
        is_active: session.is_active,
        ip_address: session.ip_address,
        user_agent: session.user_agent,
        browser: session.browser,
        device_type: session.device_type,
        os: session.os,
        duration_minutes: durationMinutes,
        activities: session.activities || [],
        created_at: session.session_start
      };
    });

    console.log(`✅ Fetched ${transformedSessions.length} sessions`);

    res.json({
      success: true,
      sessions: transformedSessions
    });

  } catch (error) {
    console.error('❌ Get session history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * Get all sessions (legacy endpoint - keep for compatibility)
 * GET /auth/sessions
 */
export const getSessions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: sessions, error } = await supabase
      .from('session_logs')
      .select('*')
      .eq('user_id', userId)
      .order('session_start', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(400).json({ error: error.message });
    }

    // Calculate session durations
    const sessionsWithDuration = sessions.map(session => {
      const start = new Date(session.session_start);
      const end = session.session_end ? new Date(session.session_end) : new Date();
      const durationMinutes = Math.round((end - start) / 1000 / 60);

      return {
        ...session,
        duration_minutes: durationMinutes,
        activities_count: session.activities?.length || 0
      };
    });

    res.json({ sessions: sessionsWithDuration });

  } catch (error) {
    console.error('Error in getSessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get specific session details
 * GET /auth/sessions/:sessionId
 */
export const getSessionDetails = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: session, error } = await supabase
      .from('session_logs')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });

  } catch (error) {
    console.error('Error in getSessionDetails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Log an activity for the current session
 * POST /auth/log-activity
 */
export const logActivity = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionId, activityType, details } = req.body;

    console.log('📝 Logging activity:', { userId, sessionId, activityType });

    if (!sessionId || !activityType) {
      return res.status(400).json({
        success: false,
        message: 'sessionId and activityType are required'
      });
    }

    // Use the helper function from sessionLogger
    await logActivityHelper(sessionId, activityType, details);

    console.log('✅ Activity logged successfully');

    res.json({
      success: true,
      message: 'Activity logged successfully'
    });

  } catch (error) {
    console.error('❌ Log activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log activity',
      error: error.message
    });
  }
};

/**
 * Logout from all devices
 * POST /auth/logout-all
 */
export const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🚪 Logging out all devices for user:', userId);

    // Update all active sessions to inactive
    const { data, error } = await supabase
      .from('session_logs')
      .update({
        is_active: false,
        session_end: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_active', true)
      .select();

    if (error) {
      console.error('❌ Error logging out all devices:', error);
      throw error;
    }

    // console.log(`✅ Logged out from ${data?.length || 0} devices`);

    res.json({
      success: true,
      message: 'Logged out from all devices',
      sessionsEnded: data?.length || 0
    });

  } catch (error) {
    console.error('❌ Logout all devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout from all devices',
      error: error.message
    });
  }
};

/**
 * Logout from a specific session
 * POST /auth/logout-session/:sessionId
 */
export const logoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionId } = req.params;

    // console.log('🚪 Logging out session:', sessionId);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId is required'
      });
    }

    // Update specific session to inactive
    const { data, error } = await supabase
      .from('session_logs')
      .update({
        is_active: false,
        session_end: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', userId) // Security: ensure user owns this session
      .select()
      .single();

    if (error) {
      console.error('❌ Error logging out session:', error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or already ended'
      });
    }

    console.log('✅ Session logged out successfully');

    res.json({
      success: true,
      message: 'Session ended successfully',
      session: data
    });

  } catch (error) {
    console.error('❌ Logout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout session',
      error: error.message
    });
  }
};