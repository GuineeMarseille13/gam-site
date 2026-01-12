# API Routes - Liste complète

Toutes les routes API suivent le même pattern CRUD standardisé.

## Format des routes

- `GET /api/{model}` - Liste tous les enregistrements
- `GET /api/{model}?id=xxx` - Récupère un enregistrement par ID
- `POST /api/{model}` - Crée un nouvel enregistrement
- `PUT /api/{model}?id=xxx` - Met à jour un enregistrement
- `DELETE /api/{model}?id=xxx` - Supprime un enregistrement

## Routes disponibles

### Produits et Catalogue

- **`/api/products`** - Gestion des produits
- **`/api/product-sections`** - Sections de produits
- **`/api/product-categories`** - Catégories de produits

### Commandes

- **`/api/orders`** - Gestion des commandes
- **`/api/order-items`** - Items de commande (avec calcul automatique du subtotal)

### Personnes et Membres

- **`/api/persons`** - Gestion des personnes
- **`/api/volunteers`** - Gestion des bénévoles
- **`/api/volunteer-sections`** - Sections de bénévoles
- **`/api/team-members`** - Gestion des membres d'équipe
- **`/api/team-member-sections`** - Sections de membres d'équipe
- **`/api/memberships`** - Gestion des adhésions
- **`/api/donations`** - Gestion des dons

### Médias

- **`/api/images`** - Gestion des images
- **`/api/videos`** - Gestion des vidéos

### Événements

- **`/api/events`** - Gestion des événements (avec conversion automatique des dates)
- **`/api/event-sections`** - Sections d'événements

### Avis et Témoignages

- **`/api/reviews`** - Gestion des avis (avec publication automatique si vérifié)
- **`/api/review-sections`** - Sections d'avis

### Réalisations

- **`/api/achievements`** - Gestion des réalisations
- **`/api/achievement-sections`** - Sections de réalisations

### Pôles

- **`/api/poles`** - Gestion des pôles
- **`/api/pole-sections`** - Sections de pôles
- **`/api/pole-details`** - Détails de pôles

### Partenaires

- **`/api/partners`** - Gestion des partenaires
- **`/api/partner-sections`** - Sections de partenaires

### Association

- **`/api/about-us`** - Gestion "À propos de nous"
- **`/api/about-us-sections`** - Sections "À propos"
- **`/api/welcome-sections`** - Sections d'accueil
- **`/api/reasons`** - Gestion des raisons
- **`/api/report-activities`** - Gestion des rapports d'activité
- **`/api/report-activity-sections`** - Sections de rapports

### Contact et Localisation

- **`/api/contacts`** - Gestion des contacts
- **`/api/addresses`** - Gestion des adresses
- **`/api/social-medias`** - Gestion des réseaux sociaux

## Exemples d'utilisation

### Récupérer tous les produits actifs

```typescript
GET /api/products?where={"isActive":true}
```

### Récupérer un produit avec sa catégorie

```typescript
GET /api/products?id=product-id&include={"productCategory":true}
```

### Créer un produit

```typescript
POST /api/products
Content-Type: application/json

{
  "title": "T-shirt GAM",
  "price": 2000,
  "stock": 50,
  "isActive": true
}
```

### Mettre à jour le stock d'un produit

```typescript
PUT /api/products?id=product-id
Content-Type: application/json

{
  "stock": 30
}
```

### Récupérer les événements à venir avec pagination

```typescript
GET /api/events?where={"startDate":{"gte":"2024-01-01"}}&page=1&limit=10&orderBy={"startDate":"asc"}
```

### Récupérer une commande avec ses items et produits

```typescript
GET /api/orders?id=order-id&include={"items":{"include":{"product":true}},"person":true}
```

## Validation

Toutes les routes incluent une validation automatique avec Zod :
- Validation des types de données
- Validation des champs requis
- Validation des formats (URL, email, etc.)
- Messages d'erreur clairs

## Gestion d'erreurs

Toutes les routes retournent des erreurs standardisées :

- **400** - Erreur de validation
- **404** - Ressource non trouvée
- **500** - Erreur serveur

Format de réponse d'erreur :

```json
{
  "error": "Error message",
  "details": {} // Optionnel pour les erreurs de validation
}
```

