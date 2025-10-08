// backend/src/models/messageModel.js
// Production-ready with proper field handling

import supabase from "../utils/supabaseClient.js";

// ===========================================
// MESSAGE OPERATIONS (Service Key = No RLS restrictions)
// ===========================================

// Get messages for a specific patient (CRM dashboard)
export async function getMessagesByContactId(dentistId, contactId) {
  try {
    console.log(`Fetching messages for contact: ${contactId}, dentist: ${dentistId}`);
    
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        id,
        message,
        sender,
        channel,
        created_at,
        contact_id
      `)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} messages`);
    return data || [];
  } catch (error) {
    console.error('Error in getMessagesByContactId:', error);
    throw error;
  }
}

// Get all messages for a dentist (grouped by contact_id/patient)
export async function getAllMessagesForDentist(dentistId) {
  try {
    console.log(`Fetching all messages for dentist: ${dentistId}`);
    
    // First get all patients for this dentist
    const { data: patients, error: patientsError } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, contact_id")
      .eq("dentist_id", dentistId);

    if (patientsError) throw patientsError;

    // Get contact_ids for these patients
    const contactIds = patients.map(p => p.contact_id).filter(Boolean);

    if (contactIds.length === 0) {
      return [];
    }

    // Query all messages for these contacts
    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select(`
        id,
        message,
        sender,
        channel,
        created_at,
        contact_id
      `)
      .in("contact_id", contactIds)
      .order("created_at", { ascending: false });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw messagesError;
    }

    // Combine patients and messages
    return messages?.map(msg => {
      const patient = patients.find(p => p.contact_id === msg.contact_id);
      return {
        ...msg,
        user_profiles: patient || { first_name: 'Unknown', last_name: 'Patient' }
      };
    }) || [];
  } catch (error) {
    console.error('Error in getAllMessagesForDentist:', error);
    throw error;
  }
}

// Create a new message (CRM dashboard) - PROPER FIELD HANDLING
export async function createMessage(messageData) {
  try {
    console.log(`Creating message: ${JSON.stringify(messageData)}`);
    
    const insertData = {
      contact_id: messageData.contactId,
      message: messageData.content,
      sender: 'client', 
      channel: messageData.channelType || 'webchat', // ✅ FIXED: Now uses channelType parameter
      // FIXED: Match chat widget session_id format
      session_id: `${messageData.contactId}_session_${Date.now()}`,
      created_at: new Date().toISOString(),
      delivered: true
    };
    
    console.log('Insert data:', insertData);
    
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([insertData])
      .select(`
        id,
        message,
        sender,
        channel,
        created_at,
        contact_id
      `)
      .single();

    if (error) {
      console.error('Error creating message:', error);
      throw error;
    }
    
    console.log('✅ Message created successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Error in createMessage:', error);
    throw error;
  }
}

// Get patient by contact_id
export async function getPatientByContactId(contactId, dentistId) {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, contact_id")
      .eq("contact_id", contactId)
      .eq("dentist_id", dentistId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getPatientByContactId:', error);
    throw error;
  }
}

// Get unread message counts per patient
export async function getUnreadCounts(dentistId) {
  try {
    // console.log(`Fetching unread counts for dentist: ${dentistId}`);
    
    // First get all patients for this dentist
    const { data: patients, error: patientsError } = await supabase
      .from("user_profiles")
      .select("id, contact_id")
      .eq("dentist_id", dentistId);

    if (patientsError) throw patientsError;

    // console.log(`Found patients: ${patients?.length || 0}`);

    const contactIds = patients.map(p => p.contact_id).filter(Boolean);

    if (contactIds.length === 0) {
      return {};
    }

    // Query unread messages for all patients
    // Only count 'user' messages as unread (messages FROM patients TO dentist)
    const { data, error } = await supabase
      .from("chat_messages")
      .select("contact_id")
      .in("contact_id", contactIds)
      .eq("sender", "user"); // Only patient messages are "unread" for dentist

    if (error) {
      console.error('Error counting messages:', error);
      throw error;
    }
    
    // Group by contact_id and count
    const contactCounts = data?.reduce((acc, msg) => {
      acc[msg.contact_id] = (acc[msg.contact_id] || 0) + 1;
      return acc;
    }, {}) || {};
    
    // console.log(`Unread counts by contact_id:`, contactCounts);
    
    // Convert contact_id counts to patient_id counts
    const patientCounts = {};
    patients.forEach(patient => {
      if (contactCounts[patient.contact_id]) {
        patientCounts[patient.id] = contactCounts[patient.contact_id];
      }
    });
    
    // console.log(`Unread counts by patient_id:`, patientCounts);
    return patientCounts;
  } catch (error) {
    console.error('Error in getUnreadCounts:', error);
    throw error;
  }
}

// ===========================================
// CHAT WIDGET FUNCTIONS (for reference)
// These would be used by your chat widget with session variables
// ===========================================

// Set contact session for chat widget (patients)
export async function setContactSessionForWidget(contactId) {
  try {
    console.log(`Setting contact session for widget: ${contactId}`);
    
    const { error } = await supabase.rpc('set_contact_session', contactId);
    
    if (error) {
      console.error('Failed to set contact session:', error);
      throw new Error(`Failed to set contact session: ${error.message}`);
    }
    
    console.log('✅ Contact session set successfully');
  } catch (error) {
    console.error('Error in setContactSessionForWidget:', error);
    throw error;
  }
}

// Create message from chat widget (patients)
export async function createMessageFromWidget(contactId, messageContent, senderType = 'user', channel = 'webchat') {
  try {
    console.log(`Creating widget message for contact: ${contactId}`);
    
    // Set contact session for RLS
    await setContactSessionForWidget(contactId);
    
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([{
        contact_id: contactId,
        message: messageContent,
        sender: senderType,
        channel: channel,
        session_id: `widget-${contactId}-${Date.now()}`,
        created_at: new Date().toISOString(),
        delivered: true
      }])
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Widget message created successfully');
    return data;
  } catch (error) {
    console.error('Error in createMessageFromWidget:', error);
    throw error;
  }
}