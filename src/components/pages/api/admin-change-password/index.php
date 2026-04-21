<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-auth.php';
require_once __DIR__ . '/../../_secure/admin-audit-log.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$operator = adminAuthenticateOrFail(false);

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
if (!is_array($payload)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON body']);
  exit;
}

$newPassword = isset($payload['newPassword']) ? (string)$payload['newPassword'] : '';
if ($newPassword === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Le nouveau mot de passe est requis']);
  exit;
}

[$ok, $error] = adminAuthChangePassword((string)$operator['id'], $newPassword);
if (!$ok) {
  http_response_code(400);
  echo json_encode(['error' => $error ?: 'Impossible de changer le mot de passe']);
  exit;
}

adminAuditLog('admin_operator_password_changed', [
  'operatorId' => (string)$operator['id'],
]);

echo json_encode(['ok' => true]);
