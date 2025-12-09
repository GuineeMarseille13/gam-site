import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api/response'
import { donPayloadSchema } from '@/app/don/_schemas/don.schema'

// POST /api/donations - Créer un don
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = donPayloadSchema.parse(body)

    const donation = await prisma.donation.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        amount: validatedData.amount,
        message: validatedData.message || null,
        status: 'pending',
        isAnonymous: false,
      },
    })

    // TODO: Envoyer un email de confirmation
    // TODO: Intégrer le paiement

    return successResponse(donation, 'Don créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

