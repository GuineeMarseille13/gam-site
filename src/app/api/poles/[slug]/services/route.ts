import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { ApiError, handleApiError } from '@/lib/api/errors'
import { findPoleBySlugOrId } from '@/lib/api/pole-by-slug'
import { z } from 'zod'

const createServiceSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string(),
    order: z.number().int().default(0),
  })
  .strict()

/**
 * GET /api/poles/[slug]/services — Détails du pôle (`DetailsPole`) exposés comme liste.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const pole = await findPoleBySlugOrId(slug)

    if (!pole) {
      return notFoundResponse('Pôle')
    }

    const details = await prisma.detailsPole.findUnique({
      where: { id: pole.detailsPoleId },
    })

    const services = details
      ? [
          {
            id: details.id,
            title: details.title,
            description: details.description ?? '',
            icon: details.reason ?? '',
            order: 0,
          },
        ]
      : []

    return successResponse(services)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/poles/[slug]/services — Met à jour `DetailsPole` (un bloc par pôle).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const validatedData = createServiceSchema.parse(body)

    const pole = await findPoleBySlugOrId(slug)

    if (!pole) {
      return notFoundResponse('Pôle')
    }

    if (!pole.detailsPoleId) {
      throw new ApiError('Détails pôle manquants', 400)
    }

    const service = await prisma.detailsPole.update({
      where: { id: pole.detailsPoleId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        reason: validatedData.icon,
      },
    })

    return successResponse(service, 'Service ajouté avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
