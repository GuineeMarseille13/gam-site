/**
 * API Routes pour les sections d'accueil
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createWelcomeSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateWelcomeSectionSchema = createWelcomeSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'WelcomeSection',
  validateCreate: (data) => createWelcomeSectionSchema.parse(data),
  validateUpdate: (data) => updateWelcomeSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

