<?php
session_start();

// 1. Check if the student is actually logged in
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'student') {
    header('Location: auth.html');
    exit;
}

require 'Config.php';

$student_id = $_SESSION['student_id'];

// 2. Fetch Student Details
$stmt = $pdo->prepare("SELECT * FROM students WHERE student_id = :id");
$stmt->execute(['id' => $student_id]);
$student = $stmt->fetch();

// 3. Fetch Room Allocation
$stmtAlloc = $pdo->prepare("
    SELECT a.room_number, a.bed_number, r.floor 
    FROM allocations a 
    JOIN rooms r ON a.room_number = r.room_number 
    WHERE a.student_id = :id AND a.status = 'active' 
    LIMIT 1
");
$stmtAlloc->execute(['id' => $student_id]);
$allocation = $stmtAlloc->fetch();

// 4. Fetch Fee Status
$stmtFee = $pdo->prepare("SELECT status FROM fees WHERE student_id = :id ORDER BY created_at DESC LIMIT 1");
$stmtFee->execute(['id' => $student_id]);
$fee = $stmtFee->fetch();
$feeStatus = $fee ? ucfirst($fee['status']) : 'No Dues';
$feeBadge = ($feeStatus === 'Pending') ? 'badge-pending' : 'badge-resolved';

// 5. Fetch Active Notices
$stmtNotices = $pdo->query("
    SELECT title, start_date, description 
    FROM notices 
    WHERE status = 'active' AND end_date >= CURDATE() 
    ORDER BY start_date DESC 
    LIMIT 3
");
$notices = $stmtNotices->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Dashboard - Hostel Management System</title>
  <link rel="stylesheet" href="student_dashboard.css">
</head>
<body>

  <!-- Navigation Bar -->
  <header class="header" id="mainHeader">
    <div class="container navbar">
      <a href="index.html" class="logo">
        <div class="logo-badge">H</div>
        <div class="logo-text">Hostel<span>Hub</span></div>
      </a>
      <button class="hamburger" id="hamburgerBtn">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-menu" id="navMenu">
        <a href="student_dashboard.php" class="nav-link active">Dashboard</a>
        <a href="forms.html" class="nav-link">Forms</a>
        <a href="table.html" class="nav-link">Complaints</a>
        <div class="nav-auth-buttons">
          <a href="logout.php" class="btn btn-secondary btn-sm logout-btn">Logout</a>
        </div>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <div class="container">
      
      <!-- Dashboard Top Header Bar -->
      <div class="dashboard-header">
        <div class="welcome-box">
          <h1>Welcome, <span style="color: var(--primary-color);"><?= htmlspecialchars($student['name']) ?></span>!</h1>
          <p>Course: <strong><?= htmlspecialchars($student['course']) ?> (<?= htmlspecialchars($student['year']) ?>)</strong> | Email: <?= htmlspecialchars($student['email']) ?></p>
        </div>
        <div class="dashboard-actions">
          <a href="forms.html" class="btn btn-outline btn-sm">&#9997; New Request</a>
          <a href="logout.php" class="btn btn-danger btn-sm logout-btn">&#128682; Logout</a>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">

        <!-- Card 1: Room Details -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-card-title"><span class="badge-icon">&#128719;</span> Room Allocation</div>
            <?php if ($allocation): ?>
                <span class="badge badge-resolved">Active Allotment</span>
            <?php else: ?>
                <span class="badge badge-pending">Not Allocated</span>
            <?php endif; ?>
          </div>

          <div class="detail-list">
            <?php if ($allocation): ?>
                <div class="detail-item">
                  <span class="detail-label">Room Number:</span>
                  <span class="detail-value" style="color: var(--primary-color); font-size: 16px;">Room <?= htmlspecialchars($allocation['room_number']) ?></span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Floor:</span>
                  <span class="detail-value">Floor <?= htmlspecialchars($allocation['floor']) ?></span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Allocated Bed:</span>
                  <span class="detail-value">Bed <?= htmlspecialchars($allocation['bed_number']) ?></span>
                </div>
            <?php else: ?>
                <div class="detail-item">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">Please contact admin for room allocation.</span>
                </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Card 2: Fee Status -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-card-title"><span class="badge-icon">&#127829;</span> Dues & Fees</div>
            <span class="badge <?= $feeBadge ?>"><?= $feeStatus ?></span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 10px;">
            Check with the admin office for detailed payment history or to clear pending dues.
          </p>
        </div>

        <!-- Card 3: Notices -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-card-title"><span class="badge-icon">&#128227;</span> Official Notices</div>
          </div>
          <div class="notice-list">
            <?php if (empty($notices)): ?>
                <p style="font-size: 13px; color: var(--text-muted);">No active notices at this time.</p>
            <?php endif; ?>
            
            <?php foreach ($notices as $n): ?>
            <div class="notice-item">
              <span class="notice-date"><?= htmlspecialchars($n['start_date']) ?></span>
              <div class="notice-text">
                <strong><?= htmlspecialchars($n['title']) ?>:</strong> <?= htmlspecialchars($n['description']) ?>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
        </div>

      </div>

      <!-- Quick Actions -->
      <div style="margin-top: 20px;">
        <h3 style="font-size: 18px; color: var(--text-main); margin-bottom: 14px;">Quick Resident Actions</h3>
        <div class="quick-action-grid">
          <a href="forms.html" class="quick-action-btn">
            <div class="icon">&#9888;&#65039;</div>
            <div>File Maintenance Complaint</div>
          </a>
          <a href="forms.html" class="quick-action-btn">
            <div class="icon">&#128197;</div>
            <div>Apply for Night Leave</div>
          </a>
        </div>
      </div>

    </div>
  </main>

  <script src="student_dashboard.js"></script>
</body>
</html>