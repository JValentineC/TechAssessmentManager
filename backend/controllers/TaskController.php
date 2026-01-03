<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class TaskController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    /**
     * GET /tasks?assessment_id=X
     */
    public function index() {
        $this->auth->requireAuth();
        
        $assessmentId = $_GET['assessment_id'] ?? null;
        
        if (!$assessmentId) {
            http_response_code(400);
            echo json_encode(['error' => 'assessment_id is required']);
            return;
        }

        try {
            $stmt = $this->db->prepare("
                SELECT * FROM tasks 
                WHERE assessment_id = ?
                ORDER BY order_index
            ");
            $stmt->execute([$assessmentId]);
            $tasks = $stmt->fetchAll();

            echo json_encode($tasks);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /tasks
     */
    public function create() {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['assessment_id', 'title', 'instructions'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO tasks 
                (assessment_id, title, instructions, template_url, max_points, order_index, task_type, task_config)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['assessment_id'],
                $input['title'],
                $input['instructions'],
                $input['template_url'] ?? null,
                $input['max_points'] ?? 5,
                $input['order_index'] ?? 0,
                $input['task_type'] ?? 'single_input',
                $input['task_config'] ?? null
            ]);

            $taskId = $this->db->lastInsertId();
            
            $stmt = $this->db->prepare("SELECT * FROM tasks WHERE id = ?");
            $stmt->execute([$taskId]);
            $task = $stmt->fetch();

            echo json_encode($task);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /tasks/:id
     */
    public function update($id) {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        try {
            $fields = [];
            $params = [];
            
            if (isset($input['title'])) {
                $fields[] = "title = ?";
                $params[] = $input['title'];
            }
            if (isset($input['instructions'])) {
                $fields[] = "instructions = ?";
                $params[] = $input['instructions'];
            }
            if (isset($input['template_url'])) {
                $fields[] = "template_url = ?";
                $params[] = $input['template_url'];
            }
            if (isset($input['max_points'])) {
                $fields[] = "max_points = ?";
                $params[] = $input['max_points'];
            }
            if (isset($input['order_index'])) {
                $fields[] = "order_index = ?";
                $params[] = $input['order_index'];
            }
            if (isset($input['task_type'])) {
                $fields[] = "task_type = ?";
                $params[] = $input['task_type'];
            }
            if (isset($input['task_config'])) {
                $fields[] = "task_config = ?";
                $params[] = $input['task_config'];
            }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                return;
            }
            
            $params[] = $id;
            
            $stmt = $this->db->prepare("
                UPDATE tasks 
                SET " . implode(', ', $fields) . "
                WHERE id = ?
            ");
            $stmt->execute($params);
            
            $stmt = $this->db->prepare("SELECT * FROM tasks WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode($stmt->fetch());
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /tasks/:id
     */
    public function delete($id) {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        
        try {
            // Check if task has submissions
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count FROM submissions WHERE task_id = ?
            ");
            $stmt->execute([$id]);
            $result = $stmt->fetch();
            
            if ($result['count'] > 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Cannot delete task with existing submissions']);
                return;
            }
            
            $stmt = $this->db->prepare("DELETE FROM tasks WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true, 'message' => 'Task deleted']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /tasks/:id/reorder
     */
    public function reorder($id) {
        $user = $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['order_index'])) {
            http_response_code(400);
            echo json_encode(['error' => 'order_index is required']);
            return;
        }
        
        try {
            $stmt = $this->db->prepare("UPDATE tasks SET order_index = ? WHERE id = ?");
            $stmt->execute([$input['order_index'], $id]);
            
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
