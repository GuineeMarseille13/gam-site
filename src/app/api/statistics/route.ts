import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createStatisticSchema = z.object({
  label: z.string().min(1),
  value: z.number().int(),
  color: z.enum(['red', 'yellow', 'green', 'blue']),
  icon: z.string(),
  suffix: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/statistics - Liste toutes les statistiques
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true

    const statistics = await prisma.statistic.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return successResponse(statistics)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/statistics - Créer une nouvelle statistique
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createStatisticSchema.parse(body)

    const statistic = await prisma.statistic.create({
      data: validatedData,
    })

    return successResponse(statistic, 'Statistique créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

