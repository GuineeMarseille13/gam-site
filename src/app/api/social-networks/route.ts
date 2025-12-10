import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createSocialNetworkSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'youtube', 'snapchat']),
  label: z.string().min(1),
  href: z.string().url(),
  color: z.string(),
  icon: z.string(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/social-networks - Liste tous les réseaux sociaux
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true

    const networks = await prisma.socialNetwork.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return successResponse(networks)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/social-networks - Créer un nouveau réseau social
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSocialNetworkSchema.parse(body)

    const network = await prisma.socialNetwork.create({
      data: validatedData,
    })

    return successResponse(network, 'Réseau social créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

