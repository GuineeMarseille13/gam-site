"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireBureau } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { uploadPdf } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import { activityReportsUploadMetadataSchema } from "../_schemas/upload-activity-reports.schema"
import { setActivityReportPublishedSchema } from "../_schemas/set-activity-report-published.schema"

const MAX_PDF_BYTES = 15 * 1024 * 1024

export type ActivityReportActionResult =
  | { success: true; message: string }
  | { success: false; error: string }

function isPdfFile(file: File): boolean {
  if (file.type === "application/pdf") return true
  return file.name.toLowerCase().endsWith(".pdf")
}

/**
 * Enregistre un ou plusieurs rapports d'activité (upload Cloudinary + upsert par année).
 */
export async function saveActivityReportsBatchAction(
  formData: FormData,
): Promise<ActivityReportActionResult> {
  try {
    await requireBureau()
  } catch {
    return { success: false, error: "Accès non autorisé." }
  }

  const rawMeta = formData.get("metadata")
  if (typeof rawMeta !== "string") {
    return { success: false, error: "Données du formulaire invalides (métadonnées)." }
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(rawMeta) as unknown
  } catch {
    return { success: false, error: "Format JSON des métadonnées invalide." }
  }

  const metaResult = activityReportsUploadMetadataSchema.safeParse(parsedJson)
  if (!metaResult.success) {
    const first = metaResult.error.flatten().formErrors[0]
    return { success: false, error: first ?? "Métadonnées invalides." }
  }

  const meta = metaResult.data
  const files = formData.getAll("files") as File[]

  if (files.length !== meta.length) {
    return {
      success: false,
      error: "Le nombre de fichiers ne correspond pas au nombre d'années indiquées.",
    }
  }

  for (const file of files) {
    if (!(file instanceof File)) {
      return { success: false, error: "Fichier invalide." }
    }
    if (file.size === 0) {
      return { success: false, error: "Un fichier PDF est vide." }
    }
    if (file.size > MAX_PDF_BYTES) {
      return { success: false, error: "Chaque PDF doit faire au plus 15 Mo." }
    }
    if (!isPdfFile(file)) {
      return { success: false, error: "Seuls les fichiers PDF sont acceptés." }
    }
  }

  const uploaded: { year: number; label: string | null; pdfUrl: string }[] = []

  for (let i = 0; i < meta.length; i++) {
    const row = meta[i]
    const file = files[i]
    const uploadResult = await uploadPdf(file, `gam/report-activities/${row.year}`)
    uploaded.push({ year: row.year, label: row.label, pdfUrl: uploadResult.url })
  }

  await prisma.$transaction(async (tx) => {
    for (const item of uploaded) {
      const existing = await tx.reportActivity.findFirst({
        where: { year: item.year },
      })
      if (existing) {
        await tx.reportActivity.update({
          where: { id: existing.id },
          data: { pdfUrl: item.pdfUrl, label: item.label },
        })
      } else {
        await tx.reportActivity.create({
          data: {
            year: item.year,
            pdfUrl: item.pdfUrl,
            label: item.label,
          },
        })
      }
    }
  })

  revalidatePath("/notre-association")
  revalidatePath("/bureau/rapports-activite")

  const count = uploaded.length
  const message =
    count === 1
      ? "Le rapport d'activité a été enregistré."
      : `${count} rapports d'activité ont été enregistrés.`

  return { success: true, message }
}

const deleteIdSchema = z.object({ id: z.string().min(1) }).strict()

/**
 * Supprime un rapport d'activité en base puis retire le fichier sur Cloudinary si l’URL est reconnue (même logique que DELETE /api/activity-reports/[id]).
 */
export async function deleteActivityReportAction(rawId: unknown): Promise<ActivityReportActionResult> {
  try {
    await requireBureau()
  } catch {
    return { success: false, error: "Accès non autorisé." }
  }

  const idResult = deleteIdSchema.safeParse({ id: rawId })
  if (!idResult.success) {
    return { success: false, error: "Identifiant invalide." }
  }

  const id = idResult.data.id

  const existing = await prisma.reportActivity.findUnique({
    where: { id },
    select: { pdfUrl: true },
  })

  if (!existing) {
    return { success: false, error: "Rapport introuvable ou déjà supprimé." }
  }

  try {
    await prisma.reportActivity.delete({
      where: { id },
    })
  } catch {
    return { success: false, error: "Rapport introuvable ou déjà supprimé." }
  }

  await deleteSupersededCloudinaryUrl({
    previousUrl: existing.pdfUrl,
    nextUrl: null,
  })

  revalidatePath("/notre-association")
  revalidatePath("/bureau/rapports-activite")

  return { success: true, message: "Rapport supprimé." }
}

/**
 * Active ou désactive l’affichage d’un rapport sur la page publique « Notre association ».
 */
export async function setActivityReportPublishedAction(
  rawInput: unknown,
): Promise<ActivityReportActionResult> {
  try {
    await requireBureau()
  } catch {
    return { success: false, error: "Accès non autorisé." }
  }

  const parsed = setActivityReportPublishedSchema.safeParse(rawInput)
  if (!parsed.success) {
    const first = parsed.error.flatten().formErrors[0]
    return { success: false, error: first ?? "Données invalides." }
  }

  const { id, isPublished } = parsed.data

  const existing = await prisma.reportActivity.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Rapport introuvable." }
  }

  await prisma.reportActivity.update({
    where: { id },
    data: { isPublished },
  })

  revalidatePath("/notre-association")
  revalidatePath("/bureau/rapports-activite")

  return {
    success: true,
    message: isPublished ? "Le rapport est visible sur le site." : "Le rapport est masqué sur le site.",
  }
}
