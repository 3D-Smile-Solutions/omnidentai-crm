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
import upload from './routes/upload.js';
import metrics from './routes/metrics.js';
import voiceCall from './routes/voice.js'
import practiceDocumentRoutes from './routes/practiceDocumentRoutes.js';
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Regular middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/messages", messageRoutes);
app.use('/upload', upload);
app.use('/api/metrics', metrics);
app.use('/api/voice', voiceCall);
app.use('/practice-documents', practiceDocumentRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running 🚀" });
});

// ==========================================
// WEBSOCKET AUTHENTICATION & HANDLING
// ==========================================

// Authenticate WebSocket connections using Supabase tokens
const authenticateSocket = async (socket, next) => {
  try {
    // Get token from socket handshake
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('No authentication token provided'));
    }

    // Validate token with Supabase (same as your existing middleware)
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data?.user) {
      return next(new Error('Invalid authentication token'));
    }

    // Store user info in socket
    socket.userId = data.user.id;
    socket.userEmail = data.user.email;
    
    // console.log(`✅ Socket authenticated for user: ${data.user.email}`);
    next();
  } catch (err) {
    console.error('Socket authentication error:', err);
    next(new Error('Authentication failed'));
  }
};

// Apply authentication to all socket connections
io.use(authenticateSocket);

// Handle WebSocket connections
io.on('connection', (socket) => {
  // console.log(`🔌 User connected: ${socket.userEmail} (${socket.userId})`);

  // Join user to their personal room for receiving updates
  socket.join(`dentist_${socket.userId}`);

  // ==========================================
  // PATIENT CONVERSATION ROOM MANAGEMENT
  // ==========================================

  // Join a specific patient conversation
  socket.on('join_patient_conversation', (patientId) => {
    socket.join(`patient_${patientId}`);
    // console.log(`👥 ${socket.userEmail} joined conversation with patient ${patientId}`);
  });

  // Leave a specific patient conversation
  socket.on('leave_patient_conversation', (patientId) => {
    socket.leave(`patient_${patientId}`);
    // console.log(`👋 ${socket.userEmail} left conversation with patient ${patientId}`);
  });

  // ==========================================
  // REAL-TIME MESSAGE HANDLING
  // ==========================================

  // Handle sending messages via WebSocket
  socket.on('send_message', async (data) => {
    try {
      const { patientId, content, channelType = 'webchat' } = data;

      console.log(`📤 Message from ${socket.userEmail} to patient ${patientId}: ${content}`);

      // Validate input
      if (!patientId || !content?.trim()) {
        socket.emit('message_error', { error: 'Patient ID and message content are required' });
        return;
      }

      // Get patient's contact_id (same logic as your HTTP endpoint)
      const { data: patient, error: patientError } = await supabase
        .from("user_profiles")
        .select("contact_id, first_name, last_name")
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

      // Create message in database (reusing your existing function)
      const messageData = {
        contactId: patient.contact_id,
        content: content.trim(),
        senderType: 'client',
        channelType
      };

      const newMessage = await createMessage(messageData);

      // Transform for frontend (same as your HTTP controller)
      const transformedMessage = {
        id: newMessage.id,
        message: newMessage.message,
        sender: 'dentist',
        channel: newMessage.channel,
        timestamp: newMessage.created_at,
        patientId: patientId
      };

      // Broadcast to all users in this patient's conversation room
     socket.to(`patient_${patientId}`).emit('new_message', transformedMessage);

      // Send success confirmation to sender
      socket.emit('message_sent', transformedMessage);

      console.log(`✅ Message sent successfully to patient ${patientId}`);

    } catch (error) {
      console.error('❌ Error sending message via WebSocket:', error);
      socket.emit('message_error', { 
        error: 'Failed to send message',
        details: error.message 
      });
    }
  });

  // ==========================================
  // TYPING INDICATORS (OPTIONAL)
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
  // MARK MESSAGES AS READ (OPTIONAL)
  // ==========================================

  socket.on('mark_messages_read', async (data) => {
    try {
      const { patientId } = data;
      
      // Broadcast read status to all users in conversation
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
    console.log(`🔌 User disconnected: ${socket.userEmail} (${reason})`);
  });

  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.userEmail}:`, error);
  });
});

// Export io for potential use in other files
export { io };

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  // console.log(`🔌 WebSocket server ready`);
});

export default app;