# Déploiement VPS — Michelin+ (le plus simple)

Un VPS dédié (Hetzner, OVH, Scaleway, DigitalOcean…) avec Docker. La stack complète — Postgres,
migration + seed, et l'app — démarre en **une commande**.

## 1. Prérequis sur le VPS (une fois)

```bash
# Docker + plugin compose (Debian/Ubuntu)
curl -fsSL https://get.docker.com | sh
```

## 2. Cloner + configurer

```bash
git clone https://github.com/<owner>/michelin-plus.git
cd michelin-plus

# Variables de prod — lues automatiquement par docker compose
cat > .env <<'EOF'
POSTGRES_PASSWORD=<mot-de-passe-fort>
SESSION_SECRET=<32+ octets aléatoires — openssl rand -base64 32>
DEBUG_TOKEN=<jeton du panneau /debug>
APP_PORT=3000
EOF
```

> ⚠️ `.env` est **gitignored** — ne jamais le committer. Le repo est public : aucun secret réel
> n'y figure (seuls des placeholders de dev dans `.env.example`).

## 3. Lancer (une commande)

```bash
docker compose --profile app up -d --build
```

Ce que ça fait, dans l'ordre :
1. **db** — Postgres 16 (volume persistant `michelin_pgdata`).
2. **migrate** — crée le schéma (`prisma db push`) puis seed les données de démo, puis s'arrête.
3. **app** — l'app Next.js (image standalone) sur `:${APP_PORT}` (3000 par défaut).

L'app est joignable sur `http://<ip-du-vps>:3000`. Comptes : `lea@michelin.plus` /
`thomas@michelin.plus` (mdp `demo1234`).

> Le service `migrate` **réinitialise** les données de démo canoniques à chaque `up`. Pour ne pas
> réseeder lors d'un simple redémarrage, lance juste `docker compose --profile app up -d app` (sans
> recréer `migrate`), ou retire le `command` de seed une fois en prod.

## 4. HTTPS + domaine (optionnel, recommandé pour la finale)

Mets un reverse-proxy TLS devant l'app. Le plus simple, **Caddy** (certificat Let's Encrypt auto) :

```bash
# /etc/caddy/Caddyfile
michelin-plus.<ton-domaine>.fr {
    reverse_proxy localhost:3000
}
```

```bash
docker run -d --name caddy --network host -v /etc/caddy/Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data:/data caddy:2
```

Pointe l'enregistrement DNS A de ton sous-domaine vers l'IP du VPS — Caddy obtient le certificat
automatiquement. L'app est alors en `https://michelin-plus.<ton-domaine>.fr`.

## 5. Mettre à jour

```bash
git pull
docker compose --profile app up -d --build
```

## Commandes utiles

```bash
docker compose --profile app logs -f app     # logs de l'app
docker compose --profile app ps               # état des services
docker compose exec db psql -U michelin -d michelin_plus   # console SQL
docker compose --profile app down             # arrêter (les données persistent)
docker compose --profile app down -v          # arrêter + supprimer la DB
```

## Alternative serverless (Vercel + Neon)

Si tu préfères du serverless plutôt qu'un VPS : créer une base **Neon** (Postgres gratuit), poser
`DATABASE_URL` / `SESSION_SECRET` / `DEBUG_TOKEN` dans les variables Vercel, déployer le repo
(le build lance `prisma generate`). Initialiser une fois la base distante :
`DATABASE_URL=<neon> npx prisma db push && DATABASE_URL=<neon> npm run db:seed`.
