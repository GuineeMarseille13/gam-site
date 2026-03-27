/**
 * Hooks spécifiques pour les avis/témoignages
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Review } from '@/lib/generated/prisma/client'

const reviewsCrud = createCrudResources<Review>({
  endpoint: '/reviews',
  queryKey: ['reviews'],
})

/**
 * Récupérer tous les avis
 */
export function useReviews(options?: CrudQueryOptions) {
  return reviewsCrud.useGetAll(options)
}

/**
 * Récupérer un avis par ID
 */
export function useReview(id: string | null | undefined, options?: CrudQueryOptions) {
  return reviewsCrud.useGetById(id, options)
}

/**
 * Récupérer les avis avec pagination
 */
export function useReviewsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return reviewsCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer uniquement les avis actifs et vérifiés
 */
export function usePublishedReviews(limit?: number) {
  return reviewsCrud.useGetAll({
    where: {
      isActive: true,
      isVerified: true,
    },
    orderBy: {
      order: 'asc',
      publishedAt: 'desc',
    },
    take: limit,
  })
}

/**
 * Récupérer les avis avec une note minimale
 */
export function useReviewsByRating(minRating: number = 4) {
  return reviewsCrud.useGetAll({
    where: {
      isActive: true,
      isVerified: true,
      rating: {
        gte: minRating,
      },
    },
    orderBy: {
      rating: 'desc',
      publishedAt: 'desc',
    },
  })
}

/**
 * Créer un avis
 */
export function useCreateReview() {
  return reviewsCrud.useCreate()
}

/**
 * Mettre à jour un avis
 */
export function useUpdateReview() {
  return reviewsCrud.useUpdate()
}

/**
 * Supprimer un avis
 */
export function useDeleteReview() {
  return reviewsCrud.useDelete()
}

