"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import { updateBeneficiaryRequestStatusSchema } from "../_schemas/beneficiary-tracking.schema"

export type UpdateBeneficiaryRequestStatusResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/**
 * Met à jour le statut de la demande (et le commentaire associé).
 */
export async function updateBeneficiaryRequestStatus(
  raw: unknown,
): Promise<UpdateBeneficiaryRequestStatusResult> {
  let session
  try {
    session = await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = updateBeneficiaryRequestStatusSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Vérifiez les champs.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { id, requestStatus, statusComment } = parsed.data

  const existing = await prisma.beneficiary.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) {
    return { success: false, error: "Fiche introuvable." }
  }

  try {
    await prisma.beneficiary.update({
      where: { id },
      data: {
        requestStatus,
        statusComment: statusComment ?? null,
      },
    })
    revalidatePath("/administration/suivi-demande")
    revalidatePath(`/administration/suivi-demande/${id}`)
    revalidatePath("/administration/suivi-permanence")
    revalidatePath("/administration")
    return { success: true }
  } catch (err) {
    console.error("[updateBeneficiaryRequestStatus]", { id, err, userId: session.user.id })
    return { success: false, error: "Enregistrement impossible. Réessayez." }
  }
}
