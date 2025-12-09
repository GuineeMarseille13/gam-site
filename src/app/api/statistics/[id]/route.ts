import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateStatisticSchema = z.object({
  label: z.string().min(1).optional(),
  value: z.number().int().optional(),
  color: z.enum(['red', 'yellow', 'green', 'blue']).optional(),
  icon: z.string().optional(),
  suffix: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/statistics/[id] - Récupérer une statistique par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const statistic = await prisma.statistic.findUnique({
      where: { id },
    })

    if (!statistic) {
      return notFoundResponse('Statistique')
    }

    return successResponse(statistic)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/statistics/[id] - Mettre à jour une statistique
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateStatisticSchema.parse(body)

    const statistic = await prisma.statistic.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(statistic, 'Statistique mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/statistics/[id] - Supprimer une statistique
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.statistic.delete({
      where: { id },
    })

    return successResponse(null, 'Statistique supprimée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

