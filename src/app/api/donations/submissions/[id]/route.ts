import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateDonationSchema = z
  .object({
    title: z.string().min(1).optional(),
    message: z.string().optional(),
  })
  .strict()

/**
 * GET /api/donations/submissions/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

/**
 * PUT /api/donations/submissions/[id] — Champs alignés sur le modèle `Donation`.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateDonationSchema.parse(body)

    const data: { title?: string; message?: string | null } = {}
    if (validatedData.title !== undefined) data.title = validatedData.title
    if (validatedData.message !== undefined) data.message = validatedData.message

    const donation = await prisma.donation.update({
      where: { id },
      data,
    })

    return successResponse(donation, 'Don mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
