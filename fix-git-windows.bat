@echo off
title Fix Git PATH - Smart City Platform
color 0A

echo.
echo ================================================
echo    FIXING GIT PATH FOR POWERSHELL/TERMINAL
echo ================================================
echo.

echo 🔍 Searching for Git installation...

REM Check common Git installation locations
set "gitPaths[0]=C:\Program Files\Git\cmd"
set "gitPaths[1]=C:\Program Files (x86)\Git\cmd"
set "gitPaths[2]=%%USERPROFILE%%\AppData\Local\Programs\Git\cmd"
set "gitPaths[3]=C:\Program Files\Git\bin"

set "gitFound="
set "gitPath="

for %%i in (0,1,2,3) do (
    if exist "!gitPaths[%%i]!\git.exe" (
        set "gitFound=true"
        set "gitPath=!gitPaths[%%i]!"
        goto :found
    )
)

:found
if defined gitFound (
    echo ✅ Git found at: !gitPath!
    echo.
    echo 📝 Adding Git to PATH...
    
    REM Add to User PATH
    setx PATH "%%PATH%%;!gitPath!"
    
    echo.
    echo ✅ Git PATH added successfully!
    echo 🔄 Please restart PowerShell/Terminal for changes to take effect
    echo.
    echo 🧪 Testing Git...
    "!gitPath!\git.exe" --version
    
    echo.
    echo ================================================
    echo After restarting PowerShell, run:
    echo cd "c:\Users\tushar\Desktop\REvealxp\smart-city-platform"
    echo git init
    echo git add .
    echo git commit -m "Initial commit: Smart City Platform"
    echo git remote add origin https://github.com/TUSHARXP-10/smart-city-platform.git
    echo git push -u origin main
    echo ================================================
) else (
    echo ❌ Git CLI not found on your system
    echo.
    echo 📥 Please install Git for Windows:
    echo 1. Visit: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart your terminal
    echo 4. Run this script again
    echo.
    echo 📱 Alternative: Use GitHub Desktop
    echo 1. Download: https://desktop.github.com/
    echo 2. Add repository: c:\Users\tushar\Desktop\REvealxp\smart-city-platform
    echo 3. Publish to GitHub
)

echo.
pause