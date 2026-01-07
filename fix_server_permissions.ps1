# Fix NFSN Server Permissions and SSH Key
# Run this script to diagnose and fix deployment issues

$SSH_CONNECTION = "jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net"

Write-Host "=== Diagnosing NFSN Server Issues ===" -ForegroundColor Cyan

# Step 1: Check SSH key
Write-Host "`n1. Checking SSH key authentication..." -ForegroundColor Yellow
Write-Host "Your NFSN public key:"
Get-Content $env:USERPROFILE\.ssh\id_ed25519_nfsn.pub

Write-Host "`n`nConnecting to server to check authorized_keys..." -ForegroundColor Yellow
ssh $SSH_CONNECTION @"
echo "=== Checking authorized_keys ==="
cat ~/.ssh/authorized_keys | grep -c 'ssh-ed25519'
echo "Number of SSH keys found: "
echo ""
echo "=== Checking file permissions ==="
ls -la /home/protected/backend/controllers/ | head -5
echo ""
echo "=== Checking directory permissions ==="
ls -ld /home/protected/backend/
ls -ld /home/protected/backend/controllers/
ls -ld /home/protected/backend/migrations/
echo ""
echo "=== Checking if files are writable ==="
if [ -w /home/protected/backend/controllers/RubricController.php ]; then
    echo "✓ RubricController.php is writable"
else
    echo "✗ RubricController.php is NOT writable"
fi
"@

Write-Host "`n`n=== Recommended Fixes ===" -ForegroundColor Cyan
Write-Host @"

If SSH key authentication didn't work:
1. SSH to server manually: ssh $SSH_CONNECTION
2. Run: cat ~/.ssh/authorized_keys
3. Verify your key is present
4. If not, add it: echo "$(Get-Content $env:USERPROFILE\.ssh\id_ed25519_nfsn.pub)" >> ~/.ssh/authorized_keys

If permission errors occurred:
1. SSH to server: ssh $SSH_CONNECTION
2. Fix permissions:
   chmod -R 755 /home/protected/backend
   chmod -R 755 /home/public/api

Would you like to apply fixes automatically? (Y/N)
"@

$response = Read-Host
if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host "`nApplying fixes..." -ForegroundColor Yellow
    
    # Fix permissions on server
    ssh $SSH_CONNECTION @"
chmod -R 755 /home/protected/backend 2>/dev/null || echo "Note: Some permission changes may have failed"
chmod -R 755 /home/public/api 2>/dev/null || echo "Note: Some permission changes may have failed"
echo "Permissions updated!"
"@
    
    Write-Host "`nFixes applied! Try deploying again with: .\deploy.ps1 backend" -ForegroundColor Green
}
