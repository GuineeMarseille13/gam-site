import { z } from "zod"

export const AVIS_SOURCE_TYPES = {
  none: "none",
  text: "text",
  image: "image",
} as const

export type AvisSourceType = (typeof AVIS_SOURCE_TYPES)[keyof typeof AVIS_SOURCE_TYPES]

const emptyToNull = (v: string) => (v === "" ? null : v)

/**
 * Données formulaire avis (hors fichiers image), parsées depuis FormData.
 */
export const avisFormFieldsSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Le prénom est obligatoire")
      .max(120, "Le prénom est trop long"),
    lastName: z
      .string()
      .trim()
      .min(1, "Le nom est obligatoire")
      .max(120, "Le nom est trop long"),
    body: z
      .string()
      .trim()
      .min(10, "Le témoignage doit contenir au moins 10 caractères")
      .max(8000, "Le témoignage est trop long"),
    sourceType: z.enum(["none", "text", "image"]),
    sourceLabel: z
      .string()
      .trim()
      .max(80, "Le texte d’origine est trop long")
      .transform(emptyToNull),
    sourceImageUrl: z
      .string()
      .trim()
      .transform(emptyToNull)
      .pipe(
        z.union([
          z.null(),
          z.string().url({ message: "URL du logo invalide" }),
        ]),
      ),
    rating: z.coerce.number().int().min(1).max(5),
    order: z.coerce.number().int().min(0).max(9999),
    isActive: z.boolean(),
    isVerified: z.boolean(),
    avatarUrl: z
      .string()
      .trim()
      .transform(emptyToNull)
      .pipe(
        z.union([
          z.null(),
          z.string().url({ message: "URL d’image invalide" }),
        ]),
      ),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.sourceType === "text" && !data.sourceLabel) {
      ctx.addIssue({
        code: "custom",
        message: "Indiquez le nom de l’origine (ex. Google, Facebook…)",
        path: ["sourceLabel"],
      })
    }
  })

export type AvisFormFields = z.infer<typeof avisFormFieldsSchema>

/**
 * Premier message d’erreur lisible pour l’UI (useActionState).
 */
export function formatAvisFormErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Données invalides"
}

export function parseAvisFormFields(formData: FormData) {
  const sourceTypeRaw = String(formData.get("sourceType") ?? "none")
  const sourceType =
    sourceTypeRaw === "text" || sourceTypeRaw === "image" ? sourceTypeRaw : "none"

  return avisFormFieldsSchema.safeParse({
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    body: String(formData.get("body") ?? ""),
    sourceType,
    sourceLabel: String(formData.get("sourceLabel") ?? ""),
    sourceImageUrl: String(formData.get("sourceImageUrl") ?? ""),
    rating: formData.get("rating"),
    order: formData.get("order"),
    isActive: formData.get("isActive") === "on",
    isVerified: formData.get("isVerified") === "on",
    avatarUrl: String(formData.get("avatarUrl") ?? ""),
  })
}

/**
 * Résout les champs source à persister selon le type choisi.
 */
export function resolveAvisSourceFields(
  sourceType: AvisSourceType,
  sourceLabel: string | null,
  sourceImageUrl: string | null,
) {
  if (sourceType === "text") {
    return { sourceLabel, sourceImageUrl: null }
  }
  if (sourceType === "image") {
    return { sourceLabel, sourceImageUrl }
  }
  return { sourceLabel: null, sourceImageUrl: null }
}
