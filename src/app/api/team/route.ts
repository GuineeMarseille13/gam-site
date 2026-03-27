import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import type { Prisma } from '@/lib/generated/prisma/client'
import { z } from 'zod'

const createTeamMemberSchema = z
  .object({
    personId: z.string().min(1),
    description: z.string().optional(),
    imageId: z.string().optional(),
    order: z.number().int().default(0),
    showOnSite: z.boolean().default(true),
    teamMemberSectionId: z.string().optional(),
  })
  .strict()

/**
 * GET /api/team — `showOnSite` remplace l’ancien `isActive`.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const where: Prisma.TeamMemberWhereInput = {}
    if (activeOnly) where.showOnSite = true

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        person: true,
      },
    })

    return successResponse(teamMembers)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/team — Nécessite un `personId` existant (`TeamMember` est lié à `Person`).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createTeamMemberSchema.parse(body)

    const teamMember = await prisma.teamMember.create({
      data: {
        personId: validatedData.personId,
        description: validatedData.description,
        imageId: validatedData.imageId,
        order: validatedData.order,
        showOnSite: validatedData.showOnSite,
        teamMemberSectionId: validatedData.teamMemberSectionId,
      },
      include: { person: true },
    })

    return successResponse(teamMember, "Membre d'équipe créé avec succès", 201)
  } catch (error) {
    return handleApiError(error)
  }
}
