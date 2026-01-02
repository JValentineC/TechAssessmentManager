-- Seed Data for i.c.stars Assessment System
-- Creates initial cohorts, assessments, admin accounts

-- ============================================================
-- Seed Cohorts
-- ============================================================
INSERT INTO `cohorts` (`cycle_number`, `name`, `start_date`, `end_date`, `status`) VALUES
(59, 'Cycle 59', '2026-01-06', '2026-06-30', 'active'),
(58, 'Cycle 58', '2025-08-01', '2025-12-20', 'archived'),
(60, 'Cycle 60', '2026-07-01', '2026-12-31', 'upcoming');

-- ============================================================
-- Seed Admin and Facilitator Accounts
-- Password: Admin@2026! (hashed with bcrypt)
-- ============================================================
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `current_cohort_id`, `status`) VALUES
('System Administrator', 'admin@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1, 'active'),
('Lead Facilitator', 'facilitator@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'facilitator', 1, 'active'),
('John Doe', 'intern@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 1, 'active');

-- ============================================================
-- Enroll test intern in Cycle 59
-- ============================================================
INSERT INTO `cohort_memberships` (`user_id`, `cohort_id`, `joined_at`) VALUES
(3, 1, NOW());

-- ============================================================
-- Seed Assessments A, B, C, D
-- ============================================================
INSERT INTO `assessments` (`code`, `title`, `description`, `duration_minutes`) VALUES
('A', 'Assessment A - Fundamentals', 'Evaluation of fundamental programming concepts, SQL basics, and problem-solving skills.', 60),
('B', 'Assessment B - Intermediate Skills', 'Intermediate assessment covering advanced SQL, data structures, and web technologies.', 90),
('C', 'Assessment C - Applied Development', 'Applied development assessment with real-world scenarios and debugging challenges.', 120),
('D', 'Assessment D - Capstone', 'Comprehensive capstone assessment integrating all learned skills.', 120);

-- ============================================================
-- Seed Tasks for Assessment A
-- ============================================================
INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(1, 'SQL Query Challenge', 'Write SQL queries to solve the provided business problems. Save your queries in a .sql file.', NULL, 5, 1),
(1, 'Algorithm Implementation', 'Implement the specified algorithm in your preferred language. Upload your code as a .txt file.', NULL, 5, 2),
(1, 'Debugging Exercise', 'Identify and fix the bugs in the provided code. Document your findings in a .md file.', NULL, 5, 3),
(1, 'Reflection', 'Complete the reflection questions about your problem-solving approach.', NULL, 0, 4);

-- ============================================================
-- Seed Tasks for Assessment B
-- ============================================================
INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(2, 'Database Design', 'Design a normalized database schema for the given requirements. Submit an ER diagram (PNG/JPG) and SQL DDL.', NULL, 5, 1),
(2, 'API Integration', 'Consume the provided API and display results. Upload your code and screenshots.', NULL, 5, 2),
(2, 'Advanced SQL', 'Write complex queries involving joins, subqueries, and aggregations.', NULL, 5, 3),
(2, 'Reflection', 'Reflect on challenges faced and solutions implemented.', NULL, 0, 4);

-- ============================================================
-- Seed Tasks for Assessment C
-- ============================================================
INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(3, 'Feature Implementation', 'Implement the specified feature following best practices. Submit code and test results.', NULL, 5, 1),
(3, 'Code Review', 'Review the provided code and document issues found. Use the provided defect log template.', NULL, 5, 2),
(3, 'Performance Optimization', 'Optimize the slow query/function. Document before/after metrics.', NULL, 5, 3),
(3, 'Reflection', 'Describe your development process and key learnings.', NULL, 0, 4);

-- ============================================================
-- Seed Tasks for Assessment D
-- ============================================================
INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(4, 'Full-Stack Implementation', 'Build a complete feature with frontend, backend, and database components.', NULL, 5, 1),
(4, 'System Design', 'Design a scalable solution for the given problem. Submit architecture diagram and documentation.', NULL, 5, 2),
(4, 'Integration & Testing', 'Integrate components and provide test coverage. Submit test results.', NULL, 5, 3),
(4, 'Final Reflection', 'Comprehensive reflection on your growth throughout the program.', NULL, 0, 4);

-- ============================================================
-- Seed Assessment Windows for Cycle 59
-- (Dates set in the future; facilitator will adjust)
-- ============================================================
INSERT INTO `assessment_windows` (`assessment_id`, `cohort_id`, `visible`, `opens_at`, `closes_at`, `locked`, `notes`) VALUES
(1, 1, 0, '2026-02-10 09:00:00', '2026-02-10 12:00:00', 0, 'Assessment A will be available during Week 6'),
(2, 1, 0, '2026-03-10 09:00:00', '2026-03-10 12:00:00', 0, 'Assessment B will be available during Week 8'),
(3, 1, 0, '2026-04-14 09:00:00', '2026-04-14 13:00:00', 0, 'Assessment C will be available during Week 12'),
(4, 1, 0, '2026-05-19 09:00:00', '2026-05-19 13:00:00', 0, 'Assessment D will be available during Week 16');

-- ============================================================
-- Create sample audit log entry
-- ============================================================
INSERT INTO `audit_logs` (`actor_user_id`, `action`, `entity`, `entity_id`, `metadata_json`) VALUES
(1, 'SEED_DATA', 'database', NULL, JSON_OBJECT('version', '1.0.0', 'timestamp', NOW()));
