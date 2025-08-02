#!/bin/bash

# Kill all node processes to free up ports
echo "🔄 Killing existing Node.js processes..."
pkill -f node || true
pkill -f vite || true
sleep 2

# Start main website (port 5173)
echo "🚀 Starting main website on port 5173..."
npm run dev &
MAIN_PID=$!

# Wait for main website to start
MAIN_HEALTH=1
for i in {1..10}; do
  sleep 1
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    MAIN_HEALTH=0
    break
  fi
done
if [ $MAIN_HEALTH -ne 0 ]; then
  echo "❌ Main website failed to start. Check logs."
  exit 1
fi
echo "✅ Main website started (PID: $MAIN_PID)"

# Start document processor backend (port 3002)
echo "🚀 Starting document processor backend on port 3002..."
cd templates/document-processing-template/backend
npm start &
DOC_BACKEND_PID=$!

# Wait for document backend to start
DOC_BACKEND_HEALTH=1
for i in {1..10}; do
  sleep 1
  if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    DOC_BACKEND_HEALTH=0
    break
  fi
done
if [ $DOC_BACKEND_HEALTH -ne 0 ]; then
  echo "❌ Document backend failed to start. Check logs."
  exit 1
fi
echo "✅ Document backend started (PID: $DOC_BACKEND_PID)"
cd ../../..

# Start document processor frontend (port 5174)
echo "🚀 Starting document processor frontend on port 5174..."
cd templates/document-processing-template/frontend
npm run dev &
DOC_FRONTEND_PID=$!

# Wait for document frontend to start
DOC_FRONTEND_HEALTH=1
for i in {1..10}; do
  sleep 1
  if curl -s http://localhost:5174 > /dev/null 2>&1; then
    DOC_FRONTEND_HEALTH=0
    break
  fi
done
if [ $DOC_FRONTEND_HEALTH -ne 0 ]; then
  echo "❌ Document frontend failed to start. Check logs."
  exit 1
fi
echo "✅ Document frontend started (PID: $DOC_FRONTEND_PID)"
cd ../../..

echo ""
echo "🎉 All servers started successfully!"
echo "📊 Process IDs:"
echo "   Main website: $MAIN_PID"
echo "   Document backend: $DOC_BACKEND_PID"
echo "   Document frontend: $DOC_FRONTEND_PID"
echo ""
echo "🌐 Access your services:"
echo "   Main website: http://localhost:5173"
echo "   Document processor: http://localhost:5174"
