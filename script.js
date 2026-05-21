// =====================================================
//   WeIntern – script.js  (Day 3 — Final)
//
//   Task 1: Responsive audit helpers
//   Task 2: Contact form with full validation
//   Task 3: Sticky navbar + smooth scroll +
//           hamburger menu + scroll-reveal
//   Task 4: Startup swipe file logged in console
//   Extra:  Back-to-top button, apply form,
//           logo fallback, breakpoint logger
// =====================================================


// ── TASK 3 ─────────────────────────────────────────
// 1. Sticky Navbar — changes appearance on scroll

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top visibility
  const btt = document.getElementById('back-to-top');
  if (btt) {
    btt.classList.toggle('visible', window.scrollY > 400);
  }
});


// ── TASK 3 ─────────────────────────────────────────
// 2. Hamburger mobile menu (slide-in panel)

const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const navOverlay  = document.getElementById('nav-overlay');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent scroll behind
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on overlay click
navOverlay.addEventListener('click', closeMenu);

// Close on nav link click
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});


// ── TASK 3 ─────────────────────────────────────────
// 3. Smooth scroll + active nav highlight

const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = target.offsetTop - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute('id');
    }
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});


// ── TASK 3 ─────────────────────────────────────────
// 4. Scroll Reveal Animations (IntersectionObserver)

const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger siblings for grouped reveals
      const parent   = entry.target.parentElement;
      const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
      const idx      = siblings.indexOf(entry.target);
      const delay    = idx * 80; // 80ms stagger

      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


// ── TASK 2 ─────────────────────────────────────────
// 5. Contact Form — Full Validation

const contactForm    = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const contactSubmit  = document.getElementById('contact-submit');
const resetFormBtn   = document.getElementById('reset-form');

// Character counters
setupCharCounter('c-name',    'count-name',    60);
setupCharCounter('c-message', 'count-message', 500);

function setupCharCounter(inputId, countId, max) {
  const input   = document.getElementById(inputId);
  const counter = document.getElementById(countId);
  if (!input || !counter) return;

  input.addEventListener('input', () => {
    const len = input.value.length;
    counter.textContent = `${len} / ${max}`;
    counter.classList.remove('warning', 'limit');
    if (len >= max)         counter.classList.add('limit');
    else if (len >= max * 0.85) counter.classList.add('warning');
  });
}

// Validate single field
function validateField(id, errId, rules) {
  const field = document.getElementById(id);
  const err   = document.getElementById(errId);
  const group = field?.closest('.form-group');
  const val   = field?.value.trim();

  let message = '';

  if (rules.required && !val) {
    message = rules.requiredMsg || 'This field is required.';
  } else if (val && rules.minLength && val.length < rules.minLength) {
    message = `Minimum ${rules.minLength} characters required.`;
  } else if (val && rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    message = 'Please enter a valid email address.';
  } else if (val && rules.maxLength && val.length > rules.maxLength) {
    message = `Maximum ${rules.maxLength} characters allowed.`;
  }

  if (err)   err.textContent = message;
  if (group) {
    group.classList.toggle('error',   !!message);
    group.classList.toggle('success', !message && !!val);
  }

  return !message;
}

// Validate all on submit
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const v1 = validateField('c-name',    'err-name',    { required: true, minLength: 2, maxLength: 60, requiredMsg: 'Please enter your full name.' });
    const v2 = validateField('c-email',   'err-email',   { required: true, email: true, requiredMsg: 'Please enter your email address.' });
    const v3 = validateField('c-domain',  'err-domain',  { required: true, requiredMsg: 'Please select a domain.' });
    const v4 = validateField('c-message', 'err-message', { required: true, minLength: 20, maxLength: 500, requiredMsg: 'Please write a message (min 20 characters).' });

    if (!v1 || !v2 || !v3 || !v4) {
      // Scroll to first error
      const firstError = contactForm.querySelector('.form-group.error');
      if (firstError) firstError.querySelector('input,select,textarea')?.focus();
      return;
    }

    // Simulate submission
    const btnText   = contactSubmit.querySelector('.btn-text');
    const btnLoader = contactSubmit.querySelector('.btn-loader');
    btnText.style.display   = 'none';
    btnLoader.style.display = 'inline';
    contactSubmit.disabled  = true;

    setTimeout(() => {
      contactForm.style.display    = 'none';
      contactSuccess.classList.add('show');
    }, 1400);
  });

  // Live validation on blur (better UX — validate when leaving field)
  ['c-name', 'c-email', 'c-domain', 'c-message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => {
      const map = {
        'c-name':    { id: 'c-name',    errId: 'err-name',    rules: { required: true, minLength: 2, maxLength: 60 } },
        'c-email':   { id: 'c-email',   errId: 'err-email',   rules: { required: true, email: true } },
        'c-domain':  { id: 'c-domain',  errId: 'err-domain',  rules: { required: true } },
        'c-message': { id: 'c-message', errId: 'err-message', rules: { required: true, minLength: 20, maxLength: 500 } },
      };
      const cfg = map[id];
      if (cfg) validateField(cfg.id, cfg.errId, cfg.rules);
    });
  });
}

// Reset contact form
if (resetFormBtn) {
  resetFormBtn.addEventListener('click', () => {
    contactForm.reset();
    contactForm.style.display = '';
    contactSuccess.classList.remove('show');
    contactSubmit.disabled = false;
    contactSubmit.querySelector('.btn-text').style.display   = 'inline';
    contactSubmit.querySelector('.btn-loader').style.display = 'none';
    document.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('error', 'success');
    });
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    document.querySelectorAll('.char-count').forEach(c => {
      const id  = c.id.replace('count-', 'c-');
      const max = id === 'c-name' ? 60 : 500;
      c.textContent = `0 / ${max}`;
      c.classList.remove('warning', 'limit');
    });
  });
}


// ── Apply Form (CTA section) ────────────────────────
const applyForm  = document.getElementById('apply-form');
const successMsg = document.getElementById('success-msg');

if (applyForm) {
  applyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const track = document.getElementById('track')?.value;

    if (!name || !email || !track) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    const btn = applyForm.querySelector('.cta-submit');
    btn.textContent = 'Submitting...';
    btn.disabled    = true;

    setTimeout(() => {
      applyForm.style.display = 'none';
      successMsg.classList.add('show');
    }, 1200);
  });
}


// ── Back to top ─────────────────────────────────────
const bttBtn = document.getElementById('back-to-top');
if (bttBtn) {
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ── Logo fallback ───────────────────────────────────
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
    logoImg.addEventListener('load',  () => {
      logoImg.style.display  = 'block';
      logoText.style.display = 'none';
    });
    if (logoImg.complete) check();
  }
});


// ── Skill icons stagger ─────────────────────────────
const skillSection = document.getElementById('skills');
const skillItems   = document.querySelectorAll('.skill-item');

if (skillSection && skillItems.length) {
  const skillObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      skillItems.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        }, i * 55);
      });
      skillObs.disconnect();
    }
  }, { threshold: 0.1 });

  skillItems.forEach(item => {
    item.style.opacity    = '0';
    item.style.transform  = 'translateY(20px)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  skillObs.observe(skillSection);
}


// ── TASK 4 — Startup Swipe File ─────────────────────
// Design patterns researched and logged for reference
const swipeFile = [
  {
    site: 'Linear',
    url:  'linear.app',
    patterns: [
      '1. Extremely minimal hero — just headline + CTA + product screenshot. No clutter.',
      '2. Dark background with subtle grid lines creates depth without heavy images.',
      '3. Social proof (logos of top companies) placed immediately below hero fold.',
    ],
    implemented: 'Back-to-top button micro-interaction (smooth, only appears when needed)',
  },
  {
    site: 'Vercel',
    url:  'vercel.com',
    patterns: [
      '1. Speed-focused copy — every headline communicates a benefit, not a feature.',
      '2. Live animated demo embedded in hero — shows the product working instantly.',
      '3. Gradient text on key words to draw attention without breaking hierarchy.',
    ],
    implemented: 'Gold gradient text on hero headline keywords (gold class)',
  },
  {
    site: 'Notion',
    url:  'notion.so',
    patterns: [
      '1. Template gallery as social proof — shows real use cases immediately.',
      '2. CTA repeated in hero, mid-page, and footer — never more than one scroll away.',
      '3. Soft pastel section backgrounds create visual breathing room between sections.',
    ],
    implemented: 'Alternating section backgrounds (#F4F7FF and #fff) for visual rhythm',
  },
  {
    site: 'Superhuman',
    url:  'superhuman.com',
    patterns: [
      '1. Single waitlist CTA — scarcity and exclusivity built into the entire page.',
      '2. Large bold typography with generous line height — feels premium.',
      '3. Testimonials from well-known people add authority immediately.',
    ],
    implemented: 'Urgency copy ("Limited Seats", "Free for First 50") across CTAs',
  },
  {
    site: 'Loom',
    url:  'loom.com',
    patterns: [
      '1. Video thumbnail in hero — shows product in action without user effort.',
      '2. Icon + short label cards for features — scannable, not wall-of-text.',
      '3. "How it works" section with numbered steps reduces cognitive friction.',
    ],
    implemented: 'Feature cards with icon + title + description (value-cards, track-cards)',
  },
];

console.group('📚 WeIntern — Task 4: Startup Swipe File');
swipeFile.forEach(item => {
  console.group(`🔗 ${item.site} (${item.url})`);
  item.patterns.forEach(p => console.log(p));
  console.log(`✅ Implemented: ${item.implemented}`);
  console.groupEnd();
});
console.groupEnd();


// ── Breakpoint logger (Task 1 — responsive testing) ─
function logBreakpoint() {
  const w  = window.innerWidth;
  const bp = w <= 480  ? '📱 Mobile (375px range)'
           : w <= 768  ? '📟 Tablet (768px range)'
           : w <= 1280 ? '🖥️  Desktop (1280px range)'
           : '🖥️  Wide Desktop (1280px+)';
  console.log(`[WeIntern] Viewport: ${w}px → ${bp}`);
}
window.addEventListener('resize', logBreakpoint);
logBreakpoint();