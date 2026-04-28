"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { isAdministrationDashboardRole } from "@/helpers/dashboard-roles"

import {
  campuceFranceSubmissionTrackingSchema,
  type CampuceFranceSubmissionTrackingInput,
} from "@/app/(admin)/administration/_schemas/campuce-france-submission-tracking.schema"
import { updateCampuceFranceSubmissionTracking } from "@/app/(admin)/administration/_services/update-campuce-france-submission-tracking"

export type UpdateCampuceFranceSubmissionTrackingResult =
  | { success: true; data: CampuceFranceSubmissionTrackingInput }
  | { success: false; error: string }

/**
 * Server Action: mise à jour du suivi d’un dépôt Campus France (Administration).
 */
export async function updateCampuceFranceSubmissionTrackingAction(
  rawInput: unknown,
): Promise<UpdateCampuceFranceSubmissionTrackingResult> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isAdministrationDashboardRole(session.user.role)) {
    return { success: false, error: "FORBIDDEN" }
  }

  const parsed = campuceFranceSubmissionTrackingSchema.safeParse(rawInput)
  if (!parsed.success) {
    return { success: false, error: "INVALID_INPUT" }
  }

  try {
    const data = await updateCampuceFranceSubmissionTracking(parsed.data)
    revalidatePath("/administration/campus-france-depots")
    return { success: true, data }
  } catch {
    return { success: false, error: "SERVER_ERROR" }
  }
}

