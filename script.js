/* ==========================================================================
   Md. Rishat — Portfolio
   Vanilla JS only. No frameworks, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Loading screen
     ------------------------------------------------------------------ */
  function initLoader() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;
    const minDelay = prefersReducedMotion ? 300 : 2000;
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, minDelay);
    });
    document.body.style.overflow = 'hidden';
  }

  /* ------------------------------------------------------------------
     2. Theme toggle (dark default, persisted in memory for this session)
     ------------------------------------------------------------------ */
  function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    let stored = null;
    try { stored = window.localStorage.getItem('mr-theme'); } catch (e) { stored = null; }

    // Dark is the designed default regardless of OS preference; only an
    // explicit prior toggle (stored) should switch it to light.
    body.setAttribute('data-theme', stored === 'light' ? 'light' : 'dark');

    updateToggleState();

    toggle.addEventListener('click', () => {
      const current = body.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', next);
      try { window.localStorage.setItem('mr-theme', next); } catch (e) { /* ignore */ }
      updateToggleState();
    });

    function updateToggleState() {
      const isLight = body.getAttribute('data-theme') === 'light';
      toggle.setAttribute('aria-pressed', String(isLight));
    }
  }

  /* ------------------------------------------------------------------
     3. Navbar: shrink on scroll, mobile burger, scroll-spy
     ------------------------------------------------------------------ */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const navLinksEl = document.getElementById('navLinks');
    const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = '#' + entry.target.id;
              navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === id);
              });
            }
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach((section) => spy.observe(section));
    }
  }

  /* ------------------------------------------------------------------
     4. Hero typing effect (role cycling)
     ------------------------------------------------------------------ */
  function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const phrases = [
      'Machine Learning Engineering',
      'Software Engineering Student',
      'MLOps & ML Deployment Learner',
      'Problem Solver'
    ];

    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          return setTimeout(tick, 1400);
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      const speed = deleting ? 32 : 55;
      setTimeout(tick, speed);
    }
    tick();
  }

  /* ------------------------------------------------------------------
     5. Floating particles (hero background)
     ------------------------------------------------------------------ */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container || prefersReducedMotion) return;
    const count = window.innerWidth < 700 ? 14 : 28;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const left = Math.random() * 100;
      const delay = Math.random() * 12;
      const duration = 10 + Math.random() * 10;
      const size = 2 + Math.random() * 2.5;
      p.style.left = left + '%';
      p.style.bottom = '-10px';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDelay = '-' + delay + 's';
      p.style.animationDuration = duration + 's';
      container.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------
     6. Terminal "accuracy" number type-on effect
     ------------------------------------------------------------------ */
  function initTerminalNumber() {
    const el = document.querySelector('.typing-out');
    if (!el || prefersReducedMotion) return;
    const finalValue = parseFloat(el.dataset.final || '0');
    let current = 0;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      current = finalValue * progress;
      el.textContent = current.toFixed(2);
      if (progress < 1) requestAnimationFrame(step);
    }
    setTimeout(() => requestAnimationFrame(step), 2400);
  }

  /* ------------------------------------------------------------------
     7. Scroll reveal (IntersectionObserver)
     ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      targets.forEach((t) => t.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((t) => observer.observe(t));
  }

  /* ------------------------------------------------------------------
     8. Animated counters (hero stats)
     ------------------------------------------------------------------ */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * progress);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((c) => observer.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ------------------------------------------------------------------
     9. Skill progress bars
     ------------------------------------------------------------------ */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    function fill(el) {
      const level = el.dataset.level || '0';
      el.style.width = level + '%';
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fill(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      bars.forEach((b) => observer.observe(b));
    } else {
      bars.forEach(fill);
    }
  }

  /* ------------------------------------------------------------------
     10. Projects — data-driven rendering
     ------------------------------------------------------------------ */
  const PROJECTS = [
    {
      title: 'Customer Churn Prediction',
      description:
        'Built a machine learning model to predict customer churn using data preprocessing, exploratory data analysis, and Logistic Regression.',
      tech: ['Python', 'Pandas', 'Scikit-learn'],
      github: 'https://github.com/mdrishat/customer-churn-prediction',
      demo: '#',
      icon: 'chart'
    },
    {
      title: 'Fake News Detection',
      description:
        'Developed an NLP-based model to detect fake news using text preprocessing, TF-IDF vectorization, and classification algorithms.',
      tech: ['Python', 'Scikit-learn', 'NLTK', 'TF-IDF'],
      github: 'https://github.com/mdrishat/fake-news-detection',
      demo: '#',
      icon: 'news'
    },
    {
      title: 'Cardiovascular Disease Prediction',
      description:
        'Developed a machine learning model to predict cardiovascular disease using feature analysis, preprocessing, and ensemble classification.',
      tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
      github: 'https://github.com/mdrishat/cardiovascular-disease-prediction',
      demo: '#',
      icon: 'heart'
    },
    {
      title: 'ResumeIQ — Smart Resume Analyzer & Career Assistant',
      description:
        'A resume analysis platform that scores resumes, matches skills against 10+ career tracks, and surfaces actionable improvement suggestions.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/mdrishat/resumeiq',
      demo: '#',
      icon: 'resume'
    }
  ];

  const PROJECT_ICONS = {
    chart:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 52h48" stroke-opacity=".3"/><rect x="14" y="30" width="8" height="18" rx="1"/><rect x="28" y="18" width="8" height="30" rx="1"/><rect x="42" y="24" width="8" height="24" rx="1"/></svg>',
    news:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="12" width="44" height="40" rx="3"/><path d="M18 22h28M18 30h28M18 38h18"/></svg>',
    heart:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 52S12 40 12 25a11 11 0 0 1 20-6 11 11 0 0 1 20 6c0 15-20 27-20 27Z"/><path d="M17 27h7l4 8 5-14 4 6h10" stroke-opacity=".6"/></svg>',
    resume:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="8" width="36" height="48" rx="3"/><circle cx="26" cy="24" r="5"/><path d="M18 38c0-4 4-6 8-6s8 2 8 6M34 22h10M34 30h10M20 46h24"/></svg>'
  };

  function renderProjects() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    grid.innerHTML = PROJECTS.map(
      (project, i) => `
      <article class="project-card" data-reveal style="transition-delay:${Math.min(i * 80, 240)}ms">
        <div class="project-thumb" role="img" aria-label="${project.title} illustration">
          ${PROJECT_ICONS[project.icon] || ''}
        </div>
        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.description}</p>
          <div class="badge-row">
            ${project.tech.map((t) => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
          <div class="project-actions">
            <a class="btn btn-secondary btn-ripple" href="${project.github}" target="_blank" rel="noopener noreferrer">
              <span>GitHub</span>
            </a>
            <a class="btn btn-primary btn-ripple" href="${project.demo}">
              <span>Project Details</span>
            </a>
          </div>
        </div>
      </article>`
    ).join('');

    // newly injected [data-reveal] nodes need observing
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      grid.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    } else {
      grid.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in-view'));
    }

    attachRipple(grid);
  }

  /* ------------------------------------------------------------------
     11. Ripple effect on buttons
     ------------------------------------------------------------------ */
  function attachRipple(scope) {
    const root = scope || document;
    root.querySelectorAll('.btn-ripple').forEach((btn) => {
      if (btn.dataset.rippleBound) return;
      btn.dataset.rippleBound = 'true';
      btn.addEventListener('click', function (e) {
        if (prefersReducedMotion) return;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ------------------------------------------------------------------
     12. Mouse glow effect
     ------------------------------------------------------------------ */
  function initMouseGlow() {
    const glow = document.getElementById('mouseGlow');
    if (!glow || prefersReducedMotion) return;
    let active = false;
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      if (!active) {
        glow.classList.add('active');
        active = true;
      }
    });
    window.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  /* ------------------------------------------------------------------
     13. Scroll progress bar
     ------------------------------------------------------------------ */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     14. Parallax on hero blobs
     ------------------------------------------------------------------ */
  function initParallax() {
    if (prefersReducedMotion) return;
    const blobs = document.querySelectorAll('.blob');
    if (!blobs.length) return;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          blobs.forEach((blob, i) => {
            const speed = 0.06 + i * 0.03;
            blob.style.transform = `translateY(${y * speed}px)`;
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------
     15. Back to top button
     ------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener(
      'scroll',
      () => btn.classList.toggle('show', window.scrollY > 600),
      { passive: true }
    );
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     16. Page fade transition on in-page nav
     ------------------------------------------------------------------ */
  function initPageFade() {
    const fade = document.getElementById('pageFade');
    if (!fade || prefersReducedMotion) return;
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        fade.classList.add('active');
        setTimeout(() => fade.classList.remove('active'), 400);
      });
    });
  }

  /* ------------------------------------------------------------------
     17. Contact form validation + success animation
     ------------------------------------------------------------------ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const success = document.getElementById('formSuccess');

    const fields = {
      name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
      email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
      subject: { input: document.getElementById('subject'), error: document.getElementById('subjectError') },
      message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(fieldKey, message) {
      const field = fields[fieldKey];
      const wrapper = field.input.closest('.form-field');
      wrapper.classList.toggle('error', Boolean(message));
      field.error.textContent = message || '';
    }

    function validate() {
      let valid = true;

      if (!fields.name.input.value.trim()) {
        setError('name', 'Please enter your name.');
        valid = false;
      } else {
        setError('name', '');
      }

      const emailVal = fields.email.input.value.trim();
      if (!emailVal) {
        setError('email', 'Please enter your email.');
        valid = false;
      } else if (!emailPattern.test(emailVal)) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      } else {
        setError('email', '');
      }

      if (!fields.subject.input.value.trim()) {
        setError('subject', 'Please add a subject.');
        valid = false;
      } else {
        setError('subject', '');
      }

      if (!fields.message.input.value.trim() || fields.message.input.value.trim().length < 10) {
        setError('message', 'Message should be at least 10 characters.');
        valid = false;
      } else {
        setError('message', '');
      }

      return valid;
    }

    Object.values(fields).forEach(({ input }) => {
      input.addEventListener('blur', validate);
      input.addEventListener('input', () => {
        const wrapper = input.closest('.form-field');
        if (wrapper.classList.contains('error')) validate();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      const submitBtn = form.querySelector('.form-submit');
      submitBtn.setAttribute('disabled', 'true');

      // Simulated send — replace with a real endpoint when wiring the backend.
      setTimeout(() => {
        success.classList.add('show');
        form.reset();
        submitBtn.removeAttribute('disabled');
        setTimeout(() => success.classList.remove('show'), 3200);
      }, 500);
    });
  }

  /* ------------------------------------------------------------------
     18. Footer year
     ------------------------------------------------------------------ */
  function initFooterYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initTheme();
    initNavbar();
    initTyping();
    initParticles();
    initTerminalNumber();
    initScrollReveal();
    initCounters();
    initSkillBars();
    renderProjects();
    attachRipple(document);
    initMouseGlow();
    initScrollProgress();
    initParallax();
    initBackToTop();
    initPageFade();
    initContactForm();
    initFooterYear();
  });
})();