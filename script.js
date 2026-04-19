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

    // Masonry Layout via columns (defined in CSS)
    for (let i = 1; i <= count; i++) {
        if (folder === 'wedding' && i === 57) continue;

        const item = document.createElement("div");
        item.className = "gallery-item";
        
        const img = document.createElement("img");
        img.src = `img/${folder}/${i}.jpg`;
        img.loading = "lazy";
        img.alt = `${folder} photo ${i}`;
        
        img.onerror = function() {
            item.style.display = 'none';
        };

        img.onclick = () => openLightbox(folder, i);

        item.appendChild(img);
        container.appendChild(item);

        // Intersection Observer for Reveal Effect
        observer.observe(item);
    }
}

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// --- MUSIC LOGIC ---
function setupMusic(src) {
    const player = document.getElementById("player");
    const control = document.getElementById("music-control");
    if (!player) return;
    
    player.src = src;
    player.loop = true;
    
    if (sessionStorage.getItem('wedding_music_playing') === 'true') {
        const playMusic = () => {
            player.play().then(() => {
                control?.classList.add('music-playing');
                document.removeEventListener('click', playMusic);
            }).catch(() => {});
        };
        
        player.play().then(() => {
            control?.classList.add('music-playing');
        }).catch(() => {
            document.addEventListener('click', playMusic);
        });
    }
}

function toggleMusic() {
    const player = document.getElementById("player");
    const control = document.getElementById("music-control");
    if (!player) return;

    if (player.paused) {
        player.play();
        sessionStorage.setItem('wedding_music_playing', 'true');
        control?.classList.add('music-playing');
    } else {
        player.pause();
        sessionStorage.setItem('wedding_music_playing', 'false');
        control?.classList.remove('music-playing');
    }
}

// --- LIGHTBOX LOGIC ---
function openLightbox(folder, index) {
    currentFolder = folder;
    currentImages = [];
    const count = photoCounts[folder] || 10;

    for (let i = 1; i <= count; i++) {
        if (folder === 'wedding' && i === 57) continue;
        currentImages.push(`img/${folder}/${i}.jpg`);
    }

    const actualPath = `img/${folder}/${index}.jpg`;
    currentIndex = currentImages.indexOf(actualPath);

    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    
    img.src = currentImages[currentIndex];
    lightbox.style.display = "flex";
    setTimeout(() => lightbox.style.opacity = "1", 10);
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.opacity = "0";
    setTimeout(() => lightbox.style.display = "none", 500);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = document.getElementById("lightbox-img");
    img.style.opacity = "0";
    setTimeout(() => {
        img.src = currentImages[currentIndex];
        img.style.opacity = "1";
    }, 250);
}

// --- HEART RAIN ---
function createHeart() {
    if (document.hidden) return;
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 15 + 10 + 'px';
    heart.style.animationDuration = Math.random() * 3 + 4 + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.2;
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

// Start Heart Rain with throttled interval
let heartInterval;
function startHeartRain() {
    if (heartInterval) clearInterval(heartInterval);
    heartInterval = setInterval(createHeart, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    startHeartRain();
    
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('lightbox').style.display === 'flex') {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });
});
