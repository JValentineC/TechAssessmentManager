# Quick Deployment Update Guide

## 🚀 Easy Deployment Commands

Your site is already deployed at: **https://assessmentmanager.nfshost.com**

### Deploy Everything (with build)

```bash
cd frontend
npm run deploy
```

This will:

1. Build the frontend with latest changes
2. Upload backend to server
3. Upload frontend to server
4. Upload .htaccess configuration

### Quick Deploy (skip rebuild)

```bash
cd frontend
npm run deploy:quick
```

Use this when you only changed backend code and frontend is already built.

### Deploy Backend Only

```bash
cd frontend
npm run deploy:backend
```

Perfect for PHP changes, no frontend build needed.

### Deploy Frontend Only

```bash
cd frontend
npm run deploy:frontend
```

Only uploads the React build to the server.

## 📋 What Gets Deployed

### Backend Updates Include:

- ✅ All PHP controllers (User, Cohort, Submission, Score, etc.)
- ✅ Middleware (Auth, RBAC)
- ✅ Configuration files
- ✅ .env settings
- ✅ Composer dependencies

### Frontend Updates Include:

- ✅ All React pages (Dashboard, Users, Cohorts, Submissions, Scoring)
- ✅ Components (Navbar, Modals, etc.)
- ✅ Services (API, Auth)
- ✅ Optimized production bundle

## 🔧 Manual Deployment (if needed)

### Using PowerShell directly:

**Deploy Backend:**

```powershell
rsync -avz --exclude='node_modules' --exclude='.git' backend/ assessmentmanager@ssh.nearlyfreespeech.net:/home/public/api/
```

**Deploy Frontend:**

```powershell
cd frontend
npm run build
rsync -avz build/ assessmentmanager@ssh.nearlyfreespeech.net:/home/public/
```

**Deploy .htaccess:**

```powershell
scp .htaccess assessmentmanager@ssh.nearlyfreespeech.net:/home/public/
```

## 🧪 Testing After Deployment

### 1. Test API

```bash
curl https://assessmentmanager.nfshost.com/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"admin@icstars.org","password":"YOUR_PASSWORD"}'
```

### 2. Test Frontend

Visit: https://assessmentmanager.nfshost.com

### 3. Check Logs

```bash
ssh assessmentmanager@ssh.nearlyfreespeech.net
tail -f /home/logs/error_log
```

## 🐛 Troubleshooting

### "rsync: command not found"

Install rsync on Windows:

```powershell
# Using Chocolatey
choco install rsync

# Or using winget
winget install cwRsync
```

### "Permission denied"

Ensure SSH key is configured:

```bash
ssh assessmentmanager@ssh.nearlyfreespeech.net
```

If this works, rsync should work too.

### "Build failed"

Check for ESLint errors:

```bash
cd frontend
npm run build
```

Fix any errors shown.

### "Cannot connect to server"

Verify NFSN status and your internet connection.

## 📦 What's Currently Deployed

**Live URL:** https://assessmentmanager.nfshost.com

**Features Deployed:**

- ✅ P0.1: Admin User Management
- ✅ P0.2: Cohort Management with Roster
- ✅ P0.3: Global Submissions Index
- ✅ P0.4: Dashboard Status Fixes
- ✅ P0.5: Intern Dashboard Completion
- ✅ P0.6: Scoring Page with Rubrics
- ✅ P0.7: Auto-Submit Finalization

**Database:**

- Host: assessment.db
- Name: AssessmentManager
- 11 tables with full schema

**Server Directories:**

- Backend: `/home/public/api/`
- Frontend: `/home/public/`
- Uploads: `/home/private/uploads/`
- Snapshots: `/home/private/snapshots/`

## 🔄 Typical Update Workflow

1. **Make your code changes** (edit controllers, pages, components, etc.)

2. **Test locally:**

   ```bash
   # Backend (if changed)
   cd backend
   php -S localhost:8000 -t public

   # Frontend
   cd frontend
   npm start
   ```

3. **Commit changes:**

   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

4. **Deploy to production:**

   ```bash
   cd frontend
   npm run deploy
   ```

5. **Verify deployment:**
   - Visit https://assessmentmanager.nfshost.com
   - Test the features you changed
   - Check for any errors

## 💡 Pro Tips

- **Quick iterations:** Use `npm run deploy:quick` when only backend changed
- **Frontend only:** Use `npm run deploy:frontend` for UI tweaks
- **Watch logs live:** Keep SSH terminal open with `tail -f /home/logs/error_log`
- **Test before deploy:** Always test locally first
- **Backup database:** Before major changes, backup your database

## 📞 Need Help?

- **Server Issues:** Check NFSN control panel at https://members.nearlyfreespeech.net
- **Deployment Logs:** SSH to server and check `/home/logs/`
- **Git Issues:** Ensure changes are committed and pushed

---

**Last Updated:** January 2, 2026  
**Current Version:** 1.0.0 (P0.1-P0.7 Complete)
