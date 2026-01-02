# API Documentation

Base URL: `http://localhost:8000/api` (development) or `https://your-domain.com/api` (production)

All endpoints except `/auth/login` require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Authentication

### POST /auth/login

Login and receive JWT token.

**Request:**

```json
{
  "email": "admin@icstars.org",
  "password": "Admin@2026!"
}
```

**Response:**

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "user": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@icstars.org",
    "role": "admin",
    "current_cohort_id": 1
  }
}
```

### POST /auth/logout

Logout (clears token client-side).

### GET /auth/me

Get current authenticated user info.

---

## Cohorts

### GET /cohorts

Get all cohorts.

**Response:**

```json
[
  {
    "id": 1,
    "cycle_number": 59,
    "name": "Cycle 59",
    "start_date": "2026-01-06",
    "end_date": "2026-06-30",
    "status": "active",
    "created_at": "2026-01-01 00:00:00"
  }
]
```

### GET /cohorts/:id

Get single cohort by ID.

### POST /cohorts

Create new cohort. **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "cycle_number": 60,
  "name": "Cycle 60",
  "start_date": "2026-07-01",
  "end_date": "2026-12-31",
  "status": "upcoming"
}
```

### PATCH /cohorts/:id

Update cohort. **Requires:** `facilitator` or `admin` role.

### GET /cohorts/:id/roster

Get all interns enrolled in cohort. **Requires:** `facilitator` or `admin` role.

**Response:**

```json
[
  {
    "id": 3,
    "name": "John Doe",
    "email": "john@icstars.org",
    "role": "intern",
    "status": "active",
    "joined_at": "2026-01-06 00:00:00",
    "left_at": null
  }
]
```

### POST /cohorts/:id/import

Import interns via CSV. **Requires:** `facilitator` or `admin` role.

**Request:** `multipart/form-data`

- `file`: CSV file with columns: name, email, password (optional)

**CSV Format:**

```csv
name,email,password
Jane Smith,jane@icstars.org,TempPassword123
John Doe,john@icstars.org,TempPassword123
```

---

## Users

### GET /users

Get all users. **Requires:** `facilitator` or `admin` role.

### POST /users

Create new user. **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "name": "New Intern",
  "email": "newintern@icstars.org",
  "password": "Password123!",
  "role": "intern",
  "current_cohort_id": 1,
  "status": "active"
}
```

### PATCH /users/:id

Update user. **Requires:** `facilitator` or `admin` role.

---

## Assessments

### GET /assessments

Get all assessments (A, B, C, D).

**Response:**

```json
[
  {
    "id": 1,
    "code": "A",
    "title": "Assessment A - Fundamentals",
    "description": "Evaluation of fundamental programming concepts...",
    "duration_minutes": 60,
    "created_at": "2026-01-01 00:00:00"
  }
]
```

### GET /assessments/available?cohort_id=1

Get assessments available to current intern based on visibility and access windows.

**Response:**

```json
[
  {
    "id": 1,
    "code": "A",
    "title": "Assessment A - Fundamentals",
    "description": "...",
    "duration_minutes": 60,
    "window": {
      "id": 1,
      "visible": true,
      "opens_at": "2026-02-10 09:00:00",
      "closes_at": "2026-02-10 12:00:00",
      "locked": false,
      "notes": "Assessment A will be available during Week 6"
    }
  }
]
```

---

## Tasks

### GET /tasks?assessment_id=1

Get all tasks for an assessment.

**Response:**

```json
[
  {
    "id": 1,
    "assessment_id": 1,
    "title": "SQL Query Challenge",
    "instructions": "Write SQL queries to solve...",
    "template_url": null,
    "max_points": 5,
    "order_index": 1
  }
]
```

### POST /tasks

Create new task. **Requires:** `facilitator` or `admin` role.

---

## Assessment Windows

### GET /assessment_windows?cohort_id=1

Get all assessment windows for a cohort. **Requires:** `facilitator` or `admin` role.

**Response:**

```json
[
  {
    "id": 1,
    "assessment_id": 1,
    "cohort_id": 1,
    "visible": 0,
    "opens_at": "2026-02-10 09:00:00",
    "closes_at": "2026-02-10 12:00:00",
    "locked": 0,
    "notes": "Assessment A will be available during Week 6",
    "code": "A",
    "title": "Assessment A - Fundamentals",
    "duration_minutes": 60
  }
]
```

### POST /assessment_windows

Create assessment window. **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "assessment_id": 1,
  "cohort_id": 1,
  "visible": 1,
  "opens_at": "2026-02-10 09:00:00",
  "closes_at": "2026-02-10 12:00:00",
  "locked": 0,
  "notes": "Opens Week 6"
}
```

### PATCH /assessment_windows/:id/visibility

Toggle visibility. **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "visible": 1
}
```

### PATCH /assessment_windows/:id/schedule

Update schedule. **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "opens_at": "2026-02-10 09:00:00",
  "closes_at": "2026-02-10 12:00:00"
}
```

### PATCH /assessment_windows/:id/lock

Lock/unlock assessment. **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "locked": 1
}
```

---

## Access Overrides

### GET /access_overrides?cohort_id=1&assessment_id=1

Get access overrides (per-user exceptions). **Requires:** `facilitator` or `admin` role.

### POST /access_overrides

Create access override (makeup exam). **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "user_id": 3,
  "assessment_id": 1,
  "cohort_id": 1,
  "override_type": "allow",
  "starts_at": "2026-02-11 09:00:00",
  "ends_at": "2026-02-11 12:00:00",
  "reason": "Makeup exam - excused absence"
}
```

### DELETE /access_overrides/:id

Remove override. **Requires:** `facilitator` or `admin` role.

---

## Submissions

### POST /submissions/start

Start an assessment. **Requires:** `intern` role.

Checks:

- Cohort membership
- Window visibility
- Window schedule (opens_at/closes_at)
- Window lock status
- Access overrides

**Request:**

```json
{
  "assessment_id": 1,
  "cohort_id": 1
}
```

**Response:**

```json
{
  "message": "Assessment started",
  "submission_ids": [1, 2, 3, 4],
  "started_at": "2026-02-10 09:15:00"
}
```

**Error Response (403):**

```json
{
  "error": "Assessment window has closed"
}
```

### GET /submissions?cohort_id=1&assessment_id=1

Get submissions. Interns see only their own; facilitators see all.

### PATCH /submissions/:id

Update submission (upload file or update status).

**For file upload:** `multipart/form-data`

- `file`: File to upload
- `task_id`: Task ID

**For reflection/status:** JSON

```json
{
  "status": "submitted",
  "reflection_notes": "What worked: ...\nWhat to improve: ..."
}
```

### POST /submissions/:id/timeout

Mark submission as timed out (auto-submit).

---

## Scores

### POST /scores

Create or update score for submission. **Requires:** `facilitator` or `admin` role.

**Request:**

```json
{
  "submission_id": 1,
  "rubric_score": 4,
  "comments": "Good work on SQL queries. Consider optimizing the subquery."
}
```

### GET /scores/summary?cohort_id=1

Get cohort scoring summary. **Requires:** `facilitator` or `admin` role.

**Response:**

```json
{
  "total_interns": 25,
  "average_proficiency": 82.5
}
```

---

## Snapshots (Proctoring)

### POST /snapshots

Upload proctoring snapshot. **Requires:** `intern` role.

**Request:** `multipart/form-data`

- `assessment_id`: Assessment ID
- `image`: Image file (JPEG)

### GET /snapshots?cohort_id=1&assessment_id=1

Get proctoring snapshots. **Requires:** `facilitator` or `admin` role.

**Response:**

```json
[
  {
    "id": 1,
    "user_id": 3,
    "cohort_id": 1,
    "assessment_id": 1,
    "image_path": "3_1_1704110400.jpg",
    "captured_at": "2026-02-10 09:20:00",
    "user_name": "John Doe",
    "assessment_code": "A"
  }
]
```

---

## Error Responses

All endpoints return consistent error responses:

**401 Unauthorized:**

```json
{
  "error": "Unauthorized"
}
```

**403 Forbidden:**

```json
{
  "error": "Forbidden"
}
```

**404 Not Found:**

```json
{
  "error": "Resource not found"
}
```

**400 Bad Request:**

```json
{
  "error": "Validation error message"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Error details"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Recommended to add:

- 100 requests/minute per IP for regular endpoints
- 10 requests/minute for login endpoint
- 50 snapshot uploads/hour per user

## Versioning

Current API version: v1 (no versioning prefix yet)

Future: `/api/v1/` prefix for versioned endpoints
