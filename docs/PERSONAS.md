# Personas & parcours — pour le pitch

> Exercice : présenter le site via **2 personas**, suivre leur navigation selon leur type, expliquer **pourquoi** ils le font + leurs **émotions**, et la **direction design** adaptée.
> Personas ancrés dans l'étude HVC réelle (cf. [`DATA_INSIGHTS.md`](DATA_INSIGHTS.md)) — pas inventés.

Le produit est **two-sided** → les 2 personas représentent les **2 faces** : le **membre** (demande) et l'**ambassadeur** (offre virale). Une seule démo les relie : l'ambassadeur recrute le membre dans son clan.

---

## 👤 Persona 1 — Léa, « La Passionnée » (côté MEMBRE)

*Inspirée du segment **Passionate Cyclist / ENTHUSIAST** (31% des HVC) + tendance féminisation citée au brief.*

| | |
|---|---|
| **Âge / profil** | 38 ans, ingénieure, vit en zone urbaine, roule route + gravel |
| **Pratique** | 4× / semaine, ~3 300 km/an, membre d'un club, suit les compétitions (94% des MTB performers) |
| **Vélo** | ~8 000 € · **hyper-connectée** : Strava quotidien, suit des personnalités, poste des avis |
| **Segment HVC** | ENTHUSIAST — haute valeur, fort renouvellement (2-4 pneus/an) |

### Pourquoi elle utilise Michelin+ (motivations)
- **Identité & appartenance** : le vélo *est* son identité ; elle veut appartenir à une tribu.
- **Reconnaissance par les pairs** : être vue, classée, validée par sa communauté.
- **Progression** : la boucle dopaminergique du km → points → palier.
- **Rareté / désir** : accéder à des **éditions limitées numérotées** que les autres n'ont pas.
- **Expérience** : décrocher une place à un **événement Michelin prestigieux**.

### Émotions à activer
Fierté · sentiment d'appartenance · **statut** · l'excitation du palier qui monte · **FOMO** sur les drops limités · gratitude/reconnaissance d'être « vue » par une marque mythique.

### Parcours de navigation (démo)
1. Arrive via un **badge « Créateur Michelin »** qu'un coéquipier a posté sur Strava → curiosité.
2. **Active sa carte post-achat** (code reçu avec ses derniers pneus) → compte Michelin+ créé.
3. **Connecte Strava** (OAuth) → ses km se synchronisent → **points crédités automatiquement**.
4. Dashboard : **progression vers le palier suivant** (data viz km / rang / points).
5. Débloque une **édition limitée numérotée Power** → ajoute au panier de récompenses.
6. Rejoint le **clan** de son ambassadeur → voit le **classement km** de son club → entre dans un **tirage au sort** pour une course sponsorisée.

### Direction design — *immersive / performance*
- **Ambiance** : hero **immersif sombre** (Bleu foncé Michelin `#00205B` / Midnight `#000C34`, **autorisés par la charte** pour les fonds immersifs) + **jaune `#FCE500` en accent énergie** (paliers, CTA, highlights).
- **Style** : dashboard *Strava-meets-premium* — **data viz** (km, rang, jauge de palier), micro-animations de progression, cartes de récompense façon « drop ».
- **Émotion visuelle** : énergie, mouvement, performance, statut. Moderne mais **pas glassmorphism gratuit** (la charte impose couleurs charte + WCAG AA + éco-conception).

---

## 👤 Persona 2 — Thomas, « L'Ambassadeur » (côté CRÉATEUR / OFFRE)

*Le côté viral : un micro-créateur qui recrute et anime une communauté.*

| | |
|---|---|
| **Âge / profil** | 29 ans, chef de club + petit créateur de contenu vélo (gravel), ~12k abonnés Instagram |
| **Statut** | A une **reconnaissance médiatique** → éligible ambassadeur |
| **Rôle** | Prescripteur : ses avis font/défont (cf. brief : le bouche-à-oreille est ÉNORME) |

### Pourquoi il devient Ambassadeur Michelin (motivations)
- **Statut / reconnaissance** : porter le badge « **Créateur Michelin** » = crédibilité, légitimité.
- **Monétisation** : gagner un **%** sur les ventes via son code.
- **Leadership communautaire** : animer **son clan**, organiser des compétitions de km.
- **Croissance d'audience** : Michelin lui apporte des contenus, des éditions à son nom, des événements.

### Émotions à activer
**Ego / statut** valorisé · fierté d'être adoubé par une marque de référence · sentiment d'**influence** · esprit entrepreneurial · appartenance à un cercle restreint de créateurs.

### Parcours de navigation (démo)
1. Arrive sur **« Devenir Ambassadeur »** → comprend la proposition de valeur (% + clan + badge + éditions).
2. **Candidate** (vérification reconnaissance médiatique) → obtient son **code ambassadeur**.
3. **Dashboard créateur** : suivi des **conversions**, du **% gagné**, de la **croissance du clan**.
4. **Classement du clan** : km cumulés de ses membres, compétitions, récompenses.
5. Débloque une **édition ambassadeur** (pneu floqué à son nom) → la partage → boucle virale qui recrute des Léa.

### Direction design — *éditorial / prestige* (même thème sombre, accent OR)
- **Ambiance** : **sombre premium** (le même canvas near-black `#08090F` + surfaces bleu `#00205B`), mais **dominé par l'OR `#E8C24A`** (statut, badge créateur), jaune en retrait.
- **Style** : plus **typographique, éditorial & aéré** (gros titres display), dashboard créateur (revenus, audience, clan), sensation de **carte de membre prestige / cercle restreint**.
- **Émotion visuelle** : confiance, prestige, sobriété haut de gamme — distingué du côté athlète par l'**accent or + le layout éditoriaux**, PAS par un thème clair.

---

## ⚖️ Note design transverse (important pour le jury)

> **Un seul système de design Michelin**, pas deux chartes. Les deux « directions » sont **deux emphases / deux modes** d'un même langage charter-compliant :
> - côté **membre/athlète** → **immersif sombre + énergie jaune** (performance),
> - côté **créateur** → **clair éditorial + bleu structurant** (prestige).
>
> Contrainte assumée : la charte digitale Michelin **interdit** le hors-piste (couleurs hors charte, contraste < AA, avant-gardisme gratuit) et **impose** l'éco-conception. Notre audace n'est donc **pas** dans un style « glass/néon » — elle est dans le **concept** (contourner le B2B, gamifier le statut premium). C'est un **argument de maturité** à assumer au pitch : *« on innove dans le produit, on respecte la marque dans la forme. »*

→ Les tokens exacts (hex, typo, grille, composants) sont dans [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md).
