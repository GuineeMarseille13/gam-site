import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateDonationSchema = z.object({
  status: z.enum(['pending', 'paid', 'confirmed', 'cancelled']).optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  isAnonymous: z.boolean().optional(),
})

// GET /api/donations/submissions/[id] - Récupérer un don par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const donation = await prisma.donation.findUnique({
      where: { id },
    })

    if (!donation) {
      return notFoundResponse('Don')
    }

    return successResponse(donation)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/donations/submissions/[id] - Mettre à jour un don
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateDonationSchema.parse(body)

    const donation = await prisma.donation.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(donation, 'Don mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

