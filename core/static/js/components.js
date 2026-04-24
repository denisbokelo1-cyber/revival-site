// Shared layout behavior for Django-rendered header/footer.

function initHeader() {
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

  function openNav() {
    if (!nav || !burger || !overlay) return;
    nav.classList.add('open');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!nav || !burger || !overlay) return;
    nav.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', () => nav.classList.contains('open') ? closeNav() : openNav());
  }
  navClose && navClose.addEventListener('click', closeNav);
  overlay && overlay.addEventListener('click', closeNav);

  if (nav) {
    nav.querySelectorAll('.nav__link:not(.nav__dropdown-trigger)').forEach(link => {
      link.addEventListener('click', closeNav);
    });
    nav.querySelectorAll('.nav__dropdown-item').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  const revivalTrigger = document.getElementById('revivalTrigger');
  const revivalMenu = document.getElementById('revivalMenu');
  if (revivalTrigger && revivalMenu) {
    revivalTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = revivalMenu.classList.toggle('open');
      revivalTrigger.setAttribute('aria-expanded', open);
      revivalTrigger.closest('.nav__dropdown')?.classList.toggle('open', open);
    });

    document.addEventListener('click', (event) => {
      const dropdown = revivalTrigger.closest('.nav__dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        revivalMenu.classList.remove('open');
        revivalTrigger.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  initLangSwitcher('langBtn', 'langDropdown', 'langCurrent');
  initLangSwitcher('langBtnDesktop', 'langDropdownDesktop', 'langCurrentDesktop', true);
}

function initLangSwitcher(buttonId, dropdownId, currentId, closeOnDocumentClick = false) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);
  const current = document.getElementById(currentId);
  if (!button || !dropdown || !current) return;

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = dropdown.classList.toggle('open');
    button.setAttribute('aria-expanded', open);
  });

  if (closeOnDocumentClick) {
    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    });
  }

  dropdown.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdown.querySelectorAll('.lang-option').forEach(item => item.classList.remove('lang-option--active'));
      option.classList.add('lang-option--active');
      current.textContent = option.dataset.lang.toUpperCase();
      dropdown.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    });
  });
}

function renderScrollTop() {
  if (document.getElementById('scrollTopBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', gettext('Retour en haut'));
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  renderScrollTop();
  initAnimations();
});
