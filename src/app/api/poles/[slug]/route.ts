import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { findPoleBySlugOrId } from '@/lib/api/pole-by-slug'
import { z } from 'zod'

const updatePoleSchema = z
  .object({
    title: z.string().min(1).optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    features: z.array(z.string()).optional(),
    contactInfo: z
      .object({
        email: z.string().email().optional(),
        phone: z.string().optional(),
        schedule: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),
    permanenceDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    statistics: z
      .object({
        title: z.string().optional(),
        items: z.array(
          z.object({
            value: z.number(),
            label: z.string(),
            description: z.string().optional(),
          }),
        ),
      })
      .optional(),
    colorScheme: z
      .object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
      })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/poles/[slug]
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

    const detailsPole = await prisma.detailsPole.findUnique({
      where: { id: pole.detailsPoleId },
    })
    const eventImages = await prisma.image.findMany({
      where: { poleId: pole.id },
      orderBy: { order: 'asc' },
    })

    const services = detailsPole
      ? [
          {
            id: detailsPole.id,
            title: detailsPole.title,
            description: detailsPole.description ?? '',
            icon: detailsPole.reason ?? '',
            order: 0,
          },
        ]
      : []

    return successResponse({
      ...pole,
      slug: pole.id,
      title: detailsPole?.title ?? pole.name,
      shortDescription: detailsPole?.description ?? pole.description,
      description: detailsPole?.description ?? pole.description,
      services,
      eventImages,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/poles/[slug]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const validatedData = updatePoleSchema.parse(body)

    const pole = await findPoleBySlugOrId(slug)

    if (!pole) {
      return notFoundResponse('Pôle')
    }

    const poleData: { name?: string; description?: string | null; imageId?: string | null } = {}
    if (validatedData.title !== undefined) poleData.name = validatedData.title
    if (validatedData.shortDescription !== undefined) poleData.description = validatedData.shortDescription
    if (validatedData.image !== undefined) poleData.imageId = validatedData.image

    await prisma.pole.update({
      where: { id: pole.id },
      data: poleData,
    })

    if (pole.detailsPoleId) {
      const detailsData: { title?: string; description?: string | null } = {}
      if (validatedData.title !== undefined) detailsData.title = validatedData.title
      if (validatedData.description !== undefined) detailsData.description = validatedData.description
      if (validatedData.shortDescription !== undefined && validatedData.description === undefined) {
        detailsData.description = validatedData.shortDescription
      }

      if (Object.keys(detailsData).length > 0) {
        await prisma.detailsPole.update({
          where: { id: pole.detailsPoleId },
          data: detailsData,
        })
      }
    }

    const updated = await findPoleBySlugOrId(pole.id)
    if (!updated) {
      return notFoundResponse('Pôle')
    }

    const detailsPole = await prisma.detailsPole.findUnique({
      where: { id: updated.detailsPoleId },
    })
    const imgs = await prisma.image.findMany({
      where: { poleId: updated.id },
      orderBy: { order: 'asc' },
    })

    const services = detailsPole
      ? [
          {
            id: detailsPole.id,
            title: detailsPole.title,
            description: detailsPole.description ?? '',
            icon: detailsPole.reason ?? '',
            order: 0,
          },
        ]
      : []

    return successResponse(
      {
        ...updated,
        slug: updated.id,
        title: detailsPole?.title ?? updated.name,
        shortDescription: detailsPole?.description ?? updated.description,
        description: detailsPole?.description ?? updated.description,
        services,
        eventImages: imgs,
      },
      'Pôle mis à jour avec succès',
    )
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/poles/[slug]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const pole = await findPoleBySlugOrId(slug)

    if (!pole) {
      return notFoundResponse('Pôle')
    }

    await prisma.pole.delete({
      where: { id: pole.id },
    })

    return successResponse(null, 'Pôle supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
