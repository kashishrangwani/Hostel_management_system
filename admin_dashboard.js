document.addEventListener("DOMContentLoaded", function () {

    // Set Header Date
    const dateElement = document.getElementById("currentDate");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerText = new Date().toLocaleDateString('en-US', options);

    // Chart Global Defaults
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.color = "#66757A";

    // Real data injected by admin_dashboard.php (see the inline <script> right
    // before this file is loaded). Falls back to zeros if it's ever missing.
    const data = window.dashboardData || {
        occupancy: { occupied: 0, available: 0, maintenance: 0 },
        courses: {},
        fees: { collected: 0, pending: 0 }
    };

    // 1. Room Occupancy (Doughnut Chart)
    const ctxOccupancy = document.getElementById('occupancyChart').getContext('2d');
    new Chart(ctxOccupancy, {
        type: 'doughnut',
        data: {
            labels: ['Occupied', 'Available', 'Maintenance'],
            datasets: [{
                data: [data.occupancy.occupied, data.occupancy.available, data.occupancy.maintenance],
                backgroundColor: ['#10B981', '#F59E0B', '#64748B'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            cutout: '75%',
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 10, padding: 15, font: { size: 11 } } }
            }
        }
    });

    // 2. Students by Course (Bar Chart)
    const courseLabels = Object.keys(data.courses);
    const courseValues = Object.values(data.courses);
    const ctxCourse = document.getElementById('courseChart').getContext('2d');
    new Chart(ctxCourse, {
        type: 'bar',
        data: {
            labels: courseLabels,
            datasets: [{
                label: 'Students',
                data: courseValues,
                backgroundColor: '#3B82F6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 11 } } }
            }
        }
    });

    // 3. Fees Collection (Pie Chart)
    const ctxFees = document.getElementById('feesChart').getContext('2d');
    new Chart(ctxFees, {
        type: 'pie',
        data: {
            labels: ['Collected', 'Pending'],
            datasets: [{
                data: [data.fees.collected, data.fees.pending],
                backgroundColor: ['#FF7E00', '#EF4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 10, padding: 15, font: { size: 11 } } }
            }
        }
    });
});
