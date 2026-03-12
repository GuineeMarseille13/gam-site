import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateMemberShipSchema = z.object({
  isActive: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
})

// GET /api/adhesion/submissions/[id] - Récupérer une adhésion par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const memberShip = await prisma.memberShip.findUnique({
      where: { id },
      include: {
        person: true,
        payment: true,
      },
    })

    if (!memberShip) {
      return notFoundResponse('Adhésion')
    }

    return successResponse(memberShip)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/adhesion/submissions/[id] - Mettre à jour une adhésion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateMemberShipSchema.parse(body)

    const memberShip = await prisma.memberShip.update({
      where: { id },
      data: validatedData,
      include: {
        person: true,
        payment: true,
      },
    })

    return successResponse(memberShip, 'Adhésion mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
