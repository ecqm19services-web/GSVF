<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$config = require __DIR__ . '/../../_secure/appwrite-config.php';

// Auth check (Bearer token in JS, but we use Basic for simplicity in PHP backend if it's easier, 
// or we check the token against what we expect if we had a token system. 
// However, the existing page-content/index.php uses Basic auth from sessionStorage.)
// Wait, lib/adminApi.ts uses Authorization: Bearer ${token}.
// But lib/pageContentApi.ts uses Authorization: Basic ${token}.
// Let's check how the token is generated in useAdminAuth.

function getAuthCredentials() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^(Basic|Bearer)\s+(.+)$/i', $authHeader, $m)) {
        $token = $m[2];
        if (strtolower($m[1]) === 'basic') {
            $decoded = base64_decode($token);
            if ($decoded && strpos($decoded, ':') !== false) {
                return explode(':', $decoded, 2);
            }
        } else {
            // If Bearer, we might need a different way to verify if it's not just the base64 creds.
            // In this project, 'token' often refers to the base64 of user:pass.
            $decoded = base64_decode($token);
            if ($decoded && strpos($decoded, ':') !== false) {
                return explode(':', $decoded, 2);
            }
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
$col = 'contact_submissions';

// List documents, sorted by newest
$qs = 'queries[]=' . urlencode(json_encode(['method' => 'orderDesc', 'attribute' => '$createdAt']));
$url = "{$endpoint}/databases/{$db}/collections/{$col}/documents?{$qs}";

[$code, $data] = appwriteRequest('GET', $url, $config);

http_response_code($code);
echo json_encode($data);
