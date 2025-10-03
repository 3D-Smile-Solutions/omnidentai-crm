// backend/src/models/patientModel.js
import supabase from "../utils/supabaseClient.js";

export async function getPatientsByDentist(dentistId) {
  try {
    // console.log('==========================================');
    // console.log('🔍 getPatientsByDentist called');
    // console.log(`Dentist ID: ${dentistId}`);

    // Fetch patients with ALL necessary fields
    const { data: patients, error: patientsError } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, email, contact_id, created_at")
      .eq("dentist_id", dentistId);

    if (patientsError) {
      console.error('❌ Error fetching patients:', patientsError);
      throw patientsError;
    }

    if (!patients || patients.length === 0) {
      console.log('⚠️ No patients found');
      return [];
    }

    console.log(`✅ Found ${patients.length} patients`);
    console.log('Sample patient:', {
      id: patients[0].id,
      name: `${patients[0].first_name} ${patients[0].last_name}`,
      contact_id: patients[0].contact_id
    });

    // Fetch last messages for all patients
    const patientsWithLastMessage = await Promise.all(
      patients.map(async (patient) => {
        if (!patient.contact_id) {
          console.log(`⚠️ Patient ${patient.first_name} has no contact_id`);
          return {
            ...patient,
            lastMessage: null,
            lastMessageTime: null,
            lastMessageChannel: null
          };
        }

        try {
          const { data: lastMsg, error: msgError } = await supabase
            .from("chat_messages")
            .select("message, created_at, channel")
            .eq("contact_id", patient.contact_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (msgError) {
            console.error(`Error fetching message for ${patient.contact_id}:`, msgError);
          }

          if (lastMsg) {
            console.log(`✅ ${patient.first_name}: "${lastMsg.message.substring(0, 30)}..."`);
          } else {
            console.log(`ℹ️ ${patient.first_name}: No messages`);
          }

          return {
            ...patient,
            lastMessage: lastMsg?.message || null,
            lastMessageTime: lastMsg?.created_at || null,
            lastMessageChannel: lastMsg?.channel || null
          };
        } catch (err) {
          console.error(`Exception for ${patient.first_name}:`, err);
          return {
            ...patient,
            lastMessage: null,
            lastMessageTime: null,
            lastMessageChannel: null
          };
        }
      })
    );

    // console.log('✅ Returning patients with last messages');
    // console.log('Sample result:', {
    //   id: patientsWithLastMessage[0].id,
    //   name: `${patientsWithLastMessage[0].first_name} ${patientsWithLastMessage[0].last_name}`,
    //   lastMessage: patientsWithLastMessage[0].lastMessage?.substring(0, 30) || 'none',
    //   lastMessageTime: patientsWithLastMessage[0].lastMessageTime
    // });
    // console.log('==========================================\n');

    return patientsWithLastMessage;

  } catch (error) {
    console.error("❌ Fatal error in getPatientsByDentist:", error);
    throw error;
  }
}