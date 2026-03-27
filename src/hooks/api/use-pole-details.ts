/**
 * Hooks spécifiques pour les détails de pôles
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { DetailsPole } from '@/lib/generated/prisma/client'

const poleDetailsCrud = createCrudResources<DetailsPole>({
  endpoint: '/pole-details',
  queryKey: ['poleDetails'],
})

/**
 * Récupérer tous les détails de pôles
 */
export function usePoleDetails(options?: CrudQueryOptions) {
  return poleDetailsCrud.useGetAll(options)
}

/**
 * Récupérer un détail de pôle par ID
 */
export function usePoleDetail(id: string | null | undefined, options?: CrudQueryOptions) {
  return poleDetailsCrud.useGetById(id, options)
}

/**
 * Récupérer les détails de pôles actifs
 */
export function useActivePoleDetails() {
  return poleDetailsCrud.useGetAll({
    where: { isActive: true },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

/**
 * Créer un détail de pôle
 */
export function useCreatePoleDetail() {
  return poleDetailsCrud.useCreate()
}

/**
 * Mettre à jour un détail de pôle
 */
export function useUpdatePoleDetail() {
  return poleDetailsCrud.useUpdate()
}

/**
 * Supprimer un détail de pôle
 */
export function useDeletePoleDetail() {
  return poleDetailsCrud.useDelete()
}

