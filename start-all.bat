@echo off
title ThagavalGPT - Starting All Services
color 0B

echo ============================================================
echo  ThagavalGPT - Starting All Services
echo ============================================================
echo.

echo Starting Backend Server...
start "ThagavalGPT Backend" cmd /k "cd backend && ..\.venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "ThagavalGPT Frontend" cmd /k "cd frontend && npm start"

echo.
echo ============================================================
echo  Both servers are starting...
echo ============================================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two new windows opened:
echo   1. Backend (Flask API)
echo   2. Frontend (React App)
echo.
echo Wait for both to fully start, then open:
echo http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
