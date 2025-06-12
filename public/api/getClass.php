<?php
session_start();

// Fehleranzeige aktivieren (nur für Entwicklung)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Header setzen
header('Content-Type: application/json');

$answer = array(
    "code" => 404,
    "array" => []
);

$data = file_get_contents("../data/class.json");
$entrys = json_decode($data, true); // wichtig: true für Array statt stdClass

if (!isset($entrys['array']) || !is_array($entrys['array'])) {
    $answer["code"] = 500;
    $answer["error"] = "Ungültige JSON-Struktur.";
    echo json_encode($answer);
    exit;
}

$answer["code"] = 200;
$answer["array"] = $entrys["array"];

echo json_encode($answer);
