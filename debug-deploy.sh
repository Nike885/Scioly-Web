#!/bin/bash

echo "🔍 Debugging Netlify Deployment Issue"

echo ""
echo "📋 Step 1: Check if app works locally..."
echo "Visit: http://localhost:3000"
echo "Press F12 and check the Console tab for errors"
echo ""

echo "📋 Step 2: Check Netlify environment variables..."
echo "1. Go to your Netlify dashboard"
echo "2. Site settings → Environment variables"
echo "3. Verify these exist:"
echo "   - EXPO_PUBLIC_SUPABASE_URL"
echo "   - EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo ""

echo "📋 Step 3: Check browser console on Netlify..."
echo "1. Visit your Netlify site"
echo "2. Press F12 to open developer tools"
echo "3. Look at Console tab for red error messages"
echo "4. Look at Network tab for failed requests"
echo ""

echo "📋 Step 4: Test simple page..."
echo "Visit: https://scienceolympiad.netlify.app/test.html"
echo "If this works, deployment is fine, issue is with app"
echo ""

echo "📋 Step 5: Check if environment variables are being read..."
echo "The build output shows:"
echo "env: load .env"
echo "env: export EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo "This means your .env file is being read correctly"
echo ""

echo "🚨 Most likely causes:"
echo "1. JavaScript error preventing app from loading"
echo "2. Supabase connection failing (check credentials)"
echo "3. Asset loading issues"
echo "4. CORS issues with Supabase"
echo ""

echo "🔧 Next steps:"
echo "1. Check browser console for errors"
echo "2. Verify Supabase credentials are correct"
echo "3. Test locally first"
echo "4. Share any error messages you see" 