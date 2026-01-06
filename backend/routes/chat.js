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
} else {
  console.warn('⚠️  GROQ_API_KEY not found.');
}

// AI response generator - using Groq only
const generateAIResponse = async (message, conversationHistory = []) => {
  return await generateGroqResponse(message, conversationHistory);
};
// Groq response generator
const generateGroqResponse = async (message, conversationHistory = [], responseLength = 'auto') => {
  try {
    if (!groq) {
      return `🤖 Demo Mode: You asked "${message}"\n\n⚠️ AI is not configured. To enable AI responses:\n\n**Groq (Free & Fast)**\n1. Visit https://console.groq.com/keys\n2. Create a FREE API key\n3. Add GROQ_API_KEY to backend/.env\n\n4. Restart the backend server`;
    }

    // Limit conversation history to last 4 messages for speed
    const recentHistory = conversationHistory.slice(-4);

    // Determine response style based on length preference
    let systemPrompt = '';
    let maxTokens = 1500;
    
    if (responseLength === 'short') {
      maxTokens = 800;
      systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. Answer concisely and directly.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

Guidelines:
- Give brief, direct answers (1-3 sentences)
- Start with the key point immediately
- Use simple, clear language
- For code: minimal comments, clean syntax
- Format: Use **bold** for emphasis, \`code\` for inline code

Be helpful, accurate, and concise.`;
    } else if (responseLength === 'detailed') {
      maxTokens = 3000;
      systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. Provide comprehensive, detailed responses.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

Guidelines:
- Start with a clear overview (2-3 sentences)
- Break down complex topics into sections with **headings**
- Use bullet points and numbered lists for clarity
- Provide examples and context
- For code:
  - Use \`\`\`language code blocks with proper syntax
  - Add detailed comments explaining logic
  - Show multiple approaches when relevant
  - Include example output or usage
- Explain edge cases and best practices
- Use **bold** for key terms, \`code\` for inline code
- End with a summary or next steps when appropriate

Be thorough, educational, and well-structured like ChatGPT.`;
    } else {
      // Auto mode - balanced ChatGPT style
      maxTokens = 1500;
      systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. Provide helpful, well-formatted responses.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

Guidelines:
- Begin with a brief, clear summary (1-2 sentences)
- Structure information with bullet points or numbered lists
- Use sections with **bold headings** for complex topics
- For code:
  - Use \`\`\`language code blocks (python, javascript, etc.)
  - Add helpful comments
  - Explain what the code does before/after the block
  - Show example output when relevant
- Use **bold** for important terms
- Use \`backticks\` for inline code, commands, or file names
- Keep responses clear, organized, and professional
- Format like:

[Brief introduction]

**Main Points:**
- Key concept 1
- Key concept 2

\`\`\`language
code example
\`\`\`

**Output:** [expected result]

Be helpful, accurate, and well-formatted like ChatGPT.`;
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
    
    console.log('🔍 Raw Groq response type:', typeof responseContent);
    console.log('🔍 Raw response:', responseContent);
    
    // Robust object-to-string conversion
    if (responseContent === null || responseContent === undefined) {
      console.error('❌ Groq returned null/undefined');
      return 'No response generated';
    }
    
    if (typeof responseContent === 'object') {
      console.warn('⚠️ Groq returned object:', JSON.stringify(responseContent, null, 2));
      // Try multiple extraction paths
      responseContent = responseContent.text 
        || responseContent.content 
        || responseContent.message
        || responseContent.data
        || JSON.stringify(responseContent);
    }
    
    // Force to string and validate
    responseContent = String(responseContent).trim();
    
    if (!responseContent || responseContent === 'No response generated' || responseContent === '[object Object]') {
      console.error('❌ Invalid response content:', responseContent);
      return 'No response generated. Please try again.';
    }
    
    console.log('✅ Final response type:', typeof responseContent);
    console.log('✅ Response length:', responseContent.length);
    console.log('📝 Response preview:', responseContent.substring(0, 150) + '...');
    
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

    // Generate AI response
    console.log(`🤖 Generating ${responseLength} AI response...`);
    let aiResponse = await generateGroqResponse(message, [], responseLength);
    
    // Final safety check - ensure response is a string
    if (typeof aiResponse === 'object' && aiResponse !== null) {
      console.error('❌ AI response is still an object!', JSON.stringify(aiResponse, null, 2));
      aiResponse = String(aiResponse.text || aiResponse.content || aiResponse.message || JSON.stringify(aiResponse));
    }
    
    // Force string conversion and validate
    aiResponse = String(aiResponse).trim();
    
    if (aiResponse === '[object Object]' || !aiResponse) {
      console.error('❌ Invalid final response:', aiResponse);
      return res.status(500).json({
        error: 'Invalid AI response',
        message: 'The AI generated an invalid response. Please try again.'
      });
    }
    
    console.log('✅ AI response generated:', {
      type: typeof aiResponse,
      length: aiResponse.length,
      hasCodeBlock: aiResponse.includes('```'),
      isString: typeof aiResponse === 'string',
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
