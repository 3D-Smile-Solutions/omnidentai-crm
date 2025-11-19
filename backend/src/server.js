// backend/src/server.js - Updated for WebSocket without separate JWT
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';
import supabase from "./utils/supabaseClient.js";
import { createMessage } from "./models/messageModel.js";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patient.js";
import messageRoutes from "./routes/message.js";
import metrics from './routes/metrics.js';
import voiceCall from './routes/voice.js'
import smsRoutes from './routes/sms.js';
import conversationControlRoutes from "./routes/conversationControl.js";
import twilioUsage from './routes/twilioUsage.js';
// import settings from './routes/settings.js'
import practiceDocumentRoutes from './routes/practiceDocumentRoutes.js';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:5500',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5500',
    ];

console.log('🔒 CORS allowed origins:', ALLOWED_ORIGINS);
// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Regular middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// Add this BEFORE registering routes to verify import worked
console.log(' Conversation control routes loaded:', typeof conversationControlRoutes);
// Routes
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/messages", messageRoutes);
// app.use('/upload', upload);
app.use('/api/metrics', metrics);
app.use('/api/voice', voiceCall);
app.use('/api/sms', smsRoutes);
app.use('/api/usage', twilioUsage);
// app.use('/api/settings', settings);
app.use('/practice-documents', practiceDocumentRoutes);
app.use("/api/conversation-control", conversationControlRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running " });
});
// ==========================================
// WEBSOCKET AUTHENTICATION & HANDLING
// ==========================================

// Authenticate WebSocket connections
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const contactId = socket.handshake.auth.contactId;
    
    //  CHAT WIDGET CONNECTION (no token, uses contactId)
    if (!token && contactId) {
      socket.isWidget = true;
      socket.contactId = contactId;
      console.log(` Chat widget authenticated for contact: ${contactId}`);
      return next();
    }
    
    //  CRM CONNECTION (requires token)
    if (!token) {
      return next(new Error('No authentication token provided'));
    }

    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data?.user) {
      return next(new Error('Invalid authentication token'));
    }

    socket.userId = data.user.id;
    socket.userEmail = data.user.email;
    socket.isWidget = false;
    
    console.log(` CRM authenticated for user: ${data.user.email}`);
    next();
  } catch (err) {
    console.error('Socket authentication error:', err);
    next(new Error('Authentication failed'));
  }
};

io.use(authenticateSocket);

// Handle WebSocket connections
io.on('connection', (socket) => {
  
  // ==========================================
  // CHAT WIDGET CONNECTIONS
  // ==========================================
  if (socket.isWidget) {
    console.log(`🔌 Chat widget connected: ${socket.contactId}`);
    
    // Join widget to its contact room
    socket.join(`contact_${socket.contactId}`);
    
    //  WIDGET SENDS MESSAGE TO CRM
   //  WIDGET SENDS MESSAGE TO CRM
socket.on('send_message', async (data) => {
  try {
    const { content } = data;
    const contactId = socket.contactId;

    console.log(`📤 Widget message from ${contactId}: ${content}`);

    if (!content?.trim()) {
      socket.emit('message_error', { error: 'Message content required' });
      return;
    }

    // Find patient by contact_id
    const { data: patient, error: patientError } = await supabase
      .from("user_profiles")
      .select("id, dentist_id, first_name, last_name")
      .eq("contact_id", contactId)
      .single();

    if (patientError || !patient) {
      socket.emit('message_error', { error: 'Patient not found' });
      return;
    }

    //  REMOVE THIS ENTIRE BLOCK - Don't save user messages!
    // const messageData = { ... };
    // const newMessage = await createMessage(messageData);

    //  Just create the message object for WebSocket broadcast
    const transformedMessage = {
      id: Date.now(), // Temporary ID for real-time display
      message: content.trim(),
      sender: 'user',
      channel: 'webchat',
      timestamp: new Date().toISOString(),
      patientId: patient.id
    };

    //  SEND TO CRM (dentist's room AND patient's room) - REAL-TIME ONLY
    io.to(`dentist_${patient.dentist_id}`).emit('new_message', transformedMessage);
    io.to(`patient_${patient.id}`).emit('new_message', transformedMessage);
    
    //  CONFIRMATION TO WIDGET
    socket.emit('message_sent', transformedMessage);

    console.log(` Widget message forwarded to CRM (not saved - widget handles DB)`);

  } catch (error) {
    console.error(' Error handling widget message:', error);
    socket.emit('message_error', { 
      error: 'Failed to send message',
      details: error.message 
    });
  }
});

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Widget disconnected: ${socket.contactId} (${reason})`);
    });

    return; //  Exit early for widget - don't process CRM events
  }

  // ==========================================
  // CRM CONNECTIONS
  // ==========================================
  console.log(`🔌 CRM user connected: ${socket.userEmail} (${socket.userId})`);
  
  // Join dentist to their personal room
  socket.join(`dentist_${socket.userId}`);

  // ==========================================
  // PATIENT CONVERSATION ROOM MANAGEMENT
  // ==========================================
  
  socket.on('join_patient_conversation', (patientId) => {
    socket.join(`patient_${patientId}`);
    console.log(`👥 ${socket.userEmail} joined conversation with patient ${patientId}`);
  });

  socket.on('leave_patient_conversation', (patientId) => {
    socket.leave(`patient_${patientId}`);
    console.log(`👋 ${socket.userEmail} left conversation with patient ${patientId}`);
  });

  // ==========================================
  // CRM SENDS MESSAGE TO WIDGET
  // ==========================================
  
  socket.on('send_message', async (data) => {
    try {
      const { patientId, content, channelType = 'webchat' } = data;

      console.log(`📤 CRM message from ${socket.userEmail} to patient ${patientId} via ${channelType}: ${content}`);

      // Validate input
      if (!patientId || !content?.trim()) {
        socket.emit('message_error', { error: 'Patient ID and message content required' });
        return;
      }

      // Validate channel type
      if (!['webchat', 'sms'].includes(channelType)) {
        socket.emit('message_error', { error: 'Invalid channel type' });
        return;
      }

      // Get patient's contact_id
      const { data: patient, error: patientError } = await supabase
        .from("user_profiles")
        .select("contact_id, first_name, last_name, phone")
        .eq("id", patientId)
        .eq("dentist_id", socket.userId)
        .single();

      if (patientError || !patient) {
        socket.emit('message_error', { error: 'Patient not found or unauthorized' });
        return;
      }

      if (!patient.contact_id) {
        socket.emit('message_error', { error: 'Patient has no contact ID' });
        return;
      }

      // Validate phone for SMS
      if (channelType === 'sms' && !patient.phone) {
        socket.emit('message_error', { error: 'Patient has no phone number for SMS' });
        return;
      }

      // Create message in database
      const messageData = {
        contactId: patient.contact_id,
        content: content.trim(),
        senderType: 'client', //  Changed from 'client'
        channelType
      };

      const newMessage = await createMessage(messageData);

      const transformedMessage = {
        id: newMessage.id,
        message: newMessage.message,
        sender: 'client', //  Changed from 'client'
        channel: newMessage.channel,
        timestamp: newMessage.created_at,
        patientId: patientId
      };

      //  SEND TO WIDGET (contact room)
      io.to(`contact_${patient.contact_id}`).emit('new_message', transformedMessage);
      
      //  SEND TO OTHER CRM USERS IN THIS CONVERSATION
      socket.to(`patient_${patientId}`).emit('new_message', transformedMessage);

      //  CONFIRMATION TO SENDER
      socket.emit('message_sent', transformedMessage);

      console.log(` CRM ${channelType.toUpperCase()} message sent to widget for contact ${patient.contact_id}`);

    } catch (error) {
      console.error(' Error sending message from CRM:', error);
      socket.emit('message_error', { 
        error: 'Failed to send message',
        details: error.message 
      });
    }
  });

  // ==========================================
  // TYPING INDICATORS
  // ==========================================
  
  socket.on('typing_start', (data) => {
    const { patientId } = data;
    socket.to(`patient_${patientId}`).emit('user_typing', {
      patientId, 
      userId: socket.userId,
      userEmail: socket.userEmail,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    const { patientId } = data;
    socket.to(`patient_${patientId}`).emit('user_typing', {
      patientId,
      userId: socket.userId,
      userEmail: socket.userEmail,
      isTyping: false
    });
  });

  // ==========================================
  // MARK MESSAGES AS READ
  // ==========================================
  
  socket.on('mark_messages_read', async (data) => {
    try {
      const { patientId } = data;
      
      io.to(`patient_${patientId}`).emit('messages_read', {
        patientId,
        readBy: socket.userId,
        timestamp: new Date().toISOString()
      });

      console.log(`👁️ Messages marked as read by ${socket.userEmail} for patient ${patientId}`);

    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // ==========================================
  // CONNECTION MANAGEMENT
  // ==========================================
  
  socket.on('disconnect', (reason) => {
    console.log(`🔌 CRM user disconnected: ${socket.userEmail} (${reason})`);
  });

  socket.on('error', (error) => {
    console.error(` Socket error for ${socket.userEmail}:`, error);
  });
});

// Export io for potential use in other files
export { io };
// ==========================================
// BOT RESPONSE WEBHOOK ENDPOINT (for N8N)
// ==========================================

app.post("/api/bot-response", express.json(), async (req, res) => {
  try {
    const { contact_id, message, sender = 'bot' } = req.body;

    console.log('📩 Bot response received for contact:', contact_id);

    if (!contact_id || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'contact_id and message are required' 
      });
    }

    // Find patient by contact_id
    const { data: patient, error: patientError } = await supabase
      .from("user_profiles")
      .select("id, dentist_id, first_name, last_name")
      .eq("contact_id", contact_id)
      .single();

    if (patientError || !patient) {
      console.error('Patient not found:', patientError);
      return res.status(404).json({ 
        success: false, 
        error: 'Patient not found' 
      });
    }

    // Create transformed message for WebSocket broadcast
    const transformedMessage = {
      message: message,
      sender: sender, // 'bot'
      channel: 'webchat',
      timestamp: new Date().toISOString(),
      patientId: patient.id,
      contact_id: contact_id
    };

    //  BROADCAST TO CRM (Dentist's room)
    io.to(`dentist_${patient.dentist_id}`).emit('new_message', transformedMessage);
    
    //  BROADCAST TO PATIENT'S ROOM (for multi-user CRM)
    io.to(`patient_${patient.id}`).emit('new_message', transformedMessage);

    //  BROADCAST TO WIDGET (if widget is connected)
    io.to(`contact_${contact_id}`).emit('new_message', transformedMessage);

    console.log(' Bot response broadcasted via WebSocket to CRM and widget');

    res.json({ 
      success: true, 
      message: 'Bot response broadcasted successfully' 
    });

  } catch (error) {
    console.error(' Error handling bot response:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  // console.log(`🔌 WebSocket server ready`);
});

export default app;