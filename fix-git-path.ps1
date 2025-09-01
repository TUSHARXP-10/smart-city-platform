# Fix Git PATH Issue for PowerShell
# Run this script to add Git to your PowerShell PATH

Write-Host "🔍 Checking Git installation..." -ForegroundColor Yellow

# Common Git installation paths
$gitPaths = @(
    "C:\Program Files\Git\cmd",
    "C:\Program Files (x86)\Git\cmd", 
    "C:\Users\$env:USERNAME\AppData\Local\Programs\Git\cmd",
    "C:\Program Files\Git\bin"
)

$gitFound = $false
$correctPath = $null

foreach ($path in $gitPaths) {
    if (Test-Path "$path\git.exe") {
        $correctPath = $path
        $gitFound = $true
        Write-Host "✅ Git found at: $path" -ForegroundColor Green
        break
    }
}

if (-not $gitFound) {
    Write-Host "❌ Git CLI not found in standard locations" -ForegroundColor Red
    Write-Host "📥 Please install Git for Windows from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "   Or use GitHub Desktop instead" -ForegroundColor Yellow
    exit 1
}

# Check if Git is already in PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -like "*$correctPath*") {
    Write-Host "✅ Git is already in PATH" -ForegroundColor Green
} else {
    Write-Host "📝 Adding Git to PATH..." -ForegroundColor Yellow
    
    # Add to User PATH
    $newPath = $currentPath + ";" + $correctPath
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    
    Write-Host "✅ Added Git to PATH" -ForegroundColor Green
    Write-Host "🔄 Please restart PowerShell/Terminal for changes to take effect" -ForegroundColor Yellow
}

# Test Git
Write-Host "🧪 Testing Git..." -ForegroundColor Yellow
$env:PATH += ";$correctPath"
try {
    $gitVersion = git --version
    Write-Host "✅ Git is now working: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git still not accessible" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Ready to push to GitHub! Run these commands:" -ForegroundColor Green
Write-Host "cd '$pwd'" -ForegroundColor Cyan
Write-Host "git init" -ForegroundColor Cyan
Write-Host "git add ." -ForegroundColor Cyan
Write-Host "git commit -m 'Initial commit: Smart City Platform'" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/TUSHARXP-10/smart-city-platform.git" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan