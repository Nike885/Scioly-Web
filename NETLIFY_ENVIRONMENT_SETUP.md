# 🔧 Netlify Environment Variables Setup

Your app needs Supabase environment variables to work properly. Here's how to set them up in Netlify:

## 📋 Required Environment Variables

Your app needs these environment variables:

1. `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🚀 How to Add Environment Variables in Netlify

### Step 1: Go to Your Netlify Dashboard
1. Go to [netlify.com](https://netlify.com)
2. Click on your site (scienceolympiad)
3. Go to **Site settings** → **Environment variables**

### Step 2: Add the Variables
1. Click **Add a variable**
2. Add these variables:

**Variable 1:**
- **Key:** `EXPO_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase URL (e.g., `https://your-project.supabase.co`)

**Variable 2:**
- **Key:** `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anonymous key

### Step 3: Redeploy
After adding the environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. This will rebuild your site with the environment variables

## 🔍 How to Find Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

## 🧪 Test Locally First

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

## 🚨 Common Issues

### Issue 1: "Cannot read property of undefined"
**Solution:** Environment variables not set in Netlify

### Issue 2: Supabase connection fails
**Solution:** Check that your Supabase URL and key are correct

### Issue 3: App works locally but not on Netlify
**Solution:** Make sure environment variables are set in Netlify dashboard

## ✅ Success Checklist

- [ ] Added `EXPO_PUBLIC_SUPABASE_URL` to Netlify
- [ ] Added `EXPO_PUBLIC_SUPABASE_ANON_KEY` to Netlify
- [ ] Triggered a new deploy
- [ ] Tested locally with `.env` file
- [ ] App loads without errors

---

**Need help?** Check the Netlify build logs for environment variable errors. 