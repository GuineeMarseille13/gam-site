import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { isAdministrationDashboardRole } from "@/helpers/dashboard-roles"
import {
  cloudinaryImageUploadBase,
  cloudinaryRawUploadUrl,
} from "@/lib/cloudinary-delivery"

const querySchema = z
  .object({
    publicId: z
      .string()
      .min(1)
      .refine((value) => value.startsWith("gam/campuce-france/"), {
        message: "publicId invalide.",
      }),
  })
  .strict()

/**
 * Proxy serveur pour afficher/télécharger les PDFs Campus France.
 *
 * Pourquoi: Cloudinary peut bloquer l’embed (X-Frame-Options/CSP) et/ou forcer
 * `Content-Disposition: attachment` sur les assets `resource_type: raw`.
 * En streamant depuis notre domaine, l’iframe peut afficher le contenu.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isAdministrationDashboardRole(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const url = new URL(request.url)
  const parsed = querySchema.safeParse({
    publicId: url.searchParams.get("publicId"),
  })
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides." },
      { status: 400 },
    )
  }

  const publicId = parsed.data.publicId
  const imageBase = cloudinaryImageUploadBase()

  const candidateUrls = [
    cloudinaryRawUploadUrl(publicId, { transform: "fl_inline", format: "pdf" }),
    cloudinaryRawUploadUrl(publicId, { format: "pdf" }),
    cloudinaryRawUploadUrl(publicId),
    `${imageBase}/${publicId}.pdf`,
    `${imageBase}/${publicId}`,
  ]

  let finalResponse: Response | null = null
  for (const urlCandidate of candidateUrls) {
    const attempt = await fetch(urlCandidate, { cache: "no-store" })
    if (attempt.ok) {
      finalResponse = attempt
      break
    }
  }

  if (!finalResponse) {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 })
  }

  const arrayBuffer = await finalResponse.arrayBuffer()
  const filenameTail = parsed.data.publicId.split("/").pop() ?? "piece"
  const filename = `${filenameTail}.pdf`

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  })
}

