/* =========================
   ELEMENTS
========================= */

const adminLogo = document.getElementById("adminLogo");
const adminName = document.getElementById("adminName");
const dropdownName = document.getElementById("dropdownName");
const profileDropdown = document.getElementById("profileDropdown");
const profileInput = document.getElementById("profileInput");
const darkToggle = document.getElementById("darkModeToggle");
const logoutBtn = document.getElementById("logoutBtn");


/* =========================
   CHECK LOGIN SESSION
========================= */

async function checkAuth() {

  try {

    const res = await fetch("/check-auth", {
      credentials: "include"
    });

    const data = await res.json();

    if (!data.loggedIn) {
      window.location.href = "/login.html";
    }

  } catch (err) {
    console.error("Auth error:", err);
  }

}


/* =========================
   GET CURRENT USER
========================= */

async function getLoggedInUser() {

  try {

    const res = await fetch("/current-user", {
      credentials: "include"
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    adminName.textContent = data.name;
    dropdownName.textContent = data.name;

    if (data.profilePic) {
      adminLogo.src = data.profilePic;
    }

  } catch {

    adminName.textContent = "Admin";

  }

}

getLoggedInUser();


/* =========================
   PROFILE IMAGE CLICK
========================= */

adminLogo.addEventListener("click", (e) => {

  e.stopPropagation();
  profileInput.click();

});


/* =========================
   PROFILE IMAGE UPLOAD
========================= */

profileInput.addEventListener("change", () => {

  const file = profileInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    adminLogo.src = reader.result;

    localStorage.setItem("adminProfilePic", reader.result);

  };

  reader.readAsDataURL(file);

});


/* Load saved profile image */

const savedImage = localStorage.getItem("adminProfilePic");

if (savedImage) {
  adminLogo.src = savedImage;
}


/* =========================
   PROFILE DROPDOWN
========================= */

adminName.addEventListener("click", (e) => {

  e.stopPropagation();
  profileDropdown.classList.toggle("show");

});


document.addEventListener("click", () => {

  profileDropdown.classList.remove("show");

});


/* =========================
   DARK MODE
========================= */

if (localStorage.getItem("theme") === "dark") {

  document.body.classList.add("dark");
  darkToggle.checked = true;

}

darkToggle.addEventListener("change", () => {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );

});


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener("click", async () => {

  await fetch("/logout", {
    credentials: "include"
  });

  window.location.href = "/login.html";

});

/* =========================
   ADMIN
========================= */
const dropdownArrow = document.getElementById("dropdownArrow");

dropdownArrow.addEventListener("click", (e) => {

  e.stopPropagation();

  profileDropdown.classList.toggle("show");
  dropdownArrow.classList.toggle("rotate");

});

document.addEventListener("click", () => {

  profileDropdown.classList.remove("show");
  dropdownArrow.classList.remove("rotate");

});

async function getLoggedInUser() {

  const res = await fetch("/current-user", { credentials: "include" });

  const data = await res.json();

  const username =
    data.name.charAt(0).toUpperCase() +
    data.name.slice(1).toLowerCase();

  document.getElementById("adminName").textContent = username;
  document.getElementById("dropdownUser").textContent = username;

}

getLoggedInUser();

// PROFILE
let currentUsername = "";

async function getLoggedInUser() {

  try {

    const res = await fetch("/current-user", { credentials: "include" });
    const data = await res.json();

    currentUsername = data.name;

    const username =
      data.name.charAt(0).toUpperCase() +
      data.name.slice(1).toLowerCase();

    document.getElementById("adminName").textContent = username;
    document.getElementById("dropdownUser").textContent = username;

    /* load saved image for this user */

    const savedImage =
      localStorage.getItem("profile_" + currentUsername);

    if (savedImage) {
      adminLogo.src = savedImage;
    } else {
      adminLogo.src = "images/admin.png";
    }

  } catch {
    adminName.textContent = "Admin";
  }

}

getLoggedInUser();

profileInput.addEventListener("change", () => {

  const file = profileInput.files[0];

  if (!file || !currentUsername) return;

  const reader = new FileReader();

  reader.onload = () => {

    adminLogo.src = reader.result;

    /* save image for this user */

    localStorage.setItem(
      "profile_" + currentUsername,
      reader.result
    );

  };

  reader.readAsDataURL(file);

});

// INSTALL

const storeButtons = document.querySelectorAll(".row img");

storeButtons[0].addEventListener("click", () => {
  window.open("https://www.apple.com/app-store/", "_blank");
});

storeButtons[1].addEventListener("click", () => {
  window.open("https://play.google.com/store", "_blank");
});

// cart
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = 0;

  cart.forEach(item => {
    totalItems += item.qty;
  });

  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }
}

updateCartCount();