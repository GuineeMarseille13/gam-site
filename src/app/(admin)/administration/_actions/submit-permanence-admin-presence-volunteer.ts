"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import { getPersonIdForAuthUserId } from "@/helpers/get-person-id-for-auth-user"
import { submitPermanenceAdminPresenceVolunteerSchema } from "../_schemas/permanence-admin-presence-volunteer.schema"

export type SubmitPermanenceAdminPresenceVolunteerResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/**
 * Enregistre une ligne de présence à la permanence administrative (remplace le Google Form).
 */
export async function submitPermanenceAdminPresenceVolunteer(
  raw: unknown,
): Promise<SubmitPermanenceAdminPresenceVolunteerResult> {
  let session
  try {
    session = await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = submitPermanenceAdminPresenceVolunteerSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { permanenceDate, memberFullName, hours, comment } = parsed.data
  const dateOnly = new Date(`${permanenceDate}T12:00:00.000Z`)
  const submittedByPersonId = await getPersonIdForAuthUserId(session.user.id)

  try {
    await prisma.permanenceAdminPresenceVolunteer.create({
      data: {
        permanenceDate: dateOnly,
        memberFullName,
        hours,
        comment: comment ?? null,
        submittedByPersonId,
      },
    })
    revalidatePath("/administration")
    revalidatePath("/administration/permanence-administrative")
    return { success: true }
  } catch (err) {
    console.error("[submitPermanenceAdminPresenceVolunteer]", err)
    return { success: false, error: "Enregistrement impossible. Réessayez." }
  }
}
