# Assessment Management System

A comprehensive web application for timed, proctored technical assessments with cohort management and facilitator-controlled access windows.

## Features

- **Role-Based Access**: Intern, Facilitator, and Admin roles
- **Cohort Management**: Organize interns by cycles (e.g., Cycle 59)
- **Facilitator Access Control**: Set visibility, scheduling, and lock assessments per cohort
- **Timed Assessments**: Auto-submit with countdown timers
- **Proctoring**: Randomized webcam snapshots with consent (future feature add AI to help proctor)
- **Rubric Scoring**: 1-5 point scoring with facilitator comments
- **Access Overrides**: Per-user makeup exam scheduling
- **Reports & Exports**: Cohort-filtered dashboards and CSV/PDF exports

## Tech Stack

### Frontend

- React 18 with Hooks
- React Router for navigation
- TailwindCSS for styling
- Axios for API calls
- Context API for state management

### Backend

- PHP 8+ with PDO (MySQL)
- JWT authentication
- RESTful API
- File upload handling
- CORS support

### Database

- MySQL 8+
- Comprehensive schema with 11 tables
- Foreign key constraints
- Audit logging

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

## Setup Instructions

### Prerequisites

- Node.js 18+
- PHP 8+
- MySQL 8+
- Composer (for PHP dependencies)

### Database Setup

1. Create the database:

```sql
CREATE DATABASE assessment_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Run migrations:

```bash
cd backend
php migrations/run_migrations.php
```

3. Seed initial data:

```bash
php migrations/seed_data.php
```

### Backend Setup

1. Install PHP dependencies:

```bash
cd backend
composer install
```

2. Configure environment:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Start PHP development server:

```bash
php -S localhost:8000 -t public
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure API endpoint:

```bash
cp .env.example .env
# Edit REACT_APP_API_URL
```

3. Start development server:

```bash
npm start
```

## Deployment to NearlyFreeSpeech.net

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Default Credentials

**Admin Account**:

- Email: admin@icstars.org
- Password: Admin@2026!

**Facilitator Account**:

- Email: facilitator@icstars.org
- Password: Facilitator@2026!

**Test Intern** (Cycle 59):

- Email: intern@icstars.org
- Password: Intern@2026!

⚠️ **Change these passwords immediately in production!**

## Key Concepts

### Cohort Management

- Cohorts represent program cycles (e.g., Cycle 59)
- Interns are enrolled in cohorts via `cohort_memberships`
- Historical memberships are preserved

### Access Control

- **Visibility**: Controls whether interns see an assessment
- **Scheduling**: Open/close datetime windows for access
- **Locking**: Emergency lock/unlock by facilitators
- **Overrides**: Per-user exceptions for makeup exams

### Assessment Flow

1. Facilitator sets visibility + schedule for cohort
2. Intern sees available assessments
3. Intern starts assessment (within window)
4. Timer counts down; auto-submits on expiration
5. Proctoring snapshots captured randomly
6. Facilitator scores with rubric (1-5 per task)
7. Proficiency calculated; dashboards updated

## API Documentation

See [API.md](./API.md) for complete endpoint documentation.

## License

Proprietary - i.c.stars Internal Use Only
