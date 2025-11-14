// backend/src/controllers/messageController.js

import supabase from "../utils/supabaseClient.js";
import { 
  getMessagesByContactId,
  getAllMessagesForDentist, 
  createMessage, 
  getPatientByContactId,
  getUnreadCounts 
} from "../models/messageModel.js";
//  NEW: Import conversation control functions
import {
  updateDentistResponseTime
} from "../models/conversationControlModel.js";

// GET /messages/:patientId - Get messages for specific patient
export async function getMessagesWithPatient(req, res) {
  try {
    const dentistId = req.user?.id;
    const { patientId } = req.params;

    console.log("Fetching messages for patient:", { dentistId, patientId });

    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the patient to find their contact_id
    const { data: patient, error: patientError } = await supabase
      .from("user_profiles")
      .select("contact_id")
      .eq("id", patientId)
      .eq("dentist_id", dentistId)
      .single();

    if (patientError || !patient) {
      console.error("Patient not found:", patientError);
      return res.status(404).json({ error: "Patient not found" });
    }

    if (!patient.contact_id) {
      console.log("Patient has no contact_id:", patient);
      return res.json({ messages: [] });
    }

    console.log("Found patient with contact_id:", patient.contact_id);

    const messages = await getMessagesByContactId(dentistId, patient.contact_id);
    
    console.log("Fetched messages:", messages.length);

    // Map ALL sender types
    const transformedMessages = messages.map(msg => {
      let senderType;
      
      switch(msg.sender) {
        case 'client':
          senderType = 'dentist';
          break;
        case 'user':
          senderType = 'patient';
          break;
        case 'bot':
          senderType = 'bot';
          break;
        default:
          senderType = msg.sender;
      }
      
      return {
        id: msg.id,
        message: msg.message,
        sender: senderType,
        channel: msg.channel,
        timestamp: msg.created_at
      };
    });

    console.log(` Transformed ${transformedMessages.length} messages`);

    res.json({ messages: transformedMessages });
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

// GET /messages - Get all messages for dentist (overview)
export async function getAllMessages(req, res) {
  try {
    const dentistId = req.user?.id;
    
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Fetching all messages for dentist:", dentistId);

    const messages = await getAllMessagesForDentist(dentistId);
    const unreadCounts = await getUnreadCounts(dentistId);

    console.log("Fetched messages:", messages.length);
    console.log("Unread counts:", unreadCounts);

    // Group messages by contact_id, then map to user_profiles.id
    const messagesByContactId = messages.reduce((acc, msg) => {
      const contactId = msg.contact_id;
      if (!acc[contactId]) {
        acc[contactId] = {
          contactId,
          patientId: msg.user_profiles?.id,
          patientName: `${msg.user_profiles?.first_name || 'Unknown'} ${msg.user_profiles?.last_name || 'Patient'}`,
          messages: [],
          unreadCount: unreadCounts[contactId] || 0
        };
      }
      
      acc[contactId].messages.push({
        id: msg.id,
        message: msg.message,
        sender: msg.sender === 'client' ? 'dentist' : msg.sender === 'bot' ? 'bot' : 'patient',
        channel: msg.channel,
        timestamp: msg.created_at
      });
      
      return acc;
    }, {});

    // Convert to be indexed by patient ID for frontend
    const messagesByPatient = {};
    Object.values(messagesByContactId).forEach(item => {
      if (item.patientId) {
        messagesByPatient[item.patientId] = {
          messages: item.messages,
          unreadCount: item.unreadCount
        };
      }
    });

    console.log("Messages by patient:", Object.keys(messagesByPatient));

    res.json({ messagesByPatient });
  } catch (err) {
    console.error("Error fetching all messages:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

// POST /messages - Send a new message
export async function sendMessage(req, res) {
  try {
    const dentistId = req.user?.id;
    const { patientId, content, channelType = 'webchat' } = req.body;

    console.log("Send message request:", { dentistId, patientId, content, channelType });

    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!patientId || !content?.trim()) {
      return res.status(400).json({ error: "Patient ID and message content are required" });
    }

    // Validate channel type
    if (!['webchat', 'sms'].includes(channelType)) {
      return res.status(400).json({ error: "Invalid channel type. Must be 'webchat' or 'sms'" });
    }

    //  USING contact_id: Get patient's contact_id (not id)
    const { data: patient, error: patientError } = await supabase
      .from("user_profiles")
      .select("contact_id, phone")
      .eq("id", patientId)
      .eq("dentist_id", dentistId)
      .single();

    if (patientError || !patient) {
      console.error("Patient not found for sending message:", patientError);
      return res.status(404).json({ error: "Patient not found" });
    }

    if (!patient.contact_id) {
      console.error("Patient has no contact_id:", patient);
      return res.status(400).json({ error: "Patient has no contact ID" });
    }

    // If SMS, validate phone number
    if (channelType === 'sms' && !patient.phone) {
      return res.status(400).json({ error: "Patient has no phone number for SMS" });
    }

    console.log("Found patient contact_id:", patient.contact_id);

    //  NEW: Update dentist response timestamp (marks bot as paused automatically if needed)
    try {
      await updateDentistResponseTime(patient.contact_id, dentistId);
      console.log(" Updated dentist response time for contact:", patient.contact_id);
    } catch (err) {
      console.error("⚠️ Failed to update dentist response time (non-critical):", err);
      // Don't block message sending if this fails
    }

    const messageData = {
      contactId: patient.contact_id, //  Using contact_id
      content: content.trim(),
      senderType: 'client', 
      channelType
    };

    console.log("Creating message:", messageData);

    const newMessage = await createMessage(messageData);
    
    console.log("Message created:", newMessage);

    // Transform for frontend
    const transformedMessage = {
      id: newMessage.id,
      message: newMessage.message,
      sender: 'dentist',
      channel: newMessage.channel,
      timestamp: newMessage.created_at
    };

    console.log("Message created successfully:", transformedMessage);

    res.json({ 
      success: true, 
      message: transformedMessage 
    });
  } catch (err) {
    console.error("Error sending message:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
}

// GET /messages/unread-counts - Get unread message counts
export async function getUnreadMessageCounts(req, res) {
  try {
    const dentistId = req.user?.id;
    
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const unreadCountsByContactId = await getUnreadCounts(dentistId);
    
    //  Convert contact_id based counts to patient_id based counts
    const { data: patients, error } = await supabase
      .from("user_profiles")
      .select("id, contact_id")
      .eq("dentist_id", dentistId);

    if (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }

    const unreadCountsByPatientId = {};
    patients.forEach(patient => {
      const count = unreadCountsByContactId[patient.contact_id] || 0;
      if (count > 0) {
        unreadCountsByPatientId[patient.id] = count;
      }
    });
    
    res.json({ unreadCounts: unreadCountsByPatientId });
  } catch (err) {
    console.error("Error fetching unread counts:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Failed to fetch unread counts" });
  }
}