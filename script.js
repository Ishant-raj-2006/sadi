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
async function initGallery(folder, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const count = photoCounts[folder] || 10;
    container.innerHTML = "";

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
    
    const isPlaying = sessionStorage.getItem('wedding_music_playing') === 'true';

    if (isPlaying) {
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
window.openLightbox = function(folder, index) {
    console.log("Opening Lightbox:", folder, index);
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
    const downloadLink = document.getElementById("download-link");
    
    if (!lightbox || !img) return;

    img.src = currentImages[currentIndex];
    
    // Setup initial download link
    downloadLink.href = currentImages[currentIndex];
    downloadLink.setAttribute('download', `${folder}_${index}.jpg`);

    lightbox.style.display = "flex";
    setTimeout(() => {
        lightbox.style.opacity = "1";
    }, 10);
};

window.closeLightbox = function() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.style.opacity = "0";
    setTimeout(() => lightbox.style.display = "none", 500);
};

window.nextImage = function() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
};

window.prevImage = function() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
};

function updateLightboxImage() {
    const img = document.getElementById("lightbox-img");
    const downloadLink = document.getElementById("download-link");
    
    if (!img) return;

    img.style.opacity = "0";
    setTimeout(() => {
        const newSrc = currentImages[currentIndex];
        img.src = newSrc;
        
        // Update download link
        if (downloadLink) {
            downloadLink.href = newSrc;
            const fileName = newSrc.split('/').pop();
            downloadLink.setAttribute('download', fileName);
        }

        img.style.opacity = "1";
    }, 250);
}

// --- PARTICLE RAIN ---
const particles = ['❤️', '💖', '💧', '✨', '🌸', '🌹'];

function createParticle() {
    if (document.hidden) return;
    const p = document.createElement('div');
    p.className = 'particle';
    p.innerHTML = particles[Math.floor(Math.random() * particles.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = Math.random() * 15 + 15 + 'px';
    p.style.animationDuration = Math.random() * 3 + 4 + 's';
    p.style.opacity = Math.random() * 0.6 + 0.3;
    
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 7000);
}

let particleInterval;
function startParticleRain() {
    if (particleInterval) clearInterval(particleInterval);
    particleInterval = setInterval(createParticle, 600);
}

document.addEventListener('DOMContentLoaded', () => {
    startParticleRain();
    
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });
});
