#!/bin/bash

echo "🔧 Updating Environment Variables in HTML"

echo ""
echo "Please provide your Supabase credentials:"
echo ""

read -p "Enter your Supabase URL (e.g., https://your-project.supabase.co): " SUPABASE_URL
read -p "Enter your Supabase anon key: " SUPABASE_KEY

echo ""
echo "Updating HTML file with your credentials..."

# Update the HTML file with the actual credentials
sed -i '' "s|https://your-project.supabase.co|$SUPABASE_URL|g" web-build/index.html
sed -i '' "s|your-anon-key|$SUPABASE_KEY|g" web-build/index.html

echo "✅ Environment variables updated!"
echo ""
echo "📤 Now you can upload the web-build folder to Netlify"
echo "🌐 Test locally: npx serve web-build" 