import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { deleteSupersededCloudinaryUrl } from '@/lib/cloudinary-replacement'
import { z } from 'zod'

const updateActivityReportSchema = z
  .object({
    year: z.number().int().optional(),
    title: z.string().min(1).optional(),
    pdfUrl: z.string().url().optional(),
    description: z.string().optional(),
    isPublished: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/activity-reports/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const report = await prisma.reportActivity.findUnique({
      where: { id },
    })

    if (!report) {
      return notFoundResponse("Rapport d'activité")
    }

    return successResponse(report)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/activity-reports/[id] — Met à jour `label` si `title` est fourni.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateActivityReportSchema.parse(body)

    const previous = await prisma.reportActivity.findUnique({
      where: { id },
      select: { pdfUrl: true },
    })

    const data: {
      year?: number
      label?: string
      pdfUrl?: string
      isPublished?: boolean
    } = {}
    if (validatedData.year !== undefined) data.year = validatedData.year
    if (validatedData.title !== undefined) data.label = validatedData.title
    if (validatedData.pdfUrl !== undefined) data.pdfUrl = validatedData.pdfUrl
    if (validatedData.isPublished !== undefined) data.isPublished = validatedData.isPublished

    const report = await prisma.reportActivity.update({
      where: { id },
      data,
    })

    if (validatedData.pdfUrl !== undefined) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: previous?.pdfUrl,
        nextUrl: validatedData.pdfUrl,
      })
    }

    return successResponse(report, "Rapport d'activité mis à jour avec succès")
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/activity-reports/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const existing = await prisma.reportActivity.findUnique({
      where: { id },
      select: { pdfUrl: true },
    })

    await prisma.reportActivity.delete({
      where: { id },
    })

    await deleteSupersededCloudinaryUrl({
      previousUrl: existing?.pdfUrl,
      nextUrl: null,
    })

    return successResponse(null, "Rapport d'activité supprimé avec succès")
  } catch (error) {
    return handleApiError(error)
  }
}
