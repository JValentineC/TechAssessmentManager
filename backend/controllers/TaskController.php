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
                (assessment_id, title, instructions, template_url, max_points, order_index)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['assessment_id'],
                $input['title'],
                $input['instructions'],
                $input['template_url'] ?? null,
                $input['max_points'] ?? 5,
                $input['order_index'] ?? 0
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
}
