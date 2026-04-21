(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  document.getElementById('indicator').textContent = `1 / ${total}`;
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const indicator = document.getElementById('indicator');
  const overlay = document.getElementById('wipeOverlay');

  let current = 0;
  let animating = false;

  function updateIndicator() {
    indicator.textContent = `${current + 1} / ${total}`;
  }

  function go(target, direction = 1) {
    if (animating) return;
    if (target < 0 || target >= total || target === current) return;
    animating = true;

    // Reset overlay to rest state with no transition (prevents snap-back flash)
    overlay.style.transition = 'none';
    overlay.classList.remove('reverse', 'wipe-in', 'wipe-out');
    if (direction < 0) overlay.classList.add('reverse');
    void overlay.offsetWidth; // force reflow so new rest position takes effect
    overlay.style.transition = '';

    // Start wipe
    requestAnimationFrame(() => {
      overlay.classList.add('wipe-in');
    });

    // Swap slides mid-wipe
    setTimeout(() => {
      slides[current].classList.remove('active');
      current = target;
      slides[current].classList.add('active');
      updateIndicator();

      // Handle autoplay videos
      document.querySelectorAll('video[autoplay]').forEach(v => v.pause());
      const activeVideo = slides[current].querySelector('video[autoplay]');
      if (activeVideo) activeVideo.play().catch(() => {});

      overlay.classList.remove('wipe-in');
      overlay.classList.add('wipe-out');
    }, 340);

    setTimeout(() => {
      // Leave overlay off-screen; next call resets transition+rest before animating.
      animating = false;
    }, 700);
  }

  function next() { go(current + 1, 1); }
  function prev() { go(current - 1, -1); }

  // Initial state
  slides[0].classList.add('active');
  updateIndicator();
  const firstVideo = slides[0].querySelector('video[autoplay]');
  if (firstVideo) firstVideo.play().catch(() => {});

  // Buttons
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); go(0, -1); }
    else if (e.key === 'End') { e.preventDefault(); go(total - 1, 1); }
    else if (/^[0-9]$/.test(e.key)) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= total) go(n - 1, n - 1 > current ? 1 : -1);
    }
  });

  // Click left/right zones on slide
  document.addEventListener('click', (e) => {
    if (e.target.closest('.deck-chrome, .wipe-compare, video, a, button')) return;
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.3) prev();
    else if (x > w * 0.7) next();
  });

  // Touch swipe
  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });

  // ── Wipe comparison widget (HighVis slide) ──
  document.querySelectorAll('.wipe-compare').forEach(el => {
    const before = el.querySelector('.wipe-before');
    const divider = el.querySelector('.wipe-divider');
    let dragging = false;

    function setPos(clientX) {
      const rect = el.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      divider.style.left = `${pct}%`;
    }

    el.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });

    el.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    el.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    el.addEventListener('touchend', () => { dragging = false; });

    // Hover tracking when not dragging
    el.addEventListener('mousemove', e => {
      if (!dragging && e.buttons === 0) setPos(e.clientX);
    });
  });
})();
