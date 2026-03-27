import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createMediaSchema = z
  .object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
    description: z.string().optional(),
    order: z.number().int().default(0),
  })
  .strict()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!event) {
      return notFoundResponse('Événement')
    }

    const [images, videos] = await Promise.all([
      prisma.eventImage.findMany({
        where: { eventId: id },
        orderBy: { order: 'asc' },
      }),
      prisma.eventVideo.findMany({
        where: { eventId: id },
        orderBy: { order: 'asc' },
      }),
    ])

    const merged = [
      ...images.map((row) => ({ ...row, mediaType: 'image' as const })),
      ...videos.map((row) => ({ ...row, mediaType: 'video' as const })),
    ].sort((a, b) => a.order - b.order)

    return successResponse(merged)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = createMediaSchema.parse(body)

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!event) {
      return notFoundResponse('Événement')
    }

    if (validatedData.type === 'image') {
      const row = await prisma.eventImage.create({
        data: {
          eventId: id,
          imageId: validatedData.url,
          order: validatedData.order,
        },
      })
      return successResponse({ ...row, mediaType: 'image' as const }, 'Média ajouté avec succès', 201)
    }

    const row = await prisma.eventVideo.create({
      data: {
        eventId: id,
        url: validatedData.url,
        order: validatedData.order,
      },
    })
    return successResponse({ ...row, mediaType: 'video' as const }, 'Média ajouté avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
