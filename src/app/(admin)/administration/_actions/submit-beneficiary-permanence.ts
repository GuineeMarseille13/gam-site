"use server"

import { revalidatePath } from "next/cache"

import type { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import { getAdministrativePermanenceSlots } from "@/lib/administrative-permanence/queries"
import { buildSubmitBeneficiaryPermanenceSchema } from "../_schemas/beneficiary-permanence.schema"

export type SubmitBeneficiaryPermanenceResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/**
 * Enregistre une fiche Demande bénéficiaire (permanence administrative).
 */
export async function submitBeneficiaryPermanence(
  raw: unknown,
): Promise<SubmitBeneficiaryPermanenceResult> {
  let session
  try {
    session = await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const [activeTypes, activeDocTypes, slots] = await Promise.all([
    prisma.beneficiaryDemandType.findMany({
      where: { isActive: true },
      select: { id: true, requiresDetail: true },
    }),
    prisma.beneficiaryDocumentType.findMany({
      where: { isActive: true },
      select: { code: true, requiresOtherDetail: true },
    }),
    getAdministrativePermanenceSlots(),
  ])

  if (activeTypes.length === 0) {
    return {
      success: false,
      error:
        "Aucun type de demande actif. Configurez-en au moins un dans Paramètres de la demande bénéficiaire.",
    }
  }

  const docValidation = activeDocTypes.map((row) => ({
    code: row.code,
    requiresOtherDetail: row.requiresOtherDetail,
  }))

  const allowedPermanenceDates = new Set(slots.map((s) => s.date))
  const schema = buildSubmitBeneficiaryPermanenceSchema(
    activeTypes,
    docValidation,
    allowedPermanenceDates,
  )
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const d = parsed.data
  const dateOnly = new Date(`${d.permanenceDate}T12:00:00.000Z`)
  const birthOnly = new Date(`${d.birthDate}T12:00:00.000Z`)

  const idsOk = await prisma.beneficiaryDemandType.findMany({
    where: { id: { in: d.requestTypeIds }, isActive: true },
    select: { id: true },
  })
  if (idsOk.length !== d.requestTypeIds.length) {
    return { success: false, error: "Un ou plusieurs types de demande sont invalides ou désactivés." }
  }

  const docCodes = new Set(activeDocTypes.map((t) => t.code))
  if (d.documentKeys.some((k) => !docCodes.has(k))) {
    return {
      success: false,
      error: "Un ou plusieurs documents fournis sont invalides ou désactivés. Rafraîchissez la page.",
    }
  }

  const detailTrimmed = d.requestDetail?.trim()
  const requestDetail =
    detailTrimmed && detailTrimmed.length > 0 ? detailTrimmed : null

  const documentsProvided = d.documentKeys as unknown as Prisma.InputJsonValue

  const needsDocOtherDetail = d.documentKeys.some((code) =>
    activeDocTypes.some((t) => t.code === code && t.requiresOtherDetail),
  )
  const documentOtherDetail = needsDocOtherDetail ? (d.documentOtherDetail?.trim() ?? null) : null

  const paymentOtherDetail =
    d.paymentResponsible === "OTHER" ? (d.paymentOtherDetail?.trim() ?? null) : null

  try {
    await prisma.beneficiary.create({
      data: {
        permanenceDate: dateOnly,
        demandTypes: { connect: d.requestTypeIds.map((id) => ({ id })) },
        requestDetail,
        firstName: d.firstName,
        lastName: d.lastName,
        phone: d.phone,
        email: d.email ?? null,
        notes: d.notes ?? null,
        birthDate: birthOnly,
        birthCountry: d.birthCountry ?? null,
        birthMunicipality: d.birthMunicipality,
        fatherName: d.fatherName ?? null,
        motherName: d.motherName ?? null,
        gmailAccount: d.gmailAccount ?? null,
        gmailPassword: d.gmailPassword ?? null,
        ekadiLogin: d.ekadiLogin ?? null,
        ekadiPassword: d.ekadiPassword ?? null,
        documentsProvided,
        documentOtherDetail,
        requestStatus: d.requestStatus,
        statusComment: d.statusComment ?? null,
        assignedResponsibleName: d.assignedResponsibleName,
        paymentResponsible: d.paymentResponsible,
        paymentOtherDetail,
        submittedByUserId: session.user.id,
      },
    })
    revalidatePath("/administration")
    revalidatePath("/administration/demande-beneficiaire")
    revalidatePath("/administration/suivi-demande")
    return { success: true }
  } catch (err) {
    console.error("[submitBeneficiaryPermanence]", err)
    return { success: false, error: "Enregistrement impossible. Réessayez." }
  }
}
