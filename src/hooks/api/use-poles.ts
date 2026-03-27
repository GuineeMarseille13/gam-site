/**
 * Hooks spécifiques pour les pôles
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Pole } from '@/lib/generated/prisma/client'

const polesCrud = createCrudResources<Pole>({
  endpoint: '/poles',
  queryKey: ['poles'],
})

/**
 * Récupérer tous les pôles
 */
export function usePoles(options?: CrudQueryOptions) {
  return polesCrud.useGetAll(options)
}

/**
 * Récupérer un pôle par ID
 */
export function usePole(id: string | null | undefined, options?: CrudQueryOptions) {
  return polesCrud.useGetById(id, options)
}

/**
 * Récupérer les pôles avec pagination
 */
export function usePolesPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return polesCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les pôles avec leurs détails
 */
export function usePolesWithDetails() {
  return polesCrud.useGetAll({
    include: {
      poleSection: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

/**
 * Créer un pôle
 */
export function useCreatePole() {
  return polesCrud.useCreate()
}

/**
 * Mettre à jour un pôle
 */
export function useUpdatePole() {
  return polesCrud.useUpdate()
}

/**
 * Supprimer un pôle
 */
export function useDeletePole() {
  return polesCrud.useDelete()
}

