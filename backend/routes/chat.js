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

    // Use more conversation history (up to 10 messages) for better context
    const recentHistory = conversationHistory.slice(-10);

    // Determine response style based on length preference and code mode
    let systemPrompt = '';
    let maxTokens = 1500;
    
    if (codeMode) {
      // Code Generation Mode - Specialized for code tasks
      maxTokens = 4000;
      systemPrompt = `You are an elite Code Generator AI with deep expertise in software development, architecture, and best practices.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

**CRITICAL RULES FOR CODE GENERATION:**

1. **ALWAYS GENERATE COMPLETE, PRODUCTION-READY CODE**
   - Never provide pseudo-code, placeholders, or incomplete snippets
   - Include ALL necessary imports, dependencies, and setup
   - Code must be copy-paste ready and immediately executable
   - Handle all edge cases and error scenarios

2. **PROPER CODE FORMATTING & DOCUMENTATION**
   - Use triple backticks with language specification:
     \`\`\`javascript
     \`\`\`python
     \`\`\`typescript
     \`\`\`java
     \`\`\`html
     \`\`\`css
     \`\`\`sql
     \`\`\`bash
   - Maintain consistent indentation (2 or 4 spaces based on language standards)
   - Follow language-specific style guides (PEP 8 for Python, Airbnb for JavaScript, etc.)
   - Add clear, helpful comments explaining complex logic
   - Include JSDoc/docstrings for all functions with parameters and return types
   - Document side effects and important considerations

3. **COMPREHENSIVE CODE STRUCTURE**
   For any code request, provide:
   - **Brief Explanation** (1-2 sentences): What the code does
   - **Complete Code**: Full implementation in properly formatted code blocks
   - **Key Features**: Bullet list of important capabilities
   - **Usage Example**: How to run/use the code
   - **Important Notes**: Any dependencies, setup steps, or considerations

4. **BEST PRACTICES & QUALITY**
   - Write clean, maintainable, self-documenting code
   - Follow DRY (Don't Repeat Yourself) principle
   - Include comprehensive error handling with try-catch/error boundaries
   - Consider security implications (input validation, XSS, SQL injection, etc.)
   - Optimize for performance when relevant
   - Use modern language features appropriately (ES6+, Python 3.10+, etc.)
   - Apply SOLID principles for OOP
   - Include type hints/annotations when applicable

5. **TESTING & RELIABILITY**
   When appropriate, include:
   - Unit test examples
   - Input validation
   - Edge case handling
   - Error messages that help debugging

6. **SUPPORTED LANGUAGES & FRAMEWORKS**
   Expert in: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin
   Frameworks: React, Vue, Angular, Node.js, Express, Django, Flask, Spring Boot, .NET
   Databases: SQL, MongoDB, PostgreSQL, MySQL
   DevOps: Docker, CI/CD, Git

**RESPONSE STRUCTURE EXAMPLE:**

\`\`\`
**[Brief Title]**

[1-2 sentence explanation]

\`\`\`[language]
// Complete, production-ready code
// With comprehensive comments
\`\`\`

**Key Features:**
- Feature 1
- Feature 2

**Usage:**
\`\`\`bash
# How to run
\`\`\`

**Notes:**
- Important consideration 1
- Important consideration 2
\`\`\`

**YOUR MISSION:** Generate professional, production-quality code that developers can trust and use immediately. Always prioritize correctness, security, and maintainability.`;
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
      systemPrompt = `You are ChatGPT, an advanced AI assistant by OpenAI, known for providing comprehensive, insightful, and accurate responses.

Knowledge cutoff: 2023-10
Current date: ${new Date().toISOString().split('T')[0]}

**CORE PRINCIPLES:**

1. **CLARITY & DEFINITIONS**
   - Start with clear definitions for technical terms
   - Explain concepts in simple, accessible language
   - Build from fundamentals to advanced concepts
   - Use analogies to make complex ideas relatable

2. **COMPREHENSIVE EXPLANATIONS**
   - Provide meaningful context and real-world applications
   - Explain WHY something is important, not just WHAT it is
   - Break down complex topics into digestible sections
   - Include multiple perspectives when relevant
   - Address both benefits and limitations

3. **STRUCTURED RESPONSES**
   Use markdown formatting:
   - **Bold** for key terms and important points
   - \`Backticks\` for inline code, commands, file names
   - ## Headings for major sections
   - Bullet points for lists and features
   - Numbered lists for sequential steps
   - > Block quotes for important notes or warnings

4. **CODE REQUESTS - FULL IMPLEMENTATION**
   When asked for code, ALWAYS provide:
   
   **Brief Explanation:**
   [1-2 sentences describing what the code does]
   
   **Complete Code:**
   \`\`\`javascript
   // Full, working implementation
   // with helpful comments
   \`\`\`
   
   **How It Works:**
   [Explanation of key parts and logic]
   
   **Usage Example:**
   \`\`\`bash
   # How to run/use it
   \`\`\`
   
   **Key Features:**
   - Feature 1
   - Feature 2
   
   **Supported languages:** JavaScript, Python, TypeScript, Java, C++, HTML, CSS, SQL, Bash, Go, Rust, PHP, Ruby, Kotlin, Swift, and more

5. **PROBLEM SOLVING APPROACH**
   - Understand the core problem before providing solution
   - Consider edge cases and potential issues
   - Offer multiple approaches when appropriate
   - Explain trade-offs between different solutions
   - Provide best practices and recommendations

6. **EDUCATIONAL DEPTH**
   - Connect new concepts to familiar ones
   - Explain the "why" behind recommendations
   - Include practical examples from real-world scenarios
   - Anticipate follow-up questions and address them
   - Provide resources for further learning when relevant

7. **ACCURACY & HONESTY**
   - Admit when uncertain rather than guessing
   - Distinguish between facts and opinions
   - Acknowledge limitations of approaches
   - Correct misconceptions clearly
   - Stay within knowledge cutoff date

**RESPONSE QUALITY STANDARDS:**
- Accurate and up-to-date information
- Well-structured and easy to follow
- Practical and actionable advice
- Proper markdown formatting
- Complete code examples (never pseudo-code)
- Thoughtful and comprehensive

**YOUR MISSION:** Provide responses that are not just correct, but truly helpful - combining accuracy, clarity, and depth to ensure users fully understand the topic and can apply the knowledge effectively.`;
    }
   
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
    const { message, conversationId, responseLength = 'auto', codeMode = false, conversationHistory = [] } = req.body;
    
    console.log('📩 Received chat request:', { 
      user: req.user?.email || req.user?.uid,
      messageLength: message?.length,
      conversationId,
      responseLength,
      codeMode: codeMode ? '💻 CODE MODE' : '💬 CHAT MODE',
      historyLength: conversationHistory?.length || 0
    });
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        message: 'Please enter a message'
      });
    }

    // Generate AI response with conversation history for context
    console.log(`🤖 Generating ${responseLength} response ${codeMode ? 'in CODE MODE' : ''} with ${conversationHistory?.length || 0} history messages...`);
    let aiResponse = await generateGroqResponse(message, conversationHistory || [], responseLength, codeMode);
    
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

// Streaming chat endpoint for better UX
router.post('/chat/stream', verifyToken, async (req, res) => {
  try {
    const { message, conversationId, responseLength = 'auto', codeMode = false, conversationHistory = [] } = req.body;
    
    console.log('📩 Received streaming chat request:', { 
      user: req.user?.email || req.user?.uid,
      messageLength: message?.length,
      conversationId,
      responseLength,
      codeMode: codeMode ? '💻 CODE MODE' : '💬 CHAT MODE',
      historyLength: conversationHistory?.length || 0
    });
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        message: 'Please enter a message'
      });
    }

    if (!groq) {
      return res.json({
        message: `🤖 Demo Mode: AI is not configured. To enable AI responses:\n\n**Groq (Free & Fast)**\n1. Visit https://console.groq.com/keys\n2. Create a FREE API key\n3. Add GROQ_API_KEY to backend/.env\n4. Restart the backend server`,
        conversationId: conversationId,
        timestamp: new Date().toISOString()
      });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Build conversation context
    const recentHistory = (conversationHistory || []).slice(-10);
    
    // System prompts (same as non-streaming)
    let systemPrompt = '';
    let maxTokens = 1500;
    
    if (codeMode) {
      maxTokens = 4000;
      systemPrompt = `You are an elite Code Generator AI...`; // Use same prompt as above
    } else if (responseLength === 'short') {
      maxTokens = 1500;
      systemPrompt = `You are ChatGPT, optimized for concise responses...`;
    } else if (responseLength === 'detailed') {
      maxTokens = 4500;
      systemPrompt = `You are ChatGPT, specialized in comprehensive explanations...`;
    } else {
      maxTokens = 3500;
      systemPrompt = `You are ChatGPT, an advanced AI assistant...`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Stream response from Groq
    const stream = await groq.chat.completions.create({
      model: groqModel,
      messages: messages,
      temperature: 0.7,
      max_tokens: maxTokens,
      top_p: 0.95,
      frequency_penalty: 0.3,
      stream: true
    });

    let fullResponse = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        // Send chunk to client
        res.write(`data: ${JSON.stringify({ content: content, done: false })}\n\n`);
      }
    }

    // Send completion signal
    res.write(`data: ${JSON.stringify({ content: '', done: true, fullResponse: fullResponse })}\n\n`);
    res.end();

  } catch (error) {
    console.error('❌ Streaming chat error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
    res.end();
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
