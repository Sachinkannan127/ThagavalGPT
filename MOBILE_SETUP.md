# 📱 Mobile Setup Guide

## Issue Fixed
The application now works on both laptop and mobile devices. The backend has been configured to accept connections from your local network.

## 🌐 Your Network Configuration

**Your Local IP Address:** `10.216.254.73`

## 🚀 Quick Setup Steps

### Step 1: Start Backend Server
```bash
cd backend
node server.js
```

You should see output like:
```
🚀 ThagavalGPT Backend Server Started!
════════════════════════════════════════
📍 Local:           http://localhost:5000
📱 Network (Mobile): http://10.216.254.73:5000
💚 Health Check:    http://localhost:5000/health
════════════════════════════════════════
```

### Step 2: Configure Frontend for Mobile

#### For Laptop Use:
Keep the default in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

#### For Mobile Use:
Update `frontend/.env` with your network IP:
```env
VITE_API_URL=http://10.216.254.73:5000
```

### Step 3: Start Frontend Server
```bash
cd frontend
npm run dev
```

### Step 4: Access on Mobile
1. **Ensure mobile is on the SAME WiFi network** as your laptop
2. **Find the frontend URL** from the terminal (e.g., `http://localhost:3001`)
3. **Replace `localhost` with your IP**: `http://10.216.254.73:3001`
4. **Open on mobile browser**: `http://10.216.254.73:3001`

## ✅ Verification Steps

### Test Backend Connection
On mobile browser, visit:
```
http://10.216.254.73:5000/health
```

You should see:
```json
{
  "status": "OK",
  "message": "ThagavalGPT Backend is running"
}
```

### Test Frontend
On mobile browser, visit:
```
http://10.216.254.73:3001
```

## 🔧 What Was Fixed

### 1. Backend Server Configuration
- ✅ Changed server to listen on `0.0.0.0` (all network interfaces)
- ✅ Added proper CORS configuration for local network access
- ✅ Accepts connections from:
  - `localhost`
  - `192.168.x.x` (WiFi)
  - `10.x.x.x` (Corporate networks)
  - `172.16-31.x.x` (Docker/Private networks)

### 2. Frontend API Configuration
- ✅ Added `withCredentials: true` for CORS
- ✅ Better error messages for mobile users
- ✅ Network error detection
- ✅ User-friendly toast notifications

### 3. Error Handling
- ✅ Detects network connectivity issues
- ✅ Shows helpful messages when backend is unreachable
- ✅ Timeout handling (30 seconds)
- ✅ CORS error detection

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**
1. Check both devices are on same WiFi
2. Verify backend is running on your laptop
3. Check firewall isn't blocking port 5000
4. Verify the IP address in `.env` matches your laptop's IP

### Issue: "Request timed out"

**Solution:**
1. Check your WiFi connection
2. Backend might be slow - check backend logs
3. Try restarting the backend server

### Issue: CORS Errors

**Solution:**
1. Ensure you've restarted the backend after changes
2. Check backend console for "Origin blocked" messages
3. Verify `.env` URL matches exactly (http:// not https://)

### Issue: Page loads but chat doesn't work

**Solution:**
1. Open browser console (F12) and check for errors
2. Test backend health endpoint
3. Check if you're logged in (Firebase auth)
4. Verify API URL in console log (🌐 API URL:)

## 🔐 Windows Firewall Configuration

If mobile still can't connect, allow Node.js through firewall:

```powershell
# Run PowerShell as Administrator
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=3001
```

## 📊 Network Information

### Find Your IP Address:
```powershell
# On Windows PowerShell:
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike '*Loopback*'} | Select-Object IPAddress, InterfaceAlias

# On Command Prompt:
ipconfig | findstr IPv4
```

### Check if Backend is Accessible:
```powershell
# Test from your laptop:
curl http://localhost:5000/health

# Test from your laptop using network IP:
curl http://10.216.254.73:5000/health
```

## 🎯 Development Modes

### Development (Both on Same Machine)
```env
# frontend/.env
VITE_API_URL=http://localhost:5000
```

### Testing on Mobile
```env
# frontend/.env
VITE_API_URL=http://10.216.254.73:5000
```

### Production
```env
# frontend/.env
VITE_API_URL=https://your-production-api.com
```

## 📝 Important Notes

1. **IP Address Changes**: Your local IP (10.216.254.73) may change if you reconnect to WiFi. Check it regularly.

2. **Same Network Required**: Mobile and laptop MUST be on the same WiFi network.

3. **HTTPS Not Required**: For local development, HTTP is fine. Don't use HTTPS.

4. **Firewall**: Windows Firewall may block connections. Add exceptions if needed.

5. **Port Conflicts**: If port 5000 or 3001 is in use, backend/frontend will use different ports.

6. **Environment Variables**: Remember to restart servers after changing `.env` files.

## ✨ Quick Commands

### Restart Everything:
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Check if Running:
```bash
# Check backend
curl http://localhost:5000/health

# Check frontend
curl http://localhost:3001
```

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Backend shows both Local and Network URLs
2. ✅ Frontend console shows `🌐 API URL: http://10.216.254.73:5000`
3. ✅ Mobile can access health endpoint
4. ✅ Mobile can load the app
5. ✅ Chat messages work on mobile
6. ✅ No CORS errors in console

**Your app should now work perfectly on both laptop and mobile!** 🚀📱💻
