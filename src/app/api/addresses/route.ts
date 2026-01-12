/**
 * API Routes pour les adresses
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createAddressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  state: z.string().min(1, 'State is required'),
  countryCode: z.string().min(2).max(2, 'Country code must be 2 characters'),
})

const updateAddressSchema = createAddressSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Address',
  validateCreate: (data) => createAddressSchema.parse(data),
  validateUpdate: (data) => updateAddressSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

