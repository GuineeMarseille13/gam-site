import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { adhesionPayloadSchema, PRICE_PER_MEMBER_EUR } from '@/app/adhesion/_schemas/adhesion.schema'

// POST /api/adhesion - Créer une soumission d'adhésion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = adhesionPayloadSchema.parse(body)

    const totalAmount = validatedData.members.length * PRICE_PER_MEMBER_EUR

    const submission = await prisma.adhesionSubmission.create({
      data: {
        members: validatedData.members,
        message: validatedData.message || null,
        totalAmount,
        status: 'pending',
      },
    })

    // TODO: Envoyer un email de confirmation
    // TODO: Intégrer le paiement

    return successResponse(submission, 'Demande d\'adhésion créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

