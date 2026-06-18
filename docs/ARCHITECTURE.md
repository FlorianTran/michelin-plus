# Architecture — Michelin+ « Grip »

Documentation développeur de l'application. Concept produit : [`SOLUTION.md`](SOLUTION.md) ·
écrans : [`SCREENS.md`](SCREENS.md) · design : [`DESIGN_DIRECTION.md`](DESIGN_DIRECTION.md).

## Vue d'ensemble

Monolithe Next.js 16 (App Router) : le frontend (React 19, Server + Client Components) et le
backend (Route Handlers sous `src/app/api/**`) vivent dans le même process, devant une base
PostgreSQL via Prisma. Pas de service séparé — adapté à un hackathon, déployable en une image.

```
Navigateur ──► Next.js (RSC + Route Handlers) ──► Prisma ──► PostgreSQL
                   │
                   ├─ Server Components : lisent la session (cookie) + agrègent l'état (SSR)
                   ├─ Client Components : composants « Grip », fetch /api/* pour les mutations
                   └─ Route Handlers   : auth, moteur de points, debug
```

### Frontière réel / mock

| Domaine | Statut | Où |
|---|---|---|
| Points, paliers, codes, clans, récompenses, saison | **Réel** (Postgres) | `src/lib/*`, `prisma/schema.prisma` |
| Entrée Strava (km) | **Mock** — génère une sortie fictive, crédite ~10 pts/km | `POST /api/strava/sync` |
| Entrée achat | **Mock** — saisie d'un code carte → crédit réel | `POST /api/codes/activate` |
| Wallet / carte physique / goodies | **Vitrine** (non fonctionnel, labellisé « Bientôt ») | `/wallet`, landing |
| Romain Bardet (ambassadeur) | **Démo** (disclaimer footer) | `/programme-ambassadeur` |

## Modèle de données (Prisma)

`prisma/schema.prisma`. Le total de points d'un membre = **somme de ses `PointsEntry`**
(source de vérité unique ; aucune colonne dénormalisée à maintenir).

- **User** `(id, email, passwordHash, name, role: member|ambassador|admin, memberId, sinceYear, referralCode @unique, referredById)` — `referredBy`/`referrals` self-relation pour le parrainage.
- **PointsEntry** `(userId, type: purchase|km|referral|bonus|season, amount, label, meta, createdAt)` — le grand livre ; `totalPoints = Σ amount`.
- **Activity** `(userId, name, distanceKm, elevation, date, pointsAwarded, source: strava_mock|purchase|tier)` — alimente le feed d'activité.
- **CardCode** `(code, kind: activation|ambassador, pointsValue, productLabel, used, usedByUserId)` — activation réelle, à usage unique.
- **Clan** `(name, ambassadorUserId)` + **ClanMember** `(clanId, userId, km)` — classement ordonné par `km`.
- **Reward** `(title, image, tierRequired, cost, editionNumber?, editionTotal?, kind: edition|goodie|experience)` + **Redemption** `(userId, rewardId)` (unique).
- **AmbassadorProfile** `(userId, code, commissionPct, salesCount, ytdAmount, audience)` — seedé.
- **Season** `(name, endsAt, maxPoints)` + **SeasonProgress** `(userId, seasonId, seasonPoints)` — **les points de saison sont séparés du lifetime** — + **SeasonReward** `(stage, title, threshold, epic)` + **SeasonMission**.

## Moteur de points & paliers

`src/lib/tiers.ts` (pur, sans I/O → testé unitairement) et `src/lib/points.ts` (couche DB).

- **3 paliers** : Aluminium `0–5 000`, Titane `5 000–15 000`, Carbone `15 000+`.
- `tierForPoints(n)` → palier ; `tierProgress(n)` → jauge (valeur, max, restant, %) ;
  `detectTierUp(avant, après)` → palier franchi (pour les toasts/célébrations).
- `pointsForKm(km)` = `km × 10` (conversion Strava mock).
- `awardPoints(userId, amount, type, label, meta)` crée une `PointsEntry` et renvoie
  `{ total, tier, tierUp }` — utilisé par activation, sync, et debug, le tout en transaction.
- `src/lib/stats.ts` (pur) : `currentStreak(rides, today?)` (jours consécutifs avec sortie) et
  `pctDelta(courant, base)` (delta % vs mois dernier, `null` sans base) alimentent les stats du dashboard.
- `src/lib/rewards.ts` : `pickHeadlineReward(rewards)` (pur — édition la plus chère, sinon coût max)
  derrière `headlineRewardForTier` qui pilote la **pop-up de palier** (récompense vedette débloquée).

Tests : `src/lib/tiers.test.ts` (bornes de paliers, jauge de Léa, tier-up, conversion km,
arithmétique d'activation), `src/lib/stats.test.ts` (série & delta km), `src/lib/rewards.test.ts`
(sélection de la récompense vedette).

## API (Route Handlers)

| Méthode + route | Rôle | Auth |
|---|---|---|
| `POST /api/auth/signup` · `login` · `logout` · `GET me` | session | cookie |
| `POST /api/codes/activate` `{code}` | crédite des points (réel), tier-up éventuel | membre |
| `POST /api/strava/sync` | **mock** : sortie fictive → ~10 pts/km | membre |
| `GET /api/dashboard` | état agrégé (points, palier, stats, feed, prochaine récompense) | membre |
| `GET /api/clan/[id]/leaderboard` | classement du clan par km | public |
| `GET /api/rewards` · `POST /api/rewards/[id]/redeem` | catalogue + déblocage (gate par palier) | membre |
| `GET /api/referral/me` | parrainage : code, lien, filleuls, points gagnés | membre |
| `GET /api/ambassador/me` | données ambassadeur (seedé) ; 403 si non-ambassadeur | ambassadeur |
| `GET /api/season/current` | passe de saison + progression | public |
| `POST /api/debug/[action]` | `addPoints` · `addKm` · `activateCode` · `setTier` · `redeem` · `triggerToast` · `reset` | `DEBUG_TOKEN` |

Helpers : `src/lib/api.ts` (`ok`/`fail`/`handle` wrapper d'erreurs + `checkDebugToken`).
Côté client : `src/lib/client-api.ts` (`apiGet`/`apiPost`).

## Authentification

Maison, sans fournisseur externe :

1. `signup`/`login` → bcrypt vérifie le mot de passe → `createSession(userId)` signe un JWT HS256
   (`jose`) posé dans un cookie `mch_session` httpOnly/sameSite=lax.
2. Server Components & Route Handlers résolvent l'utilisateur via `getCurrentUser()` (vérifie le
   cookie → `prisma.user`). `requireUser()` lève `UnauthorizedError` (→ 401) pour les routes protégées.
3. `SESSION_SECRET` signe le cookie (≥ 32 octets en prod).

## Design system « Grip »

- **Tokens** : `src/styles/tokens/*.css` (couleurs, typo, espacements, effets) — variables CSS
  globales chargées dans le layout racine, copiées verbatim depuis l'export design.
- **14 composants** token-driven dans `src/components/grip/**` (`'use client'`, styles injectés une
  fois via `mchStyle`) : Button, Badge, Card, Avatar, PointsCounter, TierGauge, StatTile, Toast,
  UnlockDialog, Header, Footer, LeaderboardRow, RewardCard, MemberCard.
- **Chrome partagé** : `src/components/site/` (MarketingHeader, AppHeader, SiteFooter, ToastStack).
- Identité : thème sombre near-black, glassmorphism, accent jaune (énergie) / or (prestige),
  motif « tread » de pneu, imagerie cycliste N&B. Polices Archivo (display) / Noto Sans (corps).

## Flux démo (séquence)

```
login(Léa) ─► /dashboard (SSR: getDashboardState)
   │
   ├─ Activer carte ─► POST /api/codes/activate ─► awardPoints ─► toast + refetch dashboard
   ├─ Sync Strava   ─► POST /api/strava/sync     ─► awardPoints(km) ─► compteur + jauge animés
   ├─ /debug setTier(Carbone) ─► PointsEntry d'ajustement ─► palier franchi
   ├─ Débloquer récompense ─► POST /api/rewards/[id]/redeem (gate palier) ─► UnlockDialog
   └─ Classement clan ─► GET /api/clan/[id]/leaderboard (réordonné par km)
```

## Déploiement

Image Docker multi-stage (`Dockerfile`, sortie Next `standalone`). `docker-compose.yml` lance
Postgres seul (dev) ou la stack complète (`--profile app`). CI GitHub Actions
(`.github/workflows/ci.yml`) : install → prisma generate/push → seed → lint → test → type-check →
build, sur un Postgres éphémère. Variables d'environnement : voir `.env.example` + `docs/` du repo
de specs.
