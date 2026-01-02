<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class AssessmentController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    /**
     * GET /assessments
     */
    public function index() {
        $this->auth->requireAuth();

        try {
            $stmt = $this->db->query("
                SELECT * FROM assessments 
                ORDER BY code
            ");
            $assessments = $stmt->fetchAll();

            echo json_encode($assessments);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * GET /assessments/available?cohort_id=X
     * Get available assessments for intern based on visibility and access control
     */
    public function available() {
        $user = $this->auth->requireRole(['intern']);
        $cohortId = $_GET['cohort_id'] ?? $user['current_cohort_id'];

        if (!$cohortId) {
            http_response_code(400);
            echo json_encode(['error' => 'cohort_id is required']);
            return;
        }

        try {
            // Get all assessments with their windows for this cohort
            $stmt = $this->db->prepare("
                SELECT 
                    a.*,
                    aw.id as window_id,
                    aw.visible,
                    aw.opens_at,
                    aw.closes_at,
                    aw.locked,
                    aw.notes
                FROM assessments a
                LEFT JOIN assessment_windows aw ON a.id = aw.assessment_id AND aw.cohort_id = ?
                WHERE aw.visible = 1
                ORDER BY a.code
            ");
            $stmt->execute([$cohortId]);
            $assessments = $stmt->fetchAll();

            // Format for frontend
            $result = [];
            foreach ($assessments as $assessment) {
                $result[] = [
                    'id' => $assessment['id'],
                    'code' => $assessment['code'],
                    'title' => $assessment['title'],
                    'description' => $assessment['description'],
                    'duration_minutes' => $assessment['duration_minutes'],
                    'window' => [
                        'id' => $assessment['window_id'],
                        'visible' => (bool)$assessment['visible'],
                        'opens_at' => $assessment['opens_at'],
                        'closes_at' => $assessment['closes_at'],
                        'locked' => (bool)$assessment['locked'],
                        'notes' => $assessment['notes']
                    ]
                ];
            }

            echo json_encode($result);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
