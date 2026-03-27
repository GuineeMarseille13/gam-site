import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateCategorySchema = z
  .object({
    name: z.string().min(1).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    type: z.enum(['product', 'event', 'partner']).optional(),
    parentId: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/categories/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const category = await prisma.productCategory.findUnique({
      where: { id },
    })

    if (!category) {
      return notFoundResponse('Catégorie')
    }

    return successResponse(category)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/categories/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const data: { title?: string; description?: string | null } = {}
    if (validatedData.name !== undefined) data.title = validatedData.name
    if (validatedData.description !== undefined) data.description = validatedData.description

    const category = await prisma.productCategory.update({
      where: { id },
      data,
    })

    return successResponse(category, 'Catégorie mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/categories/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.productCategory.delete({
      where: { id },
    })

    return successResponse(null, 'Catégorie supprimée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
