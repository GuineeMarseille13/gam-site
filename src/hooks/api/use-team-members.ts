/**
 * Hooks spécifiques pour les membres d'équipe
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { TeamMember } from '@/lib/generated/prisma/client'

const teamMembersCrud = createCrudResources<TeamMember>({
  endpoint: '/team-members',
  queryKey: ['teamMembers'],
})

/**
 * Récupérer tous les membres d'équipe
 */
export function useTeamMembers(options?: CrudQueryOptions) {
  return teamMembersCrud.useGetAll(options)
}

/**
 * Récupérer un membre d'équipe par ID
 */
export function useTeamMember(id: string | null | undefined, options?: CrudQueryOptions) {
  return teamMembersCrud.useGetById(id, options)
}

/**
 * Récupérer les membres d'équipe avec pagination
 */
export function useTeamMembersPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return teamMembersCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les membres d'équipe actifs, triés par ordre
 */
export function useActiveTeamMembers() {
  return teamMembersCrud.useGetAll({
    where: { isActive: true },
    include: {
      teamMemberSection: true,
    },
    orderBy: {
      order: 'asc',
    },
  })
}

/**
 * Créer un membre d'équipe
 */
export function useCreateTeamMember() {
  return teamMembersCrud.useCreate()
}

/**
 * Mettre à jour un membre d'équipe
 */
export function useUpdateTeamMember() {
  return teamMembersCrud.useUpdate()
}

/**
 * Supprimer un membre d'équipe
 */
export function useDeleteTeamMember() {
  return teamMembersCrud.useDelete()
}

