"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { isAdministrationDashboardRole } from "@/helpers/dashboard-roles"

import {
  campuceFranceAttachmentDeleteSchema,
} from "@/app/(admin)/administration/_schemas/campuce-france-attachment-delete.schema"
import { deleteCampuceFranceAttachment } from "@/app/(admin)/administration/_services/delete-campuce-france-attachment"

export type DeleteCampuceFranceAttachmentResult =
  | { success: true; data: { submissionId: string; publicId: string } }
  | { success: false; error: string }

/**
 * Server Action: suppression d'une pièce jointe Campus France (Administration).
 */
export async function deleteCampuceFranceAttachmentAction(
  rawInput: unknown,
): Promise<DeleteCampuceFranceAttachmentResult> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isAdministrationDashboardRole(session.user.role)) {
    return { success: false, error: "FORBIDDEN" }
  }

  const parsed = campuceFranceAttachmentDeleteSchema.safeParse(rawInput)
  if (!parsed.success) {
    return { success: false, error: "INVALID_INPUT" }
  }

  try {
    const result = await deleteCampuceFranceAttachment(parsed.data)
    revalidatePath("/administration/campus-france-depots")
    return {
      success: true,
      data: { submissionId: result.submissionId, publicId: result.publicId },
    }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "SERVER_ERROR",
    }
  }
}

