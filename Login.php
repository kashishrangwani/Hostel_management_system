<?php
/**
 * login.php
 * auth.js sends a JSON body (fetch + JSON.stringify), so we read it
 * with php://input rather than $_POST.
 */
session_start();
header('Content-Type: application/json');
require_once 'Config.php';

$input = json_decode(file_get_contents('php://input'), true);

$role     = $input['role'] ?? '';
$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($role === '' || $email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if ($role === 'admin') {

    // The "Email" field is reused as the admin username on the login form.
    $stmt = $pdo->prepare("SELECT * FROM admin WHERE username = :username");
    $stmt->execute(['username' => $email]);
    $admin = $stmt->fetch();

    if ($admin && $password === $admin['password']) {
        $_SESSION['role']     = 'admin';
        $_SESSION['username'] = $admin['username'];

        echo json_encode([
            'success'  => true,
            'message'  => 'Login successful! Redirecting...',
            'redirect' => 'admin_dashboard.php'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid admin credentials.']);
    }

} elseif ($role === 'student') {

    $stmt = $pdo->prepare("SELECT * FROM students WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $student = $stmt->fetch();

    if ($student && password_verify($password, $student['password'])) {
        $_SESSION['role']       = 'student';
        $_SESSION['student_id'] = $student['student_id'];
        $_SESSION['name']       = $student['name'];

        echo json_encode([
            'success'  => true,
            'message'  => 'Login successful! Redirecting...',
            'redirect' => 'student_dashboard.html'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Student not registered or invalid password.']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Please select a valid role.']);
}
