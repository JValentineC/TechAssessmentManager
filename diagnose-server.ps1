# Check Server Files and Fix Permissions
# This will show what's on the server and fix any issues

$server = "jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net"

Write-Host "Checking server files..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Files in /home/public/:" -ForegroundColor Yellow
ssh $server "ls -la /home/public/"

Write-Host ""
Write-Host "Checking for static folder:" -ForegroundColor Yellow  
ssh $server "ls -la /home/public/static/ 2>&1 | head -10"

Write-Host ""
Write-Host "Checking file permissions on index.html:" -ForegroundColor Yellow
ssh $server "ls -l /home/public/index.html 2>&1"

Write-Host ""
Write-Host "Fixing permissions..." -ForegroundColor Yellow
ssh $server "chmod 644 /home/public/*.html /home/public/*.json; chmod 755 /home/public/static; chmod -R 644 /home/public/static/*; echo Done"

Write-Host ""
Write-Host "Try refreshing the site now" -ForegroundColor Green
