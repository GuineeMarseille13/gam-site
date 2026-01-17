/**
 * Hooks spécifiques pour les produits
 */

import { useCrud } from './use-crud'
import type { Product } from '@/lib/generated/prisma/client'

const productsCrud = useCrud<Product>({
  endpoint: '/products',
  queryKey: ['products'],
})

/**
 * Récupérer tous les produits
 */
export function useProducts(options?: { where?: any; include?: any; orderBy?: any }) {
  return productsCrud.useGetAll(options)
}

/**
 * Récupérer un produit par ID
 */
export function useProduct(id: string | null | undefined, options?: { include?: any }) {
  return productsCrud.useGetById(id, options)
}

/**
 * Récupérer les produits avec pagination
 */
export function useProductsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
) {
  return productsCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer uniquement les produits actifs
 */
export function useActiveProducts() {
  return productsCrud.useGetAll({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Créer un produit
 */
export function useCreateProduct() {
  return productsCrud.useCreate()
}

/**
 * Mettre à jour un produit
 */
export function useUpdateProduct() {
  return productsCrud.useUpdate()
}

/**
 * Supprimer un produit
 */
export function useDeleteProduct() {
  return productsCrud.useDelete()
}

