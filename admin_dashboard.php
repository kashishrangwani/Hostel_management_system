<?php
session_start();

// 1. Verify Admin Session
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header('Location: auth.html');
    exit;
}

require_once 'Config.php';

$adminUsername = $_SESSION['username'] ?? 'Admin';

// 2. Query Statistics from Database
// Primary Stats
$totalStudents = $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn() ?: 0;
$totalRooms    = $pdo->query("SELECT COUNT(*) FROM rooms")->fetchColumn() ?: 0;
$totalBeds     = $pdo->query("SELECT SUM(capacity) FROM rooms")->fetchColumn() ?: 0;
$occupiedBeds  = $pdo->query("SELECT COUNT(*) FROM allocations WHERE status = 'active'")->fetchColumn() ?: 0;
$occupancyRate = ($totalBeds > 0) ? round(($occupiedBeds / $totalBeds) * 100) : 0;

// Secondary Stats
$pendingFeesAmount   = $pdo->query("SELECT SUM(due) FROM fees WHERE status = 'pending'")->fetchColumn() ?: 0;
$pendingLeavesCount  = $pdo->query("SELECT COUNT(*) FROM leaves WHERE status = 'pending'")->fetchColumn() ?: 0;
$openComplaintsCount = $pdo->query("SELECT COUNT(*) FROM complaints WHERE status != 'resolved'")->fetchColumn() ?: 0;
$unallocatedStudents = $pdo->query("
    SELECT COUNT(*) FROM students 
    WHERE student_id NOT IN (SELECT DISTINCT student_id FROM allocations WHERE status = 'active')
")->fetchColumn() ?: 0;

// 3. Query Chart Data
$maintenanceRooms = $pdo->query("SELECT COUNT(*) FROM rooms WHERE status = 'maintenance'")->fetchColumn() ?: 0;
$availableBeds    = max(0, $totalBeds - $occupiedBeds);

// Course Breakdown
$stmtCourses = $pdo->query("SELECT course, COUNT(*) as total FROM students GROUP BY course");
$coursesData = [];
while ($row = $stmtCourses->fetch()) {
    $coursesData[$row['course']] = (int)$row['total'];
}

// Fee Status Breakdown
$feesCollected = $pdo->query("SELECT SUM(paid) FROM fees")->fetchColumn() ?: 0;
$feesPending   = $pdo->query("SELECT SUM(due) FROM fees")->fetchColumn() ?: 0;

$dashboardData = [
    'occupancy' => [
        'occupied'    => (int)$occupiedBeds,
        'available'   => (int)$availableBeds,
        'maintenance' => (int)$maintenanceRooms
    ],
    'courses' => $coursesData,
    'fees' => [
        'collected' => (float)$feesCollected,
        'pending'   => (float)$feesPending
    ]
];

// 4. Query Recent Activity Lists
$recentAllocations = $pdo->query("
    SELECT s.name as student_name, a.room_number, a.bed_number, a.created_at 
    FROM allocations a
    JOIN students s ON a.student_id = s.student_id
    ORDER BY a.created_at DESC LIMIT 3
")->fetchAll();

$recentComplaints = $pdo->query("
    SELECT category, status, room_number, created_at 
    FROM complaints 
    ORDER BY created_at DESC LIMIT 3
")->fetchAll();

$activeNotices = $pdo->query("
    SELECT title, start_date, description 
    FROM notices 
    WHERE status = 'active' 
    ORDER BY start_date DESC LIMIT 3
")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Hostel Management</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="admin_dashboard.css">
</head>
<body>

    <div class="dashboard-wrapper">
        
        <!-- SIDEBAR -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2><i class="fa-solid fa-building-user"></i> Hostel Admin</h2>
            </div>
            
            <nav class="nav-links">
                <a href="admin_dashboard.php" class="active"><i class="fa-solid fa-house"></i> <span>Dashboard</span></a>
                <a href="students.php"><i class="fa-solid fa-user-graduate"></i> <span>Students</span></a>
                <a href="allocation.php"><i class="fa-solid fa-key"></i> <span>Allocation</span></a>
                <a href="fees.php"><i class="fa-solid fa-file-invoice-dollar"></i> <span>Fees</span></a>
                <a href="complaints.php"><i class="fa-solid fa-circle-exclamation"></i> <span>Complaints</span></a>
                <a href="leave.php"><i class="fa-solid fa-calendar-minus"></i> <span>Leave</span></a>
                <a href="notices.php"><i class="fa-solid fa-bullhorn"></i> <span>Notices</span></a>
                <a href="reports.php"><i class="fa-solid fa-chart-pie"></i> <span>Reports</span></a>
            </nav>

            <div class="logout-wrapper">
                <a href="logout.php" class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> <span>Logout</span></a>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="main-content">
            
            <!-- HEADER -->
            <header class="top-nav">
                <div class="welcome-text">
                    <h1>Welcome, <?= htmlspecialchars($adminUsername) ?></h1>
                    <p id="currentDate">Loading date...</p>
                </div>
                <div class="user-profile">
                    <div class="notification">
                        <i class="fa-regular fa-bell"></i>
                        <span class="badge"><?= count($recentComplaints) ?></span>
                    </div>
                    <div class="avatar-group">
                        <div class="avatar"></div>
                        <span class="profile-name"><?= htmlspecialchars($adminUsername) ?></span>
                    </div>
                </div>
            </header>

            <!-- PRIMARY STATISTICS -->
            <div class="stats-grid primary-stats">
                <div class="stat-card">
                    <div class="icon-wrap blue"><i class="fa-solid fa-users"></i></div>
                    <div class="stat-info">
                        <p>Total Students</p>
                        <h4><?= $totalStudents ?></h4>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="icon-wrap orange"><i class="fa-solid fa-door-closed"></i></div>
                    <div class="stat-info">
                        <p>Total Rooms</p>
                        <h4><?= $totalRooms ?></h4>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="icon-wrap green"><i class="fa-solid fa-bed"></i></div>
                    <div class="stat-info">
                        <p>Total Beds</p>
                        <h4><?= $totalBeds ?></h4>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="icon-wrap purple"><i class="fa-solid fa-chart-line"></i></div>
                    <div class="stat-info">
                        <p>Occupancy Rate</p>
                        <h4><?= $occupancyRate ?>%</h4>
                    </div>
                </div>
            </div>

            <!-- SECONDARY STATISTICS -->
            <div class="stats-grid secondary-stats">
                <div class="stat-card mini">
                    <p>Pending Fees</p>
                    <h4 class="text-red">₹ <?= number_format($pendingFeesAmount, 2) ?></h4>
                </div>
                <div class="stat-card mini">
                    <p>Pending Leaves</p>
                    <h4 class="text-orange"><?= $pendingLeavesCount ?> Requests</h4>
                </div>
                <div class="stat-card mini">
                    <p>Open Complaints</p>
                    <h4 class="text-orange"><?= $openComplaintsCount ?> Issues</h4>
                </div>
                <div class="stat-card mini">
                    <p>Without Room</p>
                    <h4 class="text-red"><?= $unallocatedStudents ?> Students</h4>
                </div>
            </div>

            <!-- VISUALS (CHARTS) -->
            <div class="charts-grid">
                <div class="card chart-container">
                    <h3>Room Occupancy</h3>
                    <canvas id="occupancyChart"></canvas>
                </div>
                <div class="card chart-container">
                    <h3>Students by Course</h3>
                    <canvas id="courseChart"></canvas>
                </div>
                <div class="card chart-container">
                    <h3>Fees Status</h3>
                    <canvas id="feesChart"></canvas>
                </div>
            </div>

            <!-- RECENT INFORMATION -->
            <div class="recent-grid">
                
                <div class="card list-card">
                    <h3>Recent Allocations</h3>
                    <div class="list-wrapper">
                        <?php if (empty($recentAllocations)): ?>
                            <p style="font-size: 13px; color: #66757A;">No allocations found.</p>
                        <?php else: ?>
                            <?php foreach ($recentAllocations as $alloc): ?>
                                <div class="list-item">
                                    <div class="item-text">
                                        <strong><?= htmlspecialchars($alloc['student_name']) ?></strong>
                                        <span>Room <?= htmlspecialchars($alloc['room_number']) ?> (Bed <?= htmlspecialchars($alloc['bed_number']) ?>)</span>
                                    </div>
                                    <small><?= date('M d', strtotime($alloc['created_at'])) ?></small>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="card list-card">
                    <h3>Recent Activity</h3>
                    <div class="list-wrapper">
                        <?php if (empty($recentComplaints)): ?>
                            <p style="font-size: 13px; color: #66757A;">No recent complaints.</p>
                        <?php else: ?>
                            <?php foreach ($recentComplaints as $comp): ?>
                                <div class="list-item">
                                    <div class="item-text">
                                        <strong><?= htmlspecialchars($comp['category']) ?></strong>
                                        <span><?= ucfirst(htmlspecialchars($comp['status'])) ?> • Room <?= htmlspecialchars($comp['room_number']) ?></span>
                                    </div>
                                    <small><?= date('M d', strtotime($comp['created_at'])) ?></small>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="card list-card">
                    <h3>Active Notices</h3>
                    <div class="list-wrapper">
                        <?php if (empty($activeNotices)): ?>
                            <p style="font-size: 13px; color: #66757A;">No active notices.</p>
                        <?php else: ?>
                            <?php foreach ($activeNotices as $notice): ?>
                                <div class="list-item">
                                    <div class="item-text">
                                        <strong><?= htmlspecialchars($notice['title']) ?></strong>
                                        <span><?= htmlspecialchars($notice['description']) ?></span>
                                    </div>
                                    <span class="status-dot green"></span>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

            </div>

        </main>
    </div>

    <!-- Pass Database Data to JavaScript -->
    <script>
        window.dashboardData = <?= json_encode($dashboardData) ?>;
    </script>
    <script src="admin_dashboard.js"></script>
</body>
</html>