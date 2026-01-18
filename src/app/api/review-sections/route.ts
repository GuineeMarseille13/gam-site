/**
 * API Routes pour les sections d'avis
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createReviewSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateReviewSectionSchema = createReviewSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'ReviewSection',
  validateCreate: (data) => createReviewSectionSchema.parse(data),
  validateUpdate: (data) => updateReviewSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

