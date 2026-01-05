import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI
let genAI;
let model;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Using Gemini 1.5 Flash model (fast and efficient)
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log('✅ Gemini AI initialized with Gemini 1.5 Flash model');
} else {
  console.warn('⚠️  GEMINI_API_KEY not found. Using demo responses.');
}

// AI response generator using Gemini
const generateAIResponse = async (message, conversationHistory = []) => {
  try {
    if (!model) {
      // Fallback demo response if API key is not configured
      return `Demo Response: You asked "${message}". Please configure your GEMINI_API_KEY in the .env file to get real AI responses from Gemini.`;
    }

    // Build conversation history for context
    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.');
    }
    
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error('Model not available. Please check your Gemini API access.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new Error('API quota exceeded. Please check your Gemini API usage.');
    }
    
    throw new Error(`AI Error: ${error.message || 'Failed to generate response. Please try again.'}`);
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
