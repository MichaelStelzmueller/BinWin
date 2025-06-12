<?php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo json_encode([
        "code" => 200,
        "logged" => true,
        "user" => $_SESSION['user']
    ]);
    exit;
}

$file = '../data/user.json';
$users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];


// LOGIN
if (isset($_POST['user']) && isset($_POST['password'])) {
    $user = $_POST['user'];
    $pw = $_POST['password'];

    foreach ($users as $u) {
        if ($u['name'] === $user && $u['password'] === $pw) {
            $_SESSION['loggedin'] = true;
            $_SESSION['user'] = $user;
            echo json_encode(["code" => 200, "msg" => $users, "logged" => true]);
            exit;
        }
    }
    echo json_encode(["code" => 401, "msg" => "Username or password is wrong!"]);
    exit;
}

// UPDATE / REGISTRATION
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(["code" => 400, "msg" => "Invalid JSON"]);
        exit;
    }

    $updated = false;
    for ($i = 0; $i < count($users); $i++) {
        if ($users[$i]['name'] === $input['name']) {
            // UPDATE EXISTING USER
            $users[$i] = array_merge($users[$i], $input);
            $updated = true;
            break;
        }
    }

    if (!$updated) {
        // Neuen User anlegen, falls Felder da sind
        if (isset($input['name'], $input['password'], $input['department'], $input['class'])) {
            $input['id'] = uniqid();
            $input['profileIcon'] = $input['profileIcon'] ?? "default.svg";
            $input['background'] = $input['background'] ?? "default.jpg";
            $users[] = $input;
            $updated = true;
        } else {
            echo json_encode(["code" => 400, "msg" => "Incomplete user data"]);
            exit;
        }
    }

    file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));
    echo json_encode(["code" => 200, "msg" => "User updated"]);
    exit;
}

http_response_code(405);
echo json_encode(["code" => 405, "msg" => "Method not allowed"]);
