#!/bin/bash

cd /home/deploynode/tech-guide-brainfit

echo "👉 Pulling latest code..."
git pull origin master

echo "📦 Installing dependencies..."
npm install

echo "⚙️ Building site..."
npm run build

echo "✅ Deployment completed!"
