// ==========================================
// 🗃️ MEMORY DATA STORAGE
// Add or manage your items here. 
// Use standard raw github images and YouTube embed/watch links.
// ==========================================
const memories = [
    {
        date: "2026-06-08",
        displayDate: "2026/June/8",
        type: "video", // <-- Must be exactly "photo or video"
        title: "ධනිකයගෙ ගෙදර ඇවිත්",
        src: "https://youtu.be/JIWXInMbQ8s", // <-- Raw GitHub Link
        description: "කරපු වැඩක් නෑ. කයිය ගහල ගියා."
    }, // <-- Notice this comma separating the two memories!

    // 2. AN ENTRY FOR A VIDEO
    {
        date: "2025-3-25",
        displayDate: "2025/March/25",
        type: "photo", // <-- Must be exactly "video or photo"
        title: "සපාගෙ ක්ලාස්",
        src: "https://github.com/damarasooriya/our-memories/blob/main/photos/IMG_20250325_150938.jpg?raw=true", // <-- YouTube Link
        description: "pky පළවෙනි පාරට දුන්න AC hall එක."
    } // <-- No comma needed on the last item, but having one won't break it
];

// ==========================================
// 🛠️ ENGINE LOGIC (DO NOT CHANGE)
// ==========================================

// Initialize Application Content
document.addEventListener("DOMContentLoaded", () => {
    // Sort array automatically chronologically by designated absolute timestamp
    memories.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderTimeline(memories);
    setupFilters();
});

// Extract ID from custom string variations for YouTube Cover Preview Assembly
function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Generate UI Blocks based on active criteria
function renderTimeline(data) {
    const wrapper = document.getElementById("timeline-wrapper");
    wrapper.innerHTML = "";

    if(data.length === 0) {
        wrapper.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:40px;">No records match your selection.</p>`;
        return;
    }

    data.forEach((item, index) => {
        const timelineItem = document.createElement("div");
        timelineItem.className = "timeline-item";
        
        let mediaPreview = '';
        if(item.type === 'photo') {
            mediaPreview = `<img src="${item.src}" alt="${item.title}" loading="lazy">`;
        } else if(item.type === 'video') {
            const ytId = getYoutubeId(item.src);
            const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : 'placeholder.jpg';
            mediaPreview = `
                <img src="${thumbUrl}" alt="${item.title}" loading="lazy">
                <div class="video-indicator"></div>
            `;
        }

        timelineItem.innerHTML = `
            <div class="timeline-card" onclick="openLightbox(${index})">
                <div class="card-media-wrapper">
                    ${mediaPreview}
                </div>
                <div class="card-info">
                    <span class="mem-date">${item.displayDate}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
            <div class="timeline-node"></div>
        `;
        
        wrapper.appendChild(timelineItem);
    });
}

// Filter Control Handlers
function setupFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            buttons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const filterType = e.target.getAttribute("data-filter");
            if(filterType === "all") {
                renderTimeline(memories);
            } else {
                const filtered = memories.filter(m => m.type === filterType);
                renderTimeline(filtered);
            }
        });
    });
}

// Lightbox Action Components
let activeArray = memories; 
function openLightbox(index) {
    // Determine context slice based on active viewport state selection filters
    const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-filter");
    activeArray = activeFilter === "all" ? memories : memories.filter(m => m.type === activeFilter);
    
    const item = activeArray[index];
    const mediaContainer = document.getElementById("lightbox-media-container");
    
    if(item.type === 'photo') {
        mediaContainer.innerHTML = `<img src="${item.src}" alt="${item.title}">`;
    } else if(item.type === 'video') {
        // Enforce autoplay parameters automatically on overlay execution sequences
        let cleanEmbed = item.src;
        if(cleanEmbed.includes("watch?v=")) {
            const id = getYoutubeId(cleanEmbed);
            cleanEmbed = `https://www.youtube.com/embed/${id}`;
        }
        mediaContainer.innerHTML = `<iframe src="${cleanEmbed}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }

    document.getElementById("lightbox-date").innerText = item.displayDate;
    document.getElementById("lightbox-title").innerText = item.title;
    document.getElementById("lightbox-desc").innerText = item.description;
    
    document.getElementById("lightbox").style.display = "flex";
    document.body.style.overflow = "hidden"; // Freeze scroll context behind active overlay canvas
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    document.getElementById("lightbox-media-container").innerHTML = ""; // Hard drop target streams to stop hidden active audio feeds
    document.body.style.overflow = "auto";
}

// Global Keyboard Navigation (Escape closing shortcut)
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeLightbox();
});
