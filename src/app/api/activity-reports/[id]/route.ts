import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateActivityReportSchema = z.object({
  year: z.number().int().optional(),
  title: z.string().min(1).optional(),
  pdfUrl: z.string().url().optional(),
  description: z.string().optional(),
  isPublished: z.boolean().optional(),
})

// GET /api/activity-reports/[id] - Récupérer un rapport d'activité par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const report = await prisma.activityReport.findUnique({
      where: { id },
    })

    if (!report) {
      return notFoundResponse('Rapport d\'activité')
    }

    return successResponse(report)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/activity-reports/[id] - Mettre à jour un rapport d'activité
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateActivityReportSchema.parse(body)

    const report = await prisma.activityReport.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(report, 'Rapport d\'activité mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/activity-reports/[id] - Supprimer un rapport d'activité
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.activityReport.delete({
      where: { id },
    })

    return successResponse(null, 'Rapport d\'activité supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

