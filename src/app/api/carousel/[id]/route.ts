import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateCarouselItemSchema = z.object({
  image: z.string().url().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  link: z.string().url().optional(),
  linkText: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/carousel/[id] - Récupérer un élément de carrousel par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.carouselItem.findUnique({
      where: { id },
    })

    if (!item) {
      return notFoundResponse('Élément de carrousel')
    }

    return successResponse(item)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/carousel/[id] - Mettre à jour un élément de carrousel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateCarouselItemSchema.parse(body)

    const item = await prisma.carouselItem.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(item, 'Élément de carrousel mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/carousel/[id] - Supprimer un élément de carrousel
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.carouselItem.delete({
      where: { id },
    })

    return successResponse(null, 'Élément de carrousel supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

