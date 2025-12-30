#!/bin/bash
echo "Starting ThagavalGPT Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "Starting React development server..."
npm start
