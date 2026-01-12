/**
 * API Routes pour les bénévoles
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createVolunteerSchema = z.object({
  personId: z.string().min(1, 'Person ID is required'),
  isActive: z.boolean().default(true),
  volunteerSectionId: z.string().optional().nullable(),
})

const updateVolunteerSchema = createVolunteerSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Volunteer',
  validateCreate: (data) => createVolunteerSchema.parse(data),
  validateUpdate: (data) => updateVolunteerSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

