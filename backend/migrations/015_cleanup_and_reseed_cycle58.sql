-- Clean up existing Cycle 58 data and re-seed with complete dataset
-- This will preserve users but delete and recreate all submissions/scores

-- Delete existing Cycle 58 scores
DELETE FROM scores 
WHERE submission_id IN (
    SELECT id FROM submissions WHERE cohort_id = 2
);

-- Delete existing Cycle 58 submissions
DELETE FROM submissions WHERE cohort_id = 2;

-- Delete existing Cycle 58 assessment windows
DELETE FROM assessment_windows WHERE cohort_id = 2;

-- Now run the seed file with corrected task IDs
SOURCE /home/protected/backend/migrations/012_seed_cycle58_fixed_v3.sql;
