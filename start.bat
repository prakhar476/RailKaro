@echo off
:: ─────────────────────────────────────────────────────────────────────
:: RailYatra — Start both servers (Windows)
:: Double-click this file or run from Command Prompt
:: ─────────────────────────────────────────────────────────────────────
title RailYatra Startup

echo.
echo  RailYatra Startup Script (Windows)
echo  ------------------------------------

:: Check Node
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org (v18+)
    pause & exit /b 1
)

echo  [OK] Node.js found

:: Check if backend deps installed
if not exist "backend\node_modules" (
    echo  [INFO] Installing backend dependencies...
    cd backend && npm install && cd ..
)

:: Check if frontend deps installed
if not exist "frontend\node_modules" (
    echo  [INFO] Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

:: Seed database (safe to run multiple times — ignore errors)
echo  [INFO] Seeding database (safe to ignore if already done)...
cd backend && node seed/seedData.js
cd ..

echo.
echo  [INFO] Make sure MongoDB is running!
echo         net start MongoDB
echo         or start mongod.exe manually
echo.

:: Start backend in new window
echo  [INFO] Starting backend on http://localhost:5000 ...
start "RailYatra Backend" cmd /k "cd backend && npm run dev"

:: Wait a moment for backend to boot
timeout /t 3 /nobreak >nul

:: Start frontend in new window
echo  [INFO] Starting frontend on http://localhost:5173 ...
start "RailYatra Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo  Both servers started in separate windows.
echo  Frontend : http://localhost:5173
echo  API      : http://localhost:5000/api/health
echo.
echo  Close those windows (or Ctrl+C in each) to stop.
pause
