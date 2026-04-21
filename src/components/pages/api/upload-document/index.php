<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/admin-auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

adminAuthenticateOrFail();

if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['error' => 'Aucun document PDF reçu']);
  exit;
}

$file = $_FILES['document'];
$maxSize = 15 * 1024 * 1024;
if ($file['size'] > $maxSize) {
  http_response_code(400);
  echo json_encode(['error' => 'Fichier trop volumineux (max 15MB)']);
  exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if ($mimeType !== 'application/pdf') {
  http_response_code(400);
  echo json_encode(['error' => 'Seuls les fichiers PDF sont autorisés']);
  exit;
}

$folder = isset($_GET['folder']) ? trim((string)$_GET['folder']) : 'documents';
$folder = preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $folder);
$folder = trim($folder, '/');
if ($folder === '') {
  $folder = 'documents';
}

$uploadDir = __DIR__ . '/../../documents/' . $folder;
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0755, true);
}

$basename = pathinfo($file['name'], PATHINFO_FILENAME);
$basename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $basename);
$filename = $basename . '_' . substr(uniqid(), -8) . '.pdf';

$destPath = $uploadDir . '/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
  http_response_code(500);
  echo json_encode(['error' => 'Impossible d\'enregistrer le document']);
  exit;
}

$publicUrl = '/documents/' . $folder . '/' . $filename;

echo json_encode([
  'ok' => true,
  'url' => $publicUrl,
  'filename' => $filename,
  'size' => $file['size'],
  'type' => $mimeType,
]);
