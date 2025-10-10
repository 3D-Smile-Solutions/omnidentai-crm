// backend/controllers/metricsController.js
import supabase from '../utils/supabaseClient.js';

/**
 * Get overview metrics for dashboard - Each column gets its own visualization
 * GET /api/metrics/overview
 */
export async function getOverviewMetrics(req, res) {
  try {
    const clientId = req.user.id;

    console.log('📊 Fetching column-based metrics for client:', clientId);

    // TEMPORARY FIX: Fetch ALL conversation metrics (remove client_id filter)
    // TODO: Once you populate client_id in conversation_metrics table, add back: .eq('client_id', clientId)
    const { data: metrics, error } = await supabase
      .from('conversation_metrics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching metrics:', error);
      return res.status(500).json({ error: 'Failed to fetch metrics' });
    }

    console.log(`✅ Fetched ${metrics.length} conversation records`);

    // If no data, return empty structure
    if (metrics.length === 0) {
      console.log('⚠️ No metrics found in database');
      return res.json({
        summary: {
          totalConversations: 0,
          totalBookings: 0,
          totalRevenue: 0,
          avgSessionDuration: 0
        },
        charts: {
          appointmentBooked: [],
          appointmentType: [],
          treatmentPlan: [],
          caseAccepted: [],
          patientType: [],
          conversationChannel: [],
          aiHandled: [],
          humanHandoff: [],
          conversationResolved: [],
          insuranceMentioned: [],
          insuranceProvider: [],
          paymentPlan: [],
          procedurePrimary: [],
          bookingOutcome: [],
          monthlyRevenue: [],
          avgMessagesByChannel: []
        }
      });
    }

    // ========== SUMMARY CARDS ==========
    const totalConversations = metrics.length;
    const totalBookings = metrics.filter(m => m.appointment_booked === true).length;
    const totalRevenue = metrics.reduce((sum, m) => sum + (parseFloat(m.estimated_value) || 0), 0);
    const avgSessionDuration = metrics.filter(m => m.session_duration_minutes)
      .reduce((sum, m) => sum + m.session_duration_minutes, 0) / 
      metrics.filter(m => m.session_duration_minutes).length || 0;

    console.log('📊 Summary calculated:', { totalConversations, totalBookings, totalRevenue: Math.round(totalRevenue) });

    // ========== 1. APPOINTMENT_BOOKED (Pie Chart) ==========
    const appointmentBookedData = [
      { name: 'Booked', value: metrics.filter(m => m.appointment_booked === true).length },
      { name: 'Not Booked', value: metrics.filter(m => m.appointment_booked === false).length }
    ];

    // ========== 2. APPOINTMENT_TYPE (Bar Chart) ==========
    const appointmentTypeMap = {};
    metrics.forEach(m => {
      if (m.appointment_type) {
        const type = m.appointment_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        appointmentTypeMap[type] = (appointmentTypeMap[type] || 0) + 1;
      }
    });
    const appointmentTypeData = Object.entries(appointmentTypeMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // ========== 3. TREATMENT_PLAN_PRESENTED (Pie Chart) ==========
    const treatmentPlanData = [
      { name: 'Presented', value: metrics.filter(m => m.treatment_plan_presented === true).length },
      { name: 'Not Presented', value: metrics.filter(m => m.treatment_plan_presented === false).length }
    ];

    // ========== 4. CASE_ACCEPTED (Pie Chart) ==========
    const caseAcceptedMap = {};
    metrics.forEach(m => {
      const status = m.case_accepted || 'Not Specified';
      caseAcceptedMap[status] = (caseAcceptedMap[status] || 0) + 1;
    });
    const caseAcceptedData = Object.entries(caseAcceptedMap)
      .map(([name, count]) => ({ 
        name: typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name, 
        value: count
      }));

    // ========== 5. PATIENT_TYPE (Pie Chart) ==========
    const patientTypeMap = {};
    metrics.forEach(m => {
      if (m.patient_type) {
        const type = m.patient_type.charAt(0).toUpperCase() + m.patient_type.slice(1);
        patientTypeMap[type] = (patientTypeMap[type] || 0) + 1;
      }
    });
    const patientTypeData = Object.entries(patientTypeMap)
      .map(([name, value]) => ({ name, value }));

    // ========== 6. CONVERSATION_CHANNEL (Bar Chart) ==========
    const channelMap = {};
    metrics.forEach(m => {
      if (m.conversation_channel) {
        const channel = m.conversation_channel.charAt(0).toUpperCase() + m.conversation_channel.slice(1);
        channelMap[channel] = (channelMap[channel] || 0) + 1;
      }
    });
    const conversationChannelData = Object.entries(channelMap)
      .map(([channel, count]) => ({ channel, count }));

    // ========== 7. AI_HANDLED (Pie Chart) ==========
    const aiHandledData = [
      { name: 'AI Handled', value: metrics.filter(m => m.ai_handled === true).length },
      { name: 'Manual', value: metrics.filter(m => m.ai_handled === false).length }
    ];

    // ========== 8. HUMAN_HANDOFF (Pie Chart) ==========
    const humanHandoffData = [
      { name: 'Handed Off', value: metrics.filter(m => m.human_handoff === true).length },
      { name: 'No Handoff', value: metrics.filter(m => m.human_handoff === false).length }
    ];

    // ========== 9. CONVERSATION_RESOLVED (Pie Chart) ==========
    const conversationResolvedData = [
      { name: 'Resolved', value: metrics.filter(m => m.conversation_resolved === true).length },
      { name: 'Unresolved', value: metrics.filter(m => m.conversation_resolved === false).length }
    ];

    // ========== 10. INSURANCE_MENTIONED (Pie Chart) ==========
    const insuranceMentionedData = [
      { name: 'Mentioned', value: metrics.filter(m => m.insurance_mentioned === true).length },
      { name: 'Not Mentioned', value: metrics.filter(m => m.insurance_mentioned === false).length }
    ];

    // ========== 11. INSURANCE_PROVIDER (Bar Chart) ==========
    const insuranceProviderMap = {};
    metrics.forEach(m => {
      if (m.insurance_provider) {
        insuranceProviderMap[m.insurance_provider] = (insuranceProviderMap[m.insurance_provider] || 0) + 1;
      }
    });
    const insuranceProviderData = Object.entries(insuranceProviderMap)
      .map(([provider, count]) => ({ provider, count }))
      .sort((a, b) => b.count - a.count);

    // ========== 12. PAYMENT_PLAN_DISCUSSED (Pie Chart) ==========
    const paymentPlanData = [
      { name: 'Discussed', value: metrics.filter(m => m.payment_plan_discussed === true).length },
      { name: 'Not Discussed', value: metrics.filter(m => m.payment_plan_discussed === false).length }
    ];

    // ========== 13. PROCEDURE_PRIMARY (Bar Chart) ==========
    const procedureMap = {};
    metrics.forEach(m => {
      if (m.procedure_primary) {
        const procedure = m.procedure_primary.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        procedureMap[procedure] = (procedureMap[procedure] || 0) + 1;
      }
    });
    const procedurePrimaryData = Object.entries(procedureMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10

    // ========== 14. BOOKING_OUTCOME (Bar Chart) ==========
    const bookingOutcomeMap = {};
    metrics.forEach(m => {
      if (m.booking_outcome) {
        bookingOutcomeMap[m.booking_outcome] = (bookingOutcomeMap[m.booking_outcome] || 0) + 1;
      }
    });
    const bookingOutcomeData = Object.entries(bookingOutcomeMap)
      .map(([outcome, count]) => ({ outcome, count }));

    // ========== 15. MONTHLY REVENUE TREND (Line Chart) ==========
    const monthlyRevenueMap = {};
    metrics.forEach(m => {
      if (m.created_at && m.estimated_value) {
        const month = new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + parseFloat(m.estimated_value);
      }
    });
    const monthlyRevenueData = Object.entries(monthlyRevenueMap)
      .map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // ========== 16. AVERAGE MESSAGES PER CONVERSATION (by channel) ==========
    const avgMessagesByChannel = {};
    const channelCounts = {};
    metrics.forEach(m => {
      const channel = m.conversation_channel || 'unknown';
      avgMessagesByChannel[channel] = (avgMessagesByChannel[channel] || 0) + (m.total_messages || 0);
      channelCounts[channel] = (channelCounts[channel] || 0) + 1;
    });
    const avgMessagesData = Object.entries(avgMessagesByChannel)
      .map(([channel, total]) => ({
        channel: channel.charAt(0).toUpperCase() + channel.slice(1),
        avgMessages: Math.round((total / channelCounts[channel]) * 10) / 10
      }));

    // Response
    const response = {
      summary: {
        totalConversations,
        totalBookings,
        totalRevenue: Math.round(totalRevenue),
        avgSessionDuration: Math.round(avgSessionDuration * 10) / 10
      },
      charts: {
        appointmentBooked: appointmentBookedData,
        appointmentType: appointmentTypeData,
        treatmentPlan: treatmentPlanData,
        caseAccepted: caseAcceptedData,
        patientType: patientTypeData,
        conversationChannel: conversationChannelData,
        aiHandled: aiHandledData,
        humanHandoff: humanHandoffData,
        conversationResolved: conversationResolvedData,
        insuranceMentioned: insuranceMentionedData,
        insuranceProvider: insuranceProviderData,
        paymentPlan: paymentPlanData,
        procedurePrimary: procedurePrimaryData,
        bookingOutcome: bookingOutcomeData,
        monthlyRevenue: monthlyRevenueData,
        avgMessagesByChannel: avgMessagesData
      }
    };

    console.log('✅ Successfully calculated column-based metrics');
    console.log('📊 Sample data:', {
      appointmentTypes: appointmentTypeData.length,
      procedures: procedurePrimaryData.length,
      monthlyRevenue: monthlyRevenueData.length
    });
    
    res.json(response);

  } catch (error) {
    console.error('❌ Error in getOverviewMetrics:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
/**
 * Get patient distribution map data
 * GET /api/metrics/patient-map
 */
export async function getPatientMapData(req, res) {
  try {
    const dentistId = req.user?.id;
    
    if (!dentistId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🗺️ Fetching patient map data for dentist:', dentistId);

    // Get patients with location data
    const { data: patients, error: patientsError } = await supabase
      .from('user_profiles')
      .select('id, contact_id, latitude, longitude, zip_code')
      .eq('dentist_id', dentistId)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (patientsError) {
      console.error('❌ Error fetching patients:', patientsError);
      throw patientsError;
    }

    if (!patients || patients.length === 0) {
      return res.json({
        locations: [],
        procedure_summary: [],
        total_patients: 0,
        total_states: 0,
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4
      });
    }

    // Get conversation metrics for these patients
    const contactIds = patients.map(p => p.contact_id).filter(Boolean);
    
    const { data: metrics, error: metricsError } = await supabase
      .from('conversation_metrics')
      .select('contact_id, procedures_discussed, procedure_primary')
      .in('contact_id', contactIds);

    if (metricsError) {
      console.error('❌ Error fetching metrics:', metricsError);
    }

    // Build map: contact_id -> procedures
    const procedureMap = {};
    (metrics || []).forEach(m => {
      if (!procedureMap[m.contact_id]) {
        procedureMap[m.contact_id] = [];
      }
      
      // Add primary procedure
      if (m.procedure_primary) {
        procedureMap[m.contact_id].push(m.procedure_primary);
      }
      
      // Add discussed procedures
      if (Array.isArray(m.procedures_discussed)) {
        procedureMap[m.contact_id].push(...m.procedures_discussed);
      }
    });

    // Normalize procedure names
    const normalizeProcedure = (proc) => {
      const lower = proc.toLowerCase().trim();
      if (lower.includes('clean')) return 'Cleanings';
      if (lower.includes('fill')) return 'Fillings';
      if (lower.includes('crown')) return 'Crowns';
      if (lower.includes('root canal')) return 'Root Canals';
      if (lower.includes('implant')) return 'Implants';
      if (lower.includes('whiten')) return 'Whitening';
      if (lower.includes('ortho') || lower.includes('brace')) return 'Orthodontics';
      if (lower.includes('extract')) return 'Extractions';
      if (lower.includes('denture')) return 'Dentures';
      return 'Other';
    };

    // Group patients by location (rounded lat/lng for clustering)
    const locationGroups = {};
    
    patients.forEach(patient => {
      const lat = parseFloat(patient.latitude);
      const lng = parseFloat(patient.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      // Round coordinates to 2 decimal places for grouping nearby patients
      const roundedLat = Math.round(lat * 100) / 100;
      const roundedLng = Math.round(lng * 100) / 100;
      const locationKey = `${roundedLat},${roundedLng}`;

      if (!locationGroups[locationKey]) {
        locationGroups[locationKey] = {
          lat: roundedLat,
          lng: roundedLng,
          zip_code: patient.zip_code,
          patients: [],
          procedures: {}
        };
      }

      locationGroups[locationKey].patients.push(patient.id);

      // Count procedures for this location
      const patientProcedures = procedureMap[patient.contact_id] || [];
      patientProcedures.forEach(proc => {
        const normalized = normalizeProcedure(proc);
        locationGroups[locationKey].procedures[normalized] = 
          (locationGroups[locationKey].procedures[normalized] || 0) + 1;
      });
    });

    // Convert to array and add top procedure
    const locations = Object.values(locationGroups).map((loc, index) => {
      const procedureEntries = Object.entries(loc.procedures);
      const topProcedure = procedureEntries.length > 0
        ? procedureEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : 'Other';

      return {
        id: index,
        lat: loc.lat,
        lng: loc.lng,
        zip_code: loc.zip_code,
        city: '', // Could enhance with reverse geocoding
        state: '', // Could enhance with reverse geocoding
        patient_count: loc.patients.length,
        top_procedure: topProcedure,
        procedure_breakdown: loc.procedures
      };
    });

    // Calculate procedure summary
    const procedureTotals = {};
    locations.forEach(loc => {
      Object.entries(loc.procedure_breakdown).forEach(([proc, count]) => {
        procedureTotals[proc] = (procedureTotals[proc] || 0) + count;
      });
    });

    const procedure_summary = Object.entries(procedureTotals)
      .map(([procedure, count]) => ({ procedure, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate center and zoom based on patient distribution
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    // Calculate unique states (rough estimate based on ZIP codes)
    const uniqueZipPrefixes = new Set(
      locations.map(loc => loc.zip_code?.substring(0, 3)).filter(Boolean)
    );

    const response = {
      locations,
      procedure_summary,
      total_patients: patients.length,
      total_states: Math.max(1, Math.floor(uniqueZipPrefixes.size / 10)), // Rough estimate
      center: {
        lat: avgLat || 39.8283,
        lng: avgLng || -98.5795
      },
      zoom: locations.length > 50 ? 4 : 6
    };

    console.log('✅ Map data prepared:', {
      locations: response.locations.length,
      procedures: response.procedure_summary.length,
      total_patients: response.total_patients
    });

    res.json(response);

  } catch (error) {
    console.error('❌ Error fetching patient map data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch patient map data',
      details: error.message 
    });
  }
}