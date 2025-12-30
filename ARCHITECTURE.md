# ThagavalGPT Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                      (http://localhost:3000)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                             │
│  ┌───────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Login.js     │  │   Chat.js    │  │   api.js          │   │
│  │               │  │              │  │   (Axios)         │   │
│  │  - Auth UI    │  │  - Chat UI   │  │  - Interceptors   │   │
│  │  - Validation │  │  - Messages  │  │  - Auto-refresh   │   │
│  └───────────────┘  └──────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                      JWT Bearer Token
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FLASK BACKEND                              │
│                   (http://localhost:5000)                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                 API ROUTES                                 │ │
│  │  /api/auth/*     - Authentication endpoints               │ │
│  │  /api/chat/*     - Chat & messaging endpoints             │ │
│  │  /api/health     - Health check                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────┴───────────────────────────────┐ │
│  │                                                             │ │
│  ▼                            ▼                                │ │
│  JWT Middleware              Database Layer                   │ │
│  - Validate token            - User CRUD                      │ │
│  - Check expiry              - Session management             │ │
│  - Refresh logic             - Message storage                │ │
│                                                                 │ │
│                              │                                  │ │
│                              ▼                                  │ │
│                        AI Service Layer                        │ │
│                        - OpenAI integration                    │ │
│                        - Gemini integration                    │ │
│                        - Auto provider selection               │ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SQLITE DATABASE                            │
│                        (chatbot.db)                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   users     │  │chat_sessions │  │    messages        │   │
│  │             │  │              │  │                    │   │
│  │  - id       │  │  - id        │  │  - id              │   │
│  │  - email    │  │  - user_id   │  │  - session_id      │   │
│  │  - password │  │  - title     │  │  - role (user/ai)  │   │
│  │  - name     │  │  - timestamps│  │  - content         │   │
│  └─────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL AI APIS                             │
│                                                                  │
│     ┌──────────────────┐           ┌──────────────────┐        │
│     │   OpenAI API     │           │   Google Gemini  │        │
│     │   (Optional)     │           │   (Optional)     │        │
│     └──────────────────┘           └──────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User Login
   ┌──────────┐
   │  Login   │
   │  Form    │
   └────┬─────┘
        │ POST /api/auth/login
        │ {email, password}
        ▼
   ┌─────────────┐
   │   Backend   │
   │  Validates  │───► ┌────────────┐
   │  Credentials│     │  Database  │
   └──────┬──────┘     │   Query    │
          │            └────────────┘
          │ Success
          ▼
   ┌──────────────────────┐
   │  Generate Tokens     │
   │  - Access (1hr)      │
   │  - Refresh (30days)  │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────┐
   │ Return to Client │
   │ Store in         │
   │ localStorage     │
   └──────────────────┘

2. Authenticated Request
   ┌────────────┐
   │   Client   │
   │   Request  │
   └─────┬──────┘
         │ Authorization: Bearer <token>
         ▼
   ┌─────────────────┐
   │  Axios          │
   │  Interceptor    │◄─── Auto-add token
   └─────┬───────────┘
         │
         ▼
   ┌─────────────────┐
   │   Backend       │
   │   @jwt_required │◄─── Validate token
   └─────┬───────────┘
         │
         ├──► Valid → Process request
         │
         └──► Expired → Return 401

3. Token Refresh (Automatic)
   ┌────────────┐
   │  401 Error │
   └─────┬──────┘
         │
         ▼
   ┌──────────────────┐
   │ Axios Interceptor│
   │ Catches 401      │
   └─────┬────────────┘
         │
         ▼
   ┌──────────────────────┐
   │ POST /api/auth/refresh│
   │ with refresh token   │
   └─────┬────────────────┘
         │
         ▼
   ┌──────────────────┐
   │  New Access      │
   │  Token Received  │
   └─────┬────────────┘
         │
         ▼
   ┌───────────────────┐
   │ Retry Original    │
   │ Request with      │
   │ New Token         │
   └───────────────────┘
```

## Message Flow (Optimized for Speed)

```
User Types Message
        │
        ▼
┌────────────────────┐
│  Input Validation  │
└────────┬───────────┘
         │
         ▼
┌─────────────────────────┐
│  OPTIMISTIC UPDATE      │◄─── Message appears INSTANTLY
│  Add to UI immediately  │     (No waiting for API)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  API Call (Background)  │
│  POST /api/chat         │
│  {message, session_id}  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Backend Processing     │
│  1. Validate token      │
│  2. Store in DB         │◄─── FAST: SQLite insert
│  3. Get context (20msg)│◄─── FAST: Indexed query
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  AI Service             │
│  - Generate response    │◄─── Depends on provider
│  - Context-aware        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Store AI Response      │◄─── FAST: DB insert
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Return Full History    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Update UI with         │
│  Complete History       │
└─────────────────────────┘

Total Time Breakdown:
- UI Update: <10ms (instant)
- DB Operations: <50ms (fast)
- AI Response: 500ms-3s (depends on provider)
- User sees message: IMMEDIATELY
- User sees response: After AI completes
```

## Database Relationships

```
┌──────────────┐
│    users     │
│              │
│  id (PK)     │
│  email       │◄─────┐
│  password    │      │
│  name        │      │ Foreign Key
│  created_at  │      │
└──────────────┘      │
                      │
                      │
        ┌─────────────┘
        │
        │
┌───────▼──────────┐
│ chat_sessions    │
│                  │
│  id (PK)         │
│  user_id (FK)    │◄────┐
│  title           │     │
│  created_at      │     │ Foreign Key
│  updated_at      │     │
└──────────────────┘     │
                         │
                         │
          ┌──────────────┘
          │
          │
┌─────────▼────────┐
│    messages      │
│                  │
│  id (PK)         │
│  session_id (FK) │
│  role            │
│  content         │
│  created_at      │
└──────────────────┘
```

## File Structure

```
ThagavalGPT/
│
├── backend/
│   ├── app.py                  # Main Flask application
│   ├── database.py             # SQLite database layer
│   ├── ai_service.py           # AI provider integration
│   ├── setup.py                # Interactive setup wizard
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Configuration (auto-created)
│   ├── .env.example            # Configuration template
│   ├── .gitignore              # Git ignore rules
│   ├── venv/                   # Virtual environment
│   └── chatbot.db              # SQLite database (auto-created)
│
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js        # Authentication UI
│   │   │   ├── Login.css       # Login styles
│   │   │   ├── Chat.js         # Chat interface
│   │   │   └── Chat.css        # Chat styles
│   │   ├── services/
│   │   │   └── api.js          # API service with interceptors
│   │   ├── App.js              # Main app component
│   │   ├── App.css             # App styles
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json            # Node dependencies
│   ├── .gitignore              # Git ignore rules
│   └── node_modules/           # Node dependencies
│
├── README.md                   # Main documentation
├── QUICKSTART.md               # Quick start guide
├── ENHANCEMENTS.md             # Features documentation
├── IMPLEMENTATION.md           # Implementation details
├── ARCHITECTURE.md             # This file
├── setup-all.bat               # Automated setup
├── start-all.bat               # Start all services
├── start-backend.bat           # Start backend only
├── start-frontend.bat          # Start frontend only
├── start-backend.sh            # Unix backend start
└── start-frontend.sh           # Unix frontend start
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  ┌────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   React    │  │  Axios   │  │ React Router    │  │
│  │   18.2.0   │  │  1.6.5   │  │    6.21.3       │  │
│  └────────────┘  └──────────┘  └──────────────────┘  │
│                                                         │
│  ┌────────────┐                                        │
│  │  React     │                                        │
│  │  Markdown  │                                        │
│  │  9.0.1     │                                        │
│  └────────────┘                                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│  ┌─────────────┐  ┌────────────────┐  ┌────────────┐  │
│  │   Flask     │  │ Flask-JWT-     │  │ Flask-CORS │  │
│  │   3.0.0     │  │ Extended 4.6.0 │  │   4.0.0    │  │
│  └─────────────┘  └────────────────┘  └────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌────────────┐                      │
│  │   SQLite    │  │  Python    │                      │
│  │   (built-in)│  │  Dotenv    │                      │
│  └─────────────┘  └────────────┘                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    AI PROVIDERS                         │
│  ┌──────────────┐          ┌──────────────────────┐   │
│  │   OpenAI     │          │  Google Generative   │   │
│  │   1.7.1      │          │  AI 0.3.2            │   │
│  │  (Optional)  │          │  (Optional)          │   │
│  └──────────────┘          └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

**This architecture provides:**
- ✅ Secure authentication with auto-refresh
- ✅ Fast response times with optimistic updates
- ✅ Persistent data storage with SQLite
- ✅ Scalable design for future enhancements
- ✅ Professional UI/UX
- ✅ Enterprise-grade security
