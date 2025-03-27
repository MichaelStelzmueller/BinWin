<?php
$answer = array(
    "code" => 404, // Standard: Not Found
    "array" => []
);

// Lade die JSON-Datei mit den Quizfragen
$data = file_get_contents("../data/quiz.json");

if ($data) {
    $entrys = json_decode($data, true);
    
    if ($entrys !== null) {
        $answer["code"] = 200; // Erfolg
        $answer["array"] = $entrys;
    } else {
        $answer["code"] = 500; // Fehlerhafte JSON-Daten
    }
} else {
    $answer["code"] = 400; // Datei nicht gefunden oder fehlerhaft
}

// JSON zurückgeben
echo json_encode($answer, JSON_PRETTY_PRINT);
?>
