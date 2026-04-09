<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-audit-log.php';
require_once __DIR__ . '/../../_secure/admin-auth.php';

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

function buildQueryString($queries) {
  $parts = [];
  foreach ($queries as $q) {
    $parts[] = 'queries[]=' . urlencode(json_encode($q));
  }
  return implode('&', $parts);
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
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($resp === false) {
    return [$code ?: 500, ['error' => $err ?: 'cURL request failed']];
  }
  $json = json_decode($resp, true);
  if (!is_array($json)) {
    $json = ['raw' => $resp];
  }
  return [$code, $json];
}

$projectRoot = dirname(__DIR__, 2);
$contentDir = $projectRoot . '/content/pages';
$filePath = $contentDir . '/' . strtolower($page) . '.json';

function readFileDocument($filePath, $page) {
  if (!file_exists($filePath)) {
    return null;
  }

  $raw = file_get_contents($filePath);
  if ($raw === false || trim($raw) === '') {
    return null;
  }

  $parsed = json_decode($raw, true);
  if (is_array($parsed) && isset($parsed['payload']) && is_string($parsed['payload'])) {
    $kind = (isset($parsed['kind']) && is_string($parsed['kind'])) ? $parsed['kind'] : 'json';
    $updatedAt = isset($parsed['updatedAt']) && is_string($parsed['updatedAt']) ? $parsed['updatedAt'] : null;
    return [
      '$id' => 'file:' . $page,
      'page' => $page,
      'kind' => $kind,
      'payload' => $parsed['payload'],
      'updatedAt' => $updatedAt,
      '$updatedAt' => $updatedAt,
    ];
  }

  // Legacy plain payload file fallback
  return [
    '$id' => 'file:' . $page,
    'page' => $page,
    'kind' => 'json',
    'payload' => $raw,
    'updatedAt' => date('c', filemtime($filePath) ?: time()),
    '$updatedAt' => date('c', filemtime($filePath) ?: time()),
  ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $doc = readFileDocument($filePath, $page);
  if ($doc !== null) {
    echo json_encode(['document' => $doc]);
    exit;
  }

  // Legacy fallback: read from Appwrite when no file exists yet.
  $configPath = __DIR__ . '/../../_secure/appwrite-config.php';
  if (file_exists($configPath)) {
    $config = require $configPath;
    if (
      is_array($config) &&
      isset($config['endpoint'], $config['projectId'], $config['apiKey'], $config['databaseId'], $config['collectionId'])
    ) {
      $endpoint = rtrim($config['endpoint'], '/');
      $db  = $config['databaseId'];
      $col = $config['collectionId'];
      $qs = buildQueryString([
        ['method' => 'equal', 'attribute' => 'page', 'values' => [$page]],
        ['method' => 'limit', 'values' => [1]],
      ]);
      $url = "{$endpoint}/databases/{$db}/collections/{$col}/documents?{$qs}";
      [$code, $data] = appwriteRequest('GET', $url, $config);
      if ($code < 400 && !empty($data['documents'][0])) {
        $legacy = $data['documents'][0];
        $doc = [
          '$id' => $legacy['$id'] ?? ('appwrite:' . $page),
          'page' => $page,
          'kind' => $legacy['kind'] ?? 'json',
          'payload' => $legacy['payload'] ?? ($legacy['content'] ?? null),
          'updatedAt' => $legacy['$updatedAt'] ?? null,
          '$updatedAt' => $legacy['$updatedAt'] ?? null,
        ];
        echo json_encode(['document' => $doc]);
        exit;
      }
    }
  }

  echo json_encode(['document' => $doc]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  adminAuthenticateOrFail();

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
  if (!is_dir($contentDir) && !mkdir($contentDir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to create content directory']);
    exit;
  }

  $rawPayload = $payload['payload'];
  $kind = $payload['kind'];
  $docToWrite = [
    'page' => $page,
    'kind' => $kind,
    'payload' => $rawPayload,
    'updatedAt' => gmdate('c'),
  ];

  $encoded = json_encode($docToWrite, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($encoded === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to encode content JSON']);
    exit;
  }

  if (file_put_contents($filePath, $encoded, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to write content file']);
    exit;
  }

  adminAuditLog('admin_page_content_published', [
    'page' => $page,
    'kind' => $kind,
    'filePath' => str_replace('\\', '/', $filePath),
  ]);

  $doc = [
    '$id' => 'file:' . $page,
    'page' => $page,
    'kind' => $kind,
    'payload' => $rawPayload,
    'updatedAt' => $docToWrite['updatedAt'],
    '$updatedAt' => $docToWrite['updatedAt'],
  ];

  echo json_encode(['document' => $doc]);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
