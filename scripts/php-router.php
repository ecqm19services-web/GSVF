<?php
/**
 * Routeur pour le serveur intégré PHP (test local uniquement).
 * Émule le comportement du .htaccess Apache sur le dossier dist/ :
 *   - sert les fichiers existants (assets, index.php des API) en exécutant PHP
 *   - sert /api/<endpoint>/index.php même sans slash final
 *   - fallback SPA vers index.html pour toute autre route
 *
 * Lancement : php -S 127.0.0.1:8080 -t dist scripts/php-router.php
 */

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$docroot = realpath(__DIR__ . '/../dist');

if ($docroot === false) {
  http_response_code(500);
  echo 'dist/ introuvable. Lancez "npm run build" d\'abord.';
  return true;
}

$full = $docroot . str_replace('/', DIRECTORY_SEPARATOR, $path);

// 1) Fichier existant -> laisser le serveur intégré le traiter (PHP exécute .php)
if (is_file($full)) {
  return false;
}

// 2) Dossier -> servir index.php si présent (gère /api/xxx et /api/xxx/)
if (is_dir($full)) {
  $index = rtrim($full, '/\\') . DIRECTORY_SEPARATOR . 'index.php';
  if (is_file($index)) {
    $scriptDir = rtrim($full, '/\\');
    $scriptName = rtrim($path, '/') . '/index.php';
    $_SERVER['SCRIPT_FILENAME'] = $index;
    $_SERVER['DOCUMENT_ROOT'] = $docroot;
    $_SERVER['SCRIPT_NAME'] = $scriptName;
    $_SERVER['PHP_SELF'] = $scriptName;
    chdir($scriptDir);
    require $index;
    return true;
  }
}

// 3) Fallback SPA -> index.html
$indexHtml = $docroot . DIRECTORY_SEPARATOR . 'index.html';
if (is_file($indexHtml)) {
  header('Content-Type: text/html; charset=UTF-8');
  readfile($indexHtml);
  return true;
}

http_response_code(404);
echo 'Not found';
return true;
