<?php
header('Content-Type: application/json');

$file = '../data/user.json';
$users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name'])) {
    echo json_encode(["code" => 400, "msg" => "Missing username"]);
    exit;
}

$updated = false;

foreach ($users as &$user) {
    if ($user['name'] === $data['name']) {
        if (isset($data['profileIcon'])) $user['profileIcon'] = $data['profileIcon'];
        $updated = true;
        break;
    }
}

if ($updated) {
    file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));
    echo json_encode(["code" => 200, "msg" => "User updated"]);
} else {
    echo json_encode(["code" => 404, "msg" => "User not found"]);
}
