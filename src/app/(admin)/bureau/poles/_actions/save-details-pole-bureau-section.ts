"use server"

import { revalidatePath } from "next/cache"

import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { requireBureau } from "@/lib/auth-guard"
import { findPoleBySlugOrId } from "@/lib/api/pole-by-slug"
import { saveDetailsPoleBureauSectionFormSchema } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"
import type { BureauPoleDetailsSection } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

export type SaveDetailsPoleBureauSectionState =
  | { error: string }
  | { success: true }
  | null

const sectionToPrismaField: Record<
  BureauPoleDetailsSection,
  | "aboutSectionText"
  | "achievementsSectionText"
> = {
  about: "aboutSectionText",
  achievements: "achievementsSectionText",
}

/**
 * Enregistre un bloc de contenu bureau sur `DetailsPole` (lié au pôle via `public_slug` / résolution slug).
 */
export async function saveDetailsPoleBureauSectionAction(
  _prev: SaveDetailsPoleBureauSectionState,
  formData: FormData,
): Promise<SaveDetailsPoleBureauSectionState> {
  try {
    await requireBureau()
  } catch {
    return { error: "Accès non autorisé." }
  }

  const rawSlug = (formData.get("poleSlug") as string) ?? ""
  const rawSection = (formData.get("section") as string) ?? ""
  const rawText = (formData.get("sectionText") as string) ?? ""

  const parsed = saveDetailsPoleBureauSectionFormSchema.safeParse({
    poleSlug: rawSlug,
    section: rawSection,
    sectionText: rawText,
  })

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors
    const msg =
      flat.poleSlug?.[0] ??
      flat.section?.[0] ??
      flat.sectionText?.[0] ??
      "Données invalides."
    return { error: msg }
  }

  const { poleSlug, section, sectionText } = parsed.data

  try {
    const pole = await findPoleBySlugOrId(poleSlug)
    if (!pole?.detailsPoleId) {
      return {
        error:
          "Pôle introuvable en base ou sans fiche détail. Vérifiez le slug public (`public_slug`) du pôle.",
      }
    }

    const field = sectionToPrismaField[section]

    await prisma.detailsPole.update({
      where: { id: pole.detailsPoleId },
      data: { [field]: sectionText },
    })

    revalidatePath(`/poles/${poleSlug}`)
    revalidatePath(`/bureau/poles/${poleSlug}/titre`)
    revalidatePath(`/bureau/poles/${poleSlug}/nos-services`)
    revalidatePath(`/bureau/poles/${poleSlug}/statistiques`)
    revalidatePath(`/bureau/poles/${poleSlug}/nos-realisations`)
    return { success: true }
  } catch (err) {
    console.error("[saveDetailsPoleBureauSectionAction]", err)
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2022"
    ) {
      return {
        error:
          "La base de données n’est pas à jour. Appliquez la migration Prisma puis réessayez.",
      }
    }
    return { error: "Enregistrement impossible. Réessayez." }
  }
}
