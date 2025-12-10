import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'

// GET /api/donations/submissions - Liste toutes les soumissions de dons
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const where: any = {}
    if (status) where.status = status

    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.donation.count({ where })
    const totalAmount = await prisma.donation.aggregate({
      where: { status: 'confirmed' },
      _sum: { amount: true },
    })

    return successResponse({
      data: donations,
      total,
      totalAmount: totalAmount._sum.amount || 0,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

