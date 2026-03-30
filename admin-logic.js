let currentMentorPhoto = ""; 

// Navigation: Switches views and highlights sidebar
function setAdminView(id, el) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    
    // Show target view
    const targetSection = document.getElementById(id);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Update Sidebar Active Class
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');

    // Context-specific loading
    if (id === 'mentor-mgmt' || id === 'overview') displayAdminMentors();
    if (id === 'inbox') loadRequests();
}

// Mentor Management Logic
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; border-radius:12px; object-fit:cover;">`;
            currentMentorPhoto = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function registerMentor() {
    const name = document.getElementById('m-name').value;
    const edu = document.getElementById('m-edu').value;
    const age = document.getElementById('m-age').value;

    if(!name || !edu || !age || !currentMentorPhoto) {
        alert("Incomplete Profile! Please add a photo and fill all fields.");
        return;
    }

    const newMentor = { name, edu, age, img: currentMentorPhoto };
    let mentors = JSON.parse(localStorage.getItem('joboMentors')) || [];
    mentors.push(newMentor);
    localStorage.setItem('joboMentors', JSON.stringify(mentors));

    alert("System Synchronized: " + name + " is now live.");
    location.reload(); // Refresh to clear form and update list
}

function displayAdminMentors() {
    const list = document.getElementById('admin-mentor-list');
    if (!list) return;
    const mentors = JSON.parse(localStorage.getItem('joboMentors')) || [];
    
    if(mentors.length === 0) {
        list.innerHTML = "<p style='color:#555'>No mentors registered yet.</p>";
        return;
    }

    list.innerHTML = ""; 
    mentors.forEach((m, index) => {
        const item = document.createElement('div');
        item.className = "request-card"; // Reusing existing card styles
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.innerHTML = `
            <span><strong>${m.name}</strong> (${m.edu})</span>
            <button class="btn-outline" style="border-color:#ff4444; color:#ff4444; width:auto;" 
                    onclick="deleteMentor(${index})">Remove</button>
        `;
        list.appendChild(item);
    });
}

function deleteMentor(index) {
    if(confirm("Are you sure you want to remove this mentor?")) {
        let mentors = JSON.parse(localStorage.getItem('joboMentors')) || [];
        mentors.splice(index, 1);
        localStorage.setItem('joboMentors', JSON.stringify(mentors));
        displayAdminMentors();
    }
}

// Request Inbox Logic
function loadRequests() {
    const list = document.getElementById('admin-request-list');
    if (!list) return;
    const requests = JSON.parse(localStorage.getItem('mentorRequests')) || [];
    
    list.innerHTML = requests.length === 0 ? "<p>No pending requests.</p>" : "";
    requests.forEach((req) => {
        const div = document.createElement('div');
        div.className = 'request-card';
        div.innerHTML = `
            <span class="status-badge">${req.priority}</span>
            <strong>From: ${req.userName}</strong><br>
            <p>"${req.problem}"</p>
            <small>${req.time}</small>
        `;
        list.prepend(div);
    });
}

// Broadcast Logic
function sendGlobalAlert() {
    const text = document.getElementById('broadcast-msg').value;
    const type = document.getElementById('broadcast-type').value;

    if(!text) return alert("Please enter a message!");

    const alertData = { message: text, style: type, timestamp: Date.now() };
    localStorage.setItem('jobo_global_alert', JSON.stringify(alertData));
    
    alert("Broadcast Launched!");
    document.getElementById('broadcast-msg').value = ""; 
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}

// Initial Load
window.onload = () => {
    displayAdminMentors();
    setInterval(loadRequests, 5000);
};
