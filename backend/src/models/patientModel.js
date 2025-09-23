// patientModel.js
import supabase  from "../utils/supabaseClient.js";

// Fetch patients for the logged-in dentist
export async function getPatientsByDentist(dentistId) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, first_name, last_name, created_at")
    .eq("dentist_id", dentistId); // assumes user_profiles has dentist_id FK

  if (error) throw error;
  return data;
}
