#!/bin/bash

# Kill all node processes to free up ports
pkill -f node || true

# Start backend (estate assistant) in background
cd templates/chatbot-template/customer_service_ai/tier2-chatbot || exit 1
npm install --silent
npm start &
BACKEND_PID=$!

# Wait for backend to start (health check loop)
BACKEND_HEALTH=1
for i in {1..10}; do
  sleep 1
  if curl -s http://localhost:8001/test | grep -q 'Server is running'; then
    BACKEND_HEALTH=0
    break
  fi
done
if [ $BACKEND_HEALTH -ne 0 ]; then
  echo "Backend failed to start. Check logs."
  exit 1
fi
cd ../../../..

# Start frontend (website) in background
cd website || exit 1
npm install --silent
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start (health check loop)
FRONTEND_HEALTH=1
for i in {1..10}; do
  sleep 1
  if curl -s http://localhost:8080 | grep -q '<!DOCTYPE html>'; then
    FRONTEND_HEALTH=0
    break
  fi
done
if [ $FRONTEND_HEALTH -ne 0 ]; then
  echo "Frontend failed to start. Check logs."
  exit 1
fi

cd ..

echo "Both backend (PID $BACKEND_PID) and frontend (PID $FRONTEND_PID) are running."
echo "Access your chatbot at: http://localhost:8080/demo/real-estate"
