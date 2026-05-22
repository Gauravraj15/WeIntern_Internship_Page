// Sticky Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
  navOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-link, .nav-cta').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});

// Scroll Reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('revealed'), idx * 80);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// Counter Animation
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

let countersStarted = false;
const counterObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.counter').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
    });
    counterObs.disconnect();
  }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

// Track Filter Tabs
const filterBtns = document.querySelectorAll('.filter-btn');
const trackCards = document.querySelectorAll('.track-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    trackCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// FAQ Accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const ans = item.querySelector('.faq-a');
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item').forEach(other => {
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-a').classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      ans.classList.add('open');
    }
  });
});

// Character Counters
function setupCharCounter(inputId, countId, max) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(countId);
  if (!input || !counter) return;
  input.addEventListener('input', () => {
    counter.textContent = `${input.value.length} / ${max}`;
  });
}
setupCharCounter('c-name', 'count-name', 60);
setupCharCounter('c-message', 'count-message', 500);

// Contact Form Validation
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('c-name')?.value.trim();
    const email = document.getElementById('c-email')?.value.trim();
    const domain = document.getElementById('c-domain')?.value;
    const message = document.getElementById('c-message')?.value.trim();
    let isValid = true;
    if (!name) { document.getElementById('err-name').textContent = 'Name is required'; isValid = false; }
    else { document.getElementById('err-name').textContent = ''; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('err-email').textContent = 'Valid email required'; isValid = false; }
    else { document.getElementById('err-email').textContent = ''; }
    if (!domain) { document.getElementById('err-domain').textContent = 'Select a domain'; isValid = false; }
    else { document.getElementById('err-domain').textContent = ''; }
    if (!message || message.length < 20) { document.getElementById('err-message').textContent = 'Message min 20 characters'; isValid = false; }
    else { document.getElementById('err-message').textContent = ''; }
    if (isValid) {
      contactForm.style.display = 'none';
      contactSuccess.classList.add('show');
    }
  });
}

// Reset Contact Form
const resetBtn = document.getElementById('reset-form');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    contactForm.reset();
    contactForm.style.display = '';
    contactSuccess.classList.remove('show');
  });
}

// Apply Form (CTA)
const applyForm = document.getElementById('apply-form');
const successMsg = document.getElementById('success-msg');
if (applyForm) {
  applyForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('ap-name')?.value.trim();
    const email = document.getElementById('ap-email')?.value.trim();
    const track = document.getElementById('ap-track')?.value;
    if (name && email && track && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      applyForm.style.display = 'none';
      successMsg.classList.add('show');
    }
  });
}

// Back to Top
const bttBtn = document.getElementById('back-to-top');
if (bttBtn) {
  bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Marquee Pause on Hover
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
  marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
}