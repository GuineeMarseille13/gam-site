/**
 * API Routes pour les sections de partenaires
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createPartnerSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updatePartnerSectionSchema = createPartnerSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'PartnerSection',
  validateCreate: (data) => createPartnerSectionSchema.parse(data),
  validateUpdate: (data) => updatePartnerSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

