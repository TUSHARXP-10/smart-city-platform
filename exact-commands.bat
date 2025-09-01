@echo off
title GitHub Push Commands - Smart City Platform
color 0B

echo.
echo ================================================
echo    EXACT GITHUB PUSH COMMANDS
necho ================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart this terminal
    echo 4. Run this script again
    echo.
    pause
    exit /b
)

echo ✅ Git is installed! Running exact commands...
echo.

REM Change to project directory
cd /d "c:\Users\tushar\Desktop\REvealxp\smart-city-platform"

echo 📁 Current directory:
pwd

echo.
echo 1️⃣  Verifying repository and remote...
git rev-parse --is-inside-work-tree
if %errorlevel% neq 0 (
    echo Initializing new repository...
    git init
    git branch -M main
)

echo.
echo 2️⃣  Checking remote origin...
git remote -v

REM Check if origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/TUSHARXP-10/smart-city-platform.git
) else (
    echo Remote already exists. Checking URL...
    git remote -v
)

echo.
echo 3️⃣  Finding current branch...
git branch --show-current

echo.
echo 4️⃣  Setting upstream and pushing...
git push -u origin main

echo.
echo ================================================
echo 🎉 Push completed! Check your repository:
echo https://github.com/TUSHARXP-10/smart-city-platform
echo ================================================
echo.
echo 📝 If you encounter any errors, please:
echo - Check your GitHub credentials
necho - Ensure you have write access to the repository
necho - Use Personal Access Token for authentication
pause