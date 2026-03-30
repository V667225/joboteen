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
    renderMindLibrary();
}
function launchPlatform() {
    const nameInput = document.getElementById('reg-name');
    if(nameInput.value.trim() === "") {
        alert("Enter your name to start!");
        return;
    }
    
    // Switch the screens
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
    
    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('onclick').includes(viewId)) {
            item.classList.add('active');
        }
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

function updateCredits(amt) {
    credits = parseInt(credits) + amt;
    localStorage.setItem('neuralCredits', credits);
    
    // Formats numbers to look like 0050 instead of 50
    document.getElementById('neural-credits').innerText = credits.toString().padStart(4, '0');
}

function resetTTT() {
    tttState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    
    // Customized turn message
    const statusEl = document.getElementById('game-status');
    statusEl.innerText = "USER_TURN_PROMPT >";
    statusEl.style.color = "#fff";

    document.querySelectorAll('.cell').forEach(c => {
        c.innerText = "";
        c.className = "cell";
    });
}

function endGame(msg, color) {
    isGameActive = false;
    const statusEl = document.getElementById('game-status');
    statusEl.innerText = msg;
    statusEl.style.color = color;
}

// In your handleMove or checkWinner, use these strings:
// Win: endGame("LINK_SUCCESS // +50 NC", "#00f2ff");
// Loss: endGame("CORE_ERROR // LINK_SEVERED", "#ff0055");
// Draw: endGame("DATA_STASIS // NO_WINNER", "#aaa");



function displayMentors() {
    const container = document.getElementById('mentor-list'); // Ensure this ID exists in index.html
    if (!container) return;

    // Pull from the same key used in admin-logic.js
    const mentors = JSON.parse(localStorage.getItem('joboMentors')) || [];
    
    if (mentors.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="text-align:center; padding: 2rem;">
                <p>No Mentors are currently online. Check back shortly.</p>
            </div>`;
        return;
    }

    container.innerHTML = ""; // Clear existing
    mentors.forEach((m) => {
        const card = document.createElement('div');
        card.className = "mentor-card glass-card";
        card.innerHTML = `
            <div class="mentor-img" style="background-image: url('${m.img}')"></div>
            <div class="mentor-info">
                <h3>${m.name}</h3>
                <p class="specialty">${m.edu}</p>
                <button class="btn-shine small-btn" onclick="openBooking('${m.name}')">Request Session</button>
            </div>
        `;
        container.appendChild(card);
    });
}


function setView(id, el) {
    // 1. Hide all views
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    
    // 2. Show the target view
    const target = document.getElementById(id);
    if(target) target.style.display = 'block';

    // 3. Highlight the sidebar
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(el) el.classList.add('active');

    // 4. THE FIX: If switching to mentors, load them!
    if(id === 'mentor-view') {
        displayMentors();
    }
}



let selectedMentorName = "";

// Open the Secure Form
function openBooking(mentorName) {
    selectedMentorName = mentorName;
    const form = document.getElementById('booking-form');
    const title = document.getElementById('booking-title');
    
    title.innerHTML = `<span style="color:var(--accent)">ENCRYPTED_UPLINK:</span><br>${mentorName}`;
    form.style.display = 'block';
    
    // Add a dark overlay to the background if you want
    document.body.style.overflow = 'hidden'; 
}

// Close the Form
function closeBooking() {
    document.getElementById('booking-form').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle Submission
function submitRequest() {
    const problem = document.getElementById('problem-desc').value;
    const urgency = document.getElementById('urgency').value;
    const userName = document.getElementById('user-display').innerText;

    if (!problem) return alert("Please describe your challenge.");

    const requestData = {
        mentorName: selectedMentorName,
        userName: userName,
        problem: problem,
        priority: urgency,
        time: new Date().toLocaleTimeString()
    };

    // Save to localStorage for Admin to see
    let requests = JSON.parse(localStorage.getItem('mentorRequests')) || [];
    requests.push(requestData);
    localStorage.setItem('mentorRequests', JSON.stringify(requests));

    // Success Animation/Feedback
    alert("TRANSMISSION_SUCCESS: Your mentor has been notified.");
    closeBooking();
    document.getElementById('problem-desc').value = ""; // Clear form
}





// ==========================================
// NOVEL SYSTEM ENGINE
// ==========================================

const novels = {
    'dreamer': {
        title: "The Dreamer",
        description: "Amira's art is being mocked. Will she quit?",
        category: "PERSEVERANCE",
        color: "#ff00ff",
        xp: "+500 XP",
        startNode: 'start',
        nodes: {
            'start': { text: "Friends laugh at your art. 'Waste of time!' they say.", choices: [{ text: "Keep Drawing", nextNode: 'win' }, { text: "Quit", nextNode: 'lose' }] },
            'win': { text: "You became a pro! THE END.", choices: [] },
            'lose': { text: "You gave up on your talent. THE END.", choices: [] }
        }
    },
    'robot': {
        title: "Robot Failure",
        description: "Daniel's robot exploded. Now what?",
        category: "RESILIENCE",
        color: "#00f2ff",
        xp: "+600 XP",
        startNode: 'start',
        nodes: {
            'start': { text: "The robot is sparking on the floor. Judges are watching.", choices: [{ text: "Fix it", nextNode: 'win' }, { text: "Cry", nextNode: 'lose' }] },
            'win': { text: "You won the trophy! THE END.", choices: [] },
            'lose': { text: "You left in shame. THE END.", choices: [] }
        }
    }
};

function openNovel(storyKey) {
    const story = novels[storyKey];
    const modal = document.getElementById('novel-modal');
    const container = document.getElementById('novel-reader-content');

    if (!story || !modal) return;

    // Show the modal
    modal.style.display = 'flex';

    // Start the story at the 'start' node
    renderNode(storyKey, story.startNode);
}

function renderNode(storyKey, nodeKey) {
    const story = novels[storyKey];
    const node = story.nodes[nodeKey];
    const container = document.getElementById('novel-reader-content');

    if (!node || !container) {
        console.error("Missing node or container!");
        return;
    }

    // 1. Create the Title and Story Text
    let html = `
        <h2 style="color: var(--accent); margin-bottom: 10px;">${story.title}</h2>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
        <p class="terminal-text" style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
            ${node.text}
        </p>
    `;

    // 2. Create the Choice Buttons
    html += `<div class="choice-stack" style="display: flex; flex-direction: column; gap: 12px;">`;
    
    if (node.choices.length > 0) {
        node.choices.forEach(choice => {
            html += `
                <button class="btn-shine" onclick="renderNode('${storyKey}', '${choice.nextNode}')">
                    ${choice.text}
                </button>`;
        });
    } else {
        // If the story is over
        html += `
            <p style="color: #888; font-style: italic;">--- End of Simulation ---</p>
            <button class="btn-shine" onclick="closeNovel()" style="background: var(--primary);">
                RETURN TO LIBRARY
            </button>`;
    }

    html += `</div>`;

    // 3. Paste it into the modal
    container.innerHTML = html;
}
function closeNovel() {
    document.getElementById('novel-modal').style.display = 'none';
}

function renderNode(novelKey, nodeKey) {
    const node = novels[novelKey].nodes[nodeKey];
    const container = document.getElementById('reader-content');
    const title = document.getElementById('reader-title');
    
    if (!node) return;

    title.innerText = novels[novelKey].title;
    
    // Injecting the text and a new choice box
    container.innerHTML = `<p class="story-text animate-text" style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 30px;">${node.text}</p>`;
    
    const choiceBox = document.createElement('div');
    choiceBox.className = "choice-container";
    choiceBox.style.display = "flex";
    choiceBox.style.flexDirection = "column";
    choiceBox.style.gap = "10px";
    
    node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "btn-shine small-btn";
        btn.style.width = "100%";
        btn.innerText = choice.text;
        btn.onclick = () => renderNode(novelKey, choice.next);
        choiceBox.appendChild(btn);
    });

    container.appendChild(choiceBox);
}

function closeNovel() {
    document.getElementById('novel-reader').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function startCareerSim() {
    const interest = prompt("Identify interest sector (e.g., TECH, BIO, DESIGN):");
    if (interest) {
        // Utilizing your existing notification system style
        alert(`ACCESSING_ARCHIVES... Generating ${interest.toUpperCase()} career roadmap.`);
        console.log(`Career simulation started for: ${interest}`);
    }
}

function startCareerSim() {
    const btn = event.target;
    const originalText = btn.innerText;
    
    // Visual feedback
    btn.innerText = "BYPASSING FIREWALL...";
    btn.style.background = "#ff0055";
    
    setTimeout(() => {
        const choice = prompt("ENTER TARGET SECTOR: (e.g. CYBERSECURITY, DIGITAL_ART, NEUROSCIENCE)");
        if(choice) {
            notify(`UPLINK_ESTABLISHED: Mapping ${choice.toUpperCase()} trajectory...`);
            // Here you could later redirect or show a modal with results
        }
        btn.innerText = originalText;
        btn.style.background = "";
    }, 1200);
}

function updateProfilePicture(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-display').innerHTML = `<img src="${e.target.result}">`;
            localStorage.setItem('userAvatar', e.target.result);
            notify("IMAGE_UPLOADED: Identity confirmed.");
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveFullProfile() {
    const story = document.getElementById('life-story-input').value;
    const bio = document.getElementById('user-bio').value;
    const loc = document.getElementById('user-location').value;

    const profileData = { story, bio, loc };
    localStorage.setItem('userProfileData', JSON.stringify(profileData));
    
    notify("DATA_SYNCED: Profile archive updated.");
}

// Update the launchPlatform to also fill in the profile name
const originalLaunch = launchPlatform;
launchPlatform = function() {
    originalLaunch();
    const name = document.getElementById('reg-name').value;
    document.getElementById('display-name-profile').innerText = name.toUpperCase();
    
    // Load existing data
    const saved = JSON.parse(localStorage.getItem('userProfileData'));
    if(saved) {
        document.getElementById('life-story-input').value = saved.story || "";
        document.getElementById('user-bio').value = saved.bio || "";
        document.getElementById('user-location').value = saved.loc || "";
    }
    const avatar = localStorage.getItem('userAvatar');
    if(avatar) document.getElementById('profile-display').innerHTML = `<img src="${avatar}">`;
};

function saveFullProfile() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    // Change button to "Uploading" state
    btn.innerHTML = "UPLOADING DATA...";
    btn.style.opacity = "0.7";

    const story = document.getElementById('life-story-input').value;
    const bio = document.getElementById('user-bio').value;
    const loc = document.getElementById('user-location').value;

    const profileData = { story, bio, loc };
    localStorage.setItem('userProfileData', JSON.stringify(profileData));
    
    // Artificial delay for "Coolness"
    setTimeout(() => {
        btn.innerHTML = "DATA ARCHIVED ✓";
        btn.style.color = "#00ff88"; // Success green
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = "";
            btn.style.opacity = "1";
        }, 2000);
        
        notify("PROFILE_SYNC: Archive successfully updated.");
    }, 800);
}

function renderMindLibrary() {
    console.log("Attempting to render library..."); // Check your console for this!
    const grid = document.querySelector('.novel-grid');
    
    if (!grid) {
        console.error("HTML Error: .novel-grid not found!");
        return;
    }
    
    grid.innerHTML = ""; 

    Object.keys(novels).forEach(key => {
        const story = novels[key];
        const card = document.createElement('div');
        card.className = "glass-card novel-card";
        card.style.borderTop = `4px solid ${story.color}`;
        
        card.innerHTML = `
            <div class="novel-info">
                <span class="status-chip" style="color:${story.color}">${story.category}</span>
                <h3 style="margin:10px 0">${story.title}</h3>
                <p style="font-size:0.8rem; color:#bbb; margin-bottom:15px">${story.description}</p>
                <button class="btn-shine small-btn" onclick="openNovel('${key}')">START STORY</button>
            </div>
        `;
        grid.appendChild(card);
    });
    console.log("Library Render Complete.");
}

// This forces the library to render as soon as the script loads
document.addEventListener('DOMContentLoaded', () => {
    if (typeof novels !== 'undefined') {
        renderMindLibrary();
    }
});

// This runs the moment the page loads
window.onload = () => {
    renderMindLibrary();
};
document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Prevent the card from flipping back when clicking the button
        e.stopPropagation(); 
        
        const storyTitle = button.parentElement.querySelector('h4').innerText;
        const storyText = button.parentElement.querySelector('p').innerText;
        
        alert(`ACCESSING ARCHIVE: ${storyTitle}\n\n${storyText}\n\nRemember: Your choices define your journey.`);
    });
});

function openStory(title, category, fullText) {
    document.getElementById('reader-title').innerText = title;
    document.getElementById('reader-category').innerText = category;
    document.getElementById('reader-text').innerText = fullText;
    
    document.getElementById('story-reader-overlay').style.display = 'flex';
    document.getElementById('comment-list').innerHTML = ""; // Reset comments for new story
}

function closeStory() {
    document.getElementById('story-reader-overlay').style.display = 'none';
}

function postComment() {
    const input = document.getElementById('comment-input');
    if(input.value.trim() === "") return;
    
    const list = document.getElementById('comment-list');
    const newComment = document.createElement('div');
    newComment.style.marginBottom = "10px";
    newComment.innerHTML = `<b style="color:var(--accent)">YOU:</b> ${input.value}`;
    list.prepend(newComment);
    input.value = "";
}

function rate(stars) {
    notify(`Rating of ${stars} stars saved to neural link.`);
}

function openStoryFromCard(button) {
    // 1. Find the card this button belongs to
    const cardBack = button.parentElement;
    
    // 2. Grab the info from the HTML elements
    const title = cardBack.querySelector('h4').innerText;
    const category = cardBack.parentElement.querySelector('.badge').innerText;
    const fullText = cardBack.querySelector('.full-story-metadata').innerHTML;

    // 3. Send it to the Reader Modal
    document.getElementById('reader-title').innerText = title;
    document.getElementById('reader-category').innerText = category;
    document.getElementById('reader-text').innerHTML = fullText;
    
    // 4. Show the Modal
    document.getElementById('story-reader-overlay').style.display = 'flex';
}
