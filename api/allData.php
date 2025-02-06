<?php

$answer = array(
    "code" => 404,
    "array" => []
);

$data = file_get_contents("../data/user.json");
        $entrys = json_decode($data);

        for ($i=0; $i < count($entrys); $i++) { 
            $answer["code"] = 200;
            array_push($answer["array"], $entrys[$i]);
        }

echo json_encode($answer);