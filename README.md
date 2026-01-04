# i.c.stars Assessment Management System

A production-ready web application for managing timed, proctored technical assessments with comprehensive cohort management and facilitator-controlled access windows.

## 🎯 Overview

This system provides a complete solution for administering technical assessments to i.c.stars program cohorts. It includes robust access control, real-time proctoring, automated timing with fail-safe submission, and comprehensive scoring and reporting capabilities.

**Current Status:** ✅ Deployed and operational at `assessmentmanager.nfshost.com`

## ⭐ Core Features

- **Role-Based Access Control**: Admin, Facilitator, and Intern roles with appropriate permissions
- **Multi-Cohort Management**: Organize and manage interns across different program cycles
- **Facilitator Access Control**: Granular control over assessment visibility, scheduling, and locking per cohort
- **Timed Assessments**: Countdown timers with automatic submission on expiration
- **Proctoring System**: Randomized webcam snapshots with explicit consent flow
- **Rubric-Based Scoring**: 1-5 point scoring system with facilitator comments and proficiency tracking
- **Access Overrides**: Individual user exceptions for makeup exams with custom time windows
- **Comprehensive Reporting**: Cohort-filtered dashboards with analytics and export capabilities
- **File Upload Support**: Secure file submission for code, SQL, and documentation tasks
- **Audit Logging**: Complete tracking of all system activities

##

## Project Structure

```
assessment-system/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth, etc.)
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utilities
│   │   └── App.js
│   ├── public/
│   └── package.json
│
└── backend/               # PHP API
    ├── config/           # Database & environment config
    ├── controllers/      # Route handlers
    ├── middleware/       # Auth & validation
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── uploads/          # File storage
    ├── migrations/       # SQL migrations
    └── index.php         # Entry point
```

## 🚀 Quick Start

### Local Development Setup

#### Prerequisites

- Node.js 18+
- PHP 8+
- MySQL 8+
- Composer

#### Database Setup

1. Create the database:

```sql
CREATE DATABASE assessment_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import schema and seed data:

```bash
mysql -u root -p assessment_system < backend/migrations/001_create_tables.sql
mysql -u root -p assessment_system < backend/migrations/002_seed_data.sql
mysql -u root -p assessment_system < backend/migrations/003_update_assessment_instructions.sql
mysql -u root -p assessment_system < backend/migrations/004_add_task_submission_types.sql
mysql -u root -p assessment_system < backend/migrations/005_add_task_types.sql
mysql -u root -p assessment_system < backend/migrations/006_add_composite_task_example.sql
mysql -u root -p assessment_system < backend/migrations/007_add_composite_task_type.sql
```

#### Backend Setup

1. Install dependencies:

```bash
cd backend
composer install
```

2. Configure environment:

```bash
# Create .env file with your database credentials
DB_HOST=localhost
DB_NAME=assessment_system
DB_USER=your_username
DB_PASS=your_password
JWT_SECRET=your_secure_random_string_here
```

3. Start development server:

```bash
php -S localhost:8000 -t public
```

Backend API will be available at `http://localhost:8000`

#### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure API endpoint (create `.env` file):

```bash
REACT_APP_API_URL=http://localhost:8000
```

3. Start development server:

```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 📦 Deployment

### Production Deployment (NearlyFreeSpeech.net)

The system is currently deployed using the included `deploy.ps1` script:

```powershell
# Deploy both frontend and backend
.\deploy.ps1 all

# Deploy only frontend
.\deploy.ps1 frontend

# Deploy only backend
.\deploy.ps1 backend
```

The script handles:

- Building the React frontend
- Uploading files via SSH/SCP
- Setting correct permissions
- Configuring the server structure

**Live URL:** `https://assessmentmanager.nfshost.com`

## 🔐 Default Accounts

The system comes with three pre-configured accounts for testing:

| Role        | Email                   | Password          | Cohort   |
| ----------- | ----------------------- | ----------------- | -------- |
| Admin       | admin@icstars.org       | Admin@2026!       | -        |
| Facilitator | facilitator@icstars.org | Facilitator@2026! | Cycle 59 |
| Intern      | intern@icstars.org      | Intern@2026!      | Cycle 59 |

⚠️ **SECURITY WARNING:** Change all default passwords immediately after deployment!

## Key Concepts

### Cohort Management

- Cohorts represent program cycles (e.g., Cycle 59)
- Interns are enrolled in cohorts via `cohort_memberships`
- Historical memberships are preserved
  📖 How It Works

### Cohort Management

- **Cohorts** represent program cycles (e.g., Cycle 59, Cycle 60)
- Interns are enrolled via `cohort_memberships` with start/end dates
- Historical enrollment records are preserved for reporting
- CSV import functionality for bulk enrollment

### Access Control Hierarchy

The system uses a multi-layered access control approach:

1. **Cohort Membership**: User must be enrolled in the cohort
2. **Visibility**: Assessment must be set to visible for the cohort
3. **Scheduling**: Current time must be within the open/close window
4. **Lock Status**: Assessment must not be emergency-locked
5. **Overrides**: User-specific allow/deny rules (highest priority)

### Assessment Workflow

**Facilitator Setup:**

1. Configure assessment visibility for cohort
2. Set open/close datetime window
3. Optional: Create user overrides for makeup exams

**Intern Experience:**

1. View available assessments on dashboard
2. Start assessment (creates submission record)
3. Work through tasks with countdown timer
4. Upload files for each task
5. Auto-submit on timer expiration (fail-safe)
6. Complete reflection questions

**Scoring & Reporting:**

1. Facilitator reviews submissions
2. Scores each task with 1-5 rubric
3. Adds comments and feedback
4. System calculates proficiency (target ≥80%)
5. Reports aggregate cohort metrics

### Proctoring System

- Requests webcam permission on assessment start
- Captures random snapshots at 5-15 minute intervals
- Stores images with metadata (user, assessment, timestamp)
- Provides review interface for facilitators

## 🏗️ Technology Stack

- **Frontend**: React 18, TailwindCSS, React Router, Axios
- **Backend**: PHP 8, PDO (MySQL), JWT Authentication
- **Database**: MySQL 8 with full relational schema
- **Deployment**: NearlyFreeSpeech.net hosting
- **Version Control**: Git

## 📊 Database Schema

11 tables with comprehensive relationships:

- `users` - User accounts with roles
- `cohorts` - Program cycles
- `cohort_memberships` - Enrollment tracking
- `assessments` - Assessment definitions (A, B, C, D)
- `assessment_windows` - Per-cohort access control
- `access_overrides` - Individual user exceptions
- `tasks` - Assessment tasks with instructions
- `submissions` - User work submissions
- `scores` - Rubric scores with comments
- `snapshots` - Proctoring images
- `audit_logs` - Activity tracking

## 🛠️ Maintenance

### Adding a New Cohort

1. Log in as Admin
2. Navigate to Cohort Management
3. Create new cohort with start/end dates
4. Import roster via CSV or add users manually

### Configuring Assessment Windows

1. Log in as Facilitator
2. Go to Access Control page
3. Select cohort and assessment
4. Set visibility, open/close times, and lock status

### Reviewing Submissions

1. Navigate to Submissions page
2. Filter by cohort/assessment/user
3. Click "Score" to access scoring interface
4. View proctoring snapshots if needed

## 📞 Support & Documentation

- **PROJECT_SUMMARY.md**: Comprehensive feature documentation
- **Database Migrations**: See `backend/migrations/` for schema
- **API Endpoints**: Documented in controller files
- **Frontend Components**: See `frontend/src/components/`

## 📄 License

Proprietary - i.c.stars Internal Use Only

---

**Built for i.c.stars Program** | **Status: Production** | **Version: 1.0**
