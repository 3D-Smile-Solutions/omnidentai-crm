// backend/controllers/voiceController.js
import twilio from 'twilio';
import supabase from '../utils/supabaseClient.js';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = twilio.twiml.VoiceResponse;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

const client = twilio(accountSid, authToken);

/**
 * Generate Twilio Access Token for browser-based calling
 * GET /api/voice/token
 */
export async function generateToken(req, res) {
  try {
    const dentistId = req.user.id;
    
    // Validate required credentials exist
    if (!accountSid) {
      return res.status(500).json({ error: 'Missing TWILIO_ACCOUNT_SID' });
    }
    if (!process.env.TWILIO_API_KEY) {
      return res.status(500).json({ error: 'Missing TWILIO_API_KEY' });
    }
    if (!process.env.TWILIO_API_SECRET) {
      return res.status(500).json({ error: 'Missing TWILIO_API_SECRET' });
    }
    if (!twimlAppSid) {
      return res.status(500).json({ error: 'Missing TWILIO_TWIML_APP_SID' });
    }

    // Create access token - MUST use API Key, not Account SID
    const token = new AccessToken(
      accountSid,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { 
        identity: dentistId,
        ttl: 3600
      }
    );

    // Grant voice capabilities
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    });
    token.addGrant(voiceGrant);

    console.log('✅ Generated voice token for dentist:', dentistId);

    res.json({
      token: token.toJwt(),
      identity: dentistId
    });
  } catch (error) {
    console.error('❌ Error generating voice token:', error);
    res.status(500).json({ 
      error: 'Failed to generate token',
      details: error.message 
    });
  }
}

/**
 * Initiate outbound call to patient (used for server-initiated calls)
 * POST /api/voice/make-call
 * Body: { patientId: string }
 */
export async function makeCall(req, res) {
  try {
    const dentistId = req.user.id;
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    console.log('📞 Initiating call from dentist:', dentistId, 'to patient:', patientId);

    // Fetch patient phone number
    const { data: patient, error: patientError } = await supabase
      .from('user_profiles')
      .select('phone, first_name, last_name')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      console.error('❌ Patient not found:', patientError);
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.phone) {
      return res.status(400).json({ error: 'Patient has no phone number' });
    }

    // Format phone number (ensure E.164 format)
    let toNumber = patient.phone.trim();
    if (!toNumber.startsWith('+')) {
      toNumber = toNumber.replace(/\D/g, '');
      if (toNumber.startsWith('92')) {
        toNumber = '+' + toNumber;
      } else if (toNumber.length === 10) {
        toNumber = '+1' + toNumber;
      } else {
        return res.status(400).json({ error: 'Invalid phone number format. Use E.164 format (+12135551234)' });
      }
    }

    console.log('📞 Calling:', toNumber);

    // Make the call using Twilio
    const call = await client.calls.create({
      from: twilioPhoneNumber,
      to: toNumber,
      url: `${process.env.BACKEND_URL}/api/voice/twiml/outbound?DentistId=${dentistId}&PatientId=${patientId}`,
      statusCallback: `${process.env.BACKEND_URL}/api/voice/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      record: false,
      timeout: 30
    });

    console.log('✅ Call initiated:', call.sid);

    // Log call to database
    const { data: callLog, error: logError } = await supabase
      .from('call_logs')
      .insert({
        client_id: dentistId,
        patient_id: patientId,
        direction: 'outbound',
        from_number: twilioPhoneNumber,
        to_number: toNumber,
        status: 'initiated',
        call_sid: call.sid,
        call_purpose: 'outbound_call',
      })
      .select()
      .single();

    if (logError) {
      console.error('⚠️ Failed to log call:', logError);
    } else {
      console.log('✅ Call logged to database:', callLog.id);
    }

    res.json({
      success: true,
      callSid: call.sid,
      status: call.status,
      patient: {
        name: `${patient.first_name} ${patient.last_name}`,
        phone: toNumber
      }
    });
  } catch (error) {
    console.error('❌ Error making call:', error);
    res.status(500).json({ 
      error: 'Failed to initiate call',
      details: error.message 
    });
  }
}

/**
 * Generate TwiML for outbound call (browser-initiated calls)
 * GET /api/voice/twiml/outbound
 *  THIS IS WHERE BROWSER CALLS ARE LOGGED
 */
export function generateOutboundTwiML(req, res) {
  const { To, PatientId, DentistId } = req.query;
  
  console.log('═══════════════════════════════════════');
  console.log('📱 Generating TwiML for call to:', To);
  console.log('PatientId:', PatientId);
  console.log('DentistId:', DentistId);
  console.log('All query params:', JSON.stringify(req.query, null, 2));
  console.log('═══════════════════════════════════════');
  
  // ✅ LOG THE CALL TO DATABASE (async, non-blocking)
  (async () => {
    try {
      console.log('🔄 Attempting to log call to database...');
      
      // Extract Call SID from Twilio headers
      const callSid = req.headers['x-twilio-callsid'] || 
                      req.query.CallSid || 
                      `WEB_${Date.now()}`;
      
      console.log('📞 Call SID:', callSid);
      console.log('📞 Using DentistId:', DentistId);
      console.log('📞 Using PatientId:', PatientId);
      
      if (!DentistId || !PatientId) {
        console.error('❌ Missing DentistId or PatientId!');
        console.error('Available query params:', Object.keys(req.query));
        return;
      }
      
      const insertData = {
        client_id: DentistId,
        patient_id: PatientId,
        direction: 'outbound',
        from_number: twilioPhoneNumber,
        to_number: To,
        status: 'initiated',
        call_sid: callSid,
        call_purpose: 'outbound_call',
      };
      
      console.log('📊 Insert data:', JSON.stringify(insertData, null, 2));
      
      const { data: callLog, error: logError } = await supabase
        .from('call_logs')
        .insert(insertData)
        .select()
        .single();
      
      if (logError) {
        console.error('❌ Failed to log call to database!');
        console.error('Error code:', logError.code);
        console.error('Error message:', logError.message);
        console.error('Error details:', JSON.stringify(logError, null, 2));
      } else {
        console.log('✅ Call logged to database successfully!');
        console.log('Call log ID:', callLog.id);
        console.log('Call log data:', JSON.stringify(callLog, null, 2));
      }
    } catch (err) {
      console.error('❌ Exception while logging call:');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
    }
  })();
  
  // Generate TwiML response
  const twiml = new VoiceResponse();
  
  const dial = twiml.dial({
    callerId: twilioPhoneNumber,
    timeout: 30,
    record: 'do-not-record',
  });
  
  dial.number(To);

  console.log('✅ TwiML generated');

  res.type('text/xml');
  res.send(twiml.toString());
}

/**
 * Handle incoming calls (if patient calls back)
 * POST /api/voice/incoming
 */
export function handleIncoming(req, res) {
  const twiml = new VoiceResponse();
  
  twiml.say({
    voice: 'alice'
  }, 'Thank you for calling. Please hold while we connect you to your dental office.');
  
  twiml.play({
    loop: 5
  }, 'http://com.twilio.sounds.music.s3.amazonaws.com/ClockworkWaltz.mp3');
  
  res.type('text/xml');
  res.send(twiml.toString());
}

/**
 * Handle call status updates
 * POST /api/voice/status
 */
export async function handleCallStatus(req, res) {
  try {
    const {
      CallSid,
      CallStatus,
      CallDuration,
      RecordingUrl,
      RecordingSid
    } = req.body;

    console.log('📊 Call status update:', { CallSid, CallStatus, CallDuration });

    const updateData = {
      status: CallStatus.toLowerCase(),
      updated_at: new Date().toISOString()
    };

    if (CallDuration) {
      updateData.duration = parseInt(CallDuration);
      updateData.completed_at = new Date().toISOString();
    }

    if (RecordingUrl) {
      updateData.recording_url = RecordingUrl;
      updateData.recording_sid = RecordingSid;
    }

    const { error } = await supabase
      .from('call_logs')
      .update(updateData)
      .eq('call_sid', CallSid);

    if (error) {
      console.error('❌ Failed to update call log:', error);
      return res.sendStatus(500);
    }

    console.log('✅ Call log updated:', CallSid);

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error updating call status:', error);
    res.sendStatus(500);
  }
}

/**
 * Get call history for a dentist
 * GET /api/voice/history
 */
export async function getCallHistory(req, res) {
  try {
    const dentistId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const { data: calls, error } = await supabase
      .from('call_logs')
      .select(`
        *,
        user_profiles!patient_id (
          first_name,
          last_name,
          phone
        )
      `)
      .eq('client_id', dentistId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Log that these records were accessed (HIPAA audit)
    // if (calls && calls.length > 0) {
    //   for (const call of calls) {
    //     await supabase.rpc('log_call_view', { call_log_id_param: call.id });
    //   }
    // }

    res.json({
      calls,
      total: calls.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('❌ Error fetching call history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch call history',
      details: error.message 
    });
  }
}