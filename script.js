let currentIndex = 0;
let currentImages = [];
let currentFolder = "";

const photoCounts = {
    matkor: 10,
    haldi: 16,
    mehendi: 10,
    tilak: 30,
    wedding: 119
};

// --- GALLERY INITIALIZATION ---
async function initGallery(folder) {
    currentFolder = folder;
    const container = document.getElementById('gallery-container');
    if (!container) return;

    const count = photoCounts[folder] || 10;
    
    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        if (folder === 'wedding' && i === 57) continue;

        const img = document.createElement("img");
        img.src = `img/${folder}/${i}.jpg`;
        img.loading = "lazy";
        img.alt = `${folder} photo ${i}`;
        
        img.onerror = function() {
            this.style.display = 'none';
        };

        img.onclick = () => openLightbox(folder, i);

        // Entrance animation
        img.style.opacity = "0";
        img.style.transform = "translateY(20px)";
        
        container.appendChild(img);

        setTimeout(() => {
            img.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
            img.style.opacity = "1";
            img.style.transform = "translateY(0)";
        }, 50 * (i % 20));
    }
}

// --- MUSIC LOGIC ---
function setupMusic(src) {
    const player = document.getElementById("player");
    if (!player) return;
    
    player.src = src;
    
    const isMusicPlaying = sessionStorage.getItem('wedding_music_playing') !== 'false';

    if (isMusicPlaying) {
        document.addEventListener('click', startMusicOnce, { once: true });
        player.play().catch(() => console.log("Waiting for user interaction..."));
    }
}

function startMusicOnce() {
    const player = document.getElementById("player");
    if (player && player.paused) {
        player.play();
    }
}

function toggleMusic() {
    const player = document.getElementById("player");
    const control = document.getElementById("music-control");
    if (!player) return;

    if (player.paused) {
        player.play();
        sessionStorage.setItem('wedding_music_playing', 'true');
        if (control) control.classList.add('music-playing');
    } else {
        player.pause();
        sessionStorage.setItem('wedding_music_playing', 'false');
        if (control) control.classList.remove('music-playing');
    }
}

// --- LIGHTBOX LOGIC ---
function openLightbox(folder, index) {
    currentIndex = index;
    currentFolder = folder;
    currentImages = [];
    const count = photoCounts[folder] || 10;

    for (let i = 1; i <= count; i++) {
        if (folder === 'wedding' && i === 57) continue;
        currentImages.push(`img/${folder}/${i}.jpg`);
    }

    const actualPath = `img/${folder}/${index}.jpg`;
    currentIndex = currentImages.indexOf(actualPath) + 1;

    const lightbox = document.getElementById("lightbox");
    if (!lightbox) {
        console.error("Lightbox element not found!");
        return;
    }

    lightbox.style.display = "flex";
    lightbox.style.opacity = "0";
    
    const img = document.getElementById("lightbox-img");
    if (img) img.src = currentImages[currentIndex - 1];

    setTimeout(() => {
        lightbox.classList.add("active");
        lightbox.style.opacity = "1";
    }, 10);
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    lightbox.classList.remove("active");
    lightbox.style.opacity = "0";
    setTimeout(() => {
        lightbox.style.display = "none";
    }, 300);
}

function nextImage() {
    if (currentImages.length === 0) return;
    currentIndex++;
    if (currentIndex > currentImages.length) currentIndex = 1;
    updateLightboxImage();
}

function prevImage() {
    if (currentImages.length === 0) return;
    currentIndex--;
    if (currentIndex < 1) currentIndex = currentImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = document.getElementById("lightbox-img");
    if (!img) return;

    img.style.transform = "scale(0.95)";
    img.style.opacity = "0.5";
    
    setTimeout(() => {
        img.src = currentImages[currentIndex - 1];
        img.style.transform = "scale(1)";
        img.style.opacity = "1";
    }, 200);
}

// --- GLOBAL EVENT LISTENERS ---
document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && lightbox.style.display === "flex") {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeLightbox();
    }
});

// Auto slideshow in lightbox
setInterval(() => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && lightbox.style.display === "flex") nextImage();
}, 6000);

// --- HEART RAIN LOGIC ---
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '💕';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.opacity = Math.random();
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

function startHeartRain() {
    setInterval(createHeart, 400); 
}

// Start Heart Rain
if (document.readyState === 'complete') {
    startHeartRain();
} else {
    window.addEventListener('load', startHeartRain);
}
