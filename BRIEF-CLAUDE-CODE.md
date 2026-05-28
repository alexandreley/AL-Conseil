# Hand-off Claude Code — Site vitrine AL Conseil

> Brief technique pour construire le site vitrine d'AL Conseil à partir du design system existant.
> Ce document est ton seul point d'entrée. Tout le contenu rédactionnel est dans `CONTENT.md`. Tous les tokens visuels sont dans `design-system.html`.

---

## 0. Contexte projet

**Client** : AL Conseil — cabinet de recrutement freelance, Lille.
**Fondateur** : Alexandre Ley, consultant unique.
**Cible** : dirigeants d'entreprise (PME / ETI / industriels) qui veulent recruter un cadre ou un dirigeant.
**Secteurs** : tertiaire, supply chain, industrie.
**Promesse** : « Trouver le bon talent, créer la bonne rencontre. »
**Positionnement** : sur-mesure & humain — l'anti-cabinet industriel.

**Objectif business du site** :
1. Inspirer confiance dès la première seconde (codes du cabinet haut de gamme).
2. Convertir un dirigeant en demande de premier échange (form contact ou appel).

---

## 1. Stack technique

- **HTML5** sémantique (pas de framework).
- **CSS3** vanilla — une seule feuille `styles.css` reprenant les tokens du DS.
- **JS vanilla** (un seul fichier `main.js`, < 100 lignes).
- **Pas de build step.** Ouverture directe dans le navigateur.
- **Fonts** : Google Fonts (Cormorant Garamond + Inter) — déjà référencés dans le DS.
- **Pas de framework CSS** (pas de Tailwind, Bootstrap, etc.). Le DS est la source unique de vérité.

**Pourquoi ce choix** : site essentiel à 4 pages, contenu stable, exigence de simplicité pour la maintenance future par un consultant non-dev.

---

## 2. Arborescence cible

```
AL Conseil/
├── index.html                  ← Accueil
├── cabinet.html                ← À propos / Le cabinet
├── contact.html                ← Contact + formulaire
├── mentions-legales.html       ← Mentions légales
├── styles.css                  ← Tokens + classes du DS, organisés par section
├── main.js                     ← Menu mobile, validation form, scroll smooth
├── assets/
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── og-image.jpg            ← 1200×630 pour partages sociaux
│   └── logo.svg                ← Optionnel — pour l'instant logo texte suffit
├── robots.txt
├── sitemap.xml
│
├── design-system.html          ← Référence visuelle, NE PAS modifier
├── CONTENT.md                  ← Contenu rédactionnel, NE PAS modifier
└── BRIEF-CLAUDE-CODE.md        ← Ce fichier
```

---

## 3. Étape 1 — Extraire et organiser `styles.css`

### 3.1. Lire `design-system.html` et en extraire :

1. **Tous les tokens `:root`** (couleurs navy, or, neutres, typo, espacements, rayons, ombres). À recopier tels quels.
2. **Le reset CSS** (`*{box-sizing...}`, `body{...}`).
3. **Les classes typographiques** (`.display-xl`, `.display-lg`, `.h1` à `.h4`, `.body-lg/md/sm`, `.eyebrow`, `.quote`).
4. **Le système de layout** (`.container`, `.section`, `.section--cream`, `.section--navy`).
5. **Les composants boutons** (`.btn`, `.btn--primary`, `.btn--secondary`, `.btn--gold`, `.btn--ghost`, `.btn--sm`, `.btn--lg`).
6. **Les cartes** (`.card-grid`, `.card`, `.card-icon`, `.card-icon--gold`).
7. **Les value pills** (`.values-row`, `.value-pill`, `.value-divider`).
8. **Les formulaires** (`.form-grid`, `.field`, `.field--full`).
9. **Les badges** (`.badge`, `.badge--navy`, `.badge--gold`, `.badge--outline`).
10. **Le header site** (`.site-header`, `.site-logo`, `.site-nav`) — à reprendre tel quel.
11. **Le hero site** (`.site-hero`) — base à adapter.
12. **Le footer site** (`.site-footer`, `.footer-brand`, `.footer-tagline`, `.footer-bottom`) — à reprendre tel quel.
13. **Le filet or** (`.gold-rule`).
14. **Le bloc responsive** (`@media (max-width:768px)`).

### 3.2. NE PAS copier dans `styles.css` :

- Tout ce qui est préfixé `.ds-` (navigation et hero de la page de présentation du DS).
- Les blocs de la palette (`.swatch`, `.palette-row`).
- La section "spacing-list" et "type-row" (specimens).
- La grille d'icônes (`.icon-grid`, `.icon-cell`).
- Le bloc `<pre>` des tokens.

### 3.3. Organisation de `styles.css`

Structurer le fichier dans cet ordre, avec un commentaire de section :

```css
/* ==========================================================================
   AL Conseil — Styles globaux
   Source : design-system.html
   ========================================================================== */

/* 1. Tokens & variables */
:root { ... }

/* 2. Reset & base */
*, *::before, *::after { ... }
html, body { ... }

/* 3. Typographie */
.display-xl, .display-lg, .display-md, .h1, .h2, .h3, .h4 { ... }
.body-lg, .body-md, .body-sm { ... }
.eyebrow, .quote { ... }

/* 4. Layout */
.container, .section, .section--cream, .section--navy { ... }

/* 5. Composants — boutons */
.btn, .btn--primary, .btn--secondary, .btn--gold, .btn--ghost { ... }

/* 6. Composants — cartes */
.card-grid, .card, .card-icon { ... }

/* 7. Composants — value pills */
.values-row, .value-pill, .value-divider { ... }

/* 8. Composants — formulaire */
.form-grid, .field { ... }

/* 9. Composants — badges */
.badge { ... }

/* 10. Header & navigation */
.site-header, .site-logo, .site-nav { ... }

/* 11. Hero pages */
.site-hero { ... }

/* 12. Footer */
.site-footer, .footer-brand, .footer-tagline, .footer-bottom { ... }

/* 13. Helpers */
.gold-rule, .text-center, .mt-* { ... }

/* 14. Responsive */
@media (max-width: 768px) { ... }
```

---

## 4. Étape 2 — Construire les 4 pages HTML

### 4.1. Squelette commun à toutes les pages

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0F2C4C">
  <title>{TITLE_PAR_PAGE}</title>
  <meta name="description" content="{DESC_PAR_PAGE}">
  <meta name="author" content="Alexandre Ley">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="AL Conseil">
  <meta property="og:title" content="{TITLE_PAR_PAGE}">
  <meta property="og:description" content="{DESC_PAR_PAGE}">
  <meta property="og:image" content="https://al-conseil.fr/assets/og-image.jpg">
  <meta property="og:url" content="https://al-conseil.fr/{PAGE}">

  <!-- Canonical -->
  <link rel="canonical" href="https://al-conseil.fr/{PAGE}">

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="styles.css">

  <!-- JSON-LD : voir section 5 -->
  <script type="application/ld+json">{ ... }</script>
</head>
<body>

  <!-- Header (identique partout) -->
  <header class="site-header">
    <a href="index.html" class="site-logo" aria-label="AL Conseil — Accueil">
      A<span class="gold-bar"></span>L · Conseil
    </a>
    <nav class="site-nav" aria-label="Navigation principale">
      <a href="index.html" class="{is-active si page accueil}">Accueil</a>
      <a href="cabinet.html" class="{is-active si page cabinet}">Cabinet</a>
      <a href="contact.html" class="{is-active si page contact}">Contact</a>
      <a href="contact.html" class="btn btn--primary btn--sm">Confier un recrutement</a>
    </nav>
    <button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </header>

  <main>
    {CONTENU SPÉCIFIQUE — voir CONTENT.md}
  </main>

  <!-- Footer (identique partout) -->
  <footer class="site-footer">
    {voir CONTENT.md section Footer}
  </footer>

  <script src="main.js"></script>
</body>
</html>
```

### 4.2. Source du contenu

**Tout le contenu rédactionnel est dans `CONTENT.md`**, organisé page par page, section par section. Pour chaque section :

- Le **niveau de titre** est indiqué (display-xl, h1, h2, eyebrow…) → utiliser la classe correspondante du DS.
- Les **CTA** sont nommés (primaire navy, secondaire outline, accent or, ghost) → utiliser `.btn--primary`, `.btn--secondary`, `.btn--gold`, `.btn--ghost`.
- Les **sections crème ou navy** sont indiquées → utiliser `.section--cream` ou `.section--navy`.
- Les **icônes** mentionnées sont reprises de la grille du DS (users, target, handshake, search, etc.) — recopier les SVG inline.

### 4.3. Structure sémantique attendue par page

| Page | Structure attendue |
|---|---|
| `index.html` | `<header>` · `<main>` avec 7 `<section>` · `<footer>` |
| `cabinet.html` | `<header>` · `<main>` avec 4-5 `<section>` · `<footer>` |
| `contact.html` | `<header>` · `<main>` avec 3 `<section>` (hero, form, réassurance) · `<footer>` |
| `mentions-legales.html` | `<header>` · `<main>` avec `<article>` contenant le contenu · `<footer>` |

**Règle accessibilité** : un seul `<h1>` par page, hiérarchie h1 → h2 → h3 sans saut.

---

## 5. Étape 3 — SEO

### 5.1. Mots-clés cibles

**Primaires (forte intention)**
- cabinet de recrutement Lille
- chasseur de tête Lille
- recrutement cadres Hauts-de-France
- consultant en recrutement Lille

**Secondaires (longue traîne sectorielle)**
- recrutement supply chain Lille / Hauts-de-France
- recrutement dirigeants industrie Nord
- recrutement directeur de site Hauts-de-France
- recrutement cadres tertiaire Lille
- cabinet recrutement PME ETI Lille

**Géographiques**
- Lille, Roubaix, Tourcoing, Hauts-de-France, Nord, Pas-de-Calais

### 5.2. Méta-titres et descriptions par page

#### `index.html`

```
<title>AL Conseil — Cabinet de recrutement de cadres & dirigeants à Lille</title>
<meta name="description" content="Cabinet de recrutement basé à Lille, spécialisé dans les cadres et dirigeants en tertiaire, supply chain et industrie. Approche sur-mesure, accompagnement direct par un consultant unique.">
```

#### `cabinet.html`

```
<title>Le cabinet — AL Conseil, recrutement à taille humaine à Lille</title>
<meta name="description" content="Fondé par Alexandre Ley, dix ans d'expérience en recrutement de cadres et dirigeants (PageGroup, Mac Anders, Meteojob). Un cabinet à un seul consultant, par choix.">
```

#### `contact.html`

```
<title>Contact — Confier un recrutement à AL Conseil | Lille</title>
<meta name="description" content="Contactez AL Conseil pour un recrutement de cadres ou dirigeants à Lille et en Hauts-de-France. Premier échange offert, confidentiel et sans engagement. Réponse sous 24 heures.">
```

#### `mentions-legales.html`

```
<title>Mentions légales — AL Conseil</title>
<meta name="description" content="Mentions légales du site AL Conseil, cabinet de recrutement à Lille.">
<meta name="robots" content="noindex,follow">
```

### 5.3. JSON-LD à insérer dans `<head>` de `index.html`

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://al-conseil.fr/#cabinet",
  "name": "AL Conseil",
  "description": "Cabinet de recrutement de cadres et dirigeants — tertiaire, supply chain, industrie. Basé à Lille.",
  "url": "https://al-conseil.fr",
  "telephone": "+33686052261",
  "email": "alexandre.ley@al-conseil.fr",
  "founder": {
    "@type": "Person",
    "name": "Alexandre Ley",
    "jobTitle": "Consultant en recrutement",
    "sameAs": "https://www.linkedin.com/in/alexandre-ley-574bb2a1"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lille",
    "addressRegion": "Hauts-de-France",
    "addressCountry": "FR"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Hauts-de-France" },
    { "@type": "Country", "name": "France" }
  ],
  "serviceType": [
    "Recrutement de cadres",
    "Recrutement de dirigeants",
    "Approche directe",
    "Conseil RH"
  ],
  "knowsAbout": [
    "Recrutement supply chain",
    "Recrutement industrie",
    "Recrutement tertiaire",
    "Marque employeur"
  ],
  "priceRange": "€€€"
}
```

JSON-LD `Person` à ajouter sur `cabinet.html` :

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alexandre Ley",
  "jobTitle": "Consultant en recrutement",
  "worksFor": {
    "@type": "ProfessionalService",
    "name": "AL Conseil"
  },
  "alumniOf": ["PageGroup", "Mac Anders", "Meteojob (CleverConnect)"],
  "knowsAbout": ["Recrutement de cadres", "Supply chain", "Industrie", "Marque employeur"],
  "sameAs": "https://www.linkedin.com/in/alexandre-ley-574bb2a1"
}
```

### 5.4. Fichiers SEO complémentaires

**`robots.txt`** :

```
User-agent: *
Allow: /
Disallow: /mentions-legales.html
Sitemap: https://al-conseil.fr/sitemap.xml
```

**`sitemap.xml`** :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://al-conseil.fr/</loc><priority>1.0</priority></url>
  <url><loc>https://al-conseil.fr/cabinet.html</loc><priority>0.8</priority></url>
  <url><loc>https://al-conseil.fr/contact.html</loc><priority>0.9</priority></url>
</urlset>
```

---

## 6. Étape 4 — Formulaire de contact

### 6.1. Stratégie d'envoi (au choix, par ordre de préférence)

1. **Formspree** (recommandé pour le MVP) — `<form action="https://formspree.io/f/{ID}" method="POST">`. Demande à Alexandre de créer un compte gratuit, puis remplacer `{ID}`.
2. **Getform** ou **Web3Forms** — équivalents.
3. **Mailto fallback** — `<form action="mailto:alexandre.ley@al-conseil.fr">` (à éviter, dégrade l'UX).

**Important** : avant de hardcoder un service, demander à l'utilisateur lequel il préfère. En attendant, laisser un commentaire `<!-- TODO: remplacer par l'endpoint Formspree -->`.

### 6.2. Validation côté client (`main.js`)

- Required sur : nom, prénom, entreprise, email, type de besoin, message, consentement RGPD.
- Format email vérifié via regex simple.
- Téléphone optionnel.
- Sur succès : afficher un message de confirmation et masquer le form. Texte exact dans `CONTENT.md` (annexe micro-copy).
- Sur erreur : afficher un message d'erreur générique, ne pas vider le form.

### 6.3. Honeypot anti-spam

Ajouter un champ caché `<input type="text" name="_gotcha" style="display:none">`. Si rempli, ignorer la soumission.

---

## 7. Étape 5 — JavaScript (`main.js`)

Garder ce fichier minimal — environ 60-100 lignes max. Contenu attendu :

1. **Menu mobile** — toggle de `.site-nav` sur clic du bouton hamburger. Ajouter une classe `is-open`. Gérer `aria-expanded`.
2. **Smooth scroll** — pour les ancres internes (déjà géré en CSS via `html { scroll-behavior: smooth }`, mais sécuriser en JS si besoin).
3. **Validation form** — bind sur `submit`, validation des champs, gestion succès/erreur.
4. **Active link** — surligner automatiquement le lien correspondant à la page courante dans la nav (ajouter classe `is-active`).
5. **Reveal au scroll** *(optionnel, only if budget)* — léger fade-up sur `.card` et `.value-pill` via `IntersectionObserver`. À ne faire que si performant et discret.

**Interdits** : jQuery, librairies externes, animations lourdes, parallax.

---

## 8. Étape 6 — Accessibilité (cibler WCAG AA)

Checklist à valider avant livraison :

- [ ] Contraste texte ≥ 4.5:1 (le DS garantit AAA pour navy 800 sur blanc).
- [ ] Un seul `<h1>` par page, hiérarchie cohérente.
- [ ] Tous les liens ont un libellé explicite (pas de « cliquez ici »).
- [ ] Tous les boutons icône ont un `aria-label`.
- [ ] Le menu mobile gère `aria-expanded` et le focus trap basique.
- [ ] Le form a des `<label>` associés à chaque `<input>` (déjà dans le DS).
- [ ] Les images décoratives ont `alt=""`, les informatives ont un alt descriptif.
- [ ] Navigation au clavier 100% possible (tab, enter, espace).
- [ ] Focus visible sur tous les éléments interactifs (le DS prévoit déjà le `:focus` sur les inputs).
- [ ] Pas de texte en dessous de 14px (le DS prévoit 12px uniquement sur eyebrow).
- [ ] Lang `fr` sur `<html>`.

---

## 9. Étape 7 — Performance

Objectifs Lighthouse : **Performance 95+, Accessibilité 100, SEO 100, Best Practices 100**.

Checklist :

- [ ] `preconnect` aux fonts Google (déjà dans le squelette).
- [ ] `font-display: swap` (déjà géré par Google Fonts).
- [ ] Images en WebP ou AVIF, avec `width`/`height` explicites.
- [ ] `loading="lazy"` sur toutes les images hors hero.
- [ ] Pas de framework JS, pas de bundle inutile.
- [ ] CSS et JS minifiés en prod *(optionnel pour la première livraison)*.
- [ ] Pas de Google Tag Manager / Analytics en V1 — à ajouter ultérieurement si nécessaire.

---

## 10. Étape 8 — Responsive

Le DS définit déjà :
- Container max-width **1180px**.
- Padding section **96px vertical** (desktop) → **56px** (mobile).
- Breakpoint principal : **768px**.

À gérer en plus :

- Header : remplacer la nav par un menu hamburger sous 768px (cf. `main.js`).
- Form contact : 1 colonne sous 768px (déjà géré dans le DS).
- Footer : passer de 4 colonnes à 2 colonnes sous 768px (déjà dans le DS).

**Tester sur** : iPhone SE (375px), iPhone 14 (390px), iPad (768px), Desktop 1440px.

---

## 11. Ordre d'exécution recommandé

1. **Créer `styles.css`** en extrayant et organisant le DS *(1ère heure)*.
2. **Créer le header + footer partagés** (HTML brut, identiques sur toutes les pages).
3. **Créer `index.html`** (la plus longue, mais valide tout le système).
4. **Créer `cabinet.html`** (plus simple, réutilise les composants).
5. **Créer `contact.html`** (focus sur le form).
6. **Créer `mentions-legales.html`** (page sobre).
7. **Créer `main.js`** (menu mobile + validation form).
8. **Ajouter robots.txt, sitemap.xml, JSON-LD**.
9. **Tester accessibilité + responsive + Lighthouse**.
10. **Rapport final** : screenshot de chaque page, score Lighthouse, liste des `TODO:` restants (endpoint form, SIRET, hébergeur).

---

## 12. Questions à poser au client avant de livrer

À remonter en fin de session :

1. **Quel endpoint pour le formulaire** ? Formspree / Getform / autre ?
2. **SIRET et adresse postale** à compléter dans les mentions légales.
3. **Hébergeur retenu** (Vercel, Netlify, OVH, autre) — à indiquer dans les mentions légales.
4. **Logo SVG** : faut-il en créer un, ou conserver le rendu typographique « A·L · Conseil » du DS ?
5. **Image Open Graph** : besoin d'un visuel 1200×630 spécifique, ou on génère une carte texte sur fond navy avec la promesse ?
6. **Analytics** : intégration Plausible ou Matomo souhaitée à la V1 ?

---

## 13. Périmètre hors-scope (à ne PAS faire)

Pour garder l'exigence d'un site essentiel :

- Pas de blog ni de système d'articles.
- Pas de page « Références » / études de cas (le client a indiqué « pas encore » de chiffres).
- Pas de page « Méthode » séparée — le bloc méthode reste sur l'accueil.
- Pas de page « Expertises » séparée — les 3 cartes restent sur l'accueil.
- Pas de carrousel, de pop-up, de bandeau cookie agressif (cookies techniques uniquement, mention discrète dans le footer).
- Pas de mode sombre (le DS est conçu pour fond clair).
- Pas de multilingue (V1 100% français).

Toutes ces fonctionnalités pourront être ajoutées en V2 si le besoin émerge.

---

## 14. Livrables finaux attendus

À la fin de la session Claude Code :

- ✅ 4 fichiers HTML, valides W3C.
- ✅ 1 fichier `styles.css` propre et commenté.
- ✅ 1 fichier `main.js` léger.
- ✅ `robots.txt` et `sitemap.xml`.
- ✅ Favicon (SVG + PNG fallback).
- ✅ Image Open Graph 1200×630 (ou TODO si pas le temps).
- ✅ Tests responsive validés (375 / 768 / 1440).
- ✅ Score Lighthouse capturé.
- ✅ Liste des `TODO:` restants pour le client.

---

*Bonne mission. Tout ce qu'il faut est dans `CONTENT.md` (les mots) et `design-system.html` (les tokens). Reste à les assembler avec soin.*
