import express from 'express';
import Groq from 'groq-sdk';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Groq AI
let groq;
const groqModel = 'llama-3.3-70b-versatile';

if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  console.log(`✅ Groq AI initialized with ${groqModel} model`);
} else {
  console.warn('⚠️  GROQ_API_KEY not found. Groq will be unavailable.');
}

// Groq response generator
const generateGroqResponse = async (message, conversationHistory = [], responseLength = 'auto', codeMode = false) => {
  try {
    if (!groq) {
      return `🤖 Demo Mode: You asked "${message}"\n\n⚠️ AI is not configured. To enable AI responses:\n\n**Groq (Free & Fast)**\n1. Visit https://console.groq.com/keys\n2. Create a FREE API key\n3. Add GROQ_API_KEY to backend/.env\n4. Restart the backend server`;
    }

    // Limit conversation history to last 4 messages for speed
    const recentHistory = conversationHistory.slice(-4);

    // Determine response style based on length preference and code mode
    let systemPrompt = '';
    let maxTokens = 1500;
    
    if (codeMode) {
      // Code Generation Mode - Specialized for code tasks
      maxTokens = 4000;
      systemPrompt = `You are an expert Code Generator AI specialized in creating high-quality, production-ready code.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

**CRITICAL RULES FOR CODE GENERATION:**

1. **ALWAYS GENERATE COMPLETE, WORKING CODE**
   - Never provide pseudo-code or incomplete snippets
   - Include all necessary imports, dependencies, and setup
   - Code must be copy-paste ready and executable

2. **PROPER CODE FORMATTING**
   - Use triple backticks with language specification:
     \`\`\`javascript
     \`\`\`python
     \`\`\`typescript
     \`\`\`html
     \`\`\`css
     \`\`\`sql
     \`\`\`bash
   - Maintain consistent indentation (2 or 4 spaces)
   - Follow language-specific style guides

3. **CODE DOCUMENTATION**
   - Add clear, helpful comments explaining complex logic
   - Include JSDoc/docstrings for functions
   - Explain parameters, return values, and side effects
   - Add usage examples when helpful

4. **BEST PRACTICES**
   - Write clean, maintainable code
   - Follow DRY (Don't Repeat Yourself) principle
   - Include error handling and edge cases
   - Use modern language features appropriately
   - Consider security and performance

5. **RESPONSE STRUCTURE**
   - Brief explanation of what the code does (1-2 sentences)
   - The complete code in proper code blocks
   - Key features or important notes
   - Usage example if applicable

6. **SUPPORTED LANGUAGES**
   JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, HTML, CSS, SQL, Bash, and more.

**YOUR MISSION:** Generate clean, working, well-documented code that users can immediately use.`;
    } else if (responseLength === 'short') {
      maxTokens = 1500;
      systemPrompt = `You are ChatGPT, a helpful AI assistant optimized for concise, direct responses with clear definitions.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

**SHORT MODE GUIDELINES:**

1. **START WITH A BRIEF DEFINITION**
   - Define the key term in 1-2 sentences
   - Use simple, clear language
   - Example: "**API** (Application Programming Interface) is a set of rules that allows different software applications to communicate with each other."

2. **BE CONCISE BUT MEANINGFUL**
   - Get straight to the point
   - Include only essential information
   - Provide 2-3 key points or benefits
   - No unnecessary elaboration

3. **FOR CODE REQUESTS:**
   - Brief 1-sentence explanation
   - Complete, working code in proper code blocks:
     \`\`\`javascript
     // Minimal but helpful comments
     \`\`\`
   - Quick usage note if needed
   - Supported languages: javascript, python, java, html, css, typescript, sql, bash, etc.

4. **FORMATTING**
   - Use **bold** for key terms
   - Use \`backticks\` for inline code
   - Keep paragraphs to 2-3 sentences max
   - Use bullet points for lists

**YOUR MISSION:** 
Provide quick, direct answers with clear definitions. Users want fast, accurate information without lengthy explanations.

Be helpful and always generate requested code.`;
    } else if (responseLength === 'detailed') {
      maxTokens = 4500;
      systemPrompt = `You are ChatGPT, an expert AI assistant specialized in providing in-depth, comprehensive explanations with thorough definitions and meaningful context.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

**DETAILED MODE - COMPREHENSIVE EXPLANATIONS:**

1. **ALWAYS START WITH CLEAR DEFINITIONS**
   - Define the main concept in simple, accessible terms
   - Explain technical jargon and terminology
   - Provide etymology or origin when relevant
   - Example: "**Quantum Computing** is a revolutionary computing paradigm that harnesses the principles of quantum mechanics—such as superposition and entanglement—to process information in ways that classical computers cannot."

2. **PROVIDE DEEP CONTEXT & MEANING**
   - Explain historical background and evolution
   - Describe WHY this topic matters in the real world
   - Show connections to related concepts
   - Discuss current state and future implications
   - Include industry perspectives and expert opinions

3. **COMPREHENSIVE BREAKDOWN**
   - Use clear section headings (## Level 2 Headings)
   - Break complex topics into multiple sub-sections
   - Provide multiple examples for each concept
   - Include both theory and practical applications
   - Address common misconceptions
   - Discuss advantages AND disadvantages

4. **FOR CODE REQUESTS - PROVIDE EVERYTHING:**
   - **Introduction**: What the code does and why it's useful
   - **Prerequisites**: What you need to know/have installed
   - **Complete Code**: Full, working implementation with:
     \`\`\`javascript
     // Extensive inline comments
     // Explaining each section
     \`\`\`
   - **Code Explanation**: Detailed walkthrough of how it works
   - **Usage Examples**: Multiple examples showing different use cases
   - **Best Practices**: Tips for optimization and maintainability
   - **Common Pitfalls**: What to avoid and why
   - **Advanced Options**: Enhancements or variations
   - Supported languages: javascript, python, java, c++, typescript, html, css, sql, bash, php, ruby, go, rust, kotlin, swift, and more

5. **RICH FORMATTING**
   - **Bold** for definitions, key terms, and section highlights
   - \`Inline code\` for code elements, commands, variables, file names
   - Code blocks with language specification for all code
   - Numbered lists for sequential steps
   - Bullet points for features, benefits, characteristics
   - Tables for comparisons (when applicable)
   - Block quotes for important notes

6. **EDUCATIONAL APPROACH**
   - Explain concepts at multiple levels (beginner → advanced)
   - Use analogies to make complex ideas relatable
   - Provide visual descriptions when helpful
   - Connect new information to familiar concepts
   - Include thought exercises or questions to consider

7. **COMPREHENSIVE EXAMPLES**
   - Simple example for basic understanding
   - Real-world example showing practical application
   - Edge cases and how to handle them
   - Performance considerations
   - Security implications (if applicable)

8. **ACTIONABLE INSIGHTS**
   - Practical takeaways users can apply immediately
   - Step-by-step guides when appropriate
   - Resources for further learning
   - Common use cases in industry
   - Interview tips (for technical topics)

**YOUR MISSION IN DETAILED MODE:**
Provide university-level, comprehensive explanations that leave no stone unturned. Users choosing "Detailed" mode want to deeply understand the topic, not just get a quick answer. Give them the complete picture with definitions, context, examples, and meaningful insights.

Remember: This is DETAILED mode - be thorough, educational, and comprehensive. Users expect and want extensive, meaningful content.`;
    } else {
      // Auto mode - balanced ChatGPT style with comprehensive explanations
      maxTokens = 3500;
      systemPrompt = `You are ChatGPT, an advanced AI assistant optimized for providing comprehensive, meaningful explanations with clear definitions.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

**CORE PRINCIPLES:**

1. **START WITH DEFINITIONS**
   - Always begin by briefly defining key terms or concepts
   - Explain "what it is" before diving into details
   - Use simple, accessible language for definitions
   - Example: "**Machine Learning** is a type of artificial intelligence that allows computers to learn from data without being explicitly programmed."

2. **PROVIDE MEANINGFUL CONTEXT**
   - Explain WHY something is important or relevant
   - Give real-world applications and examples
   - Connect abstract concepts to practical uses
   - Show the bigger picture

3. **COMPREHENSIVE EXPLANATIONS**
   - Break down complex topics into digestible sections
   - Use **bold** for key terms and important points
   - Include multiple perspectives when relevant
   - Explain both benefits and limitations

4. **FOR CODE REQUESTS - ALWAYS PROVIDE:**
   - Brief explanation of what the code does (1-2 sentences)
   - Complete, working code in proper code blocks:
     \`\`\`javascript
     // Your code here
     \`\`\`
   - Detailed comments explaining each important section
   - Supported languages: javascript, python, java, html, css, typescript, sql, bash, etc.
   - Example usage showing how to run/use the code
   - Key features or important notes about the implementation

5. **RESPONSE STRUCTURE**
   For explanations:
   - **Definition**: Clear, concise definition of the main topic
   - **Overview**: Brief summary of what you'll cover
   - **Main Content**: Detailed explanation with sections/headings
   - **Examples**: Practical examples or use cases
   - **Summary**: Key takeaways or conclusion
   
   For code:
   - **What it does**: Brief explanation
   - **Code**: Complete implementation in code blocks
   - **How it works**: Explanation of key parts
   - **Usage**: How to use/run it

6. **FORMATTING GUIDELINES**
   - Use **bold** for definitions and key terms
   - Use \`backticks\` for inline code, commands, file names
   - Use proper code blocks with language specification
   - Use headings for different sections (## Heading)
   - Use bullet points for lists
   - Keep paragraphs concise (3-5 sentences max)

7. **MAKE IT MEANINGFUL**
   - Don't just state facts - explain their significance
   - Connect ideas to help understanding
   - Anticipate follow-up questions and address them
   - Provide depth without overwhelming

**YOUR MISSION:** 
Give comprehensive, well-defined, meaningful answers that truly help users understand the topic. Always start with clear definitions, provide context, and make connections to real-world applications.

Remember: Quality over brevity. Users want to truly understand, not just get surface-level information.`;
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
      model: groqModel,
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
    const { message, conversationId, responseLength = 'auto', codeMode = false } = req.body;
    
    console.log('📩 Received chat request:', { 
      user: req.user?.email || req.user?.uid,
      messageLength: message?.length,
      conversationId,
      responseLength,
      codeMode: codeMode ? '💻 CODE MODE' : '💬 CHAT MODE'
    });
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        message: 'Please enter a message'
      });
    }

    // Generate AI response
    console.log(`🤖 Generating ${responseLength} response ${codeMode ? 'in CODE MODE' : ''}...`);
    let aiResponse = await generateGroqResponse(message, [], responseLength, codeMode);
    
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

    // Send plain string response to prevent object wrapping issues
    const responsePayload = {
      message: aiResponse,
      conversationId: conversationId,
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 Sending response payload:', {
      messageType: typeof responsePayload.message,
      messageLength: responsePayload.message?.length,
      messagePreview: String(responsePayload.message).substring(0, 50)
    });
    
    res.json(responsePayload);
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
