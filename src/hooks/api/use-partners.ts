/**
 * Hooks spécifiques pour les partenaires
 */

import { useCrud } from './use-crud'
import type { Partner } from '@/lib/generated/prisma/client'

const partnersCrud = useCrud<Partner>({
  endpoint: '/partners',
  queryKey: ['partners'],
})

/**
 * Récupérer tous les partenaires
 */
export function usePartners(options?: { where?: any; include?: any; orderBy?: any }) {
  return partnersCrud.useGetAll(options)
}

/**
 * Récupérer un partenaire par ID
 */
export function usePartner(id: string | null | undefined, options?: { include?: any }) {
  return partnersCrud.useGetById(id, options)
}

/**
 * Récupérer les partenaires avec pagination
 */
export function usePartnersPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
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

