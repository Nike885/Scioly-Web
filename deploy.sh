#!/bin/bash

echo "🚀 Building Scioly App for web deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the web version
echo "🔨 Building web version..."
npx expo export:web

# Copy necessary files
echo "📋 Copying configuration files..."
cp public/_redirects web-build/_redirects
cp public/_headers web-build/_headers

echo "✅ Build complete! Your app is ready for deployment."
echo ""
echo "📤 To deploy to Netlify:"
echo "1. Go to https://netlify.com"
echo "2. Drag and drop the 'web-build' folder to the dashboard"
echo "3. Set up environment variables in Netlify dashboard:"
echo "   - EXPO_PUBLIC_SUPABASE_URL"
echo "   - EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo "4. Trigger a new deploy"
echo ""
echo "🌐 To test locally: npx serve web-build"
echo ""
echo "📋 Check NETLIFY_ENVIRONMENT_SETUP.md for environment variable setup" 