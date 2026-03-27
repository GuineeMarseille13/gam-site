/**
 * Hooks spécifiques pour les commandes
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Order } from '@/lib/generated/prisma/client'

const ordersCrud = createCrudResources<Order>({
  endpoint: '/orders',
  queryKey: ['orders'],
})

/**
 * Récupérer toutes les commandes
 */
export function useOrders(options?: CrudQueryOptions) {
  return ordersCrud.useGetAll(options)
}

/**
 * Récupérer une commande par ID
 */
export function useOrder(id: string | null | undefined, options?: CrudQueryOptions) {
  return ordersCrud.useGetById(id, {
    ...options,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      person: true,
      ...options?.include,
    },
  })
}

/**
 * Récupérer les commandes avec pagination
 */
export function useOrdersPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
) {
  return ordersCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les commandes d'une personne
 */
export function useOrdersByPerson(personId: string | null | undefined) {
  return ordersCrud.useGetAll(
    {
      where: personId ? { personId } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    },
    {
      enabled: !!personId,
    }
  )
}

/**
 * Récupérer les commandes par statut
 */
export function useOrdersByStatus(status: string) {
  return ordersCrud.useGetAll({
    where: { status },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      person: true,
    },
  })
}

/**
 * Créer une commande
 */
export function useCreateOrder() {
  return ordersCrud.useCreate()
}

/**
 * Mettre à jour une commande
 */
export function useUpdateOrder() {
  return ordersCrud.useUpdate()
}

/**
 * Supprimer une commande
 */
export function useDeleteOrder() {
  return ordersCrud.useDelete()
}

