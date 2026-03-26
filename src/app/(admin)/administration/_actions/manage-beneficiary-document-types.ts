"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  createBeneficiaryDocumentTypeSchema,
  deleteBeneficiaryDocumentTypeSchema,
  updateBeneficiaryDocumentTypeSchema,
} from "../_schemas/beneficiary-document-type.schema"
import { countBeneficiariesWithDocumentCode } from "../_services/count-beneficiaries-with-document-code"
import { generateBeneficiaryDocumentTypeCode } from "../_services/generate-beneficiary-document-type-code"

const CONFIG_PATH = "/administration/demande-beneficiaire/configuration"

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/**
 * Crée un type de document (code technique dérivé du libellé).
 */
export async function createBeneficiaryDocumentTypeAction(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = createBeneficiaryDocumentTypeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { label, sortOrder, requiresOtherDetail, isActive } = parsed.data

  const maxRow = await prisma.beneficiaryDocumentType.aggregate({
    _max: { sortOrder: true },
  })
  const nextOrder = (maxRow._max.sortOrder ?? -1) + 1

  try {
    const code = await generateBeneficiaryDocumentTypeCode(label)
    const created = await prisma.beneficiaryDocumentType.create({
      data: {
        code,
        label,
        sortOrder: sortOrder ?? nextOrder,
        requiresOtherDetail: requiresOtherDetail ?? false,
        isActive: isActive ?? true,
      },
      select: { id: true },
    })
    revalidatePath("/administration/demande-beneficiaire")
    revalidatePath(CONFIG_PATH)
    revalidatePath("/administration/suivi-demande")
    return { success: true, data: { id: created.id } }
  } catch (err) {
    console.error("[createBeneficiaryDocumentTypeAction]", err)
    return { success: false, error: "Création impossible." }
  }
}

/**
 * Met à jour un type de document (le code technique ne change pas).
 */
export async function updateBeneficiaryDocumentTypeAction(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = updateBeneficiaryDocumentTypeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const d = parsed.data

  try {
    await prisma.beneficiaryDocumentType.update({
      where: { id: d.id },
      data: {
        label: d.label,
        sortOrder: d.sortOrder,
        requiresOtherDetail: d.requiresOtherDetail,
        isActive: d.isActive,
      },
    })
    revalidatePath("/administration/demande-beneficiaire")
    revalidatePath(CONFIG_PATH)
    revalidatePath("/administration/suivi-demande")
    return { success: true }
  } catch (err) {
    console.error("[updateBeneficiaryDocumentTypeAction]", err)
    return { success: false, error: "Mise à jour impossible." }
  }
}

/**
 * Supprime un type sans fiche liée (le code `OTHER` est protégé).
 */
export async function deleteBeneficiaryDocumentTypeAction(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = deleteBeneficiaryDocumentTypeSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: "Identifiant invalide." }
  }

  const row = await prisma.beneficiaryDocumentType.findUnique({
    where: { id: parsed.data.id },
    select: { code: true },
  })
  if (!row) {
    return { success: false, error: "Type introuvable." }
  }
  if (row.code === "OTHER") {
    return {
      success: false,
      error: "Le type « Autre » ne peut pas être supprimé.",
    }
  }

  const count = await countBeneficiariesWithDocumentCode(row.code)
  if (count > 0) {
    return {
      success: false,
      error: `Ce document est coché sur ${count} fiche(s). Désactivez-le plutôt que le supprimer.`,
    }
  }

  try {
    await prisma.beneficiaryDocumentType.delete({ where: { id: parsed.data.id } })
    revalidatePath("/administration/demande-beneficiaire")
    revalidatePath(CONFIG_PATH)
    revalidatePath("/administration/suivi-demande")
    return { success: true }
  } catch (err) {
    console.error("[deleteBeneficiaryDocumentTypeAction]", err)
    return { success: false, error: "Suppression impossible." }
  }
}
