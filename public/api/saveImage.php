<?php
// Fehler anzeigen (für Entwicklung, später deaktivieren)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS (optional, für lokale Entwicklung mit JS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Zielordner für Uploads (relativ zu diesem Skript)
$targetDir = realpath(__DIR__ . '/../data/img') . '/';

// Ordner erstellen, falls er nicht existiert
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image']) && isset($_POST['className'])) {
    $file = $_FILES['image'];
    $className = $_POST['className'];
    $filename = basename($file['name']);
    $extension = pathinfo($filename, PATHINFO_EXTENSION);

    // (Optional) Nur bestimmte Bildtypen erlauben
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Nur JPG, PNG, GIF, WEBP erlaubt']);
        exit;
    }

    // Zielpfad mit einzigartigem Namen
    $uniqueName = uniqid('img_', true) . '.' . $extension;
    $relativePath = 'data/img/' . $uniqueName;
    $targetFile = $targetDir . $uniqueName;

    // Datei speichern
    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        // class.json laden und aktualisieren
        $jsonPath = realpath(__DIR__ . '/../data/class.json');
        $jsonData = file_get_contents($jsonPath);
        $classData = json_decode($jsonData, true);

        if (!isset($classData['array']) || !is_array($classData['array'])) {
            echo json_encode(['success' => false, 'error' => 'Ungültige Klassenstruktur']);
            exit;
        }

        $found = false;
        foreach ($classData['array'] as &$klasse) {
            if ($klasse['name'] === $className) {
                $klasse['imgArray'][] = $relativePath;
                $found = true;
                break;
            }
        }

        if (!$found) {
            echo json_encode(['success' => false, 'error' => 'Klasse nicht gefunden']);
            exit;
        }

        // class.json aktualisieren
        file_put_contents($jsonPath, json_encode($classData, JSON_PRETTY_PRINT));

        // Erfolgsmeldung zurückgeben
        echo json_encode([
            'success' => true,
            'filename' => $uniqueName,
            'url' => $relativePath
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Fehler beim Speichern der Datei.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Bild oder Klassenname fehlt.']);
}