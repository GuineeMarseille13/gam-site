import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Page, Section } from '@/lib/generated/prisma/enums'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createMediaSchema = z
  .object({
    filename: z.string().min(1).optional(),
    originalName: z.string().min(1).optional(),
    mimeType: z.string().min(1).optional(),
    url: z.string().url(),
    size: z.number().int().positive().optional(),
    type: z.enum(['image', 'video', 'document', 'pdf']).optional(),
    alt: z.string().optional(),
    description: z.string().optional(),
    uploadedByUserId: z.string().optional(),
    page: z.nativeEnum(Page).optional(),
    section: z.nativeEnum(Section).optional(),
  })
  .strict()

/**
 * GET /api/media — Liste les entrées `Image`.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined

    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.image.count()

    return successResponse({
      data: images,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/media — Crée une `Image` (page / section par défaut HOME + CAROUSEL).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createMediaSchema.parse(body)

    const image = await prisma.image.create({
      data: {
        url: validatedData.url,
        alt: validatedData.alt,
        title: validatedData.originalName ?? validatedData.filename,
        description: validatedData.description,
        size: validatedData.size,
        format: validatedData.mimeType,
        page: validatedData.page ?? Page.HOME,
        section: validatedData.section ?? Section.CAROUSEL,
      },
    })

    return successResponse(image, 'Média créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
