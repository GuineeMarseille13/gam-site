/**
 * API Routes pour les sections de bénévoles
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createVolunteerSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateVolunteerSectionSchema = createVolunteerSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'VolunteerSection',
  validateCreate: (data) => createVolunteerSectionSchema.parse(data),
  validateUpdate: (data) => updateVolunteerSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

