import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  type: z.enum(['product', 'event', 'partner']).optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/categories/[id] - Récupérer une catégorie par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    })

    if (!category) {
      return notFoundResponse('Catégorie')
    }

    return successResponse(category)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/categories/[id] - Mettre à jour une catégorie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        parent: true,
        children: true,
      },
    })

    return successResponse(category, 'Catégorie mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/categories/[id] - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.category.delete({
      where: { id },
    })

    return successResponse(null, 'Catégorie supprimée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

