document.addEventListener("DOMContentLoaded", function () {
    
    // Set Header Date
    const dateElement = document.getElementById("currentDate");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerText = new Date().toLocaleDateString('en-US', options);

    // Chart Global Defaults
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.color = "#66757A";
    
    // 1. Room Occupancy (Doughnut Chart)
    const ctxOccupancy = document.getElementById('occupancyChart').getContext('2d');
    new Chart(ctxOccupancy, {
        type: 'doughnut',
        data: {
            labels: ['Occupied', 'Available', 'Maintenance'],
            datasets: [{
                data: [180, 50, 10],
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
    const ctxCourse = document.getElementById('courseChart').getContext('2d');
    new Chart(ctxCourse, {
        type: 'bar',
        data: {
            labels: ['BCA', 'MCA', 'BSc IT', 'Other'],
            datasets: [{
                label: 'Students',
                data: [45, 30, 25, 20],
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
                data: [1050000, 150000],
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