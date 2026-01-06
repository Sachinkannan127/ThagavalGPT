# Render Deployment Guide

## Fixed Issues ✅

1. **Dependency Conflict Resolved**
   - Downgraded `ai` package from 6.0.12 to 5.0.118
   - Added `.npmrc` with `legacy-peer-deps=true`
   - Updated `package.json` with build script

2. **Files Added/Updated**
   - `backend/.npmrc` - NPM configuration for legacy peer deps
   - `.npmrc` - Root NPM configuration
   - `render.yaml` - Render deployment configuration
   - `backend/package.json` - Added build script and engines

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix dependency conflicts for Render deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml` and create both services

3. **Set Environment Variables**
   In Render Dashboard for backend service:
   - `GROQ_API_KEY` = your_groq_key
   - `OPENROUTER_API_KEY` = your_openrouter_key
   - `NODE_ENV` = production
   - `PORT` = 5000

### Option 2: Manual Service Creation

#### Backend:
1. New Web Service → Connect GitHub repo
2. **Build Command**: `npm install --legacy-peer-deps`
3. **Start Command**: `npm start`
4. **Root Directory**: `backend`
5. Add environment variables (above)

#### Frontend:
1. New Static Site → Connect GitHub repo
2. **Build Command**: `npm install && npm run build`
3. **Publish Directory**: `dist`
4. **Root Directory**: `frontend`
5. Add environment variable:
   - `VITE_API_URL` = your_backend_url (e.g., https://thagavalgpt-backend.onrender.com)

## Verification

After deployment:
1. Check backend health: `https://your-backend.onrender.com/health`
2. Open frontend: `https://your-frontend.onrender.com`

## Troubleshooting

If build fails with ERESOLVE error:
- Ensure `.npmrc` file exists in backend folder
- Check `ai` package version is 5.0.118
- Use `--legacy-peer-deps` flag in build command

## Local Testing

Test the fixed version locally:
```bash
cd backend
npm install --legacy-peer-deps
npm start
```

Server should start without errors! ✅
