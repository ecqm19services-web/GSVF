<?php
header('Content-Type: application/json; charset=utf-8');

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

function getAuthCredentials() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^(Basic|Bearer)\s+(.+)$/i', $authHeader, $m)) {
        $token = $m[2];
        $decoded = base64_decode($token);
        if ($decoded && strpos($decoded, ':') !== false) {
            return explode(':', $decoded, 2);
        }
    }
    return [null, null];
}

[$authUser, $authPass] = getAuthCredentials();
$authenticated = false;
$htpasswdFile = __DIR__ . '/../../_secure/.htpasswd';

if ($authUser && $authPass && file_exists($htpasswdFile)) {
    $lines = file($htpasswdFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $parts = explode(':', $line, 2);
        if (count($parts) === 2) {
            [$storedUser, $storedHash] = $parts;
            if ($storedUser === $authUser) {
                if (password_verify($authPass, $storedHash) || crypt($authPass, $storedHash) === $storedHash) {
                    $authenticated = true;
                }
                break;
            }
        }
    }
}

if (!$authenticated) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!isset($payload['type'], $payload['id'], $payload['newStatus'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields (type, id, newStatus)']);
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

$updateData = [
    'status' => $payload['newStatus']
];
if (isset($payload['publicNotes'])) {
    $updateData['adminNotes'] = $payload['publicNotes'];
}

$url = "{$endpoint}/databases/{$db}/collections/{$col}/documents/{$docId}";
[$code, $data] = appwriteRequest('PATCH', $url, $config, ['data' => $updateData]);

http_response_code($code);
echo json_encode(['updated' => $data]);
