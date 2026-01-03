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

    /**
     * POST /assessments
     */
    public function create() {
        $user = $this->auth->requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['code', 'title', 'duration_minutes'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO assessments (code, title, description, duration_minutes)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['code'],
                $input['title'],
                $input['description'] ?? null,
                $input['duration_minutes']
            ]);

            $id = $this->db->lastInsertId();
            $stmt = $this->db->prepare("SELECT * FROM assessments WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode($stmt->fetch());
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /assessments/:id
     */
    public function update($id) {
        $user = $this->auth->requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        try {
            $fields = [];
            $params = [];
            
            if (isset($input['code'])) {
                $fields[] = "code = ?";
                $params[] = $input['code'];
            }
            if (isset($input['title'])) {
                $fields[] = "title = ?";
                $params[] = $input['title'];
            }
            if (isset($input['description'])) {
                $fields[] = "description = ?";
                $params[] = $input['description'];
            }
            if (isset($input['duration_minutes'])) {
                $fields[] = "duration_minutes = ?";
                $params[] = $input['duration_minutes'];
            }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                return;
            }
            
            $params[] = $id;
            
            $stmt = $this->db->prepare("
                UPDATE assessments 
                SET " . implode(', ', $fields) . "
                WHERE id = ?
            ");
            $stmt->execute($params);
            
            $stmt = $this->db->prepare("SELECT * FROM assessments WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode($stmt->fetch());
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /assessments/:id
     */
    public function delete($id) {
        $user = $this->auth->requireRole(['admin']);
        
        try {
            // Check if assessment has submissions
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count FROM submissions WHERE assessment_id = ?
            ");
            $stmt->execute([$id]);
            $result = $stmt->fetch();
            
            if ($result['count'] > 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Cannot delete assessment with existing submissions']);
                return;
            }
            
            // Delete tasks first (FK constraint)
            $stmt = $this->db->prepare("DELETE FROM tasks WHERE assessment_id = ?");
            $stmt->execute([$id]);
            
            // Delete assessment windows
            $stmt = $this->db->prepare("DELETE FROM assessment_windows WHERE assessment_id = ?");
            $stmt->execute([$id]);
            
            // Delete assessment
            $stmt = $this->db->prepare("DELETE FROM assessments WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true, 'message' => 'Assessment deleted']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
