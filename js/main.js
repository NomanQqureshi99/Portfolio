/* =====================================================
   Nauman Qureshi — Portfolio interactions
   ===================================================== */
(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Current year ---------- */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Navbar: scrolled state + scroll progress ---------- */
    const navbar = $('#navbar');
    const progress = $('#scrollProgress');
    const toTop = $('#toTop');

    function onScroll() {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 20);
        if (toTop) toTop.classList.toggle('show', y > 500);

        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = h > 0 ? (y / h) * 100 + '%' : '0%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');

    function closeMenu() {
        if (!navMenu) return;
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        $$('.nav-link', navMenu).forEach((l) => l.addEventListener('click', closeMenu));
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') &&
                !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = $$('[data-reveal]');
    revealEls.forEach((el) => {
        const d = el.getAttribute('data-reveal-delay');
        if (d) el.style.setProperty('--d', d);
    });

    if (prefersReduced || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('in'));
    } else {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach((el) => io.observe(el));
    }

    /* ---------- Animated counters ---------- */
    const counters = $$('.counter');
    function runCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        if (prefersReduced) { el.textContent = target; return; }
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window && counters.length) {
        const cio = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach((c) => cio.observe(c));
    } else {
        counters.forEach((c) => (c.textContent = c.getAttribute('data-target')));
    }

    /* ---------- Active nav link on scroll (scroll spy) ---------- */
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((l) =>
                        l.classList.toggle('active', l.getAttribute('href') === '#' + id));
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => spy.observe(s));
    }

    /* ---------- Portfolio horizontal slider ---------- */
    const track = $('#portfolioTrack');
    if (track) {
        const btns = $$('.portfolio-controls .scroll-btn');
        const prevBtn = btns.find((b) => b.dataset.dir === '-1');
        const nextBtn = btns.find((b) => b.dataset.dir === '1');

        const stepSize = () => {
            const card = track.querySelector('.project-card');
            const gap = parseInt(getComputedStyle(track).gap, 10) || 22;
            return card ? card.getBoundingClientRect().width + gap : 360;
        };

        btns.forEach((b) =>
            b.addEventListener('click', () =>
                track.scrollBy({ left: stepSize() * parseInt(b.dataset.dir, 10), behavior: 'smooth' })
            )
        );

        const updateBtns = () => {
            const max = track.scrollWidth - track.clientWidth;
            if (prevBtn) prevBtn.disabled = track.scrollLeft <= 10;
            if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 10;
        };
        track.addEventListener('scroll', updateBtns, { passive: true });
        window.addEventListener('resize', updateBtns);
        updateBtns();

        // Drag / swipe to scroll (pointer events)
        let down = false, startX = 0, startLeft = 0, moved = false;
        track.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            down = true; moved = false;
            startX = e.clientX; startLeft = track.scrollLeft;
        });
        track.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 6) { moved = true; track.classList.add('dragging'); }
            if (moved) track.scrollLeft = startLeft - dx;
        });
        const endDrag = () => { down = false; track.classList.remove('dragging'); };
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
        // Prevent an accidental link click after a drag
        track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
    }

    /* ---------- Auto-scroll marquees (Services / Skills) ---------- */
    $$('[data-marquee]').forEach(initMarquee);

    function initMarquee(track) {
        const speed = parseFloat(track.dataset.speed) || 0.4;
        const originals = Array.from(track.children);
        const count = originals.length;
        if (!count) return;

        // Duplicate items so the loop is seamless
        originals.forEach((node) => {
            const clone = node.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.classList.add('marquee-clone');
            track.appendChild(clone);
        });
        // Marquee items are always on screen — reveal them immediately
        Array.from(track.children).forEach((c) => { c.classList.add('in'); c.removeAttribute('data-reveal'); });

        let loopW = 0;
        const measure = () => { loopW = track.children[count].offsetLeft - track.children[0].offsetLeft; };
        measure();
        window.addEventListener('resize', measure);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

        const normalize = () => {
            if (loopW <= 0) return;
            if (track.scrollLeft >= loopW) track.scrollLeft -= loopW;
            else if (track.scrollLeft < 0) track.scrollLeft += loopW;
        };

        let down = false, startX = 0, startLeft = 0, moved = false, hovering = false;
        const isPaused = () => hovering || down;

        track.addEventListener('pointerenter', () => { hovering = true; });
        track.addEventListener('pointerleave', () => { hovering = false; });

        track.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            down = true; moved = false;
            startX = e.clientX; startLeft = track.scrollLeft;
        });
        track.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 6) { moved = true; track.classList.add('dragging'); }
            if (moved) { track.scrollLeft = startLeft - dx; normalize(); }
        });
        const endDrag = () => { if (!down) return; down = false; track.classList.remove('dragging'); };
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
        track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
        // Keep native trackpad / touch scrolling looping seamlessly
        track.addEventListener('scroll', () => { if (!down) normalize(); }, { passive: true });

        if (prefersReduced) return; // no auto-motion; manual scroll still works
        (function tick() {
            if (!isPaused() && loopW > 0) { track.scrollLeft += speed; normalize(); }
            requestAnimationFrame(tick);
        })();
    }

    /* ---------- Contact form (front-end only, no backend) ---------- */
    const form = $('#contactForm');
    const note = $('#formNote');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#name').value.trim();
            const email = $('#email').value.trim();
            const message = $('#message').value.trim();
            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!name || !email || !message) {
                setNote('Please fill in your name, email and message.', 'err');
                return;
            }
            if (!emailOk) {
                setNote('Please enter a valid email address.', 'err');
                return;
            }
            // No backend: open the user's mail client with a prefilled message.
            const subject = ($('#subject').value.trim()) || `New message from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            window.location.href =
                `mailto:nomi00001@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setNote('Opening your email app… Thanks for reaching out!', 'ok');
            form.reset();
        });
    }
    function setNote(msg, type) {
        if (!note) return;
        note.textContent = msg;
        note.className = 'form-note ' + type;
    }
})();
