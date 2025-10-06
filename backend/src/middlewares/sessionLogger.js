// backend/src/middlewares/sessionLogger.js
import supabase from "../utils/supabaseClient.js";

// Helper to parse user agent
const parseUserAgent = (userAgent) => {
  if (!userAgent) return { browser: 'Unknown', os: 'Unknown', deviceType: 'Unknown' };
  
  // Simple parsing (you can use 'ua-parser-js' library for better parsing)
  const browser = userAgent.includes('Chrome') ? 'Chrome' :
                 userAgent.includes('Firefox') ? 'Firefox' :
                 userAgent.includes('Safari') ? 'Safari' :
                 userAgent.includes('Edge') ? 'Edge' : 'Unknown';
  
  const os = userAgent.includes('Windows') ? 'Windows' :
            userAgent.includes('Mac') ? 'macOS' :
            userAgent.includes('Linux') ? 'Linux' :
            userAgent.includes('Android') ? 'Android' :
            userAgent.includes('iOS') ? 'iOS' : 'Unknown';
  
  const deviceType = userAgent.includes('Mobile') ? 'mobile' :
                    userAgent.includes('Tablet') ? 'tablet' : 'desktop';
  
  return { browser, os, deviceType };
};

// Create or get active session
export const getOrCreateSession = async (userId, req) => {
  try {
    // Check for active session (within last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data: activeSession, error: fetchError } = await supabase
      .from('session_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gte('last_activity_at', thirtyMinutesAgo)
      .order('session_start', { ascending: false })
      .limit(1)
      .single();

    if (activeSession && !fetchError) {
      // Update last activity
      await supabase
        .from('session_logs')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', activeSession.id);
      
      return activeSession.id;
    }

    // Create new session
    const userAgent = req.headers['user-agent'] || '';
    const { browser, os, deviceType } = parseUserAgent(userAgent);
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const { data: newSession, error: createError } = await supabase
      .from('session_logs')
      .insert([{
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
        session_start: new Date().toISOString(),
        is_active: true
      }])
      .select()
      .single();

    if (createError) throw createError;
    
    return newSession.id;
  } catch (error) {
    console.error('Error managing session:', error);
    return null;
  }
};

// Log activity
export const logActivity = async (sessionId, activityType, details = {}) => {
  try {
    if (!sessionId) return;

    // Get current session
    const { data: session, error: fetchError } = await supabase
      .from('session_logs')
      .select('activities')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;

    const activities = session.activities || [];
    activities.push({
      type: activityType,
      timestamp: new Date().toISOString(),
      details
    });

    // Update session with new activity
    await supabase
      .from('session_logs')
      .update({
        activities,
        last_activity_at: new Date().toISOString()
      })
      .eq('id', sessionId);

  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// End session
export const endSession = async (userId) => {
  try {
    await supabase
      .from('session_logs')
      .update({
        session_end: new Date().toISOString(),
        is_active: false
      })
      .eq('user_id', userId)
      .eq('is_active', true);
  } catch (error) {
    console.error('Error ending session:', error);
  }
};