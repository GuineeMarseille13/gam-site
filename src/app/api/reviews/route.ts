/**
 * API Routes pour les avis
 * GET    /api/reviews - Liste tous les avis
 * GET    /api/reviews?id=xxx - Récupère un avis par ID
 * POST   /api/reviews - Crée un nouvel avis
 * PUT    /api/reviews?id=xxx - Met à jour un avis
 * DELETE /api/reviews?id=xxx - Supprime un avis
 */

import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createReviewSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  body: z.string().min(1, 'Body is required'),
  avatarUrl: z.string().url('Invalid URL').optional().nullable(),
  sourceLabel: z.string().max(80).optional().nullable(),
  sourceImageUrl: z.string().url('Invalid URL').optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  reviewSectionId: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
})

const updateReviewSchema = createReviewSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Review',
  validateCreate: (data) => createReviewSchema.parse(data),
  validateUpdate: (data) => updateReviewSchema.parse(data),
  beforeCreate: async (data: unknown) => {
    const parsed = createReviewSchema.parse(data)
    const publishedAt =
      parsed.isVerified && parsed.publishedAt == null ? new Date() : parsed.publishedAt
    return {
      ...parsed,
      publishedAt,
    }
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
