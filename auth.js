const authBox = document.getElementById("authBox");
const role = document.getElementById("role");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

/* =========================================
   ROLE SELECTION
========================================= */
role.addEventListener("change", function () {
    if (role.value === "student") {
        authBox.classList.remove("admin-mode");
    } else if (role.value === "admin") {
        authBox.classList.add("admin-mode");
        authBox.classList.remove("signup-active");
    } else {
        authBox.classList.remove("admin-mode");
    }
});

/* =========================================
   SHOW SIGN UP
========================================= */
showSignup.addEventListener("click", function () {
    authBox.classList.add("signup-active");
});

/* =========================================
   SHOW LOGIN
========================================= */
showLogin.addEventListener("click", function () {
    authBox.classList.remove("signup-active");
});

/* =========================================
   LOGIN VALIDATION
========================================= */
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let selectedRole = document.getElementById("role").value;
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;
    let valid = true;

    document.getElementById("roleError").innerHTML = "";
    document.getElementById("loginEmailError").innerHTML = "";
    document.getElementById("loginPasswordError").innerHTML = "";

    if (selectedRole === "") {
        document.getElementById("roleError").innerHTML = "Please select a role";
        valid = false;
        return;
    }

    if (selectedRole === "admin") {
        if (email === "admin@123" && password === "pass123") {
            alert("Admin login successful!");
            window.location.href = "admin_dashboard.html";
        } else {
            document.getElementById("loginEmailError").innerHTML = "Invalid admin credentials";
            valid = false;
        }
    } 
    else if (selectedRole === "student") {
        if (email === "admin@123" && password === "pass123") {
            document.getElementById("loginEmailError").innerHTML = "Admin credentials cannot be used for Student login";
            valid = false;
        } else {
            if (email === "") {
                document.getElementById("loginEmailError").innerHTML = "Email is required";
                valid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById("loginEmailError").innerHTML = "Enter a valid email";
                valid = false;
            }

            if (password === "") {
                document.getElementById("loginPasswordError").innerHTML = "Password is required";
                valid = false;
            } else if (password.length < 6) {
                document.getElementById("loginPasswordError").innerHTML = "Minimum 6 characters";
                valid = false;
            }

            if (valid) {
                alert("Student login successful!");
                // Add window.location.href = "student_dashboard.html"; here when ready
            }
        }
    }
});

/* =========================================
   SIGN UP VALIDATION
========================================= */
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let gender = document.querySelector('input[name="gender"]:checked');
    let course = document.getElementById("course").value;
    let year = document.getElementById("year").value;
    let password = document.getElementById("signupPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let valid = true;

    document.querySelectorAll(".signup-form span").forEach(function (span) {
        span.innerHTML = "";
    });

    if (name === "") {
        document.getElementById("nameError").innerHTML = "Name is required";
        valid = false;
    }

    if (email === "") {
        document.getElementById("signupEmailError").innerHTML = "Email is required";
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("signupEmailError").innerHTML = "Enter a valid email";
        valid = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        document.getElementById("phoneError").innerHTML = "Enter a valid 10-digit phone number";
        valid = false;
    }

    if (!gender) {
        document.getElementById("genderError").innerHTML = "Please select gender";
        valid = false;
    }

    if (course === "") {
        document.getElementById("courseError").innerHTML = "Please select course";
        valid = false;
    }

    if (year === "") {
        document.getElementById("yearError").innerHTML = "Please select year";
        valid = false;
    }

    if (password.length < 6) {
        document.getElementById("signupPasswordError").innerHTML = "Minimum 6 characters";
        valid = false;
    }

    if (confirmPassword === "") {
        document.getElementById("confirmPasswordError").innerHTML = "Please confirm your password";
        valid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").innerHTML = "Passwords do not match";
        valid = false;
    }

    if (valid) {
        alert("Registration successful!");
    }
});