/**
 * API Routes pour les sections de pôles
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createPoleSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updatePoleSectionSchema = createPoleSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'PoleSection',
  validateCreate: (data) => createPoleSectionSchema.parse(data),
  validateUpdate: (data) => updatePoleSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

