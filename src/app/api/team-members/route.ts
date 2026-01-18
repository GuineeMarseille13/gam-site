/**
 * API Routes pour les membres d'équipe
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createTeamMemberSchema = z.object({
  personId: z.string().min(1, 'Person ID is required'),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  teamMemberSectionId: z.string().optional().nullable(),
})

const updateTeamMemberSchema = createTeamMemberSchema.partial()

const handlers = createCrudHandler({
  modelName: 'TeamMember',
  validateCreate: (data) => createTeamMemberSchema.parse(data),
  validateUpdate: (data) => updateTeamMemberSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

