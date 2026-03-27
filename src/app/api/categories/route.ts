import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createCategorySchema = z
  .object({
    name: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug invalide').optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    type: z.enum(['product', 'event', 'partner']).optional(),
    parentId: z.string().optional(),
    isActive: z.boolean().default(true),
  })
  .strict()

/**
 * GET /api/categories — `ProductCategory` (titre + description).
 */
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { title: 'asc' },
    })

    return successResponse(categories)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/categories — `title` ← `name` du corps.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const category = await prisma.productCategory.create({
      data: {
        title: validatedData.name,
        description: validatedData.description,
      },
    })

    return successResponse(category, 'Catégorie créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
