# Quick test script for mobile connection
Write-Host "🧪 Testing Mobile Connection Setup..." -ForegroundColor Cyan
Write-Host ""

# Get current IP
$IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^127\.' -and $_.PrefixOrigin -eq 'Dhcp' } | Select-Object -First 1).IPAddress
Write-Host "📱 Your Network IP: $IP" -ForegroundColor Green
Write-Host ""

# Check backend health
Write-Host "🔍 Testing backend connection..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://${IP}:5000/health" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Backend is reachable at http://${IP}:5000" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend is NOT reachable at http://${IP}:5000" -ForegroundColor Red
    Write-Host "   Make sure backend is running: cd backend && node server.js" -ForegroundColor Yellow
}
Write-Host ""

# Check .env configuration
Write-Host "🔍 Checking .env configuration..." -ForegroundColor Cyan
$envContent = Get-Content "frontend\.env" -ErrorAction SilentlyContinue
if ($envContent -match $IP) {
    Write-Host "✅ .env is configured with correct IP ($IP)" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env may need updating" -ForegroundColor Yellow
    Write-Host "   Current VITE_API_URL in .env:" -ForegroundColor Gray
    $envContent | Select-String "VITE_API_URL" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    Write-Host "   Expected: VITE_API_URL=http://${IP}:5000" -ForegroundColor Yellow
}
Write-Host ""

# Check firewall
Write-Host "🔍 Checking Windows Firewall..." -ForegroundColor Cyan
$nodeExe = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($nodeExe) {
    $firewallRules = Get-NetFirewallApplicationFilter | Where-Object { $_.Program -like "*node.exe" }
    if ($firewallRules) {
        Write-Host "✅ Node.js firewall rules exist" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No Node.js firewall rules found" -ForegroundColor Yellow
        Write-Host "   Run as Admin: New-NetFirewallRule -DisplayName 'Node.js' -Direction Inbound -Program '$nodeExe' -Action Allow" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  Node.js not found in PATH" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "📋 Mobile Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://${IP}:3000" -ForegroundColor White
Write-Host "   Backend:  http://${IP}:5000" -ForegroundColor White
Write-Host ""
Write-Host "🔧 To start servers:" -ForegroundColor Cyan
Write-Host "   Backend:  cd backend; node server.js" -ForegroundColor White
Write-Host "   Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📱 On your mobile device:" -ForegroundColor Cyan
Write-Host "   1. Connect to the same WiFi network" -ForegroundColor White
Write-Host "   2. Open browser and go to: http://${IP}:3000" -ForegroundColor White
Write-Host ""
