import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { sessionCanAccessBureauContenu } from "@/helpers/api-dashboard-auth"
import { getActivityReportInlinePdfNextResponse } from "@/lib/activity-report-inline-pdf-response"
import { prisma } from "@/lib/prisma"

const querySchema = z
  .object({
    reportId: z.string().min(1, "Identifiant de rapport invalide."),
  })
  .strict()

async function requireBureauApiAccess(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  return !!session && sessionCanAccessBureauContenu(session.user.role)
}

/**
 * GET /api/bureau/rapports-activite/preview?reportId=…
 *
 * Sert le PDF en **inline** pour l’iframe d’aperçu : Cloudinary `raw` peut renvoyer
 * `Content-Disposition: attachment` sur l’URL directe, ce qui force le téléchargement.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const hasAccess = await requireBureauApiAccess()
  if (!hasAccess) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const url = new URL(request.url)
  const parsed = querySchema.safeParse({
    reportId: url.searchParams.get("reportId") ?? "",
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètre invalide." }, { status: 400 })
  }

  const report = await prisma.reportActivity.findUnique({
    where: { id: parsed.data.reportId },
    select: { pdfUrl: true, year: true },
  })

  if (!report) {
    return NextResponse.json({ error: "Rapport introuvable." }, { status: 404 })
  }

  return getActivityReportInlinePdfNextResponse(report.pdfUrl, report.year)
}
