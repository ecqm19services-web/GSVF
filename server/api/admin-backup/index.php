<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function authenticateAdmin() {
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
      $parts = explode(':', $line, 2);
      if (count($parts) !== 2) {
        continue;
      }
      [$storedUser, $storedHash] = $parts;
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
}

function ensureBackupFolder($path) {
  if (is_dir($path)) {
    return true;
  }
  return mkdir($path, 0755, true);
}

function shouldSkipPath($path) {
  $normalized = str_replace('\\', '/', $path);
  $skipFragments = ['/node_modules/', '/.git/', '/backups/', '/.windsurf/'];

  foreach ($skipFragments as $fragment) {
    if (strpos($normalized, $fragment) !== false) {
      return true;
    }
  }

  return false;
}

function createBackupZip($projectRoot, $backupFilePath) {
  $zip = new ZipArchive();
  if ($zip->open($backupFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    return false;
  }

  $iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($projectRoot, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::LEAVES_ONLY
  );

  foreach ($iterator as $fileInfo) {
    $filePath = $fileInfo->getPathname();
    if (!$fileInfo->isFile()) {
      continue;
    }

    if (shouldSkipPath($filePath)) {
      continue;
    }

    $relativePath = ltrim(str_replace(str_replace('\\', '/', $projectRoot), '', str_replace('\\', '/', $filePath)), '/');

    if ($relativePath === '' || strpos($relativePath, 'backups/') === 0) {
      continue;
    }

    $zip->addFile($filePath, $relativePath);
  }

  $zip->close();
  return true;
}

authenticateAdmin();

$projectRoot = dirname(__DIR__, 2);
$backupDir = $projectRoot . '/backups';

if (!ensureBackupFolder($backupDir)) {
  http_response_code(500);
  echo json_encode(['error' => 'Unable to create backups directory']);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $timestamp = gmdate('Y-m-d_H-i-s');
  $fileName = 'backup-site-' . $timestamp . '.zip';
  $backupFilePath = $backupDir . '/' . $fileName;

  if (!createBackupZip($projectRoot, $backupFilePath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to create backup ZIP']);
    exit;
  }

  echo json_encode([
    'ok' => true,
    'fileName' => $fileName,
    'downloadUrl' => '/api/admin-backup/?file=' . rawurlencode($fileName),
    'savedPath' => '/backups/' . $fileName,
    'createdAt' => gmdate('c'),
  ]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $file = isset($_GET['file']) ? trim((string)$_GET['file']) : '';
  if ($file === '' || !preg_match('/^[a-zA-Z0-9._-]+\.zip$/', $file)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid file parameter']);
    exit;
  }

  $target = $backupDir . '/' . $file;
  if (!is_file($target)) {
    http_response_code(404);
    echo json_encode(['error' => 'Backup file not found']);
    exit;
  }

  header_remove('Content-Type');
  header('Content-Type: application/zip');
  header('Content-Disposition: attachment; filename="' . basename($file) . '"');
  header('Content-Length: ' . filesize($target));
  readfile($target);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
