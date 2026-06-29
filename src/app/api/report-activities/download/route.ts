import { NextResponse } from "next/server"
import { z } from "zod"

import { getActivityReportPdfNextResponse } from "@/lib/activity-report-inline-pdf-response"
import { prisma } from "@/lib/prisma"

const querySchema = z
  .object({
    reportId: z.string().min(1, "Identifiant de rapport invalide."),
  })
  .strict()

/**
 * GET /api/report-activities/download?reportId=…
 *
 * Téléchargement PDF pour les rapports **publiés** uniquement (site public).
 */
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url)
  const parsed = querySchema.safeParse({
    reportId: url.searchParams.get("reportId") ?? "",
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètre invalide." }, { status: 400 })
  }

  const report = await prisma.reportActivity.findFirst({
    where: { id: parsed.data.reportId, isPublished: true },
    select: { pdfUrl: true, year: true },
  })

  if (!report) {
    return NextResponse.json({ error: "Rapport introuvable." }, { status: 404 })
  }

  return getActivityReportPdfNextResponse(report.pdfUrl, report.year, "attachment")
}
