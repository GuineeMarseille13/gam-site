/**
 * Hooks spécifiques pour les pôles
 */

import { useCrud } from './use-crud'
import type { Pole } from '@/lib/generated/prisma/client'

const polesCrud = useCrud<Pole>({
  endpoint: '/poles',
  queryKey: ['poles'],
})

/**
 * Récupérer tous les pôles
 */
export function usePoles(options?: { where?: any; include?: any; orderBy?: any }) {
  return polesCrud.useGetAll(options)
}

/**
 * Récupérer un pôle par ID
 */
export function usePole(id: string | null | undefined, options?: { include?: any }) {
  return polesCrud.useGetById(id, options)
}

/**
 * Récupérer les pôles avec pagination
 */
export function usePolesPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
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

