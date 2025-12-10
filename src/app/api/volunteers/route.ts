import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createVolunteerSchema = z.object({
  name: z.string().min(1),
  image: z.string().url(),
  role: z.string().optional(),
  initials: z.string().min(1).max(2),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/volunteers - Liste tous les bénévoles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true

    const volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return successResponse(volunteers)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/volunteers - Créer un nouveau bénévole
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createVolunteerSchema.parse(body)

    const volunteer = await prisma.volunteer.create({
      data: validatedData,
    })

    return successResponse(volunteer, 'Bénévole créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

