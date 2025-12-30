# ThagavalGPT - Professional AI Chatbot

A modern, professional chatbot application similar to GitHub Copilot and Google Gemini with separated frontend and backend architecture.

## ✨ Features

- 🎨 **Professional UI/UX**: Beautiful gradient themes with smooth animations
- 🔐 **Secure Authentication**: JWT-based login and registration system
- 💬 **Real-time Chat**: Interactive chat interface with message history
- 🤖 **AI Integration**: Support for OpenAI GPT and Google Gemini APIs
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎯 **Modern Architecture**: Separated frontend (React) and backend (Flask)
- 💾 **Chat History**: Persistent conversation storage
- 🚀 **Easy Setup**: Simple configuration and deployment

## 🏗️ Project Structure

```
ThagavalGPT/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── ai_service.py       # AI integration service
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variables template
│   └── .env                # Your environment variables (create this)
│
└── frontend/               # React frontend
    ├── public/             # Static files
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Login.js    # Login/Register page
    │   │   ├── Login.css
    │   │   ├── Chat.js     # Main chat interface
    │   │   └── Chat.css
    │   ├── App.js          # Main app component
    │   ├── App.css
    │   ├── index.js        # Entry point
    │   └── index.css
    └── package.json        # Node dependencies
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env and add your API keys:
   # - JWT_SECRET_KEY: Your secret key for JWT tokens
   # - OPENAI_API_KEY: Your OpenAI API key (optional)
   # - GEMINI_API_KEY: Your Google Gemini API key (optional)
   ```

5. **Run the backend server**:
   ```bash
   python app.py
   ```
   
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   Frontend will run on `http://localhost:3000`

## 🔑 Demo Credentials

For testing, you can use these demo credentials:

- **Email**: user@example.com
- **Password**: user123

Or:

- **Email**: admin@example.com
- **Password**: admin123

## 🤖 AI Integration

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

### Google Gemini Setup

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=your-gemini-key-here
   ```

**Note**: The chatbot will work with fallback responses if no API keys are configured. For full AI capabilities, configure at least one API key.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Chat
- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/clear` - Clear chat history

### Health
- `GET /api/health` - Check backend status

## 🎨 Features Overview

### Login Page
- Modern gradient background with animated circles
- Smooth form animations
- Input validation
- Toggle between login and registration
- Responsive design

### Chat Interface
- Copilot/Gemini-like interface
- Collapsible sidebar with user profile
- Message history display
- Markdown support for rich text formatting
- Typing indicators
- Example prompts for quick start
- Clear chat functionality
- Smooth animations and transitions

## 🛠️ Customization

### Changing Colors
Edit the CSS files to customize the color scheme:
- `frontend/src/components/Login.css` - Login page styling
- `frontend/src/components/Chat.css` - Chat interface styling

### Adding New Features
1. Backend: Add new routes in `backend/app.py`
2. Frontend: Create new components in `frontend/src/components/`
3. Update the API integration in component files

## 🚀 Production Deployment

### Backend

1. **Use production WSGI server**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Environment variables**: Set proper production values in `.env`

3. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)

### Frontend

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy** the `build` folder to your hosting service (Netlify, Vercel, etc.)

3. **Update API URL**: Change the API endpoint from `localhost` to your backend URL

## 📦 Technologies Used

### Backend
- Flask - Web framework
- Flask-CORS - Cross-origin resource sharing
- Flask-JWT-Extended - JWT authentication
- OpenAI - GPT integration
- Google Generative AI - Gemini integration
- Python-dotenv - Environment variables

### Frontend
- React - UI framework
- React Router - Navigation
- Axios - HTTP client
- React Markdown - Markdown rendering

## 🔒 Security Notes

- Change the `JWT_SECRET_KEY` in production
- Never commit `.env` file with real API keys
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Add proper input validation and sanitization
- Use a proper database with encrypted passwords

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change port in `app.py`
- **Module not found**: Ensure virtual environment is activated and dependencies installed
- **API key errors**: Verify API keys in `.env` file

### Frontend Issues
- **Cannot connect to backend**: Ensure backend is running on port 5000
- **CORS errors**: Check Flask-CORS configuration
- **Build errors**: Delete `node_modules` and run `npm install` again

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Enjoy using ThagavalGPT!** 🚀
