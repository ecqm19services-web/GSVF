<?php
/**
 * One-time setup script to create Appwrite collections.
 * Run this once, then DELETE this file from the server.
 * 
 * Usage: visit https://yoursite.com/api/setup-collections.php in your browser
 */

header('Content-Type: text/plain; charset=utf-8');

$config = require __DIR__ . '/../_secure/appwrite-config.php';
$endpoint = rtrim($config['endpoint'], '/');
$db = $config['databaseId'];

function appwriteRequest($method, $url, $config, $body = null) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
  curl_setopt($ch, CURLOPT_TIMEOUT, 30);
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
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$code, json_decode($resp, true) ?: ['raw' => $resp]];
}

echo "=== Appwrite Collection Setup ===\n\n";

// 1. Check if database exists
echo "Checking database '{$db}'...\n";
[$code, $data] = appwriteRequest('GET', "{$endpoint}/databases/{$db}", $config);
if ($code === 404) {
  echo "Creating database...\n";
  [$code, $data] = appwriteRequest('POST', "{$endpoint}/databases", $config, [
    'databaseId' => $db,
    'name' => 'School Database',
  ]);
  echo $code < 400 ? "OK\n" : "ERROR: " . json_encode($data) . "\n";
} else {
  echo "Database exists.\n";
}

// 2. Create contact_submissions collection
$colId = 'contact_submissions';
echo "\nChecking collection '{$colId}'...\n";
[$code, $data] = appwriteRequest('GET', "{$endpoint}/databases/{$db}/collections/{$colId}", $config);
if ($code === 404) {
  echo "Creating collection...\n";
  [$code, $data] = appwriteRequest('POST', "{$endpoint}/databases/{$db}/collections", $config, [
    'collectionId' => $colId,
    'name' => 'Contact Submissions',
    'documentSecurity' => false,
    'permissions' => ['create("any")'],
  ]);
  if ($code >= 400) {
    echo "ERROR creating collection: " . json_encode($data) . "\n";
  } else {
    echo "Collection created.\n";
  }
} else {
  echo "Collection exists.\n";
}

// 3. Create attributes
$attributes = [
  ['type' => 'string', 'key' => 'reference', 'size' => 50, 'required' => true],
  ['type' => 'string', 'key' => 'firstName', 'size' => 100, 'required' => true],
  ['type' => 'string', 'key' => 'lastName', 'size' => 100, 'required' => true],
  ['type' => 'string', 'key' => 'email', 'size' => 255, 'required' => true],
  ['type' => 'string', 'key' => 'phone', 'size' => 50, 'required' => false],
  ['type' => 'string', 'key' => 'subject', 'size' => 255, 'required' => true],
  ['type' => 'string', 'key' => 'message', 'size' => 5000, 'required' => true],
  ['type' => 'string', 'key' => 'status', 'size' => 30, 'required' => true, 'default' => 'new'],
  ['type' => 'string', 'key' => 'adminNotes', 'size' => 5000, 'required' => false],
  ['type' => 'string', 'key' => 'processedAt', 'size' => 50, 'required' => false],
];

echo "\nCreating attributes...\n";
foreach ($attributes as $attr) {
  $key = $attr['key'];
  $url = "{$endpoint}/databases/{$db}/collections/{$colId}/attributes/string";
  $body = [
    'key' => $key,
    'size' => $attr['size'],
    'required' => $attr['required'],
  ];
  if (isset($attr['default'])) {
    $body['default'] = $attr['default'];
  }
  [$code, $data] = appwriteRequest('POST', $url, $config, $body);
  if ($code < 400) {
    echo "  {$key}: OK\n";
  } elseif ($code === 409) {
    echo "  {$key}: already exists\n";
  } else {
    echo "  {$key}: ERROR ({$code}) " . json_encode($data) . "\n";
  }
}

// 4. Create site_pages collection if not exists
$colId2 = 'site_pages';
echo "\nChecking collection '{$colId2}'...\n";
[$code, $data] = appwriteRequest('GET', "{$endpoint}/databases/{$db}/collections/{$colId2}", $config);
if ($code === 404) {
  echo "Creating collection...\n";
  [$code, $data] = appwriteRequest('POST', "{$endpoint}/databases/{$db}/collections", $config, [
    'collectionId' => $colId2,
    'name' => 'Site Pages',
    'documentSecurity' => false,
    'permissions' => ['read("any")'],
  ]);
  if ($code >= 400) {
    echo "ERROR creating collection: " . json_encode($data) . "\n";
  } else {
    echo "Collection created.\n";
    // Create attributes for site_pages
    $pageAttrs = [
      ['key' => 'page', 'size' => 60, 'required' => true],
      ['key' => 'content', 'size' => 100000, 'required' => true],
    ];
    foreach ($pageAttrs as $attr) {
      $url = "{$endpoint}/databases/{$db}/collections/{$colId2}/attributes/string";
      [$code, $data] = appwriteRequest('POST', $url, $config, [
        'key' => $attr['key'],
        'size' => $attr['size'],
        'required' => $attr['required'],
      ]);
      echo "  {$attr['key']}: " . ($code < 400 ? 'OK' : "ERROR ({$code})") . "\n";
    }
  }
} else {
  echo "Collection exists.\n";
}

echo "\n=== Setup complete ===\n";
echo "\n⚠️  IMPORTANT: Delete this file from the server after running it!\n";
