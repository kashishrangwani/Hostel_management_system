<?php
/**
 * register.php
 * auth.js sends a JSON body for the signup form, so we read it
 * with php://input rather than $_POST. Saves a new row into the
 * students table with a securely hashed password.
 */
header('Content-Type: application/json');
require_once 'Config.php';

$input = json_decode(file_get_contents('php://input'), true);

$name            = trim($input['name'] ?? '');
$email           = trim($input['email'] ?? '');
$phone           = trim($input['phone'] ?? '');
$gender          = trim($input['gender'] ?? '');
$course          = trim($input['course'] ?? '');
$year            = trim($input['year'] ?? '');
$password        = $input['password'] ?? '';
$confirmPassword = $input['confirmPassword'] ?? '';

/* =========================================
   SERVER-SIDE VALIDATION
   (auth.js already checks these, but never trust the client)
========================================= */
if ($name === '' || $email === '' || $phone === '' || $gender === '' ||
    $course === '' || $year === '' || $password === '' || $confirmPassword === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Enter a valid email address.']);
    exit;
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Enter a valid 10-digit phone number.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
    exit;
}

/* =========================================
   CHECK FOR EXISTING EMAIL / PHONE
   (students table has UNIQUE constraints on both,
   so we check first to give a friendly message)
========================================= */
$stmt = $pdo->prepare("SELECT student_id FROM students WHERE email = :email OR phone = :phone");
$stmt->execute(['email' => $email, 'phone' => $phone]);

if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'An account with this email or phone number already exists.']);
    exit;
}

/* =========================================
   HASH THE PASSWORD AND INSERT
========================================= */
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare(
        "INSERT INTO students (email, name, phone, gender, course, year, password)
         VALUES (:email, :name, :phone, :gender, :course, :year, :password)"
    );

    $stmt->execute([
        'email'    => $email,
        'name'     => $name,
        'phone'    => $phone,
        'gender'   => $gender,
        'course'   => $course,
        'year'     => $year,
        'password' => $hashedPassword,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'You are registered! Please log in to continue.'
    ]);

} catch (PDOException $e) {
    // Catches a race-condition duplicate (two requests at once) that
    // slips past the earlier SELECT check.
    if ($e->getCode() === '23000') {
        echo json_encode(['success' => false, 'message' => 'An account with this email or phone number already exists.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Could not register. Please try again later.']);
    }
}