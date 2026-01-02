<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class UserController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    public function index() {
        $this->auth->requireRole(['admin', 'facilitator']);

        try {
            $stmt = $this->db->query("
                SELECT id, name, email, role, current_cohort_id, status, created_at
                FROM users 
                ORDER BY name
            ");
            $users = $stmt->fetchAll();

            echo json_encode($users);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function create() {
        $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['name', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO users (name, email, password_hash, role, current_cohort_id, status)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['name'],
                $input['email'],
                password_hash($input['password'], PASSWORD_BCRYPT),
                $input['role'] ?? 'intern',
                $input['current_cohort_id'] ?? null,
                $input['status'] ?? 'active'
            ]);

            $userId = $this->db->lastInsertId();
            
            $stmt = $this->db->prepare("
                SELECT id, name, email, role, current_cohort_id, status 
                FROM users WHERE id = ?
            ");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            echo json_encode($user);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function update($id) {
        $this->auth->requireRole(['admin', 'facilitator']);
        $input = json_decode(file_get_contents('php://input'), true);

        $allowed = ['name', 'email', 'role', 'current_cohort_id', 'status'];
        $updates = [];
        $values = [];

        foreach ($allowed as $field) {
            if (isset($input[$field])) {
                $updates[] = "$field = ?";
                $values[] = $input[$field];
            }
        }

        if (isset($input['password'])) {
            $updates[] = "password_hash = ?";
            $values[] = password_hash($input['password'], PASSWORD_BCRYPT);
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields to update']);
            return;
        }

        try {
            $values[] = $id;
            $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            $stmt = $this->db->prepare("
                SELECT id, name, email, role, current_cohort_id, status 
                FROM users WHERE id = ?
            ");
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            echo json_encode($user);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
