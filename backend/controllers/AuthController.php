<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

/**
 * Authentication Controller
 */
class AuthController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    /**
     * Login endpoint
     * POST /auth/login
     */
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        try {
            $stmt = $this->db->prepare("
                SELECT id, name, email, password_hash, role, current_cohort_id, status 
                FROM users 
                WHERE email = ? AND status = 'active'
            ");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['password_hash'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
                return;
            }

            // Generate JWT token
            $payload = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'current_cohort_id' => $user['current_cohort_id']
            ];

            $token = $this->auth->generateToken($payload);

            // Log audit
            $this->logAudit($user['id'], 'LOGIN', 'users', $user['id']);

            echo json_encode([
                'token' => $token,
                'user' => $payload
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Logout endpoint
     * POST /auth/logout
     */
    public function logout() {
        $user = $this->auth->getCurrentUser();
        
        if ($user) {
            $this->logAudit($user['id'], 'LOGOUT', 'users', $user['id']);
        }

        echo json_encode(['message' => 'Logged out successfully']);
    }

    /**
     * Get current user
     * GET /auth/me
     */
    public function me() {
        $user = $this->auth->requireAuth();
        
        unset($user['iat'], $user['exp']);
        
        echo json_encode($user);
    }

    /**
     * Log audit entry
     */
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
            // Log error but don't fail the request
            error_log("Audit log failed: " . $e->getMessage());
        }
    }
}
