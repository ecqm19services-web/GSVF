<?php
/**
 * API Suivi - Permet aux visiteurs de suivre leurs demandes
 * Format référence: CONT-XXXX-XXXX (contact) ou ADM-XXXX-XXXX (admission)
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$reference = isset($_GET['reference']) ? trim(strtoupper($_GET['reference'])) : '';

// Validation du format
if (!preg_match('/^(CONT|ADM)-\d{4}-\d{4}$/', $reference)) {
    http_response_code(400);
    echo json_encode(['error' => 'Format de référence invalide. Utilisez CONT-XXXX-XXXX ou ADM-XXXX-XXXX']);
    exit;
}

$projectRoot = dirname(__DIR__, 2);
$dataDir = $projectRoot . '/data';
$type = str_starts_with($reference, 'CONT') ? 'contact' : 'admission';
$dataFile = $type === 'contact' ? $dataDir . '/contacts.json' : $dataDir . '/admissions.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Load data
$items = [];
if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);
    if ($json !== false) {
        $decoded = json_decode($json, true);
        if (is_array($decoded)) {
            $items = $decoded;
        }
    }
}

// Find the item by reference
$submission = null;
foreach ($items as $item) {
    if (isset($item['reference']) && $item['reference'] === $reference) {
        $submission = $item;
        break;
    }
}

if ($submission === null) {
    http_response_code(404);
    echo json_encode(['error' => 'Aucune demande trouvée avec cette référence']);
    exit;
}

// Nettoyer les données sensibles avant envoi au client
$safeSubmission = [
    '$id' => $submission['reference'] ?? $reference,
    '$createdAt' => $submission['createdAt'] ?? '',
    'reference' => $submission['reference'] ?? $reference,
    'status' => $submission['status'] ?? 'new',
    'type' => $type,
];

// Champs spécifiques selon le type
if ($type === 'contact') {
    $safeSubmission['subject'] = $submission['subject'] ?? '';
    $safeSubmission['message'] = $submission['message'] ?? '';
} else {
    $safeSubmission['studentFirstName'] = $submission['studentFirstName'] ?? '';
    $safeSubmission['studentLastName'] = $submission['studentLastName'] ?? '';
    $safeSubmission['level'] = $submission['level'] ?? '';
    $safeSubmission['publicNotes'] = $submission['publicNotes'] ?? '';
}

$result = [
    'type' => $type,
    'submission' => $safeSubmission,
    'history' => [], // History tracking not implemented in JSON local version
];

echo json_encode($result);
