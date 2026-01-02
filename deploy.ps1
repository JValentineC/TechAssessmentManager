# Deployment Script for NearlyFreeSpeech.net
# Usage: .\deploy.ps1 [-skipBuild]
# Configured for: jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net

param(
    [Parameter(Mandatory=$false)]
    [string]$server = "jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net",
    
    [Parameter(Mandatory=$false)]
    [switch]$skipBuild
)

Write-Host "=== Assessment Management System Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Frontend (if not skipped)
if (-not $skipBuild) {
    Write-Host "[1/5] Building frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Frontend build failed!" -ForegroundColor Red
        exit 1
    }
    Set-Location ..
    Write-Host "Frontend build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "[1/5] Skipping frontend build..." -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Upload Backend
Write-Host "[2/5] Uploading backend files..." -ForegroundColor Yellow
Write-Host "Command: rsync -avz --exclude='node_modules' --exclude='.git' --exclude='uploads/*' --exclude='snapshots/*' backend/ $server`:/home/public/api/"
Write-Host ""
Write-Host "Please run the following command manually:" -ForegroundColor Cyan
Write-Host "  rsync -avz --exclude='node_modules' --exclude='.git' --exclude='uploads/*' --exclude='snapshots/*' backend/ $server`:/home/public/api/" -ForegroundColor White
Write-Host ""

# Step 3: Upload Frontend
Write-Host "[3/5] Uploading frontend files..." -ForegroundColor Yellow
Write-Host "Command: rsync -avz frontend/build/ $server`:/home/public/"
Write-Host ""
Write-Host "Please run the following command manually:" -ForegroundColor Cyan
Write-Host "  rsync -avz frontend/build/ $server`:/home/public/" -ForegroundColor White
Write-Host ""

# Step 4: Upload root .htaccess
Write-Host "[4/5] Uploading root .htaccess..." -ForegroundColor Yellow
Write-Host "Command: scp .htaccess $server`:/home/public/.htaccess"
Write-Host ""
Write-Host "Please run the following command manually:" -ForegroundColor Cyan
Write-Host "  scp .htaccess $server`:/home/public/.htaccess" -ForegroundColor White
Write-Host ""

# Step 5: Set Permissions
Write-Host "[5/5] Setting permissions..." -ForegroundColor Yellow
Write-Host "SSH commands to run on the server:" -ForegroundColor Cyan
Write-Host "  ssh $server" -ForegroundColor White
Write-Host "  mkdir -p /home/private/uploads /home/private/snapshots" -ForegroundColor White
Write-Host "  chmod 755 /home/private/uploads /home/private/snapshots" -ForegroundColor White
Write-Host "  chmod 644 /home/public/api/.env" -ForegroundColor White
Write-Host ""

Write-Host "=== Deployment Preparation Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update backend/.env with production database credentials" -ForegroundColor White
Write-Host "2. Generate secure JWT secret: openssl rand -base64 64" -ForegroundColor White
Write-Host "3. Run the rsync/scp commands above" -ForegroundColor White
Write-Host "4. SSH to server and run permission commands" -ForegroundColor White
Write-Host "5. Test: curl https://your-domain.com/api/health" -ForegroundColor White
Write-Host "6. Login and verify all features work" -ForegroundColor White
Write-Host ""
