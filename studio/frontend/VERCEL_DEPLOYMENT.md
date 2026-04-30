# Vercel Deployment Guide

## Prerequisites
- GitHub repository with your code
- Vercel account (free tier works)
- Backend API deployed (e.g., on Render)

## Step 1: Prepare Your Repository

1. Ensure all changes are committed and pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `studio/frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`

## Step 3: Configure Environment Variables

Add the following environment variable in Vercel:

- `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com`)

To add environment variables:
1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_URL` with your backend URL
3. Select all environments (Production, Preview, Development)

## Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Troubleshooting

### Build Fails with Module Not Found

If you see module not found errors:

1. **Clear Vercel Cache**:
   - Go to Project Settings → General
   - Scroll to "Build & Development Settings"
   - Click "Clear Cache"

2. **Redeploy**:
   - Go to Deployments
   - Click the three dots on the latest deployment
   - Click "Redeploy"

3. **Check Install Command**:
   - Ensure install command is: `npm install --legacy-peer-deps`
   - This is required for React 19 compatibility

### Environment Variables Not Working

- Ensure `NEXT_PUBLIC_API_URL` is set in Vercel dashboard
- Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Redeploy after adding environment variables

### Build Timeout

- Vercel free tier has a 45-second build timeout
- If build takes too long, consider:
  - Removing unused dependencies
  - Optimizing imports
  - Using Vercel Pro for longer build times

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and pull requests

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed by Vercel

## Monitoring

- View deployment logs in Vercel dashboard
- Check runtime logs in the "Logs" tab
- Monitor performance in the "Analytics" tab (Pro feature)

## Local Testing Before Deploy

Always test locally before deploying:

```bash
cd studio/frontend

# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build

# Start production server
npm start
```

If the local build succeeds, Vercel deployment should work.
