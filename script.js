/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * WearBottle - Interactive Script
 * Pure Vanilla JavaScript (No external frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeaderBannerCarousel();
  initWaterCanvas();
  initCategoryFilters();
  initScrollReveal();
  initFaqAccordion();
  initHotspots();
  initHowItWorksSteps();
  initModals();
  initOrderForm();
  initDemoSimulator();
  initNewsletter();
  initParallaxTilt();
});

/* ==========================================================================
   1. Navbar Scroll Effect & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   2. Header Scroll Banner (4 Photos Carousel with Autoplay & Swipe)
   ========================================================================== */
function initHeaderBannerCarousel() {
  const track = document.getElementById('banner-carousel-track');
  const slides = document.querySelectorAll('.banner-slide');
  const prevBtn = document.getElementById('banner-prev-btn');
  const nextBtn = document.getElementById('banner-next-btn');
  const dots = document.querySelectorAll('.banner-dot');
  const container = document.querySelector('.banner-carousel-container');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayInterval = null;

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 25}%)`;

    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  prevBtn?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    startAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      goToSlide(targetIndex);
      startAutoplay();
    });
  });

  // Pause on hover
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
    startAutoplay();
  }, { passive: true });

  goToSlide(0);
  startAutoplay();
}

/* ==========================================================================
   3. 3 Bottle Category Divided (Filters & Selectors)
   ========================================================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.category-filter-btn');
  const cards = document.querySelectorAll('.category-bottle-card');
  const orderBtns = document.querySelectorAll('.trigger-category-order');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cardCat) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // When clicking preorder on a specific category card
  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const edition = btn.getAttribute('data-edition') || 'Sport Edition';
      const orderModal = document.getElementById('order-modal');
      const editionPills = document.querySelectorAll('.edition-pill');

      editionPills.forEach(pill => {
        if (pill.getAttribute('data-edition') === edition) {
          pill.classList.add('selected');
        } else {
          pill.classList.remove('selected');
        }
      });

      updateModalPriceByEdition(edition);

      orderModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

function updateModalPriceByEdition(edition) {
  const priceDisplay = document.getElementById('modal-price-display');
  const prices = {
    'Sport Edition': '$44',
    'Commute Edition': '$39',
    'Explorer Edition': '$49'
  };
  if (priceDisplay && prices[edition]) {
    priceDisplay.textContent = prices[edition];
  }
}

/* ==========================================================================
   4. Water Droplets Ambient Canvas Simulation
   ========================================================================== */
function initWaterCanvas() {
  const canvas = document.getElementById('water-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const droplets = [];
  const dropletCount = Math.min(26, Math.floor(window.innerWidth / 48));

  for (let i = 0; i < dropletCount; i++) {
    droplets.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 5 + 2,
      speedY: -(Math.random() * 0.45 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.15,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      d.y += d.speedY;
      d.wobble += d.wobbleSpeed;
      d.x += Math.sin(d.wobble) * 0.35 + d.speedX;

      if (d.y < -20) {
        d.y = height + 20;
        d.x = Math.random() * width;
      }
      if (d.x < -20) d.x = width + 20;
      if (d.x > width + 20) d.x = -20;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 197, 94, ${d.opacity})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(d.x - d.radius * 0.3, d.y - d.radius * 0.3, d.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${d.opacity + 0.25})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   5. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
      }
    });
  });

  const firstItem = faqItems[0];
  if (firstItem) {
    firstItem.classList.add('active');
    const firstAns = firstItem.querySelector('.faq-answer');
    if (firstAns) firstAns.style.maxHeight = firstAns.scrollHeight + 32 + 'px';
  }
}

/* ==========================================================================
   7. Interactive Hotspots on Showcase
   ========================================================================== */
function initHotspots() {
  const hotspots = document.querySelectorAll('.showcase-hotspot');
  const featureBox = document.getElementById('showcase-feature-info');

  const infoData = {
    'reusable': {
      title: '10,000+ Peel & Re-wrap Cycles',
      desc: 'Our biomimetic micro-suction backing adheres cleanly without sticky adhesive residues, maintaining 100% grip year after year.'
    },
    'comfort': {
      title: '38mm Ergonomic Contour Strap',
      desc: 'Distributes weight uniformly across your clavicle and shoulder, neutralizing bounce even during sprint intervals.'
    },
    'waterproof': {
      title: 'IPX7 Weather & Sweat Barrier',
      desc: 'Hydrophobic nano-coating sheds sweat, torrential rain, and gym spillages instantly. Machine washable in seconds.'
    },
    'material': {
      title: 'Medical Grade 18/8 Stainless Steel',
      desc: 'Triple-wall vacuum insulation keeps liquids iced for 24 hours or piping hot for 12 hours with zero condensation sweat.'
    },
    'eco': {
      title: '100% Recyclable Zero-Waste Design',
      desc: 'Eliminates single-use plastic bottles and separate strap clips. The label itself is the carrying solution.'
    }
  };

  hotspots.forEach(spot => {
    spot.addEventListener('mouseenter', () => {
      const key = spot.getAttribute('data-feature');
      if (key && infoData[key] && featureBox) {
        featureBox.querySelector('.info-title').textContent = infoData[key].title;
        featureBox.querySelector('.info-desc').textContent = infoData[key].desc;
      }
    });
  });
}

/* ==========================================================================
   8. How It Works Interactive Steps
   ========================================================================== */
function initHowItWorksSteps() {
  const stepCards = document.querySelectorAll('.step-card');
  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      stepCards.forEach(c => c.classList.remove('active-step'));
      card.classList.add('active-step');
    });
  });
}

/* ==========================================================================
   9. Modals (Order & Demo)
   ========================================================================== */
function initModals() {
  const orderModal = document.getElementById('order-modal');
  const demoModal = document.getElementById('demo-modal');
  const openOrderBtns = document.querySelectorAll('.trigger-order-modal');
  const openDemoBtns = document.querySelectorAll('.trigger-demo-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');

  openOrderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      orderModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      demoModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn) {
        orderModal?.classList.remove('active');
        demoModal?.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      orderModal?.classList.remove('active');
      demoModal?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   10. Order Modal Logic (Colors, Sizes, Editions, Pricing)
   ========================================================================== */
function initOrderForm() {
  const colorOptions = document.querySelectorAll('.color-option');
  const sizePills = document.querySelectorAll('.size-pill');
  const editionPills = document.querySelectorAll('.edition-pill');
  const colorLabel = document.getElementById('selected-color-name');
  const priceDisplay = document.getElementById('modal-price-display');
  const form = document.getElementById('preorder-form');

  const editionBasePrices = {
    'Sport Edition': 44,
    'Commute Edition': 39,
    'Explorer Edition': 49
  };

  let selectedEdition = 'Sport Edition';
  let sizeModifier = 0;

  function updatePrice() {
    const base = editionBasePrices[selectedEdition] || 42;
    const finalPrice = base + sizeModifier;
    if (priceDisplay) {
      priceDisplay.textContent = `$${finalPrice}`;
    }
  }

  editionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      editionPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedEdition = pill.getAttribute('data-edition') || 'Sport Edition';
      updatePrice();
    });
  });

  colorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      colorOptions.forEach(c => c.classList.remove('selected'));
      opt.classList.add('selected');
      const name = opt.getAttribute('data-color');
      if (colorLabel && name) colorLabel.textContent = name;
    });
  });

  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      const size = pill.getAttribute('data-size');
      if (size === '500ml') sizeModifier = -4;
      else if (size === '650ml') sizeModifier = 0;
      else if (size === '950ml') sizeModifier = 6;
      updatePrice();
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderModal = document.getElementById('order-modal');
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : '';

      orderModal?.classList.remove('active');
      document.body.style.overflow = '';

      showToast(`🎉 Order reserved for ${email}! ${selectedEdition} will ship in Batch #1.`);
      form.reset();
    });
  }
}

/* ==========================================================================
   11. Demo Simulator
   ========================================================================== */
function initDemoSimulator() {
  const stage = document.getElementById('demo-stage');
  const prevBtn = document.getElementById('demo-prev-btn');
  const nextBtn = document.getElementById('demo-next-btn');
  const stepTitle = document.getElementById('demo-step-title');
  const stepDesc = document.getElementById('demo-step-desc');
  const stepNumber = document.getElementById('demo-step-num');

  if (!stage || !prevBtn || !nextBtn) return;

  let currentStep = 1;
  const maxSteps = 4;

  const stepsData = [
    {
      title: 'Step 1: Grab Your Bottle',
      desc: 'The transformable sling sits flush as an ultra-sleek, waterproof label.'
    },
    {
      title: 'Step 2: Peel The Label',
      desc: 'Lift the ergonomic silicone tab. The micro-suction strap releases smoothly with zero stickiness.'
    },
    {
      title: 'Step 3: Turn It Into A Sling',
      desc: 'Unfold the reinforced woven strap and adjust the length to your preferred cross-body fit.'
    },
    {
      title: 'Step 4: Wear & Enjoy Hands-Free',
      desc: 'Slip the strap over your shoulder. Run, commute, or hike with complete freedom of motion.'
    }
  ];

  function updateStep(step) {
    currentStep = step;
    stage.className = `demo-stage-screen step-${currentStep}`;
    if (stepTitle) stepTitle.textContent = stepsData[currentStep - 1].title;
    if (stepDesc) stepDesc.textContent = stepsData[currentStep - 1].desc;
    if (stepNumber) stepNumber.textContent = `${currentStep} of ${maxSteps}`;

    prevBtn.disabled = currentStep === 1;
    nextBtn.textContent = currentStep === maxSteps ? 'Restart' : 'Next Step →';
  }

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) updateStep(currentStep - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (currentStep < maxSteps) {
      updateStep(currentStep + 1);
    } else {
      updateStep(1);
    }
  });

  updateStep(1);
}

/* ==========================================================================
   12. Newsletter & Toast Notification
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast('🌱 You are subscribed! Welcome to hands-free hydration.');
        input.value = '';
      }
    });
  }
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div class="toast-text">${message}</div>
    `;
    document.body.appendChild(toast);
  } else {
    toast.querySelector('.toast-text').textContent = message;
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   13. Parallax Tilt Effect for Hero Product Card
   ========================================================================== */
function initParallaxTilt() {
  const heroCard = document.querySelector('.hero-bottle-card');
  if (!heroCard || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = '';
  });
}
