/**
 * DIGITAL ENGINEERING NOTEBOOK — Interaction Engine v2
 * rhrayhan.dev  |  Rayhan Hasan  |  2026
 *
 * Architecture:
 *  - html scroll-snap drives the page-flip feel
 *  - IntersectionObserver tracks which page is "active"
 *  - Sidebar tabs + progress dots scroll to corresponding section
 *  - Subject entries on Home page scroll to their section
 *  - Page-flip CSS class applied on enter/exit
 *  - Spine rings injected into every spread
 *  - Cover parallax tilt on mouse move
 */

'use strict';

const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Page order ────────────────────────────────────────────────── */
const PAGES = [
  { id: 'page-cover',       tab: null,          dot: 0 },
  { id: 'page-home',        tab: 'home',        dot: 1 },
  { id: 'page-mathematics', tab: 'mathematics', dot: 2 },
  { id: 'page-physics',     tab: 'physics',     dot: 3 },
  { id: 'page-cs',          tab: 'cs',          dot: 4 },
  { id: 'page-lab',         tab: 'lab',         dot: 5 },
  { id: 'page-index',       tab: 'index',       dot: 6 },
];

/* ── Element refs ──────────────────────────────────────────────── */
const pageEls       = PAGES.map(p => document.getElementById(p.id)).filter(Boolean);
const sidebarTabs   = Array.from(document.querySelectorAll('.nb-sidebar .nb-tab'));
const progressDots  = Array.from(document.querySelectorAll('.progress-dot'));
const mobileTabs    = Array.from(document.querySelectorAll('.nb-mobile-tab'));
const spreads       = Array.from(document.querySelectorAll('.nb-spread'));
const subjectEls    = Array.from(document.querySelectorAll('.subject-entry[data-page]'));
const coverBook     = document.getElementById('cover-book');

let currentPageIdx = 1; // start on Home (skip cover)

/* ── 1. Spine rings ────────────────────────────────────────────── */
function buildSpineRings() {
  const spines = document.querySelectorAll('.nb-book-spine');
  spines.forEach(spine => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 10; i++) {
      const ring = document.createElement('div');
      ring.className = 'spine-ring';
      fragment.appendChild(ring);
    }
    spine.appendChild(fragment);
  });
}

/* ── 2. Scroll to page ─────────────────────────────────────────── */
function scrollToPage(idx) {
  const el = pageEls[idx];
  if (!el) return;

  // Add exiting class to current spread
  if (idx !== currentPageIdx) {
    triggerFlipOut(currentPageIdx);
  }

  currentPageIdx = idx;

  el.scrollIntoView({
    behavior: motionReduced ? 'auto' : 'smooth',
    block: 'start',
  });
}

/* ── 3. Page flip animation ────────────────────────────────────── */
function triggerFlipIn(idx) {
  if (motionReduced) return;
  const page = pageEls[idx];
  if (!page) return;
  const spread = page.querySelector('.nb-spread');
  if (!spread) return;

  spread.classList.remove('is-entering', 'is-exiting');
  // Force reflow
  void spread.offsetWidth;
  spread.classList.add('is-entering');

  const cleanup = () => spread.classList.remove('is-entering');
  spread.addEventListener('animationend', cleanup, { once: true });
}

function triggerFlipOut(idx) {
  if (motionReduced) return;
  const page = pageEls[idx];
  if (!page) return;
  const spread = page.querySelector('.nb-spread');
  if (!spread) return;

  spread.classList.remove('is-entering', 'is-exiting');
}

/* ── 4. Update active state ────────────────────────────────────── */
function setActive(idx) {
  currentPageIdx = idx;

  // Sidebar tabs (start at index 1 = home → tab idx 0)
  sidebarTabs.forEach((tab, i) => {
    const active = (i === idx - 1); // pages 1-6 map to tabs 0-5
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-pressed', String(active));
  });

  // Progress dots
  progressDots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === idx);
  });

  // Mobile tabs
  mobileTabs.forEach((tab, i) => {
    const active = (i === idx - 1);
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-pressed', String(active));
  });

  // Trigger flip animation on the incoming spread
  if (idx > 0) {
    triggerFlipIn(idx);
  }
}

/* ── 5. IntersectionObserver — track active page ────────────────── */
function bindScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const idx = pageEls.indexOf(entry.target);
        if (idx !== -1 && idx !== currentPageIdx) {
          setActive(idx);
        }
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px',
  });

  pageEls.forEach(el => observer.observe(el));
}

/* ── 6. Sidebar tab clicks ─────────────────────────────────────── */
function bindSidebarTabs() {
  sidebarTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => scrollToPage(i + 1)); // +1 because index 0 is cover
  });

  // Keyboard arrow nav
  const sidebar = document.getElementById('nb-sidebar');
  if (!sidebar) return;

  sidebar.addEventListener('keydown', (e) => {
    const focusable = Array.from(sidebar.querySelectorAll('.nb-tab'));
    const idx = focusable.indexOf(document.activeElement);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = focusable[(idx + 1) % focusable.length];
      next.focus(); next.click();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = focusable[(idx - 1 + focusable.length) % focusable.length];
      prev.focus(); prev.click();
    }
  });
}

/* ── 7. Progress dots ─────────────────────────────────────────── */
function bindProgressDots() {
  progressDots.forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToPage(i));
  });
}

/* ── 8. Mobile tabs ───────────────────────────────────────────── */
function bindMobileTabs() {
  mobileTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => scrollToPage(i + 1));
  });
}

/* ── 9. Subject entries (home page → scroll to section) ─────── */
function bindSubjectEntries() {
  subjectEls.forEach(entry => {
    const pageNum = parseInt(entry.dataset.page, 10);
    if (!pageNum) return;

    const handler = () => scrollToPage(pageNum);
    entry.addEventListener('click', handler);
    entry.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

/* ── 10. Cover parallax ───────────────────────────────────────── */
function bindCoverParallax() {
  if (motionReduced || !coverBook) return;

  const coverPage = document.getElementById('page-cover');
  if (!coverPage) return;

  const MAX_TILT = 5;

  coverPage.addEventListener('mousemove', (e) => {
    const rect = coverPage.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;

    coverBook.style.transform =
      `rotateX(${3 - cy * MAX_TILT * 2}deg) rotateY(${cx * MAX_TILT}deg)`;
  });

  coverPage.addEventListener('mouseleave', () => {
    coverBook.style.transition = 'transform 800ms cubic-bezier(0.4,0,0.2,1)';
    coverBook.style.transform = 'rotateX(3deg)';
    setTimeout(() => { coverBook.style.transition = ''; }, 820);
  });
}

/* ── 11. Cover click — scroll to first page ─────────────────── */
function bindCoverClick() {
  const coverPage = document.getElementById('page-cover');
  if (!coverPage) return;

  coverPage.addEventListener('click', () => {
    if (currentPageIdx === 0) scrollToPage(1);
  });

  // Scroll hint also clickable
  const hint = coverPage.querySelector('.cover-scroll-hint');
  if (hint) {
    hint.style.pointerEvents = 'all';
    hint.style.cursor = 'pointer';
    hint.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToPage(1);
    });
  }
}

/* ── 12. Micro-interaction: press compression ────────────────── */
function bindButtonPress() {
  if (motionReduced) return;

  const targets = document.querySelectorAll(
    '.nb-tab, .nb-mobile-tab, .social-link, .page-link-btn, .progress-dot, .subject-entry'
  );

  targets.forEach(el => {
    el.addEventListener('click', () => {
      el.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.95)' }, { transform: 'scale(1)' }],
        { duration: 160, easing: 'ease-out' }
      );
    });
  });
}

/* ── 13. Swipe (mobile) ──────────────────────────────────────── */
function bindSwipe() {
  if (window.innerWidth >= 768) return;

  let startX = 0, startY = 0;
  const THRESHOLD = 60;

  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    if (Math.abs(dx) < THRESHOLD || Math.abs(dy) > Math.abs(dx) * 0.8) return;

    if (dx < 0 && currentPageIdx < pageEls.length - 1) {
      scrollToPage(currentPageIdx + 1);
    } else if (dx > 0 && currentPageIdx > 0) {
      scrollToPage(currentPageIdx - 1);
    }
  }, { passive: true });
}

/* ── 14. Image lazy-load ─────────────────────────────────────── */
function enhanceImages() {
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading') && !img.hasAttribute('data-eager')) {
      img.loading = 'lazy';
    }
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
  });
}

/* ── Init ───────────────────────────────────────────────────── */
function init() {
  buildSpineRings();
  bindScrollObserver();
  bindSidebarTabs();
  bindProgressDots();
  bindMobileTabs();
  bindSubjectEntries();
  bindCoverClick();
  bindCoverParallax();
  bindButtonPress();
  bindSwipe();
  enhanceImages();

  // Start on Home page (skip cover) on returning visits
  const hasVisited = localStorage.getItem('nb-visited');
  if (hasVisited) {
    // Instantly jump to home without animation
    pageEls[1]?.scrollIntoView({ behavior: 'auto', block: 'start' });
    setActive(1);
  } else {
    // First visit: start at cover (index 0)
    setActive(0);
    // Update progress dots to show cover
    progressDots.forEach((dot, i) => dot.classList.toggle('is-active', i === 0));
    localStorage.setItem('nb-visited', '1');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
