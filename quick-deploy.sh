#!/bin/bash

echo "🚀 Quick Deploy Script for Netlify (No Repo)"

# Clean and install
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build
echo "🔨 Building web version..."
npx expo export:web

# Copy configuration files
echo "📋 Copying configuration files..."
cp public/_redirects web-build/_redirects
cp public/_headers web-build/_headers

# Create zip file
echo "📦 Creating deployment package..."
cd web-build
zip -r ../scioly-app-deploy.zip .
cd ..

echo ""
echo "✅ Build complete! Your app is ready for deployment."
echo ""
echo "📤 To deploy to Netlify:"
echo "1. Go to your Netlify dashboard"
echo "2. Drag and drop the 'web-build' folder OR upload 'scioly-app-deploy.zip'"
echo "3. Make sure environment variables are set in Netlify:"
echo "   - EXPO_PUBLIC_SUPABASE_URL"
echo "   - EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "🌐 To test locally: npx serve web-build"
echo ""
echo "📁 Files created:"
echo "   - web-build/ (folder to upload)"
echo "   - scioly-app-deploy.zip (alternative upload)" 