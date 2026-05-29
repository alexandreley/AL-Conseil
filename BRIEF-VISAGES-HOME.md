# Brief — Ajouter une présence humaine sur la page d'accueil

> Objectif : corriger l'absence totale de visage humain sur `index.html`, alors que le recrutement est un métier de relation. Le site doit *montrer* l'humain, pas seulement l'écrire.

---

## 1. Le problème

La home actuelle ne contient **aucun visage**. Elle repose uniquement sur du texte et des icônes SVG abstraites (silhouettes, cercles, lignes). Pour un cabinet dont la promesse est « créer la bonne rencontre » et le positionnement « sur-mesure & humain — l'anti-cabinet industriel », c'est une contradiction visuelle :

- Le hero est 100 % typographique → froid, interchangeable avec n'importe quel cabinet.
- Le manifeste parle d'écoute et d'engagement personnel, signé « Alexandre Ley » → mais on ne voit jamais Alexandre.
- Les valeurs (« Écoute & Proximité ») sont illustrées par des pictos géométriques → l'inverse de la proximité.

Or les assets existent déjà mais ne sont pas exploités sur la home :
- un **portrait du fondateur** : `assets/images/alexandre-ley-800.jpg` (+ `-400.jpg`) ;
- **8 photos professionnelles** Pexels déjà téléchargées (poignée de main, réunion, échange café…), dont plusieurs avec des visages — voir `CREDITS.md`.

---

## 2. Principe directeur

Un consultant **unique** est son propre argument de vente. Sur ce type de site, le visage le plus important n'est pas une banque d'images : **c'est celui d'Alexandre.** La priorité est donc d'incarner le cabinet par son fondateur, puis de réchauffer les sections relationnelles avec des photos humaines sobres.

Règle : chaque visage doit servir un message (confiance, proximité, expertise), jamais décorer pour décorer. On reste haut de gamme, donc parcimonie et qualité priment sur le nombre.

---

## 3. Où ajouter de l'humain — par priorité

### Priorité 1 — Le manifeste devient un bloc « fondateur » (impact maximal)
Section *« Un cabinet, un consultant, un engagement »*.

- Ajouter le **portrait d'Alexandre** (`alexandre-ley-800.jpg`) à côté du texte, en deux colonnes (photo / manifeste) sur desktop, empilées sur mobile.
- C'est ici que le « je » du texte rencontre enfin un visage. C'est le gain de confiance le plus fort de toute la page.
- Garder la signature « — Alexandre Ley » ; idéalement ajouter sous la photo : nom + titre (« Alexandre Ley — Consultant en recrutement ») et un lien discret vers la page Cabinet.

### Priorité 2 — Un hero incarné
Section hero.

- Deux options, à trancher (voir §6) :
  - **Option A (recommandée)** — hero split : texte à gauche, **portrait d'Alexandre** à droite. Le visage du consultant dès la première seconde, cohérent avec « un cabinet, un consultant ».
  - **Option B** — image de fond pleine largeur avec la poignée de main (`hero-poignee-de-main-confiance.jpg`) + voile navy, texte par-dessus. Plus « cabinet », moins personnel.
- Conserver le titre, la gold-rule et les CTA existants.

### Priorité 3 — Réchauffer « Nos valeurs »
Les 3 pictos SVG restent, mais la section gagne à être précédée ou accompagnée d'une **photo relationnelle** (réunion / échange) pour ancrer l'idée de proximité. À défaut de refonte, au minimum bandeau d'illustration : `methode-reunion-strategique.jpg`.

### Priorité 4 — Illustrer les 3 expertises
Cartes Tertiaire / Supply Chain / Industrie : aujourd'hui texte seul. Ajouter une image par carte (déjà disponibles : `expertise-tertiaire-…`, `expertise-supply-chain-…`, `expertise-industrie-…`). Ces visuels sont surtout des lieux, pas des visages — ils complètent mais ne règlent pas le problème humain. Secondaire.

### Priorité 5 — La citation
Bloc *« Le bon recrutement n'est jamais une transaction… »*. Une citation gagne à être attribuée à un visage : y associer une petite vignette ronde du portrait d'Alexandre renforcerait l'incarnation.

---

## 4. Specs techniques (cohérence avec le DS)

- **Format** : réutiliser les images existantes ; pas de nouveau téléchargement nécessaire pour les priorités 1–2.
- **Portrait** : servir `-800.jpg` en desktop, `-400.jpg` en mobile via `srcset` ; ratio portrait ou carré, coins selon le DS (les cartes existantes ont des angles légers — s'aligner dessus).
- **Cohérence chromatique** : sur les images de fond et bandeaux, appliquer un **voile navy 800 à 10–20 % d'opacité** (ou un dégradé navy → transparent) pour rester dans la palette navy/or, comme noté dans `CREDITS.md`.
- **Performance** : `loading="lazy"` sur toutes les images sous la ligne de flottaison ; `width`/`height` explicites pour éviter le CLS ; le hero (au-dessus de la ligne de flottaison) reste en `eager` + `fetchpriority="high"`.
- **Accessibilité** : `alt` descriptif et utile — ex. `alt="Alexandre Ley, consultant en recrutement, AL Conseil"`. Pas d'`alt` vide sur le portrait (image porteuse de sens). Contraste texte/image suffisant grâce au voile.
- **Responsive** : sur mobile, les blocs deux colonnes (hero, manifeste) passent en pile, photo au-dessus du texte.
- **Pas de build step** : HTML/CSS vanilla, on reste sur `styles.css` + tokens du DS.

---

## 5. Crédits & droits

- Portrait d'Alexandre : photo en propre → **valider l'accord d'usage** et la HD (la note de `CREDITS.md` signalait qu'aucun portrait n'était dispo ; il l'est désormais, à confirmer côté droits).
- Photos Pexels : licence libre, attribution non obligatoire mais recommandée. Le bloc crédits est déjà prêt dans `CREDITS.md` → l'ajouter aux mentions légales si on déploie ces images.

---

## 6. Décisions à valider avant prod

1. **Hero** : Option A (portrait split) ou Option B (fond poignée de main) ? — recommandation : A.
2. **Photo du fondateur** : le visuel actuel (`alexandre-ley-800.jpg`) est-il validé en qualité et en droits, ou faut-il une vraie séance photo ?
3. **Densité d'images** : home sobre (priorités 1–2 seulement) ou home illustrée complète (1 à 5) ? — recommandation : commencer par 1–2, mesurer, puis étendre.

---

## 7. Definition of done

- [ ] Au moins un visage humain visible **au-dessus de la ligne de flottaison**.
- [ ] Portrait du fondateur présent dans la section manifeste/fondateur.
- [ ] Toutes les images : `alt` pertinents, `loading`/dimensions corrects, voile navy sur les fonds.
- [ ] Aucun décalage de mise en page (CLS) ni régression de perf au chargement.
- [ ] Crédits photos à jour dans les mentions légales si nouvelles images déployées.
- [ ] Rendu validé sur mobile (pile) et desktop (colonnes).
