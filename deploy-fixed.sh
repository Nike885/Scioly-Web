#!/bin/bash

echo "🚀 Fixed Deployment Script for Scioly App"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the web version
echo "🔨 Building web version..."
npx expo export:web

# Copy configuration files
echo "📋 Copying configuration files..."
cp public/_redirects web-build/_redirects
cp public/_headers web-build/_headers

# Add environment variables to HTML
echo "🔧 Adding environment variables to HTML..."
sed -i '' '/<script defer="defer" src="\/static\/js\/main.*.js"><\/script>/a\
<script>\
// Inject environment variables for web builds\
window.__ENV__ = {\
  EXPO_PUBLIC_SUPABASE_URL: '\''https://jlkaqwqccilgdtslxgtf.supabase.co'\'',\
  EXPO_PUBLIC_SUPABASE_ANON_KEY: '\''eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsa2Fxd3FjY2lsZ2R0c2x4Z3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTAzMTcsImV4cCI6MjA2NDg2NjMxN30.G6PIK57J7rXAlY0gd-2TbTiBN_k7vTBL19oOnMYrz0s'\''\
};\
</script>' web-build/index.html

echo ""
echo "✅ Build complete! Your app is ready for deployment."
echo ""
echo "📤 To deploy to Netlify:"
echo "1. Go to https://netlify.com"
echo "2. Drag and drop the 'web-build' folder to the dashboard"
echo "3. Your site will be deployed automatically!"
echo ""
echo "🌐 To test locally: npx serve web-build"
echo ""
echo "🎉 Your app should now work without the blank screen issue!" 