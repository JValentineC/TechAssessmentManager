<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class SnapshotController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    public function create() {
        $user = $this->auth->requireRole(['intern']);

        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No image uploaded']);
            return;
        }

        $assessmentId = $_POST['assessment_id'] ?? null;
        $cohortId = $user['current_cohort_id'];

        if (!$assessmentId || !$cohortId) {
            http_response_code(400);
            echo json_encode(['error' => 'assessment_id is required']);
            return;
        }

        try {
            $imagePath = $this->saveSnapshot($_FILES['image'], $user['id'], $assessmentId);

            $stmt = $this->db->prepare("
                INSERT INTO snapshots (user_id, cohort_id, assessment_id, image_path)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$user['id'], $cohortId, $assessmentId, $imagePath]);

            echo json_encode(['message' => 'Snapshot saved', 'path' => $imagePath]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function index() {
        $this->auth->requireRole(['admin', 'facilitator']);
        
        $cohortId = $_GET['cohort_id'] ?? null;
        $assessmentId = $_GET['assessment_id'] ?? null;

        try {
            $sql = "
                SELECT s.*, u.name as user_name, a.code as assessment_code
                FROM snapshots s
                JOIN users u ON s.user_id = u.id
                JOIN assessments a ON s.assessment_id = a.id
                WHERE 1=1
            ";
            $params = [];

            if ($cohortId) {
                $sql .= " AND s.cohort_id = ?";
                $params[] = $cohortId;
            }

            if ($assessmentId) {
                $sql .= " AND s.assessment_id = ?";
                $params[] = $assessmentId;
            }

            $sql .= " ORDER BY s.captured_at DESC LIMIT 100";

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $snapshots = $stmt->fetchAll();

            echo json_encode($snapshots);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    private function saveSnapshot($file, $userId, $assessmentId): string {
        $snapshotDir = __DIR__ . '/../' . ($_ENV['SNAPSHOT_DIR'] ?? 'snapshots');
        
        if (!is_dir($snapshotDir)) {
            mkdir($snapshotDir, 0755, true);
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error');
        }

        $filename = $userId . '_' . $assessmentId . '_' . time() . '.jpg';
        $destination = $snapshotDir . '/' . $filename;
        
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to save snapshot');
        }

        return $filename;
    }
}
