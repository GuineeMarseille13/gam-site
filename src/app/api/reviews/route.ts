import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createReviewSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  body: z.string().min(1),
  img: z.string().url(),
  country: z.string().min(1),
  rating: z.enum(['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']).default('FIVE'),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

// GET /api/reviews - Liste tous les témoignages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'

    const where: any = {}
    if (published) where.isPublished = true
    if (featured) where.isFeatured = true

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(reviews)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/reviews - Créer un nouveau témoignage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    const review = await prisma.review.create({
      data: validatedData,
    })

    return successResponse(review, 'Témoignage créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

