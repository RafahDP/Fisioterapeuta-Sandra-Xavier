document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle && navToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    navLinks.style.cssText += open ? '' : 'position:absolute;top:78px;left:0;right:0;background:var(--bg);flex-direction:column;padding:24px 32px;border-bottom:1px solid var(--line);gap:18px;';
  });

  // Reveal on scroll
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal, .service-card');
  if (reduced) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  // Goniometer hero animation
  function polarToCartesian(cx, cy, r, angleDeg){
    const rad = angleDeg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }
  function arcPath(cx, cy, r, startAngle, endAngle){
    if (endAngle <= startAngle) return '';
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
  }

  const HINGE = { x: 150, y: 330 };
  const ARM_LEN = 128, ARC_R = 96, TARGET = 120;

  // static ticks every 15deg from 0 to 120
  const ticksGroup = document.getElementById('ticks');
  for (let a = 0; a <= 120; a += 15) {
    const inner = polarToCartesian(HINGE.x, HINGE.y, 118, a);
    const outer = polarToCartesian(HINGE.x, HINGE.y, 130, a);
    const l = document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('x1', inner.x); l.setAttribute('y1', inner.y);
    l.setAttribute('x2', outer.x); l.setAttribute('y2', outer.y);
    l.setAttribute('opacity', a % 30 === 0 ? '0.9' : '0.35');
    ticksGroup.appendChild(l);
  }

  const armLine = document.getElementById('armLine');
  const armTip = document.getElementById('armTip');
  const arcFill = document.getElementById('arcFill');
  const degCounter = document.getElementById('degCounter');

  function setAngle(angle){
    const tip = polarToCartesian(HINGE.x, HINGE.y, ARM_LEN, angle);
    armLine.setAttribute('x2', tip.x.toFixed(2));
    armLine.setAttribute('y2', tip.y.toFixed(2));
    armTip.setAttribute('cx', tip.x.toFixed(2));
    armTip.setAttribute('cy', tip.y.toFixed(2));
    arcFill.setAttribute('d', arcPath(HINGE.x, HINGE.y, ARC_R, 0, angle));
    degCounter.textContent = Math.round(angle) + '°';
  }

  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  function playGoniometer(){
    if (reduced) { setAngle(TARGET); return; }
    const duration = 1500;
    const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      setAngle(TARGET * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const heroVisual = document.querySelector('.hero-visual');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playGoniometer();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  setAngle(0);
  heroObserver.observe(heroVisual);

  // Booking form (front-end only demo)
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.add('show');
    form.reset();
  });