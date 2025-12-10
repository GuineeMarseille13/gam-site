import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateVolunteerSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().url().optional(),
  role: z.string().optional(),
  initials: z.string().min(1).max(2).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/volunteers/[id] - Récupérer un bénévole par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
    })

    if (!volunteer) {
      return notFoundResponse('Bénévole')
    }

    return successResponse(volunteer)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/volunteers/[id] - Mettre à jour un bénévole
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateVolunteerSchema.parse(body)

    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(volunteer, 'Bénévole mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/volunteers/[id] - Supprimer un bénévole
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.volunteer.delete({
      where: { id },
    })

    return successResponse(null, 'Bénévole supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

