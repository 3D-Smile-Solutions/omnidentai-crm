// backend/src/controllers/conversationControlController.js

import {
  getConversationControl,
  pauseBot,
  resumeBot,
  shouldBotRespond
} from "../models/conversationControlModel.js";

// GET /api/conversation-control/:contactId
export const getControlStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    
    const control = await getConversationControl(contactId);
    
    res.json({
      success: true,
      data: control || {
        bot_paused: false,
        message: "No control record found, bot is active by default"
      }
    });
  } catch (error) {
    console.error('Error getting control status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// POST /api/conversation-control/pause
export const pauseBotForConversation = async (req, res) => {
  console.log('🎯 PAUSE BOT ENDPOINT HIT');
  console.log('📦 Request body:', req.body);
  console.log('👤 User from auth:', req.user);
  
  try {
    const { contactId, dentistId, reason } = req.body;
    
    if (!contactId || !dentistId) {
      return res.status(400).json({
        success: false,
        error: 'contactId and dentistId are required'
      });
    }
    
    const control = await pauseBot(contactId, dentistId, reason);
    
    res.json({
      success: true,
      message: 'Bot paused successfully',
      data: control
    });
  } catch (error) {
    console.error('Error pausing bot:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// POST /api/conversation-control/resume
export const resumeBotForConversation = async (req, res) => {
  try {
    const { contactId, dentistId } = req.body;
    
    if (!contactId || !dentistId) {
      return res.status(400).json({
        success: false,
        error: 'contactId and dentistId are required'
      });
    }
    
    const control = await resumeBot(contactId, dentistId);
    
    res.json({
      success: true,
      message: 'Bot resumed successfully',
      data: control
    });
  } catch (error) {
    console.error('Error resuming bot:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET /api/conversation-control/should-respond/:contactId
export const checkShouldBotRespond = async (req, res) => {
  try {
    const { contactId } = req.params;
    
    const shouldRespond = await shouldBotRespond(contactId);
    
    res.json({
      success: true,
      shouldBotRespond: shouldRespond
    });
  } catch (error) {
    console.error('Error checking if bot should respond:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};