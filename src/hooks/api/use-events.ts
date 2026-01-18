/**
 * Hooks spécifiques pour les événements
 */

import { useCrud } from './use-crud'
import type { Event } from '@/lib/generated/prisma/client'

const eventsCrud = useCrud<Event>({
  endpoint: '/events',
  queryKey: ['events'],
})

/**
 * Récupérer tous les événements
 */
export function useEvents(options?: { where?: any; include?: any; orderBy?: any }) {
  return eventsCrud.useGetAll(options)
}

/**
 * Récupérer un événement par ID
 */
export function useEvent(id: string | null | undefined, options?: { include?: any }) {
  return eventsCrud.useGetById(id, options)
}

/**
 * Récupérer les événements avec pagination
 */
export function useEventsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
) {
  return eventsCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les événements à venir
 */
export function useUpcomingEvents(limit?: number) {
  const now = new Date().toISOString()
  return eventsCrud.useGetAll({
    where: {
      startDate: {
        gte: now,
      },
    },
    orderBy: {
      startDate: 'asc',
    },
    take: limit,
  })
}

/**
 * Récupérer les événements passés
 */
export function usePastEvents(limit?: number) {
  const now = new Date().toISOString()
  return eventsCrud.useGetAll({
    where: {
      endDate: {
        lt: now,
      },
    },
    orderBy: {
      startDate: 'desc',
    },
    take: limit,
  })
}

/**
 * Créer un événement
 */
export function useCreateEvent() {
  return eventsCrud.useCreate()
}

/**
 * Mettre à jour un événement
 */
export function useUpdateEvent() {
  return eventsCrud.useUpdate()
}

/**
 * Supprimer un événement
 */
export function useDeleteEvent() {
  return eventsCrud.useDelete()
}

