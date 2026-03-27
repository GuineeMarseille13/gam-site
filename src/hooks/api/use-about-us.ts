/**
 * Hooks spécifiques pour "À propos de nous"
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { AboutUs } from '@/lib/generated/prisma/client'

const aboutUsCrud = createCrudResources<AboutUs>({
  endpoint: '/about-us',
  queryKey: ['aboutUs'],
})

/**
 * Récupérer tous les contenus "À propos"
 */
export function useAboutUs(options?: CrudQueryOptions) {
  return aboutUsCrud.useGetAll(options)
}

/**
 * Récupérer un contenu "À propos" par ID
 */
export function useAboutUsItem(id: string | null | undefined, options?: CrudQueryOptions) {
  return aboutUsCrud.useGetById(id, options)
}

/**
 * Récupérer les contenus "À propos" avec pagination
 */
export function useAboutUsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return aboutUsCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les contenus "À propos" avec leurs sections
 */
export function useAboutUsWithSections() {
  return aboutUsCrud.useGetAll({
    include: {
      aboutUsSection: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

/**
 * Créer un contenu "À propos"
 */
export function useCreateAboutUs() {
  return aboutUsCrud.useCreate()
}

/**
 * Mettre à jour un contenu "À propos"
 */
export function useUpdateAboutUs() {
  return aboutUsCrud.useUpdate()
}

/**
 * Supprimer un contenu "À propos"
 */
export function useDeleteAboutUs() {
  return aboutUsCrud.useDelete()
}

