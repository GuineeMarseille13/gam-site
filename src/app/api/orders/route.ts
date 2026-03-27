/**
 * API Routes pour les commandes
 * GET    /api/orders - Liste toutes les commandes
 * GET    /api/orders?id=xxx - Récupère une commande par ID
 * POST   /api/orders - Crée une nouvelle commande
 * PUT    /api/orders?id=xxx - Met à jour une commande
 * DELETE /api/orders?id=xxx - Supprime une commande
 */

import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation pour la création
const createOrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  personId: z.string().optional(),
  totalAmount: z.number().int().positive('Total amount must be positive'),
  status: z.string().default('PENDING'),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  customer: z.record(z.string(), z.unknown()).optional(),
  shippingAddress: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().optional(),
})

// Schéma de validation pour la mise à jour
const updateOrderSchema = createOrderSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Order',
  validateCreate: (data) => createOrderSchema.parse(data),
  validateUpdate: (data) => updateOrderSchema.parse(data),
  beforeCreate: async (data: unknown) => {
    const parsed = createOrderSchema.parse(data)
    if (!parsed.orderNumber) {
      return {
        ...parsed,
        orderNumber: `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      }
    }
    return parsed
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

