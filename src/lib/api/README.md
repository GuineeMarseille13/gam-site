# API Backend Documentation

## Structure

Le backend utilise une architecture générique basée sur le service CRUD pour éviter la duplication de code.

### Architecture

```
src/
├── lib/
│   └── api/
│       ├── handlers.ts      # Handlers génériques CRUD
│       └── README.md        # Documentation
├── app/
│   └── api/
│       ├── products/              # Routes pour les produits
│       ├── product-sections/      # Routes pour les sections de produits
│       ├── product-categories/    # Routes pour les catégories de produits
│       ├── orders/                 # Routes pour les commandes
│       ├── order-items/            # Routes pour les items de commande
│       ├── persons/                # Routes pour les personnes
│       ├── images/                 # Routes pour les images
│       ├── videos/                 # Routes pour les vidéos
│       ├── events/                 # Routes pour les événements
│       ├── event-sections/         # Routes pour les sections d'événements
│       ├── reviews/                # Routes pour les avis
│       ├── review-sections/        # Routes pour les sections d'avis
│       ├── achievements/           # Routes pour les réalisations
│       ├── achievement-sections/   # Routes pour les sections de réalisations
│       ├── poles/                  # Routes pour les pôles
│       ├── pole-sections/          # Routes pour les sections de pôles
│       ├── pole-details/           # Routes pour les détails de pôles
│       ├── partners/               # Routes pour les partenaires
│       ├── partner-sections/       # Routes pour les sections de partenaires
│       ├── volunteers/             # Routes pour les bénévoles
│       ├── volunteer-sections/     # Routes pour les sections de bénévoles
│       ├── team-members/           # Routes pour les membres d'équipe
│       ├── team-member-sections/   # Routes pour les sections de membres d'équipe
│       ├── social-medias/          # Routes pour les réseaux sociaux
│       ├── report-activities/       # Routes pour les rapports d'activité
│       ├── report-activity-sections/ # Routes pour les sections de rapports
│       ├── about-us/              # Routes pour "À propos de nous"
│       ├── about-us-sections/      # Routes pour les sections "À propos"
│       ├── welcome-sections/       # Routes pour les sections d'accueil
│       ├── reasons/                # Routes pour les raisons
│       ├── memberships/            # Routes pour les adhésions
│       ├── donations/              # Routes pour les dons
│       ├── addresses/               # Routes pour les adresses
│       └── contacts/                # Routes pour les contacts
└── services/
    └── crud.service.ts              # Service CRUD générique
```

### Routes disponibles

Toutes les routes suivent le même pattern CRUD :

| Route | Modèle | Description |
|-------|--------|-------------|
| `/api/products` | Product | Gestion des produits |
| `/api/product-sections` | ProductSection | Sections de produits |
| `/api/product-categories` | ProductCategory | Catégories de produits |
| `/api/orders` | Order | Gestion des commandes |
| `/api/order-items` | OrderItem | Items de commande |
| `/api/persons` | Person | Gestion des personnes |
| `/api/images` | Image | Gestion des images |
| `/api/videos` | Video | Gestion des vidéos |
| `/api/events` | Event | Gestion des événements |
| `/api/event-sections` | EventSection | Sections d'événements |
| `/api/reviews` | Review | Gestion des avis |
| `/api/review-sections` | ReviewSection | Sections d'avis |
| `/api/achievements` | Achievement | Gestion des réalisations |
| `/api/achievement-sections` | AchievementSection | Sections de réalisations |
| `/api/poles` | Pole | Gestion des pôles |
| `/api/pole-sections` | PoleSection | Sections de pôles |
| `/api/pole-details` | DetailsPole | Détails de pôles |
| `/api/partners` | Partner | Gestion des partenaires |
| `/api/partner-sections` | PartnerSection | Sections de partenaires |
| `/api/volunteers` | Volunteer | Gestion des bénévoles |
| `/api/volunteer-sections` | VolunteerSection | Sections de bénévoles |
| `/api/team-members` | TeamMember | Gestion des membres d'équipe |
| `/api/team-member-sections` | TeamMemberSection | Sections de membres d'équipe |
| `/api/social-medias` | SocialMedia | Gestion des réseaux sociaux |
| `/api/report-activities` | ReportActivity | Gestion des rapports d'activité |
| `/api/report-activity-sections` | ReportActivitySection | Sections de rapports |
| `/api/about-us` | AboutUs | Gestion "À propos de nous" |
| `/api/about-us-sections` | AboutUsSection | Sections "À propos" |
| `/api/welcome-sections` | WelcomeSection | Sections d'accueil |
| `/api/reasons` | Reason | Gestion des raisons |
| `/api/memberships` | MemberShip | Gestion des adhésions |
| `/api/donations` | Donation | Gestion des dons |
| `/api/addresses` | Address | Gestion des adresses |
| `/api/contacts` | Contact | Gestion des contacts |

## Utilisation

### Routes disponibles

Toutes les routes suivent le même pattern :

- `GET /api/{model}` - Liste tous les enregistrements
- `GET /api/{model}?id=xxx` - Récupère un enregistrement par ID
- `POST /api/{model}` - Crée un nouvel enregistrement
- `PUT /api/{model}?id=xxx` - Met à jour un enregistrement
- `DELETE /api/{model}?id=xxx` - Supprime un enregistrement

### Exemples de requêtes

#### GET - Liste tous les produits actifs

```typescript
const response = await fetch('/api/products?where={"isActive":true}')
const products = await response.json()
```

#### GET - Récupère un produit avec sa catégorie

```typescript
const response = await fetch('/api/products?id=product-id&include={"productCategory":true}')
const product = await response.json()
```

#### GET - Pagination

```typescript
const response = await fetch('/api/products?page=1&limit=10&orderBy={"createdAt":"desc"}')
const result = await response.json()
// {
//   data: [...],
//   total: 100,
//   page: 1,
//   limit: 10,
//   totalPages: 10,
//   hasNextPage: true,
//   hasPreviousPage: false
// }
```

#### POST - Créer un produit

```typescript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'T-shirt GAM',
    price: 2000,
    stock: 50,
    isActive: true,
  }),
})
const product = await response.json()
```

#### PUT - Mettre à jour un produit

```typescript
const response = await fetch('/api/products?id=product-id', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    stock: 30,
  }),
})
const product = await response.json()
```

#### DELETE - Supprimer un produit

```typescript
const response = await fetch('/api/products?id=product-id', {
  method: 'DELETE',
})
```

### Paramètres de requête

#### GET /api/{model}

- `id` - ID de l'enregistrement (pour findById)
- `where` - Filtres JSON (ex: `{"isActive":true}`)
- `include` - Relations à inclure JSON (ex: `{"productCategory":true}`)
- `select` - Champs à sélectionner JSON
- `orderBy` - Tri JSON (ex: `{"createdAt":"desc"}`)
- `take` - Nombre d'enregistrements à récupérer
- `skip` - Nombre d'enregistrements à sauter
- `page` - Numéro de page (pour pagination)
- `limit` - Nombre d'enregistrements par page (pour pagination)

## Créer une nouvelle route

Pour créer une nouvelle route API, créez un fichier `route.ts` dans `src/app/api/{model}/` :

```typescript
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation
const createSchema = z.object({
  // Définir les champs
})

const updateSchema = createSchema.partial()

const handlers = createCrudHandler({
  modelName: 'YourModel',
  validateCreate: (data) => createSchema.parse(data),
  validateUpdate: (data) => updateSchema.parse(data),
  // Hooks optionnels
  beforeCreate: async (data) => {
    // Logique avant création
    return data
  },
  afterCreate: async (result) => {
    // Logique après création
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
```

## Hooks disponibles

- `validateCreate` - Valider les données avant création
- `validateUpdate` - Valider les données avant mise à jour
- `beforeCreate` - Hook avant création
- `beforeUpdate` - Hook avant mise à jour
- `afterCreate` - Hook après création
- `afterUpdate` - Hook après mise à jour

## Gestion d'erreurs

Toutes les routes retournent des erreurs standardisées :

- `400` - Erreur de validation
- `404` - Ressource non trouvée
- `500` - Erreur serveur

Format de réponse d'erreur :

```json
{
  "error": "Error message",
  "details": {} // Optionnel pour les erreurs de validation
}
```

