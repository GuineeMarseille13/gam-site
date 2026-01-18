/**
 * API Routes pour les images
 * GET    /api/images - Liste toutes les images
 * GET    /api/images?id=xxx - Récupère une image par ID
 * POST   /api/images - Crée une nouvelle image
 * PUT    /api/images?id=xxx - Met à jour une image
 * DELETE /api/images?id=xxx - Supprime une image
 */

import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation pour la création
const createImageSchema = z.object({
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  alt: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  page: z.string().min(1, 'Page is required'),
  section: z.string().min(1, 'Section is required'),
  order: z.number().int().default(0),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  size: z.number().int().positive().optional().nullable(),
  format: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  poleId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
})

// Schéma de validation pour la mise à jour
const updateImageSchema = createImageSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Image',
  validateCreate: (data) => createImageSchema.parse(data),
  validateUpdate: (data) => updateImageSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

