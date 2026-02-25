// INITIALIZE PLATFORM
function launchPlatform() {
    const nameInput = document.getElementById('reg-name');
    if(nameInput.value.trim() === "") {
        alert("Please enter your name to initialize!");
        return;
    }
    
    document.getElementById('user-display').innerText = nameInput.value;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
}

// NAVIGATION ENGINE
function toggleMenu(id) {
    const menu = document.getElementById(id);
    menu.classList.toggle('show-menu');
}

function setView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = 'none';
    });
    
    // Show selected view
    const activeView = document.getElementById(viewId);
    activeView.style.display = 'block';
    setTimeout(() => activeView.classList.add('active-view'), 10);

    // If game view is opened, start the game loop
    if(viewId === 'game-view') initGame();
}

// FUNTABU GAME LOGIC
let score = 0;
let gameActive = false;

function initGame() {
    if(gameActive) return; // Prevent multiple loops
    gameActive = true;
    const canvas = document.getElementById('game-canvas');
    
    setInterval(() => {
        const currentView = document.getElementById('game-view');
        if(currentView.style.display === 'block') {
            spawnAtom(canvas);
        }
    }, 1200);
}

function spawnAtom(canvas) {
    const atom = document.createElement('div');
    atom.className = 'atom';
    
    // Random position logic
    const maxX = canvas.offsetWidth - 50;
    const maxY = canvas.offsetHeight - 50;
    atom.style.left = Math.floor(Math.random() * maxX) + 'px';
    atom.style.top = Math.floor(Math.random() * maxY) + 'px';
    
    atom.onclick = () => {
        score += 10;
        document.getElementById('score-val').innerText = score;
        atom.remove();
    };
    
    canvas.appendChild(atom);
    
    // Auto-remove if not clicked
    setTimeout(() => { if(atom.parentElement) atom.remove(); }, 2000);
}

function joinMeeting() {
    alert("Connection established. Virtual Meeting Hub is ready for 1,000 peers.");
}

let selectedMentor = "";

function openBooking(mentorName) {
    selectedMentor = mentorName;
    const form = document.getElementById('booking-form');
    document.getElementById('booking-title').innerText = "Message to " + mentorName;
    
    // Smooth scroll to form
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
    
    notify("Secure portal opened with " + mentorName);
}

function submitRequest() {
    const problem = document.getElementById('problem-desc').value;
    const urgency = document.getElementById('urgency').value;

    if(problem.length < 10) {
        alert("Please describe your problem more clearly so your mentor can help.");
        return;
    }

    // In a real app, this sends the data to the Admin Panel for Ambani/Vina
    console.log("MENTOR REQUEST:", { mentor: selectedMentor, text: problem, priority: urgency });

    // Success Feedback
    notify("Message sent! " + selectedMentor + " will review this privately.");
    
    // Clear and Hide
    document.getElementById('problem-desc').value = "";
    document.getElementById('booking-form').style.display = 'none';
    
    // Switch view back to profile after success
    setTimeout(() => setView('profile-view'), 3000);
}

// Update character count live
function updateCount() {
    const input = document.getElementById('life-story-input');
    const countDisplay = document.getElementById('current-chars');
    countDisplay.innerText = input.value.length;
}

// Save Story Logic
function saveStory() {
    const storyText = document.getElementById('life-story-input').value;
    
    if(storyText.trim().length < 20) {
        notify("Your story is a bit short! Tell us more.");
        return;
    }

    // Simulate saving to database
    console.log("Saving Story:", storyText);
    
    // Trigger a high-end notification
    notify("Story updated successfully! Mentors can now view your journey.");
    
    // Optional: Add a subtle glow flash to the box
    const wrapper = document.querySelector('.textarea-wrapper');
    wrapper.style.boxShadow = "0 0 40px rgba(0, 242, 255, 0.4)";
    setTimeout(() => { wrapper.style.boxShadow = "none"; }, 1000);
}

function submitRequest() {
    const problem = document.getElementById('problem-desc').value;
    const userName = document.getElementById('user-display').innerText;
    
    const newRequest = {
        userName: userName,
        problem: problem,
        priority: document.getElementById('urgency').value,
        time: new Date().toLocaleTimeString()
    };

    // Save to localStorage (The "Link" between pages)
    let allRequests = JSON.parse(localStorage.getItem('mentorRequests')) || [];
    allRequests.push(newRequest);
    localStorage.setItem('mentorRequests', JSON.stringify(allRequests));

    notify("Securely sent! Mentor Ambani has received your message.");
}

function goToAdmin() {
    // Basic Security: You can add a prompt here
    const pass = prompt("Enter Admin Access Code:");
    
    if (pass === "JOBO2026") { // You can change this code
        notify("Access Granted. Initializing Admin Mode...");
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        alert("Unauthorized Access Attempt Detected.");
    }
}

function displayMentors() {
    const grid = document.querySelector('.mentor-grid');
    if(!grid) return; 

    // Clear the grid first
    grid.innerHTML = "";

    // Pull registered mentors from storage
    const mentors = JSON.parse(localStorage.getItem('joboMentors')) || [];

    mentors.forEach(m => {
        const card = document.createElement('div');
        card.className = 'mentor-card glass-card';
        card.innerHTML = `
            <div class="mentor-pic" style="background-image: url('${m.img}'); background-size: cover;"></div>
            <h3>${m.name}</h3>
            <p class="specialty">${m.edu}</p>
            <p style="font-size: 0.8rem; color: #888;">Age: ${m.age}</p>
            <button class="btn-shine small" onclick="openBooking('${m.name}')">Book Session</button>
        `;
        grid.appendChild(card);
    });
}

// Run this function whenever the Find Mentor section is opened
function setView(id) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    if(id === 'mentor-view') {
        displayMentors();
    }
}

// This function checks for new broadcasts every 2 seconds
function listenForBroadcasts() {
    const lastSeenAlert = localStorage.getItem('last_seen_alert_time');
    const globalAlertRaw = localStorage.getItem('jobo_global_alert');

    if (globalAlertRaw) {
        const alertData = JSON.parse(globalAlertRaw);

        // If the timestamp is newer than the one we last saw, show it
        if (!lastSeenAlert || alertData.timestamp > lastSeenAlert) {
            
            // Trigger our high-end notification system
            triggerGlobalToast(alertData.message, alertData.style);
            
            // Mark this alert as "seen" on this specific computer
            localStorage.setItem('last_seen_alert_time', alertData.timestamp);
        }
    }
}

// Custom Toast for Global Alerts
function triggerGlobalToast(msg, style) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Set style based on Admin choice
    let borderColor = "var(--accent)";
    if(style === 'urgent') borderColor = "var(--primary)";
    if(style === 'emergency') borderColor = "#ff4444";

    toast.className = 'toast';
    toast.style.borderLeft = `4px solid ${borderColor}`;
    toast.innerHTML = `<strong>📢 ADMIN BROADCAST:</strong><br>${msg}`;
    
    container.appendChild(toast);

    // Play a subtle sound effect if you like, then remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 6000); // Global alerts stay longer (6 seconds)
}


// Update setView to handle the active color on the sub-items
function setView(id) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'block';

    // Update active state in sidebar
    document.querySelectorAll('.nav-item, .sub-menu li').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(id)) {
            item.classList.add('active');
        }
    });
}

// Add this to both script files
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const btn = document.querySelector('.collapse-btn');
    sidebar.classList.toggle('collapsed');
    
    // Flip the arrow
    btn.innerText = sidebar.classList.contains('collapsed') ? '▶' : '◀';
}

// Updated setView to handle 'active' highlight
function setView(id, el) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(el) el.classList.add('active');
}


// Add this to the bottom of script.js
setInterval(listenForBroadcasts, 3000);

// Ensure the find-mentor view pulls the latest data
function setView(id, el) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(el) el.classList.add('active');

    if(id === 'mentor-view') displayMentors();

}




// --- TIC TAC TOE ENGINE ---
let tttState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let userPlayer = "X";
let aiPlayer = "O";
let credits = localStorage.getItem('neuralCredits') || 0;

function handleMove(index) {
    const cells = document.querySelectorAll('.cell');
    if (tttState[index] !== "" || !isGameActive) return;

    // Player Move
    executeMove(index, userPlayer);
    
    if (checkWinner(userPlayer)) {
        endGame("Victory! +50 Credits");
        updateCredits(50);
    } else if (tttState.includes("")) {
        // AI Turn
        setTimeout(aiThink, 600);
    } else {
        endGame("Equilibrium Reached (Draw)");
    }
}

function executeMove(index, player) {
    tttState[index] = player;
    const cells = document.querySelectorAll('.cell');
    cells[index].innerText = player;
    cells[index].classList.add('taken', player.toLowerCase());
}

function aiThink() {
    if (!isGameActive) return;
    let available = tttState.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let move = available[Math.floor(Math.random() * available.length)];
    
    executeMove(move, aiPlayer);
    
    if (checkWinner(aiPlayer)) {
        endGame("AI Override: Link Severed.");
    }
}

function checkWinner(p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(cond => cond.every(idx => tttState[idx] === p));
}

function endGame(msg) {
    isGameActive = false;
    document.getElementById('game-status').innerText = msg;
}

function updateCredits(amt) {
    credits = parseInt(credits) + amt;
    localStorage.setItem('neuralCredits', credits);
    document.getElementById('neural-credits').innerText = credits;
}

function resetTTT() {
    tttState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    document.getElementById('game-status').innerText = "Your Turn (X)";
    document.querySelectorAll('.cell').forEach(c => {
        c.innerText = "";
        c.className = "cell";
    });
}

// --- FIXING THE NAVIGATION FLOW ---
function setView(id, el) {
    // Hide all
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    // Show target
    document.getElementById(id).style.display = 'block';
    
    // Sidebar highlight
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(el) el.classList.add('active');

    // Run specific logic per view
    if(id === 'game-view') resetTTT();
    if(id === 'mentor-view') displayMentors();
}


function resetTTT() {
    tttState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    
    // Reset status and visuals
    const statusEl = document.getElementById('game-status');
    statusEl.innerText = "Your Turn (X)";
    statusEl.style.color = "white"; // Reset color if it changed on win/loss

    document.querySelectorAll('.cell').forEach(c => {
        c.innerText = "";
        c.className = "cell";
    });
}
