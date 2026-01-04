<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class RubricController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    /**
     * GET /rubrics?assessment_id=X or /rubrics?task_id=X
     * Get rubrics for an assessment or specific task
     */
    public function index() {
        $this->auth->requireAuth();
        
        $assessmentId = $_GET['assessment_id'] ?? null;
        $taskId = $_GET['task_id'] ?? null;
        
        if (!$assessmentId && !$taskId) {
            http_response_code(400);
            echo json_encode(['error' => 'Either assessment_id or task_id is required']);
            return;
        }

        try {
            if ($taskId) {
                // Get rubric for specific task first, then fallback to assessment-level rubric
                $stmt = $this->db->prepare("
                    SELECT r.*, u.name as creator_name
                    FROM rubrics r
                    LEFT JOIN users u ON r.created_by = u.id
                    WHERE r.task_id = ?
                    ORDER BY r.created_at DESC
                    LIMIT 1
                ");
                $stmt->execute([$taskId]);
                $rubric = $stmt->fetch();
                
                // If no task-specific rubric, get assessment-level rubric
                if (!$rubric) {
                    $stmt = $this->db->prepare("
                        SELECT r.*, u.name as creator_name
                        FROM rubrics r
                        LEFT JOIN users u ON r.created_by = u.id
                        INNER JOIN tasks t ON r.assessment_id = t.assessment_id
                        WHERE t.id = ? AND r.task_id IS NULL
                        ORDER BY r.created_at DESC
                        LIMIT 1
                    ");
                    $stmt->execute([$taskId]);
                    $rubric = $stmt->fetch();
                }
                
                echo json_encode($rubric ?: null);
            } else {
                // Get all rubrics for an assessment (assessment-level + task-specific)
                $stmt = $this->db->prepare("
                    SELECT r.*, u.name as creator_name
                    FROM rubrics r
                    LEFT JOIN users u ON r.created_by = u.id
                    LEFT JOIN tasks t ON r.task_id = t.id
                    WHERE r.assessment_id = ? OR t.assessment_id = ?
                    ORDER BY CASE WHEN r.task_id IS NULL THEN 0 ELSE 1 END, r.created_at DESC
                ");
                $stmt->execute([$assessmentId, $assessmentId]);
                $rubrics = $stmt->fetchAll();
                
                echo json_encode($rubrics);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * GET /rubrics/:id
     * Get a specific rubric by ID
     */
    public function show($id) {
        $this->auth->requireAuth();
        
        try {
            $stmt = $this->db->prepare("
                SELECT r.*, u.name as creator_name
                FROM rubrics r
                LEFT JOIN users u ON r.created_by = u.id
                WHERE r.id = ?
            ");
            $stmt->execute([$id]);
            $rubric = $stmt->fetch();
            
            if (!$rubric) {
                http_response_code(404);
                echo json_encode(['error' => 'Rubric not found']);
                return;
            }
            
            echo json_encode($rubric);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /rubrics
     * Create a new rubric
     */
    public function create() {
        $user = $this->auth->requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['title', 'level_1_criteria', 'level_2_criteria', 'level_3_criteria', 
                     'level_4_criteria', 'level_5_criteria'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        // Validate that either assessment_id or task_id is provided, but not both
        $hasAssessmentId = !empty($input['assessment_id']);
        $hasTaskId = !empty($input['task_id']);
        
        if (!$hasAssessmentId && !$hasTaskId) {
            http_response_code(400);
            echo json_encode(['error' => 'Either assessment_id or task_id must be provided']);
            return;
        }

        if ($hasAssessmentId && $hasTaskId) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot specify both assessment_id and task_id']);
            return;
        }

        try {
            $this->db->beginTransaction();

            // Check if rubric already exists for this assessment/task
            if ($hasTaskId) {
                $stmt = $this->db->prepare("SELECT id FROM rubrics WHERE task_id = ?");
                $stmt->execute([$input['task_id']]);
                if ($stmt->fetch()) {
                    http_response_code(400);
                    echo json_encode(['error' => 'A rubric already exists for this task. Please update it instead.']);
                    return;
                }
            } else {
                $stmt = $this->db->prepare("SELECT id FROM rubrics WHERE assessment_id = ? AND task_id IS NULL");
                $stmt->execute([$input['assessment_id']]);
                if ($stmt->fetch()) {
                    http_response_code(400);
                    echo json_encode(['error' => 'An assessment-level rubric already exists. Please update it instead.']);
                    return;
                }
            }

            $stmt = $this->db->prepare("
                INSERT INTO rubrics 
                (assessment_id, task_id, title, description, level_1_criteria, level_2_criteria, 
                 level_3_criteria, level_4_criteria, level_5_criteria, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['assessment_id'] ?? null,
                $input['task_id'] ?? null,
                $input['title'],
                $input['description'] ?? null,
                $input['level_1_criteria'],
                $input['level_2_criteria'],
                $input['level_3_criteria'],
                $input['level_4_criteria'],
                $input['level_5_criteria'],
                $user['id']
            ]);

            $rubricId = $this->db->lastInsertId();

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $user['id'],
                'create_rubric',
                'rubrics',
                $rubricId,
                json_encode(['title' => $input['title']]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();
            
            $stmt = $this->db->prepare("
                SELECT r.*, u.name as creator_name
                FROM rubrics r
                LEFT JOIN users u ON r.created_by = u.id
                WHERE r.id = ?
            ");
            $stmt->execute([$rubricId]);
            $rubric = $stmt->fetch();

            echo json_encode(['success' => true, 'data' => $rubric]);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /rubrics/:id
     * Update an existing rubric
     */
    public function update($id) {
        $user = $this->auth->requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        try {
            $this->db->beginTransaction();

            // Check if rubric exists
            $stmt = $this->db->prepare("SELECT id FROM rubrics WHERE id = ?");
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Rubric not found']);
                return;
            }

            $fields = [];
            $params = [];
            
            if (isset($input['title'])) {
                $fields[] = "title = ?";
                $params[] = $input['title'];
            }
            if (isset($input['description'])) {
                $fields[] = "description = ?";
                $params[] = $input['description'];
            }
            if (isset($input['level_1_criteria'])) {
                $fields[] = "level_1_criteria = ?";
                $params[] = $input['level_1_criteria'];
            }
            if (isset($input['level_2_criteria'])) {
                $fields[] = "level_2_criteria = ?";
                $params[] = $input['level_2_criteria'];
            }
            if (isset($input['level_3_criteria'])) {
                $fields[] = "level_3_criteria = ?";
                $params[] = $input['level_3_criteria'];
            }
            if (isset($input['level_4_criteria'])) {
                $fields[] = "level_4_criteria = ?";
                $params[] = $input['level_4_criteria'];
            }
            if (isset($input['level_5_criteria'])) {
                $fields[] = "level_5_criteria = ?";
                $params[] = $input['level_5_criteria'];
            }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                return;
            }
            
            $params[] = $id;
            
            $stmt = $this->db->prepare("
                UPDATE rubrics 
                SET " . implode(', ', $fields) . "
                WHERE id = ?
            ");
            $stmt->execute($params);

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $user['id'],
                'update_rubric',
                'rubrics',
                $id,
                json_encode(['fields' => array_keys($input)]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();
            
            $stmt = $this->db->prepare("
                SELECT r.*, u.name as creator_name
                FROM rubrics r
                LEFT JOIN users u ON r.created_by = u.id
                WHERE r.id = ?
            ");
            $stmt->execute([$id]);
            $rubric = $stmt->fetch();

            echo json_encode(['success' => true, 'data' => $rubric]);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /rubrics/:id
     * Delete a rubric
     */
    public function delete($id) {
        $user = $this->auth->requireRole(['admin']);
        
        try {
            $this->db->beginTransaction();

            // Check if rubric exists
            $stmt = $this->db->prepare("SELECT id, title FROM rubrics WHERE id = ?");
            $stmt->execute([$id]);
            $rubric = $stmt->fetch();
            
            if (!$rubric) {
                http_response_code(404);
                echo json_encode(['error' => 'Rubric not found']);
                return;
            }
            
            $stmt = $this->db->prepare("DELETE FROM rubrics WHERE id = ?");
            $stmt->execute([$id]);

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $user['id'],
                'delete_rubric',
                'rubrics',
                $id,
                json_encode(['title' => $rubric['title']]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();
            
            echo json_encode(['success' => true, 'message' => 'Rubric deleted']);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
