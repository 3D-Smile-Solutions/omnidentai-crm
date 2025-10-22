// backend/src/models/conversationControlModel.js

import supabase from "../utils/supabaseClient.js";

// Get conversation control status
export async function getConversationControl(contactId) {
  try {
    const { data, error } = await supabase
      .from("conversation_control")
      .select("*")
      .eq("contact_id", contactId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      throw error;
    }

    return data; // Returns null if not found
  } catch (error) {
    console.error('Error getting conversation control:', error);
    throw error;
  }
}

// Pause bot (dentist takes over)
export async function pauseBot(contactId, dentistId, reason = 'manual_intervention') {
  try {
    const { data, error } = await supabase
      .from("conversation_control")
      .upsert({
        contact_id: contactId,
        dentist_id: dentistId,
        bot_paused: true,
        paused_at: new Date().toISOString(),
        paused_by: dentistId,
        pause_reason: reason,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'contact_id'
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Bot paused for contact ${contactId}`);
    return data;
  } catch (error) {
    console.error('Error pausing bot:', error);
    throw error;
  }
}

// Resume bot (bot takes over)
export async function resumeBot(contactId, dentistId) {
  try {
    const { data, error } = await supabase
      .from("conversation_control")
      .upsert({
        contact_id: contactId,
        dentist_id: dentistId,
        bot_paused: false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'contact_id'
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Bot resumed for contact ${contactId}`);
    return data;
  } catch (error) {
    console.error('Error resuming bot:', error);
    throw error;
  }
}

// Check if bot should respond
export async function shouldBotRespond(contactId) {
  try {
    const control = await getConversationControl(contactId);
    
    // If no control record exists, bot should respond by default
    if (!control) return true;
    
    // If bot is paused, it should NOT respond
    return !control.bot_paused;
  } catch (error) {
    console.error('Error checking if bot should respond:', error);
    // Default to allowing bot to respond on error
    return true;
  }
}

// Update last bot response time
export async function updateBotResponseTime(contactId, dentistId) {
  try {
    const { error } = await supabase
      .from("conversation_control")
      .upsert({
        contact_id: contactId,
        dentist_id: dentistId,
        last_bot_response_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'contact_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating bot response time:', error);
  }
}

// Update last dentist response time
export async function updateDentistResponseTime(contactId, dentistId) {
  try {
    const { error } = await supabase
      .from("conversation_control")
      .upsert({
        contact_id: contactId,
        dentist_id: dentistId,
        last_dentist_response_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'contact_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating dentist response time:', error);
  }
}