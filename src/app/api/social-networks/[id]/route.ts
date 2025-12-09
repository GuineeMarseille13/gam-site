import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateSocialNetworkSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'youtube', 'snapchat']).optional(),
  label: z.string().min(1).optional(),
  href: z.string().url().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/social-networks/[id] - Récupérer un réseau social par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const network = await prisma.socialNetwork.findUnique({
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

// PUT /api/social-networks/[id] - Mettre à jour un réseau social
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateSocialNetworkSchema.parse(body)

    const network = await prisma.socialNetwork.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(network, 'Réseau social mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/social-networks/[id] - Supprimer un réseau social
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.socialNetwork.delete({
      where: { id },
    })

    return successResponse(null, 'Réseau social supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

