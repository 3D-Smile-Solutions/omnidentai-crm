// patientController.js
import { getPatientsByDentist } from "../models/patientModel.js";
export async function getPatients(req, res) {
  try {
    const dentistId = req.user?.id; // now populated by Supabase middleware
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const patients = await getPatientsByDentist(dentistId);
    res.json({ patients });
  } catch (err) {
    console.error("Error fetching patients:", err.message);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
}
