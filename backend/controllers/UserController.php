<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class UserController
{
    private $db;
    private $auth;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    public function index()
    {
        $this->auth->requireRole(['admin', 'facilitator']);

        try {
            // Parse query parameters
            $role = $_GET['role'] ?? null;
            $cohortId = $_GET['cohortId'] ?? null;
            $status = $_GET['status'] ?? null;
            $search = $_GET['q'] ?? null;
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = min(100, max(10, intval($_GET['limit'] ?? 50)));
            $offset = ($page - 1) * $limit;

            // Build query
            $where = ['deleted_at IS NULL']; // Filter out soft-deleted users
            $params = [];

            if ($role) {
                $where[] = "role = ?";
                $params[] = $role;
            }

            if ($cohortId) {
                $where[] = "current_cohort_id = ?";
                $params[] = $cohortId;
            }

            if ($status) {
                $where[] = "status = ?";
                $params[] = $status;
            }

            if ($search) {
                $where[] = "(name LIKE ? OR email LIKE ?)";
                $searchTerm = "%{$search}%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

            // Get total count
            $countStmt = $this->db->prepare("SELECT COUNT(*) as total FROM users $whereClause");
            $countStmt->execute($params);
            $total = $countStmt->fetch()['total'];

            // Get users
            $stmt = $this->db->prepare("
                SELECT u.id, u.name, u.email, u.role, u.current_cohort_id, u.status, u.created_at,
                       c.name as cohort_name
                FROM users u
                LEFT JOIN cohorts c ON u.current_cohort_id = c.id
                $whereClause
                ORDER BY u.created_at DESC
                LIMIT ? OFFSET ?
            ");
            $stmt->execute([...$params, $limit, $offset]);
            $users = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $users,
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

    public function create()
    {
        $this->auth->requireRole(['admin']);
        $currentUser = $this->auth->requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);

        // Validation
        $required = ['name', 'email', 'role'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "$field is required"]);
                return;
            }
        }

        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid email format']);
            return;
        }

        // Validate role
        $validRoles = ['intern', 'facilitator', 'admin'];
        if (!in_array($input['role'], $validRoles)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid role']);
            return;
        }

        // Check for duplicate email
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$input['email']]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => 'Email already exists']);
                return;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database error']);
            return;
        }

        // Generate temporary password if not provided
        $password = $input['password'] ?? $this->generateTempPassword();
        $cohortId = $input['current_cohort_id'] ?? null;
        $status = $input['status'] ?? 'active';

        try {
            $this->db->beginTransaction();

            // Insert user
            $stmt = $this->db->prepare("
                INSERT INTO users (name, email, password_hash, role, current_cohort_id, status)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['name'],
                $input['email'],
                password_hash($password, PASSWORD_BCRYPT),
                $input['role'],
                $cohortId,
                $status
            ]);

            $userId = $this->db->lastInsertId();

            // Create cohort membership if cohort assigned
            if ($cohortId) {
                $stmt = $this->db->prepare("
                    INSERT INTO cohort_memberships (user_id, cohort_id)
                    VALUES (?, ?)
                ");
                $stmt->execute([$userId, $cohortId]);
            }

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $currentUser['id'],
                'create_user',
                'users',
                $userId,
                json_encode([
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'role' => $input['role'],
                    'cohort_id' => $cohortId
                ]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();

            // Return created user
            $stmt = $this->db->prepare("
                SELECT id, name, email, role, current_cohort_id, status, created_at 
                FROM users WHERE id = ?
            ");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            echo json_encode([
                'success' => true,
                'data' => $user,
                'temp_password' => $password
            ]);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    private function generateTempPassword()
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        $password = '';
        for ($i = 0; $i < 12; $i++) {
            $password .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $password;
    }

    public function update($id)
    {
        $this->auth->requireRole(['admin']);
        $currentUser = $this->auth->requireAuth();
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
            echo json_encode(['success' => false, 'error' => 'No valid fields to update']);
            return;
        }

        $values[] = $id;

        try {
            $this->db->beginTransaction();

            // Update user
            $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            // Update cohort membership if cohort changed
            if (isset($input['current_cohort_id'])) {
                // Close previous membership
                $stmt = $this->db->prepare("
                    UPDATE cohort_memberships 
                    SET left_at = NOW()
                    WHERE user_id = ? AND left_at IS NULL
                ");
                $stmt->execute([$id]);

                // Create new membership if cohort is not null
                if ($input['current_cohort_id']) {
                    $stmt = $this->db->prepare("
                        INSERT INTO cohort_memberships (user_id, cohort_id)
                        VALUES (?, ?)
                    ");
                    $stmt->execute([$id, $input['current_cohort_id']]);
                }
            }

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $currentUser['id'],
                'update_user',
                'users',
                $id,
                json_encode($input),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();

            // Return updated user
            $stmt = $this->db->prepare("
                SELECT id, name, email, role, current_cohort_id, status, created_at 
                FROM users WHERE id = ?
            ");
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            echo json_encode(['success' => true, 'data' => $user]);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function delete($id)
    {
        $this->auth->requireRole(['admin']);

        try {
            // Get user info before soft deletion
            $stmt = $this->db->prepare("SELECT name, email FROM users WHERE id = ? AND deleted_at IS NULL");
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            if (!$user) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'User not found or already deleted']);
                return;
            }

            // Soft delete: mark the user as deleted instead of actually deleting
            // This preserves all historical assessment data, submissions, and scores
            $stmt = $this->db->prepare("UPDATE users SET deleted_at = NOW() WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode([
                'success' => true,
                'message' => "User {$user['name']} ({$user['email']}) archived successfully. All historical data preserved."
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
