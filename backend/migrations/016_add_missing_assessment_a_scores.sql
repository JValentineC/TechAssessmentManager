-- Add missing Assessment A scores for Charlie Mejia and Dahlia Nunn

-- Get user IDs
SET @charlie_id = (SELECT id FROM users WHERE email = 'cmejia@icstars.org' LIMIT 1);
SET @dahlia_id = (SELECT id FROM users WHERE email = 'dnunn@icstars.org' LIMIT 1);

-- Get assessment window ID for Assessment A in Cycle 58
SET @window_id = (SELECT id FROM assessment_windows WHERE assessment_id = 1 AND cohort_id = 2 LIMIT 1);

-- Create submissions for Charlie Mejia for Assessment A tasks
INSERT INTO submissions (user_id, task_id, assessment_id, cohort_id, window_id, submitted_at, status)
VALUES
    (@charlie_id, 89, 1, 2, @window_id, '2024-09-15 14:30:00', 'graded'),
    (@charlie_id, 90, 1, 2, @window_id, '2024-09-15 14:45:00', 'graded'),
    (@charlie_id, 91, 1, 2, @window_id, '2024-09-15 15:00:00', 'graded');

-- Create submissions for Dahlia Nunn for Assessment A tasks
INSERT INTO submissions (user_id, task_id, assessment_id, cohort_id, window_id, submitted_at, status)
VALUES
    (@dahlia_id, 89, 1, 2, @window_id, '2024-09-15 14:30:00', 'graded'),
    (@dahlia_id, 90, 1, 2, @window_id, '2024-09-15 14:45:00', 'graded'),
    (@dahlia_id, 91, 1, 2, @window_id, '2024-09-15 15:00:00', 'graded');

-- Get submission IDs
SET @charlie_sub1 = (SELECT id FROM submissions WHERE user_id = @charlie_id AND task_id = 89 AND assessment_id = 1 AND cohort_id = 2 LIMIT 1);
SET @charlie_sub2 = (SELECT id FROM submissions WHERE user_id = @charlie_id AND task_id = 90 AND assessment_id = 1 AND cohort_id = 2 LIMIT 1);
SET @charlie_sub3 = (SELECT id FROM submissions WHERE user_id = @charlie_id AND task_id = 91 AND assessment_id = 1 AND cohort_id = 2 LIMIT 1);

SET @dahlia_sub1 = (SELECT id FROM submissions WHERE user_id = @dahlia_id AND task_id = 89 AND assessment_id = 1 AND cohort_id = 2 LIMIT 1);
SET @dahlia_sub2 = (SELECT id FROM submissions WHERE user_id = @dahlia_id AND task_id = 90 AND assessment_id = 1 AND cohort_id = 2 LIMIT 1);
SET @dahlia_sub3 = (SELECT id FROM submissions WHERE user_id = @dahlia_id AND task_id = 91 AND assessment_id = 1 AND cohort_id = 2 LIMIT 1);

-- Insert scores for Charlie Mejia (Task 1=4, Task 2=3, Task 3=4)
INSERT INTO scores (submission_id, rubric_score, graded_at, graded_by)
VALUES
    (@charlie_sub1, 4, '2024-09-16 10:00:00', 1),
    (@charlie_sub2, 3, '2024-09-16 10:00:00', 1),
    (@charlie_sub3, 4, '2024-09-16 10:00:00', 1);

-- Insert scores for Dahlia Nunn (Task 1=4, Task 2=4, Task 3=4)
INSERT INTO scores (submission_id, rubric_score, graded_at, graded_by)
VALUES
    (@dahlia_sub1, 4, '2024-09-16 10:00:00', 1),
    (@dahlia_sub2, 4, '2024-09-16 10:00:00', 1),
    (@dahlia_sub3, 4, '2024-09-16 10:00:00', 1);
