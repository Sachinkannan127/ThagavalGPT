# ThagavalGPT

A modern ChatGPT/Gemini-style chatbot application with React frontend and Node.js backend, featuring full Firebase authentication and Firestore database integration.

## Features

- 🔐 **Full Firebase Authentication**
  - Email/Password login and registration
  - Password reset functionality
  - Secure token-based authentication

- 💬 **Modern Chat Interface**
  - ChatGPT/Gemini-inspired UI design
  - Real-time message streaming
  - Conversation history management
  - Sidebar with chat list

- 🔥 **Firebase Integration**
  - Firestore database for storing conversations and messages
  - Firebase Storage ready for file uploads
  - Firebase Admin SDK for backend operations

- 🎨 **Beautiful UI/UX**
  - Responsive design
  - Dark theme
  - Smooth animations
  - Toast notifications

## Project Structure

```
ThagavalGPT/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/         # Login, Register, ForgotPassword
│   │   │   └── Chat/         # Chat UI components
│   │   ├── context/          # React Context (Auth, Chat)
│   │   ├── config/           # Firebase & API configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/                   # Node.js backend
    ├── config/
    │   └── firebase.js       # Firebase Admin configuration
    ├── middleware/
    │   └── auth.js           # Authentication middleware
    ├── routes/
    │   └── chat.js           # Chat API routes
    ├── server.js             # Express server
    └── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with:
  - Authentication enabled (Email/Password)
  - Firestore Database created
  - Service Account Key generated

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
4. Create Firestore Database:
   - Go to Firestore Database > Create database
   - Start in test mode (configure rules later)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and copy the config
6. Generate Service Account Key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccountKey.json` in the backend folder

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your Firebase credentials
# Option 1: Use service account key file
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Option 2: Use environment variables
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"

# Optional: Add OpenAI API key for real AI responses
OPENAI_API_KEY=your_openai_api_key

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Firestore Security Rules (Production)

Update your Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Usage

1. **Register an Account**
   - Navigate to http://localhost:3000
   - Click "Sign up" and create an account
   - You'll be redirected to the chat interface

2. **Start Chatting**
   - Type your message in the input box
   - Press Enter or click Send
   - View your conversation history in the sidebar

3. **Manage Conversations**
   - Click "New Chat" to start a new conversation
   - Click on conversations in the sidebar to switch between them
   - Click the trash icon to delete a conversation

## AI Integration - Google Gemini (Gemma 3 27B) ✨

ThagavalGPT is now **pre-configured** with Google's Gemini AI using the **Gemma 2 27B** model!

### Quick Setup (3 Steps)

1. **Get API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Add to .env**: `GEMINI_API_KEY=your_api_key_here` in `backend/.env`
3. **Install & Run**: 
   ```bash
   cd backend
   npm install
   npm run dev
   ```

**That's it!** Your chatbot will now use Gemini AI for responses.

See [GEMINI_SETUP.md](GEMINI_SETUP.md) for detailed configuration options.

### Features
- ✅ Gemma 2 27B model (27 billion parameters)
- ✅ Conversation history context
- ✅ Configurable temperature & token settings
- ✅ Automatic error handling
- ✅ Free tier available

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Technologies Used

### Frontend
- React 18
- React Router v6
- Firebase SDK (Auth, Firestore, Storage)
- Axios
- React Icons
- React Hot Toast
- Vite

### Backend
- Node.js
- Express
- Firebase Admin SDK
- CORS
- Body Parser
- Dotenv

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

## Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ by ThagavalGPT Team**
