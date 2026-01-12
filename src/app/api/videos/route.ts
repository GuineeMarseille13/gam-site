/**
 * API Routes pour les vidéos
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createVideoSchema = z.object({
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  thumbnail: z.string().url('Invalid URL').optional().nullable(),
  page: z.string().min(1, 'Page is required'),
  section: z.string().min(1, 'Section is required'),
  order: z.number().int().default(0),
  duration: z.number().int().positive().optional().nullable(),
  size: z.number().int().positive().optional().nullable(),
  format: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  autoplay: z.boolean().default(false),
  loop: z.boolean().default(false),
  muted: z.boolean().default(true),
  poleId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
})

const updateVideoSchema = createVideoSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Video',
  validateCreate: (data) => createVideoSchema.parse(data),
  validateUpdate: (data) => updateVideoSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

