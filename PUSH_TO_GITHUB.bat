@echo off
title Push Smart City Platform to GitHub
color 0A

echo.
echo ================================================
echo    SMART CITY PLATFORM - GITHUB PUSH HELPER
echo ================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git is NOT installed on this system.
    echo.
    echo Option 1: Install Git for Windows
    echo ---------------------------------
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart this terminal
    echo 4. Run this script again
    echo.
    echo Option 2: Use GitHub Desktop (Easier)
    echo -------------------------------------
    echo 1. Download GitHub Desktop: https://desktop.github.com/
    echo 2. Open GitHub Desktop
    echo 3. Click "Add" -> "Add existing repository"
    echo 4. Select: c:\Users\tushar\Desktop\REvealxp\smart-city-platform
    echo 5. Publish to GitHub
    echo.
    pause
    exit /b
)

echo Git is installed! Proceeding with GitHub push...
echo.

REM Change to project directory
cd /d "c:\Users\tushar\Desktop\REvealxp\smart-city-platform"

REM Initialize Git repository if not already done
if not exist ".git" (
    echo Initializing Git repository...
    git init
    git branch -M main
)

REM Check current branch
echo Current branch:
git branch --show-current

REM Add remote if not already added
git remote -v | findstr "github.com/TUSHARXP-10/smart-city-platform" >nul
if %errorlevel% neq 0 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/TUSHARXP-10/smart-city-platform.git
)

echo.
echo Adding files to Git...
git add .

echo.
echo Committing files...
git commit -m "Initial commit: Smart City Platform with real-time alerts, threshold monitoring, and multi-service architecture"

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ================================================
echo Push completed! Check your GitHub repository:
echo https://github.com/TUSHARXP-10/smart-city-platform
echo ================================================
echo.
pause