# Fix NFSN Server Configuration
$NFSN_USER = "jvc_assessmentmanager"
$NFSN_HOST = "ssh.nyc1.nearlyfreespeech.net"

Write-Host "Fixing server configuration..." -ForegroundColor Cyan

# Remove old api directory and create symlink
Write-Host "`nRemoving old api directory and creating symlink..." -ForegroundColor Yellow
ssh "${NFSN_USER}@${NFSN_HOST}" "cd /home/public && rm -rf api && ln -s /home/protected/backend/public api"

# Upload .htaccess to backend/public
Write-Host "`nUploading .htaccess to backend/public..." -ForegroundColor Yellow
scp "backend/public/.htaccess" "${NFSN_USER}@${NFSN_HOST}:/home/protected/backend/public/.htaccess"

# Verify the setup
Write-Host "`nVerifying configuration..." -ForegroundColor Yellow
ssh "${NFSN_USER}@${NFSN_HOST}" "ls -la /home/public/api && ls -la /home/protected/backend/public/"

Write-Host "`nServer configuration fixed!" -ForegroundColor Green
Write-Host "Try editing an assessment now at: https://assessmentmanager.nfshost.com" -ForegroundColor Cyan
