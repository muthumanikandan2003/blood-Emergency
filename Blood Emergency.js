// CONFIG: admin credentials
const ADMIN_USER = "mmk_2003";
const ADMIN_PASS = "muthu.2003";

// PAGE NAVIGATION
function showPage(id){
  document.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
  [...document.querySelectorAll('nav button')]
    .find(b=>b.textContent.toLowerCase().includes(id.replace('Login','')))
    ?.classList.add('active');

  if(id==='admin' && !isLoggedIn()) showPage('adminLogin');
  if(id==='admin') renderAdminList();
}

const form = document.getElementById('regForm');
const results = document.getElementById('results');
const adminList = document.getElementById('adminList');
document.getElementById('year').textContent = new Date().getFullYear();

function loadDonors(){ return JSON.parse(localStorage.getItem('donors') || '[]'); }
function saveDonors(a){ localStorage.setItem('donors', JSON.stringify(a)); }

// Register page
form.addEventListener('submit', e=>{
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form).entries());
  if(!d.name || !d.blood) return alert('Please fill name and blood group');
  const arr = loadDonors(); arr.push(d); saveDonors(arr);
  alert('Registered — thank you for donating!');
  form.reset();
});

// Render donor results
function renderResults(a){
  results.innerHTML = '';
  if(!a.length){ results.innerHTML='<div class="muted">No donors yet.</div>'; return; }
  a.forEach(d=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <h4>${escapeHtml(d.name)}</h4>
      <div class="muted">${escapeHtml(d.city)} • ${escapeHtml(d.blood)}</div>
      <div>${escapeHtml(d.phone)}<br>${escapeHtml(d.email)}</div>
    `;
    results.appendChild(el);
  });
}

// Filter donors
function applyFilter(){
  const blood = document.getElementById('filterBlood').value;
  const city = document.getElementById('filterCity').value.trim().toLowerCase();
  const arr = loadDonors().filter(d=>{
    if(blood && d.blood!==blood) return false;
    if(city && !d.city.toLowerCase().includes(city)) return false;
    return true;
  });
  renderResults(arr);
}

// CSV download
function downloadCSV(){
  const arr = loadDonors(); if(!arr.length) return alert('No donors to download');
  const rows = [['Name','Phone','Email','Blood','City'],
    ...arr.map(a=>[a.name,a.phone,a.email,a.blood,a.city])];
  const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'donors.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

// ADMIN LOGIN
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();
  if(user===ADMIN_USER && pass===ADMIN_PASS){
    localStorage.setItem('adminLogged','true');
    alert('Login successful!');
    showPage('admin');
  }else{
    alert('Invalid credentials');
  }
  loginForm.reset();
});

function isLoggedIn(){ return localStorage.getItem('adminLogged')==='true'; }
function logoutAdmin(){
  localStorage.removeItem('adminLogged');
  alert('Logged out successfully.');
  showPage('home');
}

// Admin functions
function renderAdminList(){
  const arr = loadDonors(); adminList.innerHTML='';
  if(!arr.length){ adminList.innerHTML='<div class="muted">No donors found.</div>'; return; }
  arr.forEach((d,i)=>{
    const el=document.createElement('div');
    el.className='card';
    el.innerHTML=`
      <h4>${escapeHtml(d.name)}</h4>
      <div>${escapeHtml(d.blood)} | ${escapeHtml(d.city)}</div>
      <div>${escapeHtml(d.phone)}<br>${escapeHtml(d.email)}</div>
      <button class="delete-btn" onclick="deleteDonor(${i})">Delete</button>
    `;
    adminList.appendChild(el);
  });
}

function deleteDonor(index){
  if(!confirm('Are you sure you want to delete this donor?')) return;
  const arr = loadDonors();
  arr.splice(index,1);
  saveDonors(arr);
  renderAdminList();
  alert('Donor deleted.');
}

// Admin add donor
document.getElementById('adminAddForm').addEventListener('submit', e=>{
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target).entries());
  const arr = loadDonors(); arr.push(d); saveDonors(arr);
  e.target.reset();
  renderAdminList();
  alert('Donor added successfully!');
});

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g,
    c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

renderResults(loadDonors());
