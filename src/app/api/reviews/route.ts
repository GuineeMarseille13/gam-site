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

// Schéma de validation pour la création (posteCode = code Poste, ex. MEMBER)
const createReviewSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  posteCode: z.string().min(1, 'posteCode is required'),
  body: z.string().min(1, 'Body is required'),
  avatarUrl: z.string().url('Invalid URL').optional().nullable(),
  country: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  reviewSectionId: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
})

// Schéma de validation pour la mise à jour
const updateReviewSchema = createReviewSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Review',
  validateCreate: (data) => createReviewSchema.parse(data),
  validateUpdate: (data) => updateReviewSchema.parse(data),
  beforeCreate: async (data: unknown) => {
    const parsed = createReviewSchema.parse(data)
    const { posteCode, ...rest } = parsed
    const publishedAt =
      rest.isVerified && rest.publishedAt == null ? new Date() : rest.publishedAt
    return {
      ...rest,
      publishedAt,
      poste: { connect: { code: posteCode } },
    }
  },
  beforeUpdate: async (data: unknown) => {
    const parsed = updateReviewSchema.parse(data)
    const { posteCode, ...rest } = parsed
    if (posteCode) {
      return { ...rest, poste: { connect: { code: posteCode } } }
    }
    return rest
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

