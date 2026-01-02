# Quick Start Guide

Get the i.c.stars Assessment System running locally in under 10 minutes.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PHP** 8.0+ ([Download](https://www.php.net/downloads))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/))
- **Composer** ([Download](https://getcomposer.org/))

## Step 1: Clone or Extract Project

```bash
cd "c:\Users\JonathanRamirez\OneDrive - i.c.stars\Desktop\Alpha Centauri\Applications\New folder"
```

## Step 2: Database Setup

### Create Database

```sql
-- Open MySQL command line or workbench
CREATE DATABASE assessment_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Run Migrations

```bash
# From project root
mysql -u root -p assessment_system < backend/migrations/001_create_tables.sql
mysql -u root -p assessment_system < backend/migrations/002_seed_data.sql
```

## Step 3: Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Update these lines:
#   DB_HOST=localhost
#   DB_NAME=assessment_system
#   DB_USER=root
#   DB_PASS=your_password
```

### Start PHP Server

```bash
# From backend directory
php -S localhost:8000 -t public
```

Backend should now be running at `http://localhost:8000`

Test it:

```bash
curl http://localhost:8000/api/assessments
```

## Step 4: Frontend Setup

Open a **new terminal** (keep backend running):

```bash
cd frontend

# Install dependencies (this may take a few minutes)
npm install

# Copy environment file
cp .env.example .env
```

### Start React App

```bash
npm start
```

Frontend should open automatically at `http://localhost:3000`

## Step 5: Log In

The seed data creates three test accounts:

### Admin Account

- **Email:** admin@icstars.org
- **Password:** Admin@2026!

### Facilitator Account

- **Email:** facilitator@icstars.org
- **Password:** Facilitator@2026!

### Intern Account

- **Email:** intern@icstars.org
- **Password:** Intern@2026!

## Step 6: Verify Setup

### As Admin/Facilitator:

1. Log in with admin credentials
2. Go to **Access Control**
3. Toggle visibility ON for Assessment A
4. Set opens_at to current time (or past)
5. Set closes_at to 1 hour from now

### As Intern:

1. Log out
2. Log in with intern credentials
3. Go to **My Assessments**
4. You should see Assessment A available
5. Click **Start Assessment**
6. Accept proctoring consent
7. Try uploading a file

## Troubleshooting

### "Database connection failed"

- Verify MySQL is running
- Check credentials in `backend/.env`
- Ensure database `assessment_system` exists

### "Cannot connect to backend"

- Ensure PHP server is running on port 8000
- Check `frontend/.env` has correct API_URL

### "CORS errors"

- Restart both servers
- Clear browser cache
- Verify CORS headers in `backend/public/index.php`

### "npm install fails"

- Delete `node_modules` and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install` again

### Port already in use

```bash
# Change PHP port
php -S localhost:8001 -t public

# Update frontend/.env
REACT_APP_API_URL=http://localhost:8001/api

# Change React port
# On Windows:
set PORT=3001 && npm start
```

## What's Next?

### Configure Cycle 59 Assessments

1. Log in as facilitator
2. Go to **Access Control**
3. For each assessment (A, B, C, D):
   - Set visibility to ON
   - Set appropriate open/close dates
   - Add facilitator notes

### Import Interns

1. Go to **Cohorts**
2. Select Cycle 59
3. Click **Import CSV**
4. Upload CSV with columns: name, email, password

### Test Complete Flow

1. Start assessment as intern
2. Upload files for each task
3. Complete reflection
4. Score as facilitator
5. View dashboard metrics

## Default File Locations

- **Uploads:** `backend/uploads/`
- **Snapshots:** `backend/snapshots/`
- **Logs:** Check PHP error log

## Key Features to Test

- ✅ JWT Authentication
- ✅ Role-based access (intern/facilitator/admin)
- ✅ Cohort management
- ✅ Assessment visibility controls
- ✅ Assessment scheduling (opens_at/closes_at)
- ✅ Emergency lock/unlock
- ✅ Timer with auto-submit
- ✅ File uploads
- ✅ Webcam proctoring
- ✅ Reflection questions
- ✅ Rubric scoring (1-5)

## Development Tips

### Hot Reload

- Frontend: Auto-reloads on file save
- Backend: Restart PHP server after changes

### Clear Cache

```bash
# Clear React build cache
cd frontend
npm run build

# Clear browser cache
Ctrl+Shift+Del (Chrome/Edge)
```

### Database Reset

```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE assessment_system; CREATE DATABASE assessment_system;"

# Re-run migrations
mysql -u root -p assessment_system < backend/migrations/001_create_tables.sql
mysql -u root -p assessment_system < backend/migrations/002_seed_data.sql
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full production deployment guide to NearlyFreeSpeech.net.

## Support

- **Documentation:** See README.md, API.md, DEPLOYMENT.md
- **Issues:** Check error logs in browser console and PHP error log
- **Contact:** support@icstars.org

## Security Reminders

⚠️ **For Development Only:**

- Default passwords are weak - change immediately in production
- JWT_SECRET in `.env` should be a long random string
- Never commit `.env` files to git
- Use HTTPS in production
- Enable security headers

Happy coding! 🚀
