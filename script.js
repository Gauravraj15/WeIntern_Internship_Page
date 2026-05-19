// ===================================================
//   WeIntern – script.js  (Final Version)
//   Features:
//   1. Navbar scroll shadow effect
//   2. Hamburger mobile menu toggle
//   3. Active nav link highlight on scroll
//   4. Apply form validation & success message
//   5. Scroll reveal animations
//   6. Smooth scroll for all anchor links
//   7. Logo fallback if image.png not found
// ===================================================


// ---- 1. NAVBAR SCROLL SHADOW ----
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ---- 2. HAMBURGER MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


// ---- 3. ACTIVE NAV LINK ON SCROLL ----
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 90;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#F59E0B';
    }
  });
});


// ---- 4. APPLY FORM VALIDATION & SUBMISSION ----
const applyForm = document.getElementById('apply-form');
const successMsg = document.getElementById('success-msg');

applyForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const track = document.getElementById('track').value;

  // Remove any old error
  clearError();

  // Validate
  if (!name || name.length < 2) {
    showError('Please enter your full name (at least 2 characters).');
    return;
  }
  if (!isValidEmail(email)) {
    showError('Please enter a valid email address.');
    return;
  }
  if (!track) {
    showError('Please select your internship track.');
    return;
  }

  // Simulate submission (replace with real API/backend call)
  const submitBtn = applyForm.querySelector('.cta-submit');
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled    = true;

  setTimeout(() => {
    applyForm.style.display = 'none';
    successMsg.classList.add('show');
    console.log('✅ Application submitted:', { name, email, track });
  }, 1200);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
  clearError();
  const div = document.createElement('div');
  div.id = 'form-error';
  div.style.cssText = `
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.4);
    color: #fca5a5;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 0.875rem;
    text-align: left;
  `;
  div.textContent = '⚠️ ' + message;
  applyForm.appendChild(div);
  setTimeout(clearError, 4000);
}

function clearError() {
  const existing = document.getElementById('form-error');
  if (existing) existing.remove();
}


// ---- 5. SCROLL REVEAL ANIMATIONS ----
// Add .reveal class to elements we want to animate in
const revealTargets = document.querySelectorAll(
  '.vcard, .track-card, .about-block, .hero-card, .stat, .section-tag, .section-title, .section-sub'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Small stagger delay based on position among siblings
      const siblings = Array.from(entry.target.parentElement.children);
      const index    = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (index * 0.07) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => revealObserver.observe(el));


// ---- 6. SMOOTH SCROLL FOR ALL ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    const target   = document.querySelector(targetId);
    if (target) {
      const offset = target.offsetTop - 72; // navbar height
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});


// ---- 7. LOGO FALLBACK ----
window.addEventListener('DOMContentLoaded', () => {
  const logoImg  = document.querySelector('.nav-logo .logo-img');
  const logoText = document.getElementById('logo-text');

  if (logoImg && logoText) {
    const checkBroken = () => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) {
        logoImg.style.display  = 'none';
        logoText.style.display = 'inline-block';
      }
    };
    logoImg.addEventListener('error', checkBroken);
    logoImg.addEventListener('load',  () => {
      logoImg.style.display  = 'block';
      logoText.style.display = 'none';
    });
    // Check immediately in case already loaded/broken
    if (logoImg.complete) checkBroken();
  }
});