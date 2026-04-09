<?php

const ADMIN_OPERATORS_FILE = __DIR__ . '/admin-operators.json';
const ADMIN_LOCKOUTS_FILE = __DIR__ . '/admin-lockouts.json';
const ADMIN_LEGACY_HTPASSWD_FILE = __DIR__ . '/.htpasswd';
const ADMIN_MAX_FAILED_ATTEMPTS = 10;
const ADMIN_LOCKOUT_SECONDS = 1800;
const ADMIN_PASSWORD_MIN_LENGTH = 16;
const ADMIN_PASSWORD_HISTORY_LIMIT = 10;

function adminAuthJsonResponse($statusCode, $body, $withChallenge = false) {
  if ($withChallenge) {
    header('WWW-Authenticate: Basic realm="Admin API"');
  }

  http_response_code($statusCode);
  echo json_encode($body);
  exit;
}

function adminAuthNowUnix() {
  return time();
}

function adminAuthReadJsonFile($path, $defaultValue) {
  if (!is_file($path)) {
    return $defaultValue;
  }

  $raw = @file_get_contents($path);
  if ($raw === false || trim($raw) === '') {
    return $defaultValue;
  }

  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : $defaultValue;
}

function adminAuthWriteJsonFile($path, $value) {
  $encoded = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($encoded === false) {
    return false;
  }

  return @file_put_contents($path, $encoded, LOCK_EX) !== false;
}

function adminAuthHashPassword($plainPassword) {
  return password_hash($plainPassword, PASSWORD_BCRYPT);
}

function adminAuthHashMatches($plainPassword, $storedHash) {
  if (!is_string($storedHash) || $storedHash === '') {
    return false;
  }

  return password_verify($plainPassword, $storedHash) || crypt($plainPassword, $storedHash) === $storedHash;
}

function adminAuthRandomPassword($length = 18) {
  $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*+-_=.?';
  $out = '';
  $alphabetLen = strlen($alphabet);
  if ($alphabetLen === 0) {
    return bin2hex(random_bytes((int)ceil($length / 2)));
  }

  while (strlen($out) < $length) {
    $bytes = random_bytes($length);
    foreach (str_split($bytes) as $b) {
      $out .= $alphabet[ord($b) % $alphabetLen];
      if (strlen($out) >= $length) {
        break;
      }
    }
  }

  return $out;
}

function adminAuthGetCredentials() {
  $authUser = $_SERVER['PHP_AUTH_USER'] ?? '';
  $authPass = $_SERVER['PHP_AUTH_PW'] ?? '';

  if ($authUser !== '' && $authPass !== '') {
    return [$authUser, $authPass];
  }

  $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if (!preg_match('/^(Basic|Bearer)\s+(.+)$/i', $authHeader, $m)) {
    return [null, null];
  }

  $decoded = base64_decode($m[2], true);
  if ($decoded === false || strpos($decoded, ':') === false) {
    return [null, null];
  }

  return explode(':', $decoded, 2);
}

function adminAuthLoadOperators() {
  if (is_file(ADMIN_OPERATORS_FILE)) {
    $payload = adminAuthReadJsonFile(ADMIN_OPERATORS_FILE, []);
    $operators = isset($payload['operators']) && is_array($payload['operators']) ? $payload['operators'] : [];

    $byId = [];
    foreach ($operators as $operator) {
      if (!is_array($operator)) {
        continue;
      }
      $id = isset($operator['id']) ? trim((string)$operator['id']) : '';
      $hash = isset($operator['passwordHash']) ? trim((string)$operator['passwordHash']) : '';
      if ($id === '' || $hash === '') {
        continue;
      }
      $byId[$id] = [
        'id' => $id,
        'displayName' => isset($operator['displayName']) ? (string)$operator['displayName'] : $id,
        'role' => isset($operator['role']) ? (string)$operator['role'] : 'admin',
        'passwordHash' => $hash,
        'active' => !array_key_exists('active', $operator) || (bool)$operator['active'],
        'mustChangePassword' => !empty($operator['mustChangePassword']),
        'passwordHistory' => isset($operator['passwordHistory']) && is_array($operator['passwordHistory']) ? $operator['passwordHistory'] : [],
        'createdAt' => isset($operator['createdAt']) ? (string)$operator['createdAt'] : null,
        'updatedAt' => isset($operator['updatedAt']) ? (string)$operator['updatedAt'] : null,
      ];
    }

    return $byId;
  }

  $byId = [];
  if (!is_file(ADMIN_LEGACY_HTPASSWD_FILE)) {
    return $byId;
  }

  $lines = file(ADMIN_LEGACY_HTPASSWD_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  if (!is_array($lines)) {
    return $byId;
  }

  foreach ($lines as $line) {
    $parts = explode(':', $line, 2);
    if (count($parts) !== 2) {
      continue;
    }
    [$id, $hash] = $parts;
    $id = trim((string)$id);
    $hash = trim((string)$hash);
    if ($id === '' || $hash === '') {
      continue;
    }

    $byId[$id] = [
      'id' => $id,
      'displayName' => $id,
      'role' => 'admin',
      'passwordHash' => $hash,
      'active' => true,
      'mustChangePassword' => false,
      'passwordHistory' => [],
      'createdAt' => gmdate('c'),
      'updatedAt' => null,
    ];
  }

  return $byId;
}

function adminAuthSaveOperators($operatorsById) {
  if (!is_array($operatorsById)) {
    return false;
  }

  $existing = adminAuthReadJsonFile(ADMIN_OPERATORS_FILE, []);
  $result = [
    'generatedAt' => isset($existing['generatedAt']) ? (string)$existing['generatedAt'] : gmdate('c'),
    'lockPolicy' => [
      'maxFailedAttempts' => ADMIN_MAX_FAILED_ATTEMPTS,
      'lockoutMinutes' => (int)(ADMIN_LOCKOUT_SECONDS / 60),
    ],
    'operators' => [],
  ];

  foreach ($operatorsById as $operator) {
    if (!is_array($operator)) {
      continue;
    }
    $id = isset($operator['id']) ? trim((string)$operator['id']) : '';
    $hash = isset($operator['passwordHash']) ? trim((string)$operator['passwordHash']) : '';
    if ($id === '' || $hash === '') {
      continue;
    }

    $history = [];
    if (isset($operator['passwordHistory']) && is_array($operator['passwordHistory'])) {
      foreach ($operator['passwordHistory'] as $historyHash) {
        if (is_string($historyHash) && trim($historyHash) !== '') {
          $history[] = trim($historyHash);
        }
      }
    }

    $result['operators'][] = [
      'id' => $id,
      'displayName' => isset($operator['displayName']) ? (string)$operator['displayName'] : $id,
      'role' => isset($operator['role']) ? (string)$operator['role'] : 'admin',
      'active' => !array_key_exists('active', $operator) || (bool)$operator['active'],
      'mustChangePassword' => !empty($operator['mustChangePassword']),
      'passwordHash' => $hash,
      'passwordHistory' => array_slice($history, 0, ADMIN_PASSWORD_HISTORY_LIMIT),
      'createdAt' => isset($operator['createdAt']) ? (string)$operator['createdAt'] : gmdate('c'),
      'updatedAt' => isset($operator['updatedAt']) ? (string)$operator['updatedAt'] : null,
    ];
  }

  return adminAuthWriteJsonFile(ADMIN_OPERATORS_FILE, $result);
}

function adminAuthPasswordPolicyError($operatorId, $plainPassword, $operatorsById, $currentOperator) {
  if (!is_string($plainPassword) || strlen($plainPassword) < ADMIN_PASSWORD_MIN_LENGTH) {
    return 'Le mot de passe doit contenir au moins 16 caractères.';
  }

  if (!preg_match('/[A-Z]/', $plainPassword) || !preg_match('/[a-z]/', $plainPassword) || !preg_match('/[0-9]/', $plainPassword) || !preg_match('/[^A-Za-z0-9]/', $plainPassword)) {
    return 'Le mot de passe doit contenir majuscule, minuscule, chiffre et caractère spécial.';
  }

  $lowerPassword = strtolower($plainPassword);
  $forbiddenFragments = [
    strtolower((string)$operatorId),
    'admin',
    'cpvf',
    'vision',
    'ecole',
    'college',
    date('Y'),
    date('Y', strtotime('-1 year')),
    date('Y', strtotime('+1 year')),
  ];
  foreach ($forbiddenFragments as $fragment) {
    if (strlen($fragment) >= 3 && strpos($lowerPassword, $fragment) !== false) {
      return 'Le mot de passe contient un motif interdit.';
    }
  }

  foreach ($operatorsById as $operator) {
    if (!is_array($operator) || !isset($operator['passwordHash'])) {
      continue;
    }
    if (adminAuthHashMatches($plainPassword, (string)$operator['passwordHash'])) {
      return 'Ce mot de passe est déjà utilisé par un autre opérateur.';
    }
  }

  if (is_array($currentOperator) && isset($currentOperator['passwordHistory']) && is_array($currentOperator['passwordHistory'])) {
    foreach ($currentOperator['passwordHistory'] as $historyHash) {
      if (is_string($historyHash) && adminAuthHashMatches($plainPassword, $historyHash)) {
        return 'Le mot de passe a déjà été utilisé pour ce compte.';
      }
    }
  }

  return null;
}

function adminAuthChangePassword($operatorId, $plainPassword) {
  $operatorId = trim((string)$operatorId);
  if ($operatorId === '') {
    return [false, 'Opérateur invalide'];
  }

  $operators = adminAuthLoadOperators();
  $operator = $operators[$operatorId] ?? null;
  if (!is_array($operator)) {
    return [false, 'Compte opérateur introuvable'];
  }

  $policyError = adminAuthPasswordPolicyError($operatorId, (string)$plainPassword, $operators, $operator);
  if (is_string($policyError) && $policyError !== '') {
    return [false, $policyError];
  }

  $newHash = adminAuthHashPassword((string)$plainPassword);
  if (!is_string($newHash) || $newHash === '') {
    return [false, 'Impossible de sécuriser le mot de passe'];
  }

  $history = [];
  if (isset($operator['passwordHistory']) && is_array($operator['passwordHistory'])) {
    foreach ($operator['passwordHistory'] as $historyHash) {
      if (is_string($historyHash) && trim($historyHash) !== '') {
        $history[] = trim($historyHash);
      }
    }
  }
  $currentHash = isset($operator['passwordHash']) ? trim((string)$operator['passwordHash']) : '';
  if ($currentHash !== '') {
    array_unshift($history, $currentHash);
  }
  $history = array_values(array_unique($history));
  $history = array_slice($history, 0, ADMIN_PASSWORD_HISTORY_LIMIT);

  $operators[$operatorId]['passwordHash'] = $newHash;
  $operators[$operatorId]['passwordHistory'] = $history;
  $operators[$operatorId]['mustChangePassword'] = false;
  $operators[$operatorId]['updatedAt'] = gmdate('c');

  if (!adminAuthSaveOperators($operators)) {
    return [false, 'Impossible d\'enregistrer le nouveau mot de passe'];
  }

  return [true, null];
}

function adminAuthAdminSetPassword($operatorId, $newPassword, $forceMustChange = true) {
  $operatorId = trim((string)$operatorId);
  if ($operatorId === '') {
    return [false, 'Opérateur invalide'];
  }

  $operators = adminAuthLoadOperators();
  $operator = $operators[$operatorId] ?? null;
  if (!is_array($operator)) {
    return [false, 'Compte opérateur introuvable'];
  }

  $policyError = adminAuthPasswordPolicyError($operatorId, (string)$newPassword, $operators, $operator);
  if (is_string($policyError) && $policyError !== '') {
    return [false, $policyError];
  }

  $newHash = adminAuthHashPassword((string)$newPassword);
  if (!is_string($newHash) || $newHash === '') {
    return [false, 'Impossible de sécuriser le mot de passe'];
  }

  $history = [];
  if (isset($operator['passwordHistory']) && is_array($operator['passwordHistory'])) {
    foreach ($operator['passwordHistory'] as $historyHash) {
      if (is_string($historyHash) && trim($historyHash) !== '') {
        $history[] = trim($historyHash);
      }
    }
  }
  $currentHash = isset($operator['passwordHash']) ? trim((string)$operator['passwordHash']) : '';
  if ($currentHash !== '') {
    array_unshift($history, $currentHash);
  }
  $history = array_values(array_unique($history));
  $history = array_slice($history, 0, ADMIN_PASSWORD_HISTORY_LIMIT);

  $operators[$operatorId]['passwordHash'] = $newHash;
  $operators[$operatorId]['passwordHistory'] = $history;
  $operators[$operatorId]['mustChangePassword'] = $forceMustChange;
  $operators[$operatorId]['updatedAt'] = gmdate('c');

  if (!adminAuthSaveOperators($operators)) {
    return [false, 'Impossible d\'enregistrer le nouveau mot de passe'];
  }

  adminAuthClearLockout($operatorId);

  return [true, null];
}

function adminAuthLoadLockouts() {
  $payload = adminAuthReadJsonFile(ADMIN_LOCKOUTS_FILE, ['users' => []]);
  if (!isset($payload['users']) || !is_array($payload['users'])) {
    $payload['users'] = [];
  }

  return $payload;
}

function adminAuthSaveLockouts($payload) {
  if (!is_array($payload)) {
    return false;
  }
  if (!isset($payload['users']) || !is_array($payload['users'])) {
    $payload['users'] = [];
  }

  return adminAuthWriteJsonFile(ADMIN_LOCKOUTS_FILE, $payload);
}

function adminAuthIsBlocked($operatorId, &$lockouts = null) {
  $lockouts = is_array($lockouts) ? $lockouts : adminAuthLoadLockouts();
  $record = $lockouts['users'][$operatorId] ?? null;
  if (!is_array($record)) {
    return [false, null];
  }

  $blockedUntil = isset($record['blockedUntil']) ? (int)$record['blockedUntil'] : 0;
  $now = adminAuthNowUnix();
  if ($blockedUntil > $now) {
    return [true, $blockedUntil];
  }

  if ($blockedUntil > 0 && $blockedUntil <= $now) {
    unset($lockouts['users'][$operatorId]);
    adminAuthSaveLockouts($lockouts);
  }

  return [false, null];
}

function adminAuthRegisterFailure($operatorId, $ip) {
  $lockouts = adminAuthLoadLockouts();
  $record = $lockouts['users'][$operatorId] ?? [];
  if (!is_array($record)) {
    $record = [];
  }

  $now = adminAuthNowUnix();
  $blockedUntil = isset($record['blockedUntil']) ? (int)$record['blockedUntil'] : 0;
  if ($blockedUntil > $now) {
    return $blockedUntil;
  }

  $failedCount = isset($record['failedCount']) ? (int)$record['failedCount'] : 0;
  $failedCount++;

  $record['failedCount'] = $failedCount;
  $record['lastFailureAt'] = gmdate('c', $now);
  $record['lastIp'] = (string)$ip;

  if ($failedCount >= ADMIN_MAX_FAILED_ATTEMPTS) {
    $blockedUntil = $now + ADMIN_LOCKOUT_SECONDS;
    $record['blockedUntil'] = $blockedUntil;
    $record['failedCount'] = 0;
  }

  $lockouts['users'][$operatorId] = $record;
  adminAuthSaveLockouts($lockouts);

  return $blockedUntil > $now ? $blockedUntil : null;
}

function adminAuthClearFailures($operatorId) {
  $lockouts = adminAuthLoadLockouts();
  if (!isset($lockouts['users'][$operatorId])) {
    return;
  }

  unset($lockouts['users'][$operatorId]);
  adminAuthSaveLockouts($lockouts);
}

function adminAuthClearLockout($operatorId) {
  $lockouts = adminAuthLoadLockouts();
  if (isset($lockouts['users'][$operatorId])) {
    unset($lockouts['users'][$operatorId]);
    adminAuthSaveLockouts($lockouts);
  }
}

function adminAuthenticateOrFail($enforcePasswordReady = true) {
  [$authUser, $authPass] = adminAuthGetCredentials();
  if (!is_string($authUser) || !is_string($authPass) || $authUser === '' || $authPass === '') {
    adminAuthJsonResponse(401, ['error' => 'Authentication required'], true);
  }

  $operators = adminAuthLoadOperators();
  $operator = $operators[$authUser] ?? null;
  if (!is_array($operator) || empty($operator['active'])) {
    adminAuthJsonResponse(401, ['error' => 'Identifiants invalides'], true);
  }

  [$isBlocked, $blockedUntil] = adminAuthIsBlocked($authUser);
  if ($isBlocked) {
    $retryAfter = max(1, (int)$blockedUntil - adminAuthNowUnix());
    header('Retry-After: ' . $retryAfter);
    adminAuthJsonResponse(423, [
      'error' => 'Compte temporairement bloqué après trop de tentatives',
      'lockedUntil' => gmdate('c', (int)$blockedUntil),
      'retryAfterSeconds' => $retryAfter,
    ]);
  }

  $storedHash = (string)$operator['passwordHash'];
  $verified = adminAuthHashMatches($authPass, $storedHash);
  if (!$verified) {
    $blockedOnFailureUntil = adminAuthRegisterFailure($authUser, $_SERVER['REMOTE_ADDR'] ?? '');
    if (is_int($blockedOnFailureUntil) && $blockedOnFailureUntil > adminAuthNowUnix()) {
      $retryAfter = max(1, $blockedOnFailureUntil - adminAuthNowUnix());
      header('Retry-After: ' . $retryAfter);
      adminAuthJsonResponse(423, [
        'error' => 'Compte temporairement bloqué après trop de tentatives',
        'lockedUntil' => gmdate('c', $blockedOnFailureUntil),
        'retryAfterSeconds' => $retryAfter,
      ]);
    }

    adminAuthJsonResponse(401, ['error' => 'Identifiants invalides'], true);
  }

  adminAuthClearFailures($authUser);
  $_SERVER['CPVF_ADMIN_OPERATOR_ID'] = $operator['id'];
  $_SERVER['CPVF_ADMIN_OPERATOR_NAME'] = $operator['displayName'];

  if ($enforcePasswordReady && !empty($operator['mustChangePassword'])) {
    adminAuthJsonResponse(428, [
      'error' => 'Changement de mot de passe obligatoire avant accès.',
      'requirePasswordChange' => true,
    ]);
  }

  return $operator;
}

function adminCurrentOperatorId() {
  $operatorId = $_SERVER['CPVF_ADMIN_OPERATOR_ID'] ?? '';
  return is_string($operatorId) && $operatorId !== '' ? $operatorId : null;
}

?>
