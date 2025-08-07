# 🔍 Debugging Blank Screen Issue

Your app is deployed but showing a blank white screen. Here's how to fix it:

## 🚨 **Most Likely Cause: Missing Environment Variables**

Your app needs Supabase environment variables to work. Without them, it fails silently and shows a blank screen.

### **Step 1: Add Environment Variables in Netlify**

1. Go to your Netlify dashboard
2. Click on your site (scienceolympiad)
3. Go to **Site settings** → **Environment variables**
4. Add these variables:

**Variable 1:**
- **Key:** `EXPO_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase project URL

**Variable 2:**
- **Key:** `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anonymous key

### **Step 2: Find Your Supabase Credentials**

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

### **Step 3: Redeploy After Adding Variables**

After adding environment variables, you need to redeploy:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Or drag and drop the `web-build` folder again

## 🔍 **Other Possible Causes**

### **Issue 1: JavaScript Errors**
Check browser console for errors:
1. Open your site in browser
2. Press F12 to open developer tools
3. Look at the **Console** tab for red error messages

### **Issue 2: Asset Loading Problems**
Check if assets are loading:
1. Open developer tools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for failed requests (red items)

### **Issue 3: CORS Issues**
If you see CORS errors, it's likely a Supabase configuration issue.

## 🧪 **Testing Steps**

### **Step 1: Test Locally with Environment Variables**

Create a `.env` file in your project root:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then test:
```bash
npx expo export:web
npx serve web-build
```

### **Step 2: Check Browser Console**

1. Visit your Netlify site
2. Press F12 to open developer tools
3. Look at the **Console** tab
4. Share any error messages you see

### **Step 3: Test Simple Page**

Visit: `https://your-site.netlify.app/test.html`
If this works, the deployment is fine and the issue is with your app.

## 🚀 **Quick Fix Script**

Run this to rebuild with proper error handling:

```bash
#!/bin/bash
echo "🔧 Rebuilding with error handling..."

# Install dependencies
npm install --legacy-peer-deps

# Build
npx expo export:web

# Copy files
cp public/_redirects web-build/_redirects
cp public/_headers web-build/_headers

echo "✅ Build complete!"
echo "📤 Upload web-build folder to Netlify"
echo "🔧 Add environment variables in Netlify dashboard"
```

## 📋 **Checklist**

- [ ] Environment variables set in Netlify
- [ ] Redeployed after adding variables
- [ ] Test page works (`/test.html`)
- [ ] No JavaScript errors in console
- [ ] Assets loading correctly
- [ ] Supabase credentials are correct

## 🆘 **Still Having Issues?**

1. **Check Netlify build logs** for any errors
2. **Test locally first** with environment variables
3. **Share browser console errors** if any
4. **Verify Supabase credentials** are correct

---

**The blank screen is almost always caused by missing environment variables!** 