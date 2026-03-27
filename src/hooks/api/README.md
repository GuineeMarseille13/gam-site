# Hooks API - Documentation

Collection de hooks React réutilisables pour interagir avec les routes API de l'application.

## 📦 Installation

Les hooks sont déjà configurés et prêts à l'emploi. Assurez-vous que `QueryProvider` est configuré dans votre layout.

## 🚀 Utilisation rapide

### Import

```typescript
import { useProducts, useEvents, useReviews } from '@/hooks/api'
```

### Exemples d'utilisation

#### 1. Récupérer tous les produits actifs

```typescript
function ProductsList() {
  const { data: products, isLoading, error } = useActiveProducts()

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  )
}
```

#### 2. Récupérer un produit par ID

```typescript
function ProductDetail({ productId }: { productId: string }) {
  const { data: product, isLoading } = useProduct(productId)

  if (isLoading) return <div>Chargement...</div>
  if (!product) return <div>Produit non trouvé</div>

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Prix: {product.price / 100}€</p>
    </div>
  )
}
```

#### 3. Créer un produit

```typescript
function CreateProductForm() {
  const createProduct = useCreateProduct()

  const handleSubmit = async (data: any) => {
    try {
      await createProduct.mutateAsync({
        title: data.title,
        price: data.price * 100, // Convertir en centimes
        stock: data.stock,
        isActive: true,
      })
      alert('Produit créé avec succès!')
    } catch (error) {
      alert('Erreur: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Votre formulaire */}
    </form>
  )
}
```

#### 4. Mettre à jour un produit

```typescript
function UpdateProductStock({ productId }: { productId: string }) {
  const updateProduct = useUpdateProduct()

  const handleUpdate = async () => {
    try {
      await updateProduct.mutateAsync({
        id: productId,
        data: { stock: 50 },
      })
      alert('Stock mis à jour!')
    } catch (error) {
      alert('Erreur: ' + error.message)
    }
  }

  return <button onClick={handleUpdate}>Mettre à jour le stock</button>
}
```

#### 5. Pagination

```typescript
function ProductsPaginated() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useProductsPaginated(page, 10)

  if (isLoading) return <div>Chargement...</div>

  return (
    <div>
      {data?.data.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
      <div>
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={!data?.hasPreviousPage}
        >
          Précédent
        </button>
        <span>Page {data?.page} sur {data?.totalPages}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={!data?.hasNextPage}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}
```

#### 6. Événements à venir

```typescript
function UpcomingEvents() {
  const { data: events, isLoading } = useUpcomingEvents(5)

  if (isLoading) return <div>Chargement...</div>

  return (
    <div>
      <h2>Événements à venir</h2>
      {events?.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{new Date(event.startDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}
```

#### 7. Avis publiés

```typescript
function ReviewsSection() {
  const { data: reviews, isLoading } = usePublishedReviews(6)

  if (isLoading) return <div>Chargement...</div>

  return (
    <div>
      {reviews?.map(review => (
        <div key={review.id}>
          <p>{review.body}</p>
          <p>- {review.firstName} {review.lastName}</p>
          <div>{'⭐'.repeat(review.rating)}</div>
        </div>
      ))}
    </div>
  )
}
```

## 📚 Hooks disponibles

### Produits (`use-products.ts`)

- `useProducts()` - Tous les produits
- `useProduct(id)` - Un produit par ID
- `useProductsPaginated(page, limit)` - Produits paginés
- `useActiveProducts()` - Produits actifs uniquement
- `useCreateProduct()` - Créer un produit
- `useUpdateProduct()` - Mettre à jour un produit
- `useDeleteProduct()` - Supprimer un produit

### Événements (`use-events.ts`)

- `useEvents()` - Tous les événements
- `useEvent(id)` - Un événement par ID
- `useEventsPaginated(page, limit)` - Événements paginés
- `useUpcomingEvents(limit?)` - Événements à venir
- `usePastEvents(limit?)` - Événements passés
- `useCreateEvent()` - Créer un événement
- `useUpdateEvent()` - Mettre à jour un événement
- `useDeleteEvent()` - Supprimer un événement

### Avis (`use-reviews.ts`)

- `useReviews()` - Tous les avis
- `useReview(id)` - Un avis par ID
- `useReviewsPaginated(page, limit)` - Avis paginés
- `usePublishedReviews(limit?)` - Avis publiés et vérifiés
- `useReviewsByRating(minRating)` - Avis par note minimale
- `useCreateReview()` - Créer un avis
- `useUpdateReview()` - Mettre à jour un avis
- `useDeleteReview()` - Supprimer un avis

### Pôles (`use-poles.ts`)

- `usePoles()` - Tous les pôles
- `usePole(id)` - Un pôle par ID
- `usePolesPaginated(page, limit)` - Pôles paginés
- `usePolesWithDetails()` - Pôles avec détails
- `useCreatePole()` - Créer un pôle
- `useUpdatePole()` - Mettre à jour un pôle
- `useDeletePole()` - Supprimer un pôle

### Commandes (`use-orders.ts`)

- `useOrders()` - Toutes les commandes
- `useOrder(id)` - Une commande par ID (avec items et produits)
- `useOrdersPaginated(page, limit)` - Commandes paginées
- `useOrdersByPerson(personId)` - Commandes d'une personne
- `useOrdersByStatus(status)` - Commandes par statut
- `useCreateOrder()` - Créer une commande
- `useUpdateOrder()` - Mettre à jour une commande
- `useDeleteOrder()` - Supprimer une commande

### Réalisations (`use-achievements.ts`)

- `useAchievements()` - Toutes les réalisations
- `useAchievement(id)` - Une réalisation par ID
- `useActiveAchievements()` - Réalisations actives
- `useCreateAchievement()` - Créer une réalisation
- `useUpdateAchievement()` - Mettre à jour une réalisation
- `useDeleteAchievement()` - Supprimer une réalisation

### Personnes (`use-persons.ts`)

- `usePersons()` - Toutes les personnes
- `usePerson(id)` - Une personne par ID (avec adresse)
- `usePersonsPaginated(page, limit)` - Personnes paginées
- `usePersonsByRole(role)` - Personnes par rôle
- `useCreatePerson()` - Créer une personne
- `useUpdatePerson()` - Mettre à jour une personne
- `useDeletePerson()` - Supprimer une personne

### Images (`use-images.ts`)

- `useImages()` - Toutes les images
- `useImage(id)` - Une image par ID
- `useImagesPaginated(page, limit)` - Images paginées
- `useActiveImages()` - Images actives uniquement
- `useImagesByPageAndSection(page, section)` - Images par page et section
- `useCreateImage()` - Créer une image
- `useUpdateImage()` - Mettre à jour une image
- `useDeleteImage()` - Supprimer une image

### Vidéos (`use-videos.ts`)

- `useVideos()` - Toutes les vidéos
- `useVideo(id)` - Une vidéo par ID
- `useVideosPaginated(page, limit)` - Vidéos paginées
- `useActiveVideos()` - Vidéos actives uniquement
- `useVideosByPageAndSection(page, section)` - Vidéos par page et section
- `useCreateVideo()` - Créer une vidéo
- `useUpdateVideo()` - Mettre à jour une vidéo
- `useDeleteVideo()` - Supprimer une vidéo

### Partenaires (`use-partners.ts`)

- `usePartners()` - Tous les partenaires
- `usePartner(id)` - Un partenaire par ID
- `usePartnersPaginated(page, limit)` - Partenaires paginés
- `usePartnersWithSections()` - Partenaires avec leurs sections
- `useCreatePartner()` - Créer un partenaire
- `useUpdatePartner()` - Mettre à jour un partenaire
- `useDeletePartner()` - Supprimer un partenaire

### Bénévoles (`use-volunteers.ts`)

- `useVolunteers()` - Tous les bénévoles
- `useVolunteer(id)` - Un bénévole par ID
- `useVolunteersPaginated(page, limit)` - Bénévoles paginés
- `useActiveVolunteers()` - Bénévoles actifs avec informations personnelles
- `useCreateVolunteer()` - Créer un bénévole
- `useUpdateVolunteer()` - Mettre à jour un bénévole
- `useDeleteVolunteer()` - Supprimer un bénévole

### Membres d'équipe (`use-team-members.ts`)

- `useTeamMembers()` - Tous les membres d'équipe
- `useTeamMember(id)` - Un membre d'équipe par ID
- `useTeamMembersPaginated(page, limit)` - Membres paginés
- `useActiveTeamMembers()` - Membres actifs, triés par ordre
- `useCreateTeamMember()` - Créer un membre d'équipe
- `useUpdateTeamMember()` - Mettre à jour un membre d'équipe
- `useDeleteTeamMember()` - Supprimer un membre d'équipe

### Adhésions (`use-memberships.ts`)

- `useMemberships()` - Toutes les adhésions
- `useMembership(id)` - Une adhésion par ID
- `useMembershipsPaginated(page, limit)` - Adhésions paginées
- `useActiveMemberships()` - Adhésions actives
- `useMembershipsByYear(year)` - Adhésions par année
- `useCreateMembership()` - Créer une adhésion
- `useUpdateMembership()` - Mettre à jour une adhésion
- `useDeleteMembership()` - Supprimer une adhésion

### Dons (`use-donations.ts`)

- `useDonations()` - Tous les dons
- `useDonation(id)` - Un don par ID
- `useDonationsPaginated(page, limit)` - Dons paginés
- `useRecentDonations(limit?)` - Dons récents
- `useCreateDonation()` - Créer un don
- `useUpdateDonation()` - Mettre à jour un don
- `useDeleteDonation()` - Supprimer un don

### Réseaux sociaux (`use-social-medias.ts`)

- `useSocialMedias()` - Tous les réseaux sociaux
- `useSocialMedia(id)` - Un réseau social par ID
- `useSocialMediasOrdered()` - Réseaux sociaux triés par ordre
- `useCreateSocialMedia()` - Créer un réseau social
- `useUpdateSocialMedia()` - Mettre à jour un réseau social
- `useDeleteSocialMedia()` - Supprimer un réseau social

### Rapports d'activité (`use-report-activities.ts`)

- `useReportActivities()` - Tous les rapports d'activité
- `useReportActivity(id)` - Un rapport par ID
- `useReportActivitiesPaginated(page, limit)` - Rapports paginés
- `useReportActivitiesByYear()` - Rapports triés par année (décroissant)
- `useReportActivityByYear(year)` - Rapport pour une année spécifique
- `useCreateReportActivity()` - Créer un rapport
- `useUpdateReportActivity()` - Mettre à jour un rapport
- `useDeleteReportActivity()` - Supprimer un rapport

### À propos (`use-about-us.ts`)

- `useAboutUs()` - Tous les contenus "À propos"
- `useAboutUsItem(id)` - Un contenu par ID
- `useAboutUsPaginated(page, limit)` - Contenus paginés
- `useAboutUsWithSections()` - Contenus avec leurs sections
- `useCreateAboutUs()` - Créer un contenu
- `useUpdateAboutUs()` - Mettre à jour un contenu
- `useDeleteAboutUs()` - Supprimer un contenu

### Contacts (`use-contacts.ts`)

- `useContacts()` - Tous les contacts
- `useContact(id)` - Un contact par ID (avec adresse)
- `useMainContact()` - Contact principal
- `useCreateContact()` - Créer un contact
- `useUpdateContact()` - Mettre à jour un contact
- `useDeleteContact()` - Supprimer un contact

### Adresses (`use-addresses.ts`)

- `useAddresses()` - Toutes les adresses
- `useAddress(id)` - Une adresse par ID
- `useAddressesPaginated(page, limit)` - Adresses paginées
- `useCreateAddress()` - Créer une adresse
- `useUpdateAddress()` - Mettre à jour une adresse
- `useDeleteAddress()` - Supprimer une adresse

### Sections (`use-sections.ts`)

Tous les hooks de sections suivent le même pattern avec leurs relations incluses :

#### Welcome Section
- `useWelcomeSections()` - Toutes les sections d'accueil (avec raisons)
- `useWelcomeSection(id)` - Une section par ID (avec raisons)
- `useCreateWelcomeSection()`, `useUpdateWelcomeSection()`, `useDeleteWelcomeSection()`

#### Pole Section
- `usePoleSections()` - Toutes les sections de pôles (avec pôles)
- `usePoleSection(id)` - Une section par ID (avec pôles)
- `useCreatePoleSection()`, `useUpdatePoleSection()`, `useDeletePoleSection()`

#### Partner Section
- `usePartnerSections()` - Toutes les sections de partenaires (avec partenaires)
- `usePartnerSection(id)` - Une section par ID (avec partenaires)
- `useCreatePartnerSection()`, `useUpdatePartnerSection()`, `useDeletePartnerSection()`

#### Event Section
- `useEventSections()` - Toutes les sections d'événements (avec événements)
- `useEventSection(id)` - Une section par ID (avec événements)
- `useCreateEventSection()`, `useUpdateEventSection()`, `useDeleteEventSection()`

#### Review Section
- `useReviewSections()` - Toutes les sections d'avis (avec avis)
- `useReviewSection(id)` - Une section par ID (avec avis)
- `useCreateReviewSection()`, `useUpdateReviewSection()`, `useDeleteReviewSection()`

#### Product Section
- `useProductSections()` - Toutes les sections de produits (avec produits)
- `useProductSection(id)` - Une section par ID (avec produits)
- `useCreateProductSection()`, `useUpdateProductSection()`, `useDeleteProductSection()`

#### Product Category
- `useProductCategories()` - Toutes les catégories de produits (avec produits)
- `useProductCategory(id)` - Une catégorie par ID (avec produits)
- `useCreateProductCategory()`, `useUpdateProductCategory()`, `useDeleteProductCategory()`

#### Achievement Section
- `useAchievementSections()` - Toutes les sections de réalisations (avec réalisations)
- `useAchievementSection(id)` - Une section par ID (avec réalisations)
- `useCreateAchievementSection()`, `useUpdateAchievementSection()`, `useDeleteAchievementSection()`

#### Volunteer Section
- `useVolunteerSections()` - Toutes les sections de bénévoles (avec bénévoles)
- `useVolunteerSection(id)` - Une section par ID (avec bénévoles)
- `useCreateVolunteerSection()`, `useUpdateVolunteerSection()`, `useDeleteVolunteerSection()`

#### Team Member Section
- `useTeamMemberSections()` - Toutes les sections de membres d'équipe (avec membres)
- `useTeamMemberSection(id)` - Une section par ID (avec membres)
- `useCreateTeamMemberSection()`, `useUpdateTeamMemberSection()`, `useDeleteTeamMemberSection()`

#### Report Activity Section
- `useReportActivitySections()` - Toutes les sections de rapports (avec rapports)
- `useReportActivitySection(id)` - Une section par ID (avec rapports)
- `useCreateReportActivitySection()`, `useUpdateReportActivitySection()`, `useDeleteReportActivitySection()`

#### About Us Section
- `useAboutUsSections()` - Toutes les sections "À propos" (avec contenus)
- `useAboutUsSection(id)` - Une section par ID (avec contenus)
- `useCreateAboutUsSection()`, `useUpdateAboutUsSection()`, `useDeleteAboutUsSection()`

### Raisons (`use-reasons.ts`)

- `useReasons()` - Toutes les raisons
- `useReason(id)` - Une raison par ID
- `useActiveReasons()` - Raisons actives, triées par ordre (avec section d'accueil)
- `useCreateReason()` - Créer une raison
- `useUpdateReason()` - Mettre à jour une raison
- `useDeleteReason()` - Supprimer une raison

### Détails de Pôles (`use-pole-details.ts`)

- `usePoleDetails()` - Tous les détails de pôles
- `usePoleDetail(id)` - Un détail par ID
- `useActivePoleDetails()` - Détails actifs
- `useCreatePoleDetail()` - Créer un détail
- `useUpdatePoleDetail()` - Mettre à jour un détail
- `useDeletePoleDetail()` - Supprimer un détail

## 🔧 Fabrique `createCrudResources` (hooks CRUD)

Pour créer vos propres hooks personnalisés :

```typescript
import { createCrudResources } from '@/hooks/api'

const myResourceCrud = createCrudResources<MyType>({
  endpoint: '/my-resource',
  queryKey: ['myResource'],
})

// Utiliser les méthodes génériques
const { data } = myResourceCrud.useGetAll()
const create = myResourceCrud.useCreate()
```

## ⚡ Optimisations

- **Cache automatique** : Les données sont mises en cache pendant 5 minutes
- **Invalidation intelligente** : Les mutations invalident automatiquement les queries concernées
- **Refetch conditionnel** : Pas de refetch au focus de la fenêtre par défaut
- **Retry limité** : 1 seule tentative en cas d'erreur

## 🎯 Bonnes pratiques

1. **Gérer les états de chargement** : Toujours vérifier `isLoading`
2. **Gérer les erreurs** : Afficher les erreurs de manière appropriée
3. **Utiliser les hooks spécialisés** : Préférer `useActiveProducts()` plutôt que `useProducts({ where: { isActive: true } })`
4. **Optimiser les requêtes** : Utiliser `enabled` pour désactiver les requêtes inutiles
5. **Pagination** : Utiliser `useProductsPaginated()` pour les grandes listes

## 📝 Notes

- Tous les hooks utilisent React Query pour la gestion du cache
- Les mutations invalident automatiquement les queries concernées
- Les prix sont stockés en centimes (diviser par 100 pour afficher)
- Les dates sont des objets `Date` JavaScript

