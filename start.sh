#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# RailYatra — Start both servers (macOS / Linux)
# Usage: chmod +x start.sh && ./start.sh
# ─────────────────────────────────────────────────────────────────────
set -e

echo ""
echo "🚂  RailYatra Startup Script"
echo "────────────────────────────"

# Check Node
if ! command -v node &>/dev/null; then
  echo "❌  Node.js not found. Install from https://nodejs.org (v18+)" && exit 1
fi
echo "✅  Node $(node -v)"

# Check MongoDB
if ! command -v mongod &>/dev/null && ! pgrep -x mongod &>/dev/null; then
  echo "⚠️   MongoDB doesn't appear to be running."
  echo "    macOS : brew services start mongodb-community"
  echo "    Linux : sudo systemctl start mongod"
  echo "    Or set MONGO_URI in backend/.env to a MongoDB Atlas URL."
  echo ""
fi

# Install backend deps if needed
if [ ! -d "backend/node_modules" ]; then
  echo "📦  Installing backend dependencies..."
  (cd backend && npm install)
fi

# Install frontend deps if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "📦  Installing frontend dependencies..."
  (cd frontend && npm install)
fi

# Seed only if DB appears empty (ignore errors)
echo ""
echo "🌱  Running seed (safe to ignore if already seeded)..."
(cd backend && node seed/seedData.js 2>/dev/null || true)

echo ""
echo "🚀  Starting backend on http://localhost:5000 ..."
(cd backend && npm run dev) &
BACKEND_PID=$!

sleep 2

echo "🚀  Starting frontend on http://localhost:5173 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "✅  Both servers are running!"
echo "    Frontend : http://localhost:5173"
echo "    API      : http://localhost:5000/api/health"
echo ""
echo "    Press Ctrl+C to stop both servers."
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'" INT TERM
wait
