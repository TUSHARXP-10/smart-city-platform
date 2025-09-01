# Install Git for Windows and push to GitHub
# Run this script as Administrator

Write-Host "Installing Git for Windows..." -ForegroundColor Green

# Download Git for Windows
$gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe"
$gitInstaller = "$env:TEMP\Git-2.44.0-64-bit.exe"

# Download the installer
Invoke-WebRequest -Uri $gitUrl -OutFile $gitInstaller

# Install Git silently
Start-Process -FilePath $gitInstaller -ArgumentList "/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-", "/CLOSEAPPLICATIONS", "/RESTARTAPPLICATIONS", "/COMPONENTS=icons,ext\reg\shellhere,assoc,assoc_sh" -Wait

# Add Git to PATH
$env:Path += ";C:\Program Files\Git\cmd"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::User)

Write-Host "Git installed successfully!" -ForegroundColor Green
Write-Host "Please restart your terminal and run the following commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "cd 'c:\Users\tushar\Desktop\REvealxp\smart-city-platform'" -ForegroundColor Cyan
Write-Host "git init" -ForegroundColor Cyan
Write-Host "git add ." -ForegroundColor Cyan
Write-Host "git commit -m 'Initial commit: Smart City Platform with real-time alerts'" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/TUSHARXP-10/smart-city-platform.git" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "If 'main' branch doesn't exist, use: git branch -M main" -ForegroundColor Yellow