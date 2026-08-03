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
rateLimitCheck('admission-submit', 10, 3600);

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON body']);
  exit;
}

// Validate required fields
$required = ['studentFirstName', 'studentLastName', 'studentBirthdate', 'desiredClass', 'parentFirstName', 'parentLastName', 'parentEmail', 'parentPhone'];
foreach ($required as $field) {
  if (empty($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === '') {
    http_response_code(400);
    echo json_encode(['error' => "Missing required field: $field"]);
    exit;
  }
}

// Validate email
if (!filter_var($data['parentEmail'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid email address']);
  exit;
}

// Generate reference
$year = date('Y');
$random = random_int(100000, 999999);
$reference = "ADM-{$year}-{$random}";

// Load existing admissions
$projectRoot = dirname(__DIR__, 2);
$dataDir = $projectRoot . '/data';
$admissionsFile = $dataDir . '/admissions.json';

if (!is_dir($dataDir)) {
  mkdir($dataDir, 0755, true);
}

$admissions = [];
if (file_exists($admissionsFile)) {
  $json = file_get_contents($admissionsFile);
  if ($json !== false) {
    $decoded = json_decode($json, true);
    if (is_array($decoded)) {
      $admissions = $decoded;
    }
  }
}

// Create new admission entry
$newAdmission = [
  'reference' => $reference,
  'studentFirstName' => trim($data['studentFirstName']),
  'studentLastName' => trim($data['studentLastName']),
  'studentBirthdate' => trim($data['studentBirthdate']),
  'studentGender' => isset($data['studentGender']) ? trim($data['studentGender']) : '',
  'currentSchool' => isset($data['currentSchool']) ? trim($data['currentSchool']) : '',
  'desiredClass' => trim($data['desiredClass']),
  'parentFirstName' => trim($data['parentFirstName']),
  'parentLastName' => trim($data['parentLastName']),
  'parentEmail' => trim($data['parentEmail']),
  'parentPhone' => trim($data['parentPhone']),
  'parentAddress' => isset($data['parentAddress']) ? trim($data['parentAddress']) : '',
  'relationship' => isset($data['relationship']) ? trim($data['relationship']) : '',
  'message' => isset($data['message']) ? trim($data['message']) : '',
  'status' => 'new',
  'adminNotes' => '',
  'publicNotes' => '',
  'processedAt' => null,
  'interviewDate' => null,
  'createdAt' => gmdate('c'),
];

$admissions[] = $newAdmission;

// Save to file
$encoded = json_encode($admissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (file_put_contents($admissionsFile, $encoded, LOCK_EX) === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to save admission submission']);
  exit;
}

echo json_encode([
  'ok' => true,
  'reference' => $reference,
]);
