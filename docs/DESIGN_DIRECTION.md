# Direction visuelle — « Michelin modernisé » (wow)

> Décision : on **modernise** la charte pour l'effet wow, **sans perdre l'ADN Michelin**. Tokens de base dans [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md) ; ce doc dit **comment on s'en écarte intelligemment**.

## 🎯 Le style retenu (décidé) : « Premium Performance Tech »

**Tendance retenue : « Dark Spatial Bento »** — grille **bento** de tuiles, cartes **glassmorphism 2.0**, **aurora/mesh glow** (bleu→or), **compteurs kinétiques**. C'est le langage premium-dashboard 2026 (Linear, Vercel, Whoop, visionOS). Parfait pour un produit stats/fidélité — max wow par effort.

**Référence mentale : Strava / Whoop / Nike Run Club ✕ culture du drop de luxe (éditions numérotées).** Sombre, immersif, piloté par le mouvement, statutaire. C'est l'intersection exacte de notre cible passionnée (data + performance) et du désir premium (rareté).

- **Layout bento** : dashboard = tuiles de tailles variées (points, palier, km, prochaine récompense, clan) dans une grille modulaire.
- **Glass 2.0** : cartes en verre dépoli au-dessus du fond near-black + glow ; bordures fines lumineuses.
- **Aurora glow** : halos de dégradé bleu→or diffus en arrière-plan (profondeur, premium).
- **Kinetic** : compteurs qui s'incrémentent, jauges qui se remplissent, reveals au scroll (Framer Motion).

- **Base** : **near-black canvas `#08090F`** (le noir porte le luxe) + **bleu Michelin foncé en surfaces élevées** `#00205B` / `#0A1A3F` (l'ADN bleu reste présent) + dégradés profonds noir→bleu nuit.
- **Système à 2 accents (le « black & gold » que tu décris)** :
  - **Jaune Michelin `#FCE500`** = accent énergie *brand-true* (CTA principaux, états actifs, signal « Michelin »).
  - **Or premium `#E8C24A`** (ou dégradé métallique subtil) = **réservé au prestige** : paliers hauts, badges d'**édition numérotée**, statut ambassadeur, **carte de fidélité**. C'est lui qui donne le feeling luxe.
  > Garde-fou : l'or est *rare et statutaire*, le jaune reste l'accent de travail. Ne pas noyer l'un dans l'autre.
- **Matière & mouvement** : cartes glass dosées, **compteurs animés**, **jauges de palier**, transitions fluides, parallax léger (Framer Motion).
- **Signature graphique** : la **trace de sculpture de pneu** (asset réel extrait → `assets/brand-extracted/motifs/tire-tread-trace.svg`) en séparateurs / fils / remplissage de jauge.
- **Icônes** : jeu d'**icônes ligne jaune style Michelin** déjà dispo (`assets/brand-extracted/icons/`, ~46).
- **Typo** : gros titres display + Noto Sans corps. **Mobile-first** responsive.
- ❌ **Ce qu'on NE fait PAS** : le michelin.com corporate plat · le néon « gamer » · le pastel mignon · le dashboard SaaS générique.

> Verdict : **on ose le sombre immersif + mouvement** (wow), on garde **bleu/jaune/Bibendum/tread** (Michelin). Côté ambassadeur = variante **claire éditoriale** du même système.

### Palette thème sombre (à utiliser telle quelle)
| Rôle | Hex |
|---|---|
| Canvas (fond) | `#08090F` (near-black) |
| Surface élevée | `#0A1A3F` |
| Surface / bleu signature | `#00205B` |
| Bordure / ligne | `#1E2A4A` |
| Texte principal | `#FFFFFF` |
| Texte secondaire | `#AEC5E5` (bleu clair charte) |
| **Accent énergie (jaune Michelin)** | `#FCE500` |
| **Accent prestige (or)** | `#E8C24A` |
| Succès / alerte / erreur | `#2E7D32` / `#F9A825` / `#B71C1C` (charte) |

Contraste : texte blanc sur near-black/bleu = AA OK ; **bleu jamais en texte sur noir** (surfaces/accents seulement) ; jaune & or sur near-black = fort contraste, parfait pour CTA/statut.

---

## Le principe : « évolution audacieuse », pas « hors-marque »

Le jury note **« cohérence avec la marque Michelin » (UX, 3 pts)** ET **« audace / surprise positive » (Créativité, 4 pts)**. On joue les deux :
- **On garde** ce qui rend Michelin *immédiatement reconnaissable* : **Bleu `#27509B`**, **Jaune `#FCE500`**, **Bibendum**, le logo.
- **On modernise** la mise en forme : profondeur, mouvement, matière, échelle typographique.

> Pitch à assumer : *« On ne refait pas la charte — on montre à quoi ressemblerait Michelin Vélo en 2026 quand la marque parle aux passionnés : la même identité, une énergie nouvelle. »*

---

## Les ingrédients du wow (ce qui fait l'effet en démo)

1. **Hero immersif sombre** : fonds `#000C34` / `#00205B` (charte = OK pour l'immersif) avec **dégradés profonds** bleu→nuit, **grain/texture** subtile, un pneu/Bibendum en visuel fort. Le jaune **éclate** dessus.
2. **Mouvement (Framer Motion)** — c'est LE différenciateur low-cost :
   - compteur de **points qui s'incrémente** à l'activation,
   - **jauge de palier** qui se remplit,
   - transitions de page fluides, parallax léger au scroll,
   - cartes de récompense en **reveal**/hover 3D léger.
3. **Glassmorphism *maîtrisé*** sur les cartes au-dessus du hero sombre (verre dépoli léger) — moderne mais lisible (≠ slab opaque). À doser, contraste **AA** respecté.
4. **Échelle typographique forte** : gros titres **Michelin Unit Titling** (ou substitut display si la police propriétaire est indispo → une display moderne proche), corps **Noto Sans**. Contraste de taille = premium.
5. **Le jaune = énergie / statut**, jamais du remplissage : CTA, palier débloqué, badge « Créateur Michelin », numéro d'édition limitée.
6. **Motif / signature** : exploiter la **sculpture du pneu** (rainures) comme motif graphique récurrent (séparateurs, jauges) — détail qui ancre dans la marque tout en étant frais.

---

## Deux ambiances, un seul système (cf. personas)

> ✅ **Décision : UN SEUL thème sombre premium pour tout** (pas de mode clair). On différencie les 2 personas par l'**accent + le layout**, pas par un thème clair — gain de temps majeur + cohérence + plus wow.

| | **Membre / athlète** (Léa) | **Ambassadeur / créateur** (Thomas) |
|---|---|---|
| Thème | **Sombre premium** (le même) | **Sombre premium** (le même) |
| Accent dominant | **jaune énergie** | **or prestige** |
| Layout / sensation | dense, data-viz, mouvement (Strava-like) | éditorial, aéré, statut/prestige |
| Composants | dashboard jauges, drops | cartes statut, revenus, classement clan |

Même grille (12 col, breakpoints **360/600/960/1280/1920**), même typo, même logo — **deux thèmes** (clair/sombre) du **même** design system.

---

## Garde-fous (pour ne pas perdre les points marque)
- ✅ Bleu + jaune Michelin **dominent** ; pas de palette étrangère.
- ✅ **Bibendum** présent (header/footer « Hello », favicon).
- ✅ Contraste **WCAG AA** même sur le sombre/glass.
- ✅ Responsive mobile **irréprochable** (la démo se fera sûrement projetée + montrée sur tel).
- ⚠️ Glass/effets = **dosés** ; lisibilité d'abord. Un wow illisible = malus UX.
- ⚠️ Pas d'avant-gardisme « pour faire joli » déconnecté du contenu — chaque effet sert le parcours.

---

## Pipeline design
1. **Figma** : maquettes hero + dashboard membre + carte fidélité + catalogue récompenses + page ambassadeur + classement clan.
2. **Claude design / frontend-design** : génère les écrans React (Next + Tailwind + Framer Motion) à partir des maquettes.
3. **Itération** wow : animations, transitions, polish — c'est là qu'on gagne la démo.

> Référence d'inspiration (à confirmer ensemble) : dashboards sportifs premium (Strava premium, Whoop, Nike Run Club) + e-commerce de luxe (drops numérotés) — l'intersection = notre cible passionnée.
