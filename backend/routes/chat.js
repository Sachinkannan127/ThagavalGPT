import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI with automatic fallback
let genAI;
let model;
let modelName = null;

// List of models to try (ordered by compatibility)
const MODEL_FALLBACKS = [
  "gemini-2.0-flash-exp",
  "gemini-exp-1206",
  "gemini-2.0-flash-thinking-exp-1219",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "models/gemini-1.5-flash",
  "models/gemini-pro"
];

// Initialize model with automatic fallback
const initializeModel = async () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found. Using demo responses.');
    return;
  }

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Try each model until one works
  for (const testModel of MODEL_FALLBACKS) {
    try {
      const testInstance = genAI.getGenerativeModel({ model: testModel });
      
      // Test if the model works with a simple request
      await testInstance.generateContent("Hi");
      
      // If successful, use this model
      model = testInstance;
      modelName = testModel;
      console.log(`✅ Gemini AI initialized with ${modelName} model`);
      console.log(`📝 API Key: ${process.env.GEMINI_API_KEY.substring(0, 20)}...`);
      return;
    } catch (error) {
      console.log(`⚠️  Model ${testModel} not available, trying next...`);
      continue;
    }
  }
  
  // If no model worked
  console.error('❌ No Gemini models available with this API key');
  console.error('Please generate a NEW API key at: https://aistudio.google.com/app/apikey');
};

// Initialize the model
initializeModel().catch(err => {
  console.error('Failed to initialize Gemini:', err.message);
});

// AI response generator using Gemini
const generateAIResponse = async (message, conversationHistory = []) => {
  try {
    if (!model) {
      // Fallback demo response if model is not initialized
      return `🤖 Demo Mode: You asked "${message}"\n\n⚠️ The Gemini AI model is not available. This could be because:\n1. Your API key doesn't have access to Gemini models\n2. The API key is invalid or expired\n3. There are temporary API issues\n\n✅ To fix this:\n1. Visit https://aistudio.google.com/app/apikey\n2. Generate a NEW API key\n3. Update GEMINI_API_KEY in backend/.env\n4. Restart the backend server\n\nThe chatbot will work once you configure a valid API key!`;
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
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      cause: error.cause
    });
    
    // Provide more specific error messages with solutions
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid API key') || error.status === 400) {
      throw new Error('❌ Invalid API key. Please:\n1. Visit https://aistudio.google.com/app/apikey\n2. Create a new API key\n3. Update GEMINI_API_KEY in backend/.env\n4. Restart the backend server');
    }
    
    if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('models/') || error.status === 404) {
      throw new Error('❌ Model not available. Try this:\n1. Visit https://aistudio.google.com/app/apikey\n2. Generate a NEW API key (old keys may have limited access)\n3. Replace the key in backend/.env\n4. Restart backend');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429') || error.status === 429) {
      throw new Error('⏳ API quota exceeded. Wait a few minutes or get a new key at https://aistudio.google.com/app/apikey');
    }
    
    if (error.message?.includes('PERMISSION_DENIED') || error.status === 403) {
      throw new Error('🔒 Permission denied. Generate a NEW API key at https://aistudio.google.com/app/apikey (existing keys may have restrictions)');
    }
    
    // Generic error with full details
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
