import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createActivityReportSchema = z
  .object({
    year: z.number().int(),
    title: z.string().min(1),
    pdfUrl: z.string().url(),
    isPublished: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/activity-reports — Liste les rapports (modèle Prisma `ReportActivity`).
 */
export async function GET() {
  try {
    const reports = await prisma.reportActivity.findMany({
      orderBy: { year: 'desc' },
    })

    return successResponse(reports)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/activity-reports — Crée un rapport (`label` ← titre API).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createActivityReportSchema.parse(body)

    const report = await prisma.reportActivity.create({
      data: {
        year: validatedData.year,
        label: validatedData.title,
        pdfUrl: validatedData.pdfUrl,
        ...(validatedData.isPublished !== undefined ? { isPublished: validatedData.isPublished } : {}),
      },
    })

    return successResponse(report, "Rapport d'activité créé avec succès", 201)
  } catch (error) {
    return handleApiError(error)
  }
}
