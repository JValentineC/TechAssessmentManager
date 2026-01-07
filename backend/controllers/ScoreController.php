<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ScoreController
{
    private $db;
    private $auth;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    public function create()
    {
        $currentUser = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['submission_id', 'rubric_score'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "$field is required"]);
                return;
            }
        }

        if ($input['rubric_score'] < 1 || $input['rubric_score'] > 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Score must be between 1 and 5']);
            return;
        }

        try {
            $this->db->beginTransaction();

            // Check if submission exists and is scoreable
            $stmt = $this->db->prepare("
                SELECT id, status FROM submissions WHERE id = ?
            ");
            $stmt->execute([$input['submission_id']]);
            $submission = $stmt->fetch();

            if (!$submission) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Submission not found']);
                return;
            }

            if ($submission['status'] === 'in_progress') {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Cannot score in-progress submission']);
                return;
            }

            // Save or update score
            $stmt = $this->db->prepare("
                INSERT INTO scores (submission_id, rubric_score, comments, scored_by)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    rubric_score = VALUES(rubric_score),
                    comments = VALUES(comments),
                    scored_by = VALUES(scored_by),
                    scored_at = NOW()
            ");
            $stmt->execute([
                $input['submission_id'],
                $input['rubric_score'],
                $input['comments'] ?? null,
                $currentUser['id']
            ]);

            $scoreId = $this->db->lastInsertId() ?: $this->db->prepare("SELECT id FROM scores WHERE submission_id = ?")->execute([$input['submission_id']]);

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $currentUser['id'],
                'score_submission',
                'scores',
                $input['submission_id'],
                json_encode(['rubric_score' => $input['rubric_score'], 'has_comments' => !empty($input['comments'])]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();

            // Return updated score
            $stmt = $this->db->prepare("
                SELECT sc.*, u.name as scorer_name
                FROM scores sc
                JOIN users u ON sc.scored_by = u.id
                WHERE sc.submission_id = ?
            ");
            $stmt->execute([$input['submission_id']]);
            $score = $stmt->fetch();

            echo json_encode(['success' => true, 'data' => $score]);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function summary()
    {
        $this->auth->requireRole(['admin', 'facilitator']);
        $cohortId = $_GET['cohort_id'] ?? null;

        if (!$cohortId) {
            http_response_code(400);
            echo json_encode(['error' => 'cohort_id is required']);
            return;
        }

        try {
            // Get total interns
            $stmt = $this->db->prepare("
                SELECT COUNT(DISTINCT u.id) as total
                FROM users u
                JOIN cohort_memberships cm ON u.id = cm.user_id
                WHERE cm.cohort_id = ? AND cm.left_at IS NULL AND u.role = 'intern' AND u.deleted_at IS NULL
            ");
            $stmt->execute([$cohortId]);
            $totalInterns = $stmt->fetch()['total'];

            // Get average proficiency
            $stmt = $this->db->prepare("
                SELECT AVG(sc.rubric_score) * 20 as avg_proficiency
                FROM scores sc
                JOIN submissions sub ON sc.submission_id = sub.id
                WHERE sub.cohort_id = ?
            ");
            $stmt->execute([$cohortId]);
            $avgProficiency = $stmt->fetch()['avg_proficiency'] ?? 0;

            echo json_encode([
                'total_interns' => $totalInterns,
                'average_proficiency' => round($avgProficiency, 2)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function reports()
    {
        $this->auth->requireRole(['admin', 'facilitator']);
        $cohortId = $_GET['cohort_id'] ?? null;

        if (!$cohortId) {
            http_response_code(400);
            echo json_encode(['error' => 'cohort_id is required']);
            return;
        }

        try {
            // Get all interns in the cohort
            $stmt = $this->db->prepare("
                SELECT DISTINCT u.id, u.name, u.enrollment_status
                FROM users u
                JOIN cohort_memberships cm ON u.id = cm.user_id
                WHERE cm.cohort_id = ? AND u.role = 'intern' AND u.deleted_at IS NULL
                ORDER BY u.name
            ");
            $stmt->execute([$cohortId]);
            $interns = $stmt->fetchAll();

            // Get all assessments
            $stmt = $this->db->prepare("
                SELECT DISTINCT a.id, a.code, a.title
                FROM assessments a
                JOIN assessment_windows aw ON a.id = aw.assessment_id
                WHERE aw.cohort_id = ?
                ORDER BY a.code
            ");
            $stmt->execute([$cohortId]);
            $assessments = $stmt->fetchAll();

            // Build comprehensive report data
            $reportData = [
                'cohort_id' => $cohortId,
                'assessments' => [],
                'summary' => []
            ];

            // For each assessment, get tasks and scores
            foreach ($assessments as $assessment) {
                $assessmentData = [
                    'id' => $assessment['id'],
                    'code' => $assessment['code'],
                    'title' => $assessment['title'],
                    'tasks' => [],
                    'intern_scores' => [],
                    'task_averages' => [],
                    'overall_average' => 0
                ];

                // Get tasks for this assessment
                $stmt = $this->db->prepare("
                    SELECT id, title, order_index
                    FROM tasks
                    WHERE assessment_id = ?
                    ORDER BY order_index
                ");
                $stmt->execute([$assessment['id']]);
                $tasks = $stmt->fetchAll();
                $assessmentData['tasks'] = $tasks;

                $taskScoreSums = [];
                $taskScoreCounts = [];

                // For each intern, get their scores
                foreach ($interns as $intern) {
                    $internScores = [
                        'intern_id' => $intern['id'],
                        'intern_name' => $intern['name'],
                        'enrollment_status' => $intern['enrollment_status'] ?? 'active',
                        'task_scores' => [],
                        'average' => null
                    ];

                    $scores = [];
                    foreach ($tasks as $task) {
                        // Get score for this intern/task combination
                        $stmt = $this->db->prepare("
                            SELECT sc.rubric_score
                            FROM scores sc
                            JOIN submissions sub ON sc.submission_id = sub.id
                            WHERE sub.user_id = ? 
                              AND sub.cohort_id = ?
                              AND sub.assessment_id = ? 
                              AND sub.task_id = ?
                            LIMIT 1
                        ");
                        $stmt->execute([$intern['id'], $cohortId, $assessment['id'], $task['id']]);
                        $scoreRow = $stmt->fetch();

                        $score = $scoreRow ? (int)$scoreRow['rubric_score'] : null;
                        $internScores['task_scores'][] = $score;

                        if ($score !== null) {
                            $scores[] = $score;
                            if (!isset($taskScoreSums[$task['id']])) {
                                $taskScoreSums[$task['id']] = 0;
                                $taskScoreCounts[$task['id']] = 0;
                            }
                            $taskScoreSums[$task['id']] += $score;
                            $taskScoreCounts[$task['id']]++;
                        }
                    }

                    // Calculate intern's average for this assessment
                    if (count($scores) > 0) {
                        $internScores['average'] = round(array_sum($scores) / count($scores), 1);
                    }

                    $assessmentData['intern_scores'][] = $internScores;
                }

                // Calculate task averages
                foreach ($tasks as $task) {
                    if (isset($taskScoreCounts[$task['id']]) && $taskScoreCounts[$task['id']] > 0) {
                        $assessmentData['task_averages'][] = round($taskScoreSums[$task['id']] / $taskScoreCounts[$task['id']], 1);
                    } else {
                        $assessmentData['task_averages'][] = null;
                    }
                }

                // Calculate overall assessment average
                $allScores = [];
                foreach ($assessmentData['intern_scores'] as $internScore) {
                    foreach ($internScore['task_scores'] as $score) {
                        if ($score !== null) {
                            $allScores[] = $score;
                        }
                    }
                }
                if (count($allScores) > 0) {
                    $assessmentData['overall_average'] = round(array_sum($allScores) / count($allScores), 1);
                }

                $reportData['assessments'][] = $assessmentData;
            }

            // Build summary data (all-assessment average per intern)
            foreach ($interns as $intern) {
                $allInternScores = [];

                foreach ($reportData['assessments'] as $assessmentData) {
                    foreach ($assessmentData['intern_scores'] as $internScore) {
                        if ($internScore['intern_id'] == $intern['id']) {
                            foreach ($internScore['task_scores'] as $score) {
                                if ($score !== null) {
                                    $allInternScores[] = $score;
                                }
                            }
                            break;
                        }
                    }
                }

                $summaryEntry = [
                    'intern_id' => $intern['id'],
                    'intern_name' => $intern['name'],
                    'enrollment_status' => $intern['enrollment_status'] ?? 'active',
                    'overall_average' => null
                ];

                if (count($allInternScores) > 0) {
                    $summaryEntry['overall_average'] = round(array_sum($allInternScores) / count($allInternScores), 1);
                }

                $reportData['summary'][] = $summaryEntry;
            }

            // Calculate grand average
            $allScores = [];
            foreach ($reportData['assessments'] as $assessmentData) {
                foreach ($assessmentData['intern_scores'] as $internScore) {
                    foreach ($internScore['task_scores'] as $score) {
                        if ($score !== null) {
                            $allScores[] = $score;
                        }
                    }
                }
            }
            $reportData['grand_average'] = count($allScores) > 0 ? round(array_sum($allScores) / count($allScores), 1) : null;

            echo json_encode($reportData);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
