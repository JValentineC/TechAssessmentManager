# Quick Fix - Upload Static Folder
# This will fix the 403 errors for CSS/JS files

Write-Host "🔧 Fixing static files deployment..." -ForegroundColor Cyan
Write-Host ""

$server = "jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net"
$buildPath = "frontend\build"

# Upload the static folder specifically
Write-Host "📦 Uploading static folder (CSS & JS files)..." -ForegroundColor Yellow
scp -r "$buildPath\static" "${server}:/home/public/"

Write-Host ""
Write-Host "✅ Done! Now test:" -ForegroundColor Green
Write-Host "   https://assessmentmanager.nfshost.com" -ForegroundColor White
Write-Host ""
Write-Host "The static folder should now be accessible at:" -ForegroundColor Cyan
Write-Host "   https://assessmentmanager.nfshost.com/static/js/main.05c672d1.js" -ForegroundColor White
Write-Host "   https://assessmentmanager.nfshost.com/static/css/main.56075995.css" -ForegroundColor White
