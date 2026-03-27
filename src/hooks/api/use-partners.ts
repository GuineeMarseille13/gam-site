/**
 * Hooks spécifiques pour les partenaires
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Partner } from '@/lib/generated/prisma/client'

const partnersCrud = createCrudResources<Partner>({
  endpoint: '/partners',
  queryKey: ['partners'],
})

/**
 * Récupérer tous les partenaires
 */
export function usePartners(options?: CrudQueryOptions) {
  return partnersCrud.useGetAll(options)
}

/**
 * Récupérer un partenaire par ID
 */
export function usePartner(id: string | null | undefined, options?: CrudQueryOptions) {
  return partnersCrud.useGetById(id, options)
}

/**
 * Récupérer les partenaires avec pagination
 */
export function usePartnersPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return partnersCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les partenaires avec leurs sections
 */
export function usePartnersWithSections() {
  return partnersCrud.useGetAll({
    include: {
      partnerSection: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

/**
 * Créer un partenaire
 */
export function useCreatePartner() {
  return partnersCrud.useCreate()
}

/**
 * Mettre à jour un partenaire
 */
export function useUpdatePartner() {
  return partnersCrud.useUpdate()
}

/**
 * Supprimer un partenaire
 */
export function useDeletePartner() {
  return partnersCrud.useDelete()
}

