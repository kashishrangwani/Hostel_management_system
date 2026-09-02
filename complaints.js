document.addEventListener("DOMContentLoaded", function () {
    
    // =========================================
    //   CHART.JS - COMPLAINTS BY CATEGORY
    // =========================================
    Chart.defaults.font.family = "'Poppins', sans-serif";
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Maintenance', 'Water', 'Electricity', 'Cleanliness', 'Other'],
            datasets: [{
                label: 'Complaints',
                data: [11, 7, 5, 3, 2],
                backgroundColor: [
                    '#3B82F6', // Blue
                    '#0EA5E9', // Light Blue
                    '#F59E0B', // Orange
                    '#10B981', // Green
                    '#94A3B8'  // Gray
                ],
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y', // Makes the bar chart horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 11 }, stepSize: 2 } },
                y: { grid: { display: false }, ticks: { font: { size: 12 } } }
            }
        }
    });

    // =========================================
    //   MODAL OPEN & CLOSE LOGIC
    // =========================================
    const complaintModal = document.getElementById("complaintModal");
    const viewButtons = document.querySelectorAll(".open-modal-btn");
    const closeBtns = document.querySelectorAll(".close-modal-btn");
    
    viewButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            complaintModal.classList.add("show");
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            complaintModal.classList.remove("show");
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === complaintModal) {
            complaintModal.classList.remove("show");
        }
    });

    // =========================================
    //   FORM SUBMISSION (UPDATE COMPLAINT)
    // =========================================
    const updateForm = document.getElementById("updateComplaintForm");
    updateForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const newStatus = document.getElementById("updateStatus").value;
        alert(`Complaint status successfully updated to: ${newStatus.toUpperCase()}`);
        complaintModal.classList.remove("show");
        this.reset();
    });

    // =========================================
    //   SEARCH & FILTER LOGIC
    // =========================================
    const searchInput = document.getElementById("complaintSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const tableRows = document.querySelectorAll("#complaintTable tbody tr");

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const status = statusFilter.value;

        tableRows.forEach(row => {
            const rowText = row.innerText.toLowerCase();
            const rowCategory = row.getAttribute("data-category").toLowerCase();
            const rowStatus = row.getAttribute("data-status").toLowerCase();
            
            const matchSearch = rowText.includes(query);
            const matchCategory = (category === "all" || rowCategory === category.toLowerCase());
            const matchStatus = (status === "all" || rowStatus === status.toLowerCase());

            if (matchSearch && matchCategory && matchStatus) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("keyup", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    if (statusFilter) statusFilter.addEventListener("change", applyFilters);

});