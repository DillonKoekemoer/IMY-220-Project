#!/bin/bash

# Start backend server in background
cd /app/backend
npm start &

# Wait a moment for backend to start
sleep 3

# Start frontend webpack dev server
cd /app
npm start

# Keep container running
wait