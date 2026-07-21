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
$contactsFile = $dataDir . '/contacts.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$contacts = [];
if (file_exists($contactsFile)) {
    $json = file_get_contents($contactsFile);
    if ($json !== false) {
        $decoded = json_decode($json, true);
        if (is_array($decoded)) {
            $contacts = $decoded;
        }
    }
}

// Sort by createdAt descending (newest first)
usort($contacts, function($a, $b) {
    $timeA = isset($a['createdAt']) ? strtotime($a['createdAt']) : 0;
    $timeB = isset($b['createdAt']) ? strtotime($b['createdAt']) : 0;
    return $timeB - $timeA;
});

echo json_encode(['documents' => $contacts, 'total' => count($contacts)]);
