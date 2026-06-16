# Project plan & management — Michelin+

> **Décisions verrouillées (mardi 16 juin).** Lire avec [`SOLUTION.md`](SOLUTION.md) (concept), [`PERSONAS.md`](PERSONAS.md) (pitch), [`DESIGN_DIRECTION.md`](DESIGN_DIRECTION.md) (wow/visuel).

## 🎯 Posture stratégique (la décision cadre)

**On vend une VISION, pas un produit fini.** Objectif = **donner envie au client** (Ghachi) d'adopter la solution. Hackathon d'1 semaine → **réalisme** : on **construit ce qui est crédible**, on **mocke ce qui est lourd**. **Le wow visuel + la stratégie priment sur la technicité.**

> Conséquence sur la grille : on maximise **Réponse métier (6)** + **Créativité (4)** + **UX/visuel (3)** = 13/20. On assure le minimum syndical sur **Technique (5)** (déployé, Docker, CI/CD, tests présents) sans sur-investir. **Pitch (2)** porté par le storytelling persona.

---

## ✅ Réel vs 🎭 Mocké (le périmètre)

| Élément | Statut | Note |
|---|---|---|
| Système de **points** | ✅ Réel | logique simple : actions → points |
| **Codes** (carte post-achat + code ambassadeur) | ✅ Réel | saisie code → activation / attribution |
| **Carte de fidélité digitale** (à l'écran) | ✅ Réel | ❌ PAS de carte physique, ❌ PAS de wallet Apple/Google (trop complexe) |
| **Paliers / tiers** + **catalogue de récompenses** | ✅ Réel | déblocage par points, sur données seedées |
| **Dashboard membre** + **classement de clan** | ✅ Réel | data seedée/mockée crédible |
| **Auth** | ✅ Réel mais **simple, fait main** | ❌ pas de Clerk/Auth0 (trop de temps) — Claude code un login cookie/session basique |
| **Intégration Strava / tracking** | 🎭 **Mocké** | nécessite partenariat Strava → bouton « Connecter Strava » → **simule** des km synchronisés |
| **Goodies / récompenses réelles / événements** | 🎭 **Mocké** | stratégie future, pas de stock réel |
| **Éditions limitées de pneus** | 🎭 Visuel | maquettes produit (mockups), pas de vrai pneu |
| **App mobile native** | ❌ Abandonnée | **web app responsive** (parfaite sur mobile en navigateur) = moins complexe, suffisant |

> 🗣️ **À assumer au pitch** : « Ceci est une **première version / preuve de concept** d'une stratégie déployable en ~6 mois. Strava, wallet et logistique des éditions sont **simulés** pour la démo. »

### Règle d'or du périmètre (affinée)
- ✅ **Le MOTEUR est réel** : points, progression/paliers, classement de clan, système de codes. C'est notre profondeur technique — ça ne doit PAS être du faux.
- 🎭 **Seules les ENTRÉES sont mockées** : km Strava, achats → seedés/simulés (bouton « Connecter Strava » = km fictifs ; achat = saisie d'un code carte).
- 🌟 **Ce qu'on ne peut pas faire vite (wallet, carte physique, événements/goodies réels)** → **vitrine sur la landing + courte vidéo** Claude design, labellisé *vision/bientôt*. On ne le construit pas, on le **montre**.

---

## 🏗️ Stack (décidée — optimisée hackathon + wow + déployable)

- **Next.js 16 (App Router) + TypeScript** — un seul repo, déploiement instantané.
- **Tailwind CSS** + **shadcn/ui** (composants polis, rapides) + **Framer Motion** (animations = LE différenciateur wow).
- **Prisma + Postgres (Neon, free tier)** — persistant, zéro ops ; seed depuis le catalogue 442 SKU pour le réalisme.
- **Auth fait main** : credentials + cookie de session signé (Claude l'implémente). Pas de SaaS d'auth.
- **Déploiement : Vercel** (URL en ligne instantanée → coche « déployée et accessible »).
- **Cases à cocher livrable (peu de temps, gros effet)** :
  - **Docker** : `Dockerfile` + `docker-compose.yml` fournis (coche « conteneurisation »).
  - **CI/CD** : **GitHub Actions** (lint + test + build au push).
  - **Tests** : **Vitest** (unitaires sur la logique points/tiers) + 1-2 tests d'intégration. Suffisant pour cocher la case.

---

## 📅 Plan jour par jour (on est mardi 16 — finale vendredi 19)

### Mardi 16 — Fondations & design (AUJOURD'HUI)
- [ ] Décisions verrouillées (ce doc) ✅
- [ ] **Créer le GitHub PUBLIC** (livrable du jour) — code uniquement, pas d'assets confidentiels
- [ ] **Design : maquettes Figma** des écrans clés (hero, dashboard membre, carte, catalogue récompenses, page ambassadeur) — *workstream prioritaire*
- [ ] **Direction visuelle « Michelin modernisé »** validée (cf. `DESIGN_DIRECTION.md`)
- [ ] Scaffold Next.js + Tailwind + tokens + shadcn + Framer Motion
- [ ] **Dépôt HackPilot** : premiers éléments techniques + lien GitHub public

### Mercredi 17 — Construction du cœur
- [ ] Auth simple (login/session)
- [ ] Modèle de données + seed (catalogue produit, users démo, codes)
- [ ] **Activation carte post-achat** (saisie code → compte Michelin+)
- [ ] **Moteur points / paliers** + **dashboard membre**
- [ ] **Mock Strava** (bouton → km simulés → points)
- [ ] **Catalogue récompenses** + déblocage par palier
- [ ] **Dépôt HackPilot** : ~50% du produit

### Jeudi 18 — Finition, wow & livrables
- [ ] **Côté ambassadeur** : page candidature → code → **classement de clan**
- [ ] **Éditions limitées** (écrans produit mockés, « numéroté »)
- [ ] **Polish wow** : animations Framer Motion, transitions, micro-interactions, responsive 360→1920
- [ ] Doc **développeur** (README, archi, install, déploiement) + **Dockerfile** + **CI/CD** + tests
- [ ] **Vidéo de démo** (filet de sécurité si l'appli plante au pitch)
- [ ] **Oraux blancs** (répétition)
- [ ] **Dépôt HackPilot** : 100% livrable technique + documentation

### Vendredi 19 — Pitch
- [ ] Matin : prépa + soutenance **Campus** (éliminatoire)
- [ ] **14h : finale devant Ghachi** — pitch persona (Léa + Thomas), démo commentée, 10 min + 5 min Q&A
- [ ] **Dépôt HackPilot** : slides + vidéo

---

## 👥 Workstreams (à répartir dans l'équipe)

| Workstream | Priorité | Contenu |
|---|---|---|
| **Design / UX** | 🔴 #1 | Figma → écrans, système « Michelin modernisé », parcours persona, wow |
| **Frontend** | 🔴 #1 | Next.js + Tailwind + Framer Motion ; intègre les écrans, responsive |
| **Backend (léger)** | 🟡 | Auth simple, moteur points/codes/tiers, seed DB, endpoint mock Strava |
| **Stratégie / Pitch** | 🟠 | Business case (métier 6 pts), narration persona, slides, script démo, vidéo |

> Front + Design avancent en parallèle ; le back est volontairement mince. Le **pitch se prépare en continu**, pas la veille.

---

## ⚠️ Risques à garder en tête
- **Sur-scope** = ennemi #1. Si on est en retard : on **mocke plus**, on garde le **parcours membre** beau et fluide. Mieux vaut 4 écrans wow qu'10 écrans à moitié.
- **Modernisation de la charte** : oser le wow **sans perdre l'ADN Michelin** (bleu/jaune/Bibendum reconnaissables) — sinon on perd les points « cohérence marque ». Cf. `DESIGN_DIRECTION.md`.
- **Démo live qui plante** → la **vidéo de secours** est obligatoire (tip officiel du brief).

## ➡️ Prochaine étape (sur ton GO)
1. Créer le repo GitHub public + scaffold technique.
2. Lancer le design (Figma / Claude design) sur le hero + dashboard membre.
> *Rien n'est lancé tant que tu n'as pas validé ce plan.*
