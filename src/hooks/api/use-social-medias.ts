/**
 * Hooks spécifiques pour les réseaux sociaux
 */

import { useCrud } from './use-crud'
import type { SocialMedia } from '@/lib/generated/prisma/client'

const socialMediasCrud = useCrud<SocialMedia>({
  endpoint: '/social-medias',
  queryKey: ['socialMedias'],
})

/**
 * Récupérer tous les réseaux sociaux
 */
export function useSocialMedias(options?: { where?: any; include?: any; orderBy?: any }) {
  return socialMediasCrud.useGetAll(options)
}

/**
 * Récupérer un réseau social par ID
 */
export function useSocialMedia(id: string | null | undefined, options?: { include?: any }) {
  return socialMediasCrud.useGetById(id, options)
}

/**
 * Récupérer les réseaux sociaux triés par ordre
 */
export function useSocialMediasOrdered() {
  return socialMediasCrud.useGetAll({
    orderBy: {
      order: 'asc',
    },
  })
}

/**
 * Créer un réseau social
 */
export function useCreateSocialMedia() {
  return socialMediasCrud.useCreate()
}

/**
 * Mettre à jour un réseau social
 */
export function useUpdateSocialMedia() {
  return socialMediasCrud.useUpdate()
}

/**
 * Supprimer un réseau social
 */
export function useDeleteSocialMedia() {
  return socialMediasCrud.useDelete()
}

