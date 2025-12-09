import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const createMediaSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  description: z.string().optional(),
  order: z.number().int().default(0),
})

// GET /api/events/[id]/media - Liste les médias d'un événement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const media = await prisma.eventMedia.findMany({
      where: { eventId: id },
      orderBy: { order: 'asc' },
    })

    return successResponse(media)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/events/[id]/media - Ajouter un média à un événement
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const media = await prisma.eventMedia.create({
      data: {
        ...validatedData,
        eventId: id,
      },
    })

    return successResponse(media, 'Média ajouté avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

