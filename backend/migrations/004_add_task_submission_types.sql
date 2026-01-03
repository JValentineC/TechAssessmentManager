-- Add task type support for different submission methods
-- Date: 2026-01-02

-- Add task_type field to tasks table
-- Types: file_upload (default), text_input, link
ALTER TABLE `tasks` 
ADD COLUMN `task_type` ENUM('file_upload', 'text_input', 'link') NOT NULL DEFAULT 'file_upload' 
AFTER `template_url`;

-- Add submission_text field to submissions table for text-based submissions
ALTER TABLE `submissions` 
ADD COLUMN `submission_text` TEXT NULL 
AFTER `file_path`;

-- Update existing tasks to have explicit task type
-- Assessment A tasks will have specific types
UPDATE `tasks` t
JOIN `assessments` a ON t.`assessment_id` = a.`id`
SET t.`task_type` = CASE
    WHEN a.`code` = 'A' AND t.`order_index` = 0 THEN 'link'  -- Task 1: Google Doc link or PDF
    WHEN a.`code` = 'A' AND t.`order_index` = 1 THEN 'file_upload'  -- Task 2: Screenshot image
    WHEN a.`code` = 'A' AND t.`order_index` = 2 THEN 'text_input'  -- Task 3: Text input
    ELSE 'file_upload'  -- All other tasks default to file upload
END;
