-- Add enrollment_status field to users table
-- This tracks whether interns are Active, Dismissed, or Resigned

ALTER TABLE `users` 
ADD COLUMN `enrollment_status` ENUM('active', 'dismissed', 'resigned') NOT NULL DEFAULT 'active' 
AFTER `status`;

-- Add index for filtering by enrollment status
ALTER TABLE `users` 
ADD INDEX `idx_enrollment_status` (`enrollment_status`);
