# Smart City Platform - GitHub Upload Automation
# Run this script in PowerShell as Administrator

Write-Host "Smart City Platform - GitHub Upload Automation" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

function Show-Menu {
    Write-Host ""
    Write-Host "1. Install Git (if not available)" -ForegroundColor Yellow
    Write-Host "2. Use GitHub Desktop (Recommended)" -ForegroundColor Yellow  
    Write-Host "3. Manual ZIP upload preparation" -ForegroundColor Yellow
    Write-Host "4. Exit" -ForegroundColor Yellow
    Write-Host ""
}

function Install-Git {
    Write-Host "Installing Git for Windows..." -ForegroundColor Green
    try {
        $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.42.0.windows.2/Git-2.42.0.2-64-bit.exe"
        $installer = "$env:TEMP\git-installer.exe"
        Invoke-WebRequest -Uri $gitUrl -OutFile $installer
        Start-Process -FilePath $installer -Args "/VERYSILENT /NORESTART" -Wait
        Remove-Item $installer
        Write-Host "Git installed successfully! Please restart PowerShell and run this script again." -ForegroundColor Green
    } catch {
        Write-Host "Failed to install Git automatically. Please visit: https://git-scm.com/download/win" -ForegroundColor Red
    }
}

function Use-GitHubDesktop {
    Write-Host "GitHub Desktop is the easiest way to upload your project!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Steps:"
    Write-Host "1. Download GitHub Desktop from: https://desktop.github.com/"
    Write-Host "2. Install and sign in with your GitHub account"
    Write-Host "3. Click 'Add' -> 'Add existing repository'"
    Write-Host "4. Select: C:\Users\tushar\Desktop\REvealxp\smart-city-platform"
    Write-Host "5. Click 'Publish repository'"
    Write-Host ""
    Write-Host "GitHub Desktop will handle everything automatically!" -ForegroundColor Green
    
    $choice = Read-Host "Open GitHub Desktop download page now? (y/n)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Start-Process "https://desktop.github.com/"
    }
}

function Create-ZIPPackage {
    Write-Host "Creating clean upload package..." -ForegroundColor Green
    
    $source = "C:\Users\tushar\Desktop\REvealxp\smart-city-platform"
    $target = "$env:USERPROFILE\Desktop\smart-city-platform-upload"
    
    # Create clean directory
    if (Test-Path $target) {
        Remove-Item $target -Recurse -Force
    }
    New-Item -ItemType Directory -Path $target -Force
    
    # Copy files excluding unwanted directories
    $exclude = @('node_modules', 'build', '.wrangler', '.git', '*.log')
    
    Get-ChildItem $source -Directory | Where-Object { 
        $_.Name -notin $exclude 
    } | Copy-Item -Destination $target -Recurse -Force
    
    Get-ChildItem $source -File | Copy-Item -Destination $target -Force
    
    # Create ZIP file
    $zipPath = "$env:USERPROFILE\Desktop\smart-city-platform.zip"
    Compress-Archive -Path "$target\*" -DestinationPath $zipPath -Force
    
    Write-Host "Upload package created!" -ForegroundColor Green
    Write-Host "Location: $zipPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Go to https://github.com/new"
    Write-Host "2. Create repository 'smart-city-platform'"
    Write-Host "3. Upload the ZIP file contents"
    Write-Host ""
    
    $choice = Read-Host "Open the upload folder now? (y/n)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Start-Process $target
    }
}

# Main execution
do {
    Show-Menu
    $selection = Read-Host "Enter your choice (1-4)"
    
    switch ($selection) {
        '1' { Install-Git }
        '2' { Use-GitHubDesktop }
        '3' { Create-ZIPPackage }
        '4' { Write-Host "Exiting..." -ForegroundColor Green; exit }
        default { Write-Host "Invalid choice. Please try again." -ForegroundColor Red }
    }
    
    Write-Host ""
    $continue = Read-Host "Press Enter to continue..."
    Clear-Host
} while ($selection -ne '4')