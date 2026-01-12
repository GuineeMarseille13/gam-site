/**
 * API Routes pour les partenaires
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createPartnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  url: z.string().url('Invalid URL').optional().nullable(),
  partnerSectionId: z.string().optional().nullable(),
})

const updatePartnerSchema = createPartnerSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Partner',
  validateCreate: (data) => createPartnerSchema.parse(data),
  validateUpdate: (data) => updatePartnerSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

