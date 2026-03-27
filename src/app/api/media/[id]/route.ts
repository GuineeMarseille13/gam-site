import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateMediaSchema = z
  .object({
    filename: z.string().min(1).optional(),
    originalName: z.string().optional(),
    mimeType: z.string().optional(),
    url: z.string().url().optional(),
    size: z.number().int().positive().optional(),
    type: z.enum(['image', 'video', 'document', 'pdf']).optional(),
    alt: z.string().optional(),
    description: z.string().optional(),
  })
  .strict()

/**
 * GET /api/media/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      return notFoundResponse('Média')
    }

    return successResponse(image)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/media/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateMediaSchema.parse(body)

    const data: {
      url?: string
      alt?: string | null
      title?: string | null
      description?: string | null
      size?: number | null
      format?: string | null
    } = {}
    if (validatedData.url !== undefined) data.url = validatedData.url
    if (validatedData.alt !== undefined) data.alt = validatedData.alt
    if (validatedData.originalName !== undefined) data.title = validatedData.originalName
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.size !== undefined) data.size = validatedData.size
    if (validatedData.mimeType !== undefined) data.format = validatedData.mimeType

    const image = await prisma.image.update({
      where: { id },
      data,
    })

    return successResponse(image, 'Média mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/media/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.image.delete({
      where: { id },
    })

    return successResponse(null, 'Média supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
