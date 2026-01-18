/**
 * Hooks spécifiques pour les raisons
 */

import { useCrud } from './use-crud'
import type { Reason } from '@/lib/generated/prisma/client'

const reasonsCrud = useCrud<Reason>({
  endpoint: '/reasons',
  queryKey: ['reasons'],
})

/**
 * Récupérer toutes les raisons
 */
export function useReasons(options?: { where?: any; include?: any; orderBy?: any }) {
  return reasonsCrud.useGetAll(options)
}

/**
 * Récupérer une raison par ID
 */
export function useReason(id: string | null | undefined, options?: { include?: any }) {
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

