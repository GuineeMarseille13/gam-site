/**
 * API Routes pour les personnes
 * GET    /api/persons - Liste toutes les personnes
 * GET    /api/persons?id=xxx - Récupère une personne par ID
 * POST   /api/persons - Crée une nouvelle personne
 * PUT    /api/persons?id=xxx - Met à jour une personne
 * DELETE /api/persons?id=xxx - Supprime une personne
 */

import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation pour la création
const createPersonSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().nullable(),
  phone: z.string().min(1, 'Phone is required'),
  addressId: z.string().optional().nullable(),
  posteCode: z.string().optional().nullable(),
})

// Schéma de validation pour la mise à jour
const updatePersonSchema = createPersonSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Person',
  validateCreate: (data) => createPersonSchema.parse(data),
  validateUpdate: (data) => updatePersonSchema.parse(data),
  beforeCreate: async (data: unknown) => {
    const parsed = createPersonSchema.parse(data)
    const { posteCode, ...rest } = parsed
    const code = posteCode ?? 'VOLUNTEER'
    return {
      ...rest,
      poste: { connect: { code } },
    }
  },
  beforeUpdate: async (data: unknown) => {
    const parsed = updatePersonSchema.parse(data)
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

