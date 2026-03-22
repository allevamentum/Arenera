/* ============================================
   ARENERA — Landing Page JavaScript
   Animations, Form Handling, Interactions
   ============================================ */
(function () {
  'use strict';

  // ─── Preloader ───
  const preloader = document.getElementById('preloader');
  const loaderFill = document.querySelector('.loader-bar-fill');
  let progress = 0;

  function updateLoader() {
    progress += Math.random() * 15 + 5;
    if (progress > 100) progress = 100;
    if (loaderFill) loaderFill.style.width = progress + '%';
    if (progress < 100) {
      requestAnimationFrame(() => setTimeout(updateLoader, 80));
    } else {
      setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
          animateHero();
        }, 800);
      }, 400);
    }
  }
  window.addEventListener('load', updateLoader);

  // ─── Custom Cursor ───
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    });
    (function loop() {
      cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
      cursorRing.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .sector-card, .hero-cta, .nav-cta, .form-submit').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // ─── Navigation Scroll ───
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── Hero Animation ───
  function animateHero() {
    const timeline = [
      { el: document.querySelector('.hero-logo'), delay: 0, props: { opacity: '1', transform: 'scale(1)' } },
      { el: document.querySelector('.hero-title'), delay: 300, props: { opacity: '1', transform: 'translateY(0)' } },
      { el: document.querySelector('.hero-panel'), delay: 600, props: { opacity: '1', transform: 'translateY(0)' } },
    ];
    timeline.forEach(({ el, delay, props }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        Object.assign(el.style, props);
      }, delay);
    });
  }

  // ─── Scroll Reveal ───
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-scale');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => observer.observe(el));
  }
  document.addEventListener('DOMContentLoaded', setupScrollReveal);

  // ─── Particle Network (Hero) ───
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = Math.min(80, Math.floor(canvas.width / 20));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.3 + 0.1,
      });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 149, 44, ${p.opacity})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 149, 44, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  document.addEventListener('DOMContentLoaded', initParticles);

  // ─── Floating Expertise Words ───
  function initFloatingWords() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const words = ['Construction', 'Agriculture', 'Fintech', 'Investments', 'IT & Cloud', 'Artificial Intelligence'];
    const positions = [
      { left: '8%', top: '18%' }, { right: '10%', top: '22%' },
      { left: '12%', bottom: '30%' }, { right: '8%', bottom: '25%' },
      { left: '22%', top: '35%' }, { right: '18%', top: '42%' },
    ];
    words.forEach((word, i) => {
      const el = document.createElement('span');
      el.className = 'float-word';
      el.textContent = word;
      Object.assign(el.style, positions[i]);
      el.style.animationDelay = (i * 2.3) + 's';
      hero.appendChild(el);
    });
  }
  document.addEventListener('DOMContentLoaded', initFloatingWords);

  // ─── Data Visualization Canvas ───
  function initDataViz() {
    const canvas = document.getElementById('dataviz-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    const gold = '#C9952C', silver = '#B0B0B0';
    const gridColor = 'rgba(34,34,34,0.8)';
    let started = false;

    function genData(len, vol, trend) {
      const d = []; let v = 50;
      for (let i = 0; i < len; i++) { v += (Math.random() - 0.45) * vol + trend; v = Math.max(10, Math.min(90, v)); d.push(v); }
      return d;
    }
    const data1 = genData(100, 4, 0.15), data2 = genData(100, 3, 0.08);

    function drawGrid() {
      const w = canvas.width, h = canvas.height;
      for (let i = 1; i < 5; i++) {
        const y = (h / 5) * i;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y);
        ctx.strokeStyle = gridColor; ctx.lineWidth = 0.5; ctx.stroke();
      }
    }
    function drawLine(data, color, fillAlpha, pct) {
      const w = canvas.width, h = canvas.height, pad = 30, dh = h - pad * 2;
      const pts = Math.floor(data.length * pct);
      if (pts < 2) return;
      const step = w / (data.length - 1);
      ctx.beginPath(); ctx.moveTo(0, pad + dh - (data[0] / 100) * dh);
      for (let i = 1; i < pts; i++) {
        const x = i * step, y = pad + dh - (data[i] / 100) * dh;
        const px = (i - 1) * step, py = pad + dh - (data[i - 1] / 100) * dh;
        ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
      }
      ctx.lineTo((pts - 1) * step, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = color.replace(')', `, ${fillAlpha})`).replace('rgb', 'rgba');
      if (!color.startsWith('rgb')) ctx.fillStyle = `rgba(201,149,44,${fillAlpha})`;
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, pad + dh - (data[0] / 100) * dh);
      for (let i = 1; i < pts; i++) {
        const x = i * step, y = pad + dh - (data[i] / 100) * dh;
        const px = (i - 1) * step, py = pad + dh - (data[i - 1] / 100) * dh;
        ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    }

    let time = 0;
    function draw() {
      if (!started) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;
      const p = Math.min(time, 1);
      drawGrid();
      drawLine(data2, silver, 0.03, p);
      drawLine(data1, gold, 0.08, p);
      if (p < 1) { requestAnimationFrame(draw); } else { live(); }
    }
    function live() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      data1.push(data1[data1.length - 1] + (Math.random() - 0.5) * 2); data1.shift();
      data2.push(data2[data2.length - 1] + (Math.random() - 0.5) * 1.5); data2.shift();
      drawGrid(); drawLine(data2, silver, 0.03, 1); drawLine(data1, gold, 0.08, 1);
      requestAnimationFrame(live);
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && !started) { started = true; draw(); } });
    }, { threshold: 0.2 });
    obs.observe(canvas);
  }
  document.addEventListener('DOMContentLoaded', initDataViz);

  // ─── Ticker Duplication ───
  document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.ticker-track');
    if (track) track.innerHTML += track.innerHTML;
  });

  // ─── Parallax Hero ───
  function initParallax() {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      if (s < window.innerHeight) {
        hero.style.transform = `translateY(${s * 0.25}px)`;
        hero.style.opacity = 1 - s / (window.innerHeight * 0.8);
      }
    }, { passive: true });
  }
  document.addEventListener('DOMContentLoaded', initParallax);

  // ─── Smooth Scroll ───
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });

  // ─── Form Handling ───
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('request-form');
    const success = document.getElementById('form-success');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(input => {
        const err = input.parentElement.querySelector('.form-error');
        if (!input.value.trim()) {
          input.classList.add('error');
          if (err) err.classList.add('show');
          valid = false;
        } else {
          input.classList.remove('error');
          if (err) err.classList.remove('show');
        }
      });

      const email = form.querySelector('[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        const err = email.parentElement.querySelector('.form-error');
        if (err) { err.textContent = 'Invalid email address'; err.classList.add('show'); }
        valid = false;
      }

      if (valid) {
        form.style.transition = 'opacity 0.4s, transform 0.4s';
        form.style.opacity = '0';
        form.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          form.style.display = 'none';
          if (success) success.classList.add('show');
        }, 400);
      }
    });

    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = input.parentElement.querySelector('.form-error');
        if (err) err.classList.remove('show');
      });
    });
  });

  // ─── Dynamic Year ───
  document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });

})();
