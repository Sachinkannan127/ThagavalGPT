import express from 'express';
import Groq from 'groq-sdk';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Groq AI
let groq;
let modelName = 'llama-3.3-70b-versatile';

if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  console.log(`✅ Groq AI initialized with ${modelName} model`);
  console.log(`📝 API Key: ${process.env.GROQ_API_KEY.substring(0, 20)}...`);
} else {
  console.warn('⚠️  GROQ_API_KEY not found. Using demo responses.');
}

// AI response generator using Groq
const generateAIResponse = async (message, conversationHistory = []) => {
  try {
    if (!groq) {
      return `🤖 Demo Mode: You asked "${message}"\n\n⚠️ The Groq AI is not configured. To enable AI responses:\n1. Visit https://console.groq.com/keys\n2. Create a FREE API key\n3. Add GROQ_API_KEY to backend/.env\n4. Restart the backend server\n\nGroq is FREE and much faster than other providers!`;
    }

    // Build messages array with conversation history
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: modelName,
      messages: messages,
      temperature: 0.9,
      max_tokens: 2048,
      top_p: 0.95,
    });

    return completion.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Groq API Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    });
    
    // Provide specific error messages
    if (error.message?.includes('API key') || error.status === 401) {
      throw new Error('❌ Invalid Groq API key. Please:\n1. Visit https://console.groq.com/keys\n2. Create a new API key\n3. Update GROQ_API_KEY in backend/.env\n4. Restart the backend server');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
      throw new Error('⏳ API quota exceeded. Wait a moment or check your Groq account at https://console.groq.com/');
    }
    
    // Generic error
    throw new Error(`🤖 AI Error: ${error.message || 'Unknown error'}. Check backend logs for details.`);
  }
};

// Chat endpoint
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    console.log('📩 Received chat request:', { 
      user: req.user?.email || req.user?.uid,
      messageLength: message?.length,
      conversationId 
    });
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        message: 'Please enter a message'
      });
    }

    // Generate AI response
    console.log('🤖 Generating AI response...');
    const aiResponse = await generateAIResponse(message);
    console.log('✅ AI response generated successfully');

    res.json({
      message: aiResponse,
      conversationId: conversationId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: error.message || 'Internal server error. Please try again.'
    });
  }
});

// Get user info
router.get('/user', verifyToken, async (req, res) => {
  try {
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name
    });
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
