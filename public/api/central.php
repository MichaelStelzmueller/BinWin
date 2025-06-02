<?php
// database connection
$host = 'localhost';
$dbname = 'binWin';
$username = 'binWin';
$password = 'binWin'; // dein Passwort hier

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $e->getMessage()]));
}

// getClass.php
if ($_SERVER['REQUEST_URI'] === '/api/getClass.php') {
    $stmt = $pdo->query('SELECT * FROM classes');
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['code' => 200, 'array' => $classes]);
}

// getUser.php
if ($_SERVER['REQUEST_URI'] === '/api/getUser.php') {
    session_start();
    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin']) {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE name = ?');
        $stmt->execute([$_SESSION['user']]);
        $user = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['code' => 200, 'array' => $user]);
    } else {
        echo json_encode(['code' => 401, 'message' => 'Not logged in']);
    }
}

// quizapi.php
if ($_SERVER['REQUEST_URI'] === '/api/quizapi.php') {
    $stmt = $pdo->query('SELECT q.id, q.question, q.answer, GROUP_CONCAT(o.option_text) AS options FROM quiz q JOIN quiz_options o ON q.id = o.quiz_id GROUP BY q.id');
    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($quizzes as &$quiz) {
        $quiz['options'] = explode(',', $quiz['options']);
    }
    echo json_encode(['code' => 200, 'array' => $quizzes]);
}

// userapi.php (for login & registration)
if ($_SERVER['REQUEST_URI'] === '/api/userapi.php') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['name'], $data['password'], $data['department'], $data['class'])) {
        $stmt = $pdo->prepare('INSERT INTO users (id, name, password, department, class_name) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([uniqid(), $data['name'], $data['password'], $data['department'], $data['class']]);
        echo json_encode(['code' => 200, 'message' => 'User registered']);
    } elseif (isset($_POST['user'], $_POST['password'])) {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE name = ? AND password = ?');
        $stmt->execute([$_POST['user'], $_POST['password']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            session_start();
            $_SESSION['loggedin'] = true;
            $_SESSION['user'] = $user['name'];
            echo json_encode(['code' => 200, 'logged' => true]);
        } else {
            echo json_encode(['code' => 401, 'logged' => false, 'msg' => 'Wrong credentials']);
        }
    }
}

// updateClass.php
if ($_SERVER['REQUEST_URI'] === '/api/updateClass.php') {
    $data = json_decode(file_get_contents('php://input'), true);
    foreach ($data['array'] as $class) {
        $stmt = $pdo->prepare('UPDATE classes SET score = ? WHERE name = ?');
        $stmt->execute([$class['score'], $class['name']]);
    }
    echo json_encode(['success' => true, 'message' => 'Classes updated']);
}

// saveImage.php (simplified)
if ($_SERVER['REQUEST_URI'] === '/api/saveImage.php') {
    if (isset($_FILES['imageFile'])) {
        $targetDir = __DIR__ . '/../data/img/';
        $fileName = basename($_FILES['imageFile']['name']);
        $targetFile = $targetDir . $fileName;
        if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $targetFile)) {
            echo json_encode(['success' => true, 'file' => $fileName]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Upload failed']);
        }
    }
}
