/**
 * Hooks spécifiques pour les contacts
 */

import { useCrud } from './use-crud'
import type { Contact } from '@/lib/generated/prisma/client'

const contactsCrud = useCrud<Contact>({
  endpoint: '/contacts',
  queryKey: ['contacts'],
})

/**
 * Récupérer tous les contacts
 */
export function useContacts(options?: { where?: any; include?: any; orderBy?: any }) {
  return contactsCrud.useGetAll(options)
}

/**
 * Récupérer un contact par ID
 */
export function useContact(id: string | null | undefined, options?: { include?: any }) {
  return contactsCrud.useGetById(id, {
    ...options,
    include: {
      address: true,
      ...options?.include,
    },
  })
}

/**
 * Récupérer le contact principal (généralement le premier)
 */
export function useMainContact() {
  return contactsCrud.useGetAll({
    take: 1,
    include: {
      address: true,
    },
  })
}

/**
 * Créer un contact
 */
export function useCreateContact() {
  return contactsCrud.useCreate()
}

/**
 * Mettre à jour un contact
 */
export function useUpdateContact() {
  return contactsCrud.useUpdate()
}

/**
 * Supprimer un contact
 */
export function useDeleteContact() {
  return contactsCrud.useDelete()
}

