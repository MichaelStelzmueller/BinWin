<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'binWin';
$username = 'binWin';
$password = 'binWin'; // dein Passwort hier

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}

$endpoint = $_GET['endpoint'] ?? '';

switch ($endpoint) {
    case 'login':
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? '';
        $pass = $input['password'] ?? '';

        $stmt = $pdo->prepare('SELECT * FROM users WHERE name = ?');
        $stmt->execute([$name]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && $pass === $user['password']) {
            echo json_encode(['code' => 200, 'message' => 'Login successful', 'user' => $user]);
        } else {
            echo json_encode(['code' => 401, 'message' => 'Invalid credentials']);
        }
        break;

    case 'register':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = uniqid();
        $name = $input['name'] ?? '';
        $pass = $input['password'] ?? '';
        $dept = $input['department'] ?? '';
        $class = $input['class'] ?? '';

        $stmt = $pdo->prepare('INSERT INTO users (id, name, password, department, class_name) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$id, $name, $pass, $dept, $class]);
        echo json_encode(['code' => 200, 'message' => 'User registered']);
        break;

    case 'getClass':
        $stmt = $pdo->query('SELECT * FROM classes');
        $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['code' => 200, 'classes' => $classes]);
        break;

    case 'updateClass':
        $input = json_decode(file_get_contents('php://input'), true);
        foreach ($input['classes'] as $class) {
            $stmt = $pdo->prepare('UPDATE classes SET score = ? WHERE name = ?');
            $stmt->execute([$class['score'], $class['name']]);
        }
        echo json_encode(['code' => 200, 'message' => 'Classes updated']);
        break;

    case 'getQuiz':
        $stmt = $pdo->query('SELECT q.id, q.question, q.answer, GROUP_CONCAT(o.option_text) AS options
                             FROM quiz q JOIN quiz_options o ON q.id = o.quiz_id GROUP BY q.id');
        $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($quizzes as &$quiz) {
            $quiz['options'] = explode(',', $quiz['options']);
        }
        echo json_encode(['code' => 200, 'quizzes' => $quizzes]);
        break;

    default:
        echo json_encode(['code' => 400, 'message' => 'Invalid endpoint']);
}
