import supabase from "../utils/supabaseClient.js";

// ===========================================
// HELPER FUNCTION: Set dentist session for RLS
// ===========================================
async function setDentistSession(dentistId) {
  console.log(`Setting session variable app.current_dentist_id = ${dentistId}`);
  
  const { error } = await supabase.rpc('set_config', {
    setting_name: 'app.current_dentist_id',
    setting_value: dentistId,
    is_local: true
  });
  
  if (error) {
    console.error('Failed to set dentist session variable:', error);
    throw new Error(`Failed to set session variable: ${error.message}`);
  }
  
  console.log('✅ Dentist session variable set successfully');
}

// Get messages for a specific patient (using contact_id)
export async function getMessagesByContactId(dentistId, contactId) {
  try {
    console.log(`Fetching messages for contact: ${contactId}, dentist: ${dentistId}`);
    
    // Set dentist session for RLS
    await setDentistSession(dentistId);
    
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
    
    // Set dentist session for RLS
    await setDentistSession(dentistId);
    
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

    // Now we can query all messages at once (RLS will allow it)
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

// Create a new message
export async function createMessage(messageData) {
  try {
    // Add at the top of createMessage function
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Service Key (first 20 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));
    console.log(`Creating message: ${JSON.stringify(messageData)}`);
    
    // We need the dentist_id to set session. 
    // This should be passed in messageData or we can get it from the patient
    const { data: patient, error: patientError } = await supabase
      .from("user_profiles")
      .select("dentist_id")
      .eq("contact_id", messageData.contactId)
      .single();

    if (patientError) throw patientError;
    
    // Set dentist session for RLS
    await setDentistSession(patient.dentist_id);
    
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([{
        contact_id: messageData.contactId,
        message: messageData.content,
        sender: messageData.senderType, // 'user' or 'bot'
        channel: messageData.channelType, // 'webchat', 'sms', 'call'
        session_id: `dentist-${patient.dentist_id}-${Date.now()}`, // Generate session_id
        created_at: new Date().toISOString(),
        delivered: true
      }])
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
    // Set dentist session for RLS
    await setDentistSession(dentistId);
    
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

// Get unread message counts per patient (messages where sender='user')
export async function getUnreadCounts(dentistId) {
  try {
    console.log(`Fetching unread counts for dentist: ${dentistId}`);
    
    // Set dentist session for RLS
    await setDentistSession(dentistId);
    
    // First get all patients for this dentist
    const { data: patients, error: patientsError } = await supabase
      .from("user_profiles")
      .select("id, contact_id")
      .eq("dentist_id", dentistId);

    if (patientsError) throw patientsError;

    console.log(`Found patients: ${patients?.length || 0}`);

    const contactIds = patients.map(p => p.contact_id).filter(Boolean);

    if (contactIds.length === 0) {
      return {};
    }

    // Now we can query all at once (RLS will allow it)
    const { data, error } = await supabase
      .from("chat_messages")
      .select("contact_id")
      .in("contact_id", contactIds)
      .eq("sender", "user"); // user messages are the ones dentist needs to read

    if (error) {
      console.error('Error counting messages:', error);
      throw error;
    }
    
    // Group by contact_id and count
    const contactCounts = data?.reduce((acc, msg) => {
      acc[msg.contact_id] = (acc[msg.contact_id] || 0) + 1;
      return acc;
    }, {}) || {};
    
    console.log(`Unread counts by contact_id:`, contactCounts);
    
    // Convert contact_id counts to patient_id counts
    const patientCounts = {};
    patients.forEach(patient => {
      if (contactCounts[patient.contact_id]) {
        patientCounts[patient.id] = contactCounts[patient.contact_id];
      }
    });
    
    console.log(`Unread counts by patient_id:`, patientCounts);
    return patientCounts;
  } catch (error) {
    console.error('Error in getUnreadCounts:', error);
    throw error;
  }
}