/**
 * Hooks spécifiques pour les images
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Image } from '@/lib/generated/prisma/client'

const imagesCrud = createCrudResources<Image>({
  endpoint: '/images',
  queryKey: ['images'],
})

/**
 * Récupérer toutes les images
 */
export function useImages(options?: CrudQueryOptions) {
  return imagesCrud.useGetAll(options)
}

/**
 * Récupérer une image par ID
 */
export function useImage(id: string | null | undefined, options?: CrudQueryOptions) {
  return imagesCrud.useGetById(id, options)
}

/**
 * Récupérer les images avec pagination
 */
export function useImagesPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return imagesCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les images actives
 */
export function useActiveImages() {
  return imagesCrud.useGetAll({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })
}

/**
 * Récupérer les images par page et section
 */
export function useImagesByPageAndSection(page: string, section: string) {
  return imagesCrud.useGetAll({
    where: {
      page,
      section,
      isActive: true,
    },
    orderBy: { order: 'asc' },
  })
}

/**
 * Créer une image
 */
export function useCreateImage() {
  return imagesCrud.useCreate()
}

/**
 * Mettre à jour une image
 */
export function useUpdateImage() {
  return imagesCrud.useUpdate()
}

/**
 * Supprimer une image
 */
export function useDeleteImage() {
  return imagesCrud.useDelete()
}

