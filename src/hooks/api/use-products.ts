/**
 * Hooks spécifiques pour les produits
 */

import { createCrudResources } from './use-crud'
import type { CrudQueryOptions } from './crud-query-types'
import type { Product } from '@/lib/generated/prisma/client'

const productsCrud = createCrudResources<Product>({
  endpoint: '/products',
  queryKey: ['products'],
})

/**
 * Récupérer tous les produits
 */
export function useProducts(options?: CrudQueryOptions) {
  return productsCrud.useGetAll(options)
}

/**
 * Récupérer un produit par ID
 */
export function useProduct(id: string | null | undefined, options?: CrudQueryOptions) {
  return productsCrud.useGetById(id, options)
}

/**
 * Récupérer les produits avec pagination
 */
export function useProductsPaginated(
  page: number = 1,
  limit: number = 10,
  options?: CrudQueryOptions
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

