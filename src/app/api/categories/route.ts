import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  type: z.enum(['product', 'event', 'partner']),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
})

// GET /api/categories - Liste toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true
    if (type) where.type = type

    const categories = await prisma.category.findMany({
      where,
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: 'asc' },
    })

    return successResponse(categories)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const category = await prisma.category.create({
      data: validatedData,
      include: {
        parent: true,
        children: true,
      },
    })

    return successResponse(category, 'Catégorie créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

