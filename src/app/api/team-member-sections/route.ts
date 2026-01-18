/**
 * API Routes pour les sections de membres d'équipe
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createTeamMemberSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateTeamMemberSectionSchema = createTeamMemberSectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'TeamMemberSection',
  validateCreate: (data) => createTeamMemberSectionSchema.parse(data),
  validateUpdate: (data) => updateTeamMemberSectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

