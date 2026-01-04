# NFSN Deployment Script for Assessment Manager
# Usage: .\deploy.ps1 [backend|frontend|all]

param(
    [string]$target = "all"
)

$NFSN_USER = "jvc_assessmentmanager"
$NFSN_HOST = "ssh.nyc1.nearlyfreespeech.net"
$REMOTE_PROTECTED = "/home/protected"
$REMOTE_PUBLIC = "/home/public"

Write-Host "Deploying to NFSN..." -ForegroundColor Cyan

# Deploy Backend
if ($target -eq "backend" -or $target -eq "all") {
    Write-Host "`nDeploying Backend..." -ForegroundColor Yellow
    
    # Upload protected backend files
    scp -r "backend/controllers" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PROTECTED}/backend/"
    scp -r "backend/config" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PROTECTED}/backend/"
    scp -r "backend/middleware" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PROTECTED}/backend/"
    scp -r "backend/migrations" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PROTECTED}/backend/"
    scp -r "backend/vendor" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PROTECTED}/backend/"
    
    # Upload .env file
    scp "backend/.env" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PROTECTED}/backend/"
    
    # Upload backend public files (API entry point) to /home/public/api
    Write-Host "`nDeploying API to public directory..." -ForegroundColor Yellow
    ssh "${NFSN_USER}@${NFSN_HOST}" "mkdir -p ${REMOTE_PUBLIC}/api"
    scp "backend/public/index.php" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/api/"
    scp "backend/public/.htaccess" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/api/"
    
    # Copy backend files to public API directory (required for API to work)
    # NOTE: .env stays in protected directory for security
    Write-Host "Copying backend files to public API..." -ForegroundColor Yellow
    scp -r "backend/controllers" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/api/"
    scp -r "backend/config" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/api/"
    scp -r "backend/middleware" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/api/"
    scp -r "backend/vendor" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/api/"
    
    # Upload root .htaccess
    scp ".htaccess" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/"
    
    Write-Host "Backend deployed!" -ForegroundColor Green
}

# Deploy Frontend
if ($target -eq "frontend" -or $target -eq "all") {
    Write-Host "`nBuilding Frontend..." -ForegroundColor Yellow
    
    # Build frontend
    Push-Location frontend
    npm run build
    Pop-Location
    
    Write-Host "`nDeploying Frontend..." -ForegroundColor Yellow
    
    # Upload frontend build - upload the entire build directory contents
    # First, upload all files in the root of build/
    scp "frontend/build/*.*" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/"
    
    # Then upload the static directory recursively
    scp -r "frontend/build/static" "${NFSN_USER}@${NFSN_HOST}:${REMOTE_PUBLIC}/"
    
    # Fix permissions on static files
    Write-Host "`nFixing permissions..." -ForegroundColor Yellow
    ssh "${NFSN_USER}@${NFSN_HOST}" "chmod -R 755 ${REMOTE_PUBLIC}/static"
    
    Write-Host "Frontend deployed!" -ForegroundColor Green
}

Write-Host "`nDeployment Complete!" -ForegroundColor Green
Write-Host "Visit: https://assessmentmanager.nfshost.com" -ForegroundColor Cyan

# Offer to run migrations
Write-Host "`nDo you need to run database migrations? (Y/N)" -ForegroundColor Yellow
$runMigrations = Read-Host
if ($runMigrations -eq "Y" -or $runMigrations -eq "y") {
    Write-Host "`nConnect to database and run migrations manually:" -ForegroundColor Yellow
    Write-Host "ssh ${NFSN_USER}@${NFSN_HOST}" -ForegroundColor White
    Write-Host 'mysql -h assessment.db -u jvc -p assessment < /home/protected/backend/migrations/005_add_task_types.sql' -ForegroundColor White
}
