# Prompt pour Claude design

> À coller dans **Claude design** (skill `frontend-design`) après lui avoir fourni les `.md` du projet.
> Deux usages : (1) **générer le design system** « Michelin modernisé », (2) **générer les écrans clés**.
> Pointe le tool vers : `DESIGN_DIRECTION.md`, `DESIGN_TOKENS.md`, `PERSONAS.md`, `SCREENS.md`, `SOLUTION.md`.

---

## ▶️ Prompt principal (à copier)

```
Tu conçois l'interface d'une web app de démo de hackathon : **Michelin+**, un programme
communautaire & de fidélité pour cyclistes premium. Objectif du livrable : un effet WOW qui
donne envie au client (Michelin) d'adopter la solution — on vend une vision, design-first.

CONTEXTE (lis ces fichiers fournis) :
- SOLUTION.md — le concept (Michelin+ : activation post-achat par carte+code, points, paliers,
  récompenses & éditions limitées, ambassadeurs + clans ; brise le cercle vicieux de la demande).
- PERSONAS.md — 2 personas : Léa (membre/athlète, immersif) & Thomas (ambassadeur/créateur, prestige).
- SCREENS.md — la liste des écrans à concevoir + leur priorité.
- DESIGN_DIRECTION.md — la direction wow (prévaut) ; DESIGN_TOKENS.md — couleurs/typo/grille officiels.

MARQUE — « Michelin modernisé », pas hors-marque :
- GARDE l'ADN reconnaissable : Bleu Michelin #27509B, Jaune Michelin #FCE500, Bibendum, logo.
- THÈME SOMBRE PREMIUM : canvas near-black #08090F + surfaces bleu Michelin foncé #00205B/#0A1A3F.
- 2 ACCENTS : jaune #FCE500 (énergie, CTA) + OR premium #E8C24A (réservé prestige : paliers hauts, éditions numérotées, statut ambassadeur, carte fidélité).
- MODERNISE la forme : profondeur, mouvement, matière, grande échelle typographique.
- Le jaune = énergie/statut/CTA (jamais du remplissage). Pas de palette étrangère.
- Typo : titres display fort (Michelin Unit Titling ; sinon une display moderne proche),
  corps Noto Sans (Google Fonts).
- Accessibilité WCAG AA, contraste respecté même sur fonds sombres/glass.

UN SEUL THÈME SOMBRE PREMIUM POUR TOUT (pas de mode clair). Différencier les 2 personas par
l'ACCENT + le LAYOUT, pas par un thème clair :
- Membre/athlète (Léa) → accent JAUNE énergie, layout dense data-viz (points, jauges, drops),
  mouvement (Strava-like).
- Ambassadeur/créateur (Thomas) → accent OR prestige, layout éditorial & aéré (statut, revenus,
  classement clan), sensation cercle restreint.
Base commune : canvas near-black #08090F + surfaces bleu #00205B/#0A1A3F + dégradés profonds + glass dosé.

TENDANCE VISUELLE : « DARK SPATIAL BENTO » (langage premium-dashboard 2026, type Linear/Vercel/
Whoop/visionOS) :
- Layouts en GRILLE BENTO (tuiles modulaires de tailles variées) pour les dashboards.
- Cartes GLASSMORPHISM 2.0 (verre dépoli, bordures fines lumineuses) sur fond near-black.
- AURORA / MESH GLOW en arrière-plan (halos dégradés bleu→or) pour la profondeur.
- COMPTEURS KINÉTIQUES (points qui montent, jauges qui se remplissent), reveals au scroll.

INGRÉDIENTS WOW (différenciateurs) :
- Hero immersif animé ; compteur de points qui s'incrémente ; jauge de palier qui se remplit ;
  transitions de page fluides ; parallax léger ; cartes de récompense en reveal/hover ;
  motif inspiré de la SCULPTURE DU PNEU (rainures) comme signature graphique.
- Anime avec Framer Motion. Composants via Tailwind + shadcn/ui.

CONTRAINTES TECHNIQUES :
- Web app RESPONSIVE (parfaite sur mobile en navigateur), grille 12 col,
  breakpoints 360/600/960/1280/1920.
- Stack cible : Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui + Framer Motion.
- Pas d'app native. Sobre côté technique, riche côté visuel.

CE QUE JE VEUX EN SORTIE (dans l'ordre de priorité de SCREENS.md) :
1. Un DESIGN SYSTEM : palette appliquée, échelle typo, composants clés
   (header, footer Bibendum, carte de récompense, jauge de palier, compteur animé, badge,
    ligne de classement, carte de membre, modale de déblocage, toast de points).
2. La LANDING / page vision (hero wow + comment ça marche + vitrine features + section « bientôt »
   pour wallet/carte physique/événements + teaser ambassadeur).
3. Le DASHBOARD MEMBRE (solde de points animé, jauge de palier, palier actuel, feed d'activité km,
   prochaine récompense).
4. Le CATALOGUE de récompenses + une page DROP d'édition limitée numérotée.
5. La CARTE DE FIDÉLITÉ digitale animée (+ bouton « Ajouter au wallet » labellisé bientôt).
6. Le CLASSEMENT DE CLAN.
7. Les DASHBOARDS AMBASSADEUR + page candidature.

Commence par le design system + la landing + le dashboard membre. Code propre, composants
réutilisables, animations fluides. Priorité absolue : l'effet wow et la cohérence Michelin.
```

---

## ▶️ Variante courte (juste la charte / le système visuel)

```
Crée un DESIGN SYSTEM « Michelin modernisé » pour une web app premium (cyclistes passionnés),
effet wow, design-first. Garde l'ADN Michelin (bleu #27509B, jaune #FCE500, Bibendum) mais
modernise la forme (sombre premium : canvas near-black #08090F + bleu #00205B + 2 accents jaune #FCE500 / or premium #E8C24A, mouvement, glass dosé, grande typo display
+ Noto Sans corps, motif rainures de pneu en signature). Deux thèmes : immersif sombre (membre)
et éditorial clair (ambassadeur). WCAG AA, responsive, Tailwind + Framer Motion. Livre :
palette, échelle typo, et les composants (header, footer Bibendum, carte récompense, jauge de
palier, compteur de points animé, badge, ligne de classement, carte de membre, modale, toast).
Détails dans DESIGN_DIRECTION.md, DESIGN_TOKENS.md, SCREENS.md.
```

---

## ▶️ Prompt « courte vidéo / animation » (pour les features non construites)

```
Crée une courte animation (boucle ~10-15s, style motion design Michelin modernisé) qui montre
les fonctionnalités « vision/bientôt » qu'on ne construit pas : carte wallet qui s'ajoute au
téléphone, carte physique premium, accès à un événement VIP Michelin, drop d'édition limitée
numérotée. Ambiance immersive sombre, jaune énergie, fluide et premium. Servira de section
« bientôt » sur la landing et de filler dans le pitch.
```

---

## ✅ Checklist « prêt pour le tool » (vérifié)
- [x] Les `.md` sont cohérents entre eux (tokens ↔ direction ↔ écrans ↔ personas).
- [x] `DESIGN_DIRECTION.md` est marqué comme prévalant sur la rigueur de `DESIGN_TOKENS.md`.
- [x] `SCREENS.md` donne la liste + la priorité des écrans.
- [x] Personas + ambiances explicites.
- [x] Contraintes techniques (stack, responsive, AA) explicites.
- [ ] **À faire par l'équipe avant le build** : déposer le **logo Michelin (SVG) + Bibendum** dans `app/public/brand/` (marque publique, OK pour la démo ; ne PAS committer les PDF de charte confidentiels). Récupérer la police **Michelin Unit Titling** si possible, sinon fallback display moderne + Noto Sans.
