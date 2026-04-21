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

$config = require __DIR__ . '/../../_secure/appwrite-config.php';

adminAuthenticateOrFail();

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!isset($payload['type'], $payload['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields (type, id)']);
    exit;
}

function appwriteRequest($method, $url, $config, $body = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $headers = [
        'Content-Type: application/json',
        'X-Appwrite-Project: ' . $config['projectId'],
        'X-Appwrite-Key: ' . $config['apiKey'],
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, json_decode($resp, true) ?: ['raw' => $resp]];
}

$endpoint = rtrim($config['endpoint'], '/');
$db = $config['databaseId'];
$col = $payload['type'] === 'admission' ? 'admission_submissions' : 'contact_submissions';
$docId = $payload['id'];
$action = isset($payload['action']) ? strtolower(trim((string)$payload['action'])) : 'status';

$url = "{$endpoint}/databases/{$db}/collections/{$col}/documents/{$docId}";

if ($action === 'delete') {
    [$code, $data] = appwriteRequest('DELETE', $url, $config);

    if ($code >= 200 && $code < 300) {
        adminAuditLog('admin_submission_deleted', [
            'type' => $payload['type'],
            'id' => $docId,
            'collection' => $col,
        ]);
        echo json_encode(['ok' => true, 'deleted' => true]);
        exit;
    }

    http_response_code($code);
    echo json_encode(['error' => 'Unable to delete submission', 'details' => $data]);
    exit;
}

if (!isset($payload['newStatus'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required field (newStatus)']);
    exit;
}

$updateData = [
    'status' => $payload['newStatus']
];
if (isset($payload['publicNotes'])) {
    $updateData['adminNotes'] = $payload['publicNotes'];
}
[$code, $data] = appwriteRequest('PATCH', $url, $config, ['data' => $updateData]);

if ($code >= 200 && $code < 300) {
    adminAuditLog('admin_submission_status_updated', [
        'type' => $payload['type'],
        'id' => $docId,
        'collection' => $col,
        'newStatus' => (string)$payload['newStatus'],
        'hasPublicNotes' => isset($payload['publicNotes']),
    ]);
}

http_response_code($code);
echo json_encode(['updated' => $data]);
