/**
 * Exemples d'utilisation des routes API côté client
 * 
 * Ces fonctions montrent comment utiliser les routes API CRUD
 * depuis le frontend avec fetch ou des hooks React Query
 */

// ============================================
// Exemple 1: Utilisation basique avec fetch
// ============================================

/**
 * Récupère tous les produits actifs
 */
export async function getActiveProducts() {
  const response = await fetch('/api/products?where={"isActive":true}')
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

/**
 * Récupère un produit par ID avec sa catégorie
 */
export async function getProductById(id: string) {
  const response = await fetch(
    `/api/products?id=${id}&include={"productCategory":true}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  return response.json()
}

/**
 * Crée un nouveau produit
 */
export async function createProduct(data: {
  title: string
  price: number
  stock: number
  isActive?: boolean
}) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create product')
  }
  return response.json()
}

/**
 * Met à jour un produit
 */
export async function updateProduct(id: string, data: Partial<{
  title: string
  price: number
  stock: number
  isActive: boolean
}>) {
  const response = await fetch(`/api/products?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update product')
  }
  return response.json()
}

/**
 * Supprime un produit
 */
export async function deleteProduct(id: string) {
  const response = await fetch(`/api/products?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete product')
  }
  return response.json()
}

/**
 * Récupère les produits avec pagination
 */
export async function getProductsPaginated(page: number = 1, limit: number = 10) {
  const response = await fetch(
    `/api/products?page=${page}&limit=${limit}&orderBy={"createdAt":"desc"}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

// ============================================
// Exemple 2: Utilisation avec React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Hook pour récupérer tous les produits actifs
 */
export function useActiveProducts() {
  return useQuery({
    queryKey: ['products', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/products?where={"isActive":true}')
      if (!response.ok) throw new Error('Failed to fetch products')
      return response.json()
    },
  })
}

/**
 * Hook pour récupérer un produit par ID
 */
export function useProduct(id: string | null) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) return null
      const response = await fetch(`/api/products?id=${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      return response.json()
    },
    enabled: !!id,
  })
}

/**
 * Hook pour créer un produit
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      title: string
      price: number
      stock: number
      isActive?: boolean
    }) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create product')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/**
 * Hook pour mettre à jour un produit
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<{
        title: string
        price: number
        stock: number
        isActive: boolean
      }>
    }) => {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }
      return response.json()
    },
    onSuccess: (_, variables) => {
      // Invalider le cache pour ce produit et la liste
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/**
 * Hook pour supprimer un produit
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete product')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/**
 * Hook pour récupérer les produits avec pagination
 */
export function useProductsPaginated(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['products', 'paginated', page, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/products?page=${page}&limit=${limit}&orderBy={"createdAt":"desc"}`
      )
      if (!response.ok) throw new Error('Failed to fetch products')
      return response.json()
    },
  })
}

// ============================================
// Exemple 3: Utilisation pour d'autres modèles
// ============================================

/**
 * Récupère toutes les commandes d'une personne
 */
export async function getPersonOrders(personId: string) {
  const response = await fetch(
    `/api/orders?where={"personId":"${personId}"}&include={"items":{"include":{"product":true}}}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }
  return response.json()
}

/**
 * Récupère tous les avis actifs et vérifiés
 */
export async function getVerifiedReviews() {
  const response = await fetch(
    '/api/reviews?where={"isActive":true,"isVerified":true}&orderBy={"createdAt":"desc"}'
  )
  if (!response.ok) {
    throw new Error('Failed to fetch reviews')
  }
  return response.json()
}

/**
 * Récupère les images d'une page spécifique
 */
export async function getImagesByPage(page: string) {
  const response = await fetch(`/api/images?where={"page":"${page}"}`)
  if (!response.ok) {
    throw new Error('Failed to fetch images')
  }
  return response.json()
}

/**
 * Récupère les événements à venir
 */
export async function getUpcomingEvents() {
  const now = new Date().toISOString()
  const response = await fetch(
    `/api/events?where={"startDate":{"gte":"${now}"}}&orderBy={"startDate":"asc"}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch events')
  }
  return response.json()
}

