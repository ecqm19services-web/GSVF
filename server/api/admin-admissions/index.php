<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$config = require __DIR__ . '/../../_secure/appwrite-config.php';

adminAuthenticateOrFail();

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
// Note: This collection might need to be created if not exists, 
// but for now we follow the same pattern as contact submissions.
$col = 'admission_submissions'; 

// List documents, sorted by newest
$qs = 'queries[]=' . urlencode(json_encode(['method' => 'orderDesc', 'attribute' => '$createdAt']));
$url = "{$endpoint}/databases/{$db}/collections/{$col}/documents?{$qs}";

[$code, $data] = appwriteRequest('GET', $url, $config);

// If collection doesn't exist, return empty list instead of 404 to avoid frontend crash
if ($code === 404) {
    echo json_encode(['documents' => [], 'total' => 0]);
    exit;
}

http_response_code($code);
echo json_encode($data);
