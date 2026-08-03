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
