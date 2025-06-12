<?php
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['array'])) {
    http_response_code(400);
    echo json_encode(['code' => 400, 'message' => 'Invalid data']);
    exit;
}

// Pfad zur JSON-Datei

$filePath = "../data/class.json";
$data = json_decode(file_get_contents('php://input'), true);
if ($data) {
    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid data"]);
}
?>
