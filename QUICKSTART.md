# ThagavalGPT - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Step 2: Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Email/Password authentication
3. Create a Firestore database
4. Copy your Firebase config

### Step 3: Setup Environment Variables

**Frontend (.env):**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend (.env):**
```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📝 First Steps

1. Register a new account at http://localhost:3000/register
2. Login with your credentials
3. Start chatting!

## 🔧 Common Issues

### Firebase Authentication Error
- Make sure Email/Password is enabled in Firebase Console
- Verify your Firebase config in .env files

### Port Already in Use
- Change the PORT in backend/.env
- Update VITE_API_URL in frontend/.env

### CORS Error
- Make sure backend is running on port 5000
- Check proxy settings in frontend/vite.config.js

## 📚 Next Steps

- Integrate real AI (OpenAI, Gemini)
- Customize the UI/styling
- Add more features (file uploads, voice chat, etc.)
- Deploy to production

Happy coding! 🎉
