"use server"

import { prisma } from "@/lib/prisma"
import { uploadCampuceFranceAttachment } from "@/lib/cloudinary"
import {
  CAMPUCE_MAX_FILES,
  CAMPUCE_HELP_TYPES,
  campuceFranceFirstErrorMessage,
  parseCampuceFranceFormData,
} from "@/app/(public)/poles/_schemas/campuce-france-submission.schema"

export type CampuceFranceFormState =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string }

/**
 * Enregistre une demande étudiant Campus France + pièces jointes Cloudinary.
 */
export async function submitCampuceFranceStudentApplication(
  _prevState: CampuceFranceFormState,
  formData: FormData,
): Promise<CampuceFranceFormState> {
  const parsed = parseCampuceFranceFormData(formData)

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return {
      kind: "error",
      message: campuceFranceFirstErrorMessage(first),
    }
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    country,
    acceptanceCity,
    universitySite,
    academicLevel,
    program,
    helpType,
    visaAppointmentDate,
    comment,
    files,
    website,
  } = parsed.data

  if (website?.trim()) {
    return { kind: "success" }
  }

  const submissionYear = new Date().getFullYear()

  const publicIds: string[] = []

  try {
    const existing = await prisma.campuceFranceStudentSubmission.findUnique({
      where: {
        submissionYear_phone_email: {
          submissionYear,
          phone,
          email,
        },
      },
    })

    const shouldUploadFiles = helpType === CAMPUCE_HELP_TYPES.hosting_attestation
    const filesToUpload = shouldUploadFiles ? files : []

    if (shouldUploadFiles) {
      const existingCount = existing?.filesIds.length ?? 0
      const remainingSlots = Math.max(0, CAMPUCE_MAX_FILES - existingCount)
      if (filesToUpload.length > remainingSlots) {
        return {
          kind: "error",
          message:
            remainingSlots === 0
              ? `Vous avez déjà envoyé les ${CAMPUCE_MAX_FILES} documents autorisés pour cette année.`
              : `Vous avez déjà envoyé ${existingCount} document(s) cette année. Vous pouvez encore envoyer ${remainingSlots} document(s).`,
        }
      }
    }

    for (const file of filesToUpload) {
      const { publicId } = await uploadCampuceFranceAttachment(file)
      publicIds.push(publicId)
    }

    const visaDate = visaAppointmentDate?.trim()
      ? new Date(visaAppointmentDate)
      : null

    if (existing) {
      const nextHelpTypes = Array.from(
        new Set([...(existing.helpTypes ?? []), helpType]),
      )
      await prisma.campuceFranceStudentSubmission.update({
        where: { id: existing.id },
        data: {
          firstName,
          lastName,
          phone,
          email,
          country,
          acceptanceCity,
          universitySite,
          academicLevel,
          program,
          helpTypes: nextHelpTypes,
          visaAppointmentDate: visaDate,
          comment: comment?.trim() ? comment : null,
          filesIds: shouldUploadFiles
            ? [...existing.filesIds, ...publicIds]
            : existing.filesIds,
        },
      })
    } else {
      await prisma.campuceFranceStudentSubmission.create({
        data: {
          firstName,
          lastName,
          phone,
          email,
          submissionYear,
          country,
          acceptanceCity,
          universitySite,
          academicLevel,
          program,
          helpTypes: [helpType],
          visaAppointmentDate: visaDate,
          comment: comment?.trim() ? comment : null,
          filesIds: publicIds,
        },
      })
    }

    return { kind: "success" }
  } catch (error: unknown) {
    const msg =
      error instanceof Error && error.message === "FORMAT_FICHIER"
        ? "Format de fichier non accepté."
        : "Une erreur est survenue. Réessayez dans quelques instants."

    return { kind: "error", message: msg }
  }
}
