import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import { deleteCampuceFranceAttachment as deleteCloudinaryCampuceFranceAttachment } from "@/lib/cloudinary"

import {
  campuceFranceAttachmentDeleteSchema,
} from "@/app/(admin)/administration/_schemas/campuce-france-attachment-delete.schema"

export interface CampuceFranceAttachmentDeleteResult {
  readonly submissionId: string
  readonly publicId: string
  readonly remainingFilesIds: string[]
}

/**
 * Supprime une pièce jointe Campus France : DB (filesIds) + Cloudinary.
 */
export async function deleteCampuceFranceAttachment(
  rawInput: unknown,
): Promise<CampuceFranceAttachmentDeleteResult> {
  await requireAdministrationDashboard()

  const input = campuceFranceAttachmentDeleteSchema.parse(rawInput)

  const existing = await prisma.campuceFranceStudentSubmission.findUnique({
    where: { id: input.submissionId },
    select: { filesIds: true },
  })

  if (!existing) {
    throw new Error("NOT_FOUND")
  }

  const nextFiles = existing.filesIds.filter((id) => id !== input.publicId)

  await prisma.campuceFranceStudentSubmission.update({
    where: { id: input.submissionId },
    data: { filesIds: { set: nextFiles } },
  })

  await deleteCloudinaryCampuceFranceAttachment(input.publicId)

  return {
    submissionId: input.submissionId,
    publicId: input.publicId,
    remainingFilesIds: nextFiles,
  }
}

