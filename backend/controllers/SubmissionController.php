<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class SubmissionController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    /**
     * POST /submissions/start
     * Check access control and start assessment
     */
    public function start() {
        $user = $this->auth->requireRole(['intern']);
        $input = json_decode(file_get_contents('php://input'), true);

        $assessmentId = $input['assessment_id'] ?? null;
        $cohortId = $input['cohort_id'] ?? $user['current_cohort_id'];

        if (!$assessmentId || !$cohortId) {
            http_response_code(400);
            echo json_encode(['error' => 'assessment_id and cohort_id are required']);
            return;
        }

        try {
            // Check access control
            $access = $this->checkAccess($user['id'], $assessmentId, $cohortId);
            
            if (!$access['allowed']) {
                http_response_code(403);
                echo json_encode(['error' => $access['reason']]);
                return;
            }

            // Get all tasks for this assessment
            $stmt = $this->db->prepare("
                SELECT id FROM tasks 
                WHERE assessment_id = ? 
                ORDER BY order_index
            ");
            $stmt->execute([$assessmentId]);
            $tasks = $stmt->fetchAll();

            if (empty($tasks)) {
                http_response_code(404);
                echo json_encode(['error' => 'No tasks found for this assessment']);
                return;
            }

            // Create submissions for all tasks
            $this->db->beginTransaction();
            
            $submissionIds = [];
            foreach ($tasks as $task) {
                $stmt = $this->db->prepare("
                    INSERT INTO submissions 
                    (user_id, cohort_id, assessment_id, task_id, status, started_at)
                    VALUES (?, ?, ?, ?, 'in_progress', NOW())
                ");
                $stmt->execute([$user['id'], $cohortId, $assessmentId, $task['id']]);
                $submissionIds[] = $this->db->lastInsertId();
            }

            $this->db->commit();

            echo json_encode([
                'message' => 'Assessment started',
                'submission_ids' => $submissionIds,
                'started_at' => date('Y-m-d H:i:s')
            ]);

        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * Check if user can access assessment
     */
    private function checkAccess($userId, $assessmentId, $cohortId): array {
        // Check cohort membership
        $stmt = $this->db->prepare("
            SELECT id FROM cohort_memberships 
            WHERE user_id = ? AND cohort_id = ? AND left_at IS NULL
        ");
        $stmt->execute([$userId, $cohortId]);
        if (!$stmt->fetch()) {
            return ['allowed' => false, 'reason' => 'Not enrolled in this cohort'];
        }

        // Check assessment window
        $stmt = $this->db->prepare("
            SELECT visible, opens_at, closes_at, locked 
            FROM assessment_windows 
            WHERE assessment_id = ? AND cohort_id = ?
        ");
        $stmt->execute([$assessmentId, $cohortId]);
        $window = $stmt->fetch();

        if (!$window) {
            return ['allowed' => false, 'reason' => 'Assessment not configured for this cohort'];
        }

        if (!$window['visible']) {
            return ['allowed' => false, 'reason' => 'Assessment is not visible'];
        }

        if ($window['locked']) {
            return ['allowed' => false, 'reason' => 'Assessment is locked by facilitator'];
        }

        $now = time();
        $opens = strtotime($window['opens_at']);
        $closes = strtotime($window['closes_at']);

        // Check access overrides
        $stmt = $this->db->prepare("
            SELECT override_type, starts_at, ends_at 
            FROM access_overrides 
            WHERE user_id = ? AND assessment_id = ? AND cohort_id = ?
            AND NOW() BETWEEN starts_at AND ends_at
            ORDER BY created_at DESC
            LIMIT 1
        ");
        $stmt->execute([$userId, $assessmentId, $cohortId]);
        $override = $stmt->fetch();

        if ($override) {
            if ($override['override_type'] === 'deny') {
                return ['allowed' => false, 'reason' => 'Access denied by override'];
            }
            if ($override['override_type'] === 'allow') {
                return ['allowed' => true, 'reason' => 'Allowed by override'];
            }
        }

        // Check normal window
        if ($now < $opens) {
            return ['allowed' => false, 'reason' => 'Assessment not yet open'];
        }

        if ($now > $closes) {
            return ['allowed' => false, 'reason' => 'Assessment window has closed'];
        }

        return ['allowed' => true, 'reason' => 'Access granted'];
    }

    /**
     * GET /submissions?cohort_id=X&assessment_id=Y&user_id=Z&status=W&from_date=...&to_date=...
     */
    public function index() {
        $user = $this->auth->requireAuth();
        
        // Parse query parameters
        $cohortId = $_GET['cohort_id'] ?? null;
        $assessmentId = $_GET['assessment_id'] ?? null;
        $userId = $_GET['user_id'] ?? null;
        $status = $_GET['status'] ?? null;
        $fromDate = $_GET['from_date'] ?? null;
        $toDate = $_GET['to_date'] ?? null;
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = min(100, max(10, intval($_GET['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;
        $sortBy = $_GET['sort_by'] ?? 'submitted_at';
        $sortDir = strtoupper($_GET['sort_dir'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';

        try {
            // Build WHERE clauses
            $where = ['1=1'];
            $params = [];

            if ($cohortId) {
                $where[] = "s.cohort_id = ?";
                $params[] = $cohortId;
            }

            if ($assessmentId) {
                $where[] = "s.assessment_id = ?";
                $params[] = $assessmentId;
            }

            if ($userId) {
                $where[] = "s.user_id = ?";
                $params[] = $userId;
            }

            if ($status) {
                $where[] = "s.status = ?";
                $params[] = $status;
            }

            if ($fromDate) {
                $where[] = "s.submitted_at >= ?";
                $params[] = $fromDate;
            }

            if ($toDate) {
                $where[] = "s.submitted_at <= ?";
                $params[] = $toDate;
            }

            // Interns can only see their own
            if ($user['role'] === 'intern') {
                $where[] = "s.user_id = ?";
                $params[] = $user['id'];
            }

            $whereClause = implode(' AND ', $where);

            // Validate sort column
            $allowedSortCols = ['submitted_at', 'started_at', 'status', 'user_name', 'assessment_code'];
            if (!in_array($sortBy, $allowedSortCols)) {
                $sortBy = 'submitted_at';
            }

            // Get total count
            $countStmt = $this->db->prepare("
                SELECT COUNT(*) as total
                FROM submissions s
                WHERE $whereClause
            ");
            $countStmt->execute($params);
            $total = $countStmt->fetch()['total'];

            // Get submissions
            $sql = "
                SELECT 
                    s.*,
                    u.name as user_name,
                    u.email as user_email,
                    a.code as assessment_code,
                    a.title as assessment_title,
                    t.title as task_title,
                    c.name as cohort_name,
                    sc.id as score_id,
                    sc.rubric_score,
                    sc.scored_by,
                    scorer.name as scorer_name
                FROM submissions s
                JOIN users u ON s.user_id = u.id
                JOIN assessments a ON s.assessment_id = a.id
                JOIN tasks t ON s.task_id = t.id
                JOIN cohorts c ON s.cohort_id = c.id
                LEFT JOIN scores sc ON s.id = sc.submission_id
                LEFT JOIN users scorer ON sc.scored_by = scorer.id
                WHERE $whereClause
                ORDER BY s.$sortBy $sortDir
                LIMIT ? OFFSET ?
            ";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([...$params, $limit, $offset]);
            $submissions = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $submissions,
                'pagination' => [
                    'total' => intval($total),
                    'page' => $page,
                    'limit' => $limit,
                    'pages' => ceil($total / $limit)
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /submissions/:id
     * Update submission (file upload, status, reflection)
     */
    public function update($id) {
        $user = $this->auth->requireAuth();

        try {
            // Get submission
            $stmt = $this->db->prepare("SELECT * FROM submissions WHERE id = ?");
            $stmt->execute([$id]);
            $submission = $stmt->fetch();

            if (!$submission) {
                http_response_code(404);
                echo json_encode(['error' => 'Submission not found']);
                return;
            }

            // Interns can only update their own
            if ($user['role'] === 'intern' && $submission['user_id'] != $user['id']) {
                http_response_code(403);
                echo json_encode(['error' => 'Forbidden']);
                return;
            }

            // Handle file upload
            if (isset($_FILES['file'])) {
                $filePath = $this->handleFileUpload($_FILES['file'], $user['id'], $submission['assessment_id']);
                
                $stmt = $this->db->prepare("
                    UPDATE submissions 
                    SET file_path = ?, status = 'submitted', submitted_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$filePath, $id]);
            } 
            // Handle JSON update
            else {
                $input = json_decode(file_get_contents('php://input'), true);
                
                $updates = [];
                $params = [];

                if (isset($input['status'])) {
                    $updates[] = "status = ?";
                    $params[] = $input['status'];
                    
                    if ($input['status'] === 'submitted') {
                        $updates[] = "submitted_at = NOW()";
                    }
                }

                if (isset($input['reflection_notes'])) {
                    $updates[] = "reflection_notes = ?";
                    $params[] = $input['reflection_notes'];
                }

                if (!empty($updates)) {
                    $params[] = $id;
                    $sql = "UPDATE submissions SET " . implode(', ', $updates) . " WHERE id = ?";
                    $stmt = $this->db->prepare($sql);
                    $stmt->execute($params);
                }
            }

            $stmt = $this->db->prepare("SELECT * FROM submissions WHERE id = ?");
            $stmt->execute([$id]);
            $updated = $stmt->fetch();

            echo json_encode($updated);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /submissions/:id/timeout
     */
    public function timeout($id) {
        $user = $this->auth->requireAuth();

        try {
            $stmt = $this->db->prepare("SELECT * FROM submissions WHERE id = ?");
            $stmt->execute([$id]);
            $submission = $stmt->fetch();

            if (!$submission) {
                http_response_code(404);
                echo json_encode(['error' => 'Submission not found']);
                return;
            }

            if ($user['role'] === 'intern' && $submission['user_id'] != $user['id']) {
                http_response_code(403);
                echo json_encode(['error' => 'Forbidden']);
                return;
            }

            $stmt = $this->db->prepare("
                UPDATE submissions 
                SET status = 'timed_out', submitted_at = NOW()
                WHERE id = ? AND status = 'in_progress'
            ");
            $stmt->execute([$id]);

            echo json_encode(['message' => 'Submission timed out']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * Handle file upload with validation
     */
    private function handleFileUpload($file, $userId, $assessmentId): string {
        $uploadDir = __DIR__ . '/../' . ($_ENV['UPLOAD_DIR'] ?? 'uploads');
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $maxSize = $_ENV['MAX_FILE_SIZE'] ?? 10485760; // 10MB
        $allowedTypes = ['txt', 'sql', 'md', 'pdf', 'png', 'jpg', 'jpeg'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error');
        }

        if ($file['size'] > $maxSize) {
            throw new Exception('File too large');
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedTypes)) {
            throw new Exception('Invalid file type');
        }

        // Sanitize filename
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
        $filename = $userId . '_' . $assessmentId . '_' . time() . '_' . $filename . '.' . $ext;
        
        $destination = $uploadDir . '/' . $filename;
        
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to move uploaded file');
        }

        return $filename;
    }
}
