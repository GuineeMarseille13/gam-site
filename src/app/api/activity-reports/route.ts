import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const createActivityReportSchema = z.object({
  year: z.number().int(),
  title: z.string().min(1),
  pdfUrl: z.string().url(),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
})

// GET /api/activity-reports - Liste tous les rapports d'activité
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published') === 'true'

    const where: any = {}
    if (published) where.isPublished = true

    const reports = await prisma.activityReport.findMany({
      where,
      orderBy: { year: 'desc' },
    })

    return successResponse(reports)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/activity-reports - Créer un nouveau rapport d'activité
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createActivityReportSchema.parse(body)

    const report = await prisma.activityReport.create({
      data: validatedData,
    })

    return successResponse(report, 'Rapport d\'activité créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

