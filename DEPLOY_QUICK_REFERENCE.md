# Quick Deployment Guide

## Your NFSN Configuration

- **Site:** assessmentmanager.nfshost.com
- **SSH Host:** ssh.nyc1.nearlyfreespeech.net
- **Username:** jvc_assessmentmanager
- **Password:** (your member password)

## Quick Commands

### Full Deployment (Build + Upload Everything)

```bash
npm run deploy
```

### Quick Update (Skip Build - Backend Only)

```bash
npm run deploy:quick
```

### Backend Only

```bash
npm run deploy:backend
```

### Frontend Only (Must build first)

```bash
npm run build
npm run deploy:frontend
```

## What Each Command Does

### `npm run deploy`

1. Builds frontend (React production build)
2. Uploads backend to `/home/public/api/`
3. Uploads frontend build to `/home/public/`
4. Uploads `.htaccess` for routing

**Use this when:** You've made changes to frontend OR backend

### `npm run deploy:quick`

1. Uploads backend (no build)
2. Uploads existing frontend build
3. Uploads `.htaccess`

**Use this when:** You only changed backend PHP files and want to skip the build step

### `npm run deploy:backend`

Uploads only backend files to `/home/public/api/`

**Use this when:** You only changed controllers, configs, or backend code

### `npm run deploy:frontend`

Uploads only frontend build files to `/home/public/`

**Use this when:** You already built frontend and only need to upload it

## Manual Commands (if npm scripts fail)

### Using SCP (Simpler, built into Windows)

**Upload Backend:**

```bash
scp -r backend/* jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net:/home/public/api/
```

**Upload Frontend:**

```bash
cd frontend
scp -r build/* jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net:/home/public/
```

**Upload .htaccess:**

```bash
scp .htaccess jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net:/home/public/
```

### Using PowerShell Script

```powershell
.\deploy.ps1
```

Or skip the build:

```powershell
.\deploy.ps1 -skipBuild
```

## Typical Workflow

### 1. Making Changes

```bash
# Make your code changes
# Test locally with npm start (frontend) and php -S localhost:8000 (backend)
```

### 2. Commit to Git

```bash
git add .
git commit -m "Description of changes"
git push
```

### 3. Deploy to NFSN

```bash
cd frontend
npm run deploy
```

### 4. Verify

Visit: https://assessmentmanager.nfshost.com

## Troubleshooting

### "Permission denied" errors

- Make sure you're using your NFSN member password
- Check that SSH access is enabled in NFSN control panel

### "Command not found" errors

- Make sure you're in the `frontend/` directory when running npm commands
- Or run from root: `cd frontend && npm run deploy`

### "Build failed" errors

- Check the error message
- Usually ESLint warnings - add `// eslint-disable-next-line` before the problematic line
- Or fix the underlying issue

### "Connection refused" or "Host not found"

- Check your internet connection
- Verify NFSN server status at status.nearlyfreespeech.net
- Confirm hostname: `ssh.nyc1.nearlyfreespeech.net` (not just ssh.nearlyfreespeech.net)

### Site not updating after deployment

- Clear browser cache (Ctrl+Shift+R)
- Check NFSN error logs via SSH:
  ```bash
  ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net
  tail -f /home/logs/error_log
  ```

## Checking What's Deployed

### View Files on Server

```bash
ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net
ls -la /home/public/
ls -la /home/public/api/
```

### View Error Logs

```bash
ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net
tail -n 50 /home/logs/error_log
```

### Test API

```bash
curl https://assessmentmanager.nfshost.com/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"admin@icstars.org","password":"YOUR_PASSWORD"}'
```

## Current Deployment Status

**Last Deploy:** [Manual update required]
**Version:** 1.0.0
**Features:** P0.1 - P0.7 (All critical features)

## Quick Reference

| Command                   | Speed            | Use When                       |
| ------------------------- | ---------------- | ------------------------------ |
| `npm run deploy`          | Slow (~2 min)    | Changed frontend or backend    |
| `npm run deploy:quick`    | Fast (~30 sec)   | Changed backend only           |
| `npm run deploy:backend`  | Fast (~20 sec)   | Changed backend only           |
| `npm run deploy:frontend` | Medium (~40 sec) | Already built, upload frontend |

---

**Pro Tip:** Keep this file open in a tab for quick reference! 🚀
