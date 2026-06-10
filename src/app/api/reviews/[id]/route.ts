import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const RATING_FROM_LEGACY = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
} as const

const updateReviewSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    body: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    img: z.string().url().optional(),
    sourceLabel: z.string().max(80).optional().nullable(),
    sourceImageUrl: z.string().url().optional().nullable(),
    rating: z.union([z.number().int().min(1).max(5), z.enum(['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'])]).optional(),
    isActive: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    isVerified: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/reviews/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

/**
 * PUT /api/reviews/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateReviewSchema.parse(body)

    const data: {
      firstName?: string
      lastName?: string
      body?: string
      avatarUrl?: string | null
      sourceLabel?: string | null
      sourceImageUrl?: string | null
      rating?: number
      isActive?: boolean
      isVerified?: boolean
    } = {}

    if (validatedData.firstName !== undefined) data.firstName = validatedData.firstName
    if (validatedData.lastName !== undefined) data.lastName = validatedData.lastName
    if (validatedData.name !== undefined) {
      const parts = validatedData.name.trim().split(/\s+/)
      data.firstName = parts[0] ?? ''
      data.lastName = parts.slice(1).join(' ') || ''
    }
    if (validatedData.body !== undefined) data.body = validatedData.body
    if (validatedData.avatarUrl !== undefined) data.avatarUrl = validatedData.avatarUrl
    if (validatedData.img !== undefined) data.avatarUrl = validatedData.img
    if (validatedData.sourceLabel !== undefined) data.sourceLabel = validatedData.sourceLabel
    if (validatedData.sourceImageUrl !== undefined) data.sourceImageUrl = validatedData.sourceImageUrl
    if (validatedData.rating !== undefined) {
      data.rating =
        typeof validatedData.rating === 'number'
          ? validatedData.rating
          : RATING_FROM_LEGACY[validatedData.rating]
    }
    if (validatedData.isActive !== undefined) data.isActive = validatedData.isActive
    if (validatedData.isPublished !== undefined) data.isActive = validatedData.isPublished
    if (validatedData.isVerified !== undefined) data.isVerified = validatedData.isVerified

    const review = await prisma.review.update({
      where: { id },
      data,
    })

    return successResponse(review, 'Témoignage mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/reviews/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
