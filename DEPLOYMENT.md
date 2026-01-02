# Deployment Guide - NearlyFreeSpeech.net

This guide covers deploying the i.c.stars Assessment Management System to NearlyFreeSpeech.net (NFSN).

## Prerequisites

- NFSN account with a site created
- SSH access enabled
- MySQL database created on NFSN
- Local git repository
- Domain name (optional but recommended)

## Part 1: Database Setup

### 1.1 Create MySQL Database on NFSN

1. Log into your NFSN member interface
2. Go to **Databases** → **Create a MySQL Database**
3. Note your database credentials:
   - Database name: `username_dbname`
   - Username: `username_dbuser`
   - Password: (you set this)
   - Host: `username.db.nearlyfreespeech.net`

### 1.2 Import Database Schema

Using SSH:

```bash
# SSH into your NFSN site
ssh username@ssh.nearlyfreespeech.net

# Navigate to your site directory
cd /home/public

# Upload migration files (or use git clone)
# Run migrations
mysql -h username.db.nearlyfreespeech.net -u username_dbuser -p username_dbname < backend/migrations/001_create_tables.sql
mysql -h username.db.nearlyfreespeech.net -u username_dbuser -p username_dbname < backend/migrations/002_seed_data.sql
```

Alternatively, use phpMyAdmin (available in NFSN control panel):
1. Go to **Databases** → Click your database → **Manage**
2. Use **Import** tab to upload SQL files

## Part 2: Backend Deployment

### 2.1 Prepare Backend Files

On your local machine:

```bash
cd backend

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Copy environment file
cp .env.example .env
```

### 2.2 Configure Environment

Edit `backend/.env`:

```env
# Database
DB_HOST=username.db.nearlyfreespeech.net
DB_NAME=username_dbname
DB_USER=username_dbuser
DB_PASS=your_database_password
DB_CHARSET=utf8mb4

# JWT (Generate a secure random key!)
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_64_CHARS_MIN
JWT_EXPIRY=86400

# Application
APP_ENV=production
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# File Upload
UPLOAD_DIR=/home/private/uploads
MAX_FILE_SIZE=10485760

# Proctoring
PROCTORING_ENABLED=true
SNAPSHOT_DIR=/home/private/snapshots
```

**Important:** Generate a secure JWT secret:
```bash
openssl rand -base64 64
```

### 2.3 Upload Backend to NFSN

Using rsync (recommended):

```bash
# From your project root
rsync -avz --exclude='node_modules' --exclude='.git' backend/ username@ssh.nearlyfreespeech.net:/home/public/api/
```

Using git:

```bash
# SSH into NFSN
ssh username@ssh.nearlyfreespeech.net

# Clone repository
cd /home/public
git clone https://your-repo-url.git
mv your-repo/backend api
```

### 2.4 Set Up File Permissions

```bash
# SSH into NFSN
ssh username@ssh.nearlyfreespeech.net

# Create upload directories outside web root
mkdir -p /home/private/uploads
mkdir -p /home/private/snapshots
chmod 755 /home/private/uploads
chmod 755 /home/private/snapshots

# Set permissions
cd /home/public/api
chmod 644 .env
chmod 755 public
```

### 2.5 Configure Web Server

Create `/home/public/.htaccess`:

```apache
# Enable PHP 8
AddHandler php80-cgi .php

# API Routing
RewriteEngine On
RewriteBase /

# Route API requests to api/public/index.php
RewriteCond %{REQUEST_URI} ^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/public/index.php [QSA,L]

# Frontend routing (for React)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

## Part 3: Frontend Deployment

### 3.1 Configure Frontend

Edit `frontend/.env`:

```env
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_ENABLE_PROCTORING=true
REACT_APP_SNAPSHOT_INTERVAL_MIN=300000
REACT_APP_SNAPSHOT_INTERVAL_MAX=900000
```

### 3.2 Build Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 3.3 Upload Frontend

```bash
# Upload build files
rsync -avz build/ username@ssh.nearlyfreespeech.net:/home/public/
```

Or manually via SFTP:
1. Upload all files from `frontend/build/` to `/home/public/`

## Part 4: Security & Configuration

### 4.1 Secure Your Site

1. **Enable HTTPS:**
   - In NFSN control panel: **Sites** → Your site → **SSL**
   - Enable "Let's Encrypt" for free SSL certificate

2. **Protect sensitive files:**

Create `/home/public/api/.htaccess`:

```apache
# Deny access to .env
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

# Deny access to vendor directory
RedirectMatch 403 ^/api/vendor/.*$
```

3. **Set secure headers** in `backend/public/index.php` (already included):

```php
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
```

### 4.2 Change Default Passwords

**CRITICAL:** Change default user passwords immediately!

```sql
-- SSH into your database
mysql -h username.db.nearlyfreespeech.net -u username_dbuser -p username_dbname

-- Update passwords
UPDATE users SET password_hash = '$2y$10$YOUR_NEW_HASH_HERE' WHERE email = 'admin@icstars.org';
UPDATE users SET password_hash = '$2y$10$YOUR_NEW_HASH_HERE' WHERE email = 'facilitator@icstars.org';
UPDATE users SET password_hash = '$2y$10$YOUR_NEW_HASH_HERE' WHERE email = 'intern@icstars.org';
```

Generate password hashes using PHP:

```php
<?php
echo password_hash('YourNewSecurePassword123!', PASSWORD_BCRYPT);
?>
```

## Part 5: Testing & Verification

### 5.1 Test API Endpoints

```bash
# Test authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@icstars.org","password":"Admin@2026!"}'

# Should return JWT token
```

### 5.2 Test Frontend

1. Visit `https://your-domain.com`
2. Log in with admin credentials
3. Verify:
   - Dashboard loads
   - Cohort selector works
   - Access Control page displays assessments
   - Can create test users

### 5.3 Test Intern Flow

1. Log in as intern
2. Go to "My Assessments"
3. Verify visibility controls work (assessments not visible if not enabled)
4. Enable an assessment in Access Control
5. Verify intern can see it

## Part 6: Maintenance & Monitoring

### 6.1 Backup Strategy

Create automated backups:

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h username.db.nearlyfreespeech.net \
  -u username_dbuser -p'password' \
  username_dbname > backup_$DATE.sql
```

Set up cron job on NFSN (via SSH):

```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/scripts/backup.sh
```

### 6.2 Monitor Logs

Check PHP error logs:

```bash
ssh username@ssh.nearlyfreespeech.net
tail -f /home/logs/error_log
```

### 6.3 Update Application

```bash
# Pull latest changes
cd /home/public/api
git pull origin main

# Update dependencies
composer install --no-dev

# Restart PHP (NFSN does this automatically)
```

## Part 7: Troubleshooting

### Common Issues

**1. "Database connection failed"**
- Verify database credentials in `.env`
- Check database host is correct
- Ensure database user has permissions

**2. "CORS errors"**
- Verify `FRONTEND_URL` in backend `.env`
- Check headers in `backend/public/index.php`

**3. "File upload fails"**
- Check directory permissions: `chmod 755 /home/private/uploads`
- Verify `UPLOAD_DIR` path in `.env`
- Check PHP upload limits in `.htaccess`:

```apache
php_value upload_max_filesize 10M
php_value post_max_size 10M
```

**4. "JWT token invalid"**
- Verify `JWT_SECRET` is set in `.env`
- Check token expiry settings
- Clear browser cache

**5. "Routes not working"**
- Verify `.htaccess` file exists
- Check `RewriteEngine` is enabled
- View Apache error logs

## Part 8: Performance Optimization

### 8.1 Enable Compression

Add to `.htaccess`:

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### 8.2 Cache Static Assets

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 8.3 Database Indexing

Already included in migration, but verify:

```sql
SHOW INDEX FROM assessment_windows;
SHOW INDEX FROM submissions;
```

## Part 9: Going Live Checklist

- [ ] Database created and migrations run
- [ ] Environment variables configured
- [ ] JWT secret generated and set
- [ ] Default passwords changed
- [ ] HTTPS/SSL enabled
- [ ] File upload directories created with correct permissions
- [ ] Frontend built and uploaded
- [ ] Backend uploaded and configured
- [ ] .htaccess files in place
- [ ] API endpoints tested
- [ ] Login tested for all roles
- [ ] Assessment flow tested end-to-end
- [ ] Proctoring tested
- [ ] Backup script configured
- [ ] Error monitoring in place

## Support

For NFSN-specific issues:
- FAQ: https://faq.nearlyfreespeech.net/
- Support: https://members.nearlyfreespeech.net/support/

For application issues:
- Contact: support@icstars.org
- Check logs in `/home/logs/`

## Security Notes

1. **Never commit `.env` files to git**
2. **Regularly update dependencies**: `composer update`
3. **Monitor audit logs** for suspicious activity
4. **Review access overrides** periodically
5. **Backup database** before major changes
6. **Use strong passwords** for all accounts
7. **Limit facilitator accounts** to trusted staff only

## Cost Considerations

NFSN pricing (as of 2026):
- **Bandwidth:** $0.50/GB
- **Storage:** $0.50/GB/month
- **MySQL:** $0.015/day

Estimated monthly cost for 100 users:
- Storage (5GB): ~$2.50
- Database: ~$0.45
- Bandwidth (10GB): ~$5.00
- **Total:** ~$8-10/month

Tips to reduce costs:
- Optimize image uploads (compress snapshots)
- Use CDN for static assets
- Archive old cohorts regularly
