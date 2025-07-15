<?php
include("db.php");

$input = json_decode(file_get_contents('php://input'), true);
$username = isset($input['username']) ? $input['username'] : '';
$password = isset($input['password']) ? $input['password'] : '';

if ($username === '' || $password === '') {
    echo json_encode(["success" => false, "error" => "Missing username or password"]);
    exit;
}

$stmt = $pdo->query("SELECT id, username, email FROM users WHERE username = $username AND password = $password");
$user = $stmt->fetch(PDO::FETCH_ASSOC);
$token = hash('sha256', strtolower($user['email']));
$stmt = $pdo->query("UPDATE `users` SET `token`='$token' WHERE 'id' = $user['id']");

if ($user) {
    echo json_encode([
        "success" => true,
        "data" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "token" => $token
        ]
    ]);
} else {
    echo json_encode(["success" => false]);
}
