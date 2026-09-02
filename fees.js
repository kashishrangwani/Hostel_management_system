document.addEventListener("DOMContentLoaded", function () {
    const paymentModal = document.getElementById("paymentModal");
    const openModalBtns = document.querySelectorAll(".open-modal-btn");
    const closeBtns = document.querySelectorAll(".close-modal-btn, .close-modal-btn-secondary");

    const filterDropdown = document.getElementById("feeFilter");
    const tableRows = document.querySelectorAll(".data-table tbody tr");

    // =========================================
    //   MODAL OPEN & CLOSE LOGIC
    // =========================================
    openModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            paymentModal.classList.add("show");
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            paymentModal.classList.remove("show");
        });
    });

    paymentModal.addEventListener("click", (e) => {
        if (e.target === paymentModal) {
            paymentModal.classList.remove("show");
        }
    });

    // =========================================
    //   FILTER LOGIC
    // =========================================
    if (filterDropdown) {
        filterDropdown.addEventListener("change", function () {
            const filterValue = this.value;

            tableRows.forEach(row => {
                const statusBadge = row.querySelector(".status-badge");
                
                if (filterValue === "all") {
                    row.style.display = ""; 
                } 
                else if (statusBadge.classList.contains(filterValue)) {
                    row.style.display = ""; 
                } 
                else {
                    row.style.display = "none"; 
                }
            });
        });
    }
});