import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createSocialNetworkSchema = z
  .object({
    platform: z.enum([
      'facebook',
      'instagram',
      'tiktok',
      'linkedin',
      'twitter',
      'youtube',
      'snapchat',
    ]),
    label: z.string().min(1),
    href: z.string().url(),
    color: z.string(),
    icon: z.string(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
  })
  .strict()

/**
 * GET /api/social-networks — Modèle Prisma `SocialMedia` (pas de champ `isActive`).
 */
export async function GET() {
  try {
    const networks = await prisma.socialMedia.findMany({
      orderBy: { order: 'asc' },
    })

    return successResponse(networks)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/social-networks — `name` = plateforme + libellé, `url` = href.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSocialNetworkSchema.parse(body)

    const network = await prisma.socialMedia.create({
      data: {
        name: `${validatedData.platform} — ${validatedData.label}`,
        url: validatedData.href,
        icon: validatedData.icon,
        order: validatedData.order,
      },
    })

    return successResponse(network, 'Réseau social créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
