/**
 * API Routes pour les produits
 * GET    /api/products - Liste tous les produits (filtrés par query params)
 * POST   /api/products - Crée un nouveau produit
 * PUT    /api/products - Met à jour un produit
 * DELETE /api/products - Supprime un produit
 */

import { NextRequest } from 'next/server'
import type { Prisma } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// GET /api/products - Liste les produits avec filtres optionnels
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'
    const inStock = searchParams.get('inStock') === 'true'

    const where: Prisma.ProductWhereInput = {}
    if (activeOnly) where.isActive = true
    if (inStock) where.stock = { gt: 0 }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(products)
  } catch (error) {
    return handleApiError(error)
  }
}

const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().int().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  isActive: z.boolean().default(true),
  productSectionId: z.string().optional(),
  productCategoryId: z.string().optional(),
  imageId: z.string().optional(),
})

const updateProductSchema = createProductSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Product',
  validateCreate: (data) => createProductSchema.parse(data),
  validateUpdate: (data) => updateProductSchema.parse(data),
})

export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
