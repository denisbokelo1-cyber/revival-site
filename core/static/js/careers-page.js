/**
 * careers-page.js
 * Logique de la page Carrieres :
 * - Badges de statut dynamiques (deadline)
 * - Recherche + filtrage en temps reel
 * - Support parametres URL (?q=&loc=)
 * - Pagination (30 offres/page)
 * - Slider partenaires
 * - Cookie consent RGPD
 * - Ouverture du modal de candidature
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── STATUT BADGES ──
  const ITEMS_PER_PAGE = 30;
  let currentPage = 1;
  let activeFilter = 'all';
  let searchKeyword = '';
  let searchLocation = '';

  function getDeadlineStatus(deadlineStr) {
    if (!deadlineStr) return 'active';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'soon';
    return 'active';
  }

  function applyStatusBadges() {
    document.querySelectorAll('.job-item').forEach(item => {
      const deadline = item.dataset.deadline || '';
      const status = getDeadlineStatus(deadline);
      const badge = item.querySelector('.job-status-badge');
      const btn = item.querySelector('.job-apply-btn');

      if (badge) {
        badge.className = 'job-status-badge';
        if (status === 'expired') {
          badge.classList.add('status-expired');
          badge.textContent = gettext('Expiree');
          item.classList.add('job-expired');
          if (btn) {
            btn.textContent = gettext("Voir l'offre");
            btn.disabled = true;
            btn.classList.remove('btn--primary');
            btn.classList.add('btn--outline');
          }
        } else if (status === 'soon') {
          badge.classList.add('status-soon');
          badge.textContent = gettext('Moins de 3 jours');
        } else {
          badge.classList.add('status-active');
          badge.textContent = gettext('En cours');
        }
      }
    });
  }

  applyStatusBadges();

  // ── FILTRAGE & RECHERCHE ──
  function getVisibleItems() {
    const kw = searchKeyword.toLowerCase().trim();
    const loc = searchLocation.toLowerCase().trim();

    return Array.from(document.querySelectorAll('.job-item')).filter(item => {
      const cat = item.dataset.cat || '';
      const title = (item.dataset.title || '').toLowerCase();
      const company = (item.dataset.company || '').toLowerCase();
      const location = (item.dataset.location || '').toLowerCase();

      const matchCat = activeFilter === 'all' || cat === activeFilter;
      const matchKw = !kw || title.includes(kw) || company.includes(kw);
      const matchLoc = !loc || location.includes(loc);

      return matchCat && matchKw && matchLoc;
    });
  }

  function renderPage() {
    const all = document.querySelectorAll('.job-item');
    const visible = getVisibleItems();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = visible.slice(start, end);

    all.forEach(item => { item.style.display = 'none'; });
    pageItems.forEach(item => { item.style.display = 'flex'; });

    renderPagination(visible.length);
  }

  function renderPagination(total) {
    const container = document.getElementById('jobsPagination');
    if (!container) return;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = '';
    html += `<button class="page-btn page-btn--text" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&#8592; ${gettext('Precedent')}</button>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button class="page-btn page-btn--text" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">${gettext('Suivant')} &#8594;</button>`;

    container.innerHTML = html;
    container.querySelectorAll('.page-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        renderPage();
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ── FILTRES CATEGORIE ──
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      currentPage = 1;
      renderPage();
    });
  });

  // ── RECHERCHE ──
  const kwInput = document.getElementById('searchKeyword');
  const locInput = document.getElementById('searchLocation');

  if (kwInput) {
    kwInput.addEventListener('input', () => {
      searchKeyword = kwInput.value;
      currentPage = 1;
      renderPage();
    });
  }
  if (locInput) {
    locInput.addEventListener('input', () => {
      searchLocation = locInput.value;
      currentPage = 1;
      renderPage();
    });
  }

  // ── PARAMETRES URL ──
  const params = new URLSearchParams(window.location.search);
  if (params.get('q') && kwInput) {
    kwInput.value = params.get('q');
    searchKeyword = params.get('q');
  }
  if (params.get('loc') && locInput) {
    locInput.value = params.get('loc');
    searchLocation = params.get('loc');
  }

  renderPage();

  // ── BOUTONS POSTULER ──
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.job-apply-btn');
    if (!btn || btn.disabled) return;

    const item = btn.closest('.job-item');
    const expired = item && item.classList.contains('job-expired');

    const jobData = {
      id:          btn.dataset.jobId       || '',
      title:       btn.dataset.jobTitle    || '',
      company:     btn.dataset.jobCompany  || '',
      location:    btn.dataset.jobLocation || '',
      salary:      btn.dataset.jobSalary   || '',
      description: btn.dataset.jobDescription || '',
      expired:     expired
    };

    if (window.appModal) window.appModal.open(jobData);
  });

  // Bouton candidature spontanee
  const spontBtn = document.getElementById('spontaneousBtn');
  if (spontBtn) {
    spontBtn.addEventListener('click', () => {
      const jobData = {
        id:          spontBtn.dataset.jobId || '',
        title:       spontBtn.dataset.jobTitle || gettext('Candidature spontanee'),
        company:     spontBtn.dataset.jobCompany || gettext('Revival Tech'),
        location:    spontBtn.dataset.jobLocation || '',
        salary:      '',
        description: spontBtn.dataset.jobDescription || '',
        expired:     false
      };
      if (window.appModal) window.appModal.open(jobData);
    });
  }

  // ── SLIDER PARTENAIRES ──
  (function () {
    const track = document.getElementById('partnersTrack');
    const dotsEl = document.getElementById('partnersDots');
    const prevBtn = document.getElementById('partnersPrev');
    const nextBtn = document.getElementById('partnersNext');
    if (!track) return;

    const slides = track.querySelectorAll('.partners-slide');
    const total = slides.length;
    let current = 0;
    let autoTimer = null;
    const isMobile = () => window.innerWidth < 768;

    // Build dots
    if (dotsEl) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'partners-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', gettext('Slide') + ' ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsEl.appendChild(dot);
      });
    }

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsEl && dotsEl.querySelectorAll('.partners-dot').forEach((d, i) => d.classList.toggle('active', i === current));

      // Mobile: show 1 card per slide
      if (isMobile()) {
        slides.forEach((slide, si) => {
          const cards = slide.querySelectorAll('.partner-card');
          cards.forEach((card, ci) => {
            card.style.display = (si === current) ? 'flex' : 'none';
          });
        });
      } else {
        slides.forEach(slide => {
          slide.querySelectorAll('.partner-card').forEach(c => { c.style.display = 'flex'; });
        });
      }
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    window.addEventListener('resize', () => goTo(current));
    goTo(0);
    resetAuto();
  })();

  // ── COOKIE CONSENT ──
  (function () {
    const popup = document.getElementById('cookiePopup');
    if (!popup) return;

    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(() => popup.classList.add('visible'), 2500);
    }

    document.getElementById('cookieAccept') && document.getElementById('cookieAccept').addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      popup.classList.remove('visible');
    });

    document.getElementById('cookieRefuse') && document.getElementById('cookieRefuse').addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'refused');
      popup.classList.remove('visible');
    });
  })();

});
