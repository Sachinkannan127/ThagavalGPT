import express from 'express';
import Groq from 'groq-sdk';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Groq AI
let groq;
const modelName = 'llama-3.3-70b-versatile';

if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  console.log(`✅ Groq AI initialized with ${modelName} model`);
} else {
  console.warn('⚠️  GROQ_API_KEY not found. AI responses will be in demo mode.');
}

// Groq response generator
const generateGroqResponse = async (message, conversationHistory = [], responseLength = 'auto') => {
  try {
    if (!groq) {
      return `🤖 Demo Mode: You asked "${message}"\n\n⚠️ AI is not configured. To enable AI responses:\n\n**Groq (Free & Fast)**\n1. Visit https://console.groq.com/keys\n2. Create a FREE API key\n3. Add GROQ_API_KEY to backend/.env\n4. Restart the backend server`;
    }

    // Limit conversation history to last 4 messages for speed
    const recentHistory = conversationHistory.slice(-4);

    // Determine response style based on length preference
    let systemPrompt = '';
    let maxTokens = 1500;
    
    if (responseLength === 'short') {
      maxTokens = 800;
      systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. Answer concisely and directly.\n\nKnowledge cutoff: 2023-10\nCurrent date: ${new Date().toISOString().split('T')[0]}\n\nGuidelines:\n- Give brief, direct answers (1-3 sentences)\n- Start with the key point immediately\n- Use simple, clear language\n- For code: minimal comments, clean syntax\n- Format: Use **bold** for emphasis, \`code\` for inline code\n\nBe helpful, accurate, and concise.`;
    } else if (responseLength === 'detailed') {
      maxTokens = 3000;
      systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. Provide comprehensive, detailed responses.\n\nKnowledge cutoff: 2023-10\nCurrent date: ${new Date().toISOString().split('T')[0]}\n\nGuidelines:\n- Start with a clear overview (2-3 sentences)\n- Break down complex topics into sections with **headings**\n- Use bullet points and numbered lists for clarity\n- Provide examples and context\n- For code:\n  - Use \`\`\`language code blocks with proper syntax\n  - Add detailed comments explaining logic\n  - Show multiple approaches when relevant\n  - Include example output or usage\n- Explain edge cases and best practices\n- Use **bold** for key terms, \`code\` for inline code\n- End with a summary or next steps when appropriate\n\nBe thorough, educational, and well-structured like ChatGPT.`;
    } else {
      // Auto mode - balanced ChatGPT style
      maxTokens = 1500;
      systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. Provide helpful, well-formatted responses.\n\nKnowledge cutoff: 2023-10\nCurrent date: ${new Date().toISOString().split('T')[0]}\n\nGuidelines:\n- Begin with a brief, clear summary (1-2 sentences)\n- Structure information with bullet points or numbered lists\n- Use sections with **bold headings** for complex topics\n- For code:\n  - Use \`\`\`language code blocks (python, javascript, etc.)\n  - Add helpful comments\n  - Explain what the code does before/after the block\n  - Show example output when relevant\n- Use **bold** for important terms\n- Use \`backticks\` for inline code, commands, or file names\n- Keep responses clear, organized, and professional\n\nBe helpful, accurate, and well-formatted like ChatGPT.`;
    }

    // Build messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
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
      temperature: 0.7,
      max_tokens: maxTokens,
      top_p: 0.95,
      frequency_penalty: 0.3,
    });

    let responseContent = completion.choices[0]?.message?.content;
    
    console.log('🔍 Raw Groq response:', typeof responseContent, responseContent);
    
    // Robust object-to-string conversion
    if (responseContent === null || responseContent === undefined) {
      console.error('❌ Groq returned null/undefined');
      throw new Error('No response generated from AI');
    }
    
    // Handle object response (shouldn't happen with Groq, but safety check)
    if (typeof responseContent === 'object' && responseContent !== null) {
      console.warn('⚠️ Groq returned object:', JSON.stringify(responseContent, null, 2));
      responseContent = responseContent.text 
        || responseContent.content 
        || responseContent.message
        || responseContent.data
        || JSON.stringify(responseContent);
    }
    
    // Force to string and validate
    responseContent = String(responseContent).trim();
    
    // Final validation - reject [object Object] or empty responses
    if (!responseContent || responseContent === '[object Object]' || responseContent === 'undefined' || responseContent === 'null') {
      console.error('❌ Invalid response after conversion:', responseContent);
      throw new Error('Invalid response format from AI. Please try again.');
    }
    
    console.log('✅ Valid response:', responseContent.length, 'chars');
    
    return responseContent;
  } catch (error) {
    console.error('Groq API Error:', error);
    
    // Provide specific error messages
    if (error.message?.includes('API key') || error.status === 401) {
      throw new Error('❌ Invalid Groq API key. Please:\n1. Visit https://console.groq.com/keys\n2. Create a new API key\n3. Update GROQ_API_KEY in backend/.env\n4. Restart the backend server');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
      throw new Error('⏳ API quota exceeded. Wait a moment or check your Groq account at https://console.groq.com/');
    }
    
    throw new Error(`🤖 AI Error: ${error.message || 'Unknown error'}. Check backend logs for details.`);
  }
};

// Chat endpoint
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, conversationId, responseLength = 'auto' } = req.body;
    
    console.log('📩 Received chat request:', { 
      user: req.user?.email || req.user?.uid,
      messageLength: message?.length,
      conversationId,
      responseLength
    });
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        message: 'Please enter a message'
      });
    }

    // Generate AI response using Groq
    console.log(`🤖 Generating ${responseLength} AI response...`);
    let aiResponse = await generateGroqResponse(message, [], responseLength);
    
    // Extra validation layer
    if (typeof aiResponse === 'object' && aiResponse !== null) {
      console.error('❌ Response is still an object after generation!');
      aiResponse = JSON.stringify(aiResponse);
    }
    
    aiResponse = String(aiResponse).trim();
    
    // Reject invalid responses
    if (aiResponse === '[object Object]' || aiResponse === 'undefined' || aiResponse === 'null' || !aiResponse) {
      console.error('❌ Final response invalid:', aiResponse);
      return res.status(500).json({
        error: 'Invalid AI response',
        message: 'The AI generated an invalid response. Please try again.'
      });
    }
    
    console.log('✅ AI response ready:', {
      type: typeof aiResponse,
      length: aiResponse.length,
      preview: aiResponse.substring(0, 100)
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
