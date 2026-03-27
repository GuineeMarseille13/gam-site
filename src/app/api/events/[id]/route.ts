import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateEventSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    location: z.string().optional(),
    published: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/events/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        videos: { orderBy: { order: 'asc' } },
        eventSection: true,
      },
    })

    if (!event) {
      return notFoundResponse('Événement')
    }

    return successResponse(event)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/events/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateEventSchema.parse(body)

    const data: {
      title?: string
      description?: string | null
      startDate?: Date
      endDate?: Date
      location?: string | null
      published?: boolean
    } = {}

    if (validatedData.title !== undefined) data.title = validatedData.title
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.location !== undefined) data.location = validatedData.location
    if (validatedData.published !== undefined) data.published = validatedData.published
    if (validatedData.startDate !== undefined) data.startDate = new Date(validatedData.startDate)
    if (validatedData.endDate !== undefined) data.endDate = new Date(validatedData.endDate)

    const event = await prisma.event.update({
      where: { id },
      data,
      include: {
        images: { orderBy: { order: 'asc' } },
        videos: { orderBy: { order: 'asc' } },
        eventSection: true,
      },
    })

    return successResponse(event, 'Événement mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/events/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.event.delete({
      where: { id },
    })

    return successResponse(null, 'Événement supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
