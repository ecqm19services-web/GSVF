<?php
/**
 * API Suivi - Permet aux visiteurs de suivre leurs demandes
 * Format référence: CONT-XXXX-XXXX (contact) ou ADM-XXXX-XXXX (admission)
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../_secure/appwrite-config.php';

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

$configPath = __DIR__ . '/../../_secure/appwrite-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Configuration non disponible']);
    exit;
}

$config = require $configPath;
if (!is_array($config) || !isset($config['endpoint'], $config['projectId'], $config['apiKey'], $config['databaseId'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Configuration invalide']);
    exit;
}

$endpoint = rtrim($config['endpoint'], '/');
$projectId = $config['projectId'];
$apiKey = $config['apiKey'];
$databaseId = $config['databaseId'];

// Déterminer la collection selon le type
$type = str_starts_with($reference, 'CONT') ? 'contact' : 'admission';
$collectionId = $type === 'contact' 
    ? ($config['contactSubmissionsCollectionId'] ?? 'contact_submissions')
    : ($config['admissionSubmissionsCollectionId'] ?? 'admission_submissions');

// Rechercher le document par référence
$query = urlencode(json_encode(['method' => 'equal', 'attribute' => 'reference', 'values' => [$reference]]));
$limit = urlencode(json_encode(['method' => 'limit', 'values' => [1]]));

$url = "{$endpoint}/databases/{$databaseId}/collections/{$collectionId}/documents?queries[]={$query}&queries[]={$limit}";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Appwrite-Project: ' . $projectId,
    'X-Appwrite-Key: ' . $apiKey,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion: ' . $error]);
    exit;
}

if ($httpCode === 404 || $httpCode === 204) {
    http_response_code(404);
    echo json_encode(['error' => 'Aucune demande trouvée avec cette référence']);
    exit;
}

if ($httpCode >= 400) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la recherche']);
    exit;
}

$data = json_decode($response, true);
if (empty($data['documents'][0])) {
    http_response_code(404);
    echo json_encode(['error' => 'Aucune demande trouvée avec cette référence']);
    exit;
}

$submission = $data['documents'][0];

// Récupérer l'historique des statuts si disponible
$history = [];
$statusHistoryCollectionId = $type === 'contact'
    ? ($config['contactStatusHistoryCollectionId'] ?? 'contact_status_history')
    : ($config['admissionStatusHistoryCollectionId'] ?? 'admission_status_history');

$historyQuery = urlencode(json_encode(['method' => 'equal', 'attribute' => 'submissionId', 'values' => [$submission['$id']]]));
$historySort = urlencode(json_encode(['method' => 'orderAsc', 'attribute' => '$createdAt']));
$historyUrl = "{$endpoint}/databases/{$databaseId}/collections/{$statusHistoryCollectionId}/documents?queries[]={$historyQuery}&queries[]={$historySort}";

$ch2 = curl_init($historyUrl);
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_TIMEOUT, 10);
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Appwrite-Project: ' . $projectId,
    'X-Appwrite-Key: ' . $apiKey,
]);
$historyResponse = curl_exec($ch2);
$historyHttpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

if ($historyHttpCode < 400) {
    $historyData = json_decode($historyResponse, true);
    $history = $historyData['documents'] ?? [];
}

// Nettoyer les données sensibles avant envoi au client
$safeSubmission = [
    '$id' => $submission['$id'],
    '$createdAt' => $submission['$createdAt'],
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
    'history' => array_map(function($item) {
        return [
            '$id' => $item['$id'],
            '$createdAt' => $item['$createdAt'],
            'oldStatus' => $item['oldStatus'] ?? null,
            'newStatus' => $item['newStatus'] ?? null,
            'note' => $item['note'] ?? '',
        ];
    }, $history),
];

echo json_encode($result);
