// =====================================================
//   WeIntern – script.js  (Day 2 Final)
//   Features:
//   1. Navbar scroll shadow
//   2. Hamburger mobile menu
//   3. Active nav highlight on scroll
//   4. Form validation + success message
//   5. Scroll reveal animations
//   6. Smooth scroll
//   7. Logo fallback
//   8. Skill item stagger animation
//   9. Track card hover sound (visual feedback)
//  10. Breakpoint logger for testing (console)
// =====================================================


// ---- 1. NAVBAR SCROLL SHADOW ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


// ---- 2. HAMBURGER MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});


// ---- 3. ACTIVE NAV HIGHLIGHT ON SCROLL ----
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) {
      current = sec.getAttribute('id');
    }
  });
  allNavLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#F59E0B';
    }
  });
});


// ---- 4. APPLY FORM VALIDATION ----
const applyForm  = document.getElementById('apply-form');
const successMsg = document.getElementById('success-msg');

if (applyForm) {
  applyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const track = document.getElementById('track').value;

    if (!name || name.length < 2)  { showError('Please enter your full name.'); return; }
    if (!isValidEmail(email))       { showError('Please enter a valid email address.'); return; }
    if (!track)                     { showError('Please select your internship track.'); return; }

    const btn = applyForm.querySelector('.cta-submit');
    btn.textContent = 'Submitting...';
    btn.disabled    = true;

    setTimeout(() => {
      applyForm.style.display = 'none';
      successMsg.classList.add('show');
      console.log('✅ Application:', { name, email, track });
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(msg) {
  clearError();
  const div = document.createElement('div');
  div.id = 'form-error';
  Object.assign(div.style, {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    color: '#fca5a5',
    padding: '12px 18px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    textAlign: 'left',
    marginTop: '4px',
  });
  div.textContent = '⚠️ ' + msg;
  applyForm.appendChild(div);
  setTimeout(clearError, 4000);
}

function clearError() {
  const el = document.getElementById('form-error');
  if (el) el.remove();
}


// ---- 5. SCROLL REVEAL ----
const revealEls = document.querySelectorAll(
  '.vcard, .track-card, .tcard, .skill-item, .about-block, .hero-card, .stat, .section-tag, .section-title, .section-sub, .footer-links-group'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.07) + 's';
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));


// ---- 6. SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});


// ---- 7. LOGO FALLBACK ----
window.addEventListener('DOMContentLoaded', () => {
  const logoImg  = document.querySelector('.nav-logo .logo-img');
  const logoText = document.getElementById('logo-text');
  if (logoImg && logoText) {
    const check = () => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) {
        logoImg.style.display  = 'none';
        logoText.style.display = 'inline-block';
      }
    };
    logoImg.addEventListener('error', check);
    logoImg.addEventListener('load', () => {
      logoImg.style.display  = 'block';
      logoText.style.display = 'none';
    });
    if (logoImg.complete) check();
  }
});


// ---- 8. SKILL ITEMS STAGGER ----
// Extra stagger for skill grid on scroll
const skillItems = document.querySelectorAll('.skill-item');
const skillObs = new IntersectionObserver((entries) => {
  if (entries.some(e => e.isIntersecting)) {
    skillItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.opacity   = '1';
        item.style.transform = 'translateY(0)';
      }, i * 60);
    });
    skillObs.disconnect();
  }
}, { threshold: 0.1 });

skillItems.forEach(item => {
  item.style.opacity   = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});
const skillSection = document.getElementById('skills');
if (skillSection) skillObs.observe(skillSection);


// ---- 9. TRACK CARD FOCUS HIGHLIGHT ----
document.querySelectorAll('.track-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.querySelectorAll('.track-card').forEach(c => c.style.opacity = '0.75');
    card.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    document.querySelectorAll('.track-card').forEach(c => c.style.opacity = '1');
  });
});


// ---- 10. BREAKPOINT LOGGER (for responsive testing) ----
function logBreakpoint() {
  const w = window.innerWidth;
  let bp = w <= 480  ? '📱 Mobile (375px range)'
         : w <= 768  ? '📟 Tablet (768px range)'
         : w <= 1280 ? '🖥️ Desktop (1280px range)'
         : '🖥️ Wide Desktop (1280px+)';
  console.log(`[WeIntern] Viewport: ${w}px → ${bp}`);
}
window.addEventListener('resize', logBreakpoint);
logBreakpoint();