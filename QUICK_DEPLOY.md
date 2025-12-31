# Quick Deployment Guide

## ⚡ For Your Current Issue

**Problem**: Frontend on Vercel can't connect to backend on localhost

**Solution**: You need to deploy your backend first!

### 🚀 Deploy Backend (Choose One)

#### Option 1: Railway (Easiest, Free)
```bash
# 1. Go to https://railway.app
# 2. Sign up with GitHub
# 3. New Project → Deploy from GitHub repo
# 4. Select your repo
# 5. Add environment variables:
#    - JWT_SECRET_KEY
#    - OPENAI_API_KEY  
#    - GEMINI_API_KEY
#    - ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
# 6. Copy your Railway URL
```

#### Option 2: Render (Free)
```bash
# 1. Go to https://render.com
# 2. New → Web Service
# 3. Connect GitHub repo
# 4. Settings:
#    Root Directory: backend
#    Build: pip install -r requirements.txt
#    Start: gunicorn app:app
# 5. Add environment variables
# 6. Copy your Render URL
```

### 🎯 Configure Frontend on Vercel

1. **Go to your Vercel project dashboard**
2. **Settings → Environment Variables**
3. **Add**:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com/api`
   (Replace with your Railway/Render URL)
4. **Redeploy** (Deployments → Click ⋯ → Redeploy)

### ✅ Test

Visit your Vercel URL and try logging in!

---

## 📋 Environment Variables Needed

### Backend (Railway/Render/Heroku)
```
JWT_SECRET_KEY=thagavalgpt-super-secure-secret-key-2025-change-in-production
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIzaSy...
ALLOWED_ORIGINS=https://your-app.vercel.app
FLASK_ENV=production
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 🔍 Troubleshooting

### "Cannot connect to server"
- ✅ Backend is deployed and running
- ✅ REACT_APP_API_URL points to backend URL
- ✅ Redeployed frontend after adding env var

### CORS Error
- ✅ Add Vercel URL to ALLOWED_ORIGINS in backend
- ✅ Format: `https://your-app.vercel.app` (no trailing slash)

### 500 Error
- ✅ Check backend logs in Railway/Render
- ✅ All environment variables set correctly

---

## 🎉 Success Checklist

- [ ] Backend deployed (Railway/Render)
- [ ] Backend environment variables configured
- [ ] Got backend URL
- [ ] Added REACT_APP_API_URL to Vercel
- [ ] Redeployed frontend
- [ ] Can register/login
- [ ] Chatbot works!

**Full guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
