/**
 * Hooks spécifiques pour les adhésions
 */

import { useCrud } from './use-crud'
import type { MemberShip } from '@/lib/generated/prisma/client'

const membershipsCrud = useCrud<MemberShip>({
  endpoint: '/memberships',
  queryKey: ['memberships'],
})

/**
 * Récupérer toutes les adhésions
 */
export function useMemberships(options?: { where?: any; include?: any; orderBy?: any }) {
  return membershipsCrud.useGetAll(options)
}

/**
 * Récupérer une adhésion par ID
 */
export function useMembership(id: string | null | undefined, options?: { include?: any }) {
  return membershipsCrud.useGetById(id, options)
}

/**
 * Récupérer les adhésions avec pagination
 */
export function useMembershipsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
) {
  return membershipsCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les adhésions actives
 */
export function useActiveMemberships() {
  return membershipsCrud.useGetAll({
    where: { isActive: true },
    orderBy: {
      year: 'desc',
      createdAt: 'desc',
    },
  })
}

/**
 * Récupérer les adhésions par année
 */
export function useMembershipsByYear(year: number) {
  return membershipsCrud.useGetAll({
    where: {
      year,
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Créer une adhésion
 */
export function useCreateMembership() {
  return membershipsCrud.useCreate()
}

/**
 * Mettre à jour une adhésion
 */
export function useUpdateMembership() {
  return membershipsCrud.useUpdate()
}

/**
 * Supprimer une adhésion
 */
export function useDeleteMembership() {
  return membershipsCrud.useDelete()
}

