<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/Database.php';

// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if (!array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
            putenv("$name=$value");
        }
    }
}

loadEnv(__DIR__ . '/../.env');

// CORS headers
$allowedOrigins = [
    $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
}

header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set JSON response header
header('Content-Type: application/json');

// Error handling
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Simple router
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string and leading /api
$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);
$path = trim($path, '/');

// Route definitions
$routes = [
    // Auth routes
    ['POST', 'auth/login', 'AuthController@login'],
    ['POST', 'auth/logout', 'AuthController@logout'],
    ['GET', 'auth/me', 'AuthController@me'],

    // Cohort routes
    ['GET', 'cohorts', 'CohortController@index'],
    ['POST', 'cohorts', 'CohortController@create'],
    ['GET', 'cohorts/(\d+)', 'CohortController@show'],
    ['PATCH', 'cohorts/(\d+)', 'CohortController@update'],
    ['GET', 'cohorts/(\d+)/roster', 'CohortController@roster'],
    ['POST', 'cohorts/(\d+)/import', 'CohortController@import'],
    ['POST', 'cohorts/(\d+)/members', 'CohortController@addMember'],
    ['DELETE', 'cohorts/(\d+)/members/(\d+)', 'CohortController@removeMember'],

    // User routes
    ['GET', 'users', 'UserController@index'],
    ['POST', 'users', 'UserController@create'],
    ['PATCH', 'users/(\d+)', 'UserController@update'],

    // Assessment routes
    ['GET', 'assessments', 'AssessmentController@index'],
    ['GET', 'assessments/available', 'AssessmentController@available'],
    ['GET', 'tasks', 'TaskController@index'],
    ['POST', 'tasks', 'TaskController@create'],

    // Assessment window routes
    ['GET', 'assessment_windows', 'WindowController@index'],
    ['POST', 'assessment_windows', 'WindowController@create'],
    ['PATCH', 'assessment_windows/(\d+)/visibility', 'WindowController@updateVisibility'],
    ['PATCH', 'assessment_windows/(\d+)/schedule', 'WindowController@updateSchedule'],
    ['PATCH', 'assessment_windows/(\d+)/lock', 'WindowController@updateLock'],

    // Access override routes
    ['GET', 'access_overrides', 'OverrideController@index'],
    ['POST', 'access_overrides', 'OverrideController@create'],
    ['DELETE', 'access_overrides/(\d+)', 'OverrideController@delete'],

    // Submission routes
    ['POST', 'submissions/start', 'SubmissionController@start'],
    ['GET', 'submissions', 'SubmissionController@index'],
    ['PATCH', 'submissions/(\d+)', 'SubmissionController@update'],
    ['POST', 'submissions/(\d+)/timeout', 'SubmissionController@timeout'],

    // Score routes
    ['POST', 'scores', 'ScoreController@create'],
    ['GET', 'scores/summary', 'ScoreController@summary'],

    // Snapshot routes
    ['POST', 'snapshots', 'SnapshotController@create'],
    ['GET', 'snapshots', 'SnapshotController@index'],
];

// Match route
$matched = false;
foreach ($routes as $route) {
    list($method, $pattern, $handler) = $route;
    
    if ($method !== $requestMethod) {
        continue;
    }

    $regex = '#^' . $pattern . '$#';
    if (preg_match($regex, $path, $matches)) {
        array_shift($matches); // Remove full match
        
        list($controller, $action) = explode('@', $handler);
        $controllerFile = __DIR__ . "/../controllers/{$controller}.php";
        
        if (!file_exists($controllerFile)) {
            http_response_code(500);
            echo json_encode(['error' => 'Controller not found']);
            exit;
        }

        require_once $controllerFile;
        
        $controllerInstance = new $controller();
        call_user_func_array([$controllerInstance, $action], $matches);
        
        $matched = true;
        break;
    }
}

if (!$matched) {
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}
