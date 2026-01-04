<?php
var_dump('__DIR__: ' . __DIR__);
var_dump('vendor exists: ' . (file_exists(__DIR__ . '/vendor/autoload.php') ? 'YES' : 'NO'));
var_dump('config exists: ' . (file_exists(__DIR__ . '/config/Database.php') ? 'YES' : 'NO'));
