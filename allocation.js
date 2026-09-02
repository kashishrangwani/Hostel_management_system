document.addEventListener("DOMContentLoaded", function () {
    
    // Auto-fill today's date in main allocation form
    document.getElementById('newAllocDate').valueAsDate = new Date();

    // Elements
    const changeModal = document.getElementById("changeRoomModal");
    const vacateModal = document.getElementById("vacateRoomModal");
    const closeBtns = document.querySelectorAll(".close-modal-btn, .close-modal-btn-secondary");

    const allocSearch = document.getElementById("allocationSearch");
    const allocTableRows = document.querySelectorAll("#currentAllocationsTable tbody tr");

    // =========================================
    //   MAIN FORM ALLOCATION
    // =========================================
    document.getElementById("allocationForm").addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Room Allocated Successfully! Availability will update.");
        this.reset();
        document.getElementById('newAllocDate').valueAsDate = new Date();
    });

    // =========================================
    //   SEARCH CURRENT ALLOCATIONS
    // =========================================
    if (allocSearch) {
        allocSearch.addEventListener("keyup", function() {
            const query = this.value.toLowerCase();
            
            allocTableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    // =========================================
    //   CHANGE ROOM MODAL LOGIC
    // =========================================
    document.querySelectorAll(".open-change-modal").forEach(btn => {
        btn.addEventListener("click", function() {
            const name = this.getAttribute("data-name");
            const room = this.getAttribute("data-room");
            const bed = this.getAttribute("data-bed");

            document.getElementById("cr-studentName").innerText = name;
            document.getElementById("cr-currentRoom").innerText = room;
            document.getElementById("cr-currentBed").innerText = bed;

            changeModal.classList.add("show");
        });
    });

    document.getElementById("changeRoomForm").addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Room change submitted successfully.");
        changeModal.classList.remove("show");
        this.reset();
    });

    // =========================================
    //   VACATE ROOM MODAL LOGIC
    // =========================================
    document.querySelectorAll(".open-vacate-modal").forEach(btn => {
        btn.addEventListener("click", function() {
            const name = this.getAttribute("data-name");
            const room = this.getAttribute("data-room");
            const bed = this.getAttribute("data-bed");

            document.getElementById("vr-studentName").innerText = name;
            document.getElementById("vr-currentRoom").innerText = room;
            document.getElementById("vr-currentBed").innerText = bed;

            // Store reference to the row so we can remove it on success
            vacateModal.setAttribute("data-row-index", Array.from(allocTableRows).indexOf(this.closest("tr")));

            vacateModal.classList.add("show");
        });
    });

    document.getElementById("vacateRoomForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const rowIndex = vacateModal.getAttribute("data-row-index");
        
        if(rowIndex !== null) {
            allocTableRows[rowIndex].style.display = "none"; // Hide vacated student
        }
        
        alert("Student vacated successfully. Bed is now available.");
        vacateModal.classList.remove("show");
        this.reset();
    });

    // =========================================
    //   GLOBAL MODAL CLOSE
    // =========================================
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            changeModal.classList.remove("show");
            vacateModal.classList.remove("show");
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === changeModal) changeModal.classList.remove("show");
        if (e.target === vacateModal) vacateModal.classList.remove("show");
    });
});