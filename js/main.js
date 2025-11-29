// Cinematic Journey Logic

document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let isAnimating = false;

    // --- 1. Navigation Logic ---
    const updateSlides = () => {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (i === currentSlide) {
                slide.classList.add('active');
            } else if (i < currentSlide) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });
        
        updateIndicators();
        updateButtons();
    };

    const updateIndicators = () => {
        indicatorsContainer.innerHTML = ''; // Rebuild to ensure clean state
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `w-3 h-3 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-accent scale-150 shadow-[0_0_10px_#22d3ee]' : 'bg-white/20 hover:bg-white/40'}`;
            dot.onclick = () => goToSlide(index);
            indicatorsContainer.appendChild(dot);
        });
    };

    const updateButtons = () => {
        prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    };

    window.goToSlide = (index) => {
        if (index < 0 || index >= totalSlides || isAnimating) return;
        if (index === currentSlide) return;

        isAnimating = true;
        currentSlide = index;
        updateSlides();

        // Trigger Effects
        setTimeout(() => { isAnimating = false; }, 1200); // Match CSS transition
        
        if (index === 7) startCryptoCounters(); // Slide 8 (Index 7)
        if (index === 10) startTypewriter(); // Slide 11 (Index 10)
    };

    // --- 2. 3D Tilt Engine ---
    const initTilt = () => {
        const cards = document.querySelectorAll('.tilt-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    };

    // --- 3. Crypto Scramble Effect ---
    const startCryptoCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let iterations = 0;
            const interval = setInterval(() => {
                counter.innerText = Math.floor(Math.random() * target * 1.5); // Scramble numbers
                if (iterations > 20) {
                    clearInterval(interval);
                    counter.innerText = target; // Settle on target
                    counter.classList.add('neon-text'); // Add glow on finish
                }
                iterations++;
            }, 50);
        });
    };

    // --- 4. Typewriter Effect ---
    const startTypewriter = () => {
        const quotes = document.querySelectorAll('.typewriter-text');
        quotes.forEach(quote => {
            const text = quote.getAttribute('data-text');
            if (!text) return;
            quote.innerText = '';
            let i = 0;
            const type = setInterval(() => {
                quote.innerText += text.charAt(i);
                i++;
                if (i >= text.length) clearInterval(type);
            }, 30); // Speed of typing
        });
    };

    // --- 5. FAQ Accordion ---
    const initFAQ = () => {
        const faqToggles = document.querySelectorAll('.faq-toggle');
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const content = toggle.nextElementSibling;
                const icon = toggle.querySelector('i');
                content.classList.toggle('hidden');
                icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            });
        });
    };

    // --- Initialization ---
    updateSlides();
    initTilt();
    initFAQ();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Event Listeners
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToSlide(currentSlide + 1);
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    });

    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0) goToSlide(currentSlide + 1);
            else if (e.deltaY < 0) goToSlide(currentSlide - 1);
        }, 50);
    }, { passive: true });
});
