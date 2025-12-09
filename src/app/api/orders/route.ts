import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const createOrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
  })),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
  paymentMethod: z.string().optional(),
})

// POST /api/orders - Créer une commande
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Calculer le total et vérifier les produits
    let totalAmount = 0
    const orderItems = []

    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        throw new Error(`Produit ${item.productId} introuvable`)
      }

      if (!product.inStock || product.stockQuantity < item.quantity) {
        throw new Error(`Stock insuffisant pour ${product.name}`)
      }

      const itemPrice = product.price.toNumber() * item.quantity
      totalAmount += itemPrice

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    // Générer un numéro de commande unique
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customer: validatedData.customer,
        totalAmount,
        shippingAddress: validatedData.shippingAddress || null,
        paymentMethod: validatedData.paymentMethod || null,
        status: 'pending',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // TODO: Envoyer un email de confirmation
    // TODO: Intégrer le paiement
    // TODO: Mettre à jour le stock

    return successResponse(order, 'Commande créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

