<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
    $_SESSION['loggedin'] = false;
}

if (!isset($_SESSION['user'])) {
    $_SESSION['user'] = "";
}

header('Content-Type: application/json');

$answer = array(
    "code" => 404,
    "logged" => false,
    "msg" => ""
);

// LOGIN-BLOCK
if ($_SESSION['loggedin']) {
    $answer["code"] = 200;
    $answer["logged"] = true;
    echo json_encode($answer);
    exit;
}

if (isset($_POST['user']) && isset($_POST['password'])) {
    $user = $_POST['user'];
    $pw = $_POST['password'];
    $file = '../data/user.json';

    if (file_exists($file)) {
        $users = json_decode(file_get_contents($file), true);
        for ($i = 0; $i < count($users); $i++) {
            if ($users[$i]['name'] == $user && $users[$i]['password'] == $pw) {
                $answer["code"] = 200;
                $answer["msg"] = $users;
                $answer["logged"] = true;
                $_SESSION['loggedin'] = true;
                $_SESSION['user'] = $user;
                break;
            } else {
                $answer['msg'] = "Username or password is wrong!";
            }
        }
        echo json_encode($answer);
        exit;
    } else {
        $answer['msg'] = "No users found!";
        echo json_encode($answer);
        exit;
    }
}

// UPDATE & ADD USER:
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $file = '../data/user.json';
    $users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    // UPDATE EXISTING USER
    $updated = false;
    foreach ($users as &$user) {
        if ($user['name'] === $input['name']) {
            // Update nur das ProfileIcon und Background wenn vorhanden
            if (isset($input['profileIcon'])) {
                $user['profileIcon'] = $input['profileIcon'];
            }
            if (isset($input['background'])) {
                $user['background'] = $input['background'];
            }
            $updated = true;
            break;
        }
    }

    // NEUER USER FALL:
    if (!$updated) {
        if (isset($input['name'], $input['password'], $input['department'], $input['class'])) {
            $newUser = [
                "id" => uniqid(),
                "name" => $input['name'],
                "password" => $input['password'],
                "department" => $input['department'],
                "class" => $input['class'],
                "profileIcon" => $input['profileIcon'] ?? "profile.svg",
                "background" => $input['background'] ?? ""
            ];
            $users[] = $newUser;
        } else {
            echo json_encode(["code" => 400, "answer" => "Invalid Input"]);
            exit;
        }
    }

    file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));
    echo json_encode(["code" => 200, "answer" => "User updated"]);
    exit;
}

http_response_code(405);
echo json_encode(["code" => 405, "answer" => "Method not allowed"]);
exit;
?>
