"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  createBeneficiaryDemandTypeSchema,
  deleteBeneficiaryDemandTypeSchema,
  updateBeneficiaryDemandTypeSchema,
} from "../_schemas/beneficiary-demand-type.schema"

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/**
 * Crée un type de demande (libellé, ordre, précision obligatoire).
 */
export async function createBeneficiaryDemandTypeAction(raw: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = createBeneficiaryDemandTypeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { label, sortOrder, requiresDetail, isActive } = parsed.data

  const maxRow = await prisma.beneficiaryDemandType.aggregate({
    _max: { sortOrder: true },
  })
  const nextOrder = (maxRow._max.sortOrder ?? -1) + 1

  try {
    const created = await prisma.beneficiaryDemandType.create({
      data: {
        label,
        sortOrder: sortOrder ?? nextOrder,
        requiresDetail: requiresDetail ?? false,
        isActive: isActive ?? true,
      },
      select: { id: true },
    })
    revalidatePath("/administration/suivi-permanence")
    revalidatePath("/administration/suivi-permanence/types-de-demande")
    return { success: true, data: { id: created.id } }
  } catch (err) {
    console.error("[createBeneficiaryDemandTypeAction]", err)
    return { success: false, error: "Création impossible." }
  }
}

/**
 * Met à jour un type de demande.
 */
export async function updateBeneficiaryDemandTypeAction(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = updateBeneficiaryDemandTypeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const d = parsed.data

  try {
    await prisma.beneficiaryDemandType.update({
      where: { id: d.id },
      data: {
        label: d.label,
        sortOrder: d.sortOrder,
        requiresDetail: d.requiresDetail,
        isActive: d.isActive,
      },
    })
    revalidatePath("/administration/suivi-permanence")
    revalidatePath("/administration/suivi-permanence/types-de-demande")
    return { success: true }
  } catch (err) {
    console.error("[updateBeneficiaryDemandTypeAction]", err)
    return { success: false, error: "Mise à jour impossible." }
  }
}

/**
 * Supprime un type seulement s’il n’est référencé par aucune fiche.
 */
export async function deleteBeneficiaryDemandTypeAction(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = deleteBeneficiaryDemandTypeSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: "Identifiant invalide." }
  }

  const count = await prisma.beneficiary.count({
    where: { demandTypes: { some: { id: parsed.data.id } } },
  })
  if (count > 0) {
    return {
      success: false,
      error: `Ce type est utilisé par ${count} fiche(s). Désactivez-le plutôt que le supprimer.`,
    }
  }

  try {
    await prisma.beneficiaryDemandType.delete({ where: { id: parsed.data.id } })
    revalidatePath("/administration/suivi-permanence")
    revalidatePath("/administration/suivi-permanence/types-de-demande")
    return { success: true }
  } catch (err) {
    console.error("[deleteBeneficiaryDemandTypeAction]", err)
    return { success: false, error: "Suppression impossible." }
  }
}
