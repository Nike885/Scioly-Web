# Deploying to Netlify

## Method 1: Drag and Drop (Recommended)

1. **Build your project locally:**
   ```bash
   npm install
   npx expo export:web
   ```

2. **Upload to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login to your account
   - Drag and drop the `web-build` folder to the Netlify dashboard
   - Your site will be deployed automatically!

## Method 2: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npx expo export:web
   netlify deploy --prod --dir=web-build
   ```

## Method 3: Manual Upload

1. **Build the project:**
   ```bash
   npm install
   npx expo export:web
   ```

2. **Zip the web-build folder and upload:**
   - Zip the `web-build` folder
   - Go to Netlify dashboard
   - Upload the zip file
   - Netlify will extract and deploy it

## Environment Variables

If you need to set environment variables:
1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add any required environment variables

## Custom Domain

To add a custom domain:
1. Go to your Netlify site dashboard
2. Navigate to Domain management
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

- If the build fails, check the build logs in Netlify dashboard
- Ensure all dependencies are properly installed
- Make sure the `dist` folder is generated correctly
- Check that all assets are properly referenced

## Local Testing

To test the build locally:
```bash
npx expo export:web
npx serve web-build
```

This will serve your built app locally at `http://localhost:3000` 