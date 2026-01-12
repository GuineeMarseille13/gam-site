/**
 * API Routes pour les produits
 * GET    /api/products - Liste tous les produits
 * GET    /api/products?id=xxx - Récupère un produit par ID
 * POST   /api/products - Crée un nouveau produit
 * PUT    /api/products?id=xxx - Met à jour un produit
 * DELETE /api/products?id=xxx - Supprime un produit
 */

import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation pour la création
const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().int().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  isActive: z.boolean().default(true),
  productSectionId: z.string().optional(),
  productCategoryId: z.string().optional(),
  imageId: z.string().optional(),
})

// Schéma de validation pour la mise à jour
const updateProductSchema = createProductSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Product',
  validateCreate: (data) => createProductSchema.parse(data),
  validateUpdate: (data) => updateProductSchema.parse(data),
  beforeCreate: async (data) => {
    // Logique avant création (ex: génération de slug, etc.)
    return data
  },
  afterCreate: async (result) => {
    // Logique après création (ex: envoi de notification, etc.)
    console.log(`Product created: ${result.id}`)
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

