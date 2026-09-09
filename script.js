/* ==========================================================================
   Edward Juma — Portfolio interactions
   Vanilla JS: no external animation libraries, so Lighthouse stays fast.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 300);
  });

  /* ---------- Theme toggle (persisted) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('ej-theme');
  if (savedTheme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    if (next === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    localStorage.setItem('ej-theme', next);
    themeToggle.setAttribute('aria-pressed', String(next === 'light'));
    themeToggle.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  });

  /* ---------- Sticky header + scroll progress + active nav link ---------- */
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  }

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', scrollTop > 30);
    backToTop.classList.toggle('visible', scrollTop > 500);
    progress.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
    highlightNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Typed role rotation (no external library) ---------- */
  const roles = [
    'IT Support Specialist',
    'Network Technician',
    'Systems Administrator',
    'Aspiring Cybersecurity Engineer'
  ];
  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;
      const TYPE_SPEED = 55, DELETE_SPEED = 32, HOLD = 1500;
      function tick() {
        const word = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typedEl.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            setTimeout(tick, HOLD);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typedEl.textContent = word.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      }
      tick();
    }
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (prefersReducedMotion) {
        el.textContent = target;
      } else {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          current = Math.min(target, current + step);
          el.textContent = current;
          if (current < target) requestAnimationFrame(tick);
        };
        tick();
      }
      statObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => statObserver.observe(el));

  /* ---------- Project filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Contact form validation + EmailJS integration ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = form.querySelector('button[type="submit"]');
  const submitButtonHTML = submitButton.innerHTML;

  // Update these three values after creating your EmailJS account and template.
  const EMAILJS_CONFIG = {
    publicKey: 'jdhKrf5ukWoK143rn',
    serviceId: 'service_z4alc7k',
    templateId: 'template_pynz6vx'
  };

  function setError(fieldId, message) {
    const row = document.getElementById(fieldId).closest('.form-row');
    const errorEl = form.querySelector(`[data-error-for="${fieldId}"]`);
    row.classList.toggle('invalid', Boolean(message));
    errorEl.textContent = message || '';
  }

  function setStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.classList.toggle('error', isError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isEmailJsConfigured() {
    return (
      EMAILJS_CONFIG.publicKey &&
      EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' &&
      EMAILJS_CONFIG.serviceId &&
      EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
      EMAILJS_CONFIG.templateId &&
      EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID'
    );
  }

  if (typeof emailjs !== 'undefined' && isEmailJsConfigured()) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    setError('name', name ? '' : (valid = false, 'Please enter your name.'));
    setError('email', email ? (isValidEmail(email) ? '' : (valid = false, 'Enter a valid email address.')) : (valid = false, 'Please enter your email.'));
    setError('subject', subject ? '' : (valid = false, 'Please add a subject.'));
    setError('message', message ? '' : (valid = false, 'Please write a message.'));

    if (!valid) {
      setStatus('Please fix the highlighted fields.', true);
      return;
    }

    if (typeof emailjs === 'undefined') {
      setStatus('EmailJS failed to load. Check your internet connection and refresh the page.', true);
      return;
    }

    if (!isEmailJsConfigured()) {
      setStatus('Set your EmailJS Public Key, Service ID, and Template ID in script.js before sending the form.', true);
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    setStatus('Sending your message...');

    try {
      await emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, form, {
        publicKey: EMAILJS_CONFIG.publicKey
      });

      setStatus(`Thanks, ${name.split(' ')[0]}! Your message was sent successfully.`);
      form.reset();
      ['name', 'email', 'subject', 'message'].forEach((fieldId) => setError(fieldId, ''));
    } catch (error) {
      console.error('EmailJS send error:', error);
      setStatus('Something went wrong while sending your message. Please try again or email ejuma670@gmail.com directly.', true);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = submitButtonHTML;
    }
  });

  /* ---------- Lightweight canvas particle network (background) ---------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
    const LINK_DIST = 130;
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.documentElement.scrollHeight;
      const count = Math.min(90, Math.max(28, Math.floor((width * window.innerHeight) / 24000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.8
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const viewTop = window.scrollY;
      const viewBottom = viewTop + window.innerHeight;

      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;
        const absY = n.y + viewTop;
        if (absY < viewTop - 50 || absY > viewBottom + 50) continue;
        ctx.beginPath();
        ctx.arc(n.x, absY, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.18 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y + viewTop);
            ctx.lineTo(nodes[j].x, nodes[j].y + viewTop);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  /* ---------- Footer year (kept in sync automatically) ---------- */
  const yearMatch = document.querySelector('.footer-bottom p');
  if (yearMatch) {
    yearMatch.textContent = yearMatch.textContent.replace(/\b\d{4}\b/, new Date().getFullYear());
  }
});