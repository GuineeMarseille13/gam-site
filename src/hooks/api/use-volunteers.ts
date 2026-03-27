/**
 * Hooks spécifiques pour les bénévoles
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Volunteer } from '@/lib/generated/prisma/client'

const volunteersCrud = createCrudResources<Volunteer>({
  endpoint: '/volunteers',
  queryKey: ['volunteers'],
})

/**
 * Récupérer tous les bénévoles
 */
export function useVolunteers(options?: CrudQueryOptions) {
  return volunteersCrud.useGetAll(options)
}

/**
 * Récupérer un bénévole par ID
 */
export function useVolunteer(id: string | null | undefined, options?: CrudQueryOptions) {
  return volunteersCrud.useGetById(id, options)
}

/**
 * Récupérer les bénévoles avec pagination
 */
export function useVolunteersPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return volunteersCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les bénévoles actifs avec leurs informations personnelles
 */
export function useActiveVolunteers() {
  return volunteersCrud.useGetAll({
    where: { isActive: true },
    include: {
      volunteerSection: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

/**
 * Créer un bénévole
 */
export function useCreateVolunteer() {
  return volunteersCrud.useCreate()
}

/**
 * Mettre à jour un bénévole
 */
export function useUpdateVolunteer() {
  return volunteersCrud.useUpdate()
}

/**
 * Supprimer un bénévole
 */
export function useDeleteVolunteer() {
  return volunteersCrud.useDelete()
}

