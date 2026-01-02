<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class CohortController {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new AuthMiddleware();
    }

    /**
     * GET /cohorts
     */
    public function index() {
        $this->auth->requireAuth();

        try {
            $stmt = $this->db->query("
                SELECT * FROM cohorts 
                ORDER BY cycle_number DESC
            ");
            $cohorts = $stmt->fetchAll();

            echo json_encode($cohorts);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * GET /cohorts/:id
     */
    public function show($id) {
        $this->auth->requireAuth();

        try {
            $stmt = $this->db->prepare("SELECT * FROM cohorts WHERE id = ?");
            $stmt->execute([$id]);
            $cohort = $stmt->fetch();

            if (!$cohort) {
                http_response_code(404);
                echo json_encode(['error' => 'Cohort not found']);
                return;
            }

            echo json_encode($cohort);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /cohorts
     */
    public function create() {
        $currentUser = $this->auth->requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['cycle_number', 'name'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "$field is required"]);
                return;
            }
        }

        try {
            // Check for duplicate cycle number
            $stmt = $this->db->prepare("SELECT id FROM cohorts WHERE cycle_number = ?");
            $stmt->execute([$input['cycle_number']]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => 'Cycle number already exists']);
                return;
            }

            $this->db->beginTransaction();

            $stmt = $this->db->prepare("
                INSERT INTO cohorts (cycle_number, name, start_date, end_date, status)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['cycle_number'],
                $input['name'],
                $input['start_date'] ?? null,
                $input['end_date'] ?? null,
                $input['status'] ?? 'active'
            ]);

            $cohortId = $this->db->lastInsertId();

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $currentUser['id'],
                'create_cohort',
                'cohorts',
                $cohortId,
                json_encode($input),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();
            
            $stmt = $this->db->prepare("SELECT * FROM cohorts WHERE id = ?");
            $stmt->execute([$cohortId]);
            $cohort = $stmt->fetch();

            echo json_encode(['success' => true, 'data' => $cohort]);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /cohorts/:id
     */
    public function update($id) {
        $currentUser = $this->auth->requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        $allowed = ['name', 'start_date', 'end_date', 'status', 'cycle_number'];
        $updates = [];
        $values = [];

        foreach ($allowed as $field) {
            if (isset($input[$field])) {
                $updates[] = "$field = ?";
                $values[] = $input[$field];
            }
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No valid fields to update']);
            return;
        }

        try {
            $this->db->beginTransaction();

            $values[] = $id;
            $sql = "UPDATE cohorts SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $currentUser['id'],
                'update_cohort',
                'cohorts',
                $id,
                json_encode($input),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();

            $stmt = $this->db->prepare("SELECT * FROM cohorts WHERE id = ?");
            $stmt->execute([$id]);
            $cohort = $stmt->fetch();

            echo json_encode(['success' => true, 'data' => $cohort]);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    /**
     * GET /cohorts/:id/roster
     */
    public function roster($id) {
        $this->auth->requireRole(['admin', 'facilitator']);

        try {
            $stmt = $this->db->prepare("
                SELECT u.id, u.name, u.email, u.role, u.status, cm.joined_at, cm.left_at
                FROM users u
                JOIN cohort_memberships cm ON u.id = cm.user_id
                WHERE cm.cohort_id = ? AND cm.left_at IS NULL
                ORDER BY u.name
            ");
            $stmt->execute([$id]);
            $roster = $stmt->fetchAll();

            echo json_encode($roster);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /cohorts/:id/import
     * Import interns from CSV
     */
    public function import($id) {
        $user = $this->auth->requireRole(['admin', 'facilitator']);

        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded']);
            return;
        }

        $file = $_FILES['file'];
        
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'File upload error']);
            return;
        }

        try {
            $handle = fopen($file['tmp_name'], 'r');
            $header = fgetcsv($handle);
            
            $imported = 0;
            $errors = [];

            while (($row = fgetcsv($handle)) !== false) {
                if (count($row) < 2) continue;

                $name = trim($row[0]);
                $email = trim($row[1]);
                $password = $row[2] ?? 'TempPassword123!';

                if (empty($name) || empty($email)) {
                    $errors[] = "Skipped row: missing name or email";
                    continue;
                }

                try {
                    $this->db->beginTransaction();

                    // Check if user exists
                    $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
                    $stmt->execute([$email]);
                    $existingUser = $stmt->fetch();

                    if ($existingUser) {
                        $userId = $existingUser['id'];
                    } else {
                        // Create user
                        $stmt = $this->db->prepare("
                            INSERT INTO users (name, email, password_hash, role, current_cohort_id)
                            VALUES (?, ?, ?, 'intern', ?)
                        ");
                        $stmt->execute([$name, $email, password_hash($password, PASSWORD_BCRYPT), $id]);
                        $userId = $this->db->lastInsertId();
                    }

                    // Add to cohort
                    $stmt = $this->db->prepare("
                        INSERT IGNORE INTO cohort_memberships (user_id, cohort_id)
                        VALUES (?, ?)
                    ");
                    $stmt->execute([$userId, $id]);

                    $this->db->commit();
                    $imported++;
                } catch (Exception $e) {
                    $this->db->rollBack();
                    $errors[] = "Error importing $email: " . $e->getMessage();
                }
            }

            fclose($handle);

            echo json_encode([
                'imported' => $imported,
                'errors' => $errors
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * POST /cohorts/:id/members
     * Add a member to a cohort
     */
    public function addMember($id) {
        $currentUser = $this->auth->requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['user_id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'user_id is required']);
            return;
        }

        try {
            $this->db->beginTransaction();

            // Check if already a member
            $stmt = $this->db->prepare("
                SELECT id FROM cohort_memberships 
                WHERE user_id = ? AND cohort_id = ? AND left_at IS NULL
            ");
            $stmt->execute([$input['user_id'], $id]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['success' => false, 'error' => 'User already in cohort']);
                return;
            }

            // Add membership
            $stmt = $this->db->prepare("
                INSERT INTO cohort_memberships (user_id, cohort_id)
                VALUES (?, ?)
            ");
            $stmt->execute([$input['user_id'], $id]);

            // Update user's current cohort
            $stmt = $this->db->prepare("
                UPDATE users SET current_cohort_id = ? WHERE id = ?
            ");
            $stmt->execute([$id, $input['user_id']]);

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $currentUser['id'],
                'add_cohort_member',
                'cohort_memberships',
                $id,
                json_encode(['user_id' => $input['user_id'], 'cohort_id' => $id]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();

            echo json_encode(['success' => true, 'message' => 'Member added successfully']);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /cohorts/:cohortId/members/:userId
     * Remove a member from a cohort
     */
    public function removeMember($cohortId, $userId) {
        $currentUser = $this->auth->requireRole(['admin']);

        try {
            $this->db->beginTransaction();

            // Mark as left
            $stmt = $this->db->prepare("
                UPDATE cohort_memberships 
                SET left_at = NOW()
                WHERE user_id = ? AND cohort_id = ? AND left_at IS NULL
            ");
            $stmt->execute([$userId, $cohortId]);

            // Clear current cohort from user if matches
            $stmt = $this->db->prepare("
                UPDATE users 
                SET current_cohort_id = NULL 
                WHERE id = ? AND current_cohort_id = ?
            ");
            $stmt->execute([$userId, $cohortId]);

            // Audit log
            $stmt = $this->db->prepare("
                INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, metadata_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $currentUser['id'],
                'remove_cohort_member',
                'cohort_memberships',
                $cohortId,
                json_encode(['user_id' => $userId, 'cohort_id' => $cohortId]),
                $_SERVER['REMOTE_ADDR'] ?? null
            ]);

            $this->db->commit();

            echo json_encode(['success' => true, 'message' => 'Member removed successfully']);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
