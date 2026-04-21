<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON body']);
  exit;
}

// Validate required fields
$required = ['firstName', 'lastName', 'email', 'subject', 'message'];
foreach ($required as $field) {
  if (empty($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === '') {
    http_response_code(400);
    echo json_encode(['error' => "Missing required field: $field"]);
    exit;
  }
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid email address']);
  exit;
}

$config = require __DIR__ . '/../../_secure/appwrite-config.php';

// Generate reference
$year = date('Y');
$random = rand(1000, 9999);
$reference = "CONT-{$year}-{$random}";

// Appwrite request helper
function appwriteRequest($method, $url, $config, $body = null) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
  curl_setopt($ch, CURLOPT_TIMEOUT, 15);
  $headers = [
    'Content-Type: application/json',
    'X-Appwrite-Project: ' . $config['projectId'],
    'X-Appwrite-Key: ' . $config['apiKey'],
  ];
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  if ($body !== null) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  }
  $resp = curl_exec($ch);
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($resp === false) {
    return [$code ?: 500, ['error' => $err ?: 'cURL request failed']];
  }
  $json = json_decode($resp, true);
  if (!is_array($json)) { $json = ['raw' => $resp]; }
  return [$code, $json];
}

$endpoint = rtrim($config['endpoint'], '/');
$db  = $config['databaseId'];
$col = 'contact_submissions';

$docData = [
  'reference'  => $reference,
  'firstName'  => trim($data['firstName']),
  'lastName'   => trim($data['lastName']),
  'email'      => trim($data['email']),
  'phone'      => isset($data['phone']) ? trim($data['phone']) : '',
  'subject'    => trim($data['subject']),
  'message'    => trim($data['message']),
  'status'     => 'new',
];

$createUrl = "{$endpoint}/databases/{$db}/collections/{$col}/documents";
$body = ['documentId' => 'unique()', 'data' => $docData];

[$code, $result] = appwriteRequest('POST', $createUrl, $config, $body);

if ($code >= 400) {
  http_response_code($code);
  echo json_encode(['error' => $result['message'] ?? 'Failed to save contact submission', 'details' => $result]);
  exit;
}

echo json_encode([
  'ok' => true,
  'reference' => $reference,
]);
