/* ══════════════════════════════════════════════════
   CHEZ J&J — Service Worker v2
   Cache utile · PWA · Revisites rapides
══════════════════════════════════════════════════ */

const CACHE_VERSION = 'chezjandj-v2';

const PRECACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/images/logo_chez_j_and_j.png',
    '/images/food_truck_chez_j&j_tacos.webp',
    '/images/food_truck_chez_j&j_buger_steak.webp',
    '/images/food_truck_chez_j&j_menu_panini.webp',
    '/images/food_truck_chez_j&j_camion_gros_plan.webp'
];

// ── INSTALL : pré-cache des assets critiques
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

// ── ACTIVATE : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ── FETCH
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer non-GET
    if (request.method !== 'GET') return;

    // Ignorer analytics et maps
    if (url.hostname.includes('google-analytics') ||
        url.hostname.includes('googletagmanager') ||
        url.hostname.includes('maps.googleapis') ||
        url.hostname.includes('maps.google')) {
        return;
    }

    // Assets statiques (CSS, JS, images, fonts) : cache-first
    if (url.pathname.match(/\.(css|js|webp|png|jpg|svg|woff2?|ico)$/) ||
        url.hostname.includes('fonts.g')) {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request).then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_VERSION).then(c => c.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // HTML : network-first, fallback cache, fallback offline
    event.respondWith(
        fetch(request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_VERSION).then(c => c.put(request, clone));
                return response;
            })
            .catch(() =>
                caches.match(request).then(cached => cached || caches.match('/index.html'))
            )
    );
});
