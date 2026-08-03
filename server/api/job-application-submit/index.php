<?php
header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_WARNING);
ini_set('display_errors', '0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

require_once __DIR__ . '/../../_secure/rate-limit.php';
rateLimitCheck('job-application-submit', 10, 3600);

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON body']);
  exit;
}

$required = ['offerId', 'offerTitle', 'firstName', 'lastName', 'email', 'phone', 'message'];
foreach ($required as $field) {
  if (empty($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === '') {
    http_response_code(400);
    echo json_encode(['error' => "Missing required field: {$field}"]);
    exit;
  }
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid email address']);
  exit;
}

// Generate reference
$year = date('Y');
$random = random_int(100000, 999999);
$reference = "JOB-{$year}-{$random}";

// Load existing contacts (job applications stored as contacts)
$projectRoot = dirname(__DIR__, 2);
$dataDir = $projectRoot . '/data';
$contactsFile = $dataDir . '/contacts.json';

if (!is_dir($dataDir)) {
  mkdir($dataDir, 0755, true);
}

$contacts = [];
if (file_exists($contactsFile)) {
  $json = file_get_contents($contactsFile);
  if ($json !== false) {
    $decoded = json_decode($json, true);
    if (is_array($decoded)) {
      $contacts = $decoded;
    }
  }
}

// Create new contact entry for job application
$extra = "Offre: " . trim($data['offerTitle']) . "\n";
$extra .= "ID offre: " . trim($data['offerId']) . "\n";
if (!empty($data['cvUrl']) && is_string($data['cvUrl'])) {
  $extra .= "CV: " . trim($data['cvUrl']) . "\n";
}
$extra .= "\nMessage candidat:\n" . trim($data['message']);

$newContact = [
  'reference' => $reference,
  'firstName' => trim($data['firstName']),
  'lastName' => trim($data['lastName']),
  'email' => trim($data['email']),
  'phone' => trim($data['phone']),
  'subject' => 'Candidature: ' . trim($data['offerTitle']),
  'message' => $extra,
  'status' => 'new',
  'adminNotes' => '',
  'processedAt' => null,
  'createdAt' => gmdate('c'),
];

$contacts[] = $newContact;

// Save to file
$encoded = json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (file_put_contents($contactsFile, $encoded, LOCK_EX) === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to save job application']);
  exit;
}

echo json_encode([
  'ok' => true,
  'reference' => $reference,
]);
