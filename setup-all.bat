@echo off
title ThagavalGPT - Complete Setup
color 0A

echo ============================================================
echo  ThagavalGPT - Automated Setup
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from nodejs.org
    pause
    exit /b 1
)

echo [1/5] Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt --quiet

REM Run setup wizard if .env doesn't exist
if not exist .env (
    echo.
    echo ============================================================
    echo  Backend Configuration Wizard
    echo ============================================================
    python setup.py
) else (
    echo .env file already exists, skipping setup wizard
)

echo.
echo [2/5] Backend setup complete!
echo.

cd ..

echo [3/5] Setting up frontend...
cd frontend

REM Install Node dependencies
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install
) else (
    echo Node modules already installed
)

echo.
echo [4/5] Frontend setup complete!
echo.

cd ..

echo [5/5] Setup complete!
echo.
echo ============================================================
echo  Setup Complete - Ready to Run!
echo ============================================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo To start the application:
echo   1. Run: start-backend.bat (in first terminal)
echo   2. Run: start-frontend.bat (in second terminal)
echo.
echo Or use: start-all.bat (starts both)
echo ============================================================
echo.
pause
