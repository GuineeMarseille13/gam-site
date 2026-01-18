import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'

// GET /api/adhesion/submissions - Liste toutes les soumissions d'adhésion
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const where: any = {}
    if (status) where.status = status

    const submissions = await prisma.adhesionSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.adhesionSubmission.count({ where })

    return successResponse({
      data: submissions,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

