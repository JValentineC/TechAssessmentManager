-- Add rubrics table for storing scoring criteria
-- This allows admins to define detailed rubric criteria for each score level (1-5)
-- Rubrics can be attached to either assessments (applies to all tasks) or specific tasks

CREATE TABLE IF NOT EXISTS `rubrics` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assessment_id` INT UNSIGNED NULL,
  `task_id` INT UNSIGNED NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL COMMENT 'General rubric description/instructions',
  `level_1_criteria` TEXT NOT NULL COMMENT 'Limited (1) - Criteria description',
  `level_2_criteria` TEXT NOT NULL COMMENT 'Emerging (2) - Criteria description',
  `level_3_criteria` TEXT NOT NULL COMMENT 'Developing (3) - Criteria description',
  `level_4_criteria` TEXT NOT NULL COMMENT 'Proficient (4) - Criteria description',
  `level_5_criteria` TEXT NOT NULL COMMENT 'Advanced (5) - Criteria description',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  KEY `idx_assessment` (`assessment_id`),
  KEY `idx_task` (`task_id`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `fk_rubric_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rubric_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rubric_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_rubric_scope` CHECK (
    (assessment_id IS NOT NULL AND task_id IS NULL) OR 
    (assessment_id IS NULL AND task_id IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for efficient lookup
CREATE INDEX `idx_rubric_lookup` ON `rubrics` (`assessment_id`, `task_id`);
