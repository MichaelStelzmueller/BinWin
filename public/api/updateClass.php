<?php
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['array'])) {
    http_response_code(400);
    echo json_encode(['code' => 400, 'message' => 'Invalid data']);
    exit;
}

// Pfad zur JSON-Datei
$filePath = '../data/class.json';

// Schreibe das Array zurück in die Datei
if (file_put_contents($filePath, json_encode($input, JSON_PRETTY_PRINT))) {
    echo json_encode(['code' => 200, 'message' => 'Data saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['code' => 500, 'message' => 'Failed to save data']);
}