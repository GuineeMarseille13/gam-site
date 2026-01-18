/**
 * API Routes pour les sections de produits
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createProductSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateProductSectionSchema = createProductSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'ProductSection',
  validateCreate: (data) => createProductSectionSchema.parse(data),
  validateUpdate: (data) => updateProductSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

