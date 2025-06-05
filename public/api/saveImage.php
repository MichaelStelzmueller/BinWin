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

// Nur POST mit Datei akzeptieren
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
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
    $targetFile = $targetDir . $uniqueName;

    // Datei speichern
    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        // Rückgabe: Pfad relativ zum Projekt
        echo json_encode([
            'success' => true,
            'filename' => $uniqueName,
            'url' => 'data/img/' . $uniqueName
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Fehler beim Speichern der Datei.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Keine gültige Bilddatei empfangen.']);
}