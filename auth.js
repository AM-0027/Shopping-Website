/* =========================
   SIGNUP
========================= */

async function signup() {

  const name = document.getElementById("su-name").value.trim();
  const email = document.getElementById("su-email").value.trim();
  const password = document.getElementById("su-password").value;

  if (!name || !email || !password) {
    Swal.fire("Missing Fields", "All fields are required", "warning");
    return;
  }

  try {

    const res = await fetch("/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!data.success) {
      Swal.fire("Signup Failed", data.message || "Try again", "error");
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Signup Successful 🎉",
      text: "Please login to continue",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {

      document.getElementById("su-name").value = "";
      document.getElementById("su-email").value = "";
      document.getElementById("su-password").value = "";

      window.location.href = "login.html";

    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Server not responding", "error");
  }
}


/* =========================
   LOGIN
========================= */

async function login() {

  const email = document.getElementById("li-email").value.trim();
  const password = document.getElementById("li-password").value;

  if (!email || !password) {
    Swal.fire("Missing Fields", "Enter email and password", "warning");
    return;
  }

  try {

    const res = await fetch("/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
      Swal.fire("Login Failed", "Invalid email or password", "error");
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Successful 🛒",
      text: "Redirecting to home...",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "home.html";
    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Server not responding", "error");
  }
}


/* =========================
   LOGOUT
========================= */

function logout() {

  Swal.fire({
    title: "Logout?",
    text: "Do you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel"
  }).then(async (result) => {

    if (result.isConfirmed) {

      await fetch("/logout", {
        credentials: "include"
      });

      Swal.fire({
        icon: "success",
        title: "Logged Out",
        timer: 1200,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "/login.html";
      });

    }

  });

}


/* =========================
   PASSWORD TOGGLE
========================= */

function togglePassword(inputId, icon) {

  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    icon.innerText = "🙈";
  } else {
    input.type = "password";
    icon.innerText = "👁";
  }

}


/* =========================
   CHECK LOGIN SESSION
========================= */

async function checkAuth() {

  try {

    const res = await fetch("/check-auth", {
      credentials: "include"
    });

    if (!data.loggedIn) {
      window.location.href = "/login.html";
    }

  } catch (err) {
    console.error(err);
  }

}


