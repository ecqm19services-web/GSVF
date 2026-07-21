<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-audit-log.php';
require_once __DIR__ . '/../../_secure/admin-auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

adminAuthenticateOrFail();

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!isset($payload['type'], $payload['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields (type, id)']);
    exit;
}

$projectRoot = dirname(__DIR__, 2);
$dataDir = $projectRoot . '/data';
$type = $payload['type'];
$docId = $payload['id'];
$action = isset($payload['action']) ? strtolower(trim((string)$payload['action'])) : 'status';

// Determine which file to use
$dataFile = $type === 'admission' ? $dataDir . '/admissions.json' : $dataDir . '/contacts.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Load data
$items = [];
if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);
    if ($json !== false) {
        $decoded = json_decode($json, true);
        if (is_array($decoded)) {
            $items = $decoded;
        }
    }
}

// Find the item by reference (which is used as ID)
$foundIndex = null;
foreach ($items as $i => $item) {
    if (isset($item['reference']) && $item['reference'] === $docId) {
        $foundIndex = $i;
        break;
    }
}

if ($foundIndex === null) {
    http_response_code(404);
    echo json_encode(['error' => 'Submission not found']);
    exit;
}

if ($action === 'delete') {
    array_splice($items, $foundIndex, 1);
    
    $encoded = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (file_put_contents($dataFile, $encoded, LOCK_EX) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete submission']);
        exit;
    }

    adminAuditLog('admin_submission_deleted', [
        'type' => $type,
        'id' => $docId,
    ]);
    echo json_encode(['ok' => true, 'deleted' => true]);
    exit;
}

if (!isset($payload['newStatus'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required field (newStatus)']);
    exit;
}

// Update status
$items[$foundIndex]['status'] = $payload['newStatus'];
if (isset($payload['publicNotes'])) {
    $items[$foundIndex]['adminNotes'] = $payload['publicNotes'];
}
$items[$foundIndex]['processedAt'] = gmdate('c');

// Save
$encoded = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (file_put_contents($dataFile, $encoded, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update submission']);
    exit;
}

adminAuditLog('admin_submission_status_updated', [
    'type' => $type,
    'id' => $docId,
    'newStatus' => (string)$payload['newStatus'],
    'hasPublicNotes' => isset($payload['publicNotes']),
]);

echo json_encode(['ok' => true, 'updated' => $items[$foundIndex]]);
