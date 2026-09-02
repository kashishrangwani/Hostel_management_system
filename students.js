document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const addModal = document.getElementById("addStudentModal");
    const viewModal = document.getElementById("viewStudentModal");
    const editModal = document.getElementById("editStudentModal");
    
    const openAddBtn = document.getElementById("openAddModal");
    const viewButtons = document.querySelectorAll(".open-view-modal");
    const editButtons = document.querySelectorAll(".open-edit-modal");
    const closeBtns = document.querySelectorAll(".close-modal-btn, .close-modal-btn-secondary");

    // =========================================
    //   MODAL TOGGLERS
    // =========================================
    openAddBtn.addEventListener("click", () => {
        addModal.classList.add("show");
    });

    viewButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            viewModal.classList.add("show");
        });
    });

    editButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            editModal.classList.add("show");
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            addModal.classList.remove("show");
            viewModal.classList.remove("show");
            editModal.classList.remove("show");
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === addModal) addModal.classList.remove("show");
        if (e.target === viewModal) viewModal.classList.remove("show");
        if (e.target === editModal) editModal.classList.remove("show");
    });

    // =========================================
    //   FORM SUBMISSIONS
    // =========================================
    const addForm = document.getElementById("addStudentForm");
    addForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("New student added successfully!");
        addModal.classList.remove("show");
        this.reset();
    });

    const editForm = document.getElementById("editStudentForm");
    editForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Student details updated successfully!");
        editModal.classList.remove("show");
    });

    // =========================================
    //   SEARCH AND FILTER LOGIC
    // =========================================
    const searchInput = document.getElementById("studentSearch");
    const courseFilter = document.getElementById("courseFilter");
    const yearFilter = document.getElementById("yearFilter");
    const statusFilter = document.getElementById("statusFilter");
    const tableRows = document.querySelectorAll("#studentTable tbody tr");

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const course = courseFilter.value.toLowerCase();
        const year = yearFilter.value.toLowerCase();
        const status = statusFilter.value.toLowerCase();

        tableRows.forEach(row => {
            const rowText = row.innerText.toLowerCase();
            const rowCourse = row.getAttribute("data-course").toLowerCase();
            const rowYear = row.getAttribute("data-year").toLowerCase();
            const rowStatus = row.getAttribute("data-status").toLowerCase();

            const matchSearch = rowText.includes(query);
            const matchCourse = (course === "all" || rowCourse === course);
            const matchYear = (year === "all" || rowYear === year);
            const matchStatus = (status === "all" || rowStatus === status);

            if (matchSearch && matchCourse && matchYear && matchStatus) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("keyup", applyFilters);
    if (courseFilter) courseFilter.addEventListener("change", applyFilters);
    if (yearFilter) yearFilter.addEventListener("change", applyFilters);
    if (statusFilter) statusFilter.addEventListener("change", applyFilters);
});