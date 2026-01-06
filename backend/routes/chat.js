import express from 'express';
import Groq from 'groq-sdk';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
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
} else {
  console.warn('⚠️  GROQ_API_KEY not found.');
}

// Initialize OpenRouter AI
let openrouter;
let openrouterModel = 'deepseek/deepseek-chat'; // Free model for coding

if (process.env.OPENROUTER_API_KEY) {
  openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
  });
  console.log(`✅ OpenRouter AI initialized with ${openrouterModel} model`);
} else {
  console.warn('⚠️  OPENROUTER_API_KEY not found.');
}

// Determine which AI to use (prioritize OpenRouter for coding)
const getPreferredAI = (message) => {
  const codingKeywords = ['code', 'program', 'function', 'script', 'algorithm', 'debug', 'error', 'class', 'method'];
  const isCodingQuestion = codingKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
  
  // Use OpenRouter for coding questions if available
  if (isCodingQuestion && openrouter) {
    return 'openrouter';
  }
  
  // Use OpenRouter if available, otherwise Groq
  return openrouter ? 'openrouter' : 'groq';
};

// AI response generator
const generateAIResponse = async (message, conversationHistory = []) => {
  const aiProvider = getPreferredAI(message);
  
  console.log(`🤖 Using ${aiProvider.toUpperCase()} for this request`);
  
  if (aiProvider === 'openrouter') {
    return await generateOpenRouterResponse(message, conversationHistory);
  } else {
    return await generateGroqResponse(message, conversationHistory);
  }
};

// OpenRouter response generator
const generateOpenRouterResponse = async (message, conversationHistory = []) => {
  try {
    if (!openrouter) {
      return generateGroqResponse(message, conversationHistory);
    }

    // Limit conversation history to last 4 messages for speed
    const recentHistory = conversationHistory.slice(-4);

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant. Be BRIEF and CONCISE:
1. Short definitions (2-3 sentences max)
2. For code: minimal working example only
3. Use \`\`\`language for code blocks
4. Bullet points for lists
5. Skip unnecessary explanations
6. Get to the point immediately`
      },
      ...recentHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenRouter API
    const response = await generateText({
      model: openrouter(openrouterModel),
      messages: messages,
      temperature: 0.8,
      maxTokens: 1024,
    });

    const responseContent = response.text;
    
    if (!responseContent) {
      return 'No response generated';
    }
    
    console.log('📝 OpenRouter Response preview:', responseContent.substring(0, 100) + '...');
    
    return responseContent;
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    console.warn('⚠️  Falling back to Groq...');
    return await generateGroqResponse(message, conversationHistory);
  }
};

// Groq response generator
const generateGroqResponse = async (message, conversationHistory = []) => {
  try {
    if (!groq) {
      return `🤖 Demo Mode: You asked "${message}"\n\n⚠️ AI is not configured. To enable AI responses:\n\n**Option 1: OpenRouter (FREE models available)**\n1. Visit https://openrouter.ai/keys\n2. Create a FREE API key\n3. Add OPENROUTER_API_KEY to backend/.env\n\n**Option 2: Groq (Free & Fast)**\n1. Visit https://console.groq.com/keys\n2. Create a FREE API key\n3. Add GROQ_API_KEY to backend/.env\n\n4. Restart the backend server`;
    }

    // Limit conversation history to last 4 messages for speed
    const recentHistory = conversationHistory.slice(-4);

    // Build messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant. Be BRIEF:
1. Keep answers short (2-4 sentences)
2. For code: minimal example in \`\`\`language blocks
3. Use bullet points
4. No long explanations
5. Direct and concise only`
      },
      ...recentHistory.map(msg => ({
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
      temperature: 0.8,
      max_tokens: 1024,
      top_p: 0.95,
      frequency_penalty: 0.2,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return 'No response generated';
    }
    
    console.log('📝 Groq Response preview:', responseContent.substring(0, 100) + '...');
    
    return responseContent;
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
    console.log('✅ AI response generated:', {
      length: aiResponse.length,
      hasCodeBlock: aiResponse.includes('```'),
      preview: aiResponse.substring(0, 150)
    });

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
