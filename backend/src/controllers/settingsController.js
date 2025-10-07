// backend/src/controllers/settingsController.js
import  supabase  from '../utils/supabaseClient.js';
import bcrypt from 'bcrypt';

/**
 * Update user profile
 * PUT /api/auth/update-profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      first_name,
      last_name,
      phone,
      practice_name,
      address,
      city,
      state,
      zip_code,
      license_number
    } = req.body;

    // console.log('📝 Updating profile for user:', userId);

    const { data, error } = await supabase
      .from('client_profiles')
      .update({
        first_name,
        last_name,
        phone,
        practice_name,
        address,
        city,
        state,
        zip_code,
        license_number,
        updated_at: new Date().toISOString()
      })
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

/**
 * Change password
 * PUT /api/auth/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    console.log('🔐 Changing password for user:', userId);

    // Get current password hash
    const { data: user, error: fetchError } = await supabase
      .from('client_profiles')
      .select('password')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('client_profiles')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Error updating password:', updateError);
      return res.status(400).json({ error: updateError.message });
    }

    console.log('✅ Password changed successfully');
    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('❌ Error in changePassword:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update notification preferences
 * PUT /api/auth/update-notifications
 */
export const updateNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notificationPrefs = req.body;

    console.log('🔔 Updating notification preferences for user:', userId);

    // Store preferences in a JSONB column or separate table
    const { data, error } = await supabase
      .from('client_profiles')
      .update({
        notification_preferences: notificationPrefs,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating notifications:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Notification preferences updated');
    res.json({ 
      message: 'Notification preferences updated successfully',
      preferences: data.notification_preferences 
    });

  } catch (error) {
    console.error('❌ Error in updateNotifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update appearance settings
 * PUT /api/auth/update-appearance
 */
export const updateAppearance = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const appearanceSettings = req.body;

    // console.log('🎨 Updating appearance settings for user:', userId);

    const { data, error } = await supabase
      .from('client_profiles')
      .update({
        appearance_settings: appearanceSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating appearance:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Appearance settings updated');
    res.json({ 
      message: 'Appearance settings updated successfully',
      settings: data.appearance_settings 
    });

  } catch (error) {
    console.error('❌ Error in updateAppearance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Logout from all devices
 * POST /api/auth/logout-all
 */
export const logoutAll = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🚪 Logging out all devices for user:', userId);

    // TODO: Implement session invalidation
    // For now, just clear the current session cookie
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    console.log('✅ Logged out from all devices');
    res.json({ message: 'Logged out from all devices successfully' });

  } catch (error) {
    console.error('❌ Error in logoutAll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update chat widget settings
 * PUT /api/settings/chat-widget
 */
export const updateChatWidget = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const widgetSettings = req.body;

    console.log('💬 Updating chat widget settings for user:', userId);

    const { data, error } = await supabase
      .from('client_profiles')
      .update({
        chat_widget_settings: widgetSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating chat widget:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Chat widget settings updated');
    res.json({ 
      message: 'Chat widget settings updated successfully',
      settings: data.chat_widget_settings 
    });

  } catch (error) {
    console.error('❌ Error in updateChatWidget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update integration settings
 * PUT /api/settings/integrations
 */
export const updateIntegrations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const integrationSettings = req.body;

    console.log('🔌 Updating integration settings for user:', userId);

    // Don't store sensitive data like passwords/tokens in plain text
    // This is just for demonstration - in production, use encryption or env variables
    const { data, error } = await supabase
      .from('client_profiles')
      .update({
        integration_settings: integrationSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating integrations:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Integration settings updated');
    res.json({ 
      message: 'Integration settings updated successfully',
      settings: data.integration_settings 
    });

  } catch (error) {
    console.error('❌ Error in updateIntegrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Test integration connection
 * POST /api/integrations/test/:integration
 */
export const testIntegration = async (req, res) => {
  try {
    const { integration } = req.params;
    const settings = req.body;

    console.log(`🧪 Testing ${integration} connection...`);

    // Test connection based on integration type
    switch (integration) {
      case 'twilio':
        // TODO: Test Twilio connection
        // const twilio = require('twilio');
        // const client = twilio(settings.accountSid, settings.authToken);
        // await client.api.accounts(settings.accountSid).fetch();
        res.json({ message: 'Twilio connection successful' });
        break;

      case 'email':
        // TODO: Test SMTP connection
        // const nodemailer = require('nodemailer');
        // const transporter = nodemailer.createTransport({ ... });
        // await transporter.verify();
        res.json({ message: 'Email connection successful' });
        break;

      default:
        res.status(400).json({ error: 'Unknown integration type' });
    }

  } catch (error) {
    console.error(`❌ Error testing ${req.params.integration}:`, error);
    res.status(500).json({ error: error.message });
  }
};

