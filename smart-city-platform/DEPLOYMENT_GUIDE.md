# Smart City Platform - Deployment Guide

This guide covers deploying the Smart City Platform to GitHub and Vercel.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- GitHub account (for repository hosting)
- Vercel account (for deployment)

## Project Structure

```
smart-city-platform/
├── api/                    # Cloudflare Workers API
├── frontend/              # React application
├── alert-processor/       # Alert processing service
└── README.md
```

## 1. GitHub Repository Setup

### Option A: Using Git (if available)
```bash
# Initialize repository (if not already done)
git init
git add .
git commit -m "Initial commit: Smart City Platform"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/smart-city-platform.git
git push -u origin main
```

### Option B: Manual Upload to GitHub
1. Go to https://github.com/new
2. Create a new repository named `smart-city-platform`
3. Upload the project files directly via GitHub web interface

## 2. Vercel Deployment

### Frontend Deployment

1. **Go to Vercel**: https://vercel.com
2. **Import Project**: Click "New Project" → "Import Git Repository"
3. **Select Repository**: Choose your `smart-city-platform` repository
4. **Configure Project**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. **Environment Variables** (in Vercel dashboard):
   ```
   REACT_APP_API_URL=https://your-api-domain.com
   ```

6. **Deploy**: Click "Deploy" to start the deployment process

### API Deployment (Cloudflare Workers)

The API is designed for Cloudflare Workers deployment:

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Configure API**:
   ```bash
   cd api
   wrangler login
   wrangler deploy
   ```

3. **Update Frontend API URL**:
   - After API deployment, update `REACT_APP_API_URL` in Vercel
   - Use the Cloudflare Workers URL (e.g., `https://your-api.your-subdomain.workers.dev`)

## 3. Environment Configuration

### Frontend (.env)
Create `.env` file in frontend directory:
```
REACT_APP_API_URL=https://your-api-domain.com
```

### API (wrangler.toml)
Update `api/wrangler.toml`:
```toml
name = "smart-city-api"
compatibility_date = "2023-12-01"

[env.production]
vars = { ENVIRONMENT = "production" }
```

## 4. Deployment Verification

### Checklist
- [ ] Frontend builds successfully locally
- [ ] API endpoints respond correctly
- [ ] Map tiles load properly
- [ ] Sensor data displays correctly
- [ ] Alerts are processed and displayed
- [ ] All environment variables are configured

### Testing URLs
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-api.your-subdomain.workers.dev`

## 5. Troubleshooting

### Common Issues

1. **Build Failures**:
   - Ensure Node.js version 16-18
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

2. **API Connection Issues**:
   - Verify `REACT_APP_API_URL` is correctly set
   - Check CORS settings in API

3. **Map Tiles Not Loading**:
   - Check internet connectivity
   - Verify tile provider URLs in mapConfig.js

4. **Git Not Available**:
   - Use GitHub's web interface to upload files
   - Or use GitHub Desktop application

### Environment-Specific Notes

#### Windows Users
- Use PowerShell or Git Bash for commands
- Ensure proper path separators in file paths

#### Mac/Linux Users
- Standard terminal commands work as expected
- Ensure proper file permissions

## 6. Post-Deployment

### Monitoring
- Set up Vercel Analytics for frontend
- Monitor API performance via Cloudflare dashboard
- Check alert processing via Cloudflare Workers logs

### Updates
- Frontend: Automatic deployments on git push
- API: Manual deployment via `wrangler deploy`

## Quick Start Commands

```bash
# Local development
npm run dev          # Start API (Cloudflare Workers)
npm start            # Start frontend (React)

# Production deployment
wrangler deploy      # Deploy API to Cloudflare
# Frontend auto-deploys on git push to Vercel
```

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Cloudflare Workers logs
3. Verify all environment variables
4. Test locally before deployment

Your Smart City Platform is now ready for deployment! 🚀

## Frontend Deployment Configuration

### 1. Build Settings in Cloudflare Pages

When setting up your Cloudflare Pages project, configure these settings:

- **Build command**: `npm run build`
- **Build output directory**: `frontend/build`
- **Root directory**: `frontend`

### 2. Node Version Configuration

The project is configured to use Node.js 16.20.0:

- **package.json**: Added `"engines": {"node": ">=16 <19"}`
- **.nvmrc**: Contains `16.20.0` for automatic version detection

### 3. Environment Variables

Set these environment variables in Cloudflare Pages:

- **REACT_APP_API_URL**: Your API Worker URL (e.g., `https://smart-city-api.your-subdomain.workers.dev`)
- **REACT_APP_WEBSOCKET_URL**: Your WebSocket endpoint (if using)

### 4. Deployment Steps

1. **Push your changes** to trigger automatic deployment
2. **Clear cache and redeploy** if needed:
   - Go to Pages dashboard → Your project → Deployments
   - Click "Clear cache and redeploy"

### 5. Troubleshooting Build Issues

If you encounter build failures:

1. **Check build logs** in Cloudflare Pages dashboard
2. **Verify Node version** compatibility
3. **Ensure all dependencies** are installed in the correct directory
4. **Check for missing environment variables**

### 6. Local Build Verification

Before deploying, verify locally:

```bash
cd frontend
npm install
npm run build
```

The build should complete with exit code 0 and no errors.

### 7. API Integration

The frontend is configured to:
- Fetch data from your Cloudflare Worker API
- Display real-time sensor data
- Show alert notifications
- Update automatically every 30 seconds

### 8. Post-Deployment Verification

After successful deployment:
1. **Test the dashboard** loads correctly
2. **Verify API connections** are working
3. **Check alert notifications** appear properly
4. **Test mobile responsiveness**

## Backend Deployment (Workers)

### API Worker
- Deploy with: `npx wrangler deploy` in `api/` directory
- Ensure `wrangler.toml` is properly configured

### Alert Processor Worker
- Deploy with: `npx wrangler deploy` in `alert-processor/` directory
- Verify Durable Objects are properly bound

## Architecture Overview

```
Frontend (Cloudflare Pages)
    ↓ HTTPS
API Worker (Cloudflare Workers)
    ↓ Queue
Alert Processor (Cloudflare Workers)
    ↓ Notifications
User Devices
```

## Support

If issues persist:
1. Check the build logs in Cloudflare Pages
2. Verify all configuration files are committed
3. Ensure proper environment variables are set
4. Test locally before each deployment