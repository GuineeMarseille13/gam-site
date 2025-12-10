# Script de Seed pour la Base de Données

Ce script permet d'alimenter la base de données avec les données initiales de l'application.

## Utilisation

### Exécuter le seed

```bash
npm run db:seed
```

Ou directement avec Prisma :

```bash
npx prisma db seed
```

## Données créées

Le script de seed crée les données suivantes :

### 📸 Carrousel (5 éléments)
- Éléments du carrousel principal de la page d'accueil
- Utilise `upsert` pour éviter les doublons

### 🤝 Partenaires (5 partenaires)
- Partenaires de l'association
- Utilise `upsert` pour éviter les doublons

### 🎉 Événements (5 événements)
- Événements passés et à venir
- Inclut les médias associés
- Vérifie l'existence avant de créer

### 💬 Témoignages (9 témoignages)
- Avis et témoignages des membres
- Tous publiés et mis en vedette
- Vérifie l'existence avant de créer

### 📊 Statistiques (6 statistiques)
- Statistiques de l'association
- Différentes couleurs et icônes
- Vérifie l'existence avant de créer

### 👥 Bénévoles (10 bénévoles)
- Liste des bénévoles actifs
- Avec rôles et initiales
- Vérifie l'existence avant de créer

### 🛍️ Produits (9 produits)
- Catalogue de produits de la boutique
- Avec prix, descriptions et catégories
- Vérifie l'existence avant de créer

## Notes importantes

- Le script utilise `upsert` pour les carrousels et partenaires (basés sur des IDs fixes)
- Pour les autres entités, le script vérifie d'abord si des données existent avant de créer
- Le script peut être exécuté plusieurs fois sans créer de doublons
- Les événements incluent automatiquement leurs médias associés

## Personnalisation

Pour modifier les données, éditez le fichier `prisma/seed.ts` et réexécutez le script.

