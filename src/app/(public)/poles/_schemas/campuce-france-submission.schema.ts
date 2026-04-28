import { z } from "zod"

export const CAMPUCE_MAX_FILES = 3
export const CAMPUCE_MAX_FILE_BYTES = 5 * 1024 * 1024

export const CAMPUCE_HELP_TYPES = {
  hosting_attestation: "hosting_attestation",
  housing: "housing",
} as const

export type CampuceHelpType =
  typeof CAMPUCE_HELP_TYPES[keyof typeof CAMPUCE_HELP_TYPES]

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const

export const campuceFranceSubmissionSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est requis").max(120),
    lastName: z.string().trim().min(1, "Le nom est requis").max(120),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "L’email est requis")
      .email("Email invalide")
      .max(254),
    phone: z.string().trim().min(8, "Numéro de téléphone trop court").max(30),
    country: z.string().trim().min(1, "Le pays est requis").max(120),
    acceptanceCity: z
      .string()
      .trim()
      .min(1, "La ville d’acceptation est requise")
      .max(160),
    universitySite: z
      .string()
      .trim()
      .min(1, "Le site universitaire est requis")
      .max(160),
    academicLevel: z.string().trim().min(1, "Le niveau est requis").max(80),
    program: z
      .string()
      .trim()
      .min(1, "Le parcours / formation est requis")
      .max(200),
    helpType: z.enum(
      [CAMPUCE_HELP_TYPES.hosting_attestation, CAMPUCE_HELP_TYPES.housing],
      {
      message: "Le type d’aide sollicité est requis",
      },
    ),
    visaAppointmentDate: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || !Number.isNaN(Date.parse(value)),
        "Date de rendez-vous invalide",
      ),
    comment: z.string().trim().max(2000).optional(),
    /** Honeypot anti-bot — doit rester vide. */
    website: z.string().optional(),
    files: z.array(z.instanceof(File)),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.helpType === CAMPUCE_HELP_TYPES.housing && data.files.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Les fichiers ne sont acceptés que pour une demande d’attestation d’hébergement.",
        path: ["files"],
      })
      return
    }
    if (data.files.length > CAMPUCE_MAX_FILES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Vous pouvez joindre au maximum ${CAMPUCE_MAX_FILES} fichiers.`,
        path: ["files"],
      })
    }
    for (const file of data.files) {
      if (file.size > CAMPUCE_MAX_FILE_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Chaque fichier doit faire au plus 5 Mo.",
          path: ["files"],
        })
        break
      }
      if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Formats acceptés : PDF, JPEG, PNG ou WebP.",
          path: ["files"],
        })
        break
      }
    }
  })

export type CampuceFranceSubmissionInput = z.infer<
  typeof campuceFranceSubmissionSchema
>

function formDataGetString(formData: FormData, key: string): string {
  const v = formData.get(key)
  if (typeof v === "string") return v
  return ""
}

/**
 * Valide les données du formulaire Campus France depuis un FormData (Server Action).
 */
export function parseCampuceFranceFormData(formData: FormData) {
  const files = formData
    .getAll("files")
    .filter((x): x is File => x instanceof File)

  return campuceFranceSubmissionSchema.safeParse({
    firstName: formDataGetString(formData, "firstName"),
    lastName: formDataGetString(formData, "lastName"),
    email: formDataGetString(formData, "email"),
    phone: formDataGetString(formData, "phone"),
    country: formDataGetString(formData, "country"),
    acceptanceCity: formDataGetString(formData, "acceptanceCity"),
    universitySite: formDataGetString(formData, "universitySite"),
    academicLevel: formDataGetString(formData, "academicLevel"),
    program: formDataGetString(formData, "program"),
    helpType: formDataGetString(formData, "helpType"),
    visaAppointmentDate: formDataGetString(formData, "visaAppointmentDate"),
    comment: formDataGetString(formData, "comment"),
    website: formDataGetString(formData, "website"),
    files,
  })
}

export function campuceFranceFirstErrorMessage(
  issue: z.ZodIssue | undefined,
): string {
  return issue?.message ?? "Données invalides."
}
