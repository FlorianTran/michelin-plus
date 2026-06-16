# Solution — Michelin+ : le programme qui crée la demande sans boutique

> Concept de l'équipe, structuré + critiqué + priorisé pour les ~2,5 jours de dev.
> À lire avec [`BRIEF.md`](BRIEF.md), [`DATA_INSIGHTS.md`](DATA_INSIGHTS.md), [`PERSONAS.md`](PERSONAS.md).

> 🧭 **Posture (décidée mardi 16) : on vend une VISION, pas un produit fini.** On construit ce qui est crédible, on **mocke** ce qui est lourd (Strava, wallet, carte physique, goodies réels). Wow visuel + stratégie > technicité. **Périmètre réel-vs-mock + stack + planning = [`PROJECT_PLAN.md`](PROJECT_PLAN.md). Direction visuelle = [`DESIGN_DIRECTION.md`](DESIGN_DIRECTION.md).** Les sections « stack » et « MVP » ci-dessous sont remplacées par PROJECT_PLAN.

## Le pitch en une phrase

**Michelin ne peut pas vendre en direct (B2B) — alors on ne construit pas une boutique, on construit la *couche d'engagement* qui transforme chaque achat (online ou magasin) en entrée dans un écosystème communautaire, gamifié et statutaire qui crée la demande, les avis et le bouche-à-oreille.**

> 🎯 C'est exactement l'attaque du **cercle vicieux** du brief : faible demande → peu de visibilité. Ici on génère demande + avis + communauté = le levier #1 cité par le client.

---

## Les 3 piliers retenus

### 1. Club **Michelin+** (le cœur — moteur de fidélité & demande)
- **Activation post-achat** (la réponse au problème B2B) : à l'achat de pneus (online **ou** magasin), une **carte avec un code** est glissée dans le packaging. Le client saisit le code → crée/alimente son compte Michelin+ → gagne des **points**. *Michelin n'a pas besoin de vendre en direct : le digital s'active **après** la vente, peu importe le canal.*
- **Gagner des points** : achats Michelin + **km parcourus via Strava** (et futurs partenaires apps).
- **Paliers / tiers** : plus de points → paliers plus prestigieux.
- **Récompenses par palier** : réductions · goodies · **éditions limitées / rares de pneus** · **tirages au sort** pour des places à des **événements sponsorisés Michelin** (plus le palier est haut, plus l'événement/accueil est prestigieux).
- **Carte de fidélité** : dans le **wallet** (Apple/Google) ; à un palier élevé, une **carte physique premium** utilisable chez les revendeurs.

### 2. **Ambassadeur Michelin** (le levier viral — two-sided)
- **Code ambassadeur / code créateur** : l'ambassadeur promeut, gagne un **%**, ses clients obtiennent une **réduction** et rejoignent son **clan/club**.
- **Page candidature** : devenir ambassadeur (critère mini : une **reconnaissance médiatique**) → obtention du code.
- **Badge « Créateur Michelin »** affiché sur **Strava**.
- **Clan de l'ambassadeur** : courses partagées · forum/discussion · km cumulés · **compétitions de km** avec classements et récompenses.
- Investissement dans le programme / appartenance à une équipe → **éligibilité à des lots** sur événements.

### 3. **Éditions limitées & personnalisées** (le désir — la rareté)
- Pneus **« floqués »** : texte personnalisé · éditions par **événement** (Coupe du Monde + pays, édition sportif pro/supporter) · **édition ambassadeur** · **édition numérotée**.
- ✅ **Faisabilité logistique forte** : Michelin **floque déjà du texte sur les pneus** → pas de nouvelle machine dédiée. *(Argument métier solide à mettre en avant : réalisable, pas un fantasme.)*

---

## Pourquoi ça coche la grille (auto-évaluation)

| Critère | Poids | Pourquoi on score |
|---|---|---|
| **Réponse métier** | 6 | Attaque directe du cercle vicieux ; génère demande + avis + communauté ; **résout la contrainte B2B** sans boutique ; cible exactement le HVC ENTHUSIAST (Strava, clubs, compétition). |
| **Qualité technique** | 5 | **Intégration Strava (OAuth2 + activités→km→points)**, moteur de points/paliers, attribution de codes (referral), activation post-achat, wallet. Vraie matière d'archi 5A. |
| **Créativité** | 4 | Clan d'ambassadeur, éditions numérotées par événement, activation par carte post-achat = **angle inattendu** (on contourne le B2B au lieu de le subir). |
| **UX / identité visuelle** | 3 | Design charter-compliant + parcours persona (cf. `PERSONAS.md`). |
| **Pitch** | 2 | Démo narrée par persona = vendeur. |

---

## ⚠️ Risques & arbitrages critiques (à trancher)

1. **Scope >> 2,5 jours.** Loyalty engine + ambassadeur + marketplace d'éditions + Strava + forum + tirages + carte physique = 6 mois de roadmap, pas 2 jours. **La grille récompense la *priorisation MVP* (coef 4)** → il FAUT un *vertical slice* démontrable end-to-end, pas 10 features à moitié. → voir MVP ci-dessous.
2. **« Passe de combat » → reformuler.** Un mécanisme « battle pass » façon Fortnite peut sonner *cheap* pour un cycliste qui met 8 000 € dans son vélo. Garder l'idée (**défis de saison / paliers de statut**) mais avec un **ton premium/prestige**, pas gaming.
3. **Éligibilité ambassadeur « reconnaissance médiatique » exclut le cœur de cible.** Le gros de la valeur HVC = Cyclist Lover (23%) + Passionate (8%), pas que des influenceurs. → Prévoir **2 niveaux** : *micro-ambassadeur* (tout membre actif / chef de club) et *ambassadeur média*. Sinon on se prive de 90% du levier communautaire.
4. **Km Strava → points → récompense** : risque de *junk miles* / triche, + l'API Strava a des **quotas** et des règles de marque. OK pour une démo, à border (anti-abus = bonus crédibilité technique).
5. **RGPD.** Données Strava + profilage fidélité = données perso. La charte Michelin **impose** RGPD/cookies/mentions. Un mot là-dessus = points « architecte 5A » + cohérence marque.
6. **Économie des récompenses** (% ambassadeur + réducs + pneus rares) a un impact marge. Pas à résoudre, mais **l'évoquer** dans le pitch = maturité métier.

---

## MVP recommandé (le *vertical slice* à démontrer vendredi)

**Hero = la boucle membre Michelin+ activée par la carte post-achat + Strava.** C'est le plus impressionnant techniquement, le plus on-brief, et le plus démontrable.

Parcours démo de bout en bout (1 persona) :
1. **Activation carte post-achat** : saisir un code carte → création compte Michelin+ *(la réponse B2B — à mettre en scène).*
2. **Connexion Strava (OAuth)** → import des activités → **km → points** automatiques.
3. **Moteur points/paliers** → dashboard de progression vers le palier suivant.
4. **Catalogue de récompenses** incl. **éditions limitées numérotées** → « débloquer / échanger ».
5. **Côté ambassadeur (flow secondaire)** : page candidature → génération de code → **classement du clan** (km cumulés des membres).

Seed de la **vraie DB produit** (442 SKU du catalogue) → démo crédible, pas du mock.

### Stack proposée (à confirmer)
- **Front** : Next.js 16 + Tailwind (tokens charte Michelin) + Noto Sans. Responsive 360→1920, WCAG AA.
- **Back** : API (Next route handlers ou Fastify) + **PostgreSQL** (points, tiers, codes, users, products).
- **Intégration** : **Strava OAuth2** + fetch/webhook activités.
- **Infra** : **Docker** + **GitHub Actions (CI/CD)** + déploiement (Vercel / Railway / Fly.io). Tests unitaires + intégration (Vitest).
- **Wallet** : pass Apple/Google (stretch) ou simple carte QR/NFC.

### Angle créativité optionnel (ESP32 — flash péda dédié mardi)
La carte physique premium pourrait être **NFC** ; un **scan NFC/QR** (ou un mock ESP32) qui crédite des points ou s'authentifie chez le revendeur = **brique IoT** qui décroche les points « audace » — **mais hors chemin critique**, à ne tenter que si le MVP est bouclé.

---

## Nom & ton
**Michelin+** fonctionne (club, statut, premium). Alternatives à tester au pitch : *Michelin Riders Club*, *Michelin Élite*. Ton = **premium, communauté, performance** — jamais « gaming cheap ».
