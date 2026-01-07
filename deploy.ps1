# NFSN Deployment Script for Assessment Manager
# Usage: .\deploy.ps1 [backend|frontend|all]

param(
    [string]$target = "all"
)

$NFSN_USER = "jvc_assessmentmanager"
$NFSN_HOST = "ssh.nyc1.nearlyfreespeech.net"
$REMOTE_PROTECTED = "/home/protected"
$REMOTE_PUBLIC = "/home/public"
$SSH_CONNECTION = "${NFSN_USER}@${NFSN_HOST}"

# Simple SCP options - removed SSH key complexity for reliability
$SCP_OPTS = @("-C", "-o", "Compression=yes")

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploying to NFSN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: You will be prompted for your password several times." -ForegroundColor Yellow
Write-Host "This is normal for NFSN deployments." -ForegroundColor Yellow
Write-Host ""

# Deploy Backend
if ($target -eq "backend" -or $target -eq "all") {
    Write-Host "[1/3] Deploying Backend..." -ForegroundColor Cyan
    
    # Step 1: Create directories and upload small files in one SSH session
    Write-Host "  -> Setting up backend structure..." -ForegroundColor Yellow
    ssh $SSH_CONNECTION @"
mkdir -p ${REMOTE_PROTECTED}/backend/{controllers,config,middleware,migrations}
mkdir -p ${REMOTE_PUBLIC}/api
chmod -R 755 ${REMOTE_PROTECTED}/backend
chmod -R 755 ${REMOTE_PUBLIC}/api
"@
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  X Failed to create directories" -ForegroundColor Red
        exit 1
    }
    
    # Step 2: Upload backend code files
    Write-Host "  -> Uploading backend PHP files..." -ForegroundColor Yellow
    scp @SCP_OPTS -r backend/controllers backend/config backend/middleware "${SSH_CONNECTION}:${REMOTE_PROTECTED}/backend/"
    
    # Step 3: Upload migrations
    Write-Host "  -> Uploading database migrations..." -ForegroundColor Yellow
    scp @SCP_OPTS backend/migrations/*.sql "${SSH_CONNECTION}:${REMOTE_PROTECTED}/backend/migrations/"
    
    # Step 4: Upload .env
    Write-Host "  -> Uploading configuration..." -ForegroundColor Yellow
    scp @SCP_OPTS backend/.env "${SSH_CONNECTION}:${REMOTE_PROTECTED}/backend/"
    
    # Step 5: Upload vendor (this will take the longest)
    Write-Host "  -> Uploading vendor libraries (this may take a few minutes)..." -ForegroundColor Yellow
    Write-Host "    Please be patient..." -ForegroundColor Gray
    scp @SCP_OPTS -r backend/vendor "${SSH_CONNECTION}:${REMOTE_PROTECTED}/backend/"
    
    # Step 6: Upload public API files
    Write-Host "  -> Deploying public API..." -ForegroundColor Yellow
    scp @SCP_OPTS backend/public/index.php backend/public/.htaccess "${SSH_CONNECTION}:${REMOTE_PUBLIC}/api/"
    
    # Step 7: Copy backend to public (for API access)
    Write-Host "  -> Copying backend to public API directory..." -ForegroundColor Yellow
    scp @SCP_OPTS -r backend/controllers backend/config backend/middleware "${SSH_CONNECTION}:${REMOTE_PUBLIC}/api/"
    
    Write-Host "  -> Copying vendor to public API (this may take a few minutes)..." -ForegroundColor Yellow
    scp @SCP_OPTS -r backend/vendor "${SSH_CONNECTION}:${REMOTE_PUBLIC}/api/"
    
    # Step 8: Upload root .htaccess
    Write-Host "  -> Uploading root .htaccess..." -ForegroundColor Yellow
    scp @SCP_OPTS .htaccess "${SSH_CONNECTION}:${REMOTE_PUBLIC}/"
    
    Write-Host "  [OK] Backend deployed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Deploy Frontend
if ($target -eq "frontend" -or $target -eq "all") {
    Write-Host "[2/3] Building and Deploying Frontend..." -ForegroundColor Cyan
    
    # Build frontend
    Write-Host "  -> Building React application..." -ForegroundColor Yellow
    Push-Location frontend
    npm run build
    Pop-Location
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  X Frontend build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  -> Uploading frontend files..." -ForegroundColor Yellow
    scp @SCP_OPTS frontend/build/*.* "${SSH_CONNECTION}:${REMOTE_PUBLIC}/"
    scp @SCP_OPTS -r frontend/build/static "${SSH_CONNECTION}:${REMOTE_PUBLIC}/"
    
    Write-Host "  [OK] Frontend deployed successfully!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "  [OK] Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your site: https://assessmentmanager.nfshost.com" -ForegroundColor Cyan
Write-Host ""

# Offer to run migrations
Write-Host "[3/3] Database Migrations" -ForegroundColor Cyan
Write-Host "Do you need to run database migrations? (Y/N)" -ForegroundColor Yellow
$runMigrations = Read-Host

if ($runMigrations -eq "Y" -or $runMigrations -eq "y") {
    Write-Host ""
    Write-Host "Database Migration Instructions:" -ForegroundColor Yellow
    Write-Host "=================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Connect to your server:" -ForegroundColor White
    Write-Host "   ssh ${SSH_CONNECTION}" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Run a specific migration:" -ForegroundColor White
    Write-Host '   mysql -h assessment.db -u jvc -p assessment < /home/protected/backend/migrations/XXX_migration_name.sql' -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Or run all pending migrations:" -ForegroundColor White
    Write-Host '   for file in /home/protected/backend/migrations/*.sql; do mysql -h assessment.db -u jvc -p assessment < $file; done' -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "  -> Skipping migrations" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Deployment session complete. Thank you!" -ForegroundColor Green
