# Quick Fix - Upload Frontend Static Files
# Run this from project root

Write-Host "Uploading frontend files to NFSN..." -ForegroundColor Cyan

$server = "jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net"

# Upload static folder specifically
Write-Host "`nUploading static folder..." -ForegroundColor Yellow
scp -r "frontend\build\static" "${server}:/home/public/"

# Upload root files
Write-Host "`nUploading root files..." -ForegroundColor Yellow
scp "frontend\build\index.html" "${server}:/home/public/"
scp "frontend\build\manifest.json" "${server}:/home/public/"
scp "frontend\build\asset-manifest.json" "${server}:/home/public/"

Write-Host "`n✓ Done! Test at https://assessmentmanager.nfshost.com" -ForegroundColor Green
