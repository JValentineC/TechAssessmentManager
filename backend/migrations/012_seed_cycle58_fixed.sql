-- ============================================================
-- Complete Cycle 58 Data Seed - SIMPLIFIED VERSION
-- Uses cohort_id = 2 (cycle_number 58) which already exists
-- No stored procedures - plain INSERT statements only
-- ============================================================

USE AssessmentManager;

-- ============================================================
-- Insert Cycle 58 Interns (18 interns)
-- Cohort ID 2 (cycle_number 58) already exists
-- ============================================================

INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `current_cohort_id`, `status`, `enrollment_status`) VALUES
-- Active Interns
('Bonny Makaniankhondo', 'bmakaniankhondo@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Charlie Mejia', 'cmejia@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Dahlia Nunn', 'dnunn@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Maati Young', 'mayoung@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Maceo McBryde', 'mmcbryde@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Maya N. Huggins-Jordan', 'mhuggins-jordan@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Migoni Dowsey', 'mdowsey@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Nathan Jimenez', 'njimenez@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Penelope Darling', 'pdarling@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Thomas J Rosas', 'trosas@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Torell Pernell', 'tpernell@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
('Travion Ashford', 'tashford@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'active'),
-- Dismissed Interns
('Darius Montgomery', 'dmontgomery@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'dismissed'),
('Debra Cooks', 'dcooks@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'dismissed'),
('Khayyel Johnson', 'kjohnson@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'dismissed'),
-- Resigned Interns
('Mikal Shaffer', 'mshaffer@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'resigned'),
('Rachel Maynie', 'rmaynie@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'resigned'),
('Sofia Garcia', 'sgarcia@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'resigned');

-- ============================================================
-- Enroll all in Cycle 58
-- ============================================================
INSERT INTO `cohort_memberships` (`user_id`, `cohort_id`, `joined_at`)
SELECT u.id, 2, '2025-08-01 09:00:00'
FROM users u
WHERE u.email IN (
    'bmakaniankhondo@icstars.org', 'cmejia@icstars.org', 'dnunn@icstars.org',
    'dmontgomery@icstars.org', 'dcooks@icstars.org', 'kjohnson@icstars.org',
    'mayoung@icstars.org', 'mmcbryde@icstars.org', 'mhuggins-jordan@icstars.org',
    'mdowsey@icstars.org', 'mshaffer@icstars.org', 'njimenez@icstars.org',
    'pdarling@icstars.org', 'rmaynie@icstars.org', 'sgarcia@icstars.org',
    'trosas@icstars.org', 'tpernell@icstars.org', 'tashford@icstars.org'
);

-- ============================================================
-- Create Assessment Windows
-- ============================================================
INSERT INTO `assessment_windows` (`assessment_id`, `cohort_id`, `visible`, `opens_at`, `closes_at`, `locked`, `notes`) VALUES
(1, 2, 1, '2025-09-15 09:00:00', '2025-09-15 12:00:00', 1, 'Assessment A - Completed'),
(2, 2, 1, '2025-10-20 09:00:00', '2025-10-20 12:00:00', 1, 'Assessment B - Completed'),
(3, 2, 1, '2025-11-18 09:00:00', '2025-11-18 13:00:00', 1, 'Assessment C - Completed'),
(4, 2, 1, '2025-12-16 09:00:00', '2025-12-16 13:00:00', 1, 'Assessment D - Completed');

-- ============================================================
-- ASSESSMENT A SCORES (Tasks 54, 55, 56)

-- Bonny Makaniankhondo: 4,5,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:00:00', '2025-09-15 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:00:00', '2025-09-15 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-09-16 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:00:00', '2025-09-15 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:00:00');

-- Darius Montgomery: 3,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:15:00', '2025-09-15 10:15:00' FROM users WHERE email='dmontgomery@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 10:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:15:00', '2025-09-15 10:15:00' FROM users WHERE email='dmontgomery@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:15:00', '2025-09-15 10:15:00' FROM users WHERE email='dmontgomery@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:15:00');


-- Debra Cooks: 3,2,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:20:00', '2025-09-15 10:20:00' FROM users WHERE email='dcooks@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 10:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:20:00', '2025-09-15 10:20:00' FROM users WHERE email='dcooks@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 2, 2, '2025-09-16 10:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:20:00', '2025-09-15 10:20:00' FROM users WHERE email='dcooks@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:20:00');


-- Khayyel Johnson: 4,2,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:25:00', '2025-09-15 10:25:00' FROM users WHERE email='kjohnson@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:25:00', '2025-09-15 10:25:00' FROM users WHERE email='kjohnson@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 2, 2, '2025-09-16 10:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:25:00', '2025-09-15 10:25:00' FROM users WHERE email='kjohnson@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:25:00');


-- Maati Young: 4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:30:00', '2025-09-15 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:30:00', '2025-09-15 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:30:00', '2025-09-15 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:30:00');


-- Maceo McBryde: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:35:00', '2025-09-15 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:35:00', '2025-09-15 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:35:00', '2025-09-15 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:35:00');


-- Maya N. Huggins-Jordan: 2,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:40:00', '2025-09-15 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 2, 2, '2025-09-16 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:40:00', '2025-09-15 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:40:00', '2025-09-15 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:40:00');


-- Migoni Dowsey: 4,3,3
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:45:00', '2025-09-15 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:45:00', '2025-09-15 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:45:00', '2025-09-15 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 10:45:00');


-- Mikal Shaffer: 4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:50:00', '2025-09-15 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:50:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:50:00', '2025-09-15 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:50:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:50:00', '2025-09-15 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:50:00');


-- Nathan Jimenez: 4,2,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 10:55:00', '2025-09-15 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 10:55:00', '2025-09-15 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 2, 2, '2025-09-16 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 10:55:00', '2025-09-15 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 10:55:00');


-- Penelope Darling: 4,2,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 11:00:00', '2025-09-15 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 11:00:00', '2025-09-15 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 2, 2, '2025-09-16 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 11:00:00', '2025-09-15 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:00:00');


-- Rachel Maynie: 5,2,1
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 11:05:00', '2025-09-15 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-09-16 11:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 11:05:00', '2025-09-15 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 2, 2, '2025-09-16 11:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 11:05:00', '2025-09-15 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-09-16 11:05:00');


-- Sofia Garcia: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 11:10:00', '2025-09-15 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 11:10:00', '2025-09-15 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 11:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 11:10:00', '2025-09-15 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:10:00');


-- Thomas J Rosas: 4,2,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 11:15:00', '2025-09-15 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 11:15:00', '2025-09-15 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 2, 2, '2025-09-16 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 11:15:00', '2025-09-15 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:15:00');


-- Torell Pernell: 3,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 11:20:00', '2025-09-15 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 11:20:00', '2025-09-15 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 11:20:00', '2025-09-15 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:20:00');


-- Travion Ashford: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 54, 'submitted', '2025-09-15 11:25:00', '2025-09-15 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 55, 'submitted', '2025-09-15 11:25:00', '2025-09-15 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-09-16 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 1, 56, 'submitted', '2025-09-15 11:25:00', '2025-09-15 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-09-16 11:25:00');


-- ============================================================
-- ASSESSMENT B SCORES (Tasks 5,6,7)
-- ============================================================

-- Bonny Makaniankhondo: 4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:00:00', '2025-10-20 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:00:00', '2025-10-20 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:00:00', '2025-10-20 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:00:00');


-- Charlie Mejia: 3,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:05:00', '2025-10-20 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:05:00', '2025-10-20 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:05:00', '2025-10-20 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:05:00');


-- Dahlia Nunn: 4,4,5
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:10:00', '2025-10-20 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:10:00', '2025-10-20 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:10:00', '2025-10-20 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-10-21 10:10:00');


-- Darius Montgomery: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:15:00', '2025-10-20 10:15:00' FROM users WHERE email='dmontgomery@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:15:00', '2025-10-20 10:15:00' FROM users WHERE email='dmontgomery@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:15:00', '2025-10-20 10:15:00' FROM users WHERE email='dmontgomery@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:15:00');


-- Debra Cooks: 3,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:20:00', '2025-10-20 10:20:00' FROM users WHERE email='dcooks@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:20:00', '2025-10-20 10:20:00' FROM users WHERE email='dcooks@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:20:00', '2025-10-20 10:20:00' FROM users WHERE email='dcooks@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:20:00');


-- Khayyel Johnson: 3,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:25:00', '2025-10-20 10:25:00' FROM users WHERE email='kjohnson@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:25:00', '2025-10-20 10:25:00' FROM users WHERE email='kjohnson@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:25:00', '2025-10-20 10:25:00' FROM users WHERE email='kjohnson@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:25:00');


-- Maati Young: 4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:30:00', '2025-10-20 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:30:00', '2025-10-20 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:30:00', '2025-10-20 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:30:00');


-- Maceo McBryde: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:35:00', '2025-10-20 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:35:00', '2025-10-20 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:35:00', '2025-10-20 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:35:00');


-- Maya N. Huggins-Jordan: 3,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:40:00', '2025-10-20 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:40:00', '2025-10-20 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:40:00', '2025-10-20 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:40:00');


-- Migoni Dowsey: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:45:00', '2025-10-20 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:45:00', '2025-10-20 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:45:00', '2025-10-20 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:45:00');


-- Mikal Shaffer: 4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:50:00', '2025-10-20 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:50:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:50:00', '2025-10-20 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:50:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:50:00', '2025-10-20 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:50:00');


-- Nathan Jimenez: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 10:55:00', '2025-10-20 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 10:55:00', '2025-10-20 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 10:55:00', '2025-10-20 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 10:55:00');


-- Penelope Darling: 3,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 11:00:00', '2025-10-20 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 11:00:00', '2025-10-20 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 11:00:00', '2025-10-20 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:00:00');


-- Rachel Maynie: 4,3,3
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 11:05:00', '2025-10-20 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 11:05:00', '2025-10-20 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 11:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 11:05:00', '2025-10-20 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 11:05:00');


-- Sofia Garcia: 3,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 11:10:00', '2025-10-20 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 11:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 11:10:00', '2025-10-20 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 11:10:00', '2025-10-20 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:10:00');


-- Thomas J Rosas: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 11:15:00', '2025-10-20 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 11:15:00', '2025-10-20 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 11:15:00', '2025-10-20 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:15:00');


-- Torell Pernell: 4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 11:20:00', '2025-10-20 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 11:20:00', '2025-10-20 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 11:20:00', '2025-10-20 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:20:00');


-- Travion Ashford: 4,3,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 58, 'submitted', '2025-10-20 11:25:00', '2025-10-20 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 59, 'submitted', '2025-10-20 11:25:00', '2025-10-20 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-10-21 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 2, 60, 'submitted', '2025-10-20 11:25:00', '2025-10-20 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-10-21 11:25:00');


-- ============================================================
-- ASSESSMENT C SCORES (Tasks 9,10,11,12) - Only active interns (15)
-- ============================================================

-- Bonny Makaniankhondo: 4,4,5,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:00:00', '2025-11-18 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:00:00', '2025-11-18 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:00:00', '2025-11-18 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-11-19 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:00:00', '2025-11-18 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:00:00');


-- Charlie Mejia: 4,4,5,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:05:00', '2025-11-18 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:05:00', '2025-11-18 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:05:00', '2025-11-18 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-11-19 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:05:00', '2025-11-18 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:05:00');


-- Dahlia Nunn: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:10:00', '2025-11-18 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:10:00', '2025-11-18 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:10:00', '2025-11-18 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:10:00', '2025-11-18 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:10:00');


-- Maati Young: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:30:00', '2025-11-18 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:30:00', '2025-11-18 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:30:00', '2025-11-18 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:30:00', '2025-11-18 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:30:00');


-- Maceo McBryde: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:35:00', '2025-11-18 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:35:00', '2025-11-18 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:35:00', '2025-11-18 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:35:00', '2025-11-18 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:35:00');


-- Maya N. Huggins-Jordan: 3,3,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:40:00', '2025-11-18 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-11-19 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:40:00', '2025-11-18 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-11-19 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:40:00', '2025-11-18 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:40:00', '2025-11-18 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:40:00');


-- Migoni Dowsey: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:45:00', '2025-11-18 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:45:00', '2025-11-18 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:45:00', '2025-11-18 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:45:00', '2025-11-18 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:45:00');


-- Mikal Shaffer: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:50:00', '2025-11-18 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:50:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:50:00', '2025-11-18 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:50:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:50:00', '2025-11-18 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:50:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:50:00', '2025-11-18 10:50:00' FROM users WHERE email='mshaffer@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:50:00');


-- Nathan Jimenez: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 10:55:00', '2025-11-18 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 10:55:00', '2025-11-18 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 10:55:00', '2025-11-18 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 10:55:00', '2025-11-18 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 10:55:00');


-- Penelope Darling: 3,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 11:00:00', '2025-11-18 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-11-19 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 11:00:00', '2025-11-18 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 11:00:00', '2025-11-18 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 11:00:00', '2025-11-18 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:00:00');


-- Rachel Maynie: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 11:05:00', '2025-11-18 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 11:05:00', '2025-11-18 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 11:05:00', '2025-11-18 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 11:05:00', '2025-11-18 11:05:00' FROM users WHERE email='rmaynie@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:05:00');


-- Sofia Garcia: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 11:10:00', '2025-11-18 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 11:10:00', '2025-11-18 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 11:10:00', '2025-11-18 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 11:10:00', '2025-11-18 11:10:00' FROM users WHERE email='sgarcia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:10:00');


-- Thomas J Rosas: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 11:15:00', '2025-11-18 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 11:15:00', '2025-11-18 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 11:15:00', '2025-11-18 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 11:15:00', '2025-11-18 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:15:00');


-- Torell Pernell: 4,4,5,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 11:20:00', '2025-11-18 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 11:20:00', '2025-11-18 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 11:20:00', '2025-11-18 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-11-19 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 11:20:00', '2025-11-18 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:20:00');


-- Travion Ashford: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 62, 'submitted', '2025-11-18 11:25:00', '2025-11-18 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 63, 'submitted', '2025-11-18 11:25:00', '2025-11-18 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 64, 'submitted', '2025-11-18 11:25:00', '2025-11-18 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 3, 65, 'submitted', '2025-11-18 11:25:00', '2025-11-18 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-11-19 11:25:00');


-- ============================================================
-- ASSESSMENT D SCORES (Tasks 13,14,15,16) - Only still active (12)
-- ============================================================

-- Bonny Makaniankhondo: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:00:00');


-- Charlie Mejia: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:05:00');


-- Dahlia Nunn: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:10:00');


-- Maati Young: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:30:00');


-- Maceo McBryde: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:35:00');


-- Maya N. Huggins-Jordan: 4,3,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 3, 2, '2025-12-17 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:40:00');


-- Migoni Dowsey: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:45:00');


-- Nathan Jimenez: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:55:00');


-- Penelope Darling: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:00:00');


-- Thomas J Rosas: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:15:00');


-- Torell Pernell: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:20:00');


-- Travion Ashford: 4,4,4,4
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 67, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 68, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 69, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 70, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 11:25:00');



-- ============================================================
-- Audit entry
-- ============================================================
INSERT INTO `audit_logs` (`actor_user_id`, `action`, `entity`, `entity_id`, `metadata_json`)
VALUES (1, 'SEED_CYCLE58_DATA', 'database', NULL, JSON_OBJECT('version', '2.0.0', 'timestamp', NOW(), 'total_interns', 18, 'total_scores', 216));
