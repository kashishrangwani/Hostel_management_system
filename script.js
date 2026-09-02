/**
 * ===================================================
 * HOSTEL MANAGEMENT SYSTEM - USER SIDE
 * Pure Vanilla JavaScript
 * Beginner-friendly, Clean & Modular
 * ===================================================
 */

// Initial Seed Data for Complaint History
const DEFAULT_COMPLAINTS = [
  {
    id: 1,
    title: "Fan regulator not working properly",
    category: "Electrical",
    status: "In Progress",
    date: "2026-08-28"
  },
  {
    id: 2,
    title: "Bathroom tap leakage in Room 304",
    category: "Plumbing",
    status: "Resolved",
    date: "2026-08-24"
  },
  {
    id: 3,
    title: "Slow Wi-Fi speed on 3rd floor Block B",
    category: "Wi-Fi / Internet",
    status: "Pending",
    date: "2026-09-01"
  },
  {
    id: 4,
    title: "Request for extra study chair",
    category: "Room Furniture",
    status: "Resolved",
    date: "2026-08-15"
  }
];

// Helper: Get stored complaints or initialize with default
function getStoredComplaints() {
  const data = localStorage.getItem("hostel_complaints");
  if (!data) {
    localStorage.setItem("hostel_complaints", JSON.stringify(DEFAULT_COMPLAINTS));
    return DEFAULT_COMPLAINTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_COMPLAINTS;
  }
}

// Helper: Save complaints to localStorage
function saveComplaints(complaints) {
  localStorage.setItem("hostel_complaints", JSON.stringify(complaints));
}

// Email Validation Regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// 10-Digit Phone Validation Regex
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.trim());
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", function () {
  // 1. Setup Mobile Navigation (Hamburger)
  initNavbar();

  // 2. Setup Active Navigation Link
  highlightActiveNavLink();

  // 3. Setup Show/Hide Password Toggles
  initPasswordToggles();

  // 4. Setup Login Form Validation
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    initLoginForm(loginForm);
  }

  // 5. Setup Register Form Validation
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    initRegisterForm(registerForm);
  }

  // 6. Setup Complaint Form
  const complaintForm = document.getElementById("complaintForm");
  if (complaintForm) {
    initComplaintForm(complaintForm);
  }

  // 7. Setup Leave Application Form
  const leaveForm = document.getElementById("leaveForm");
  if (leaveForm) {
    initLeaveForm(leaveForm);
  }

  // 8. Setup Complaint Table (table.html)
  const complaintTableBody = document.getElementById("complaintTableBody");
  if (complaintTableBody) {
    renderComplaintTable();
    initTableSearch();
  }

  // 9. Setup Dashboard Specifics (dashboard.html)
  initDashboard();
});

/**
 * ----------------------------------------------------
 * 1. NAVBAR & MOBILE MENU
 * ----------------------------------------------------
 */
function initNavbar() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
}

/**
 * Highlights the current page in the navigation bar
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPath || (currentPath === "" && linkHref === "index.html")) {
      link.classList.add("active");
    }
  });
}

/**
 * ----------------------------------------------------
 * 2. SHOW / HIDE PASSWORD TOGGLE
 * ----------------------------------------------------
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll(".toggle-password-btn");

  toggleButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const targetInputId = btn.getAttribute("data-target");
      const passwordInput = document.getElementById(targetInputId);

      if (passwordInput) {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          btn.textContent = "Hide";
        } else {
          passwordInput.type = "password";
          btn.textContent = "Show";
        }
      }
    });
  });
}

/**
 * ----------------------------------------------------
 * 3. LOGIN FORM VALIDATION
 * ----------------------------------------------------
 */
function initLoginForm(form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    let isValid = true;

    // Reset error messages
    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    emailInput.classList.remove("error");
    passwordInput.classList.remove("error");

    // Email validation
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      emailError.textContent = "Email is required.";
      emailInput.classList.add("error");
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      emailError.textContent = "Please enter a valid email address.";
      emailInput.classList.add("error");
      isValid = false;
    }

    // Password validation
    const passwordVal = passwordInput.value;
    if (!passwordVal) {
      passwordError.textContent = "Password is required.";
      passwordInput.classList.add("error");
      isValid = false;
    } else if (passwordVal.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      passwordInput.classList.add("error");
      isValid = false;
    }

    if (isValid) {
      // Store user session name for dashboard
      const username = emailVal.split("@")[0];
      const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
      localStorage.setItem("hostel_user", JSON.stringify({ name: formattedName, email: emailVal }));

      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    }
  });
}

/**
 * ----------------------------------------------------
 * 4. REGISTER FORM VALIDATION
 * ----------------------------------------------------
 */
function initRegisterForm(form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("regName");
    const emailInput = document.getElementById("regEmail");
    const phoneInput = document.getElementById("regPhone");
    const courseInput = document.getElementById("regCourse");
    const passwordInput = document.getElementById("regPassword");
    const confirmPasswordInput = document.getElementById("regConfirmPassword");
    const genderInputs = document.querySelectorAll('input[name="gender"]');

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const courseError = document.getElementById("courseError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const genderError = document.getElementById("genderError");

    let isValid = true;

    // Reset error styling
    [nameInput, emailInput, phoneInput, courseInput, passwordInput, confirmPasswordInput].forEach(inp => {
      if (inp) inp.classList.remove("error");
    });
    [nameError, emailError, phoneError, courseError, passwordError, confirmPasswordError, genderError].forEach(err => {
      if (err) err.textContent = "";
    });

    // 1. Name Check
    if (!nameInput.value.trim()) {
      nameError.textContent = "Full name is required.";
      nameInput.classList.add("error");
      isValid = false;
    }

    // 2. Email Check
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      emailError.textContent = "Email is required.";
      emailInput.classList.add("error");
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      emailError.textContent = "Enter a valid email address.";
      emailInput.classList.add("error");
      isValid = false;
    }

    // 3. Phone Check (10 digits)
    const phoneVal = phoneInput.value.trim();
    if (!phoneVal) {
      phoneError.textContent = "Phone number is required.";
      phoneInput.classList.add("error");
      isValid = false;
    } else if (!isValidPhone(phoneVal)) {
      phoneError.textContent = "Phone number must be exactly 10 digits.";
      phoneInput.classList.add("error");
      isValid = false;
    }

    // 4. Course / Year Check
    if (!courseInput.value.trim()) {
      courseError.textContent = "Please select or enter your course/year.";
      courseInput.classList.add("error");
      isValid = false;
    }

    // 5. Gender Check
    let genderSelected = false;
    genderInputs.forEach(radio => {
      if (radio.checked) genderSelected = true;
    });
    if (!genderSelected) {
      genderError.textContent = "Please select your gender.";
      isValid = false;
    }

    // 6. Password Check
    const passVal = passwordInput.value;
    if (!passVal) {
      passwordError.textContent = "Password is required.";
      passwordInput.classList.add("error");
      isValid = false;
    } else if (passVal.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      passwordInput.classList.add("error");
      isValid = false;
    }

    // 7. Confirm Password Check
    const confirmPassVal = confirmPasswordInput.value;
    if (!confirmPassVal) {
      confirmPasswordError.textContent = "Please confirm your password.";
      confirmPasswordInput.classList.add("error");
      isValid = false;
    } else if (passVal !== confirmPassVal) {
      confirmPasswordError.textContent = "Passwords do not match.";
      confirmPasswordInput.classList.add("error");
      isValid = false;
    }

    if (isValid) {
      // Save newly registered user info
      localStorage.setItem("hostel_user", JSON.stringify({
        name: nameInput.value.trim(),
        email: emailVal,
        phone: phoneVal,
        course: courseInput.value.trim()
      }));

      alert("Registration successful! Welcome to the Hostel Portal. Please login with your credentials.");
      window.location.href = "login.html";
    }
  });
}

/**
 * ----------------------------------------------------
 * 5. COMPLAINT FORM VALIDATION & STORAGE
 * ----------------------------------------------------
 */
function initComplaintForm(form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const titleInput = document.getElementById("complaintTitle");
    const categoryInput = document.getElementById("complaintCategory");
    const descInput = document.getElementById("complaintDesc");

    const titleError = document.getElementById("complaintTitleError");
    const categoryError = document.getElementById("complaintCategoryError");
    const descError = document.getElementById("complaintDescError");

    let isValid = true;

    // Reset errors
    if (titleError) titleError.textContent = "";
    if (categoryError) categoryError.textContent = "";
    if (descError) descError.textContent = "";
    titleInput.classList.remove("error");
    categoryInput.classList.remove("error");
    descInput.classList.remove("error");

    if (!titleInput.value.trim()) {
      titleError.textContent = "Complaint title is required.";
      titleInput.classList.add("error");
      isValid = false;
    }

    if (!categoryInput.value) {
      categoryError.textContent = "Please select a category.";
      categoryInput.classList.add("error");
      isValid = false;
    }

    if (!descInput.value.trim()) {
      descError.textContent = "Please provide a detailed description.";
      descInput.classList.add("error");
      isValid = false;
    }

    if (isValid) {
      const today = new Date().toISOString().split("T")[0];
      const newComplaint = {
        id: Date.now(),
        title: titleInput.value.trim(),
        category: categoryInput.value,
        description: descInput.value.trim(),
        status: "Pending",
        date: today
      };

      const complaints = getStoredComplaints();
      complaints.unshift(newComplaint); // add to front
      saveComplaints(complaints);

      alert("Complaint registered successfully!\nStatus: Pending\nTracking ID: #" + newComplaint.id.toString().slice(-4));
      form.reset();
    }
  });
}

/**
 * ----------------------------------------------------
 * 6. LEAVE APPLICATION FORM VALIDATION
 * ----------------------------------------------------
 */
function initLeaveForm(form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fromDateInput = document.getElementById("leaveFromDate");
    const toDateInput = document.getElementById("leaveToDate");
    const reasonInput = document.getElementById("leaveReason");

    const fromDateError = document.getElementById("fromDateError");
    const toDateError = document.getElementById("toDateError");
    const reasonError = document.getElementById("leaveReasonError");

    let isValid = true;

    // Reset errors
    if (fromDateError) fromDateError.textContent = "";
    if (toDateError) toDateError.textContent = "";
    if (reasonError) reasonError.textContent = "";
    fromDateInput.classList.remove("error");
    toDateInput.classList.remove("error");
    reasonInput.classList.remove("error");

    if (!fromDateInput.value) {
      fromDateError.textContent = "From date is required.";
      fromDateInput.classList.add("error");
      isValid = false;
    }

    if (!toDateInput.value) {
      toDateError.textContent = "To date is required.";
      toDateInput.classList.add("error");
      isValid = false;
    }

    if (fromDateInput.value && toDateInput.value) {
      const from = new Date(fromDateInput.value);
      const to = new Date(toDateInput.value);

      if (to < from) {
        toDateError.textContent = "'To Date' cannot be before 'From Date'.";
        toDateInput.classList.add("error");
        isValid = false;
      }
    }

    if (!reasonInput.value.trim()) {
      reasonError.textContent = "Please specify reason for leave.";
      reasonInput.classList.add("error");
      isValid = false;
    }

    if (isValid) {
      alert("Leave application submitted successfully! Your request has been forwarded to the Hostel Warden for approval.");
      form.reset();
    }
  });
}

/**
 * ----------------------------------------------------
 * 7. COMPLAINT HISTORY TABLE (table.html)
 * ----------------------------------------------------
 */
function renderComplaintTable(filterText = "", filterStatus = "All") {
  const tableBody = document.getElementById("complaintTableBody");
  if (!tableBody) return;

  const complaints = getStoredComplaints();
  tableBody.innerHTML = "";

  const filtered = complaints.filter(item => {
    const matchesText = item.title.toLowerCase().includes(filterText.toLowerCase()) ||
                        item.category.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesText && matchesStatus;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">
          <p>No complaints found matching your criteria.</p>
          <a href="forms.html" class="btn btn-sm btn-primary">File a New Complaint</a>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement("tr");

    // Status Badge Styling
    let badgeClass = "badge-pending";
    if (item.status === "Resolved") badgeClass = "badge-resolved";
    if (item.status === "In Progress") badgeClass = "badge-progress";

    tr.innerHTML = `
      <td>
        <strong style="color: var(--text-main);">${escapeHtml(item.title)}</strong>
        <div><span class="category-tag">${escapeHtml(item.category)}</span></div>
      </td>
      <td>
        <span class="badge ${badgeClass}">${escapeHtml(item.status)}</span>
      </td>
      <td style="color: var(--text-muted); font-size: 13px;">
        ${escapeHtml(item.date)}
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function initTableSearch() {
  const searchInput = document.getElementById("tableSearchInput");
  const statusSelect = document.getElementById("tableStatusFilter");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchVal = searchInput.value;
      const statusVal = statusSelect ? statusSelect.value : "All";
      renderComplaintTable(searchVal, statusVal);
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener("change", () => {
      const searchVal = searchInput ? searchInput.value : "";
      const statusVal = statusSelect.value;
      renderComplaintTable(searchVal, statusVal);
    });
  }
}

/**
 * ----------------------------------------------------
 * 8. DASHBOARD LOGIC
 * ----------------------------------------------------
 */
function initDashboard() {
  const welcomeNameElement = document.getElementById("welcomeUserName");
  if (welcomeNameElement) {
    const user = JSON.parse(localStorage.getItem("hostel_user") || "null");
    if (user && user.name) {
      welcomeNameElement.textContent = user.name;
    }
  }

  // Logout button handling
  const logoutBtns = document.querySelectorAll(".logout-btn");
  logoutBtns.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("hostel_user");
        alert("You have been logged out.");
        window.location.href = "login.html";
      }
    });
  });
}

// Utility: Prevent XSS in rendered HTML
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
