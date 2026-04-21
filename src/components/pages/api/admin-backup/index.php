<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-audit-log.php';
require_once __DIR__ . '/../../_secure/admin-auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function ensureBackupFolder($path) {
  if (is_dir($path)) {
    return true;
  }
  return mkdir($path, 0755, true);
}

function jsonInput() {
  $raw = file_get_contents('php://input');
  if (!$raw) {
    return [];
  }

  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

function normalizeZipPath($path) {
  $path = str_replace('\\', '/', (string)$path);
  $path = ltrim($path, '/');
  while (strpos($path, './') === 0) {
    $path = substr($path, 2);
  }
  return $path;
}

function isValidRestorePath($relativePath) {
  if ($relativePath === '' || strpos($relativePath, "\0") !== false) {
    return false;
  }

  if (preg_match('#(^|/)\.\.(?:/|$)#', $relativePath)) {
    return false;
  }

  return true;
}

function isLevelAPath($relativePath) {
  return strpos($relativePath, 'content/') === 0
    || strpos($relativePath, 'images/uploads/') === 0
    || strpos($relativePath, 'documents/') === 0;
}

function isLevelBPath($relativePath) {
  $blockedPrefixes = [
    '_secure/',
    'backups/',
  ];

  foreach ($blockedPrefixes as $prefix) {
    if (strpos($relativePath, $prefix) === 0) {
      return false;
    }
  }

  return true;
}

function expectedDeveloperCodeForToday() {
  $parts = explode('-', date('d-m-y'));
  if (count($parts) !== 3) {
    return '';
  }

  $hexParts = array_map(function ($part) {
    $dec = (int)$part;
    return str_pad(strtolower(dechex($dec)), 2, '0', STR_PAD_LEFT);
  }, $parts);

  return implode('-', $hexParts);
}

function listBackups($backupDir) {
  $files = glob($backupDir . '/backup-site-*.zip') ?: [];
  usort($files, function ($a, $b) {
    return filemtime($b) <=> filemtime($a);
  });

  $items = [];
  foreach ($files as $path) {
    if (!is_file($path)) {
      continue;
    }

    $name = basename($path);
    $items[] = [
      'fileName' => $name,
      'sizeBytes' => filesize($path),
      'createdAt' => gmdate('c', filemtime($path)),
      'downloadUrl' => '/api/admin-backup/?file=' . rawurlencode($name),
      'savedPath' => '/backups/' . $name,
    ];
  }

  return $items;
}

function restoreFromBackup($projectRoot, $backupZipPath, $mode) {
  $zip = new ZipArchive();
  if ($zip->open($backupZipPath) !== true) {
    return [false, 0, []];
  }

  $restoredCount = 0;
  $targetRoots = [];

  for ($i = 0; $i < $zip->numFiles; $i++) {
    $entryName = $zip->getNameIndex($i);
    if ($entryName === false) {
      continue;
    }

    $relativePath = normalizeZipPath($entryName);
    if (!isValidRestorePath($relativePath)) {
      continue;
    }

    $isDirectory = substr($relativePath, -1) === '/';
    if ($isDirectory) {
      $relativePath = rtrim($relativePath, '/');
      if ($relativePath === '') {
        continue;
      }
    }

    $allowed = $mode === 'A' ? isLevelAPath($relativePath) : isLevelBPath($relativePath);
    if (!$allowed) {
      continue;
    }

    $destPath = $projectRoot . '/' . $relativePath;
    $destDir = $isDirectory ? $destPath : dirname($destPath);
    if (!is_dir($destDir) && !mkdir($destDir, 0755, true) && !is_dir($destDir)) {
      continue;
    }

    if ($isDirectory) {
      continue;
    }

    $stream = $zip->getStream($entryName);
    if (!$stream) {
      continue;
    }

    $out = fopen($destPath, 'wb');
    if (!$out) {
      fclose($stream);
      continue;
    }

    stream_copy_to_stream($stream, $out);
    fclose($stream);
    fclose($out);

    $restoredCount++;
    $root = explode('/', $relativePath)[0] ?? '';
    if ($root !== '') {
      $targetRoots[$root] = true;
    }
  }

  $zip->close();
  return [true, $restoredCount, array_keys($targetRoots)];
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

adminAuthenticateOrFail();

$projectRoot = dirname(__DIR__, 2);
$backupDir = $projectRoot . '/backups';

if (!ensureBackupFolder($backupDir)) {
  http_response_code(500);
  echo json_encode(['error' => 'Unable to create backups directory']);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = jsonInput();
  $action = isset($input['action']) ? trim((string)$input['action']) : '';

  if ($action === 'restore') {
    $fileName = isset($input['fileName']) ? trim((string)$input['fileName']) : '';
    $mode = isset($input['mode']) ? strtoupper(trim((string)$input['mode'])) : 'A';
    $confirmationText = isset($input['confirmationText']) ? trim((string)$input['confirmationText']) : '';
    $developerCode = isset($input['developerCode']) ? trim((string)$input['developerCode']) : '';

    if ($fileName === '' || !preg_match('/^[a-zA-Z0-9._-]+\.zip$/', $fileName)) {
      http_response_code(400);
      adminAuditLog('admin_restore_rejected', ['reason' => 'invalid_filename']);
      echo json_encode(['error' => 'Nom de sauvegarde invalide']);
      exit;
    }

    if ($mode !== 'A' && $mode !== 'B') {
      http_response_code(400);
      adminAuditLog('admin_restore_rejected', ['reason' => 'invalid_mode', 'fileName' => $fileName]);
      echo json_encode(['error' => 'Mode de restauration invalide']);
      exit;
    }

    $expectedConfirmation = $mode === 'A' ? 'RESTAURER NIVEAU A' : 'RESTAURER NIVEAU B';
    if ($confirmationText !== $expectedConfirmation) {
      http_response_code(400);
      adminAuditLog('admin_restore_rejected', ['reason' => 'invalid_confirmation', 'fileName' => $fileName, 'mode' => $mode]);
      echo json_encode(['error' => 'Confirmation de restauration invalide']);
      exit;
    }

    if ($mode === 'B') {
      $expectedCode = expectedDeveloperCodeForToday();
      if ($developerCode === '' || !hash_equals($expectedCode, strtolower($developerCode))) {
        http_response_code(403);
        adminAuditLog('admin_restore_rejected', ['reason' => 'invalid_developer_code', 'fileName' => $fileName, 'mode' => $mode]);
        echo json_encode(['error' => 'Code développeur invalide']);
        exit;
      }
    }

    $zipPath = $backupDir . '/' . $fileName;
    if (!is_file($zipPath)) {
      http_response_code(404);
      adminAuditLog('admin_restore_rejected', ['reason' => 'backup_not_found', 'fileName' => $fileName, 'mode' => $mode]);
      echo json_encode(['error' => 'Sauvegarde introuvable']);
      exit;
    }

    $lockFile = $backupDir . '/.restore.lock';
    if (is_file($lockFile)) {
      http_response_code(409);
      adminAuditLog('admin_restore_rejected', ['reason' => 'restore_lock', 'fileName' => $fileName, 'mode' => $mode]);
      echo json_encode(['error' => 'Une restauration est déjà en cours']);
      exit;
    }

    file_put_contents($lockFile, gmdate('c') . "\n");

    try {
      [$ok, $restoredCount, $restoredTargets] = restoreFromBackup($projectRoot, $zipPath, $mode);
      if (!$ok) {
        http_response_code(500);
        adminAuditLog('admin_restore_failed', ['fileName' => $fileName, 'mode' => $mode]);
        echo json_encode(['error' => 'Impossible de lire la sauvegarde ZIP']);
        exit;
      }

      adminAuditLog('admin_restore_success', [
        'fileName' => $fileName,
        'mode' => $mode,
        'restoredCount' => $restoredCount,
        'restoredTargets' => $restoredTargets,
      ]);

      echo json_encode([
        'ok' => true,
        'fileName' => $fileName,
        'mode' => $mode,
        'restoredCount' => $restoredCount,
        'restoredTargets' => $restoredTargets,
        'createdAt' => gmdate('c'),
      ]);
      exit;
    } finally {
      if (is_file($lockFile)) {
        @unlink($lockFile);
      }
    }
  }

  $timestamp = gmdate('Y-m-d_H-i-s');
  $fileName = 'backup-site-' . $timestamp . '.zip';
  $backupFilePath = $backupDir . '/' . $fileName;

  if (!createBackupZip($projectRoot, $backupFilePath)) {
    http_response_code(500);
    adminAuditLog('admin_backup_failed', ['fileName' => $fileName]);
    echo json_encode(['error' => 'Unable to create backup ZIP']);
    exit;
  }

  adminAuditLog('admin_backup_created', ['fileName' => $fileName]);

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
  if (isset($_GET['action']) && $_GET['action'] === 'list') {
    echo json_encode([
      'ok' => true,
      'backups' => listBackups($backupDir),
    ]);
    exit;
  }

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
