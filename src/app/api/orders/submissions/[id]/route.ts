import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
})

// GET /api/orders/submissions/[id] - Récupérer une commande par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return notFoundResponse('Commande')
    }

    return successResponse(order)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/orders/submissions/[id] - Mettre à jour une commande
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateOrderSchema.parse(body)

    const order = await prisma.order.update({
      where: { id },
      data: validatedData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return successResponse(order, 'Commande mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

