<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class WindowController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    /**
     * GET /assessment_windows?cohort_id=X
     */
    public function index() {
        $this->auth->requireAuth();
        
        $cohortId = $_GET['cohort_id'] ?? null;
        
        if (!$cohortId) {
            http_response_code(400);
            echo json_encode(['error' => 'cohort_id is required']);
            return;
        }

        try {
            $stmt = $this->db->prepare("
                SELECT aw.*, a.code, a.title, a.duration_minutes
                FROM assessment_windows aw
                JOIN assessments a ON aw.assessment_id = a.id
                WHERE aw.cohort_id = ?
                ORDER BY a.code
            ");
            $stmt->execute([$cohortId]);
            $windows = $stmt->fetchAll();

            echo json_encode($windows);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /assessment_windows
     */
    public function create() {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['assessment_id', 'cohort_id', 'opens_at', 'closes_at'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO assessment_windows 
                (assessment_id, cohort_id, visible, opens_at, closes_at, locked, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['assessment_id'],
                $input['cohort_id'],
                $input['visible'] ?? 0,
                $input['opens_at'],
                $input['closes_at'],
                $input['locked'] ?? 0,
                $input['notes'] ?? null
            ]);

            $windowId = $this->db->lastInsertId();
            
            $this->logAudit($user['id'], 'CREATE_WINDOW', 'assessment_windows', $windowId, $input);

            $stmt = $this->db->prepare("SELECT * FROM assessment_windows WHERE id = ?");
            $stmt->execute([$windowId]);
            $window = $stmt->fetch();

            echo json_encode($window);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /assessment_windows/:id/visibility
     */
    public function updateVisibility($id) {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['visible'])) {
            http_response_code(400);
            echo json_encode(['error' => 'visible field is required']);
            return;
        }

        try {
            $stmt = $this->db->prepare("
                UPDATE assessment_windows 
                SET visible = ? 
                WHERE id = ?
            ");
            $stmt->execute([$input['visible'] ? 1 : 0, $id]);

            $this->logAudit($user['id'], 'SET_VISIBLE', 'assessment_windows', $id, ['visible' => $input['visible']]);

            $stmt = $this->db->prepare("SELECT * FROM assessment_windows WHERE id = ?");
            $stmt->execute([$id]);
            $window = $stmt->fetch();

            echo json_encode($window);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /assessment_windows/:id/schedule
     */
    public function updateSchedule($id) {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['opens_at', 'closes_at'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        try {
            $stmt = $this->db->prepare("
                UPDATE assessment_windows 
                SET opens_at = ?, closes_at = ?
                WHERE id = ?
            ");
            $stmt->execute([$input['opens_at'], $input['closes_at'], $id]);

            $this->logAudit($user['id'], 'UPDATE_SCHEDULE', 'assessment_windows', $id, $input);

            $stmt = $this->db->prepare("SELECT * FROM assessment_windows WHERE id = ?");
            $stmt->execute([$id]);
            $window = $stmt->fetch();

            echo json_encode($window);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /assessment_windows/:id/lock
     */
    public function updateLock($id) {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['locked'])) {
            http_response_code(400);
            echo json_encode(['error' => 'locked field is required']);
            return;
        }

        try {
            $stmt = $this->db->prepare("
                UPDATE assessment_windows 
                SET locked = ? 
                WHERE id = ?
            ");
            $stmt->execute([$input['locked'] ? 1 : 0, $id]);

            $this->logAudit($user['id'], 'LOCK_ASSESSMENT', 'assessment_windows', $id, ['locked' => $input['locked']]);

            $stmt = $this->db->prepare("SELECT * FROM assessment_windows WHERE id = ?");
            $stmt->execute([$id]);
            $window = $stmt->fetch();

            echo json_encode($window);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    private function logAudit($userId, $action, $entity, $entityId, $metadata = null) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $userId,
                $action,
                $entity,
                $entityId,
                $metadata ? json_encode($metadata) : null,
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);
        } catch (Exception $e) {
            error_log("Audit log failed: " . $e->getMessage());
        }
    }
}
