/**
 * Hooks spécifiques pour les adresses
 */

import { useCrud } from './use-crud'
import type { Address } from '@/lib/generated/prisma/client'

const addressesCrud = useCrud<Address>({
  endpoint: '/addresses',
  queryKey: ['addresses'],
})

/**
 * Récupérer toutes les adresses
 */
export function useAddresses(options?: { where?: any; include?: any; orderBy?: any }) {
  return addressesCrud.useGetAll(options)
}

/**
 * Récupérer une adresse par ID
 */
export function useAddress(id: string | null | undefined, options?: { include?: any }) {
  return addressesCrud.useGetById(id, options)
}

/**
 * Récupérer les adresses avec pagination
 */
export function useAddressesPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
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

