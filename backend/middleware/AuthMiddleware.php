<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * JWT Authentication Middleware
 */
class AuthMiddleware {
    private $secretKey;
    
    public function __construct() {
        $this->secretKey = $_ENV['JWT_SECRET'] ?? 'your_secret_key';
    }

    /**
     * Verify JWT token and return user data
     */
    public function authenticate(): ?array {
        // CGI-compatible header retrieval
        $authHeader = '';
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

        if (empty($authHeader)) {
            return null;
        }

        // Extract token from "Bearer <token>"
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        } else {
            return null;
        }

        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Require authentication
     */
    public function requireAuth(): array {
        $user = $this->authenticate();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        return $user;
    }

    /**
     * Require specific role(s)
     */
    public function requireRole(array $roles): array {
        $user = $this->requireAuth();
        
        if (!in_array($user['role'], $roles)) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            exit;
        }

        return $user;
    }

    /**
     * Generate JWT token
     */
    public function generateToken(array $payload): string {
        $issuedAt = time();
        $expiry = $issuedAt + (int)($_ENV['JWT_EXPIRY'] ?? 86400);

        $token = [
            'iat' => $issuedAt,
            'exp' => $expiry,
            'data' => $payload
        ];

        // Flatten data into token
        $token = array_merge($token, $payload);

        return JWT::encode($token, $this->secretKey, 'HS256');
    }

    /**
     * Get current user (without requiring auth)
     */
    public function getCurrentUser(): ?array {
        return $this->authenticate();
    }
}
