/**
 * API Routes pour les sections "À propos de nous"
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createAboutUsSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateAboutUsSectionSchema = createAboutUsSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'AboutUsSection',
  validateCreate: (data) => createAboutUsSectionSchema.parse(data),
  validateUpdate: (data) => updateAboutUsSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

