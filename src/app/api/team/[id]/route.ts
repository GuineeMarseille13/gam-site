import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateTeamMemberSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  image: z.string().url().optional(),
  order: z.number().int().optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/team/[id] - Récupérer un membre d'équipe par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    })

    if (!teamMember) {
      return notFoundResponse('Membre d\'équipe')
    }

    return successResponse(teamMember)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/team/[id] - Mettre à jour un membre d'équipe
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateTeamMemberSchema.parse(body)

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(teamMember, 'Membre d\'équipe mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/team/[id] - Supprimer un membre d'équipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.teamMember.delete({
      where: { id },
    })

    return successResponse(null, 'Membre d\'équipe supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

