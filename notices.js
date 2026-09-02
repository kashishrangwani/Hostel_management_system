document.addEventListener("DOMContentLoaded", function () {
    
    // Auto-fill today's date for new notices
    const dateInput = document.getElementById("publishDateInput");
    if(dateInput) dateInput.valueAsDate = new Date();

    // Elements
    const createModal = document.getElementById("createNoticeModal");
    const viewModal = document.getElementById("viewNoticeModal");
    const openCreateBtn = document.getElementById("openCreateModal");
    const viewButtons = document.querySelectorAll(".open-view-modal");
    const closeBtns = document.querySelectorAll(".close-modal-btn, .close-modal-btn-secondary");
    
    // Filters
    const searchInput = document.getElementById("noticeSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const tableRows = document.querySelectorAll("#noticeTable tbody tr");

    // =========================================
    //   MODAL TOGGLERS
    // =========================================
    openCreateBtn.addEventListener("click", () => {
        createModal.classList.add("show");
    });

    viewButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            viewModal.classList.add("show");
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            createModal.classList.remove("show");
            viewModal.classList.remove("show");
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === createModal) createModal.classList.remove("show");
        if (e.target === viewModal) viewModal.classList.remove("show");
    });

    // =========================================
    //   FORM SUBMISSION & ACTIONS
    // =========================================
    const createForm = document.getElementById("createNoticeForm");
    createForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Simple logic check for dummy UI: if date is future, it's scheduled.
        const inputDate = new Date(document.getElementById("publishDateInput").value);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (inputDate > today) {
            alert("Notice successfully scheduled for future publishing!");
        } else {
            alert("Notice published immediately!");
        }

        createModal.classList.remove("show");
        this.reset();
        document.getElementById("publishDateInput").valueAsDate = new Date();
    });

    // Dummy remove button in view modal
    const removeBtn = document.querySelector(".action-text-btn.text-red");
    if(removeBtn) {
        removeBtn.addEventListener("click", function() {
            const confirmDelete = confirm("Are you sure you want to permanently remove this notice?");
            if(confirmDelete) {
                alert("Notice removed.");
                viewModal.classList.remove("show");
            }
        });
    }

    // =========================================
    //   SEARCH & FILTER LOGIC
    // =========================================
    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const category = categoryFilter.value.toLowerCase();
        const status = statusFilter.value.toLowerCase();

        tableRows.forEach(row => {
            const rowText = row.innerText.toLowerCase();
            const rowCategory = row.getAttribute("data-category").toLowerCase();
            const rowStatus = row.getAttribute("data-status").toLowerCase();

            const matchSearch = rowText.includes(query);
            const matchCategory = (category === "all" || rowCategory === category);
            const matchStatus = (status === "all" || rowStatus === status);

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