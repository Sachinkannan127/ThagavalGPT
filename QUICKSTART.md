# 🚀 Quick Start Guide - ThagavalGPT

## ⚡ Fast Setup (5 Minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run setup wizard (automatic configuration)
python setup.py

# Start backend server
python app.py
```

The backend will run on **http://localhost:5000**

### Step 2: Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will automatically open at **http://localhost:3000**

### Step 3: Login

Use demo credentials:
- **Email**: user@example.com
- **Password**: user123

---

## 🎯 New Features Added

### ✅ 1. Full End-to-End Authentication
- **JWT tokens** with automatic refresh
- **Secure sessions** with token expiration handling
- **Protected routes** with middleware
- **Token blacklisting** for secure logout
- **Automatic re-authentication** on token expiry

### ✅ 2. Automatic API Key Configuration
- **Setup wizard** (`python setup.py`) for easy configuration
- **Auto-generated** secure JWT secret keys
- **Interactive prompts** for OpenAI and Gemini keys
- **.env file** automatically created with secure defaults

### ✅ 3. Quick Response Optimization
- **Axios interceptors** for automatic request/response handling
- **Optimistic UI updates** - instant message display
- **Database caching** with SQLite for fast history retrieval
- **Session management** for persistent conversations
- **Error recovery** with automatic retry logic

### ✅ 4. Database Integration
- **SQLite database** for persistent data storage
- **User management** with secure authentication
- **Chat sessions** support multiple conversations
- **Message history** with fast retrieval
- **Auto-initialization** on first run

---

## 🔑 API Key Configuration

### Automatic Setup (Recommended)
```bash
cd backend
python setup.py
```

The wizard will guide you through:
1. JWT secret generation (automatic)
2. OpenAI API key (optional)
3. Gemini API key (optional)
4. Default AI provider selection

### Manual Setup
Edit `backend/.env`:
```env
JWT_SECRET_KEY=your-secure-key-here
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
DEFAULT_AI_PROVIDER=auto
```

**Get API Keys:**
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://makersuite.google.com/app/apikey

---

## 🎨 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| 🔐 Authentication | ✅ | JWT with refresh tokens |
| 💾 Database | ✅ | SQLite persistent storage |
| 🤖 AI Integration | ✅ | OpenAI & Gemini support |
| ⚡ Quick Response | ✅ | Optimized API calls |
| 📱 Responsive UI | ✅ | Works on all devices |
| 🎨 Professional Theme | ✅ | Modern gradient design |
| 💬 Chat History | ✅ | Persistent conversations |
| 🔄 Auto Refresh | ✅ | Token auto-renewal |

---

## 📊 Architecture

```
ThagavalGPT/
├── backend/                    # Python Flask API
│   ├── app.py                 # Main API with auth & chat
│   ├── database.py            # SQLite database layer
│   ├── ai_service.py          # AI provider integration
│   ├── setup.py               # Interactive setup wizard
│   ├── .env                   # Your configuration
│   └── chatbot.db             # SQLite database (auto-created)
│
└── frontend/                  # React SPA
    ├── src/
    │   ├── services/
    │   │   └── api.js         # API service with interceptors
    │   ├── components/
    │   │   ├── Login.js       # Auth component
    │   │   └── Chat.js        # Chat interface
    │   └── App.js             # Main app with routing
    └── package.json
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** with secure token generation
- ✅ **Token Refresh** mechanism for seamless sessions
- ✅ **Token Blacklisting** for secure logout
- ✅ **Password Validation** (minimum 6 characters)
- ✅ **CORS Protection** with origin whitelisting
- ✅ **SQL Injection Protection** with parameterized queries
- ✅ **Error Handling** without exposing sensitive data

---

## 🚀 Performance Optimizations

### Backend
- Database indexing for fast queries
- Context-aware AI responses (last 20 messages)
- Efficient session management
- Connection pooling ready

### Frontend
- Optimistic UI updates
- Automatic token refresh
- Request/response caching
- Error recovery with retry logic
- Debounced input handling

---

## 🛠️ Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```python
# Edit backend/app.py, change port:
app.run(debug=True, host='0.0.0.0', port=5001)
```

**Database locked:**
```bash
# Delete database and restart:
rm chatbot.db
python app.py
```

**API key errors:**
```bash
# Reconfigure:
python setup.py
```

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend is running on port 5000
- Check console for CORS errors
- Verify `http://localhost:5000/api/health` responds

**Token expired errors:**
- Clear browser localStorage
- Login again
- Tokens auto-refresh if valid

---

## 📱 Testing the Application

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Backend is running",
  "ai_providers": {
    "openai": false,
    "gemini": false
  }
}
```

### 2. Test Authentication
- Open http://localhost:3000
- Click "Sign Up" to create account
- Or use demo credentials

### 3. Test Chat
- Send a message
- Observe instant UI update
- Check AI response
- Test chat history persistence

---

## 🎯 What Makes This Fast?

1. **Optimistic Updates**: Messages appear instantly
2. **Database Caching**: History loads from local SQLite
3. **Token Auto-Refresh**: No login interruptions
4. **Axios Interceptors**: Automatic request handling
5. **Session Management**: Context preserved efficiently
6. **Error Recovery**: Smart retry logic

---

## 📈 Next Steps

- [ ] Add streaming responses for real-time AI output
- [ ] Implement file upload support
- [ ] Add voice input/output
- [ ] Deploy to production server
- [ ] Add user profile management
- [ ] Implement chat export functionality

---

## 💡 Pro Tips

1. **Run setup wizard** before first use: `python setup.py`
2. **Keep tokens secure** - never commit .env file
3. **Use demo mode** without API keys for testing
4. **Monitor backend logs** for AI provider status
5. **Clear chat history** to start fresh conversations

---

## 🤝 Support

Need help? Check:
- Backend logs in terminal
- Browser console for frontend errors
- Database file: `backend/chatbot.db`
- Configuration: `backend/.env`

---

**Happy Chatting! 🎉**
