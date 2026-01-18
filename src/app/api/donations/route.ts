/**
 * API Routes pour les dons
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createDonationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().optional().nullable(),
  amount: z.number().int().positive('Amount must be positive'),
  personId: z.string().min(1, 'Person ID is required'),
})

const updateDonationSchema = createDonationSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Donation',
  validateCreate: (data) => createDonationSchema.parse(data),
  validateUpdate: (data) => updateDonationSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

