<?php
// Zielordner für Uploads
$targetDir = "uploads/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    $filename = basename($file['name']);
    $targetFile = $targetDir . uniqid() . "_" . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        echo json_encode([
            'success' => true,
            'url' => $targetFile
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Fehler beim Hochladen']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Kein Bild empfangen']);
}