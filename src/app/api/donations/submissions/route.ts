import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'

/**
 * GET /api/donations/submissions — Le modèle `Donation` n’a pas de champ `status` (suivi via `Payment`).
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined

    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.donation.count()
    const totalAmount = await prisma.donation.aggregate({
      _sum: { amount: true },
    })

    return successResponse({
      data: donations,
      total,
      totalAmount: totalAmount._sum.amount ?? 0,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
