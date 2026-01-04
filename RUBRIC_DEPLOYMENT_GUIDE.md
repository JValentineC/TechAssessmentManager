# Rubric Management System - Deployment Guide

## Overview

A complete rubric management system has been added to allow administrators to create detailed scoring criteria for assessments and individual tasks. This feature provides facilitators with clear guidelines when scoring submissions.

## Features Implemented

### 1. **Database Schema**

- New `rubrics` table with support for 5-level criteria (Limited, Emerging, Developing, Proficient, Advanced)
- Supports both assessment-level rubrics (apply to all tasks) and task-specific rubrics
- Includes audit trail with creator tracking

### 2. **Backend API**

- Full CRUD operations for rubrics
- Endpoints:
  - `GET /rubrics?assessment_id=X` - Get all rubrics for an assessment
  - `GET /rubrics?task_id=X` - Get rubric for a specific task (with fallback to assessment-level)
  - `GET /rubrics/:id` - Get a specific rubric
  - `POST /rubrics` - Create new rubric (Admin only)
  - `PATCH /rubrics/:id` - Update rubric (Admin only)
  - `DELETE /rubrics/:id` - Delete rubric (Admin only)

### 3. **Frontend Components**

- **RubricModal**: Comprehensive form for creating/editing rubrics with color-coded level sections
- **Assessment Management Integration**: Rubric management UI embedded in the assessment management page
- **Scoring Page Enhancement**: Displays rubrics during scoring to guide facilitators

## Deployment Steps

### Step 1: Run Database Migration

```bash
# Connect to your MySQL database
mysql -u your_username -p assessment_system

# Run the migration
source backend/migrations/008_add_rubrics_table.sql
```

Or via phpMyAdmin/MySQL Workbench:

- Open `backend/migrations/008_add_rubrics_table.sql`
- Execute the SQL statements

### Step 2: Deploy Backend

```powershell
# Deploy backend with new controller
.\deploy.ps1 backend
```

The deployment script will upload:

- `backend/controllers/RubricController.php` (new)
- `backend/public/index.php` (updated with rubric routes)

### Step 3: Deploy Frontend

```powershell
# Build and deploy frontend
.\deploy.ps1 frontend
```

This will include:

- `frontend/src/components/RubricModal.js` (new)
- Updated AssessmentManagementPage
- Updated ScoringPage
- Updated services with rubricService

### Step 4: Verify Deployment

1. Log in as Admin
2. Navigate to Assessment Management
3. Select an assessment
4. You should see a "📋 Scoring Rubrics" section below the tasks
5. Click "+ Add Assessment Rubric" to test rubric creation

## How to Use

### Creating an Assessment-Wide Rubric

1. **Login as Admin**
2. Go to **Assessment Management**
3. Select an assessment (e.g., Assessment A)
4. Scroll to the **Scoring Rubrics** section
5. Click **+ Add Assessment Rubric**
6. Fill in:
   - Title (e.g., "Shared Doc Collaboration")
   - Description (optional context)
   - Criteria for each level (1-5)
7. Click **Create Rubric**

### Creating a Task-Specific Rubric

1. In the **Scoring Rubrics** section
2. Find the task you want to add a rubric for
3. Click **+ Add Rubric** next to that task
4. Fill in the rubric form
5. Click **Create Rubric**

### Scoring with Rubrics

1. Navigate to **Submissions**
2. Click **Score** on any submission
3. The rubric will display above the submission
4. Use the rubric criteria to select the appropriate score (1-5 stars)
5. Add comments and save

## Example Rubric (from Assessment A)

**Title**: Shared Doc Collaboration (DC.SK1, DC.SK2)

**Level 1 - Limited**: Cannot access or edit doc.

**Level 2 - Emerging**: Opens doc but no edits/comments.

**Level 3 - Developing**: Edits doc OR adds 1 basic comment.

**Level 4 - Proficient**: Edits doc + 2+ meaningful comments; sets correct permissions; file in correctly named folder.

**Level 5 - Advanced**: Adds folder README (Purpose, Owner, How to Contribute); comments show insight; models best practice by coaching peers.

## Rubric Hierarchy

The system follows this priority:

1. **Task-specific rubric** (highest priority)
2. **Assessment-wide rubric** (fallback)
3. **Generic rubric** (system default if no custom rubric exists)

## Database Structure

```sql
rubrics
├── id (Primary Key)
├── assessment_id (FK to assessments)
├── task_id (FK to tasks)
├── title
├── description
├── level_1_criteria (Limited)
├── level_2_criteria (Emerging)
├── level_3_criteria (Developing)
├── level_4_criteria (Proficient)
├── level_5_criteria (Advanced)
├── created_at
├── updated_at
└── created_by (FK to users)
```

**Constraint**: Either `assessment_id` OR `task_id` must be set (not both, not neither)

## API Examples

### Create Assessment-Wide Rubric

```javascript
POST /rubrics
{
  "assessment_id": 1,
  "title": "Environment Setup Verification",
  "description": "Evaluates technical environment setup skills",
  "level_1_criteria": "Cannot open IDE or terminal.",
  "level_2_criteria": "IDE installed but cannot demonstrate Git.",
  "level_3_criteria": "Runs git init or commit but repo incomplete.",
  "level_4_criteria": "IDE open, repo connected to GitHub; ≥2 commits with meaningful messages; push verified.",
  "level_5_criteria": "Adds enhancements (README, .gitignore); commits follow scaffold → feature → refactor pattern."
}
```

### Create Task-Specific Rubric

```javascript
POST /rubrics
{
  "task_id": 5,
  "title": "Security Checklist",
  "level_1_criteria": "Leaves blank/incomplete answers.",
  "level_2_criteria": "Provides generic responses (e.g., 'use strong password').",
  "level_3_criteria": "Identifies 1–2 correct practices but limited detail.",
  "level_4_criteria": "Lists 3+ practices (MFA, password manager, updates) + 1 personal risk/mitigation.",
  "level_5_criteria": "Applies advanced practices (VPN, secure repos, .env for secrets); articulates rationale for each."
}
```

### Get Rubric for Scoring

```javascript
GET /rubrics?task_id=5
// Returns task-specific rubric or falls back to assessment-level rubric
```

## Security Features

- **Admin-only creation**: Only admins can create, edit, or delete rubrics
- **Audit logging**: All rubric operations are logged with user ID and timestamp
- **Input validation**: All criteria fields are required, title has max length
- **Constraint enforcement**: Database ensures rubric is tied to either assessment OR task (not both)

## Backward Compatibility

✅ The system is **fully backward compatible**:

- Existing assessments work without rubrics
- Generic rubric is shown if no custom rubric exists
- Scoring still works with 1-5 scale even without defined rubrics
- No changes required to existing data

## Benefits

1. **Consistency**: All facilitators use the same criteria when scoring
2. **Transparency**: Interns know what's expected for each level
3. **Fairness**: Reduces subjectivity in scoring
4. **Efficiency**: Facilitators spend less time deciding on scores
5. **Feedback**: Clear criteria help interns understand their performance

## Troubleshooting

### Rubric not appearing during scoring

- Check if rubric exists for the task or assessment
- Verify database migration ran successfully
- Check browser console for API errors

### Cannot create rubric

- Ensure you're logged in as Admin (not Facilitator)
- Check if rubric already exists (only one per task/assessment)
- Verify all 5 levels are filled out

### Rubric not updating

- Hard refresh the page (Ctrl+F5)
- Check if you have unsaved changes in forms
- Verify the update API call succeeded in Network tab

## Future Enhancements (Optional)

- Import rubrics from templates
- Copy rubrics between assessments
- Rubric versioning and history
- Weighted scoring (different weights per level)
- Custom number of levels (e.g., 3-level or 7-level rubrics)
- Export rubrics to PDF for distribution

## Support

For questions or issues:

1. Check backend logs for API errors
2. Check browser console for frontend errors
3. Verify database migration completed
4. Review this guide for proper usage

---

**Status**: ✅ Fully Implemented and Ready for Production
**Version**: 1.0
**Date**: January 4, 2026
