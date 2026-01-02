<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ScoreController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    public function create() {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['submission_id', 'rubric_score'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        if ($input['rubric_score'] < 1 || $input['rubric_score'] > 5) {
            http_response_code(400);
            echo json_encode(['error' => 'Score must be between 1 and 5']);
            return;
        }

        try {
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
                $user['id']
            ]);

            $scoreId = $this->db->lastInsertId();
            
            $stmt = $this->db->prepare("SELECT * FROM scores WHERE submission_id = ?");
            $stmt->execute([$input['submission_id']]);
            $score = $stmt->fetch();

            echo json_encode($score);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function summary() {
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
                WHERE cm.cohort_id = ? AND cm.left_at IS NULL AND u.role = 'intern'
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
}
