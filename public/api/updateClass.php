<?php
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    file_put_contents('../data/class.json', json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}