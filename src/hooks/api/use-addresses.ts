/**
 * Hooks spécifiques pour les adresses
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Address } from '@/lib/generated/prisma/client'

const addressesCrud = createCrudResources<Address>({
  endpoint: '/addresses',
  queryKey: ['addresses'],
})

/**
 * Récupérer toutes les adresses
 */
export function useAddresses(options?: CrudQueryOptions) {
  return addressesCrud.useGetAll(options)
}

/**
 * Récupérer une adresse par ID
 */
export function useAddress(id: string | null | undefined, options?: CrudQueryOptions) {
  return addressesCrud.useGetById(id, options)
}

/**
 * Récupérer les adresses avec pagination
 */
export function useAddressesPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return addressesCrud.useGetPaginated(page, limit, options)
}

/**
 * Créer une adresse
 */
export function useCreateAddress() {
  return addressesCrud.useCreate()
}

/**
 * Mettre à jour une adresse
 */
export function useUpdateAddress() {
  return addressesCrud.useUpdate()
}

/**
 * Supprimer une adresse
 */
export function useDeleteAddress() {
  return addressesCrud.useDelete()
}

