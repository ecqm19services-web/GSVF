<?php

function adminAuditActorFromRequest() {
  $operatorId = $_SERVER['CPVF_ADMIN_OPERATOR_ID'] ?? '';
  if (is_string($operatorId) && $operatorId !== '') {
    return $operatorId;
  }

  $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if (preg_match('/^(Basic|Bearer)\s+(.+)$/i', $authHeader, $m)) {
    $decoded = base64_decode($m[2]);
    if ($decoded && strpos($decoded, ':') !== false) {
      [$user] = explode(':', $decoded, 2);
      if (is_string($user) && $user !== '') {
        return $user;
      }
    }
  }

  $phpAuthUser = $_SERVER['PHP_AUTH_USER'] ?? '';
  if (is_string($phpAuthUser) && $phpAuthUser !== '') {
    return $phpAuthUser;
  }

  return 'unknown';
}

function adminAuditLog($action, $meta = []) {
  $logDir = __DIR__ . '/../logs/admin-actions';
  if (!is_dir($logDir) && !mkdir($logDir, 0755, true) && !is_dir($logDir)) {
    return;
  }

  $line = [
    'timestamp' => gmdate('c'),
    'action' => (string)$action,
    'actor' => adminAuditActorFromRequest(),
    'ip' => (string)($_SERVER['REMOTE_ADDR'] ?? ''),
    'userAgent' => (string)($_SERVER['HTTP_USER_AGENT'] ?? ''),
    'meta' => is_array($meta) ? $meta : ['value' => $meta],
  ];

  $encoded = json_encode($line, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($encoded === false) {
    return;
  }

  $logFile = $logDir . '/' . gmdate('Y-m-d') . '.txt';
  @file_put_contents($logFile, $encoded . PHP_EOL, FILE_APPEND | LOCK_EX);
}
