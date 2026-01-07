-- Add soft delete column to users table
-- This allows us to "delete" users without losing historical assessment data

ALTER TABLE users 
ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Add index for better query performance when filtering out deleted users
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Note: NULL means user is active, a timestamp means user was "deleted" at that time
