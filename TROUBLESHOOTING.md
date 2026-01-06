# Troubleshooting Guide

## "[object Object]" Issue

If you see `[object Object]` instead of actual message content:

### Quick Fix:
1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh the page
4. Try sending a new message

### Why it happens:
- Old messages stored in Firestore or localStorage might have corrupt object data
- The application now automatically detects and fixes this, but old data might persist

### Complete Reset:
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Backend Logs to Check:
Look for these in the backend terminal:
- ✅ `AI response generated: { type: 'string', ... }` - Should show type as 'string'
- ❌ `AI response is still an object!` - Indicates a problem

### If issue persists:
1. Check backend logs for the actual response type
2. Clear Firestore messages collection (old corrupt data)
3. Ensure both backend and frontend are running latest code
4. Check browser console for detailed error logs

## Performance Issues

### Slow Responses:
- Try "Short" response mode instead of "Detailed"
- Check your Groq API quota at https://console.groq.com/

### Server Won't Start:
```powershell
# Kill all node processes
Get-Process -Name "node" | Stop-Process -Force

# Restart servers
cd backend
npm run dev

# In new terminal
cd frontend  
npm run dev
```

## Common Errors

### EADDRINUSE (Port already in use):
```powershell
Get-Process -Name "node" | Stop-Process -Force
```

### Firebase errors:
- The app works without Firebase (stores in localStorage instead)
- To enable Firebase, configure firebase.js properly

### API Key errors:
- Get free API key: https://console.groq.com/keys
- Add to `backend/.env`: `GROQ_API_KEY=your_key_here`
- Restart backend server
