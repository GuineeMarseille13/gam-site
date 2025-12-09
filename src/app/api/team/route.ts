import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const createTeamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  image: z.string().url(),
  order: z.number().int().default(0),
  bio: z.string().optional(),
  isActive: z.boolean().default(true),
})

// GET /api/team - Liste tous les membres de l'équipe
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return successResponse(teamMembers)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/team - Créer un nouveau membre d'équipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createTeamMemberSchema.parse(body)

    const teamMember = await prisma.teamMember.create({
      data: validatedData,
    })

    return successResponse(teamMember, 'Membre d\'équipe créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

