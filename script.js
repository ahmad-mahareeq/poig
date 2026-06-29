/* ============================================
   POIG — Main Script (Firestore + Local Fallback)
   ============================================ */

// --- Nav Scroll Effect ---
const nav = document.querySelector('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// --- Mobile Nav Toggle ---
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// --- Intersection Observer for scroll reveals ---
document.querySelectorAll('.section, .stats-bar').forEach(el => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  obs.observe(el);
});

// --- Counter Animation ---
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  if (isNaN(target) || target === 0) {
    el.textContent = target === 0 ? '0' : '\u221E';
    return;
  }
  const duration = 2000;
  const startTime = performance.now();
  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(easeOut * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

let statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// --- Parallax tilt on hero logo ---
const heroLogo = document.querySelector('.hero-logo');
if (heroLogo) {
  heroLogo.addEventListener('mousemove', (e) => {
    const rect = heroLogo.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    heroLogo.style.transform = `perspective(600px) rotateX(${(y - centerY) / 20}deg) rotateY(${(centerX - x) / 20}deg) scale3d(1.05, 1.05, 1.05)`;
  });
  heroLogo.addEventListener('mouseleave', () => {
    heroLogo.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// ========================================
// DATA LAYER — Firestore + Local Fallback
// ========================================

const COLLECTIONS = {
  coreTeam: 'coreTeam',
  activeTeam: 'activeTeam',
  activities: 'activities',
  events: 'events',
  news: 'news',
  pageContent: 'pageContent'
};

const INITIALS_COLORS = [
  'linear-gradient(135deg, #421B61, #6a2ba8)',
  'linear-gradient(135deg, #FE6F03, #ff9a44)',
  'linear-gradient(135deg, #421B61, #7d3fc1)',
  'linear-gradient(135deg, #FE6F03, #ff7a33)',
  'linear-gradient(135deg, #421B61, #5a2a8f)',
];

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length];
}

const DEFAULT_DATA = {
  coreTeam: [
    { id: 'c1', name: 'Mariam Alqam', role: 'Core Team Member', photo: '' },
    { id: 'c2', name: 'Ahmad Mahareeq', role: 'Research Coordinator', photo: '' },
    { id: 'c3', name: 'Asmaa Sarama', role: 'Core Team Member', photo: '' },
    { id: 'c4', name: 'Hala Salem', role: 'Core Team Member', photo: '' },
    { id: 'c5', name: 'Husam Abu Dawood', role: 'Core Team Member', photo: '' },
    { id: 'c6', name: 'Weam Shalabi', role: 'Core Team Member', photo: '' },
  ],
  activeTeam: [
    { id: 'a1', name: 'Ayham Slimi', role: '', photo: '' },
    { id: 'a2', name: 'Hala Zahaika', role: '', photo: '' },
    { id: 'a3', name: 'Hamzeh Safadi', role: '', photo: '' },
    { id: 'a4', name: 'Lana Helal', role: '', photo: '' },
    { id: 'a5', name: 'Lubna Abusamra', role: '', photo: '' },
    { id: 'a6', name: 'Qais Salahat', role: '', photo: '' },
    { id: 'a7', name: 'Renad Omar Ali Atwan', role: '', photo: '' },
    { id: 'a8', name: 'Salma Abuallan', role: '', photo: '' },
    { id: 'a9', name: 'Sarah Ayyad', role: '', photo: '' },
    { id: 'a10', name: 'Shahad Abu Ahmad', role: '', photo: '' },
    { id: 'a11', name: 'Wisam Alrai', role: '', photo: '' },
    { id: 'a12', name: 'Yazan AlHabil', role: '', photo: '' },
    { id: 'a13', name: 'Yazeed Awawdeh', role: '', photo: '' },
    { id: 'a14', name: 'Zaineh Saleh', role: '', photo: '' },
  ],
  activities: [
    {
      id: 'act1', title: "International Women's Day", date: 'March 8, 2025',
      time: '', place: 'Online via Zoom', shortDescription: 'Organized 2 inspiring sessions with Dr. Sameeha and Dr. Salam, who shared their remarkable journeys in ophthalmology.',
      fullDescription: 'Two inspiring sessions celebrating women in ophthalmology. Speakers shared their personal and professional journeys, highlighting challenges and achievements in the field.',
      photos: []
    },
    {
      id: 'act2', title: 'World Optometry Day', date: 'March 27, 2025',
      time: '', place: 'Online via Zoom',
      shortDescription: 'Session 1: Ala\'a and Dr. Reem — "Eye to Eye: Bridging Between Optometry and Ophthalmology". Session 2: Ibrahim and Optom. Yousef — "Discovering the Spectrum of Optometry".',
      fullDescription: 'Session 1: Ala\'a and Dr. Reem discussed the collaboration between optometry and ophthalmology.<br>Session 2: Ibrahim and Optom. Yousef explored the diverse spectrum of optometry practice.',
      photos: []
    }
  ],
  events: [],
  news: [
    {
      id: 'n1', title: 'Research Achievements',
      description: 'Latest research acceptances and publications from our team will be showcased here. Stay tuned for our upcoming academic contributions to the field of ophthalmology.',
      mainPhoto: '', extraPhotos: []
    }
  ]
};

const DEFAULT_PAGE_CONTENT = {
  heroTitle: 'Palestinian Ophthalmology Interest Group',
  heroSubtitle: 'Advancing clinical research, medical education, and eye-health awareness in Palestine.',
  aboutTitle: 'Who We Are',
  aboutDescription: 'We are a group of enthusiastic medical students passionate about ophthalmology, dedicated to fostering interest and knowledge in eye care among Palestinian students.',
  stats: [
    { number: '50', suffix: '+', label: 'Active Members' },
    { number: '10', suffix: '+', label: 'Events Organized' },
    { number: '5', suffix: '+', label: 'Research Projects' },
    { number: '100', suffix: '%', label: 'Dedication' }
  ],
  social: {
    instagram: 'https://www.instagram.com/poig.palestine/',
    linkedin: 'https://www.linkedin.com/company/poig',
    email: 'poig.palestine@gmail.com'
  },
  footerText: '\u00a9 2025 Palestinian Ophthalmology Interest Group. All rights reserved.'
};

// In-memory data store (populated from Firestore or defaults)
let siteData = {};

// Firestore via same-origin proxy (bypasses Safari ITP)
const FS_PROXY = '/api/firestore';

function fsVal(v) {
  const t = Object.keys(v)[0];
  if (t === 'stringValue') return v.stringValue;
  if (t === 'integerValue') return parseInt(v.integerValue, 10);
  if (t === 'doubleValue') return parseFloat(v.doubleValue);
  if (t === 'booleanValue') return v.booleanValue;
  if (t === 'arrayValue') return (v.arrayValue.values || []).map(fsVal);
  if (t === 'mapValue') { const o = {}; for (const [k, f] of Object.entries(v.mapValue.fields || {})) o[k] = fsVal(f); return o; }
  return null;
}

// localStorage cache layer
function cachePut(key, data) {
  try {
    if (data && Array.isArray(data) && data.length === 0) {
      localStorage.removeItem('poig_' + key);
    } else {
      localStorage.setItem('poig_' + key, JSON.stringify(data));
    }
  } catch (e) { /* quota */ }
}
function cacheGet(key) {
  try {
    const v = localStorage.getItem('poig_' + key);
    return v ? JSON.parse(v) : null;
  } catch (e) { return null; }
}

// Loads instantly from cache or defaults, then Firestore syncs in background
function loadFromCacheOrDefaults() {
  siteData.coreTeam = cacheGet(COLLECTIONS.coreTeam) || DEFAULT_DATA.coreTeam;
  siteData.activeTeam = cacheGet(COLLECTIONS.activeTeam) || DEFAULT_DATA.activeTeam;
  siteData.activities = cacheGet(COLLECTIONS.activities) || DEFAULT_DATA.activities;
  siteData.events = cacheGet(COLLECTIONS.events) || DEFAULT_DATA.events;
  siteData.news = cacheGet(COLLECTIONS.news) || DEFAULT_DATA.news;
  siteData.pageContent = cacheGet('pageContent') || DEFAULT_PAGE_CONTENT;
}

function cacheSiteData() {
  cachePut(COLLECTIONS.coreTeam, siteData.coreTeam);
  cachePut(COLLECTIONS.activeTeam, siteData.activeTeam);
  cachePut(COLLECTIONS.activities, siteData.activities);
  cachePut(COLLECTIONS.events, siteData.events);
  cachePut(COLLECTIONS.news, siteData.news);
  cachePut('pageContent', siteData.pageContent);
}

async function fetchCollection(name, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${FS_PROXY}?collection=${name}`, {
      signal: controller.signal
    });
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map(d => {
      const item = { id: d.name.split('/').pop() };
      for (const [k, v] of Object.entries(d.fields || {})) item[k] = fsVal(v);
      return item;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPageContent(timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${FS_PROXY}?collection=pageContent&doc=main`, {
      signal: controller.signal
    });
    if (res.status === 404) return {};
    const data = await res.json();
    const obj = {};
    for (const [k, v] of Object.entries(data.fields || {})) obj[k] = fsVal(v);
    return obj;
  } finally {
    clearTimeout(timer);
  }
}

function formatHeroTitle(text) {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length === 1) return words[0];
  if (words.length === 2) return words[0] + '<br><span class="gradient-text">' + words[1] + '</span>';
  return words[0] + '<br><span class="gradient-text">' + words[1] + '</span><br>' + words.slice(2).join(' ');
}

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderPageContent() {
  const c = siteData.pageContent;

  const heroTitleEl = document.getElementById('heroTitle');
  if (heroTitleEl) heroTitleEl.innerHTML = formatHeroTitle(c.heroTitle || DEFAULT_PAGE_CONTENT.heroTitle);

  const heroSubtitleEl = document.getElementById('heroSubtitle');
  if (heroSubtitleEl) heroSubtitleEl.textContent = c.heroSubtitle || DEFAULT_PAGE_CONTENT.heroSubtitle;

  const aboutSubtitleEl = document.getElementById('aboutSubtitle');
  if (aboutSubtitleEl) aboutSubtitleEl.textContent = c.aboutTitle || DEFAULT_PAGE_CONTENT.aboutTitle;

  const aboutTitleEl = document.getElementById('aboutTitle');
  if (aboutTitleEl) aboutTitleEl.innerHTML = (c.aboutTitle || DEFAULT_PAGE_CONTENT.aboutTitle) + ' <span class="gradient-text">POIG</span>';

  const aboutDescEl = document.getElementById('aboutDescription');
  if (aboutDescEl) aboutDescEl.textContent = c.aboutDescription || DEFAULT_PAGE_CONTENT.aboutDescription;

  const stats = c.stats && c.stats.length ? c.stats : DEFAULT_PAGE_CONTENT.stats;
  const statsBar = document.getElementById('statsBar');
  if (statsBar) {
    statsBar.innerHTML = stats.map(s => `
      <div class="stat-item">
        <span class="stat-number" data-target="${s.number}">0</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');
    statNumbers = document.querySelectorAll('.stat-number');
    countersStarted = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statNumbers.forEach(num => animateCounter(num));
        }
      });
    }, { threshold: 0.3 });
    obs.observe(statsBar);
  }

  const socialLinks = document.getElementById('socialLinks');
  if (socialLinks && c.social) {
    const insta = socialLinks.querySelector('a[href*="instagram"]');
    if (insta && c.social.instagram) insta.href = c.social.instagram;
    const linkedin = socialLinks.querySelector('a[href*="linkedin"]');
    if (linkedin && c.social.linkedin) linkedin.href = c.social.linkedin;
  }

  const contactEmail = document.getElementById('contactEmail');
  if (contactEmail && c.social && c.social.email) {
    contactEmail.innerHTML = '<i class="fas fa-envelope"></i> ' + c.social.email;
    contactEmail.onclick = function(e) {
      e.preventDefault();
      const email = c.social.email;
      navigator.clipboard.writeText(email).then(() => {
        let badge = contactEmail.querySelector('.copy-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'copy-badge';
          badge.textContent = 'Copied!';
          contactEmail.appendChild(badge);
        }
        badge.classList.remove('show');
        void badge.offsetWidth;
        badge.classList.add('show');
        setTimeout(() => badge.classList.remove('show'), 1500);
      }).catch(() => {
        window.open('mailto:' + email);
      });
    };
  }

  const footerText = document.getElementById('footerText');
  if (footerText && c.footerText) footerText.textContent = c.footerText;
}

function renderTeam() {
  const core = siteData.coreTeam;
  const active = siteData.activeTeam;

  const coreGrid = document.getElementById('coreTeamGrid');
  const activeGrid = document.getElementById('activeTeamGrid');
  if (!coreGrid || !activeGrid) return;

  coreGrid.innerHTML = core.map(m => teamCardHTML(m)).join('');
  activeGrid.innerHTML = active.map(m => teamCardHTML(m)).join('');

  document.querySelectorAll('.team-photo').forEach(img => {
    img.addEventListener('error', function() { this.style.display = 'none'; });
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      img.style.display = 'none';
    }
  });
}

function teamCardHTML(m) {
  const initials = getInitials(m.name);
  const color = getColor(m.name);
  return `
    <div class="glass-card team-card">
      <div class="team-avatar">
        ${m.photo ? `<img src="${m.photo}" alt="${m.name}" class="team-photo" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="avatar-placeholder" style="background: ${color};">${initials}</div>
      </div>
      <h4>${m.name}</h4>
      ${m.role ? `<p>${m.role}</p>` : ''}
    </div>
  `;
}

function renderActivities() {
  const grid = document.getElementById('activitiesGrid');
  if (!grid) return;
  const items = siteData.activities;
  grid.innerHTML = items.map(a => activityCardHTML(a)).join('');

  document.querySelectorAll('[data-expandable]').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('expanded'));
  });
}

function activityCardHTML(a) {
  const monthYear = a.date ? new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';
  const datetimeStr = [a.date, a.place].filter(Boolean).join(' · ');
  return `
    <div class="glass-card activity-card" data-expandable>
      <div class="activity-preview">
        ${monthYear ? `<div class="activity-date">${monthYear}</div>` : ''}
        <div class="activity-icon"><i class="fas fa-calendar-alt"></i></div>
        <h3>${a.title}</h3>
        ${datetimeStr ? `<div class="activity-datetime"><i class="fas fa-clock"></i> ${datetimeStr}</div>` : ''}
        <p>${a.shortDescription || ''}</p>
        <span class="activity-expand-hint"><i class="fas fa-chevron-down"></i> Click for details</span>
      </div>
      <div class="activity-details">
        ${a.fullDescription ? `<p>${a.fullDescription}</p>` : ''}
        ${a.photos && a.photos.length ? `
          <div class="activity-photos">
            ${a.photos.map(p => `<img src="${p}" class="activity-photo" alt="" loading="lazy" onerror="this.style.display='none'">`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  const items = siteData.events;

  if (!items.length) {
    grid.innerHTML = `
      <div class="glass-card event-card" style="grid-column:1/-1;max-width:550px;margin:0 auto;">
        <div class="event-icon"><i class="fas fa-calendar-alt"></i></div>
        <h3>No Upcoming Events</h3>
        <p class="event-desc">Check back soon for upcoming events.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(e => `
    <div class="glass-card event-card">
      <div class="event-icon"><i class="fas fa-calendar-alt"></i></div>
      <h3>${e.title}</h3>
      ${e.date || e.place ? `<div class="event-datetime"><i class="fas fa-clock"></i> ${[e.date, e.time, e.place].filter(Boolean).join(' · ')}</div>` : ''}
      ${e.description ? `<p class="event-desc">${e.description}</p>` : ''}
      ${e.registrationLink ? `<a href="${e.registrationLink}" target="_blank" class="btn btn-primary btn-sm"><i class="fas fa-clipboard-list"></i> Register Now</a>` : ''}
    </div>
  `).join('');
}

function renderNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  const items = siteData.news;

  grid.innerHTML = items.map((n, i) => {
    const mains = n.mainPhotos && n.mainPhotos.length ? n.mainPhotos : (n.mainPhoto ? [n.mainPhoto] : []);
    return `
    <div class="glass-card news-card${i === 0 ? ' active' : ''}">
      ${mains.length ? `<img src="${mains[0]}" alt="${n.title}" class="news-card-main-photo" loading="lazy" onerror="this.style.display='none'">` : ''}
      ${mains.length > 1 ? `<div class="news-card-thumbs">${mains.slice(1).map(p => `<img src="${p}" alt="" loading="lazy" onerror="this.style.display='none'">`).join('')}</div>` : ''}
      <div class="news-card-body">
        <h3>${n.title}</h3>
        <p>${n.description}</p>
        ${n.extraPhotos && n.extraPhotos.length ? `
          <div class="activity-photos" style="margin-top:16px;">
            ${n.extraPhotos.map(p => `<img src="${p}" class="activity-photo" alt="" loading="lazy" onerror="this.style.display='none'">`).join('')}
          </div>
        ` : ''}
      </div>
    </div>`;
  }).join('');

  initCarousel();
}

let carouselTimer = null;
let currentSlide = 0;

function initCarousel() {
  const newsGrid = document.getElementById('newsGrid');
  const cards = document.querySelectorAll('#newsGrid > .news-card');
  const dotsContainer = document.getElementById('newsDots');
  const prevBtn = document.getElementById('newsPrev');
  const nextBtn = document.getElementById('newsNext');

  if (!cards.length || !dotsContainer || !prevBtn || !nextBtn || !newsGrid) {
    return;
  }

  if (carouselTimer) clearInterval(carouselTimer);

  cards.forEach((c, i) => {
    c.classList.toggle('active', i === 0);
  });

  dotsContainer.innerHTML = cards.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`
  ).join('');

  currentSlide = 0;

  dotsContainer.addEventListener('click', e => {
    const dot = e.target.closest('.carousel-dot');
    if (dot) goToSlide(parseInt(dot.dataset.index));
  });

  carouselTimer = setInterval(nextSlide, 15000);
}

function goToSlide(index) {
  const cards = document.querySelectorAll('#newsGrid > .news-card');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!cards.length) return;
  currentSlide = (index + cards.length) % cards.length;
  cards.forEach((c, i) => c.classList.toggle('active', i === currentSlide));
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function resetTimer() {
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = setInterval(nextSlide, 15000); }
}

// ========================================
// PHOTO PREVIEW (lightbox)
// ========================================

let previewEl = null;

function openPhotoPreview(src) {
  if (!previewEl) {
    previewEl = document.createElement('div');
    previewEl.className = 'photo-preview-overlay';
    previewEl.innerHTML = '<span class="photo-preview-close">&times;</span><img src="" alt="" class="photo-preview-img">';
    previewEl.addEventListener('click', e => {
      if (e.target === previewEl || e.target.classList.contains('photo-preview-close')) closePhotoPreview();
    });
    document.body.appendChild(previewEl);
  }
  previewEl.querySelector('img').src = src;
  previewEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePhotoPreview() {
  if (previewEl) previewEl.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const img = e.target.closest('.activity-photo, .news-card-main-photo, .news-card-thumbs img, .team-photo');
  if (img && img.tagName === 'IMG' && img.src) openPhotoPreview(img.src);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePhotoPreview();
});

// ========================================
// INIT
// ========================================

async function init() {
  // Phase 1 — instant render from cache or defaults
  loadFromCacheOrDefaults();
  renderAllNow();

  // Phase 2 — background Firestore sync
  try {
    const [coreTeam, activeTeam, activities, events, news, pageContent] = await Promise.all([
      fetchCollection(COLLECTIONS.coreTeam).catch(() => null),
      fetchCollection(COLLECTIONS.activeTeam).catch(() => null),
      fetchCollection(COLLECTIONS.activities).catch(() => null),
      fetchCollection(COLLECTIONS.events).catch(() => null),
      fetchCollection(COLLECTIONS.news).catch(() => null),
      fetchPageContent().catch(() => null)
    ]);
    const gotData = coreTeam || activeTeam || activities || events || news || pageContent;
    if (gotData) {
      if (coreTeam) siteData.coreTeam = coreTeam;
      if (activeTeam) siteData.activeTeam = activeTeam;
      if (activities) siteData.activities = activities;
      if (events) siteData.events = events;
      if (news) siteData.news = news;
      if (pageContent) siteData.pageContent = pageContent;
      cacheSiteData();
      renderAllNow();
    }
  } catch (e) { /* Firestore unavailable */ }
}

function renderAllNow() {
  renderPageContent();
  renderTeam();
  renderActivities();
  renderEvents();
  renderNews();
}

init();
