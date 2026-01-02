<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class OverrideController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    public function index() {
        $this->auth->requireRole(['admin', 'facilitator']);
        
        $cohortId = $_GET['cohort_id'] ?? null;
        $assessmentId = $_GET['assessment_id'] ?? null;

        try {
            $sql = "
                SELECT ao.*, u.name as user_name, u.email as user_email, a.code as assessment_code
                FROM access_overrides ao
                JOIN users u ON ao.user_id = u.id
                JOIN assessments a ON ao.assessment_id = a.id
                WHERE 1=1
            ";
            $params = [];

            if ($cohortId) {
                $sql .= " AND ao.cohort_id = ?";
                $params[] = $cohortId;
            }

            if ($assessmentId) {
                $sql .= " AND ao.assessment_id = ?";
                $params[] = $assessmentId;
            }

            $sql .= " ORDER BY ao.created_at DESC";

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $overrides = $stmt->fetchAll();

            echo json_encode($overrides);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function create() {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['user_id', 'assessment_id', 'cohort_id', 'override_type', 'starts_at', 'ends_at'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO access_overrides 
                (user_id, assessment_id, cohort_id, override_type, starts_at, ends_at, reason, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['user_id'],
                $input['assessment_id'],
                $input['cohort_id'],
                $input['override_type'],
                $input['starts_at'],
                $input['ends_at'],
                $input['reason'] ?? null,
                $user['id']
            ]);

            $overrideId = $this->db->lastInsertId();
            
            $stmt = $this->db->prepare("SELECT * FROM access_overrides WHERE id = ?");
            $stmt->execute([$overrideId]);
            $override = $stmt->fetch();

            echo json_encode($override);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function delete($id) {
        $this->auth->requireRole(['admin', 'facilitator']);

        try {
            $stmt = $this->db->prepare("DELETE FROM access_overrides WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['message' => 'Override deleted']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
