/**
 * API Routes pour les catégories de produits
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createProductCategorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateProductCategorySchema = createProductCategorySchema.partial()

const handlers = createCrudHandler({
  modelName: 'ProductCategory',
  validateCreate: (data) => createProductCategorySchema.parse(data),
  validateUpdate: (data) => updateProductCategorySchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

