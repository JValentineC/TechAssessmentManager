# Database Setup Script for i.c.stars Assessment System
# Bypasses MySQL authentication plugin issues

Write-Host "`n=== Setting up Assessment System Database ===`n" -ForegroundColor Green

$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$dbName = "assessment_system"

# Read migration files
$migration1 = Get-Content "backend\migrations\001_create_tables.sql" -Raw
$migration2 = Get-Content "backend\migrations\002_seed_data.sql" -Raw

# Create temporary SQL file that includes database creation
$tempSql = @"
CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $dbName;

$migration1

$migration2
"@

$tempFile = "temp_setup.sql"
$tempSql | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Running migrations..." -ForegroundColor Yellow

# Try to execute
try {
    & $mysqlPath -u root < $tempFile 2>&1 | Out-Host
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Database setup complete!" -ForegroundColor Green
        Remove-Item $tempFile
    } else {
        Write-Host "`n⚠️  Error occurred. Please use phpMyAdmin instead:" -ForegroundColor Red
        Write-Host "1. Open http://localhost/phpmyadmin" -ForegroundColor Yellow
        Write-Host "2. Click 'Import' tab" -ForegroundColor Yellow
        Write-Host "3. Upload: backend\migrations\001_create_tables.sql" -ForegroundColor Yellow
        Write-Host "4. Upload: backend\migrations\002_seed_data.sql" -ForegroundColor Yellow
    }
} catch {
    Write-Host "`n⚠️  Error: $_" -ForegroundColor Red
    Write-Host "Please use phpMyAdmin (http://localhost/phpmyadmin)" -ForegroundColor Yellow
}
