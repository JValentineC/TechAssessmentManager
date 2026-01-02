<?php
// Quick database setup script
// Run with: php setup-db.php

echo "\n=== Setting up Assessment System Database ===\n\n";

try {
    // Connect to MySQL
    $pdo = new PDO('mysql:host=localhost', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ]);
    
    echo "✓ Connected to MySQL\n";
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS assessment_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Database 'assessment_system' created\n";
    
    // Select database
    $pdo->exec("USE assessment_system");
    
    // Run first migration
    echo "✓ Running schema migration...\n";
    $sql1 = file_get_contents('backend/migrations/001_create_tables.sql');
    $pdo->exec($sql1);
    echo "✓ Tables created\n";
    
    // Run seed data
    echo "✓ Running seed data...\n";
    $sql2 = file_get_contents('backend/migrations/002_seed_data.sql');
    $pdo->exec($sql2);
    echo "✓ Seed data loaded\n";
    
    echo "\n✅ Database setup complete!\n\n";
    echo "Default accounts:\n";
    echo "  - admin@icstars.org / Admin@2026!\n";
    echo "  - facilitator@icstars.org / Facilitator@2026!\n";
    echo "  - intern@icstars.org / Intern@2026!\n\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n\n";
    echo "Troubleshooting:\n";
    echo "  1. Make sure MySQL is running (XAMPP Control Panel)\n";
    echo "  2. Check that port 3306 is accessible\n";
    echo "  3. Verify root user has no password (XAMPP default)\n\n";
    exit(1);
}
