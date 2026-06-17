# Michelin+

Programme communautaire & de fidélité pour cyclistes premium — application du hackathon
**ESGI × Réseau Skolae × Michelin LB 2 Wheels** (juin 2026).

Michelin+ crée la demande **sans boutique directe** : une carte glissée dans l'emballage active
le digital **après l'achat**. On gagne des points (achats + kilomètres), on grimpe **3 paliers**
(Aluminium → Titane → Carbone), on débloque récompenses et **éditions numérotées**, et on rejoint
le **clan** d'un ambassadeur.

> **Réel vs mock.** Le moteur de valeur est **réel** (DB Postgres, points, paliers, codes
> d'activation, clans/classement, récompenses). Les **entrées** sont **mockées** : Strava (bouton
> « Synchroniser ») et achats (saisie d'un code carte). Wallet / carte physique / goodies =
> **vitrine** labellisée. Démo non affiliée officiellement à Michelin.

## Stack

Next.js 16 (App Router) · TypeScript strict · React 19 · Prisma 6 + PostgreSQL 16 ·
auth maison (bcrypt + cookie de session signé JWT/HS256) · design system « Grip » token-driven ·
Vitest · Docker · GitHub Actions.

## Démarrer en local

```bash
# 1. Base de données (Docker) — Postgres sur localhost:55434
docker compose up -d db

# 2. Dépendances + env
npm install
cp .env.example .env        # valeurs de dev par défaut (déjà correctes)

# 3. Schéma + données de démo
npx prisma db push          # crée les tables
npm run db:seed             # Léa, Thomas, clan Gravel Lyon, récompenses, codes…

# 4. Lancer
npm run dev                 # http://localhost:3000
```

### Comptes de démo (mot de passe `demo1234`)

| Compte | Email | Rôle | Palier |
|---|---|---|---|
| **Léa Moreau** | `lea@michelin.plus` | membre | Titane (12 480 pts) |
| **Thomas Vidal** | `thomas@michelin.plus` | ambassadeur | Carbone |

Raccourci : `/login` propose des boutons « Entrer comme Léa / Thomas ».
**Codes d'activation** : `GRIP-2000`, `MICH-CLASSIC`, `CARBON-CDM`, `PILOT-SPORT`, `AMBASS-2026`.

## Parcours démo (happy path)

1. `/login` → « Entrer comme Léa ».
2. Dashboard → **Activer une carte** (`GRIP-2000`) → +2 000 pts + toast.
3. **Synchroniser Strava** → km mockés → le compteur monte, la jauge de palier progresse.
4. **Forcer Carbone** depuis `/debug` (ou cumuler) → la jauge passe Titane → Carbone.
5. **Prochaine récompense** → *Débloquer* une édition numérotée → modal de déblocage.
6. **Classement du clan** Gravel Lyon (réordonné par km, en temps réel).
7. Bascule **ambassadeur** (Thomas) → code, commission, clan, programme Bardet.

### Page debug — `/debug`

Panneau de contrôle de la démo (gated par `DEBUG_TOKEN`, défaut `grip`) : ajouter des points/km,
activer un code, **forcer un palier**, débloquer une récompense, déclencher un toast, **reset**
complet de la démo. Indispensable pour piloter la présentation sans dépendre des entrées réelles.

## Écrans

| Route | Écran | Données |
|---|---|---|
| `/` | Landing (hero B&W animé, narratif, paliers, ambassadeur) | statique |
| `/dashboard` | Tableau de bord membre (bento : compteur, jauge, feed, clan, carte) | **DB réelle** |
| `/tiers` | Les 3 paliers (cartes alu / titane / carbone) | moteur de paliers |
| `/rewards` | Catalogue de récompenses + déblocage | **DB réelle** |
| `/ambassador-dashboard` | Espace ambassadeur (code, commission, clan) | **DB réelle** |
| `/programme-ambassadeur` | Recrutement ambassadeur (Romain Bardet) | statique |
| `/passe-saison` | Passe Saison « L'Ascension » (ladder + missions) | **DB réelle** |
| `/parrainage` | Parrainage : lien partageable, filleuls, points gagnés | **DB réelle** |
| `/parrainage/[code]` | Page d'invitation publique (« X t'invite ») | **DB réelle** |
| `/wallet` | Vitrine carte digitale + **carte physique carbone** | vitrine |
| `/login` · `/debug` | Auth · panneau de démo | — |

## Scripts

```bash
npm run dev          # serveur de dev (Turbopack)
npm run build        # prisma generate + next build (sortie standalone)
npm start            # serveur de prod
npm run lint         # ESLint (flat config)
npm run type-check   # tsc --noEmit
npm test             # Vitest (moteur points/paliers + activation)
npm run db:seed      # (re)peupler la démo
npm run db:reset     # reset migrations + reseed
```

## Déploiement

- **Docker** : `docker compose --profile app up` (Next + Postgres) — image multi-stage `Dockerfile`
  (sortie `standalone`). Variables : `DATABASE_URL`, `SESSION_SECRET`, `DEBUG_TOKEN`.
- **Vercel + Neon** : pousser le repo, brancher une base Neon (Postgres serverless) via
  `DATABASE_URL`, définir `SESSION_SECRET` + `DEBUG_TOKEN`. `prisma generate` tourne au build ;
  appliquer le schéma avec `prisma db push` puis `npm run db:seed` (one-shot) sur la base distante.
- **CI** : `.github/workflows/ci.yml` — lint + tests + type-check + build sur Postgres éphémère.

## Architecture

Voir [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modèle de données, contrats d'API, moteur de
points/paliers, flux d'authentification, et frontière réel/mock. Design : [`docs/DESIGN_DIRECTION.md`](docs/DESIGN_DIRECTION.md)
et [`docs/DESIGN_TOKENS.md`](docs/DESIGN_TOKENS.md). Concept produit : [`docs/SOLUTION.md`](docs/SOLUTION.md).
