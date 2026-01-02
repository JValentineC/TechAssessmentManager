-- i.c.stars Assessment Management System
-- Database Schema Migration
-- Version: 1.0.0
-- Date: 2026-01-01

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('intern', 'facilitator', 'admin') NOT NULL DEFAULT 'intern',
  `current_cohort_id` INT UNSIGNED NULL,
  `status` ENUM('active', 'inactive', 'archived') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `idx_current_cohort` (`current_cohort_id`),
  KEY `idx_role_status` (`role`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: cohorts
-- ============================================================
CREATE TABLE IF NOT EXISTS `cohorts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cycle_number` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `status` ENUM('active', 'archived', 'upcoming') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_cycle_number` (`cycle_number`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: cohort_memberships
-- ============================================================
CREATE TABLE IF NOT EXISTS `cohort_memberships` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `cohort_id` INT UNSIGNED NOT NULL,
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `left_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_cohort` (`user_id`, `cohort_id`),
  KEY `idx_cohort_joined` (`cohort_id`, `joined_at`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_membership_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_membership_cohort` FOREIGN KEY (`cohort_id`) REFERENCES `cohorts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: assessments
-- ============================================================
CREATE TABLE IF NOT EXISTS `assessments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` ENUM('A', 'B', 'C', 'D') NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL,
  `duration_minutes` INT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: assessment_windows
-- ============================================================
CREATE TABLE IF NOT EXISTS `assessment_windows` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assessment_id` INT UNSIGNED NOT NULL,
  `cohort_id` INT UNSIGNED NOT NULL,
  `visible` TINYINT(1) NOT NULL DEFAULT 0,
  `opens_at` DATETIME NOT NULL,
  `closes_at` DATETIME NOT NULL,
  `locked` TINYINT(1) NOT NULL DEFAULT 0,
  `notes` VARCHAR(300) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_assessment_cohort` (`assessment_id`, `cohort_id`),
  KEY `idx_cohort_visible` (`cohort_id`, `visible`, `opens_at`, `closes_at`),
  KEY `idx_locked` (`locked`),
  CONSTRAINT `fk_window_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_window_cohort` FOREIGN KEY (`cohort_id`) REFERENCES `cohorts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_dates` CHECK (`closes_at` > `opens_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: access_overrides
-- ============================================================
CREATE TABLE IF NOT EXISTS `access_overrides` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `assessment_id` INT UNSIGNED NOT NULL,
  `cohort_id` INT UNSIGNED NOT NULL,
  `override_type` ENUM('allow', 'deny') NOT NULL,
  `starts_at` DATETIME NOT NULL,
  `ends_at` DATETIME NOT NULL,
  `reason` VARCHAR(300) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_assessment_cohort` (`user_id`, `assessment_id`, `cohort_id`, `starts_at`, `ends_at`),
  KEY `idx_cohort` (`cohort_id`),
  CONSTRAINT `fk_override_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_override_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_override_cohort` FOREIGN KEY (`cohort_id`) REFERENCES `cohorts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_override_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_override_dates` CHECK (`ends_at` > `starts_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assessment_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `instructions` TEXT NOT NULL,
  `template_url` VARCHAR(300) NULL,
  `max_points` INT UNSIGNED NOT NULL DEFAULT 5,
  `order_index` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assessment_order` (`assessment_id`, `order_index`),
  CONSTRAINT `fk_task_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `cohort_id` INT UNSIGNED NOT NULL,
  `assessment_id` INT UNSIGNED NOT NULL,
  `task_id` INT UNSIGNED NOT NULL,
  `status` ENUM('in_progress', 'submitted', 'timed_out') NOT NULL DEFAULT 'in_progress',
  `file_path` VARCHAR(500) NULL,
  `reflection_notes` TEXT NULL,
  `started_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_cohort_assessment_task` (`user_id`, `cohort_id`, `assessment_id`, `task_id`),
  KEY `idx_status_submitted` (`status`, `submitted_at`),
  KEY `idx_cohort_assessment` (`cohort_id`, `assessment_id`),
  CONSTRAINT `fk_submission_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submission_cohort` FOREIGN KEY (`cohort_id`) REFERENCES `cohorts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submission_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submission_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: scores
-- ============================================================
CREATE TABLE IF NOT EXISTS `scores` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` INT UNSIGNED NOT NULL,
  `rubric_score` INT UNSIGNED NOT NULL,
  `comments` TEXT NULL,
  `scored_by` INT UNSIGNED NOT NULL,
  `scored_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_submission` (`submission_id`),
  KEY `idx_scored_by` (`scored_by`, `scored_at`),
  CONSTRAINT `fk_score_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_score_scorer` FOREIGN KEY (`scored_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_score_range` CHECK (`rubric_score` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: snapshots
-- ============================================================
CREATE TABLE IF NOT EXISTS `snapshots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `cohort_id` INT UNSIGNED NOT NULL,
  `assessment_id` INT UNSIGNED NOT NULL,
  `image_path` VARCHAR(500) NOT NULL,
  `captured_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_assessment_captured` (`user_id`, `assessment_id`, `captured_at`),
  KEY `idx_cohort_captured` (`cohort_id`, `captured_at`),
  CONSTRAINT `fk_snapshot_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_snapshot_cohort` FOREIGN KEY (`cohort_id`) REFERENCES `cohorts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_snapshot_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_user_id` INT UNSIGNED NULL,
  `action` VARCHAR(120) NOT NULL,
  `entity` VARCHAR(120) NOT NULL,
  `entity_id` INT UNSIGNED NULL,
  `metadata_json` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_action_created` (`action`, `created_at`),
  KEY `idx_entity` (`entity`, `entity_id`),
  KEY `idx_actor` (`actor_user_id`, `created_at`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Add foreign key constraint after users table is created
-- ============================================================
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_cohort` FOREIGN KEY (`current_cohort_id`) REFERENCES `cohorts` (`id`) ON DELETE SET NULL;
