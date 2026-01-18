/**
 * API Routes pour les sections de réalisations
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createAchievementSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateAchievementSectionSchema = createAchievementSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'AchievementSection',
  validateCreate: (data) => createAchievementSectionSchema.parse(data),
  validateUpdate: (data) => updateAchievementSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

