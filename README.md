# Chez J&J — Site Vitrine Restaurant

Site vitrine **mobile-first + PWA** pour food-truck tacos/sandwichs.
Funnel avis Piloton intégré · Dark/Light mode · SEO local · Offline-ready.

---

## Structure des fichiers

```
chez_j_and_j/
├── index.html          ← Site principal (SPA multi-pages)
├── style.css           ← Design system complet (dark/light)
├── app.js              ← Router + Horaires live + Piloton + Tracking
├── sw.js               ← Service Worker (offline/PWA)
├── manifest.json       ← PWA manifest
├── robots.txt          ← SEO robots
├── sitemap.xml         ← Sitemap Google
├── assets/             ← Images, icônes (à créer)
│   ├── icon-192.png
│   ├── icon-512.png
│   └── og-image.jpg
└── vitrine-restaurant-product-doc.html  ← Documentation produit
```

---

## Pages incluses

| Page | URL hash | Statut |
|------|----------|--------|
| Accueil | `#accueil` | ✅ MVP |
| Menu filtrable | `#menu` | ✅ MVP |
| Avis clients | `#avis` | ✅ MVP |
| Funnel satisfaction (Piloton) | `#satisfaction` | ✅ MVP |
| Merci avis Google | `#merci-avis` | ✅ MVP |
| Merci feedback privé | `#merci-feedback` | ✅ MVP |
| Contact + Maps | `#contact` | ✅ MVP |
| Mentions légales | `#mentions-legales` | ✅ MVP |
| Confidentialité RGPD | `#confidentialite` | ✅ MVP |
| Allergènes (obligation EU) | `#allergenes` | ✅ MVP |
| 404 | `#404` | ✅ MVP |

---

## Features implémentées

### UX
- [x] SPA router (navigation sans rechargement)
- [x] Bouton appel sticky (barre bas mobile)
- [x] Bouton itinéraire (Google Maps)
- [x] Bouton avis rapide (sticky)
- [x] Header fixe + burger mobile
- [x] Dark mode / Light mode (auto OS + toggle manuel)
- [x] Horaires live (ouvert/fermé calculé en temps réel)
- [x] Plat du jour dynamique (par jour de la semaine)
- [x] Menu filtrable par catégorie + filtre allergènes
- [x] Animations au scroll (Intersection Observer)
- [x] Micro-transitions CSS (hover, tap)

### Marketing / Piloton
- [x] Funnel avis client (satisfaction → ≥4⭐ → Google / <4⭐ → feedback privé)
- [x] Widget avis Google (note + étoiles + témoignages)
- [x] QR code placeholder (à remplacer par votre vrai QR)
- [x] WhatsApp Business (lien direct)

### Technique / SEO
- [x] Schema.org FastFoodRestaurant + LocalBusiness + AggregateRating
- [x] Meta OG (OpenGraph pour partage WhatsApp/Facebook)
- [x] PWA complète (manifest + Service Worker + offline)
- [x] Banner installation PWA
- [x] robots.txt + sitemap.xml
- [x] HTTPS-ready (headers à configurer côté serveur)

### Tracking
- [x] GA4 (chargé uniquement si consentement RGPD)
- [x] Tracking clics : appel, itinéraire, WhatsApp, avis
- [x] Scroll depth (25 / 50 / 75 / 90%)
- [x] Events funnel Piloton (satisfaction_submit, feedback_private)
- [x] Page views SPA

### Légal / RGPD
- [x] Bannière consentement cookies (opt-in/refus)
- [x] Pages légales complètes (mentions, confidentialité, allergènes)

---

## Configuration requise

### 1. Remplacer les placeholders dans `app.js`

```js
const CONFIG = {
  phone: '+33600000000',           // ← Votre vrai numéro
  googleMapsUrl: 'https://...',    // ← Lien Maps exact
  googleReviewUrl: 'https://g.page/r/VOTRE_CODE/review',  // ← Votre lien avis Google
  ga4Id: 'G-XXXXXXXXXX',          // ← Votre ID GA4
  // Plats du jour par jour de la semaine...
};
```

### 2. Créer le dossier `assets/`

Ajouter :
- `icon-192.png` — icône PWA 192×192px
- `icon-512.png` — icône PWA 512×512px
- `og-image.jpg` — image partage réseaux sociaux (1200×630px)

### 3. Remplacer les infos dans `index.html`

- Adresse exacte (Schema.org + page Contact)
- Coordonnées GPS (latitude/longitude Schema.org)
- URL iframe Google Maps
- SIRET

### 4. Déploiement

```bash
# Vercel (recommandé)
npx vercel

# OVH / Netlify / n'importe quel hébergeur statique
# Uploader les fichiers à la racine
```

**⚠️ HTTPS obligatoire** pour que le Service Worker fonctionne.

---

## Stack technique

- **HTML5 + CSS3 + JS vanilla** — zéro dépendance, zéro framework
- **PWA** — Service Worker + Web App Manifest
- **Schema.org** — LocalBusiness / FastFoodRestaurant
- **Google Analytics 4** — avec consentement RGPD
- **Google Fonts** — Syne + DM Sans (subsetted)

---

## Roadmap V1 (prochaines étapes)

- [ ] Galerie photos lightbox swipeable
- [ ] Admin CMS (modifier menu/plat du jour sans code)
- [ ] Capture email + coupon de bienvenue
- [ ] Blog SEO (articles locaux)
- [ ] Pages SEO par zone/quartier
- [ ] Newsletter auto (Brevo/Mailchimp)
- [ ] Dashboard Piloton (vue avis + feedbacks)

---

*Documentation produit complète : voir `vitrine-restaurant-product-doc.html`*
