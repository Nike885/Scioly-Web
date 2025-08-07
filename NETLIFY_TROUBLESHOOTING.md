# 🔧 Netlify Deployment Troubleshooting

## 🚨 "Page not found" Error

If you're getting a "Page not found" error on your Netlify site, here's how to fix it:

### **Step 1: Verify Your Build Files**

1. **Check that these files exist in your `web-build` folder:**
   ```
   web-build/
   ├── index.html          ✅ Must exist
   ├── _redirects          ✅ Must exist
   ├── _headers            ✅ Should exist
   ├── static/             ✅ Must exist
   └── asset-manifest.json ✅ Must exist
   ```

2. **Rebuild your project:**
   ```bash
   npx expo export:web
   cp public/_redirects web-build/_redirects
   cp public/_headers web-build/_headers
   ```

### **Step 2: Upload the Correct Folder**

**IMPORTANT:** Make sure you're uploading the `web-build` folder, NOT the `dist` folder.

### **Step 3: Check Netlify Settings**

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy**
3. Verify these settings:
   - **Publish directory:** `web-build`
   - **Build command:** `npx expo export:web`

### **Step 4: Manual Deploy**

1. **Build locally:**
   ```bash
   npx expo export:web
   cp public/_redirects web-build/_redirects
   cp public/_headers web-build/_headers
   ```

2. **Upload to Netlify:**
   - Go to your Netlify dashboard
   - Drag and drop the `web-build` folder to the deploy area
   - Wait for deployment to complete

### **Step 5: Test Locally First**

Before uploading to Netlify, test your build locally:

```bash
npx expo export:web
npx serve web-build
```

Visit `http://localhost:3000` - if it works locally, it should work on Netlify.

## 🔍 Common Issues & Solutions

### **Issue 1: 404 Errors on Direct Links**
**Solution:** Ensure `_redirects` file contains:
```
/*    /index.html   200
```

### **Issue 2: Assets Not Loading**
**Solution:** Check that the `static/` folder is uploaded with your build.

### **Issue 3: Build Fails**
**Solution:** 
1. Install dependencies: `npm install --legacy-peer-deps`
2. Clear cache: `rm -rf node_modules && npm install --legacy-peer-deps`
3. Rebuild: `npx expo export:web`

### **Issue 4: Environment Variables**
If your app needs environment variables:
1. Go to **Site settings** → **Environment variables**
2. Add your variables (e.g., Supabase URLs)

## 🚀 Quick Fix Script

Run this script to rebuild and prepare for deployment:

```bash
#!/bin/bash
echo "🔧 Rebuilding for Netlify..."

# Clean install
npm install --legacy-peer-deps

# Build
npx expo export:web

# Copy necessary files
cp public/_redirects web-build/_redirects
cp public/_headers web-build/_headers

echo "✅ Build complete! Upload the 'web-build' folder to Netlify."
```

## 📞 Still Having Issues?

1. **Check Netlify build logs** in your dashboard
2. **Test locally first** with `npx serve web-build`
3. **Verify file structure** - all files should be in `web-build/`
4. **Check browser console** for JavaScript errors

## 🎯 Success Checklist

- [ ] `web-build/index.html` exists
- [ ] `web-build/_redirects` exists with proper rules
- [ ] `web-build/static/` folder contains assets
- [ ] Local test works (`npx serve web-build`)
- [ ] Uploaded `web-build` folder (not `dist`)
- [ ] Netlify deployment completed successfully

---

**Need more help?** Check the Netlify build logs in your dashboard for specific error messages. 