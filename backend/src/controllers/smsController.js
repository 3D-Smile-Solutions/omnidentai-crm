// backend/controllers/smsController.js
import twilio from 'twilio';
import supabase from '../utils/supabaseClient.js';
import { createMessage } from '../models/messageModel.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send SMS to patient
 * POST /api/sms/send
 */
export async function sendSMS(req, res) {
  try {
    const dentistId = req.user?.id;
    const { patientId, content } = req.body;

    console.log('📱 SMS send request:', { dentistId, patientId, content });

    if (!dentistId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!patientId || !content?.trim()) {
      return res.status(400).json({ 
        error: 'Patient ID and message content are required' 
      });
    }

    // Get patient's phone number and contact_id
    const { data: patient, error: patientError } = await supabase
      .from('user_profiles')
      .select('contact_id, phone, first_name, last_name')
      .eq('id', patientId)
      .eq('dentist_id', dentistId)
      .single();

    if (patientError || !patient) {
      console.error('Patient not found:', patientError);
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.contact_id) {
      console.error('Patient has no contact_id');
      return res.status(400).json({ error: 'Patient has no contact ID' });
    }

    if (!patient.phone) {
      console.error('Patient has no phone number');
      return res.status(400).json({ error: 'Patient has no phone number' });
    }

    // Format phone number (ensure E.164 format: +1234567890)
    let formattedPhone = patient.phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('1') && formattedPhone.length === 10) {
      formattedPhone = '1' + formattedPhone;
    }
    formattedPhone = '+' + formattedPhone;

    console.log('Formatted phone:', formattedPhone);

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: content.trim(),
      from: twilioPhoneNumber,
      to: formattedPhone,
      statusCallback: `${process.env.BACKEND_URL || 'https://omnidentai-crm.onrender.com'}/api/sms/status`
    });

    console.log(' SMS sent via Twilio:', twilioMessage.sid);

    // Log message to database with channel: 'sms'
    const messageData = {
      contactId: patient.contact_id,
      content: content.trim(),
      senderType: 'client',
      channelType: 'sms' //  SMS CHANNEL TAG
    };

    const newMessage = await createMessage(messageData);

    // Store Twilio message SID for tracking
    await supabase
      .from('chat_messages')
      .update({ 
        twilio_message_sid: twilioMessage.sid,
        sms_status: twilioMessage.status 
      })
      .eq('id', newMessage.id);

    // Transform for frontend
    const transformedMessage = {
      id: newMessage.id,
      message: newMessage.message,
      sender: 'dentist',
      channel: 'sms', //  SMS CHANNEL
      timestamp: newMessage.created_at,
      patientId: patientId,
      twilioSid: twilioMessage.sid,
      smsStatus: twilioMessage.status
    };

    console.log(' SMS logged to database');

    //  EMIT WEBSOCKET EVENT - Import io from server.js
    try {
      const { io } = await import('../server.js');
      
      // Emit to all users in this patient's conversation room
      io.to(`patient_${patientId}`).emit('new_message', transformedMessage);
      
      // Also emit to dentist's personal room
      io.to(`dentist_${dentistId}`).emit('message_sent', transformedMessage);
      
      console.log(` WebSocket SMS event emitted to patient_${patientId}`);
      
    } catch (wsError) {
      console.warn('⚠️ Could not emit WebSocket event:', wsError.message);
      // Continue anyway - message is saved
    }

    res.json({
      success: true,
      message: transformedMessage
    });

  } catch (error) {
    console.error(' Error sending SMS:', error);
    res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
}

/**
 * Handle incoming SMS from patients
 * POST /api/sms/webhook (called by Twilio)
 */
export async function handleIncomingSMS(req, res) {
  try {
    const { From, To, Body, MessageSid, SmsStatus } = req.body;

    console.log('📥 Incoming SMS webhook:', { From, To, Body, MessageSid });

    // Find patient by phone number
    let formattedPhone = From.replace(/\D/g, '');
    if (!formattedPhone.startsWith('1') && formattedPhone.length === 10) {
      formattedPhone = '1' + formattedPhone;
    }
    formattedPhone = '+' + formattedPhone;

    // Try multiple phone number formats
    const { data: patients, error: patientError } = await supabase
      .from('user_profiles')
      .select('id, contact_id, dentist_id, first_name, last_name')
      .or(`phone.eq.${From},phone.eq.${formattedPhone}`);

    if (patientError || !patients || patients.length === 0) {
      console.error(' Patient not found for phone:', From);
      
      // Send TwiML response
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message('Thank you for your message. We will get back to you shortly.');
      
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    const patient = patients[0];

    console.log(' Found patient:', patient.id);

    // Save message to database with channel: 'sms'
    const messageData = {
      contactId: patient.contact_id,
      content: Body.trim(),
      senderType: 'user', // FROM patient
      channelType: 'sms' //  SMS CHANNEL TAG
    };

    const newMessage = await createMessage(messageData);

    // Store Twilio message SID
    await supabase
      .from('chat_messages')
      .update({ 
        twilio_message_sid: MessageSid,
        sms_status: SmsStatus 
      })
      .eq('id', newMessage.id);

    console.log(' Incoming SMS logged to database');

    //  EMIT WEBSOCKET EVENT - Import io from server.js
    // You need to pass io to this controller or import it
    try {
      // Get io instance - you'll need to export it from server.js
      const { io } = await import('../server.js');
      
      // Transform for frontend
      const transformedMessage = {
        id: newMessage.id,
        message: newMessage.message,
        sender: 'patient',
        channel: 'sms',
        timestamp: newMessage.created_at,
        patientId: patient.id,
        twilioSid: MessageSid,
        smsStatus: SmsStatus
      };

      // Emit to dentist's room
      io.to(`dentist_${patient.dentist_id}`).emit('new_message', transformedMessage);
      
      // Also emit to patient conversation room
      io.to(`patient_${patient.id}`).emit('new_message', transformedMessage);
      
      console.log(' WebSocket event emitted to dentist:', patient.dentist_id);
      
    } catch (wsError) {
      console.warn('⚠️ Could not emit WebSocket event:', wsError.message);
      // Continue anyway - message is saved in database
    }

    // Send empty TwiML response (no auto-reply)
    const twiml = new twilio.twiml.MessagingResponse();
    
    res.type('text/xml');
    res.send(twiml.toString());

  } catch (error) {
    console.error(' Error handling incoming SMS:', error);
    
    // Still send valid TwiML response even on error
    const twiml = new twilio.twiml.MessagingResponse();
    res.type('text/xml');
    res.send(twiml.toString());
  }
}
/**
 * Handle SMS delivery status updates
 * POST /api/sms/status (called by Twilio)
 */
export async function handleSMSStatus(req, res) {
  try {
    const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = req.body;

    console.log('📊 SMS status update:', { MessageSid, MessageStatus, ErrorCode });

    // Update message status in database
    await supabase
      .from('chat_messages')
      .update({ 
        sms_status: MessageStatus,
        sms_error_code: ErrorCode || null,
        sms_error_message: ErrorMessage || null,
        updated_at: new Date().toISOString()
      })
      .eq('twilio_message_sid', MessageSid);

    console.log(' SMS status updated:', MessageSid);

    res.sendStatus(200);

  } catch (error) {
    console.error(' Error updating SMS status:', error);
    res.sendStatus(500);
  }
}

/**
 * Get SMS history for a patient
 * GET /api/sms/history/:patientId
 */
export async function getSMSHistory(req, res) {
  try {
    const dentistId = req.user?.id;
    const { patientId } = req.params;

    if (!dentistId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get patient's contact_id
    const { data: patient, error: patientError } = await supabase
      .from('user_profiles')
      .select('contact_id')
      .eq('id', patientId)
      .eq('dentist_id', dentistId)
      .single();

    if (patientError || !patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.contact_id) {
      return res.json({ messages: [] });
    }

    // Get all SMS messages
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('contact_id', patient.contact_id)
      .eq('channel', 'sms')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Transform for frontend
    const transformedMessages = messages.map(msg => ({
      id: msg.id,
      message: msg.message,
      sender: msg.sender === 'client' ? 'dentist' : 'patient',
      channel: 'sms',
      timestamp: msg.created_at,
      smsStatus: msg.sms_status,
      twilioSid: msg.twilio_message_sid
    }));

    res.json({ messages: transformedMessages });

  } catch (error) {
    console.error(' Error fetching SMS history:', error);
    res.status(500).json({
      error: 'Failed to fetch SMS history',
      details: error.message
    });
  }
}