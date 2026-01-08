// ===== CONFIG =====
const API = "https://blood-emergency-backend.onrender.com";
const ADMIN_USER = "mmk_2003";
const ADMIN_PASS = "muthu.2003";

// ===== ELEMENTS =====
const form = document.getElementById("regForm");
const results = document.getElementById("results");
const adminList = document.getElementById("adminList");
const loginForm = document.getElementById("loginForm");
document.getElementById("year").textContent = new Date().getFullYear();

// ===== NAVIGATION =====
function showPage(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "admin" && !isLoggedIn()) showPage("adminLogin");
}

// ===== DONORS =====
async function fetchDonors() {
  const res = await fetch(API);
  const data = await res.json();
  renderResults(data);
  renderAdminList(data);
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const donor = Object.fromEntries(new FormData(form).entries());
  if (!donor.name || !donor.blood) return alert("Fill name & blood group");

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donor)
  });

  if (res.ok) {
    alert("Registered successfully ❤️");
    form.reset();
    fetchDonors();
  }
});

// ===== SEARCH =====
function renderResults(arr) {
  results.innerHTML = "";
  if (!arr.length) return (results.innerHTML = "<p>No donors found</p>");

  arr.forEach(d => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h4>${escapeHtml(d.name)}</h4>
      <p>${escapeHtml(d.blood)} | ${escapeHtml(d.city)}</p>
      <p>${escapeHtml(d.phone)}</p>
    `;
    results.appendChild(el);
  });
}

async function applyFilter() {
  const blood = document.getElementById("filterBlood").value;
  const city = document.getElementById("filterCity").value;
  const res = await fetch(`${API}/filter?blood=${blood}&city=${city}`);
  renderResults(await res.json());
}

// ===== ADMIN =====
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  if (
    adminUser.value === ADMIN_USER &&
    adminPass.value === ADMIN_PASS
  ) {
    localStorage.setItem("adminLogged", "true");
    alert("Admin logged in");
    showPage("admin");
    fetchDonors();
  } else alert("Invalid credentials");
});

function isLoggedIn() {
  return localStorage.getItem("adminLogged") === "true";
}

function logoutAdmin() {
  localStorage.removeItem("adminLogged");
  showPage("home");
}

function renderAdminList(arr) {
  if (!isLoggedIn()) return;
  adminList.innerHTML = "";

  arr.forEach(d => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h4>${escapeHtml(d.name)}</h4>
      <p>${escapeHtml(d.blood)} | ${escapeHtml(d.city)}</p>
      <button onclick="deleteDonor(${d.id})" class="delete-btn">Delete</button>
    `;
    adminList.appendChild(el);
  });
}

async function deleteDonor(id) {
  if (!confirm("Delete donor?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchDonors();
}

// ===== UTIL =====
function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ===== START =====
fetchDonors();
