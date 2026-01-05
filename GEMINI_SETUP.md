# Setting Up Google Gemini AI (Gemma 3 27B)

## Quick Setup Guide

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key

### Step 2: Configure Backend

1. Open `backend/.env` file (create from `.env.example` if it doesn't exist)
2. Add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3: Install Dependencies

```bash
cd backend
npm install
```

This will install the `@google/generative-ai` package needed for Gemini integration.

### Step 4: Restart Backend Server

```bash
npm run dev
```

You should see: ✅ Gemini AI initialized with Gemma 3 27B model

## Model Information

**Model**: `gemma-2-27b-it`
- **Parameters**: 27 billion
- **Context Window**: Large context support
- **Capabilities**: 
  - Natural conversations
  - Code generation
  - Question answering
  - Creative writing
  - Reasoning and analysis

## Configuration Options

In `backend/routes/chat.js`, you can customize:

```javascript
generationConfig: {
  maxOutputTokens: 2048,  // Maximum response length
  temperature: 0.9,        // Creativity (0.0-1.0)
  topP: 0.95,             // Diversity threshold
  topK: 40,               // Token sampling
}
```

### Temperature Guide:
- **0.0-0.3**: More focused, deterministic responses
- **0.4-0.7**: Balanced creativity and consistency
- **0.8-1.0**: More creative and diverse responses

## Features Included

✅ **Conversation History**: Maintains context across messages
✅ **Error Handling**: Graceful fallbacks on API errors
✅ **Demo Mode**: Works without API key (shows demo responses)
✅ **Token Optimization**: Efficient token usage

## Troubleshooting

### "API key not valid" Error
- Verify your API key is correct in `.env`
- Make sure there are no extra spaces or quotes
- Check if your API key has proper permissions

### Rate Limit Errors
- Free tier has rate limits
- Consider upgrading to paid plan for higher limits
- Implement rate limiting on your frontend

### Model Not Available
- The model name is `gemma-2-27b-it`
- If unavailable, you can use alternatives:
  - `gemini-pro` (default Gemini model)
  - `gemini-1.5-pro` (latest version)

## Alternative Models

To use a different Gemini model, change this line in `backend/routes/chat.js`:

```javascript
// For Gemini Pro
model = genAI.getGenerativeModel({ model: "gemini-pro" });

// For Gemini 1.5 Pro
model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// For Gemma 2 9B (lighter model)
model = genAI.getGenerativeModel({ model: "gemma-2-9b-it" });
```

## Testing

1. Start both frontend and backend
2. Login to ThagavalGPT
3. Send a message
4. You should receive AI-generated responses from Gemini!

## API Pricing

- **Free Tier**: 60 requests per minute
- **Paid Plans**: Higher limits and additional features
- Check current pricing at [Google AI Pricing](https://ai.google.dev/pricing)

## Support

If you encounter issues:
1. Check backend console for error messages
2. Verify API key is correctly set
3. Ensure you have internet connection
4. Check Google AI Studio status

---

**Ready to chat with Gemini! 🚀**
