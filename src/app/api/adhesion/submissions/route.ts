import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'

// GET /api/adhesion/submissions - Liste toutes les adhésions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActiveParam = searchParams.get('isActive')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const where: any = {}
    if (isActiveParam !== null) where.isActive = isActiveParam === 'true'

    const memberShips = await prisma.memberShip.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        person: true,
        payment: true,
      },
    })

    const total = await prisma.memberShip.count({ where })

    return successResponse({
      data: memberShips,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
