// backend/src/controllers/sessionController.js
import supabase from "../utils/supabaseClient.js";

/**
 * Get all sessions for current user
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