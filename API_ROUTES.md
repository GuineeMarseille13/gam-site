# Documentation des Routes API

Ce document liste toutes les routes API disponibles dans l'application.

## Structure des réponses

Toutes les routes retournent un format standard :

```typescript
{
  success: boolean
  data?: any
  error?: string
  message?: string
}
```

## Routes disponibles

### Pôles

- `GET /api/poles` - Liste tous les pôles
  - Query params: `active` (boolean)
- `POST /api/poles` - Créer un nouveau pôle
- `GET /api/poles/[slug]` - Récupérer un pôle par slug
- `PUT /api/poles/[slug]` - Mettre à jour un pôle
- `DELETE /api/poles/[slug]` - Supprimer un pôle
- `GET /api/poles/[slug]/services` - Liste les services d'un pôle
- `POST /api/poles/[slug]/services` - Ajouter un service à un pôle

### Événements

- `GET /api/events` - Liste tous les événements
  - Query params: `year`, `published`, `categoryId`, `groupByYear`
- `POST /api/events` - Créer un nouvel événement
- `GET /api/events/[id]` - Récupérer un événement par ID
- `PUT /api/events/[id]` - Mettre à jour un événement
- `DELETE /api/events/[id]` - Supprimer un événement
- `GET /api/events/[id]/media` - Liste les médias d'un événement
- `POST /api/events/[id]/media` - Ajouter un média à un événement

### Produits

- `GET /api/products` - Liste tous les produits
  - Query params: `featured`, `categoryId`, `inStock`, `active`
- `POST /api/products` - Créer un nouveau produit
- `GET /api/products/[id]` - Récupérer un produit par ID
- `PUT /api/products/[id]` - Mettre à jour un produit
- `DELETE /api/products/[id]` - Supprimer un produit

### Partenaires

- `GET /api/partners` - Liste tous les partenaires
  - Query params: `active`, `categoryId`
- `POST /api/partners` - Créer un nouveau partenaire
- `GET /api/partners/[id]` - Récupérer un partenaire par ID
- `PUT /api/partners/[id]` - Mettre à jour un partenaire
- `DELETE /api/partners/[id]` - Supprimer un partenaire

### Témoignages

- `GET /api/reviews` - Liste tous les témoignages
  - Query params: `published`, `featured`
- `POST /api/reviews` - Créer un nouveau témoignage
- `GET /api/reviews/[id]` - Récupérer un témoignage par ID
- `PUT /api/reviews/[id]` - Mettre à jour un témoignage
- `DELETE /api/reviews/[id]` - Supprimer un témoignage

### Statistiques

- `GET /api/statistics` - Liste toutes les statistiques
  - Query params: `active`
- `POST /api/statistics` - Créer une nouvelle statistique
- `GET /api/statistics/[id]` - Récupérer une statistique par ID
- `PUT /api/statistics/[id]` - Mettre à jour une statistique
- `DELETE /api/statistics/[id]` - Supprimer une statistique

### Bénévoles

- `GET /api/volunteers` - Liste tous les bénévoles
  - Query params: `active`
- `POST /api/volunteers` - Créer un nouveau bénévole
- `GET /api/volunteers/[id]` - Récupérer un bénévole par ID
- `PUT /api/volunteers/[id]` - Mettre à jour un bénévole
- `DELETE /api/volunteers/[id]` - Supprimer un bénévole

### Équipe

- `GET /api/team` - Liste tous les membres de l'équipe
  - Query params: `active`
- `POST /api/team` - Créer un nouveau membre d'équipe
- `GET /api/team/[id]` - Récupérer un membre d'équipe par ID
- `PUT /api/team/[id]` - Mettre à jour un membre d'équipe
- `DELETE /api/team/[id]` - Supprimer un membre d'équipe

### Association

- `GET /api/association` - Récupérer les informations de l'association
- `PUT /api/association` - Mettre à jour les informations de l'association

### Contact

- `POST /api/contact` - Créer une soumission de contact
- `GET /api/contact/submissions` - Liste toutes les soumissions
  - Query params: `status`, `limit`, `offset`
- `GET /api/contact/submissions/[id]` - Récupérer une soumission par ID
- `PUT /api/contact/submissions/[id]` - Mettre à jour une soumission
- `DELETE /api/contact/submissions/[id]` - Supprimer une soumission

### Adhésion

- `POST /api/adhesion` - Créer une soumission d'adhésion
- `GET /api/adhesion/submissions` - Liste toutes les soumissions
  - Query params: `status`, `limit`, `offset`
- `GET /api/adhesion/submissions/[id]` - Récupérer une soumission par ID
- `PUT /api/adhesion/submissions/[id]` - Mettre à jour une soumission

### Dons

- `POST /api/donations` - Créer un don
- `GET /api/donations/submissions` - Liste toutes les soumissions
  - Query params: `status`, `limit`, `offset`
- `GET /api/donations/submissions/[id]` - Récupérer un don par ID
- `PUT /api/donations/submissions/[id]` - Mettre à jour un don

### Commandes

- `POST /api/orders` - Créer une commande
- `GET /api/orders/submissions` - Liste toutes les commandes
  - Query params: `status`, `limit`, `offset`
- `GET /api/orders/submissions/[id]` - Récupérer une commande par ID
- `PUT /api/orders/submissions/[id]` - Mettre à jour une commande

### Catégories

- `GET /api/categories` - Liste toutes les catégories
  - Query params: `type`, `active`
- `POST /api/categories` - Créer une nouvelle catégorie
- `GET /api/categories/[id]` - Récupérer une catégorie par ID
- `PUT /api/categories/[id]` - Mettre à jour une catégorie
- `DELETE /api/categories/[id]` - Supprimer une catégorie

### Méthodes de Contact

- `GET /api/contact-methods` - Liste toutes les méthodes de contact
  - Query params: `active`
- `POST /api/contact-methods` - Créer une nouvelle méthode de contact
- `GET /api/contact-methods/[id]` - Récupérer une méthode par ID
- `PUT /api/contact-methods/[id]` - Mettre à jour une méthode
- `DELETE /api/contact-methods/[id]` - Supprimer une méthode

### Réseaux Sociaux

- `GET /api/social-networks` - Liste tous les réseaux sociaux
  - Query params: `active`
- `POST /api/social-networks` - Créer un nouveau réseau social
- `GET /api/social-networks/[id]` - Récupérer un réseau par ID
- `PUT /api/social-networks/[id]` - Mettre à jour un réseau
- `DELETE /api/social-networks/[id]` - Supprimer un réseau

### Carrousel

- `GET /api/carousel` - Liste tous les éléments du carrousel
  - Query params: `active`
- `POST /api/carousel` - Créer un nouvel élément
- `GET /api/carousel/[id]` - Récupérer un élément par ID
- `PUT /api/carousel/[id]` - Mettre à jour un élément
- `DELETE /api/carousel/[id]` - Supprimer un élément

### Rapports d'Activité

- `GET /api/activity-reports` - Liste tous les rapports
  - Query params: `published`
- `POST /api/activity-reports` - Créer un nouveau rapport
- `GET /api/activity-reports/[id]` - Récupérer un rapport par ID
- `PUT /api/activity-reports/[id]` - Mettre à jour un rapport
- `DELETE /api/activity-reports/[id]` - Supprimer un rapport

### Médias

- `GET /api/media` - Liste tous les médias
  - Query params: `type`, `limit`, `offset`
- `POST /api/media` - Créer un nouveau média
- `GET /api/media/[id]` - Récupérer un média par ID
- `PUT /api/media/[id]` - Mettre à jour un média
- `DELETE /api/media/[id]` - Supprimer un média

## Gestion des erreurs

Toutes les routes utilisent la fonction `handleApiError` qui gère :
- Les erreurs Prisma (contraintes uniques, enregistrements introuvables)
- Les erreurs de validation Zod
- Les erreurs génériques

Les codes de statut HTTP utilisés :
- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Interdit
- `404` - Non trouvé
- `409` - Conflit (contrainte unique)
- `500` - Erreur serveur

