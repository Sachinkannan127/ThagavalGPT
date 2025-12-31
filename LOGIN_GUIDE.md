# Login Troubleshooting Guide

## Demo Credentials

The system comes with pre-configured demo accounts. Use these credentials to login:

### Option 1: Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Option 2: Demo User Account
- **Email**: `user@example.com`
- **Password**: `user123`

## Or Create a New Account

1. Click **"Sign Up"** link on the login page
2. Fill in:
   - Full Name
   - Email
   - Password (minimum 6 characters)
3. Click **"Sign Up"**

## Troubleshooting Authentication Issues

### 1. "Authentication failed. Please try again."
**Possible causes:**
- Wrong email or password
- Backend server not running
- Network connectivity issue

**Solutions:**
- Try the demo credentials above
- Check browser console (F12) for detailed error messages
- Verify backend is running on http://localhost:5000

### 2. "Cannot connect to server"
**Cause:** Backend server is not running

**Solution:**
```powershell
cd backend
.\.venv\Scripts\python.exe app.py
```

### 3. "Network error"
**Possible causes:**
- CORS issues
- Port conflicts
- Firewall blocking connections

**Solutions:**
- Ensure backend is on port 5000
- Ensure frontend is on port 3000
- Check firewall settings

### 4. Proxy Errors in Frontend Terminal
**Errors like:**
```
Proxy error: Could not proxy request /favicon.ico from localhost:3000 to http://localhost:5000/
```

**These are normal** - They only affect favicon and manifest files, not authentication.

## Verify Backend is Running

1. Open browser to http://localhost:5000/api/health
2. Should see:
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

## Check Browser Console for Errors

1. Open the app at http://localhost:3000
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Try to login
5. Look for error messages with details

The updated Login component now shows more detailed error messages.

## Database Location

The SQLite database is located at:
```
s:\pro\Chatbot\ThagavalGPT\backend\chatbot.db
```

## Reset Database (If Needed)

If you want to reset the database to factory defaults:

```powershell
cd backend
Remove-Item chatbot.db
python app.py
```

This will recreate the database with demo users.
