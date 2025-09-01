# GitHub Push Guide - Smart City Platform

Since Git is not currently installed on your system, here are your options to push the Smart City Platform to GitHub:

## Option 1: Install Git (Recommended)

### Step 1: Download and Install Git
1. Visit: https://git-scm.com/download/win
2. Download Git for Windows
3. Run the installer with default settings
4. Restart your terminal/command prompt

### Step 2: Push to GitHub
Open PowerShell or Command Prompt and run:

```bash
cd "c:\Users\tushar\Desktop\REvealxp\smart-city-platform"
git init
git branch -M main
git add .
git commit -m "Initial commit: Smart City Platform with real-time alerts, threshold monitoring, and multi-service architecture"
git remote add origin https://github.com/TUSHARXP-10/smart-city-platform.git
git push -u origin main
```

## Option 2: Use GitHub Desktop (Easiest)

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and open GitHub Desktop
3. Click "Add" → "Add existing repository"
4. Select folder: `c:\Users\tushar\Desktop\REvealxp\smart-city-platform`
5. Click "Publish repository" to push to GitHub

## Option 3: Use Provided Scripts

### Batch Script (Windows)
Double-click: `PUSH_TO_GITHUB.bat`

### PowerShell Script
Right-click and "Run with PowerShell": `install-git-and-push.ps1`

## Authentication

When pushing for the first time, you'll need to authenticate:

### HTTPS (easiest for beginners)
- Username: your GitHub username
- Password: Use a Personal Access Token (PAT)
  - Go to GitHub → Settings → Developer settings → Personal access tokens
  - Generate a new token with `repo` permissions
  - Use this token as your password

### SSH (more secure long-term)
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your-email@example.com"`
2. Add key to GitHub: Settings → SSH and GPG keys → New SSH key
3. Change remote URL: `git remote set-url origin git@github.com:TUSHARXP-10/smart-city-platform.git`

## Troubleshooting

### If you get "main branch not found"
```bash
git branch -M main
git push -u origin main
```

### If you get "remote contains work you do not have"
```bash
git fetch origin
git pull --rebase origin main
git push
```

### If you get "permission denied"
- Check your GitHub credentials
- Ensure you have write access to the repository
- Try using a Personal Access Token instead of password

## Repository Structure

The Smart City Platform includes:
- **Frontend**: React app for the dashboard (deploys to Vercel)
- **API**: Cloudflare Workers for data handling
- **Alert Processor**: Cloudflare Workers for threshold monitoring
- **Documentation**: README, deployment guides, and setup instructions

## After Pushing

Once successfully pushed, you can:
1. View your code at: https://github.com/TUSHARXP-10/smart-city-platform
2. Deploy using:
   - Frontend: `cd frontend && npm run deploy` (Vercel)
   - API: `cd api && npm run deploy` (Cloudflare Workers)
   - Alert Processor: `cd alert-processor && npm run deploy` (Cloudflare Workers)