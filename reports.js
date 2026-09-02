document.addEventListener("DOMContentLoaded", function () {
    
    // Core Elements
    const reportTypeSelect = document.getElementById("reportTypeSelect");
    const dynamicFiltersContainer = document.getElementById("dynamicFiltersContainer");
    const generateBtn = document.getElementById("generateReportBtn");
    const resetBtn = document.getElementById("resetReportBtn");
    const reportResultsWrapper = document.getElementById("reportResultsWrapper");
    
    // Result Elements
    const titleEl = document.getElementById("generatedReportTitle");
    const printTitleEl = document.getElementById("printReportTitle");
    const printDateEl = document.getElementById("printDate");
    const statsRow = document.getElementById("dynamicStatsRow");
    const tableHead = document.getElementById("reportTableHead");
    const tableBody = document.getElementById("reportTableBody");
    const chartTitle = document.getElementById("chartTitle");
    
    // Chart Instance Tracking
    let currentChart = null;

    // =========================================
    //   DATA DICTIONARY (Simulating Backend)
    // =========================================
    const reportDataMap = {
        students: {
            title: "Student Report",
            stats: [
                { label: "Total Students", value: "120", color: "#3B82F6" },
                { label: "Active", value: "112", color: "#10B981" },
                { label: "New", value: "8", color: "#F59E0B" },
                { label: "Without Room", value: "15", color: "#EF4444" }
            ],
            tableCols: ["ID", "Name", "Course", "Year", "Status"],
            tableRows: [
                ["ST101", "Emma Swan", "BCA", "2nd", "Active"],
                ["ST102", "Lucas Gray", "MCA", "1st", "Active"],
                ["ST103", "Oliver Twist", "BSc IT", "3rd", "Inactive"]
            ],
            chart: {
                title: "Students by Course",
                type: "bar",
                labels: ["BCA", "MCA", "BSc IT"],
                data: [65, 35, 20],
                colors: ["#3B82F6", "#0EA5E9", "#8B5CF6"]
            }
        },
        rooms: {
            title: "Room Allocation Report",
            stats: [
                { label: "Total Beds", value: "240", color: "#3B82F6" },
                { label: "Occupied", value: "180", color: "#10B981" },
                { label: "Available", value: "60", color: "#F59E0B" },
                { label: "Occupancy", value: "75%", color: "#8B5CF6" }
            ],
            tableCols: ["Student", "ID", "Room", "Bed", "Allocated"],
            tableRows: [
                ["Mason Reed", "ST104", "A-101", "B1", "20/08/26"],
                ["Caleb Frost", "ST105", "A-101", "B2", "21/08/26"],
                ["Harper Jin", "ST106", "B-205", "B1", "25/08/26"]
            ],
            chart: {
                title: "Occupancy by Block",
                type: "bar",
                labels: ["Block A", "Block B", "Block C"],
                data: [90, 60, 30],
                colors: ["#10B981", "#10B981", "#10B981"]
            }
        },
        fees: {
            title: "Fees Report",
            stats: [
                { label: "Total Expected", value: "₹12L", color: "#3B82F6" },
                { label: "Collected", value: "₹10.5L", color: "#10B981" },
                { label: "Pending", value: "₹1.5L", color: "#EF4444" },
                { label: "Total Payees", value: "120", color: "#64748B" }
            ],
            tableCols: ["Student", "ID", "Amount", "Paid On", "Status"],
            tableRows: [
                ["Alex Carter", "ST107", "₹50,000", "20/08/26", "Paid"],
                ["Maya Patel", "ST108", "₹50,000", "—", "Pending"]
            ],
            chart: {
                title: "Collection Status",
                type: "doughnut",
                labels: ["Collected", "Pending"],
                data: [1050000, 150000],
                colors: ["#10B981", "#EF4444"]
            }
        },
        leave: {
            title: "Leave Report",
            stats: [
                { label: "Total Requests", value: "35", color: "#3B82F6" },
                { label: "Upcoming", value: "8", color: "#F59E0B" },
                { label: "On Leave", value: "5", color: "#8B5CF6" },
                { label: "Returned", value: "22", color: "#10B981" }
            ],
            tableCols: ["Student", "ID", "Leave Date", "Reason", "Status"],
            tableRows: [
                ["Chloe Brooks", "ST109", "25/08/26", "Family Event", "Returned"],
                ["Leo Vance", "ST110", "30/08/26", "Medical", "Upcoming"]
            ],
            chart: {
                title: "Leaves by Month (Last 3 Mths)",
                type: "bar",
                labels: ["June", "July", "August"],
                data: [10, 15, 35],
                colors: ["#F59E0B", "#F59E0B", "#F59E0B"]
            }
        },
        complaints: {
            title: "Complaint Report",
            stats: [
                { label: "Total", value: "28", color: "#3B82F6" },
                { label: "Resolved", value: "20", color: "#10B981" },
                { label: "In Progress", value: "5", color: "#F59E0B" },
                { label: "New", value: "3", color: "#EF4444" }
            ],
            tableCols: ["Student", "ID", "Category", "Date", "Status"],
            tableRows: [
                ["Julian Silva", "ST111", "Water", "28/08/26", "In Progress"],
                ["Sophie Chen", "ST112", "Electricity", "26/08/26", "Resolved"]
            ],
            chart: {
                title: "Complaints by Category",
                type: "bar",
                labels: ["Maint.", "Water", "Elec.", "Clean"],
                data: [11, 7, 5, 3],
                colors: ["#EF4444", "#3B82F6", "#F59E0B", "#10B981"]
            }
        }
    };

    // =========================================
    //   UI INTERACTIONS
    // =========================================

    // 1. Handle Report Type Selection -> Swap Filters
    reportTypeSelect.addEventListener("change", function() {
        const type = this.value;
        const template = document.getElementById(`filterTpl-${type}`);
        
        if (template) {
            dynamicFiltersContainer.innerHTML = "";
            dynamicFiltersContainer.appendChild(template.content.cloneNode(true));
            generateBtn.disabled = false;
        }
    });

    // 2. Reset Button
    resetBtn.addEventListener("click", function() {
        document.getElementById("reportConfigForm").reset();
        dynamicFiltersContainer.innerHTML = `<p class="placeholder-text text-gray text-sm"><i class="fa-solid fa-circle-info"></i> Please select a report type to view available filters.</p>`;
        generateBtn.disabled = true;
        reportResultsWrapper.style.display = "none";
    });

    // 3. Generate Report Action
    document.getElementById("reportConfigForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const type = reportTypeSelect.value;
        const data = reportDataMap[type];
        if (!data) return;

        // Set Titles & Date
        titleEl.innerText = data.title;
        printTitleEl.innerText = data.title;
        
        const dateOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        printDateEl.innerText = new Date().toLocaleDateString('en-GB', dateOptions);

        // Render Stats
        statsRow.innerHTML = data.stats.map(stat => `
            <div class="stat-card" style="border-left-color: ${stat.color};">
                <p>${stat.label}</p>
                <h4>${stat.value}</h4>
            </div>
        `).join("");

        // Render Table Headers
        tableHead.innerHTML = `<tr>${data.tableCols.map(col => `<th>${col}</th>`).join("")}</tr>`;

        // Render Table Rows (Wrapping ID or first element in strong tag, applying status badge to last element)
        tableBody.innerHTML = data.tableRows.map(row => {
            const rowData = row.map((cell, idx) => {
                if(idx === 1 || (type === "students" && idx === 0)) return `<td><strong>${cell}</strong></td>`;
                if(idx === row.length - 1) return `<td><span class="status-badge">${cell}</span></td>`;
                return `<td>${cell}</td>`;
            }).join("");
            return `<tr>${rowData}</tr>`;
        }).join("");

        // Render Chart
        renderChart(data.chart);

        // Show Results
        reportResultsWrapper.style.display = "block";
        
        // Scroll to results smoothly
        reportResultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // =========================================
    //   CHART RENDERER
    // =========================================
    function renderChart(chartConfig) {
        chartTitle.innerText = chartConfig.title;
        
        if (currentChart) {
            currentChart.destroy();
        }

        const ctx = document.getElementById('dynamicReportChart').getContext('2d');
        Chart.defaults.font.family = "'Poppins', sans-serif";

        currentChart = new Chart(ctx, {
            type: chartConfig.type,
            data: {
                labels: chartConfig.labels,
                datasets: [{
                    label: 'Count',
                    data: chartConfig.data,
                    backgroundColor: chartConfig.colors,
                    borderRadius: chartConfig.type === 'bar' ? 4 : 0,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: chartConfig.type === 'doughnut', position: 'bottom' }
                },
                scales: chartConfig.type === 'bar' ? {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                } : {}
            }
        });
    }

    // =========================================
    //   EXPORT ACTIONS
    // =========================================
    document.getElementById("printReportBtn").addEventListener("click", () => window.print());
    
    document.getElementById("exportPdfBtn").addEventListener("click", () => {
        alert("In a full backend implementation, this button would send the filtered query parameters to Python/Flask to generate a downloadable PDF using a library like ReportLab or WeasyPrint.");
    });
});