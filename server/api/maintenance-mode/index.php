<?php
/**
 * API Mode Maintenance
 * GET  → lire le statut et le message (public)
 * POST → activer/désactiver et mettre à jour le message (super admin uniquement)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$DATA_FILE = __DIR__ . '/../../data/maintenance.json';

// --- GET : lire le statut (public) ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($DATA_FILE)) {
        $data = json_decode(file_get_contents($DATA_FILE), true);
    } else {
        $data = ['enabled' => false, 'message' => ''];
    }
    echo json_encode($data);
    exit;
}

// --- POST : modifier (super admin uniquement) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../../_secure/admin-auth.php';

    // Fallback : si le header Authorization n'est pas présent (Hostinger),
    // on accepte les credentials dans le body de la requête
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($_SERVER['PHP_AUTH_USER']) && !empty($input['auth'])) {
        $auth = base64_decode($input['auth']);
        if (strpos($auth, ':') !== false) {
            list($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']) = explode(':', $auth, 2);
        }
    }

    // Authentifier et vérifier le rôle super admin
    $operator = adminAuthenticateOrFail(false);

    if (($operator['role'] ?? '') !== 'superadmin') {
        http_response_code(403);
        echo json_encode(['error' => 'Réservé au super administrateur']);
        exit;
    }

    $enabled = (bool)($input['enabled'] ?? false);
    $message = trim($input['message'] ?? '');

    // Sauvegarder
    $data = ['enabled' => $enabled, 'message' => $message];
    $dir = dirname($DATA_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($DATA_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Méthode non autorisée']);
