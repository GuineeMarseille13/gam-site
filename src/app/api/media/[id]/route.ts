import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateMediaSchema = z.object({
  filename: z.string().min(1).optional(),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  url: z.string().url().optional(),
  size: z.number().int().positive().optional(),
  type: z.enum(['image', 'video', 'document', 'pdf']).optional(),
  alt: z.string().optional(),
  description: z.string().optional(),
})

// GET /api/media/[id] - Récupérer un média par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!media) {
      return notFoundResponse('Média')
    }

    return successResponse(media)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/media/[id] - Mettre à jour un média
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateMediaSchema.parse(body)

    const media = await prisma.media.update({
      where: { id },
      data: validatedData,
      include: {
        uploadedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return successResponse(media, 'Média mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/media/[id] - Supprimer un média
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.media.delete({
      where: { id },
    })

    return successResponse(null, 'Média supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

