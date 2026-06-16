# App spec — écrans, composants & périmètre réel/mock

> La liste des écrans à concevoir (design) et à construire (front). Lue par **Claude design** et par le front. Concept → [`SOLUTION.md`](SOLUTION.md) · Personas → [`PERSONAS.md`](PERSONAS.md) · Visuel → [`DESIGN_DIRECTION.md`](DESIGN_DIRECTION.md) · Tokens → [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md).

## Principe de périmètre (rappel)
- ✅ **On construit la vraie logique** : moteur de **points**, **progression/paliers**, **classement de clan**, **système de codes** (carte post-achat + ambassadeur).
- 🎭 **On mocke les ENTRÉES** : données Strava (km), achats réels → seedées / simulées (un bouton « Connecter Strava » génère des km fictifs ; un achat = saisie d'un code carte).
- 🌟 **On montre (sans construire)** ce qui est trop lourd : **carte wallet**, **carte physique premium**, **événements/goodies réels**, **logistique éditions limitées** → en **vitrine sur la landing** + **courte vidéo / animation** (Claude design).

---

## A. Landing / page vision (la surface de séduction — c'est elle qui « donne envie »)

Objectif : vendre la vision à Ghachi en 30 secondes. Wow maximal. Contient aussi les features « à venir ».

| Section | Contenu | Statut |
|---|---|---|
| **Hero** | Promesse Michelin+ + visuel immersif + CTA « Rejoindre » / « Devenir ambassadeur ». Animation d'entrée. | wow |
| **Le problème → la solution** | Le cercle vicieux (Michelin invisible chez le premium) → comment Michelin+ le brise. Narratif court. | réel (contenu) |
| **Comment ça marche** | 3 étapes : **Achète** (où tu veux) → **Active** (carte+code) → **Roule & gagne** (points, paliers). | réel |
| **Vitrine fonctionnalités** | Cartes animées : points & paliers, clans, **éditions limitées numérotées**, ambassadeurs. | mix |
| **« Bientôt »** | **Carte wallet**, **carte physique premium**, **événements VIP** → montrés en visuel/vidéo, labellisés *vision*. | 🌟 showcase |
| **Programme Ambassadeur** | Teaser + CTA candidature. | réel |
| **Footer** | Légal, Bibendum « Hello », liens. | réel |

---

## B. App authentifiée (le produit réel)

### Parcours MEMBRE (Léa)
1. **Auth** — login / signup simple (fait main). Écrans propres, rapides.
2. **Activation carte post-achat** — saisir le **code** reçu avec les pneus → rejoindre Michelin+ (✅ code réel ; 🎭 l'« achat » est simulé). Animation de bienvenue + points crédités.
3. **Dashboard membre** — le cœur :
   - **Solde de points** (compteur animé),
   - **Jauge de progression** vers le palier suivant (✅ moteur réel),
   - **Palier actuel** + avantages,
   - **Feed d'activité** (km récents — 🎭 mock Strava),
   - **Prochaine récompense** à débloquer.
4. **Connecter le tracking** — bouton « Connecter Strava » → 🎭 simule une synchro de km → ✅ crédite des points réels via le moteur.
5. **Catalogue de récompenses** — grille par palier ; réductions, goodies, **éditions limitées numérotées** ; **débloquer / échanger** contre des points (✅ logique réelle, 🎭 récompenses fictives).
6. **Page « drop » édition limitée** — fiche produit d'un pneu numéroté (ex. *Power CDM #042*) — wow visuel, rareté, compteur de série.
7. **Carte de fidélité digitale** — carte de membre animée à l'écran (✅ réelle) avec bouton « **Ajouter au wallet** » labellisé *bientôt* (🌟).
8. **Clan / communauté** — **classement** des membres du clan par km/points (✅ réel), rejoindre un clan via **code ambassadeur**.

### Parcours AMBASSADEUR (Thomas)
9. **Devenir ambassadeur** — page candidature (critère reconnaissance médiatique + option micro-ambassadeur) → génération du **code** (✅ réel).
10. **Dashboard ambassadeur** — **code** + **conversions** + **% gagné** (🎭 chiffres seedés) + **croissance du clan** + **classement** de ses membres (✅ réel).

---

## Composants transverses (design system)
- **Header** : logo Michelin (SVG), nav, points/avatar si connecté, CTA, langue.
- **Footer** : légal, Bibendum « Hello », plan, réseaux.
- **Carte de récompense** (reveal/hover), **jauge de palier**, **compteur de points animé**, **badge** (palier / « Créateur Michelin »), **ligne de classement**, **carte de membre**, **modale de déblocage**, **toast** de gain de points.
- États : vide, chargement, succès, erreur (couleurs fonctionnelles de la charte).

---

## Priorité de conception (si le temps manque)
1. **Landing/hero** (donne envie — indispensable au pitch)
2. **Dashboard membre** (le cœur réel + data-viz wow)
3. **Catalogue récompenses + drop édition limitée** (le désir)
4. **Carte de fidélité digitale** (identité + « bientôt wallet »)
5. **Classement de clan** (communauté)
6. **Dashboards ambassadeur + candidature** (la boucle virale)
7. **Auth / activation** (fonctionnels, sobres)

> Mieux vaut **5 écrans wow** que 10 tièdes. Le reste se raconte au pitch + vidéo.
