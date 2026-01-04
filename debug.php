<?php
echo "DIR: " . __DIR__ . "\n";
echo "vendor check: " . (file_exists(__DIR__ . '/vendor/autoload.php') ? 'YES' : 'NO') . "\n";
echo "parent vendor check: " . (file_exists(__DIR__ . '/../vendor/autoload.php') ? 'YES' : 'NO') . "\n";
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo "basePath would be: " . __DIR__ . "\n";
    require_once __DIR__ . '/vendor/autoload.php';
    echo "Vendor loaded successfully!\n";
}
?>