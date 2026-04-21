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

// --- File upload ---
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['error' => 'No image file uploaded or upload error']);
  exit;
}

$file = $_FILES['image'];
$maxSize = 10 * 1024 * 1024; // 10MB
if ($file['size'] > $maxSize) {
  http_response_code(400);
  echo json_encode(['error' => 'File too large (max 10MB)']);
  exit;
}

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid file type. Allowed: jpeg, png, webp, gif, svg']);
  exit;
}

$extMap = [
  'image/jpeg' => 'jpg',
  'image/png' => 'png',
  'image/webp' => 'webp',
  'image/gif' => 'gif',
  'image/svg+xml' => 'svg',
];
$ext = $extMap[$mimeType] ?? 'jpg';

// Target folder from query param, default to "uploads"
$folder = isset($_GET['folder']) ? trim($_GET['folder']) : 'uploads';
$folder = preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $folder);
$folder = trim($folder, '/');

$uploadDir = __DIR__ . '/../../images/' . $folder;
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$basename = pathinfo($file['name'], PATHINFO_FILENAME);
$basename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $basename);
$filename = $basename . '_' . substr(uniqid(), -6) . '.' . $ext;

$destPath = $uploadDir . '/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to save file']);
  exit;
}

$publicUrl = '/images/' . $folder . '/' . $filename;

echo json_encode([
  'ok' => true,
  'url' => $publicUrl,
  'filename' => $filename,
  'size' => $file['size'],
  'type' => $mimeType,
]);
