import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const createCarouselItemSchema = z.object({
  image: z.string().url(),
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().url().optional(),
  linkText: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/carousel - Liste tous les éléments du carrousel
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true

    const items = await prisma.carouselItem.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return successResponse(items)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/carousel - Créer un nouvel élément de carrousel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCarouselItemSchema.parse(body)

    const item = await prisma.carouselItem.create({
      data: validatedData,
    })

    return successResponse(item, 'Élément de carrousel créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

