# Quick Deployment Guide

## ✅ Completed Preparation Steps

1. **Frontend Build** ✓

   - Production build created successfully
   - Files ready in `frontend/build/`
   - Total size: ~170 KB (optimized)

2. **Configuration Files** ✓
   - Root `.htaccess` created (API routing + SPA support)
   - Backend `.htaccess` created (security + PHP settings)
   - `backend/.env` template created
   - `deploy.ps1` PowerShell script created
   - `DEPLOYMENT_CHECKLIST.md` comprehensive guide created

## 🔧 What You Need to Configure

Before uploading files, update these with YOUR production values:

### 1. Edit `backend/.env`

Replace these placeholders:

```env
DB_HOST=YOUR_USERNAME.db.nearlyfreespeech.net
DB_NAME=YOUR_USERNAME_dbname
DB_USER=YOUR_USERNAME_dbuser
DB_PASS=YOUR_DATABASE_PASSWORD

JWT_SECRET=RUN_THIS_COMMAND_openssl_rand_base64_64
APP_URL=https://YOUR-DOMAIN.com
FRONTEND_URL=https://YOUR-DOMAIN.com
```

### 2. Generate JWT Secret

Run this command and copy the output:

```bash
openssl rand -base64 64
```

## 📤 Upload Commands

Replace `YOUR_USERNAME` with your NFSN username:

### Upload Backend

```bash
rsync -avz --exclude='node_modules' --exclude='.git' backend/ YOUR_USERNAME@ssh.nearlyfreespeech.net:/home/public/api/
```

### Upload Frontend

```bash
rsync -avz frontend/build/ YOUR_USERNAME@ssh.nearlyfreespeech.net:/home/public/
```

### Upload Root .htaccess

```bash
scp .htaccess YOUR_USERNAME@ssh.nearlyfreespeech.net:/home/public/.htaccess
```

## 🗄️ Database Setup

### SSH to Server

```bash
ssh YOUR_USERNAME@ssh.nearlyfreespeech.net
```

### Run Migrations

```bash
mysql -h YOUR_USERNAME.db.nearlyfreespeech.net -u YOUR_USERNAME_dbuser -p YOUR_USERNAME_dbname < backend/migrations/001_create_tables.sql
mysql -h YOUR_USERNAME.db.nearlyfreespeech.net -u YOUR_USERNAME_dbuser -p YOUR_USERNAME_dbname < backend/migrations/002_seed_data.sql
mysql -h YOUR_USERNAME.db.nearlyfreespeech.net -u YOUR_USERNAME_dbuser -p YOUR_USERNAME_dbname < backend/migrations/003_update_assessment_instructions.sql
```

### Create Required Directories

```bash
mkdir -p /home/private/uploads /home/private/snapshots
chmod 755 /home/private/uploads /home/private/snapshots
chmod 644 /home/public/api/.env
```

## 🔒 Security (CRITICAL)

### 1. Enable SSL

- NFSN Control Panel → Sites → Your Site → SSL
- Enable "Let's Encrypt" (free)

### 2. Change Default Passwords

Default accounts (⚠️ CHANGE IMMEDIATELY):

- admin@icstars.org / Admin@2026!
- facilitator@icstars.org / Facilitator@2026!
- intern@icstars.org / Intern@2026!

Generate new password hash:

```php
<?php echo password_hash('YourNewPassword123!', PASSWORD_BCRYPT); ?>
```

Update in database:

```sql
UPDATE users SET password_hash = 'NEW_HASH' WHERE email = 'admin@icstars.org';
```

## ✅ Testing

### Test API

```bash
curl https://YOUR-DOMAIN.com/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"admin@icstars.org","password":"YOUR_NEW_PASSWORD"}'
```

### Test Frontend

1. Visit https://YOUR-DOMAIN.com
2. Login with new admin credentials
3. Verify all features:
   - ✓ Dashboard loads
   - ✓ Users page (create/edit users)
   - ✓ Cohorts page (manage cohorts)
   - ✓ Submissions page (view/filter)
   - ✓ Scoring page (score submissions)
   - ✓ Access Control (manage windows)

## 📊 Features Deployed

All P0 Critical Features:

- ✅ P0.1: Admin Create New Users
- ✅ P0.2: Admin Cohort Management CRUD
- ✅ P0.3: Global Submissions Index
- ✅ P0.4: Facilitator Dashboard Status Fix
- ✅ P0.5: Intern Dashboard Completion
- ✅ P0.6: Scoring Page Workflow
- ✅ P0.7: Auto-Submit Finalization

## 📋 Files Ready for Deployment

```
✓ frontend/build/          # Production React build (161.97 KB)
✓ backend/                 # PHP API with all P0 features
✓ backend/.env             # Configuration template (EDIT THIS!)
✓ .htaccess                # Root web server config
✓ backend/api/.htaccess    # API security config
✓ DEPLOYMENT_CHECKLIST.md  # Detailed step-by-step guide
✓ deploy.ps1               # PowerShell helper script
```

## 🚀 Quick Start (3 Commands)

1. **Configure:**

   ```bash
   # Edit backend/.env with your production values
   # Generate JWT: openssl rand -base64 64
   ```

2. **Upload:**

   ```bash
   rsync -avz backend/ USER@ssh.nearlyfreespeech.net:/home/public/api/
   rsync -avz frontend/build/ USER@ssh.nearlyfreespeech.net:/home/public/
   scp .htaccess USER@ssh.nearlyfreespeech.net:/home/public/
   ```

3. **Setup:**
   ```bash
   ssh USER@ssh.nearlyfreespeech.net
   # Run database migrations
   # Create directories
   # Set permissions
   # Change default passwords
   ```

## 📞 Need Help?

- **Detailed Guide:** See `DEPLOYMENT_CHECKLIST.md` for complete instructions
- **Full Documentation:** See `DEPLOYMENT.md` for troubleshooting
- **NFSN Support:** https://members.nearlyfreespeech.net/support/

## 💰 Estimated Cost

Monthly cost for 100 users: ~$8-10

- Storage (5GB): ~$2.50/month
- Database: ~$0.45/month
- Bandwidth (10GB): ~$5.00/month

---

**Next Step:** Edit `backend/.env` with your production credentials, then run the upload commands above! 🎉
