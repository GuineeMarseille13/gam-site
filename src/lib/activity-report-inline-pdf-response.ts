import { NextResponse } from "next/server"

import { parseCloudinaryDeliveryUrl } from "@/lib/cloudinary-replacement"
import {
  cloudinaryImageUploadBase,
  cloudinaryRawUploadUrl,
} from "@/lib/cloudinary-delivery"

function stripPdfExtensionFromPublicId(publicId: string): string {
  return publicId.replace(/\.pdf$/i, "")
}

/**
 * Construit une réponse HTTP PDF en **inline** pour iframe : tente plusieurs URLs
 * Cloudinary (`fl_inline`, suffixe `.pdf`, etc.) car la livraison `raw` peut varier.
 */
export async function getActivityReportInlinePdfNextResponse(
  pdfUrl: string,
  year: number,
): Promise<NextResponse> {
  const parsedDelivery = parseCloudinaryDeliveryUrl(pdfUrl)
  if (!parsedDelivery || parsedDelivery.resourceType !== "raw") {
    return NextResponse.json({ error: "Aperçu indisponible pour ce fichier." }, { status: 422 })
  }

  const publicId = stripPdfExtensionFromPublicId(parsedDelivery.publicId)
  if (!publicId.startsWith("gam/report-activities/")) {
    return NextResponse.json({ error: "Fichier non autorisé." }, { status: 403 })
  }

  const imageBase = cloudinaryImageUploadBase()
  const candidateUrls = [
    cloudinaryRawUploadUrl(publicId, { transform: "fl_inline", format: "pdf" }),
    cloudinaryRawUploadUrl(publicId, { format: "pdf" }),
    cloudinaryRawUploadUrl(publicId),
    `${imageBase}/${publicId}.pdf`,
    `${imageBase}/${publicId}`,
  ]

  let upstream: Response | null = null
  for (const candidate of candidateUrls) {
    const attempt = await fetch(candidate, { cache: "no-store" })
    if (attempt.ok) {
      upstream = attempt
      break
    }
  }

  if (!upstream) {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 })
  }

  const arrayBuffer = await upstream.arrayBuffer()
  const filename = `rapport-activite-${year}.pdf`

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
