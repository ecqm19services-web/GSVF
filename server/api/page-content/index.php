<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$page = isset($_GET['page']) ? trim((string)$_GET['page']) : '';
if ($page === '' || !preg_match('/^[a-z0-9_-]{1,60}$/i', $page)) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing or invalid page parameter']);
  exit;
}

$config = require __DIR__ . '/../../_secure/appwrite-config.php';

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
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($resp === false) {
    return [$code ?: 500, ['error' => $err ?: 'cURL request failed']];
  }
  $json = json_decode($resp, true);
  if (!is_array($json)) { $json = ['raw' => $resp]; }
  return [$code, $json];
}

$endpoint = rtrim($config['endpoint'], '/');
$db  = $config['databaseId'];
$col = $config['collectionId'];

function buildQueryString($queries) {
  $parts = [];
  foreach ($queries as $q) {
    $parts[] = 'queries[]=' . urlencode(json_encode($q));
  }
  return implode('&', $parts);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $qs = buildQueryString([
    ['method' => 'equal', 'attribute' => 'page', 'values' => [$page]],
    ['method' => 'limit', 'values' => [1]],
  ]);
  $url = "{$endpoint}/databases/{$db}/collections/{$col}/documents?{$qs}";
  [$code, $data] = appwriteRequest('GET', $url, $config);
  if ($code >= 400) {
    http_response_code($code);
    echo json_encode(['error' => $data['message'] ?? $data['error'] ?? 'Appwrite error', 'details' => $data]);
    exit;
  }
  $doc = null;
  if (!empty($data['documents'][0])) {
    $doc = $data['documents'][0];
    $doc['kind']    = $doc['kind'] ?? 'json';
    $doc['payload'] = $doc['payload'] ?? ($doc['content'] ?? null);
  }
  echo json_encode(['document' => $doc]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $authUser = $_SERVER['PHP_AUTH_USER'] ?? '';
  $authPass = $_SERVER['PHP_AUTH_PW'] ?? '';
  if ($authUser === '' || $authPass === '') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Basic\s+(.+)$/i', $authHeader, $m)) {
      $decoded = base64_decode($m[1]);
      if ($decoded && strpos($decoded, ':') !== false) {
        [$authUser, $authPass] = explode(':', $decoded, 2);
      }
    }
  }
  $authenticated = false;
  $htpasswdFile = __DIR__ . '/../../_secure/.htpasswd';
  if ($authUser !== '' && $authPass !== '' && file_exists($htpasswdFile)) {
    $lines = file($htpasswdFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
      [$storedUser, $storedHash] = explode(':', $line, 2);
      if ($storedUser === $authUser) {
        if (password_verify($authPass, $storedHash) || crypt($authPass, $storedHash) === $storedHash) {
          $authenticated = true;
        }
        break;
      }
    }
  }
  if (!$authenticated) {
    header('WWW-Authenticate: Basic realm="Admin API"');
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
  }
  if ($page === '__auth_test__') {
    echo json_encode(['ok' => true]);
    exit;
  }
  $raw = file_get_contents('php://input');
  $payload = json_decode($raw, true);
  if (!is_array($payload) || !isset($payload['kind']) || !isset($payload['payload']) || !is_string($payload['payload'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body (expected {kind, payload})']);
    exit;
  }
  $rawPayload = $payload['payload'];
  $kind = $payload['kind'];
  $qs = buildQueryString([
    ['method' => 'equal', 'attribute' => 'page', 'values' => [$page]],
    ['method' => 'limit', 'values' => [1]],
  ]);
  $listUrl = "{$endpoint}/databases/{$db}/collections/{$col}/documents?{$qs}";
  [$listCode, $listData] = appwriteRequest('GET', $listUrl, $config);
  if ($listCode >= 400) {
    http_response_code($listCode);
    echo json_encode(['error' => $listData['message'] ?? 'Appwrite list error', 'details' => $listData]);
    exit;
  }
  $existing = $listData['documents'][0] ?? null;
  if ($existing === null) {
    $createUrl = "{$endpoint}/databases/{$db}/collections/{$col}/documents";
    $body = ['documentId' => 'unique()', 'data' => ['page' => $page, 'content' => $rawPayload]];
    [$cCode, $cData] = appwriteRequest('POST', $createUrl, $config, $body);
    if ($cCode >= 400) {
      http_response_code($cCode);
      echo json_encode(['error' => $cData['message'] ?? 'Appwrite create error', 'details' => $cData]);
      exit;
    }
    $doc = $cData;
    $doc['kind'] = $kind;
    $doc['payload'] = $rawPayload;
    echo json_encode(['document' => $doc]);
    exit;
  }
  $docId = $existing['$id'];
  $updateUrl = "{$endpoint}/databases/{$db}/collections/{$col}/documents/{$docId}";
  $body = ['data' => ['content' => $rawPayload]];
  [$uCode, $uData] = appwriteRequest('PATCH', $updateUrl, $config, $body);
  if ($uCode >= 400) {
    http_response_code($uCode);
    echo json_encode(['error' => $uData['message'] ?? 'Appwrite update error', 'details' => $uData]);
    exit;
  }
  $doc = $uData;
  $doc['kind'] = $kind;
  $doc['payload'] = $rawPayload;
  echo json_encode(['document' => $doc]);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
