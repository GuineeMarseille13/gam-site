import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateAdhesionSchema = z.object({
  status: z.enum(['pending', 'paid', 'confirmed', 'cancelled']).optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
})

// GET /api/adhesion/submissions/[id] - Récupérer une soumission d'adhésion par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const submission = await prisma.adhesionSubmission.findUnique({
      where: { id },
    })

    if (!submission) {
      return notFoundResponse('Soumission d\'adhésion')
    }

    return successResponse(submission)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/adhesion/submissions/[id] - Mettre à jour une soumission d'adhésion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateAdhesionSchema.parse(body)

    const submission = await prisma.adhesionSubmission.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(submission, 'Soumission d\'adhésion mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

