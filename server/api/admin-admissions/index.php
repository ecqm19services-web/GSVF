<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

adminAuthenticateOrFail();

$projectRoot = dirname(__DIR__, 2);
$dataDir = $projectRoot . '/data';
$admissionsFile = $dataDir . '/admissions.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$admissions = [];
if (file_exists($admissionsFile)) {
    $json = file_get_contents($admissionsFile);
    if ($json !== false) {
        $decoded = json_decode($json, true);
        if (is_array($decoded)) {
            $admissions = $decoded;
        }
    }
}

// Sort by createdAt descending (newest first)
usort($admissions, function($a, $b) {
    $timeA = isset($a['createdAt']) ? strtotime($a['createdAt']) : 0;
    $timeB = isset($b['createdAt']) ? strtotime($b['createdAt']) : 0;
    return $timeB - $timeA;
});

echo json_encode(['documents' => $admissions, 'total' => count($admissions)]);
