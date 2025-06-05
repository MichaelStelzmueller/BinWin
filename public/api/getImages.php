<?php
// Pfad zum Bildordner relativ zum Skript
$dir = __DIR__ . '/../data/img/';

$images = [];

if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
            // Nur Dateien mit Bild-Endungen zulassen
            if (preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
                // Pfad relativ zur Webroot für den Browserzugriff
                $images[] = 'data/img/' . $file;
            }
        }
        closedir($dh);
    }
}

// JSON-Antwort mit Array der Bilder
header('Content-Type: application/json');
echo json_encode(['array' => $images]);