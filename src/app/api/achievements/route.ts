/**
 * API Routes pour les réalisations
 * GET    /api/achievements - Liste toutes les réalisations
 * GET    /api/achievements?id=xxx - Récupère une réalisation par ID
 * POST   /api/achievements - Crée une nouvelle réalisation
 * PUT    /api/achievements?id=xxx - Met à jour une réalisation
 * DELETE /api/achievements?id=xxx - Supprime une réalisation
 */

import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation pour la création
const createAchievementSchema = z.object({
  label: z.string().optional().nullable(),
  value: z.number().int().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  achievementSectionId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// Schéma de validation pour la mise à jour
const updateAchievementSchema = createAchievementSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Achievement',
  validateCreate: (data) => createAchievementSchema.parse(data),
  validateUpdate: (data) => updateAchievementSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

