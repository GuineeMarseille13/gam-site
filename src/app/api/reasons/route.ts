/**
 * API Routes pour les raisons
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createReasonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  welcomeSectionId: z.string().optional().nullable(),
})

const updateReasonSchema = createReasonSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Reason',
  validateCreate: (data) => createReasonSchema.parse(data),
  validateUpdate: (data) => updateReasonSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

