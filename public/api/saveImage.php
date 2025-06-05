<?php
// saveImage.php

// CORS-Header für lokale Entwicklung
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Nur POST-Anfragen akzeptieren
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Prüfen, ob eine Datei hochgeladen wurde
    if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../data/img/';

        // Sicherstellen, dass der Zielordner existiert
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileTmpPath = $_FILES['imageFile']['tmp_name'];
        $fileName = basename($_FILES['imageFile']['name']);
        $destination = $uploadDir . $fileName;

        // Datei verschieben
        if (move_uploaded_file($fileTmpPath, $destination)) {
            echo json_encode(['success' => true, 'message' => 'Datei erfolgreich gespeichert.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern der Datei.']);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Keine gültige Datei empfangen.',
            'error' => $_FILES['imageFile']['error'] ?? 'Unbekannter Fehler'
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Ungültige Anfragemethode.']);
}
