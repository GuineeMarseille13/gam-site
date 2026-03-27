import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updatePartnerSchema = z
  .object({
    name: z.string().min(1).optional(),
    logo: z.string().url().optional(),
    description: z.string().optional(),
    website: z.string().url().optional(),
    partnerSectionId: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/partners/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        partnerSection: true,
      },
    })

    if (!partner) {
      return notFoundResponse('Partenaire')
    }

    return successResponse(partner)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/partners/[id] — `logo` -> `imageId`, `website` -> `url`, `isActive` -> `published`.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updatePartnerSchema.parse(body)

    const data: {
      name?: string
      imageId?: string | null
      description?: string | null
      url?: string | null
      published?: boolean
      partnerSectionId?: string | null
    } = {}

    if (validatedData.name !== undefined) data.name = validatedData.name
    if (validatedData.logo !== undefined) data.imageId = validatedData.logo
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.website !== undefined) data.url = validatedData.website
    if (validatedData.isActive !== undefined) data.published = validatedData.isActive
    if (validatedData.partnerSectionId !== undefined) data.partnerSectionId = validatedData.partnerSectionId

    const partner = await prisma.partner.update({
      where: { id },
      data,
      include: {
        partnerSection: true,
      },
    })

    return successResponse(partner, 'Partenaire mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/partners/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.partner.delete({
      where: { id },
    })

    return successResponse(null, 'Partenaire supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
