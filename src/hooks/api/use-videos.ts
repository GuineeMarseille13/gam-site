/**
 * Hooks spécifiques pour les vidéos
 */

import { useCrud } from './use-crud'
import type { Video } from '@/lib/generated/prisma/client'

const videosCrud = useCrud<Video>({
  endpoint: '/videos',
  queryKey: ['videos'],
})

/**
 * Récupérer toutes les vidéos
 */
export function useVideos(options?: { where?: any; include?: any; orderBy?: any }) {
  return videosCrud.useGetAll(options)
}

/**
 * Récupérer une vidéo par ID
 */
export function useVideo(id: string | null | undefined, options?: { include?: any }) {
  return videosCrud.useGetById(id, options)
}

/**
 * Récupérer les vidéos avec pagination
 */
export function useVideosPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
) {
  return videosCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les vidéos actives
 */
export function useActiveVideos() {
  return videosCrud.useGetAll({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })
}

/**
 * Récupérer les vidéos par page et section
 */
export function useVideosByPageAndSection(page: string, section: string) {
  return videosCrud.useGetAll({
    where: {
      page,
      section,
      isActive: true,
    },
    orderBy: { order: 'asc' },
  })
}

/**
 * Créer une vidéo
 */
export function useCreateVideo() {
  return videosCrud.useCreate()
}

/**
 * Mettre à jour une vidéo
 */
export function useUpdateVideo() {
  return videosCrud.useUpdate()
}

/**
 * Supprimer une vidéo
 */
export function useDeleteVideo() {
  return videosCrud.useDelete()
}

