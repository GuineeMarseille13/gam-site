/**
 * Hooks spécifiques pour les dons
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Donation } from '@/lib/generated/prisma/client'

const donationsCrud = createCrudResources<Donation>({
  endpoint: '/donations',
  queryKey: ['donations'],
})

/**
 * Récupérer tous les dons
 */
export function useDonations(options?: CrudQueryOptions) {
  return donationsCrud.useGetAll(options)
}

/**
 * Récupérer un don par ID
 */
export function useDonation(id: string | null | undefined, options?: CrudQueryOptions) {
  return donationsCrud.useGetById(id, options)
}

/**
 * Récupérer les dons avec pagination
 */
export function useDonationsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return donationsCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les dons récents, triés par date
 */
export function useRecentDonations(limit?: number) {
  return donationsCrud.useGetAll({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

/**
 * Créer un don
 */
export function useCreateDonation() {
  return donationsCrud.useCreate()
}

/**
 * Mettre à jour un don
 */
export function useUpdateDonation() {
  return donationsCrud.useUpdate()
}

/**
 * Supprimer un don
 */
export function useDeleteDonation() {
  return donationsCrud.useDelete()
}

