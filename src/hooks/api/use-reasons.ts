/**
 * Hooks spécifiques pour les raisons
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Reason } from '@/lib/generated/prisma/client'

const reasonsCrud = createCrudResources<Reason>({
  endpoint: '/reasons',
  queryKey: ['reasons'],
})

/**
 * Récupérer toutes les raisons
 */
export function useReasons(options?: CrudQueryOptions) {
  return reasonsCrud.useGetAll(options)
}

/**
 * Récupérer une raison par ID
 */
export function useReason(id: string | null | undefined, options?: CrudQueryOptions) {
  return reasonsCrud.useGetById(id, options)
}

/**
 * Récupérer les raisons actives, triées par ordre
 */
export function useActiveReasons() {
  return reasonsCrud.useGetAll({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      welcomeSection: true,
    },
  })
}

/**
 * Créer une raison
 */
export function useCreateReason() {
  return reasonsCrud.useCreate()
}

/**
 * Mettre à jour une raison
 */
export function useUpdateReason() {
  return reasonsCrud.useUpdate()
}

/**
 * Supprimer une raison
 */
export function useDeleteReason() {
  return reasonsCrud.useDelete()
}

