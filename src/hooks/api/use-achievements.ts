/**
 * Hooks spécifiques pour les réalisations/statistiques
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Achievement } from '@/lib/generated/prisma/client'

const achievementsCrud = createCrudResources<Achievement>({
  endpoint: '/achievements',
  queryKey: ['achievements'],
})

/**
 * Récupérer toutes les réalisations
 */
export function useAchievements(options?: CrudQueryOptions) {
  return achievementsCrud.useGetAll(options)
}

/**
 * Récupérer une réalisation par ID
 */
export function useAchievement(id: string | null | undefined, options?: CrudQueryOptions) {
  return achievementsCrud.useGetById(id, options)
}

/**
 * Récupérer les réalisations actives, triées par ordre
 */
export function useActiveAchievements() {
  return achievementsCrud.useGetAll({
    where: {
      isActive: true,
    },
    orderBy: {
      order: 'asc',
    },
  })
}

/**
 * Créer une réalisation
 */
export function useCreateAchievement() {
  return achievementsCrud.useCreate()
}

/**
 * Mettre à jour une réalisation
 */
export function useUpdateAchievement() {
  return achievementsCrud.useUpdate()
}

/**
 * Supprimer une réalisation
 */
export function useDeleteAchievement() {
  return achievementsCrud.useDelete()
}

