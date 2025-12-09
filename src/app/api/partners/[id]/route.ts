import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updatePartnerSchema = z.object({
  name: z.string().min(1).optional(),
  logo: z.string().url().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/partners/[id] - Récupérer un partenaire par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        categoryRef: true,
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

// PUT /api/partners/[id] - Mettre à jour un partenaire
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updatePartnerSchema.parse(body)

    const partner = await prisma.partner.update({
      where: { id },
      data: validatedData,
      include: {
        categoryRef: true,
      },
    })

    return successResponse(partner, 'Partenaire mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/partners/[id] - Supprimer un partenaire
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

