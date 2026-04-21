document.addEventListener('DOMContentLoaded', function () {

    // ====================== SCROLL REVEAL ======================
    const srElements = document.querySelectorAll('.sr, .g-item');

    if (srElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target); // stop watching once revealed
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        });

        srElements.forEach(el => observer.observe(el));
    }

    // ====================== MOBILE NAV ======================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // ====================== LIGHTBOX ======================
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = document.getElementById('lightboxImg');
    const lightboxClose= document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    if (!lightbox) return;

    // Collect all gallery items in DOM order
    const gItems = Array.from(document.querySelectorAll('.g-item'));
    let currentIndex = 0;

    function getImgData(item) {
        const img = item.querySelector('img');
        return { src: img.src, alt: img.alt };
    }

    function openLightbox(index) {
        currentIndex = index;
        const { src, alt } = getImgData(gItems[currentIndex]);

        // Reset animation
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.94)';
        lightboxImg.src = src;
        lightboxImg.alt = alt;

        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        updateCounter();

        // Trigger transition after src is set
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                lightboxImg.style.opacity = '';
                lightboxImg.style.transform = '';
            });
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navigate(dir) {
        currentIndex = (currentIndex + dir + gItems.length) % gItems.length;
        const { src, alt } = getImgData(gItems[currentIndex]);

        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = `scale(0.94) translateX(${dir > 0 ? '20px' : '-20px'})`;

        setTimeout(() => {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightboxImg.style.transform = `scale(0.94) translateX(${dir > 0 ? '-10px' : '10px'})`;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    lightboxImg.style.opacity = '';
                    lightboxImg.style.transform = '';
                });
            });
            updateCounter();
        }, 180);
    }

    function updateCounter() {
        lightboxCounter.textContent = `${currentIndex + 1} / ${gItems.length}`;
    }

    // Click on gallery item
    gItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(i);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigate(-1));
    lightboxNext.addEventListener('click', () => navigate(1));

    // Click backdrop to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowRight')  navigate(1);
        if (e.key === 'ArrowLeft')   navigate(-1);
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });
});

// ====================== SERVICES TAB ======================
function showTab(tabName, btn) {
    document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById('tab-' + tabName);
    if (panel) panel.classList.add('active');
    btn.classList.add('active');
}

