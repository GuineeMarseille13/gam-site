import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { PaymentStatus } from '@/lib/generated/prisma/enums'
import { z } from 'zod'

const updateOrderSchema = z
  .object({
    status: z.nativeEnum(PaymentStatus).optional(),
    paymentMethod: z.string().optional(),
    paymentReference: z.string().optional(),
  })
  .strict()

/**
 * GET /api/orders/submissions/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
        payment: true,
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

/**
 * PUT /api/orders/submissions/[id] — Met à jour le `Payment` lié (pas de champs de statut sur `Order`).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateOrderSchema.parse(body)

    const existing = await prisma.order.findUnique({
      where: { id },
      select: { paymentId: true },
    })

    if (!existing) {
      return notFoundResponse('Commande')
    }

    const paymentData: {
      status?: PaymentStatus
      paymentMethod?: string
      paymentReference?: string
    } = {}
    if (validatedData.status !== undefined) paymentData.status = validatedData.status
    if (validatedData.paymentMethod !== undefined) paymentData.paymentMethod = validatedData.paymentMethod
    if (validatedData.paymentReference !== undefined) paymentData.paymentReference = validatedData.paymentReference

    if (Object.keys(paymentData).length > 0) {
      await prisma.payment.update({
        where: { id: existing.paymentId },
        data: paymentData,
      })
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    })

    return successResponse(order, 'Commande mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
