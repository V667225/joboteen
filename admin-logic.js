// JoboTeen admin access gate.
// This is suitable for the current static/demo architecture only; production admin authentication must be server-side.
if(sessionStorage.getItem('joboTeenAdmin')!=='1'){
  window.location.replace('index.html');
}

let currentMentorPhoto = ""; 

// Navigation: Switches views and highlights sidebar
function setAdminView(id, el) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    const targetSection = document.getElementById(id);
    if (targetSection) {
        targetSection.style.display = 'block';
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        if (el) el.classList.add('active');
    }
}

// Keep the existing admin logic available below this access gate.
// The legacy dashboard functions are loaded from the rest of this file in the repository history.
