/**
 * API Routes pour les détails de pôles
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createPoleDetailSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  videoId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  aboutSectionText: z.string().max(12_000).optional().nullable(),
  servicesSectionText: z.string().max(12_000).optional().nullable(),
  achievementsSectionText: z.string().max(12_000).optional().nullable(),
})

const updatePoleDetailSchema = createPoleDetailSchema.partial()

const handlers = createCrudHandler({
  modelName: 'DetailsPole',
  validateCreate: (data) => createPoleDetailSchema.parse(data),
  validateUpdate: (data) => updatePoleDetailSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

