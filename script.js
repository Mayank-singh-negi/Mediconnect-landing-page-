const header = document.querySelector('[data-header]');
const authModal = document.querySelector('#auth');
const authPanels = [...document.querySelectorAll('[data-auth-panel]')];
const choiceStatus = document.querySelector('[data-auth-status]');
let lastFocusedElement = null;

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 16);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const showAuthPanel = (name) => {
  authPanels.forEach((panel) => {
    const isActive = panel.dataset.authPanel === name;
    panel.hidden = !isActive;
    panel.classList.toggle('is-active', isActive);
  });
};

const openAuth = (event) => {
  event?.preventDefault();
  if (!authModal) return;
  lastFocusedElement = document.activeElement;
  showAuthPanel('choices');
  authModal.classList.add('is-open');
  authModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  authModal.querySelector('.auth-close')?.focus();
};

const closeAuth = () => {
  if (!authModal) return;
  authModal.classList.remove('is-open');
  authModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  showAuthPanel('choices');
  lastFocusedElement?.focus?.();
};

document.querySelectorAll('[data-auth-open]').forEach((button) => button.addEventListener('click', openAuth));
document.querySelectorAll('[data-auth-close]').forEach((button) => button.addEventListener('click', closeAuth));

document.querySelectorAll('[data-auth-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.dataset.authChoice;
    showAuthPanel(panel);
    if (choiceStatus) choiceStatus.textContent = panel === 'signup' ? 'Create a patient account in a few simple steps.' : 'Choose Patient, Doctor, or Admin access below.';
    authModal.querySelector(`[data-auth-panel="${panel}"] .auth-back`)?.focus();
  });
});

document.querySelectorAll('[data-auth-back]').forEach((button) => {
  button.addEventListener('click', () => showAuthPanel('choices'));
});

document.querySelectorAll('[data-role-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const role = tab.dataset.roleTab;
    document.querySelectorAll('[data-role-tab]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-role-form]').forEach((form) => {
      const active = form.dataset.roleForm === role;
      form.hidden = !active;
      form.classList.toggle('is-active', active);
    });
    const status = document.querySelector('[data-auth-panel="login"] [data-form-status]');
    if (status) status.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} login keeps the right level of care context in view.`;
  });
});

document.querySelectorAll('[data-auth-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.closest('.auth-panel')?.querySelector('[data-form-status]');
    if (status) status.textContent = 'This secure account flow is ready to connect to your authentication service.';
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && authModal?.classList.contains('is-open')) closeAuth();
});

const accordionItems = document.querySelectorAll('[data-accordion-item]');
accordionItems.forEach((item) => {
  const header = item.querySelector('.accordion-header');
  header?.addEventListener('click', () => {
    const isActive = item.classList.contains('accordion-item-active');
    accordionItems.forEach((otherItem) => {
      otherItem.classList.remove('accordion-item-active');
    });
    if (!isActive) {
      item.classList.add('accordion-item-active');
    }
  });
});

const carouselTrack = document.querySelector('[data-carousel-track]');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

if (carouselTrack && prevBtn && nextBtn) {
  const originalCards = Array.from(carouselTrack.querySelectorAll('.doctor-card'));
  const cardWidth = 310;
  const gap = 26;
  const moveAmount = cardWidth + gap;
  const totalCards = originalCards.length;
  const cardsToShow = 3;

  // Clone first and last cards for infinite loop
  const firstClones = originalCards.slice(0, cardsToShow).map(card => card.cloneNode(true));
  const lastClones = originalCards.slice(-cardsToShow).map(card => card.cloneNode(true));

  // Prepend last clones and append first clones
  lastClones.forEach(clone => carouselTrack.insertBefore(clone, carouselTrack.firstChild));
  firstClones.forEach(clone => carouselTrack.appendChild(clone));

  const allCards = carouselTrack.querySelectorAll('.doctor-card');
  let currentIndex = cardsToShow;
  let isTransitioning = false;

  const updateCarousel = (instant = false) => {
    carouselTrack.style.transition = instant ? 'none' : 'transform .5s ease-out';
    const translateX = -(currentIndex * moveAmount);
    carouselTrack.style.transform = `translateX(${translateX}px)`;
  };

  const handleTransitionEnd = () => {
    isTransitioning = false;
    carouselTrack.removeEventListener('transitionend', handleTransitionEnd);

    // Reset position silently when at cloned cards
    if (currentIndex >= totalCards + cardsToShow) {
      currentIndex = cardsToShow;
      updateCarousel(true);
    } else if (currentIndex < cardsToShow) {
      currentIndex = totalCards;
      updateCarousel(true);
    }
  };

  prevBtn?.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel();
    carouselTrack.addEventListener('transitionend', handleTransitionEnd);
  });

  nextBtn?.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel();
    carouselTrack.addEventListener('transitionend', handleTransitionEnd);
  });

  // Initialize position
  updateCarousel(true);

  // Touch/swipe support
  const carouselViewport = carouselTrack.parentElement;
  let touchStartX = 0;
  let touchEndX = 0;

  carouselViewport?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselViewport?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        nextBtn?.click();
      } else {
        // Swipe right - previous
        prevBtn?.click();
      }
    }
  };

  // Mobile tap support for card interaction
  const doctorCards = carouselTrack.querySelectorAll('.doctor-card');
  doctorCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't interfere with button clicks
      if (e.target.closest('.doctor-cta')) return;

      // Toggle active state on mobile
      card.classList.toggle('doctor-card-active');
    });

    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('doctor-card-active');
      }
    });
  });
}
