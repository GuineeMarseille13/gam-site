/**
 * API Routes pour les pôles
 * GET    /api/poles - Liste tous les pôles
 * GET    /api/poles?id=xxx - Récupère un pôle par ID
 * POST   /api/poles - Crée un nouveau pôle
 * PUT    /api/poles?id=xxx - Met à jour un pôle
 * DELETE /api/poles?id=xxx - Supprime un pôle
 */

import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation pour la création
const createPoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  poleSectionId: z.string().optional().nullable(),
})

// Schéma de validation pour la mise à jour
const updatePoleSchema = createPoleSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Pole',
  validateCreate: (data) => createPoleSchema.parse(data),
  validateUpdate: (data) => updatePoleSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

