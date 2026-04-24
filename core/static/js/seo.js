/**
 * seo.js — Revival Agency
 * Optimisations SEO dynamiques : breadcrumb, preload, performance
 */

(function () {
  'use strict';

  /* ─── 1. BREADCRUMB SCHEMA ─────────────────────────────────────── */
  function buildBreadcrumb() {
    const path = window.location.pathname;
    const host = 'https://revival-business.com';

    const pageMap = {
      '/':                    gettext('Accueil'),
      '/index.html':          gettext('Accueil'),
      '/about.html':          gettext('À propos'),
      '/solutions.html':      gettext('Solutions'),
      '/portfolio.html':      gettext('Portfolio'),
      '/partenaire.html':     gettext('Partenaire'),
      '/politique-confidentialite.html': gettext('Politique de confidentialité'),
      '/conditions-partenariat.html': gettext('Conditions de partenariat'),
      '/contact.html':        gettext('Contact'),
      '/blog.html':           gettext('Blog'),
      '/careers.html':        gettext('Carrières'),
      '/videos.html':         gettext('Vidéos'),
      '/articles/avenir-digital-rdc.html':    gettext("L'avenir du digital en RDC"),
      '/articles/cybersecurite.html':         gettext('Cybersécurité'),
      '/articles/digitaliser-pme-2026.html':  gettext('Digitaliser sa PME en 2026'),
      '/articles/ecomnex.html':               gettext('Ecomnex'),
      '/articles/freela.html':                gettext('Freela'),
      '/articles/kulatable.html':             gettext('Kulatable'),
      '/articles/poshub.html':                gettext('PosHub'),
    };

    const currentName = pageMap[path] || document.title.split('—')[0].trim();
    const isArticle   = path.startsWith('/articles/');

    const items = [
      { "@type": "ListItem", "position": 1, "name": gettext('Accueil'), "item": host + "/" }
    ];

    if (isArticle) {
      items.push({ "@type": "ListItem", "position": 2, "name": gettext('Blog'), "item": host + "/blog.html" });
      items.push({ "@type": "ListItem", "position": 3, "name": currentName, "item": host + path });
    } else if (path !== '/' && path !== '/index.html') {
      items.push({ "@type": "ListItem", "position": 2, "name": currentName, "item": host + path });
    }

    if (items.length > 1) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
      });
      document.head.appendChild(script);
    }
  }

  /* ─── 2. PRELOAD HERO IMAGE ────────────────────────────────────── */
  function preloadHeroImage() {
    const heroImg = document.querySelector('.hero-slide.active img, .partner-hero img, .pf-hero img');
    if (heroImg && heroImg.src) {
      const link = document.createElement('link');
      link.rel  = 'preload';
      link.as   = 'image';
      link.href = heroImg.src;
      document.head.insertBefore(link, document.head.firstChild);
    }
  }

  /* ─── 3. LAZY LOADING IMAGES ───────────────────────────────────── */
  function addLazyLoading() {
    const imgs = document.querySelectorAll('img:not([loading])');
    imgs.forEach(function (img, i) {
      // Les 3 premières images sont eager (above the fold)
      img.loading = i < 3 ? 'eager' : 'lazy';
      // Ajouter decoding async pour les images non critiques
      if (i >= 3) img.decoding = 'async';
    });
  }

  /* ─── 4. OPEN GRAPH IMAGE FALLBACK ────────────────────────────── */
  function ensureOgImage() {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', 'https://revival-business.com/logo/banner.png');
      document.head.appendChild(meta);
    }
  }

  /* ─── 5. CANONICAL AUTO-FIX ───────────────────────────────────── */
  function ensureCanonical() {
    const existing = document.querySelector('link[rel="canonical"]');
    if (!existing) {
      const link = document.createElement('link');
      link.rel  = 'canonical';
      link.href = window.location.origin + window.location.pathname;
      document.head.appendChild(link);
    }
  }

  /* ─── 6. PERFORMANCE — DNS PREFETCH ───────────────────────────── */
  function addDnsPrefetch() {
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com'
    ];
    domains.forEach(function (domain) {
      if (!document.querySelector('link[rel="dns-prefetch"][href="' + domain + '"]')) {
        const link = document.createElement('link');
        link.rel  = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });
  }

  /* ─── 7. INIT ──────────────────────────────────────────────────── */
  function init() {
    buildBreadcrumb();
    ensureOgImage();
    ensureCanonical();
    addDnsPrefetch();
    // Attendre le DOM pour les images
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        preloadHeroImage();
        addLazyLoading();
      });
    } else {
      preloadHeroImage();
      addLazyLoading();
    }
  }

  init();

})();
