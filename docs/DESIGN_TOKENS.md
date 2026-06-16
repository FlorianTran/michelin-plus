# Design tokens — Charte Michelin (pour l'app)

> Source : `assets/charte-graphique/michelin_charte_digitale_fr.pdf` (Charte Digitale Michelin, mars 2024, **D3 confidentiel**) + charte de communication 2024/2025. À appliquer pour scorer sur **« Expérience utilisateur et identité visuelle » (3 pts)** + cohérence de marque (critère Réponse métier).

> ⚠️ **Ce doc = la charte officielle (référence des couleurs/typo/grille).** Pour la version WOW de la démo, on la **modernise** : [`DESIGN_DIRECTION.md`](DESIGN_DIRECTION.md) **prévaut** sur la rigueur de la charte (fonds immersifs, mouvement, glass dosé) — tout en gardant l'ADN (bleu `#27509B`, jaune `#FCE500`, Bibendum). Les **hex et la typo restent ceux d'ici**.

## Plateforme de marque (le ton)
- Promesse : **« Innover pour une meilleure vie en mouvement. »**
- Attributs : **Passion pour l'innovation · Respect · Optimisme.**
- Approche obligatoire : **centrée utilisateur · inclusive · à faible impact environnemental (éco-conception).**

---

## Couleurs (hex officiels)

### Référence & accent
| Token | Hex | Usage |
|---|---|---|
| **Bleu Michelin** (référence) | `#27509B` | couleur primaire de marque |
| **Jaune Michelin** (accent) | `#FCE500` | **réservé aux projets commerciaux** — attire l'œil, met l'accent (CTA, highlights) |
| Bleu foncé Michelin (tertiaire) | `#00205B` | fonds immersifs |
| Midnight Blue | `#000C34` | fonds sombres |

Nuances bleu : `#3A61A6` `#6182BB` `#87A4D0` `#AEC5E5` `#C1D6EF` `#D4E7FA`
Nuances jaune : `#FCE817` `#FDED44` `#FDF271` `#FEF79E` `#FEFCCB`

### Secondaires
Gris Responsable `#53565A` · Violet Engagé `#582C83` · Vert Généreux `#84BD00`

### Fonctionnelles (texte/fond/aplats)
Noir `#000000` (texte principal) · Blanc `#FFFFFF` (fond principal)
Gris : `#F2F2F2` `#E5E5E5` `#CCCCCC` `#B2B2B2` `#999999` `#7F7F7F` `#666666` `#4D4D4D` `#404040` `#333333` `#1A1A1A` `#0D0D0D`

### États (alertes uniquement)
| | Base | Dark | Light |
|---|---|---|---|
| Valide | `#2E7D32` | `#92C18F` | `#E8F5E5` |
| Avertissement | `#F9A825` | `#FCD286` | `#FDECC0` |
| Danger/erreur | `#B71C1C` | `#DD8880` | `#F4CEC2` |

> ⚠️ Les solutions digitales Michelin **doivent uniquement utiliser les couleurs de la charte**. Contraste **WCAG AA** minimum.

---

## Typographie

- **Titres (H1–H3)** : **Michelin Unit Titling** (Bold & Regular). Sous H3 → peut basculer sur Noto Sans.
- **Corps de texte web** : **Noto Sans** (Bold, Regular, italiques). Charger via **Google Fonts**. (Michelin Unit Titling est propriétaire — fallback Noto Sans si indispo.)

| Niveau | Police | Taille (desktop) | Line-height |
|---|---|---|---|
| H1 | Michelin Unit Titling | 2.25em (mob 2em) | 3.375em |
| H2 | Michelin Unit Titling | 2em (mob 1.875em) | 3em |
| H3 | Michelin Unit Titling / Noto Bold | 1.75em | 2.625em |
| H4 | Noto Sans Regular | 1.5em | 2.25em |
| H5 | Noto Sans Regular | 1.375em | 2.0625em |
| H6 | Noto Sans Bold | 1.25em | 1.875em |
| Corps L / M / S | Noto Sans | 1.125 / 1 / 0.875em | 1.6875 / 1.5 / 1.5em |
| Annotation | Noto Sans | 0.75em | 1.125em |
| CTA | Noto Sans Medium / underline | 0.875em | 1.25em |

Règles : unités **relatives (rem/em)**, hiérarchie cohérente H1>…>texte, italique = vraie police italique (pas l'effet CSS).

---

## Grille & responsive
- **Grille 12 colonnes** avec gouttières, identique sur tous supports.
- **Breakpoints obligatoires : 360 / 600 / 960 / 1280 / 1920 px.**
- Mobile : **toutes** les fonctionnalités accessibles, navigation tactile, gérer la connectivité limitée.

---

## Composants & boutons
- **Bouton d'action** : hauteurs 48px (Regular) / 36px (Small). 4 couleurs : Principal commercial **`#FCE500`**, Principal Groupe **`#27509B`**, Secondaire **`#53565A`**, Blanc `#FFFFFF` + bordure bleue. 4 états : initial / survol / focus / désactivé.
- Bibliothèque de composants standard fournie (accordéon, nav bar, modale, carte, carrousel, tabs, filtres, datepicker, toggle, dataviz…). **Suivre Material Design** pour les icônes (format vectoriel).
- **Header** (obligatoire) : logo Michelin (SVG, hauteur ≥ 64px, ≥ 1 colonne) — *seule* identité visuelle autorisée dans le header — + navigation, recherche, CTA, langue.
- **Footer** (obligatoire) : copyright année courante · textes légaux (mentions, confidentialité, cookies, accessibilité) · plan du site · **Bibendum en pose « Hello »**.
- **Favicon** obligatoire (Bibendum) ; icône d'app mobile = Bibendum + pictogramme, 512×512px.

---

## Contraintes transverses (cochent des points de notation)
- **Accessibilité WCAG AA** obligatoire (perceptible / opérable / compréhensible / robuste).
- **Éco-conception** : architecture technique + fonctionnelle minimales et justes nécessaires (un atout vu la promesse de marque — et un angle « créativité/audace »).
- **Internationalisation** : conception modulaire, multilingue (UTF-8), SEO, textes légaux localisés (bandeau cookies RGPD).
- **Logo** : version vectorielle SVG, zone de protection, versions bleu/blanc selon fond. URL Michelin officielle pour la prod (hors scope hackathon, mais à mentionner).

> 🎨 **Tailwind ready** : ces hex se transposent directement en `theme.extend.colors`. Police via `next/font/google` (Noto Sans) + Michelin Unit Titling en `@font-face` si on récupère le fichier, sinon Noto Sans partout.
