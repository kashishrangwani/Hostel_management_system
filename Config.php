<?php
/**
 * Database connection (PDO)
 * XAMPP + MySQL Workbench, port 3306.
 * Using 127.0.0.1 instead of 'localhost' forces a TCP connection
 * on the given port, avoiding Unix-socket path mismatches that
 * cause "SQLSTATE[HY000] [2002] No such file or directory".
 */
$host    = '127.0.0.1';
$port    = '3306';
$db      = 'hostel_management';
$user    = 'root';
$pass    = 'root';   // change this to match whatever password you set in Workbench
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    // Don't leak raw DB errors to the client in production — log them instead.
    die(json_encode([
        'success' => false,
        'message' => 'Could not connect to the database. Please try again later.'
    ]));
}
