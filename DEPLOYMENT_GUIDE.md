# Deployment Guide for ThagavalGPT

## Backend Deployment Options

### Option 1: Python Hosting Services (Recommended)

#### **Railway.app** (Free Tier Available)
1. Sign up at https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repository
4. Set environment variables:
   ```
   JWT_SECRET_KEY=your-secret-key
   OPENAI_API_KEY=your-openai-key
   GEMINI_API_KEY=your-gemini-key
   FLASK_ENV=production
   ```
5. Railway will auto-detect Flask and deploy
6. Copy the deployment URL (e.g., `https://your-app.railway.app`)

#### **Render.com** (Free Tier Available)
1. Sign up at https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Add environment variables in dashboard
6. Copy the deployment URL

#### **PythonAnywhere** (Free Tier)
1. Sign up at https://www.pythonanywhere.com
2. Upload your backend folder
3. Configure WSGI file
4. Set environment variables in .env file
5. Note your URL (e.g., `https://yourusername.pythonanywhere.com`)

### Option 2: Heroku (Paid)
1. Install Heroku CLI
2. Create `Procfile` in backend folder:
   ```
   web: gunicorn app:app
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=your-key
   git push heroku main
   ```

## Frontend Deployment on Vercel

### Step 1: Prepare Frontend
1. Update `.env.local` with your backend URL:
   ```env
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

### Step 2: Deploy to Vercel
1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via GitHub (Recommended)**:
   - Go to https://vercel.com
   - Sign up and click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   
3. **Add Environment Variable**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`

4. Deploy!

### Step 3: Configure CORS in Backend
Update [backend/app.py](backend/app.py) to allow your Vercel domain:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://your-app.vercel.app",  # Add your Vercel domain
            "https://your-custom-domain.com"  # If using custom domain
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
```

## Quick Deploy Commands

### Backend (Railway Example)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up

# Set environment variables
railway variables set OPENAI_API_KEY=your-key
railway variables set GEMINI_API_KEY=your-key
```

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel --prod
```

## Environment Variables Checklist

### Backend (.env)
- ✅ JWT_SECRET_KEY
- ✅ OPENAI_API_KEY
- ✅ GEMINI_API_KEY
- ✅ FLASK_ENV=production

### Frontend (Vercel)
- ✅ REACT_APP_API_URL=https://your-backend-url.com/api

## Testing Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Frontend Test**:
   - Open your Vercel URL
   - Try to register/login
   - Send a test message

## Troubleshooting

### Frontend Can't Connect to Backend
- ✅ Check REACT_APP_API_URL is set correctly
- ✅ Verify backend CORS allows your Vercel domain
- ✅ Check backend is running and accessible

### Backend Errors
- ✅ Check environment variables are set
- ✅ View backend logs in hosting dashboard
- ✅ Ensure all dependencies are installed

### CORS Issues
- ✅ Add Vercel domain to CORS origins in backend
- ✅ Restart backend after CORS changes

## Free Tier Limits

- **Railway**: 500 hours/month, $5 credit
- **Render**: 750 hours/month (sleeps after inactivity)
- **Vercel**: Unlimited for hobby projects
- **PythonAnywhere**: 1 web app, limited CPU

## Production Recommendations

1. Use PostgreSQL instead of SQLite (backend needs modification)
2. Set up proper logging
3. Use production WSGI server (gunicorn)
4. Enable HTTPS (most platforms do this automatically)
5. Set up monitoring (Sentry, LogRocket)
6. Use Redis for session management
7. Implement rate limiting

## Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Backend
- Follow your hosting provider's custom domain setup

---

**Need help?** Check the logs in your hosting platform's dashboard!
