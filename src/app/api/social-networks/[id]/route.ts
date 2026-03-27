import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateSocialNetworkSchema = z
  .object({
    platform: z
      .enum(['facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'youtube', 'snapchat'])
      .optional(),
    label: z.string().min(1).optional(),
    href: z.string().url().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/social-networks/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const network = await prisma.socialMedia.findUnique({
      where: { id },
    })

    if (!network) {
      return notFoundResponse('Réseau social')
    }

    return successResponse(network)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/social-networks/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateSocialNetworkSchema.parse(body)

    const data: { name?: string; url?: string; icon?: string; order?: number } = {}
    if (validatedData.href !== undefined) data.url = validatedData.href
    if (validatedData.icon !== undefined) data.icon = validatedData.icon
    if (validatedData.order !== undefined) data.order = validatedData.order
    if (validatedData.platform !== undefined || validatedData.label !== undefined) {
      const platform = validatedData.platform ?? ''
      const label = validatedData.label ?? ''
      if (platform || label) {
        data.name = [platform, label].filter(Boolean).join(' — ')
      }
    }

    const network = await prisma.socialMedia.update({
      where: { id },
      data,
    })

    return successResponse(network, 'Réseau social mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/social-networks/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.socialMedia.delete({
      where: { id },
    })

    return successResponse(null, 'Réseau social supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}
