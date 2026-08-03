<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-auth.php';
require_once __DIR__ . '/../../_secure/admin-audit-log.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$operator = adminAuthenticateOrFail();

// Phrase de confirmation requise pour toute action sur les opérateurs
define('OPERATOR_ACTION_PASSPHRASE', 'op01-op02-op03-op04-op05-op06-op07-op08-op09-op10');

function loadOperatorsOrFail() {
  $ops = adminAuthLoadOperators();
  if (!is_array($ops)) {
    http_response_code(500);
    echo json_encode(['error' => 'Impossible de charger les opérateurs']);
    exit;
  }
  return $ops;
}

function persistOperatorsOrFail($operators) {
  if (!adminAuthSaveOperators($operators)) {
    http_response_code(500);
    echo json_encode(['error' => 'Impossible de sauvegarder les opérateurs']);
    exit;
  }
}

function nextOperatorId($existing) {
  $max = 0;
  foreach (array_keys($existing) as $id) {
    if (preg_match('/^op(\d{2,})$/', $id, $m)) {
      $num = (int)$m[1];
      if ($num > $max) $max = $num;
    }
  }
  $next = $max + 1;
  return 'op' . str_pad((string)$next, 2, '0', STR_PAD_LEFT);
}

function publicOperatorPayload($op) {
  $copy = $op;
  unset($copy['passwordHash'], $copy['passwordHistory']);
  return $copy;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $ops = loadOperatorsOrFail();
  $list = array_values(array_map('publicOperatorPayload', $ops));
  echo json_encode(['operators' => $list]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
$action = isset($payload['action']) ? trim((string)$payload['action']) : '';

// Toute action sur les opérateurs exige la phrase de confirmation (vérifiée côté serveur)
$confirmation = isset($payload['confirmation']) ? trim((string)$payload['confirmation']) : '';
if (!hash_equals(OPERATOR_ACTION_PASSPHRASE, $confirmation)) {
  http_response_code(403);
  echo json_encode(['error' => 'Phrase de confirmation incorrecte']);
  exit;
}

$operators = loadOperatorsOrFail();

if ($action === 'create') {
  $newId = nextOperatorId($operators);
  $password = adminAuthRandomPassword(18);
  $now = gmdate('c');

  $operators[$newId] = [
    'id' => $newId,
    'displayName' => isset($payload['displayName']) && trim((string)$payload['displayName']) !== '' ? trim((string)$payload['displayName']) : ('Opérateur ' . strtoupper($newId)),
    'role' => 'admin',
    'active' => true,
    'mustChangePassword' => true,
    'passwordHash' => adminAuthHashPassword($password),
    'passwordHistory' => [],
    'createdAt' => $now,
    'updatedAt' => $now,
  ];

  persistOperatorsOrFail($operators);

  adminAuditLog('admin_operator_created', [
    'operatorId' => $newId,
    'by' => $operator['id'] ?? null,
  ]);

  echo json_encode([
    'ok' => true,
    'operator' => publicOperatorPayload($operators[$newId]),
    'tempPassword' => $password,
  ]);
  exit;
}

$targetId = isset($payload['id']) ? trim((string)$payload['id']) : '';
if ($targetId === '' || !isset($operators[$targetId])) {
  http_response_code(400);
  echo json_encode(['error' => 'Opérateur introuvable']);
  exit;
}

if ($action === 'toggle') {
  $operators[$targetId]['active'] = !$operators[$targetId]['active'];
  $operators[$targetId]['updatedAt'] = gmdate('c');
  persistOperatorsOrFail($operators);

  adminAuditLog($operators[$targetId]['active'] ? 'admin_operator_enabled' : 'admin_operator_disabled', [
    'operatorId' => $targetId,
    'by' => $operator['id'] ?? null,
  ]);

  echo json_encode(['ok' => true, 'operator' => publicOperatorPayload($operators[$targetId])]);
  exit;
}

if ($action === 'reset_password') {
  $password = adminAuthRandomPassword(18);
  [$ok, $err] = adminAuthAdminSetPassword($targetId, $password, true);
  if (!$ok) {
    http_response_code(400);
    echo json_encode(['error' => $err ?: 'Impossible de réinitialiser le mot de passe']);
    exit;
  }
  $operators = loadOperatorsOrFail();

  adminAuditLog('admin_operator_password_reset', [
    'operatorId' => $targetId,
    'by' => $operator['id'] ?? null,
  ]);

  echo json_encode([
    'ok' => true,
    'operator' => publicOperatorPayload($operators[$targetId]),
    'tempPassword' => $password,
  ]);
  exit;
}

if ($action === 'clear_lockout') {
  adminAuthClearLockout($targetId);
  adminAuditLog('admin_operator_lockout_cleared', [
    'operatorId' => $targetId,
    'by' => $operator['id'] ?? null,
  ]);
  echo json_encode(['ok' => true]);
  exit;
}

http_response_code(400);
echo json_encode(['error' => 'Action invalide']);
