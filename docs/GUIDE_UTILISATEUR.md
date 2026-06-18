# Guide utilisateur — Michelin+

Ce guide t'explique comment **te servir** de Michelin+, écran par écran — pas comment le coder.
Il couvre les deux faces du produit : le **membre** (tu roules, tu gagnes des points, tu montes en
palier) et l'**ambassadeur** (tu animes une équipe et tu touches une commission).

> **Démo de hackathon.** Michelin+ est un prototype réalisé pour le hackathon
> *ESGI × Réseau Skolae × Michelin LB 2 Wheels*. Il n'est **pas affilié officiellement à Michelin**.
> Certaines briques sont réelles (points, paliers, codes, équipes, récompenses — vraie base
> PostgreSQL), d'autres sont **simulées** ou en **vitrine** : c'est signalé à chaque fois ci-dessous.
> Pour installer et lancer l'app, voir le [`README.md`](../README.md).

---

## 1. Qu'est-ce que Michelin+ ?

Michelin+ est le **club des cyclistes premium**. L'idée tient en trois temps :

- **Un club qui s'active après l'achat.** À l'achat de pneus (en ligne **ou** en magasin), une carte
  avec un code est glissée dans l'emballage. Tu saisis le code → ton compte se crédite en points.
  Michelin n'a pas besoin de te vendre en direct : le digital s'active **après** la vente, quel que
  soit le canal.
- **Des points, des paliers.** Tu gagnes des points par tes **achats** et tes **kilomètres**, et tu
  grimpes trois paliers : **Aluminium → Titane → Carbone**. Plus le palier est haut, plus tu débloques.
- **Une communauté.** Tu rejoins l'**équipe** d'un ambassadeur, tu compares tes km au classement, tu
  parraines des amis, et tu débloques des **récompenses** et des **éditions numérotées**.

**Pour qui ?** Les cyclistes passionnés qui roulent régulièrement (côté membre), et les chefs de club
ou créateurs de contenu qui veulent animer une communauté (côté ambassadeur).

---

## 2. Premiers pas

### Accéder à l'app

Ouvre l'app dans ton navigateur (en local : `http://localhost:3000`). La page d'accueil présente le
programme ; pour entrer dans ton espace, va sur **`/login`**.

### Se connecter ou créer un compte

Sur `/login` tu peux :

- **Te connecter** avec ton email + mot de passe.
- **Créer un compte** (« S'inscrire ») avec ton nom, ton email et un mot de passe. Si tu arrives
  via un lien de parrainage, le **code du parrain** est pré-rempli et signalé.

### Comptes de démonstration

Pour explorer sans rien créer, deux boutons « Démo rapide » te connectent en un clic
(mot de passe `demo1234` pour les deux) :

| Bouton | Compte | Email | Rôle | Palier | T'amène sur |
|---|---|---|---|---|---|
| **Entrer comme Léa (membre)** | Léa Moreau | `lea@michelin.plus` | membre | Titane | `/dashboard` |
| **Entrer comme Romain Bardet (ambassadeur)** | Romain Bardet | `romain@michelin.plus` | ambassadeur | Carbone | `/ambassador-dashboard` |

> *Léa* incarne la persona « membre » et *Romain Bardet* la persona « ambassadeur » des docs produit.
> Pour utiliser l'app, ce sont bien ces deux comptes-là.

### Se repérer dans la navigation

- **Sur mobile** : une barre d'onglets en bas de l'écran — **Accueil** (tableau de bord),
  **Récompenses**, **Équipe** (parrainage), **Carte** (wallet).
- **Sur ordinateur** : un menu en haut — **Tableau de bord**, **Récompenses**, **Paliers**,
  **Parrainage**. Ton avatar (en haut) renvoie au tableau de bord.
- **Sur les pages publiques** (accueil, paliers, ambassadeur) : un menu **Comment ça marche · Paliers
  · Étapes · Ambassadeur**.

---

## 3. Activer ta carte

C'est le point d'entrée dans le club : ton code transforme un achat de pneus en points.

1. **Trouve ton code.** Il figure sur la carte glissée dans l'emballage de tes pneus.
2. Depuis le **tableau de bord**, clique sur **« Activer une carte »** (bouton jaune).
3. **Saisis ton code** dans la fenêtre (le champ met automatiquement en majuscules) puis **Activer**.
4. Tes **points sont crédités** immédiatement et une notification confirme le produit + le gain.

**Codes de démonstration disponibles :**

| Code | Points | Produit |
|---|---|---|
| `GRIP-2000` | +2 000 | Power Cup 700×28 |
| `MICH-CLASSIC` | +1 500 | Power Road Classic |
| `CARBON-CDM` | +3 000 | Power CDM Carbone |
| `PILOT-SPORT` | +2 500 | Pilot Sport Vélo |
| `AMBASS-2026` | +5 000 | Pack ambassadeur |

> **Astuce démo.** Léa est à Titane, à ~3 000 pts du palier Carbone. Active `CARBON-CDM` (+3 000) :
> elle bascule **Titane → Carbone** en direct et une **pop-up de palier** s'ouvre avec la récompense
> nouvellement débloquée. Chaque activation est une vraie écriture en base — un code déjà utilisé est
> refusé.

---

## 4. Connecter Strava & gagner des points

Tes kilomètres comptent autant que tes achats : **10 points par kilomètre**.

1. Depuis le tableau de bord, clique sur **« Synchroniser Strava »** (bouton bleu).
2. Une sortie est importée, convertie en points, et tes stats se mettent à jour. Si le gain te fait
   changer de palier, la pop-up de palier s'affiche.

**Tes deux sources de points :**

- **Kilomètres** — via la synchronisation Strava (10 pts/km).
- **Achats** — via l'activation d'une carte produit.
- *(Bonus : le parrainage rapporte aussi des points — voir §9.)*

> **Réel vs simulé.** Dans la démo, **Strava est simulé** : le bouton « Synchroniser » importe une
> sortie générée pour la démonstration — aucun compte Strava réel n'est appelé. En revanche, les
> points, le calcul de palier et l'historique sont **réellement écrits** en base.

---

## 5. Ton tableau de bord (`/dashboard`)

C'est ton écran principal de membre. Toutes les valeurs sont **calculées depuis tes données réelles**.

- **Solde de points** — ton total, et la répartition : *ce mois*, *achats*, *kilomètres*.
- **Progression de palier** — une jauge vers le palier suivant + ce que ton palier actuel débloque.
- **KM ce mois** — avec le delta (±%) par rapport au mois précédent.
- **Rang équipe** — ta position dans le classement de ton équipe (si tu en as une).
- **Série en cours** — ton nombre de jours consécutifs de sortie.
- **Récompenses** — combien tu en as déjà débloquées.
- **Activité récente** — le fil de tes sorties, achats et paliers atteints.
- **Prochaine récompense** — la prochaine à portée, débloquable directement.
- **Ta carte de membre** — aperçu de ta carte (nom, palier, numéro, points).
- **Classement de l'équipe** — les km cumulés de ton équipe, mis à jour en direct.

Les boutons **« Synchroniser Strava »** et **« Activer une carte »** sont accessibles en haut de cet
écran (et dans la carte « Solde de points » sur mobile).

---

## 6. Les paliers (`/tiers`)

Trois paliers, trois matières de carte. Ton palier dépend de ton **total de points à vie** :

| Palier | Seuil | Ce qu'il débloque |
|---|---|---|
| **Aluminium** | 0 – 4 999 pts | Accès au club · récompenses standard · équipe & classements |
| **Titane** | 5 000 – 14 999 pts | Récompenses premium · drops prioritaires · missions |
| **Carbone** | 15 000 pts et + | Éditions numérotées · statut ambassadeur · événements VIP |

La page **Paliers** montre les trois cartes (aluminium brossé → titane gunmetal → carbone tissé liseré
d'or) et les avantages de chacune. Tu montes de palier automatiquement dès que ton total franchit un
seuil — via Strava **ou** via une activation de carte.

---

## 7. Récompenses & éditions numérotées (`/rewards`)

Le catalogue est organisé en trois familles :

- **Éditions numérotées** — séries limitées, chaque pièce porte son numéro (ex. *Power CDM #042/500*).
  **Palier Carbone requis.**
- **Goodies** — accessoires et équipements (stickers, gourde, casquette, t-shirt…), selon ton palier.
- **Expériences** — événements et rencontres réservés aux membres (ex. *Weekend VIP course Michelin*).

Chaque récompense affiche son **coût en points**, le **palier requis** et un bouton **« Débloquer »**.
Si ton palier est trop bas, la récompense est **verrouillée** (un message t'indique le palier requis).
Quand tu débloques, une fenêtre de confirmation l'ajoute à ton espace membre.

> Les **éditions limitées numérotées** sont le « hook » prestige du programme : elles matérialisent
> la rareté (numéro de série, palier Carbone, parfois floquées à ton nom).

---

## 8. Étapes — le parcours « L'Ascension » (`/passe-saison`)

Accessible via **Étapes** dans le menu public. C'est un parcours de progression, baptisé
**« L'Ascension »** :

- **Le ladder (échelle d'étapes)** — une suite d'étapes ; chaque palier d'étape débloque une
  récompense, dont des **éditions épiques numérotées** (signalées d'un badge « Numérotée »). Ton étape
  actuelle et ta progression en points sont affichées en haut.
- **Le Grand Prix** — la récompense d'exception au sommet du parcours.
- **Les missions** — des objectifs à points pour avancer plus vite, par exemple :
  *Roule 100 km cette semaine (+500 pts)*, *Active une carte produit (+2 000 pts)*,
  *Invite un ami dans ton équipe (+1 000 pts)*.

Tu progresses simplement en accumulant des points (km, achats, parrainage) et en accomplissant les
missions.

---

## 9. Parrainage (`/parrainage`)

Invite des amis, gagnez tous les deux.

1. Ouvre **Parrainage** (onglet **Équipe** sur mobile). Tu y trouves ton **lien de parrainage** et ton
   **code** unique (celui de Léa : `LEA-2024`).
2. **Partage-le** : bouton *Copier*, ou partage direct via **WhatsApp / Email / X**.
3. Quand un ami rejoint Michelin+ via ton lien, **tu reçois +1 000 points** et il entre dans le club
   avec sa propre carte.
4. La page suit tes **filleuls** (nom + date d'arrivée), ton **nombre de filleuls** et tes **points
   gagnés**.

**Côté invité** — quand quelqu'un ouvre ton lien, il arrive sur une page d'invitation
**`/parrainage/<code>`** (« *X t'invite dans Michelin+* ») qui présente le club et propose de
**rejoindre** : le code du parrain est alors pré-rempli sur l'écran d'inscription.

---

## 10. Rejoindre une équipe

Une équipe regroupe les membres d'un ambassadeur autour d'un classement de kilomètres.

1. Depuis le **tableau de bord**, dans la carte **Classement**, clique sur **« Rejoindre une équipe »**
   (ou le bouton **« + Code »** si tu es déjà dans une équipe).
2. **Saisis le code de ton ambassadeur** (code de démo : **`BARDET-LYON`**, l'équipe de Romain Bardet).
3. Tu rejoins l'équipe immédiatement et le **classement km se réordonne en direct** — tu vois ta
   position parmi les autres membres.

---

## 11. Devenir & être ambassadeur

L'ambassadeur est la face « offre » du produit : il recrute, anime une équipe et touche une commission.

### Découvrir le programme (`/programme-ambassadeur`)

La page **Ambassadeur** présente la proposition de valeur du « Créateur Michelin » :

- **Un pourcentage reversé** sur les ventes générées par ton code (12 % au niveau ambassadeur).
- **Ta propre équipe** à recruter et animer.
- **Des éditions numérotées à ton nom**.

Le parcours se fait **en 3 étapes** : *Candidate → Reçois ton code → Anime & gagne*. Deux niveaux
existent : **Ambassadeur** (figure publique, 12 %) et **Micro-ambassadeur** (chef de club local, 6 % +
bonus communauté — ex. Sofia, code `SOFIA-CLUB`). Pour candidater, le bouton renvoie vers `/login`.

### L'espace ambassadeur (`/ambassador-dashboard`)

Une fois connecté en ambassadeur (bouton démo **« Entrer comme Romain Bardet »**), tu accèdes à ton
tableau de bord créateur :

- **Ton code ambassadeur** (`BARDET-LYON`) — copiable en un clic pour le partager.
- **Commission & revenus** — pourcentage par vente, total reversé sur l'année, nombre de ventes
  générées, taille de ton audience.
- **Ton équipe** — le **classement des km** de tes membres, et la croissance de l'équipe.
- **Tes éditions ambassadeur** et le prochain **événement ambassadeur**.

> Si tu ouvres cet espace avec un compte **membre** (non ambassadeur), tu vois un écran d'invitation
> « Deviens Créateur Michelin » qui renvoie vers le programme — l'espace est réservé aux ambassadeurs.

---

## 12. Ta carte & ton wallet (`/wallet`)

Accessible via l'onglet **Carte** (mobile). Tu y trouves :

- **Ta carte digitale** — un aperçu fidèle (solde de points, palier, numéro de membre, QR à présenter
  en magasin), tel qu'il apparaîtrait dans Apple Wallet / Google Wallet.
- **La carte physique premium** — vitrine d'une carte métal en carbone, liseré or, gravée à ton nom,
  réservée aux paliers Titane et Carbone. Avec sa puce **NFC**, elle serait **utilisable chez les
  revendeurs partenaires** : un geste au comptoir créditerait tes points et confirmerait ton statut.

> **Vitrine.** L'ajout à Apple Wallet / Google Wallet et la carte physique sont des fonctionnalités
> **« Bientôt »** — présentées pour montrer la vision, pas encore activables dans la démo. Le bouton
> « Ajouter au wallet » est volontairement désactivé.

---

## 13. Confidentialité (`/confidentialite`)

La page **Confidentialité & cookies** décrit, à titre d'exemple, comment une version réelle du service
traiterait tes données : **données Strava** (importées avec ton accord, révocables), **profilage de
fidélité** (calcul des paliers et classements au sens RGPD), **tes droits** (accès, rectification,
effacement, portabilité…) et **les cookies** (un seul cookie de session essentiel ; mesure et
personnalisation refusées par défaut).

Tu y accèdes par les liens **Mentions légales / Confidentialité / Cookies / Accessibilité** en bas de
page, ou via **« En savoir plus »** dans la bannière cookies. C'est un document de démonstration — il
ne remplace pas un avis juridique.

---

## 14. FAQ / dépannage

- **Je ne vois pas mes points après une activation.** Recharge le tableau de bord : les stats sont
  recalculées à chaque visite. Vérifie aussi que le code n'a pas déjà été utilisé (un code
  d'activation ne sert qu'une fois).
- **La synchronisation Strava ne « connecte » pas mon vrai compte.** Normal : dans la démo, Strava est
  **simulé**. Chaque clic importe une sortie de démonstration.
- **Comment changer de palier rapidement (pour une démo) ?** Active un code qui franchit un seuil
  (ex. `CARBON-CDM`), ou utilise la page **`/debug`** (voir ci-dessous) pour forcer un palier.
- **J'ai oublié mon mot de passe.** La démo n'a pas de réinitialisation de mot de passe. Utilise les
  **comptes de démo** (`lea@` / `romain@michelin.plus`, mot de passe `demo1234`), ou réinitialise
  l'ensemble de la démo via `/debug` (« Reset démo »).
- **L'espace ambassadeur m'est refusé.** Il est réservé aux comptes **ambassadeur**. Connecte-toi en
  tant que Romain Bardet.

### Page `/debug` — outil de démonstration

`/debug` est un **panneau de pilotage de la démo**, protégé par un token (`DEBUG_TOKEN`, valeur par
défaut `grip`). Il permet d'ajouter des points/km, d'activer un code, de **forcer un palier**, de
débloquer une récompense, de déclencher une notification, ou de **réinitialiser** entièrement la démo —
et il affiche la **preuve technique** (écritures réelles en base, rafraîchies en direct). C'est un
outil de présentation, pas une fonctionnalité destinée aux membres.

---

## 15. Rappel

Michelin+ est une **démo de hackathon** (*ESGI × Réseau Skolae × Michelin*), **non affiliée
officiellement à Michelin**. Les noms, images et logos sont des exemples fictifs à but de
démonstration. Pour l'installation et le détail technique, voir le [`README.md`](../README.md).
