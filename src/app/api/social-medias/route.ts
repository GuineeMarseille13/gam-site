/**
 * API Routes pour les réseaux sociaux
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createSocialMediaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
})

const updateSocialMediaSchema = createSocialMediaSchema.partial()

const handlers = createCrudHandler({
  modelName: 'SocialMedia',
  validateCreate: (data) => createSocialMediaSchema.parse(data),
  validateUpdate: (data) => updateSocialMediaSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

