/* ══════════════════════════════════════════════════
    CHEZ J&J — Application JS
    Navigation · Horaires live · Tracking · RGPD
══════════════════════════════════════════════════ */

'use strict';

/* ── CONFIG ──────────────────────────────────────── */
const CONFIG = {
    phone: '+33766342848',
    googleMapsUrl: 'https://maps.google.com/?q=Chez+J%26J+Villeneuve-les-Beziers',
    googleReviewUrl: 'https://g.page/r/VOTRE_CODE_ICI/review',
    whatsapp: 'https://wa.me/33766342848',
    ga4Id: 'G-XXXXXXXXXX', // Remplacer par votre vrai ID GA4
    horaires: {
        // [ouverture, fermeture] en minutes depuis minuit (null = fermé)
        0: null,          // Dimanche
        1: [660, 870],    // Lundi     11h00 – 14h30
        2: [660, 870],    // Mardi
        3: [660, 870],    // Mercredi
        4: [660, 870],    // Jeudi
        5: [660, 870],    // Vendredi
        6: null,          // Samedi
    }
};

/* ── ROUTER SPA ──────────────────────────────────── */
const PAGES = ['accueil', 'menu', 'prestations', 'avis', 'satisfaction', 'merci-avis', 'merci-feedback',
    'contact', 'mentions-legales', 'confidentialite', 'allergenes', '404'];

function navigate(pageId, pushState = true) {
    // Valider la page
    const target = PAGES.includes(pageId) ? pageId : '404';

    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Afficher la cible
    const el = document.getElementById(`page-${target}`);
    if (el) el.classList.add('active');

    // Mettre à jour la nav active
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navLink = document.querySelector(`.nav-link[href="#${target}"]`);
    if (navLink) navLink.classList.add('active');

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Historique navigateur
    if (pushState) {
        history.pushState({ page: target }, '', `#${target}`);
    }

    // Tracking page view
    trackPageView(target);
}

// Gestion bouton retour navigateur
window.addEventListener('popstate', (e) => {
    const page = (e.state && e.state.page) || 'accueil';
    navigate(page, false);
});

// Init : lire le hash au chargement
function initRouter() {
    const hash = location.hash.replace('#', '') || 'accueil';
    navigate(hash, false);
}


/* ── HORAIRES LIVE ──────────────────────────────── */
function checkHoraires() {
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const horaire = CONFIG.horaires[day];

    const badge = document.getElementById('horaire-badge');
    const dot = document.getElementById('horaire-dot');
    const text = document.getElementById('horaire-text');
    const statusLive = document.getElementById('status-live');

    let isOpen = false;
    let message = '';

    if (horaire && minutes >= horaire[0] && minutes < horaire[1]) {
        isOpen = true;
        const ferme = `${Math.floor(horaire[1] / 60)}h${String(horaire[1] % 60).padStart(2, '0')}`;
        message = `Ouvert · Ferme à ${ferme}`;
    } else if (horaire) {
        const ouvre = `${Math.floor(horaire[0] / 60)}h${String(horaire[0] % 60).padStart(2, '0')}`;
        message = minutes < horaire[0]
            ? `Ouvre à ${ouvre} aujourd'hui`
            : 'Fermé · Ouvre lundi à 11h';
    } else {
        message = 'Fermé aujourd\'hui';
    }

    if (dot) { dot.className = `dot ${isOpen ? 'open' : 'closed'}`; }
    if (text) { text.textContent = message; }

    if (statusLive) {
        statusLive.className = `status-live ${isOpen ? 'open' : 'closed'}`;
        statusLive.textContent = isOpen ? '🟢 Ouvert maintenant' : '🔴 Actuellement fermé';
    }
}


/* ── MENU FILTRES ───────────────────────────────── */
function filterMenu(cat, btn) {
    // Boutons actifs
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Items
    document.querySelectorAll('.menu-item, .menu-section-title').forEach(el => {
        if (cat === 'all' || el.dataset.cat === cat) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });
}

function filterAllergens() {
    const checked = Array.from(document.querySelectorAll('.allergen-checkboxes input:checked'))
        .map(el => el.value);

    if (checked.length === 0) {
        document.querySelectorAll('.menu-item').forEach(el => el.style.display = '');
        return;
    }

    document.querySelectorAll('.menu-item').forEach(el => {
        const allergens = (el.dataset.allergens || '').split(',');
        const hasConflict = checked.some(c => allergens.includes(c));
        el.style.display = hasConflict ? 'none' : '';
    });
}


/* ── FUNNEL PILOTON ─────────────────────────────── */
let selectedStars = 0;

function selectStar(val) {
    selectedStars = val;

    // Colorier les étoiles
    document.querySelectorAll('.star-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i < val);
    });

    const msg = document.getElementById('satisfaction-msg');
    const action = document.getElementById('satisfaction-action');
    const btnAction = document.getElementById('satisfaction-btn');
    const feedbackForm = document.getElementById('feedback-form');

    msg.classList.remove('hidden');
    action.classList.remove('hidden');
    feedbackForm.classList.add('hidden');

    if (val >= 4) {
        msg.textContent = '😊 Super ! On est ravis que vous ayez apprécié votre repas.';
        btnAction.textContent = '⭐ Partager sur Google';
    } else {
        msg.textContent = '😔 Nous sommes désolés que votre expérience n\'ait pas été parfaite.';
        btnAction.textContent = '💬 Nous expliquer ce qui n\'a pas été';
    }
}

function submitSatisfaction() {
    if (selectedStars === 0) return;

    trackEvent('satisfaction_submit', { stars: selectedStars });

    if (selectedStars >= 4) {
        // Redirection vers Google Reviews
        window.open(CONFIG.googleReviewUrl, '_blank');
        navigate('merci-avis');
    } else {
        // Afficher le formulaire de feedback privé
        document.getElementById('satisfaction-action').classList.add('hidden');
        document.getElementById('feedback-form').classList.remove('hidden');
    }
}

function submitFeedback() {
    const text = document.getElementById('feedback-text')?.value;
    const email = document.getElementById('feedback-email')?.value;

    if (!text || text.trim().length < 5) {
        alert('Merci de décrire votre expérience.');
        return;
    }

    trackEvent('feedback_private_submit', { stars: selectedStars });

    // Ici : envoyer vers votre backend / Piloton API
    console.log('Feedback privé reçu :', { stars: selectedStars, text, email });

    navigate('merci-feedback');
}


/* ── CONTACT FORM ───────────────────────────────── */
function submitContact(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    trackEvent('contact_form_submit');

    // Ici : envoyer vers votre backend
    form.style.display = 'none';
    const success = document.getElementById('contact-success');
    if (success) success.classList.remove('hidden');
}


/* ── TRACKING GA4 ───────────────────────────────── */
function trackEvent(eventName, params = {}) {
    if (window.gtag) {
        gtag('event', eventName, {
            ...params,
            page_location: location.href,
            page_title: document.title
        });
    }
    // Debug en console
    console.debug(`[Track] ${eventName}`, params);
}

function trackPageView(page) {
    if (window.gtag) {
        gtag('config', CONFIG.ga4Id, {
            page_path: `/#${page}`,
            page_title: `Chez J&J - ${page}`
        });
    }
}

// Scroll depth tracking
let scrollMilestones = { 25: false, 50: false, 75: false, 90: false };
function trackScrollDepth() {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = Math.round((scrolled / total) * 100);

    [25, 50, 75, 90].forEach(m => {
        if (pct >= m && !scrollMilestones[m]) {
            scrollMilestones[m] = true;
            trackEvent('scroll_depth', { depth: m });
        }
    });
}
window.addEventListener('scroll', trackScrollDepth, { passive: true });


/* ── MOBILE MENU ────────────────────────────────── */
function toggleMenu() {
    const nav = document.getElementById('mobile-nav');
    if (nav) nav.classList.toggle('hidden');
}
// Fermer en cliquant dehors
document.addEventListener('click', (e) => {
    const nav = document.getElementById('mobile-nav');
    const burger = document.querySelector('.burger');
    if (nav && !nav.contains(e.target) && !burger?.contains(e.target)) {
        nav.classList.add('hidden');
    }
});


/* ── RGPD ───────────────────────────────────────── */
function initRGPD() {
    const consent = localStorage.getItem('rgpd_consent');
    if (!consent) {
        setTimeout(() => {
            const banner = document.getElementById('rgpd-banner');
            if (banner) banner.classList.remove('hidden');
        }, 1500);
    } else if (consent === 'accepted') {
        loadGA4();
    }
}

function acceptCookies() {
    localStorage.setItem('rgpd_consent', 'accepted');
    document.getElementById('rgpd-banner')?.classList.add('hidden');
    loadGA4();
    trackEvent('cookie_accept');
}

function refuseCookies() {
    localStorage.setItem('rgpd_consent', 'refused');
    document.getElementById('rgpd-banner')?.classList.add('hidden');
}

function loadGA4() {
    if (document.getElementById('ga4-script')) return;
    const s1 = document.createElement('script');
    s1.id = 'ga4-script';
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4Id}`;
    document.head.appendChild(s1);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CONFIG.ga4Id, { anonymize_ip: true });
}


/* ── HEADER SCROLL EFFECT ───────────────────────── */
let lastScrollY = 0;
function handleHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    const y = window.scrollY;
    if (y > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
    } else {
        header.style.boxShadow = '';
    }
    lastScrollY = y;
}
window.addEventListener('scroll', handleHeaderScroll, { passive: true });


/* ── INTERSECTION OBSERVER — animations au scroll ── */
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    const targets = document.querySelectorAll([
        '.best-card',
        '.formule-card',
        '.diff-card',
        '.quote-card',
        '.contact-card',
        '.avis-card',
        '.avis-card-full'
    ].join(', '));

    targets.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
        observer.observe(el);
    });
}


/* ── INITIALISATION ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    checkHoraires();
    initRGPD();
    initScrollAnimations();

    // Rafraîchir l'état horaires toutes les minutes
    setInterval(checkHoraires, 60 * 1000);

    // Reset scroll milestones à chaque changement de page
    window.addEventListener('popstate', () => {
        scrollMilestones = { 25: false, 50: false, 75: false, 90: false };
    });

    // ── Service Worker PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => { });
    }

    console.log('Chez J&J — vitrine chargée');
});
