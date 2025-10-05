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
      accountSid,                          // Account SID
      process.env.TWILIO_API_KEY,          // API Key (NOT accountSid)
      process.env.TWILIO_API_SECRET,       // API Secret (NOT authToken)
      { 
        identity: dentistId,
        ttl: 3600                          // 1 hour
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
 * Initiate outbound call to patient
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

    // Fetch patient phone number from database
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

    // Format phone number (ensure E.164 format: +1234567890)
    let toNumber = patient.phone.replace(/\D/g, ''); // Remove non-digits
    if (!toNumber.startsWith('+')) {
      toNumber = '+1' + toNumber; // Assume US/Canada if no country code
    }

    // Make the call using Twilio
    const call = await client.calls.create({
      from: twilioPhoneNumber,
      to: toNumber,
      url: `${process.env.BACKEND_URL}/api/voice/twiml/outbound?dentistId=${dentistId}&patientId=${patientId}`,
      statusCallback: `${process.env.BACKEND_URL}/api/voice/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      record: false, // Set to true to record calls
      timeout: 30 // Timeout after 30 seconds
    });

    console.log('✅ Call initiated:', call.sid);

    // Log call to database
    await supabase.from('call_logs').insert({
      client_id: dentistId,
      patient_id: patientId,
      direction: 'outbound',
      from_number: twilioPhoneNumber,
      to_number: toNumber,
      status: 'initiated',
      call_sid: call.sid
    });

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
 * Generate TwiML for outbound call
 * GET /api/voice/twiml/outbound
 */
export function generateOutboundTwiML(req, res) {
  const { To, patientId } = req.query;
  
  console.log('📱 Generating TwiML for call to:', To);
  
  const twiml = new VoiceResponse();
  
  // Simply dial the number
  const dial = twiml.dial({
    callerId: twilioPhoneNumber,
    timeout: 30,
    record: 'do-not-record'
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
  
  // Play hold music
  twiml.play({
    loop: 5
  }, 'http://com.twilio.sounds.music.s3.amazonaws.com/ClockworkWaltz.mp3');
  
  // You can add logic here to route to specific dentist
  
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
      RecordingUrl
    } = req.body;

    console.log('📊 Call status update:', { CallSid, CallStatus, CallDuration });

    // Update call log in database
    const updateData = {
      status: CallStatus.toLowerCase(),
      updated_at: new Date().toISOString()
    };

    if (CallDuration) {
      updateData.duration = parseInt(CallDuration);
    }

    if (RecordingUrl) {
      updateData.recording_url = RecordingUrl;
    }

    await supabase
      .from('call_logs')
      .update(updateData)
      .eq('call_sid', CallSid);

    console.log('✅ Call log updated:', CallSid);

    // TODO: Emit WebSocket event to update UI in real-time
    // io.to(dentistId).emit('call_status_update', { callSid: CallSid, status: CallStatus });

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