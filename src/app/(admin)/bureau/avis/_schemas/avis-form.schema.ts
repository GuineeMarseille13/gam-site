import { z } from "zod"

/**
 * Données formulaire avis (hors fichier image), parsées depuis FormData.
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
    roleCode: z.string().trim().min(1, "Choisissez un rôle affiché"),
    body: z
      .string()
      .trim()
      .min(10, "Le témoignage doit contenir au moins 10 caractères")
      .max(8000, "Le témoignage est trop long"),
    country: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform((v) => (v === "" ? null : v)),
    rating: z.coerce.number().int().min(1).max(5),
    order: z.coerce.number().int().min(0).max(9999),
    isActive: z.boolean(),
    isVerified: z.boolean(),
    avatarUrl: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .pipe(
        z.union([
          z.null(),
          z.string().url({ message: "URL d’image invalide" }),
        ]),
      ),
  })
  .strict()

export type AvisFormFields = z.infer<typeof avisFormFieldsSchema>

/**
 * Premier message d’erreur lisible pour l’UI (useActionState).
 */
export function formatAvisFormErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Données invalides"
}

export function parseAvisFormFields(formData: FormData) {
  return avisFormFieldsSchema.safeParse({
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    roleCode: String(formData.get("roleCode") ?? ""),
    body: String(formData.get("body") ?? ""),
    country: String(formData.get("country") ?? ""),
    rating: formData.get("rating"),
    order: formData.get("order"),
    isActive: formData.get("isActive") === "on",
    isVerified: formData.get("isVerified") === "on",
    avatarUrl: String(formData.get("avatarUrl") ?? ""),
  })
}
