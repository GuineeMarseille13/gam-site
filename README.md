# Guinée à Marseille (GAM)

Site web officiel de l'association **Guinée à Marseille** : vitrine publique, boutique, adhésions, dons, et espaces d'administration pour le bureau, la permanence administrative et le pôle hébergement & relation.

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Lancer l'application](#lancer-lapplication)
- [Scripts utiles](#scripts-utiles)
- [Structure du projet](#structure-du-projet)

## Présentation

Application **Next.js** (App Router) qui regroupe :

- un **site public** orienté SEO et mobile-first ;
- des **espaces connectés** pour gérer le contenu et les opérations de l'association ;
- des **paiements en ligne** (adhésion, boutique, dons) via Stripe ;
- la gestion des **médias** via Cloudinary ;
- l'**envoi d'e-mails** transactionnels via Resend.

## Fonctionnalités

### Site public

| Section | Description |
|--------|-------------|
| **Accueil** | Carrousel, présentation, pôles, partenaires, événements, avis, statistiques, bénévoles, boutique |
| **Notre association** | Présentation, équipe, rapports d'activité |
| **Pôles** | Pages dédiées (événementiel, démarche administrative, mise en relation, etc.) |
| **Événements** | Agenda et détail des événements |
| **Boutique** | Catalogue produits et panier |
| **Adhésion / Don** | Formulaires et paiement Stripe |
| **Contacts** | Formulaire de contact et réseaux sociaux |

### Espaces d'administration

| Espace | Route de connexion | Rôle |
|--------|-------------------|------|
| **Bureau GAM** | `/connexion` | Gestion du contenu public (carousel, pôles, produits, événements, membres…) |
| **Administration** | `/connexion-administration` | Permanence administrative, suivi des demandes, bénévoles |
| **Hébergement & relation** | `/connexion-hebergement-relation` | Espace dédié au pôle hébergement |

## Stack technique

- **Framework** : [Next.js 15](https://nextjs.org) (App Router, Turbopack en dev)
- **UI** : React 19, Tailwind CSS 4, Shadcn UI, Framer Motion
- **Données** : Prisma 7 + PostgreSQL
- **Auth** : [Better Auth](https://www.better-auth.com)
- **Fetch client** : TanStack Query
- **Validation** : Zod
- **Paiements** : Stripe
- **Médias** : Cloudinary
- **E-mails** : Resend

## Prérequis

- **Node.js** 20 ou supérieur
- **npm** (ou pnpm / yarn / bun)
- Une base **PostgreSQL** accessible (locale ou hébergée)
- Comptes optionnels selon les fonctionnalités : Stripe, Cloudinary, Resend

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd game-site

# Installer les dépendances (déclenche aussi `prisma generate`)
npm install

# Créer le fichier .env à la racine (voir section « Variables d'environnement »)
```

## Variables d'environnement

Créer un fichier `.env` à la racine du projet

> Ne jamais committer le fichier `.env`. Utiliser des clés **test** Stripe en développement.

## Base de données

```bash
# Appliquer les migrations Prisma
npx prisma migrate deploy

# (Développement) créer / appliquer une migration
npx prisma migrate dev

# Peupler la base avec des données initiales + compte admin bureau
npm run seed
```

Le script de seed crée notamment un utilisateur **SUPER-ADMIN** pour l'espace Bureau. Les identifiants de développement sont définis dans `prisma/seed.ts`.

Pour inspecter la base :

```bash
npx prisma studio
```

## Lancer l'application

### Mode développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Le serveur démarre avec **Turbopack** (`next dev --turbopack`).

### Build et production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production (après build) |
| `npm run lint` | ESLint |
| `npm run seed` | Seed de la base de données |
| `npm run poles:upload` | Upload des images des pôles vers Cloudinary |

## Structure du projet

```
src/
├── app/
│   ├── (public)/          # Pages publiques (accueil, boutique, adhésion…)
│   ├── (admin)/           # Espaces bureau, administration, hébergement
│   ├── (auth)/            # Pages de connexion
│   └── api/               # Route handlers (auth, Stripe, uploads…)
├── components/            # Composants UI partagés
├── config/                # Configuration (env, metadata…)
├── lib/                   # Auth, Prisma, utilitaires
├── providers/             # Providers React (Query, thème…)
└── services/              # Clients et services transverses

prisma/
├── schema.prisma          # Modèle de données
├── migrations/            # Migrations SQL
└── seed.ts                # Données initiales
```

## Déploiement

L'application est compatible avec tout hébergeur supportant Next.js (Vercel, Docker, VPS, etc.). En production :

1. Définir toutes les variables d'environnement sur la plateforme.
2. Exécuter `npx prisma migrate deploy` avant ou pendant le déploiement.
3. Configurer le webhook Stripe vers `/api/webhooks/stripe`.
4. Mettre `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` sur l'URL de production.

---

**Guinée à Marseille (GAM)** — Association de la diaspora guinéenne à Marseille.
