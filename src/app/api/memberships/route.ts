/**
 * API Routes pour les adhésions
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createMembershipSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  amount: z.number().int().positive('Amount must be positive'),
  year: z.number().int().min(2000).max(2100),
  isActive: z.boolean().default(true),
  personId: z.string().min(1, 'Person ID is required'),
})

const updateMembershipSchema = createMembershipSchema.partial()

const handlers = createCrudHandler({
  modelName: 'MemberShip',
  validateCreate: (data) => createMembershipSchema.parse(data),
  validateUpdate: (data) => updateMembershipSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

