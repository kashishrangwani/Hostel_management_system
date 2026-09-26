const authBox = document.getElementById("authBox");
const role = document.getElementById("role");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

/* =========================================
   ROLE SELECTION (UI only)
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
   SHOW SIGN UP / LOGIN (UI only)
========================================= */
showSignup.addEventListener("click", function () {
    authBox.classList.add("signup-active");
});

showLogin.addEventListener("click", function () {
    authBox.classList.remove("signup-active");
});

/* =========================================
   HELPERS
========================================= */
function clearErrors(formSelector) {
    document.querySelectorAll(formSelector + " span").forEach(function (span) {
        span.innerHTML = "";
    });
}

function showFormMessage(elementId, message, isSuccess) {
    const el = document.getElementById(elementId);
    el.innerHTML = message;
    el.style.color = isSuccess ? "#167D8D" : "#DC2626";
}

/* =========================================
   LOGIN SUBMIT
   Only checks that fields are filled in here.
   The actual authentication (does this user exist,
   is the password correct) happens in login.php.
========================================= */
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    clearErrors("#loginForm");
    document.getElementById("loginFormMessage").innerHTML = "";

    const selectedRole = document.getElementById("role").value;
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    let valid = true;

    if (selectedRole === "") {
        document.getElementById("roleError").innerHTML = "Please select a role";
        valid = false;
    }
    if (email === "") {
        document.getElementById("loginEmailError").innerHTML = "Email is required";
        valid = false;
    }
    if (password === "") {
        document.getElementById("loginPasswordError").innerHTML = "Password is required";
        valid = false;
    }

    if (!valid) return;

    fetch("login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, email: email, password: password })
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                showFormMessage("loginFormMessage", data.message, true);
                setTimeout(function () {
                    window.location.href = data.redirect;
                }, 800);
            } else {
                // e.g. "Student not registered." or "Invalid admin credentials."
                showFormMessage("loginFormMessage", data.message, false);
            }
        })
        .catch(function () {
            showFormMessage("loginFormMessage", "Something went wrong. Please try again.", false);
        });
});

/* =========================================
   SIGN UP SUBMIT
   Client-side checks here are just for a snappy UX
   (format/required-field hints). The real save-to-database
   step, and the final success/failure message, come from
   register.php.
========================================= */
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    clearErrors(".signup-form");
    document.getElementById("signupFormMessage").innerHTML = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : "";
    const course = document.getElementById("course").value;
    const year = document.getElementById("year").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    let valid = true;

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

    if (!valid) return;

    fetch("register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            gender: gender,
            course: course,
            year: year,
            password: password,
            confirmPassword: confirmPassword
        })
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                // e.g. "You are registered! Please log in to continue."
                showFormMessage("signupFormMessage", data.message, true);
                document.getElementById("signupForm").reset();
                setTimeout(function () {
                    authBox.classList.remove("signup-active");
                }, 1200);
            } else {
                // e.g. "Student not registered." or a validation reason
                showFormMessage("signupFormMessage", data.message, false);
            }
        })
        .catch(function () {
            showFormMessage("signupFormMessage", "Student not registered. Please try again.", false);
        });
});
