# Setting Up Groq AI (Llama 3.3 70B)

ThagavalGPT now uses **Groq** for lightning-fast AI responses! Groq is FREE, faster than other providers, and uses powerful open-source models.

---

## Quick Setup (3 Steps)

### Step 1: Get Your FREE Groq API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in (completely free!)
3. Click **"Create API Key"**
4. Copy your API key

### Step 2: Configure Your API Key

1. Open `backend/.env`
2. Add your Groq API key:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### Step 3: Restart the Backend

```bash
cd backend
node server.js
```

You should see: ✅ **Groq AI initialized with llama-3.3-70b-versatile model**

---

## Why Groq?

✅ **FREE** - Generous free tier  
⚡ **FAST** - 10x faster than competitors  
🚀 **POWERFUL** - Llama 3.3 70B model  
🌍 **RELIABLE** - No quota issues  
🔓 **OPEN** - Uses open-source models

---

## Available Models

You can use these FREE Groq models:

- `llama-3.3-70b-versatile` (default - best balance)
- `llama-3.1-70b-versatile` (stable)
- `llama-3.1-8b-instant` (fastest)
- `mixtral-8x7b-32768` (long context)
- `gemma2-9b-it` (Google's open model)

### Change Model

To use a different model, edit `backend/routes/chat.js`:

```javascript
let modelName = 'llama-3.1-8b-instant'; // For fastest responses
// or
let modelName = 'mixtral-8x7b-32768'; // For longer context
```

---

## Test Your Setup

1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   node server.js
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. Open http://localhost:3000

3. Login and start chatting

4. You should receive AI-generated responses from Groq!

---

## Troubleshooting

### "GROQ_API_KEY not found"
- Make sure you added the key to `backend/.env`
- Restart the backend server

### "Invalid API key"
- Generate a new key at https://console.groq.com/keys
- Make sure you copied the entire key

### "Rate limit exceeded"
- Groq has generous limits, but if you hit them, wait a minute
- Consider upgrading to paid tier for unlimited access

---

**Ready to chat with Groq! 🚀**
