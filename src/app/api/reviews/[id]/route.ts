import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateReviewSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  body: z.string().optional(),
  img: z.string().url().optional(),
  country: z.string().optional(),
  rating: z.enum(['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

// GET /api/reviews/[id] - Récupérer un témoignage par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      return notFoundResponse('Témoignage')
    }

    return successResponse(review)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/reviews/[id] - Mettre à jour un témoignage
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateReviewSchema.parse(body)

    const review = await prisma.review.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(review, 'Témoignage mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/reviews/[id] - Supprimer un témoignage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.review.delete({
      where: { id },
    })

    return successResponse(null, 'Témoignage supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

