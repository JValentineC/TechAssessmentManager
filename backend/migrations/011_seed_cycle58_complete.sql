-- ============================================================
-- Complete Cycle 58 Data Seed
-- Interns, Enrollments, Assessment Windows, Submissions, and Scores
-- ============================================================

-- Use the database
USE AssessmentManager;

-- ============================================================
-- Insert Cycle 58 Interns (18 interns)
-- Password: password123! (already hashed)
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
('Sofia Garcia', 'sgarcia@icstars.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intern', 2, 'active', 'resigned')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================================
-- Enroll all in Cycle 58 (cohort_id = 2)
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
)
ON DUPLICATE KEY UPDATE joined_at=joined_at;

-- ============================================================
-- Create Assessment Windows for Cycle 58
-- ============================================================
INSERT INTO `assessment_windows` (`assessment_id`, `cohort_id`, `visible`, `opens_at`, `closes_at`, `locked`, `notes`) VALUES
(1, 2, 1, '2025-09-15 09:00:00', '2025-09-15 12:00:00', 1, 'Assessment A - Completed'),
(2, 2, 1, '2025-10-20 09:00:00', '2025-10-20 12:00:00', 1, 'Assessment B - Completed'),
(3, 2, 1, '2025-11-18 09:00:00', '2025-11-18 13:00:00', 1, 'Assessment C - Completed'),
(4, 2, 1, '2025-12-16 09:00:00', '2025-12-16 13:00:00', 1, 'Assessment D - Completed')
ON DUPLICATE KEY UPDATE notes=notes;

-- ============================================================
-- Helper to create submission and score
-- Assessment A (assessment_id=1, tasks 1,2,3)
-- ============================================================

-- Bonny: 4,5,4
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 1, 2, 5, '2025-09-15');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Charlie: 4,3,4
CALL create_submission_with_score('cmejia@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('cmejia@icstars.org', 2, 1, 2, 3, '2025-09-15');
CALL create_submission_with_score('cmejia@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Dahlia: 4,4,4
CALL create_submission_with_score('dnunn@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('dnunn@icstars.org', 2, 1, 2, 4, '2025-09-15');
CALL create_submission_with_score('dnunn@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Darius: 3,4,4
CALL create_submission_with_score('dmontgomery@icstars.org', 2, 1, 1, 3, '2025-09-15');
CALL create_submission_with_score('dmontgomery@icstars.org', 2, 1, 2, 4, '2025-09-15');
CALL create_submission_with_score('dmontgomery@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Debra: 3,2,4
CALL create_submission_with_score('dcooks@icstars.org', 2, 1, 1, 3, '2025-09-15');
CALL create_submission_with_score('dcooks@icstars.org', 2, 1, 2, 2, '2025-09-15');
CALL create_submission_with_score('dcooks@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Khayyel: 4,2,4
CALL create_submission_with_score('kjohnson@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('kjohnson@icstars.org', 2, 1, 2, 2, '2025-09-15');
CALL create_submission_with_score('kjohnson@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Maati: 4,4,4
CALL create_submission_with_score('mayoung@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('mayoung@icstars.org', 2, 1, 2, 4, '2025-09-15');
CALL create_submission_with_score('mayoung@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Maceo: 4,3,4
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 1, 2, 3, '2025-09-15');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Maya: 2,3,4
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 1, 1, 2, '2025-09-15');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 1, 2, 3, '2025-09-15');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Migoni: 4,3,3
CALL create_submission_with_score('mdowsey@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 1, 2, 3, '2025-09-15');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 1, 3, 3, '2025-09-15');

-- Mikal: 4,4,4
CALL create_submission_with_score('mshaffer@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('mshaffer@icstars.org', 2, 1, 2, 4, '2025-09-15');
CALL create_submission_with_score('mshaffer@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Nathan: 4,2,4
CALL create_submission_with_score('njimenez@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('njimenez@icstars.org', 2, 1, 2, 2, '2025-09-15');
CALL create_submission_with_score('njimenez@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Penelope: 4,2,4
CALL create_submission_with_score('pdarling@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('pdarling@icstars.org', 2, 1, 2, 2, '2025-09-15');
CALL create_submission_with_score('pdarling@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Rachel: 5,2,1
CALL create_submission_with_score('rmaynie@icstars.org', 2, 1, 1, 5, '2025-09-15');
CALL create_submission_with_score('rmaynie@icstars.org', 2, 1, 2, 2, '2025-09-15');
CALL create_submission_with_score('rmaynie@icstars.org', 2, 1, 3, 1, '2025-09-15');

-- Sofia: 4,3,4
CALL create_submission_with_score('sgarcia@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('sgarcia@icstars.org', 2, 1, 2, 3, '2025-09-15');
CALL create_submission_with_score('sgarcia@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Thomas: 4,2,4
CALL create_submission_with_score('trosas@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('trosas@icstars.org', 2, 1, 2, 2, '2025-09-15');
CALL create_submission_with_score('trosas@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Torell: 3,4,4
CALL create_submission_with_score('tpernell@icstars.org', 2, 1, 1, 3, '2025-09-15');
CALL create_submission_with_score('tpernell@icstars.org', 2, 1, 2, 4, '2025-09-15');
CALL create_submission_with_score('tpernell@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- Travion: 4,3,4
CALL create_submission_with_score('tashford@icstars.org', 2, 1, 1, 4, '2025-09-15');
CALL create_submission_with_score('tashford@icstars.org', 2, 1, 2, 3, '2025-09-15');
CALL create_submission_with_score('tashford@icstars.org', 2, 1, 3, 4, '2025-09-15');

-- ============================================================
-- Assessment B (assessment_id=2, tasks 5,6,7)
-- ============================================================

-- Bonny: 5,1,3
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 2, 5, 5, '2025-10-20');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 2, 7, 3, '2025-10-20');

-- Charlie: 3,1,4
CALL create_submission_with_score('cmejia@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('cmejia@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('cmejia@icstars.org', 2, 2, 7, 4, '2025-10-20');

-- Dahlia: 4,4,4
CALL create_submission_with_score('dnunn@icstars.org', 2, 2, 5, 4, '2025-10-20');
CALL create_submission_with_score('dnunn@icstars.org', 2, 2, 6, 4, '2025-10-20');
CALL create_submission_with_score('dnunn@icstars.org', 2, 2, 7, 4, '2025-10-20');

-- Darius: 3,1,2
CALL create_submission_with_score('dmontgomery@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('dmontgomery@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('dmontgomery@icstars.org', 2, 2, 7, 2, '2025-10-20');

-- Debra: 1,3,3
CALL create_submission_with_score('dcooks@icstars.org', 2, 2, 5, 1, '2025-10-20');
CALL create_submission_with_score('dcooks@icstars.org', 2, 2, 6, 3, '2025-10-20');
CALL create_submission_with_score('dcooks@icstars.org', 2, 2, 7, 3, '2025-10-20');

-- Khayyel: 4,2,3
CALL create_submission_with_score('kjohnson@icstars.org', 2, 2, 5, 4, '2025-10-20');
CALL create_submission_with_score('kjohnson@icstars.org', 2, 2, 6, 2, '2025-10-20');
CALL create_submission_with_score('kjohnson@icstars.org', 2, 2, 7, 3, '2025-10-20');

-- Maati: 1,1,2
CALL create_submission_with_score('mayoung@icstars.org', 2, 2, 5, 1, '2025-10-20');
CALL create_submission_with_score('mayoung@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('mayoung@icstars.org', 2, 2, 7, 2, '2025-10-20');

-- Maceo: 2,1,2
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 2, 5, 2, '2025-10-20');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 2, 7, 2, '2025-10-20');

-- Maya: 3,2,2
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 2, 6, 2, '2025-10-20');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 2, 7, 2, '2025-10-20');

-- Migoni: 3,2,3
CALL create_submission_with_score('mdowsey@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 2, 6, 2, '2025-10-20');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 2, 7, 3, '2025-10-20');

-- Mikal: 3,1,4
CALL create_submission_with_score('mshaffer@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('mshaffer@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('mshaffer@icstars.org', 2, 2, 7, 4, '2025-10-20');

-- Nathan: 3,1,2
CALL create_submission_with_score('njimenez@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('njimenez@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('njimenez@icstars.org', 2, 2, 7, 2, '2025-10-20');

-- Penelope: 3,1,2
CALL create_submission_with_score('pdarling@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('pdarling@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('pdarling@icstars.org', 2, 2, 7, 2, '2025-10-20');

-- Rachel: 4,1,1
CALL create_submission_with_score('rmaynie@icstars.org', 2, 2, 5, 4, '2025-10-20');
CALL create_submission_with_score('rmaynie@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('rmaynie@icstars.org', 2, 2, 7, 1, '2025-10-20');

-- Sofia: 4,3,4
CALL create_submission_with_score('sgarcia@icstars.org', 2, 2, 5, 4, '2025-10-20');
CALL create_submission_with_score('sgarcia@icstars.org', 2, 2, 6, 3, '2025-10-20');
CALL create_submission_with_score('sgarcia@icstars.org', 2, 2, 7, 4, '2025-10-20');

-- Thomas: 3,3,4
CALL create_submission_with_score('trosas@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('trosas@icstars.org', 2, 2, 6, 3, '2025-10-20');
CALL create_submission_with_score('trosas@icstars.org', 2, 2, 7, 4, '2025-10-20');

-- Torell: 3,1,4
CALL create_submission_with_score('tpernell@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('tpernell@icstars.org', 2, 2, 6, 1, '2025-10-20');
CALL create_submission_with_score('tpernell@icstars.org', 2, 2, 7, 4, '2025-10-20');

-- Travion: 3,3,2
CALL create_submission_with_score('tashford@icstars.org', 2, 2, 5, 3, '2025-10-20');
CALL create_submission_with_score('tashford@icstars.org', 2, 2, 6, 3, '2025-10-20');
CALL create_submission_with_score('tashford@icstars.org', 2, 2, 7, 2, '2025-10-20');

-- ============================================================
-- Assessment C (assessment_id=3, tasks 9,10,11,12) - 4 tasks
-- Note: Dismissed interns don't have Assessment C scores
-- ============================================================

-- Bonny: 5,1,3,3
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 3, 9, 5, '2025-11-18');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 3, 11, 3, '2025-11-18');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 3, 12, 3, '2025-11-18');

-- Charlie: 3,1,4,4
CALL create_submission_with_score('cmejia@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('cmejia@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('cmejia@icstars.org', 2, 3, 11, 4, '2025-11-18');
CALL create_submission_with_score('cmejia@icstars.org', 2, 3, 12, 4, '2025-11-18');

-- Dahlia: 4,4,4,4
CALL create_submission_with_score('dnunn@icstars.org', 2, 3, 9, 4, '2025-11-18');
CALL create_submission_with_score('dnunn@icstars.org', 2, 3, 10, 4, '2025-11-18');
CALL create_submission_with_score('dnunn@icstars.org', 2, 3, 11, 4, '2025-11-18');
CALL create_submission_with_score('dnunn@icstars.org', 2, 3, 12, 4, '2025-11-18');

-- Maati: 1,1,2,2
CALL create_submission_with_score('mayoung@icstars.org', 2, 3, 9, 1, '2025-11-18');
CALL create_submission_with_score('mayoung@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('mayoung@icstars.org', 2, 3, 11, 2, '2025-11-18');
CALL create_submission_with_score('mayoung@icstars.org', 2, 3, 12, 2, '2025-11-18');

-- Maceo: 2,1,2,2
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 3, 9, 2, '2025-11-18');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 3, 11, 2, '2025-11-18');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 3, 12, 2, '2025-11-18');

-- Maya: 3,2,2,2
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 3, 10, 2, '2025-11-18');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 3, 11, 2, '2025-11-18');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 3, 12, 2, '2025-11-18');

-- Migoni: 3,2,3,3
CALL create_submission_with_score('mdowsey@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 3, 10, 2, '2025-11-18');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 3, 11, 3, '2025-11-18');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 3, 12, 3, '2025-11-18');

-- Mikal: 3,1,4,4
CALL create_submission_with_score('mshaffer@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('mshaffer@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('mshaffer@icstars.org', 2, 3, 11, 4, '2025-11-18');
CALL create_submission_with_score('mshaffer@icstars.org', 2, 3, 12, 4, '2025-11-18');

-- Nathan: 3,1,2,2
CALL create_submission_with_score('njimenez@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('njimenez@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('njimenez@icstars.org', 2, 3, 11, 2, '2025-11-18');
CALL create_submission_with_score('njimenez@icstars.org', 2, 3, 12, 2, '2025-11-18');

-- Penelope: 3,1,2,2
CALL create_submission_with_score('pdarling@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('pdarling@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('pdarling@icstars.org', 2, 3, 11, 2, '2025-11-18');
CALL create_submission_with_score('pdarling@icstars.org', 2, 3, 12, 2, '2025-11-18');

-- Rachel: 4,1,1,1
CALL create_submission_with_score('rmaynie@icstars.org', 2, 3, 9, 4, '2025-11-18');
CALL create_submission_with_score('rmaynie@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('rmaynie@icstars.org', 2, 3, 11, 1, '2025-11-18');
CALL create_submission_with_score('rmaynie@icstars.org', 2, 3, 12, 1, '2025-11-18');

-- Sofia: 4,3,4,4
CALL create_submission_with_score('sgarcia@icstars.org', 2, 3, 9, 4, '2025-11-18');
CALL create_submission_with_score('sgarcia@icstars.org', 2, 3, 10, 3, '2025-11-18');
CALL create_submission_with_score('sgarcia@icstars.org', 2, 3, 11, 4, '2025-11-18');
CALL create_submission_with_score('sgarcia@icstars.org', 2, 3, 12, 4, '2025-11-18');

-- Thomas: 3,3,4,4
CALL create_submission_with_score('trosas@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('trosas@icstars.org', 2, 3, 10, 3, '2025-11-18');
CALL create_submission_with_score('trosas@icstars.org', 2, 3, 11, 4, '2025-11-18');
CALL create_submission_with_score('trosas@icstars.org', 2, 3, 12, 4, '2025-11-18');

-- Torell: 3,1,4,4
CALL create_submission_with_score('tpernell@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('tpernell@icstars.org', 2, 3, 10, 1, '2025-11-18');
CALL create_submission_with_score('tpernell@icstars.org', 2, 3, 11, 4, '2025-11-18');
CALL create_submission_with_score('tpernell@icstars.org', 2, 3, 12, 4, '2025-11-18');

-- Travion: 3,3,2,2
CALL create_submission_with_score('tashford@icstars.org', 2, 3, 9, 3, '2025-11-18');
CALL create_submission_with_score('tashford@icstars.org', 2, 3, 10, 3, '2025-11-18');
CALL create_submission_with_score('tashford@icstars.org', 2, 3, 11, 2, '2025-11-18');
CALL create_submission_with_score('tashford@icstars.org', 2, 3, 12, 2, '2025-11-18');

-- ============================================================
-- Assessment D (assessment_id=4, tasks 13,14,15,16) - 4 tasks
-- Note: Resigned and dismissed interns don't have Assessment D scores
-- ============================================================

-- Bonny: 4,5,4,1
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 4, 13, 4, '2025-12-16');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 4, 14, 5, '2025-12-16');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 4, 15, 4, '2025-12-16');
CALL create_submission_with_score('bmakaniankhondo@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Charlie: 4,1,1,1
CALL create_submission_with_score('cmejia@icstars.org', 2, 4, 13, 4, '2025-12-16');
CALL create_submission_with_score('cmejia@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('cmejia@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('cmejia@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Dahlia: 4,5,4,1
CALL create_submission_with_score('dnunn@icstars.org', 2, 4, 13, 4, '2025-12-16');
CALL create_submission_with_score('dnunn@icstars.org', 2, 4, 14, 5, '2025-12-16');
CALL create_submission_with_score('dnunn@icstars.org', 2, 4, 15, 4, '2025-12-16');
CALL create_submission_with_score('dnunn@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Maati: 1,1,1,1
CALL create_submission_with_score('mayoung@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('mayoung@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('mayoung@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('mayoung@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Maceo: 1,1,4,1
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 4, 15, 4, '2025-12-16');
CALL create_submission_with_score('mmcbryde@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Maya: 1,1,1,1
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('mhuggins-jordan@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Migoni: 1,1,1,1
CALL create_submission_with_score('mdowsey@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('mdowsey@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Nathan: 1,1,1,1
CALL create_submission_with_score('njimenez@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('njimenez@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('njimenez@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('njimenez@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Penelope: 1,1,1,1
CALL create_submission_with_score('pdarling@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('pdarling@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('pdarling@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('pdarling@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Thomas: 1,1,1,1
CALL create_submission_with_score('trosas@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('trosas@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('trosas@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('trosas@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Torell: 1,1,1,1
CALL create_submission_with_score('tpernell@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('tpernell@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('tpernell@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('tpernell@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- Travion: 1,1,1,1
CALL create_submission_with_score('tashford@icstars.org', 2, 4, 13, 1, '2025-12-16');
CALL create_submission_with_score('tashford@icstars.org', 2, 4, 14, 1, '2025-12-16');
CALL create_submission_with_score('tashford@icstars.org', 2, 4, 15, 1, '2025-12-16');
CALL create_submission_with_score('tashford@icstars.org', 2, 4, 16, 1, '2025-12-16');

-- ============================================================
-- Helper procedure
-- ============================================================
DELIMITER $$

DROP PROCEDURE IF EXISTS create_submission_with_score$$

CREATE PROCEDURE create_submission_with_score(
    IN p_email VARCHAR(190),
    IN p_cohort_id INT,
    IN p_assessment_id INT,
    IN p_task_id INT,
    IN p_score INT,
    IN p_date VARCHAR(10)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_submission_id INT;
    
    -- Get user ID
    SELECT id INTO v_user_id FROM users WHERE email = p_email LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
        -- Create submission
        INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
        VALUES (v_user_id, p_cohort_id, p_assessment_id, p_task_id, 'submitted', 
                CONCAT(p_date, ' 09:00:00'), CONCAT(p_date, ' 10:30:00'));
        
        SET v_submission_id = LAST_INSERT_ID();
        
        -- Create score (scored_by=2 is the facilitator)
        INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at)
        VALUES (v_submission_id, p_score, 2, CONCAT(p_date, ' 15:00:00'));
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- Execution log
-- ============================================================
INSERT INTO `audit_logs` (`actor_user_id`, `action`, `entity`, `entity_id`, `metadata_json`) VALUES
(1, 'SEED_CYCLE58_COMPLETE', 'database', NULL, JSON_OBJECT('version', '1.0.0', 'timestamp', NOW(), 'interns', 18));

SELECT 'Cycle 58 data seed completed successfully!' AS status;
