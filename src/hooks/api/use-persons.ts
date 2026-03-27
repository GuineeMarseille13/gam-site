/**
 * Hooks spécifiques pour les personnes
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Person } from '@/lib/generated/prisma/client'

const personsCrud = createCrudResources<Person>({
  endpoint: '/persons',
  queryKey: ['persons'],
})

/**
 * Récupérer toutes les personnes
 */
export function usePersons(options?: CrudQueryOptions) {
  return personsCrud.useGetAll(options)
}

/**
 * Récupérer une personne par ID
 */
export function usePerson(id: string | null | undefined, options?: CrudQueryOptions) {
  return personsCrud.useGetById(id, {
    ...options,
    include: {
      address: true,
      ...options?.include,
    },
  })
}

/**
 * Récupérer les personnes avec pagination
 */
export function usePersonsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return personsCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les personnes par rôle
 */
export function usePersonsByRole(roleCode: string) {
  return personsCrud.useGetAll({
    where: {
      role: {
        code: roleCode,
      },
    },
    include: {
      address: true,
    },
    orderBy: {
      lastName: 'asc',
    },
  })
}

/**
 * Créer une personne
 */
export function useCreatePerson() {
  return personsCrud.useCreate()
}

/**
 * Mettre à jour une personne
 */
export function useUpdatePerson() {
  return personsCrud.useUpdate()
}

/**
 * Supprimer une personne
 */
export function useDeletePerson() {
  return personsCrud.useDelete()
}

