# Verify and Fix Static Files Deployment
# Run from: ssh terminal

Write-Host "Checking server directory structure..." -ForegroundColor Cyan
ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net "ls -la /home/public/ && echo '---' && ls -la /home/public/static/ 2>&1"
