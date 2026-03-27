import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { PaymentStatus } from '@/lib/generated/prisma/enums'
import type { Prisma } from '@/lib/generated/prisma/client'

/**
 * GET /api/orders/submissions — Filtre optionnel sur `payment.status`.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const statusParam = searchParams.get('status')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined

    const where: Prisma.OrderWhereInput = {}
    if (statusParam) {
      const key = statusParam.toUpperCase() as keyof typeof PaymentStatus
      if (key in PaymentStatus) {
        where.payment = { is: { status: PaymentStatus[key] } }
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.order.count({ where })
    const totalAmount = await prisma.order.aggregate({
      where,
      _sum: { totalAmount: true },
    })

    return successResponse({
      data: orders,
      total,
      totalAmount: totalAmount._sum.totalAmount ?? 0,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
