/**
 * API Routes pour les items de commande
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createOrderItemSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: z.number().int().positive('Price must be positive'),
  subtotal: z.number().int().positive('Subtotal must be positive'),
})

const updateOrderItemSchema = createOrderItemSchema.partial()

const handlers = createCrudHandler({
  modelName: 'OrderItem',
  validateCreate: (data) => {
    const parsed = createOrderItemSchema.parse(data)
    // Calculer automatiquement le subtotal si non fourni
    if (!parsed.subtotal) {
      parsed.subtotal = parsed.quantity * parsed.price
    }
    return parsed
  },
  validateUpdate: (data) => {
    const parsed = updateOrderItemSchema.parse(data)
    // Recalculer le subtotal si quantity ou price est modifié
    if (parsed.quantity && parsed.price) {
      parsed.subtotal = parsed.quantity * parsed.price
    }
    return parsed
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

