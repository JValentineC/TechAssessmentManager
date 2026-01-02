# Deployment Checklist

## Prerequisites Setup
- [ ] NearlyFreeSpeech.net account created
- [ ] Site created on NFSN
- [ ] MySQL database created on NFSN
- [ ] SSH access enabled
- [ ] Note your NFSN credentials:
  - Username: _______________
  - Database Host: _______________.db.nearlyfreespeech.net
  - Database Name: _______________
  - Database User: _______________
  - Database Password: _______________
  - Your Domain: _______________

## Pre-Deployment Steps

### 1. Build Frontend ✓ COMPLETED
```powershell
cd frontend
npm run build
```
**Status:** Build successful (161.97 KB main.js, 8.99 KB main.css)

### 2. Configure Production Environment
Edit `backend/.env` with your production values:
```env
DB_HOST=your_username.db.nearlyfreespeech.net
DB_NAME=your_username_dbname
DB_USER=your_username_dbuser
DB_PASS=YOUR_PRODUCTION_PASSWORD

JWT_SECRET=GENERATE_WITH_OPENSSL_RAND_BASE64_64
JWT_EXPIRY=86400

APP_ENV=production
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

UPLOAD_DIR=/home/private/uploads
SNAPSHOT_DIR=/home/private/snapshots
```

**Generate JWT Secret:**
```bash
openssl rand -base64 64
```
Copy the output and paste it into JWT_SECRET in backend/.env

### 3. Database Setup
Upload and run migrations on NFSN:

**Option A: Via SSH**
```bash
ssh your_username@ssh.nearlyfreespeech.net
cd /home/public
# Clone your repository or upload files
mysql -h your_username.db.nearlyfreespeech.net -u your_username_dbuser -p your_username_dbname < backend/migrations/001_create_tables.sql
mysql -h your_username.db.nearlyfreespeech.net -u your_username_dbuser -p your_username_dbname < backend/migrations/002_seed_data.sql
mysql -h your_username.db.nearlyfreespeech.net -u your_username_dbuser -p your_username_dbname < backend/migrations/003_update_assessment_instructions.sql
```

**Option B: Via phpMyAdmin**
1. Go to NFSN Dashboard → Databases → Manage
2. Click Import tab
3. Upload each SQL file: 001_create_tables.sql, 002_seed_data.sql, 003_update_assessment_instructions.sql

## Deployment Steps

### 4. Upload Backend Files
```bash
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='uploads/*' --exclude='snapshots/*' backend/ your_username@ssh.nearlyfreespeech.net:/home/public/api/
```

**Alternative using SCP:**
```bash
scp -r backend/* your_username@ssh.nearlyfreespeech.net:/home/public/api/
```

### 5. Upload Frontend Files
```bash
rsync -avz frontend/build/ your_username@ssh.nearlyfreespeech.net:/home/public/
```

### 6. Upload Root .htaccess
```bash
scp .htaccess your_username@ssh.nearlyfreespeech.net:/home/public/.htaccess
```

### 7. Set File Permissions
SSH into your server and run:
```bash
ssh your_username@ssh.nearlyfreespeech.net

# Create private directories
mkdir -p /home/private/uploads
mkdir -p /home/private/snapshots

# Set permissions
chmod 755 /home/private/uploads
chmod 755 /home/private/snapshots
chmod 644 /home/public/api/.env
chmod 755 /home/public/api/public
```

### 8. Enable SSL/HTTPS
1. Log into NFSN Control Panel
2. Go to Sites → Your Site → SSL
3. Enable "Let's Encrypt" (free SSL certificate)
4. Wait 5-10 minutes for certificate to provision

### 9. Change Default Passwords **CRITICAL**
Generate new password hashes:
```php
<?php
echo password_hash('YourNewSecurePassword123!', PASSWORD_BCRYPT);
?>
```

Update in database:
```sql
mysql -h your_username.db.nearlyfreespeech.net -u your_username_dbuser -p your_username_dbname

UPDATE users SET password_hash = '$2y$10$NEW_HASH_HERE' WHERE email = 'admin@icstars.org';
UPDATE users SET password_hash = '$2y$10$NEW_HASH_HERE' WHERE email = 'facilitator@icstars.org';
UPDATE users SET password_hash = '$2y$10$NEW_HASH_HERE' WHERE email = 'intern@icstars.org';
```

## Testing & Verification

### 10. Test API Health
```bash
curl https://your-domain.com/api/health
```
**Expected:** JSON response with status

### 11. Test Authentication
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@icstars.org","password":"YOUR_NEW_PASSWORD"}'
```
**Expected:** JWT token returned

### 12. Manual Frontend Testing
1. Visit https://your-domain.com
2. Test login with admin credentials
3. Verify navigation works (Dashboard, Users, Cohorts, Submissions, etc.)
4. Test creating a new user
5. Test creating a new cohort
6. Test viewing submissions
7. Test scoring page
8. Logout and login as facilitator
9. Verify facilitator views work
10. Logout and login as intern
11. Verify intern dashboard shows assessments

### 13. Feature Verification
Test all P0 features:
- [ ] P0.1: Create new users with role assignment
- [ ] P0.2: Manage cohorts (create, edit, add/remove members)
- [ ] P0.3: View global submissions with filters
- [ ] P0.4: Facilitator dashboard shows accurate statuses
- [ ] P0.5: Intern dashboard shows completed assessments
- [ ] P0.6: Score submissions with rubric
- [ ] P0.7: Auto-submit on timer expiry

### 14. Security Checklist
- [ ] SSL/HTTPS enabled
- [ ] Default passwords changed
- [ ] JWT secret is strong and unique
- [ ] .env file not accessible via web
- [ ] File upload directories outside web root
- [ ] Database credentials secure
- [ ] CORS settings restrict to your domain only

## Post-Deployment

### 15. Monitor Error Logs
```bash
ssh your_username@ssh.nearlyfreespeech.net
tail -f /home/logs/error_log
```

### 16. Set Up Backups
Create backup script at `/home/scripts/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h your_username.db.nearlyfreespeech.net \
  -u your_username_dbuser -pYOUR_PASSWORD \
  your_username_dbname > /home/backups/backup_$DATE.sql

# Keep only last 7 days
find /home/backups -name "backup_*.sql" -mtime +7 -delete
```

Set cron job:
```bash
crontab -e
# Add: Run daily at 2 AM
0 2 * * * /home/scripts/backup.sh
```

### 17. Update Documentation
Document your production configuration:
- Domain URL: _______________
- Admin email: _______________
- Database backup location: _______________
- Last deployment date: _______________

## Troubleshooting

**API returns 500 errors:**
- Check `/home/logs/error_log`
- Verify database connection in .env
- Check file permissions

**Routes not working:**
- Verify .htaccess file uploaded correctly
- Check RewriteEngine enabled
- Review Apache error logs

**CORS errors:**
- Update FRONTEND_URL in backend/.env
- Clear browser cache
- Check CORS headers in backend/public/index.php

**File uploads fail:**
- Check directory permissions (755)
- Verify UPLOAD_DIR path
- Check PHP upload limits

## Rollback Plan
If deployment fails:
1. Keep old version backed up
2. Database rollback: `mysql < backup_BEFORE_DEPLOY.sql`
3. Restore previous files from git
4. Verify SSL certificate still valid

## Support Contacts
- NFSN Support: https://members.nearlyfreespeech.net/support/
- i.c.stars Tech Lead: _______________
- Database Admin: _______________

## Deployment Log
| Date | Version | Deployed By | Notes |
|------|---------|-------------|-------|
| 2026-01-02 | 1.0.0 | [Your Name] | Initial deployment with P0.1-P0.7 features |
|      |         |             |       |
