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
     * GET /submissions/:id
     * Get single submission with full details for scoring
     */
    public function show($id) {
        $user = $this->auth->requireAuth();

        try {
            $sql = "
                SELECT 
                    s.*,
                    u.id as user_id,
                    u.name as user_name,
                    u.email as user_email,
                    a.code as assessment_code,
                    a.title as assessment_title,
                    a.description as assessment_description,
                    a.duration_minutes,
                    t.id as task_id,
                    t.title as task_title,
                    t.instructions as task_instructions,
                    t.max_points,
                    t.max_points as task_max_points,
                    t.task_type,
                    c.name as cohort_name,
                    sc.id as score_id,
                    sc.rubric_score,
                    sc.comments as score_comments,
                    sc.scored_by,
                    sc.scored_at,
                    scorer.name as scorer_name
                FROM submissions s
                JOIN users u ON s.user_id = u.id
                JOIN assessments a ON s.assessment_id = a.id
                JOIN tasks t ON s.task_id = t.id
                JOIN cohorts c ON s.cohort_id = c.id
                LEFT JOIN scores sc ON s.id = sc.submission_id
                LEFT JOIN users scorer ON sc.scored_by = scorer.id
                WHERE s.id = ?
            ";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
            $submission = $stmt->fetch();

            if (!$submission) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Submission not found']);
                return;
            }

            // Interns can only view their own
            if ($user['role'] === 'intern' && $submission['user_id'] != $user['id']) {
                http_response_code(403);
                echo json_encode(['success' => false, 'error' => 'Forbidden']);
                return;
            }

            // Get snapshots for this submission
            $stmt = $this->db->prepare("
                SELECT id, image_path, captured_at
                FROM snapshots
                WHERE user_id = ? AND assessment_id = ? AND cohort_id = ?
                ORDER BY captured_at DESC
                LIMIT 10
            ");
            $stmt->execute([$submission['user_id'], $submission['assessment_id'], $submission['cohort_id']]);
            $submission['snapshots'] = $stmt->fetchAll();

            echo json_encode(['success' => true, 'data' => $submission]);
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
        
        error_log("🔧 UPDATE submission $id - Request method: " . $_SERVER['REQUEST_METHOD']);
        error_log("🔧 Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));

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

            // For PATCH requests, PHP doesn't populate $_FILES automatically
            // We need to parse multipart/form-data manually
            $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
            
            if (stripos($contentType, 'multipart/form-data') !== false) {
                error_log("📦 Parsing multipart/form-data for PATCH request");
                
                // Parse the multipart data
                $_POST = [];
                $_FILES = [];
                
                $rawInput = file_get_contents('php://input');
                preg_match('/boundary=(.*)$/', $contentType, $matches);
                $boundary = $matches[1] ?? null;
                
                if ($boundary) {
                    $parts = array_slice(explode('--' . $boundary, $rawInput), 1);
                    
                    foreach ($parts as $part) {
                        if ($part == "--\r\n") continue;
                        if (empty(trim($part))) continue;
                        
                        list($rawHeaders, $body) = explode("\r\n\r\n", $part, 2);
                        $body = substr($body, 0, -2); // Remove trailing \r\n
                        
                        // Parse headers
                        $headers = [];
                        foreach (explode("\r\n", $rawHeaders) as $header) {
                            if (strpos($header, ':') !== false) {
                                list($name, $value) = explode(':', $header, 2);
                                $headers[strtolower(trim($name))] = trim($value);
                            }
                        }
                        
                        // Parse Content-Disposition
                        if (isset($headers['content-disposition'])) {
                            preg_match('/name="([^"]+)"/', $headers['content-disposition'], $nameMatch);
                            $fieldName = $nameMatch[1] ?? null;
                            
                            if (preg_match('/filename="([^"]+)"/', $headers['content-disposition'], $fileMatch)) {
                                // This is a file upload
                                $filename = $fileMatch[1];
                                $tmpPath = tempnam(sys_get_temp_dir(), 'upload_');
                                file_put_contents($tmpPath, $body);
                                
                                $_FILES[$fieldName] = [
                                    'name' => $filename,
                                    'type' => $headers['content-type'] ?? 'application/octet-stream',
                                    'tmp_name' => $tmpPath,
                                    'error' => UPLOAD_ERR_OK,
                                    'size' => strlen($body)
                                ];
                                error_log("✅ Parsed file: $filename (". strlen($body) . " bytes)");
                            } else {
                                // Regular form field
                                $_POST[$fieldName] = $body;
                            }
                        }
                    }
                }
                
                try {
                    error_log("📦 Parsed $_FILES: " . print_r($_FILES, true));
                    error_log("📦 Parsed $_POST: " . print_r($_POST, true));
                } catch (Exception $e) {
                    error_log("❌ Error logging parsed data: " . $e->getMessage());
                }
            }

            // Handle file upload
            if (isset($_FILES['file'])) {
                error_log("📁 Processing file upload for submission $id");
                error_log("📄 File info: " . print_r($_FILES['file'], true));
                
                $filePath = $this->handleFileUpload($_FILES['file'], $user['id'], $submission['assessment_id']);
                error_log("✓ File saved: $filePath");
                
                $stmt = $this->db->prepare("
                    UPDATE submissions 
                    SET file_path = ?, status = 'submitted', submitted_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$filePath, $id]);
                error_log("✓ Submission $id updated: status='submitted', file_path='$filePath'");
            } 
            // Handle text submission from POST data (multipart with text field)
            elseif (isset($_POST['submission_text']) && !empty($_POST['submission_text'])) {
                error_log("📝 Processing text submission for submission $id");
                $submissionText = $_POST['submission_text'];
                
                $stmt = $this->db->prepare("
                    UPDATE submissions 
                    SET submission_text = ?, status = 'submitted', submitted_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$submissionText, $id]);
                error_log("✓ Submission $id updated: status='submitted', text saved");
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

                if (isset($input['submission_text'])) {
                    $updates[] = "submission_text = ?";
                    $params[] = $input['submission_text'];
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
            
            error_log("📤 Returning updated submission: " . json_encode(['id' => $updated['id'], 'status' => $updated['status'], 'file_path' => $updated['file_path']]));

            echo json_encode($updated);
        } catch (Exception $e) {
            error_log("❌ ERROR in update submission $id: " . $e->getMessage());
            error_log("❌ File: " . $e->getFile() . " Line: " . $e->getLine());
            error_log("❌ Trace: " . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /submissions/:id/timeout
     * Server-side enforcement of timer expiration - locks attempt and finalizes submission
     */
    public function timeout($id) {
        $user = $this->auth->requireAuth();

        try {
            $this->db->beginTransaction();

            // Get submission with lock
            $stmt = $this->db->prepare("
                SELECT s.*, a.duration_minutes, a.title as assessment_title
                FROM submissions s
                JOIN assessments a ON s.assessment_id = a.id
                WHERE s.id = ?
                FOR UPDATE
            ");
            $stmt->execute([$id]);
            $submission = $stmt->fetch();

            if (!$submission) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Submission not found']);
                return;
            }

            // Verify ownership
            if ($user['role'] === 'intern' && $submission['user_id'] != $user['id']) {
                http_response_code(403);
                echo json_encode(['success' => false, 'error' => 'Forbidden']);
                return;
            }

            // Only timeout if still in progress
            if ($submission['status'] !== 'in_progress') {
                echo json_encode([
                    'success' => false, 
                    'error' => 'Submission already finalized',
                    'status' => $submission['status']
                ]);
                return;
            }

            // Verify timeout is legitimate (server-side validation)
            $startTime = strtotime($submission['started_at']);
            $allowedDuration = ($submission['duration_minutes'] * 60) + 30; // 30 second grace period
            $elapsed = time() - $startTime;

            if ($elapsed < ($submission['duration_minutes'] * 60)) {
                // Too early - still within normal time
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Timer has not expired yet',
                    'elapsed' => $elapsed,
                    'required' => $submission['duration_minutes'] * 60
                ]);
                return;
            }

            // Finalize as timed_out
            $stmt = $this->db->prepare("
                UPDATE submissions 
                SET status = 'timed_out', submitted_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$id]);

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $user['id'],
                'auto_submit_timeout',
                'submissions',
                $id,
                json_encode([
                    'assessment' => $submission['assessment_title'],
                    'elapsed_minutes' => round($elapsed / 60, 2),
                    'duration_minutes' => $submission['duration_minutes']
                ]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();

            // Return updated submission
            $stmt = $this->db->prepare("
                SELECT s.*, u.name as user_name, a.title as assessment_title
                FROM submissions s
                JOIN users u ON s.user_id = u.id
                JOIN assessments a ON s.assessment_id = a.id
                WHERE s.id = ?
            ");
            $stmt->execute([$id]);
            $updated = $stmt->fetch();

            echo json_encode([
                'success' => true,
                'message' => 'Submission auto-submitted due to timeout',
                'data' => $updated
            ]);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Handle file upload with validation
     */
    private function handleFileUpload($file, $userId, $assessmentId): string {
        error_log("🔍 handleFileUpload called with:");
        error_log("  file array: " . print_r($file, true));
        error_log("  file['name']: " . (isset($file['name']) ? (is_array($file['name']) ? 'ARRAY!' : $file['name']) : 'NOT SET'));
        
        // Get upload directory - check if it's an absolute path
        $uploadPath = $_ENV['UPLOAD_DIR'] ?? 'uploads';
        $uploadDir = (substr($uploadPath, 0, 1) === '/' || substr($uploadPath, 1, 1) === ':') 
            ? $uploadPath  // Absolute path (Unix or Windows)
            : __DIR__ . '/../' . $uploadPath;  // Relative path
        
        error_log("  Upload dir: $uploadDir");
        
        if (!is_dir($uploadDir)) {
            error_log("  Directory doesn't exist, creating: $uploadDir");
            mkdir($uploadDir, 0755, true);
        }

        $maxSize = $_ENV['MAX_FILE_SIZE'] ?? 10485760; // 10MB
        $allowedTypes = ['txt', 'sql', 'md', 'pdf', 'png', 'jpg', 'jpeg', 'zip', 'doc', 'docx'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error');
        }

        if ($file['size'] > $maxSize) {
            throw new Exception('File too large');
        }

        error_log("  About to get extension from: " . $file['name']);
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedTypes)) {
            throw new Exception('Invalid file type');
        }

        // Sanitize filename
        error_log("  About to get filename from: " . $file['name']);
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
        $filename = $userId . '_' . $assessmentId . '_' . time() . '_' . $filename . '.' . $ext;
        
        $destination = $uploadDir . '/' . $filename;
        
        error_log("  Source: " . $file['tmp_name']);
        error_log("  Destination: " . $destination);
        
        // Use copy() + unlink() instead of rename() for cross-filesystem compatibility
        // and to work with manually parsed multipart data
        if (!copy($file['tmp_name'], $destination)) {
            throw new Exception('Failed to copy uploaded file');
        }
        
        // Delete the temp file after successful copy
        @unlink($file['tmp_name']);

        return $filename;
    }
    
    public function downloadFile($filename) {
        // Require authentication
        $user = $this->auth->requireAuth();
        
        // Get upload directory path
        $uploadPath = $_ENV['UPLOAD_DIR'] ?? 'uploads';
        $uploadDir = (substr($uploadPath, 0, 1) === '/' || substr($uploadPath, 1, 1) === ':') 
            ? $uploadPath 
            : __DIR__ . '/../' . $uploadPath;
        
        $filePath = $uploadDir . '/' . $filename;
        
        // Security: Prevent directory traversal
        $realPath = realpath($filePath);
        $realUploadDir = realpath($uploadDir);
        
        if (!$realPath || !$realUploadDir || strpos($realPath, $realUploadDir) !== 0) {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }
        
        if (!file_exists($filePath)) {
            http_response_code(404);
            echo json_encode(['error' => 'File not found']);
            return;
        }
        
        // Get file info
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $filePath);
        finfo_close($finfo);
        
        // Send file
        header('Content-Type: ' . $mimeType);
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: no-cache');
        
        readfile($filePath);
        exit;
    }
}
