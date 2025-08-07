#!/bin/bash

echo "🚀 Final Deployment Script for Scioly App"

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
cat > temp_env_script.js << 'EOF'
// Inject environment variables for web builds
window.__ENV__ = {
};
EOF

# Insert the script into HTML
sed -i '' '/<script defer="defer" src="\/static\/js\/main.*.js"><\/script>/a\
<script>\
// Inject environment variables for web builds\
window.__ENV__ = {\
};\
</script>' web-build/index.html

# Clean up
rm temp_env_script.js

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