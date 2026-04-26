#!/usr/bin/env bash
# Render Build Script

echo "🚀 Starting Full-Stack Build Sequence..."

# Build the React Client
echo "📦 Building Frontend..."
cd client
npm install
npm run build
cd ..

# Install Server Dependencies
echo "📦 Installing Backend Dependencies..."
cd server
npm install
cd ..

echo "✅ Build Sequence Complete."
