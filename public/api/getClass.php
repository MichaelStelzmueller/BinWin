<?php
session_start();

$answer = array(
    "code" => 404,
    "array" => []
);

$data = file_get_contents("../data/class.json");
$entrys = json_decode($data);


$answer["code"] = 200;
for ($i = 0; $i < count($entrys); $i++) {
    array_push($answer["array"], $entrys[$i]);
}

echo json_encode($answer);