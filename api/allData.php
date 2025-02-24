<?php
session_start();

$answer = array(
    "code" => 404,
    "array" => []
);

$data = file_get_contents("../data/user.json");
$entrys = json_decode($data);

for ($i = 0; $i < count($entrys); $i++) {
    if ($_SESSION['user'] == $entrys[$i]->name) {
        $answer["code"] = 200;
        array_push($answer["array"], $entrys[$i]);
    }
}

echo json_encode($answer);
