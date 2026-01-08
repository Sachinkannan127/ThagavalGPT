# 📱 Mobile Access Guide - ThagavalGPT

## ✅ Current Configuration

**Your Network IP:** `10.216.254.73`

**Backend URL:** `http://10.216.254.73:5000`  
**Frontend URL:** `http://10.216.254.73:3000`

---

## 🚀 Quick Start for Mobile

### Step 1: Ensure Servers Are Running

Both servers should already be running. You should see:

**Backend Terminal:**
```
🚀 ThagavalGPT Backend Server Started!
📍 Local:           http://localhost:5000
📱 Network (Mobile): http://10.216.254.73:5000
```

**Frontend Terminal:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
➜  Network: http://10.216.254.73:3000/
```

### Step 2: Connect Your Mobile Device

1. **Connect to Same WiFi**
   - Ensure your phone is on the **SAME WiFi network** as your laptop
   
2. **Open Mobile Browser**
   - Chrome, Safari, or any modern browser

3. **Navigate to:**
   ```
   http://10.216.254.73:3000
   ```

### Step 3: Verify Connection

You should see the app load. Check the browser console (if accessible) for:
- ✅ `🌐 API URL: http://10.216.254.73:5000`
- ✅ `✅ Backend connection successful`

---

## 🔧 Troubleshooting

### ❌ "Cannot connect to http://localhost:5000"

This means the app is trying to use localhost instead of the network IP.

**Solution:**
1. Clear browser cache on mobile
2. Close and reopen the browser
3. Use incognito/private mode
4. Hard refresh: Long press refresh button

### ❌ "Cannot connect to http://10.216.254.73:5000"

**Check 1: Same WiFi Network**
```powershell
# On laptop, verify your IP hasn't changed:
ipconfig
# Look for "IPv4 Address" under your WiFi adapter
```

**Check 2: Backend Running**
```powershell
# Test backend from laptop:
curl http://10.216.254.73:5000/health
# Should return: {"status":"OK","message":"ThagavalGPT Backend is running"}
```

**Check 3: Windows Firewall**
```powershell
# Run as Administrator:
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

### ❌ Connection Timeout

1. **Disable VPN** on laptop (if running)
2. **Check antivirus** - may block network access
3. **Restart WiFi router** if connection is unstable
4. **Try different port** - Edit `.env` file to use port 5001

---

## 🔄 Restart Servers

If you need to restart:

### Stop Servers
Press `Ctrl + C` in both terminal windows

### Start Backend
```powershell
cd backend
node server.js
```

**Wait for:** `📱 Network (Mobile): http://10.216.254.73:5000`

### Start Frontend
```powershell
cd frontend
npm run dev
```

**Wait for:** `➜  Network: http://10.216.254.73:3000/`

---

## 📊 Test Connection Script

Run this to verify everything:

```powershell
.\test-mobile-connection.ps1
```

This will show:
- ✅ Your current network IP
- ✅ Backend health check status
- ✅ .env file configuration
- ✅ Firewall rules status

---

## 💡 Tips for Best Performance

1. **Keep laptop plugged in** - prevents sleep mode
2. **Disable laptop sleep** when lid closed
3. **Use strong WiFi** - stay close to router
4. **Close unnecessary apps** on mobile
5. **Use latest browser** on mobile

---

## 🌐 Accessing from Other Devices

You can access the app from ANY device on your network:

- **Tablet:** `http://10.216.254.73:3000`
- **Another Computer:** `http://10.216.254.73:3000`
- **Smart TV Browser:** `http://10.216.254.73:3000`

All devices must be on the **same WiFi network**!

---

## ⚠️ IP Address Changed?

If your laptop's IP changes (after reconnecting to WiFi):

1. Get new IP:
   ```powershell
   ipconfig
   ```

2. Update `frontend/.env`:
   ```env
   VITE_API_URL=http://YOUR_NEW_IP:5000
   ```

3. Restart frontend server:
   ```powershell
   cd frontend
   npm run dev
   ```

---

## 📞 Still Having Issues?

Check browser console on mobile (if accessible):
- Android Chrome: `chrome://inspect`
- iOS Safari: Use Mac + Safari Developer Tools

Look for error messages and:
1. Verify the API URL shown
2. Check for CORS errors
3. Look for network failures

---

## ✅ Success Checklist

- [ ] Backend shows Network URL
- [ ] Frontend shows Network URL  
- [ ] Can access `http://10.216.254.73:3000` from laptop browser
- [ ] Phone connected to same WiFi
- [ ] Can access from mobile browser
- [ ] Login works on mobile
- [ ] Chat messages send/receive

**All checked?** 🎉 You're ready to use ThagavalGPT on mobile!
