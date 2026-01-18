import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'

// GET /api/orders/submissions - Liste toutes les commandes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const where: any = {}
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.order.count({ where })
    const totalAmount = await prisma.order.aggregate({
      where: { status: 'paid' },
      _sum: { totalAmount: true },
    })

    return successResponse({
      data: orders,
      total,
      totalAmount: totalAmount._sum.totalAmount || 0,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

