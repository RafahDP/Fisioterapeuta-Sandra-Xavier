const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    navLinks.style.cssText += open ? '' : 'position:absolute;top:78px;left:0;right:0;background:var(--bg);flex-direction:column;padding:24px 32px;border-bottom:1px solid var(--line);gap:18px;';
  });
}

// Reveal on scroll
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal, .service-card');
if (revealEls.length) {
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
}

// Team photo carousel
const carousel = document.getElementById('carouselExampleIndicators');
if (carousel) {
  const items = [...carousel.querySelectorAll('.carousel-item')];
  const indicators = [...carousel.querySelectorAll('.carousel-indicators li')];
  let activeIndex = 0;
  let carouselTimer;

  function showCarouselSlide(index) {
    activeIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === activeIndex));
    indicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle('active', indicatorIndex === activeIndex);
      indicator.setAttribute('aria-current', indicatorIndex === activeIndex ? 'true' : 'false');
    });
  }

  function restartCarousel() {
    clearInterval(carouselTimer);
    if (!reduced && items.length > 1) carouselTimer = setInterval(() => showCarouselSlide(activeIndex + 1), 5000);
  }

  const prevButton = carousel.querySelector('.carousel-control-prev');
  const nextButton = carousel.querySelector('.carousel-control-next');
  if (prevButton) {
    prevButton.addEventListener('click', (event) => {
      event.preventDefault();
      showCarouselSlide(activeIndex - 1);
      restartCarousel();
    });
  }
  if (nextButton) {
    nextButton.addEventListener('click', (event) => {
      event.preventDefault();
      showCarouselSlide(activeIndex + 1);
      restartCarousel();
    });
  }
  indicators.forEach((indicator, indicatorIndex) => indicator.addEventListener('click', () => {
    showCarouselSlide(indicatorIndex);
    restartCarousel();
  }));
  carousel.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  carousel.addEventListener('mouseleave', restartCarousel);
  showCarouselSlide(0);
  restartCarousel();
}

// Goniometer hero animation (only active when the matching SVG exists in the DOM)
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
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

  const ticksGroup = document.getElementById('ticks');
  if (ticksGroup) {
    for (let a = 0; a <= 120; a += 15) {
      const inner = polarToCartesian(HINGE.x, HINGE.y, 118, a);
      const outer = polarToCartesian(HINGE.x, HINGE.y, 130, a);
      const l = document.createElementNS('http://www.w3.org/2000/svg','line');
      l.setAttribute('x1', inner.x); l.setAttribute('y1', inner.y);
      l.setAttribute('x2', outer.x); l.setAttribute('y2', outer.y);
      l.setAttribute('opacity', a % 30 === 0 ? '0.9' : '0.35');
      ticksGroup.appendChild(l);
    }
  }

  const armLine = document.getElementById('armLine');
  const armTip = document.getElementById('armTip');
  const arcFill = document.getElementById('arcFill');
  const degCounter = document.getElementById('degCounter');

  function setAngle(angle){
    const tip = polarToCartesian(HINGE.x, HINGE.y, ARM_LEN, angle);
    if (armLine) armLine.setAttribute('x2', tip.x.toFixed(2));
    if (armLine) armLine.setAttribute('y2', tip.y.toFixed(2));
    if (armTip) {
      armTip.setAttribute('cx', tip.x.toFixed(2));
      armTip.setAttribute('cy', tip.y.toFixed(2));
    }
    if (arcFill) arcFill.setAttribute('d', arcPath(HINGE.x, HINGE.y, ARC_R, 0, angle));
    if (degCounter) degCounter.textContent = Math.round(angle) + '°';
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
}

// Booking form -> Envio direto para o WhatsApp (Versão Correta e Única)
const bookingForm = document.getElementById('bookingForm');
const success = document.getElementById('formSuccess');

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Captura os campos de forma segura
    const nameInput = bookingForm.querySelector('input[type="text"]') || document.getElementById('name');
    const phoneInput = bookingForm.querySelector('input[type="tel"]') || document.getElementById('phone');
    const treatmentSelect = bookingForm.querySelector('select') || document.getElementById('treatment');
    const messageArea = bookingForm.querySelector('textarea') || document.getElementById('message');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const treatment = treatmentSelect ? treatmentSelect.value : '';
    const message = messageArea ? messageArea.value.trim() : '';
    
    // Monta o texto formatado para o WhatsApp
    let text = `Olá! Gostaria de agendar uma avaliação.\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Tratamento:* ${treatment}`;
    
    if (message) {
      text += `\n*Observação:* ${message}`;
    }
    
    // Codifica o texto para o formato de URL do WhatsApp
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5521994792249?text=${encodedText}`;
    
    // Mostra opcionalmente a mensagem de sucesso na tela e abre o WhatsApp
    if (success) success.classList.add('show');
    window.open(whatsappUrl, '_blank');
    
    // Limpa o formulário após abrir o WhatsApp
    bookingForm.reset();
  });
}