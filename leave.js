document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const leaveModal = document.getElementById("leaveDetailsModal");
    const viewButtons = document.querySelectorAll(".open-modal-btn");
    const closeBtns = document.querySelectorAll(".close-modal-btn, .close-modal-btn-secondary");
    
    // Filter Elements
    const searchInput = document.getElementById("leaveSearch");
    const statusFilter = document.getElementById("statusFilter");
    const tableRows = document.querySelectorAll("#leaveTable tbody tr");

    // =========================================
    //   MODAL OPEN & CLOSE LOGIC
    // =========================================
    viewButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            leaveModal.classList.add("show");
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            leaveModal.classList.remove("show");
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === leaveModal) {
            leaveModal.classList.remove("show");
        }
    });

    // =========================================
    //   SEARCH & FILTER LOGIC
    // =========================================
    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        tableRows.forEach(row => {
            const rowText = row.innerText.toLowerCase();
            const statusBadge = row.querySelector(".status-badge");
            
            // Check text match
            const matchSearch = rowText.includes(query);
            
            // Check status match
            let matchStatus = false;
            if (status === "all") {
                matchStatus = true;
            } else if (statusBadge && statusBadge.classList.contains(status)) {
                matchStatus = true;
            }

            // Show or hide based on both
            if (matchSearch && matchStatus) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("keyup", applyFilters);
    if (statusFilter) statusFilter.addEventListener("change", applyFilters);

});