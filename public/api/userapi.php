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


if ($_SESSION['loggedin']) {
    $answer["code"] = 200;
    $answer["logged"] = true;
    echo json_encode($answer);
} 
else if (isset($_POST['user']) && isset($_POST['password'])) {
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
            } else {
                $answer['msg'] = "Username or password is wrong!";
                
            }
        }
        echo json_encode($answer);
    } else {
        $answer['msg'] = "No users found!";
        echo json_encode($answer);
    }
}


elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Neuen Benutzer hinzufügen
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['name'], $input['password'], $input['department'], $input['class'])) {
        $file = '../data/user.json';
        $users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

        $newUser = [
            "id" => uniqid(),
            "name" => $input['name'],
            "password" => $input['password'],
            "department" => $input['department'],
            "class" => $input['class'],
            "profileIcon" => "",
            "background" => ""
        ];

        $users[] = $newUser;
        file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));

        echo json_encode([
            "code" => 200,
            "answer" => "User added sucessful" // Direkte Nachricht
        ]);
    } else {
        echo json_encode([
            "code" => 400,
            "answer" => "Input invalid" // Direkte Nachricht
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "code" => 405,
        "answer" => "Method not allowed" // Direkte Nachricht
    ]);
}


