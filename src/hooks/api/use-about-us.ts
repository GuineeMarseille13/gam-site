/**
 * Hooks spécifiques pour "À propos de nous"
 */

import { useCrud } from './use-crud'
import type { AboutUs } from '@/lib/generated/prisma/client'

const aboutUsCrud = useCrud<AboutUs>({
  endpoint: '/about-us',
  queryKey: ['aboutUs'],
})

/**
 * Récupérer tous les contenus "À propos"
 */
export function useAboutUs(options?: { where?: any; include?: any; orderBy?: any }) {
  return aboutUsCrud.useGetAll(options)
}

/**
 * Récupérer un contenu "À propos" par ID
 */
export function useAboutUsItem(id: string | null | undefined, options?: { include?: any }) {
  return aboutUsCrud.useGetById(id, options)
}

/**
 * Récupérer les contenus "À propos" avec pagination
 */
export function useAboutUsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
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

