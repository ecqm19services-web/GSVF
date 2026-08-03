<?php
/**
 * Limiteur de débit simple par IP (stockage fichier JSON dans logs/).
 * Utilisé par les endpoints publics pour limiter le spam et le brute-force.
 */
function rateLimitCheck($key, $max, $windowSeconds) {
  // Un niveau au-dessus de _secure = racine du site (là où vivent data/ et logs/)
  $dir = dirname(__DIR__) . '/logs';
  if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
  }
  $file = $dir . '/rate-limits.json';
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $now = time();

  $data = [];
  if (file_exists($file)) {
    $raw = @file_get_contents($file);
    $decoded = json_decode((string)$raw, true);
    if (is_array($decoded)) {
      $data = $decoded;
    }
  }

  // Purge des entrées expirées
  foreach ($data as $k => $entry) {
    if (is_array($entry) && isset($entry['expires']) && $entry['expires'] < $now) {
      unset($data[$k]);
    }
  }

  $entryKey = $key . '|' . $ip;
  if (!isset($data[$entryKey]) || !is_array($data[$entryKey])) {
    $data[$entryKey] = ['count' => 0, 'expires' => $now + $windowSeconds];
  }

  if ($data[$entryKey]['count'] >= $max) {
    $retryAfter = max(1, $data[$entryKey]['expires'] - $now);
    @file_put_contents($file, json_encode($data), LOCK_EX);
    http_response_code(429);
    header('Retry-After: ' . $retryAfter);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Trop de requêtes. Veuillez réessayer plus tard.']);
    exit;
  }

  $data[$entryKey]['count']++;
  @file_put_contents($file, json_encode($data), LOCK_EX);
}
