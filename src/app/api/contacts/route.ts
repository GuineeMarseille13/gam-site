/**
 * API Routes pour les contacts
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createContactSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  addressId: z.string().min(1, 'Address ID is required'),
})

const updateContactSchema = createContactSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Contact',
  validateCreate: (data) => createContactSchema.parse(data),
  validateUpdate: (data) => updateContactSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

