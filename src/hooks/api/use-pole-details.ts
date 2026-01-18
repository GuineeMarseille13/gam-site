/**
 * Hooks spécifiques pour les détails de pôles
 */

import { useCrud } from './use-crud'
import type { DetailsPole } from '@/lib/generated/prisma/client'

const poleDetailsCrud = useCrud<DetailsPole>({
  endpoint: '/pole-details',
  queryKey: ['poleDetails'],
})

/**
 * Récupérer tous les détails de pôles
 */
export function usePoleDetails(options?: { where?: any; include?: any; orderBy?: any }) {
  return poleDetailsCrud.useGetAll(options)
}

/**
 * Récupérer un détail de pôle par ID
 */
export function usePoleDetail(id: string | null | undefined, options?: { include?: any }) {
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

