import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const createMediaSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  url: z.string().url(),
  size: z.number().int().positive(),
  type: z.enum(['image', 'video', 'document', 'pdf']),
  alt: z.string().optional(),
  description: z.string().optional(),
  uploadedByUserId: z.string().optional(),
})

// GET /api/media - Liste tous les médias
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const where: any = {}
    if (type) where.type = type

    const media = await prisma.media.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.media.count({ where })

    return successResponse({
      data: media,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/media - Créer un nouveau média
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createMediaSchema.parse(body)

    const media = await prisma.media.create({
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

    return successResponse(media, 'Média créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

