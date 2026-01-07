-- Cycle 58 Assessment D Submissions and Scores
-- Task IDs: 102 (Data Pipeline), 103 (ERD), 104 (AI Evaluation), 105 (Release Plan)

-- Bonny Makaniankhondo - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-12-17 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:00:00', '2025-12-16 10:00:00' FROM users WHERE email='bmakaniankhondo@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:00:00');

-- Charlie Mejia - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:05:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:05:00', '2025-12-16 10:05:00' FROM users WHERE email='cmejia@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:05:00');

-- Dahlia Nunn - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 5, 2, '2025-12-17 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:10:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:10:00', '2025-12-16 10:10:00' FROM users WHERE email='dnunn@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:10:00');

-- Maati Young - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:30:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:30:00', '2025-12-16 10:30:00' FROM users WHERE email='mayoung@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:30:00');

-- Maceo McBryde - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 4, 2, '2025-12-17 10:35:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:35:00', '2025-12-16 10:35:00' FROM users WHERE email='mmcbryde@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:35:00');

-- Maya N. Huggins-Jordan - Active (Note: using mhuggins-jordan@icstars.org)
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:40:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:40:00', '2025-12-16 10:40:00' FROM users WHERE email='mhuggins-jordan@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:40:00');

-- Migoni Dowsey - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:45:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:45:00', '2025-12-16 10:45:00' FROM users WHERE email='mdowsey@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:45:00');

-- Nathan Jimenez - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:55:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 10:55:00', '2025-12-16 10:55:00' FROM users WHERE email='njimenez@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 10:55:00');

-- Penelope Darling - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:00:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 11:00:00', '2025-12-16 11:00:00' FROM users WHERE email='pdarling@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:00:00');

-- Thomas J Rosas - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:15:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 11:15:00', '2025-12-16 11:15:00' FROM users WHERE email='trosas@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:15:00');

-- Torell Pernell - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:20:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 11:20:00', '2025-12-16 11:20:00' FROM users WHERE email='tpernell@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:20:00');

-- Travion Ashford - Active
INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 102, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 103, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 104, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:25:00');

INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, 2, 4, 105, 'submitted', '2025-12-16 11:25:00', '2025-12-16 11:25:00' FROM users WHERE email='tashford@icstars.org';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), 1, 2, '2025-12-17 11:25:00');
