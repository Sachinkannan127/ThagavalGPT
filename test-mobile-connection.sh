#!/bin/bash
# Quick test script for mobile connection

echo "🧪 Testing Mobile Connection Setup..."
echo ""

# Get current IP
IP=$(ipconfig | grep -A 5 "Wireless LAN adapter Wi-Fi" | grep "IPv4" | awk '{print $NF}' | tr -d '\r')
echo "📱 Your Network IP: $IP"
echo ""

# Check backend health
echo "🔍 Testing backend connection..."
curl -s "http://$IP:5000/health" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is reachable at http://$IP:5000"
else
    echo "❌ Backend is NOT reachable at http://$IP:5000"
    echo "   Make sure backend is running: cd backend && node server.js"
fi
echo ""

# Check .env configuration
echo "🔍 Checking .env configuration..."
if grep -q "$IP" frontend/.env; then
    echo "✅ .env is configured with correct IP ($IP)"
else
    echo "⚠️  .env may need updating"
    echo "   Current VITE_API_URL in .env:"
    grep "VITE_API_URL" frontend/.env
    echo "   Expected: VITE_API_URL=http://$IP:5000"
fi
echo ""

# Summary
echo "📋 Mobile Access URLs:"
echo "   Frontend: http://$IP:3000"
echo "   Backend:  http://$IP:5000"
echo ""
echo "🔧 To start servers:"
echo "   Backend:  cd backend && node server.js"
echo "   Frontend: cd frontend && npm run dev"
