/**
 * API Routes pour "À propos de nous"
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createAboutUsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  aboutUsSectionId: z.string().optional().nullable(),
})

const updateAboutUsSchema = createAboutUsSchema.partial()

const handlers = createCrudHandler({
  modelName: 'AboutUs',
  validateCreate: (data) => createAboutUsSchema.parse(data),
  validateUpdate: (data) => updateAboutUsSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

